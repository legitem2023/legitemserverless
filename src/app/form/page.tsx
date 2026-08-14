// app/page.tsx
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ReusableTabs, TabPanel } from './components/ReusableTabs';
import SafetyBackground from "./SafetyBackground";
import { 
  Printer, 
  Users, 
  FileText, 
  CalendarCheck, 
  ListChecks,
  Search,
  UserCog,
  Import
} from 'lucide-react';
import ScanRecommendationLetter from './ScanRecommendationLetter';
import AttendanceSheet from './AttendanceSheet';
import ScanMasterlist from './ScanMasterlist';
import { PrintableSuguan } from './PrintableSuguan';
import { LSOsuguan } from './LSOsuguan';

import dynamic from 'next/dynamic';

// Dynamically import MemberManagement with SSR disabled to prevent hydration issues
const MemberManagement = dynamic(
  () => import('../components/MemberManagement').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Member Management...</p>
        </div>
      </div>
    )
  }
);

// Types
interface Schedule {
  date: string;
  day: string;
  time: string;
  service?: 'PNK' | 'worship' | 'Distrito';
}

interface Member {
  name: string;
  kapisanan: string;
  kahilingan: string;
  callSign: string;
  function: string | string[];
  picture: string;
  schedules: Schedule[];
}

interface GroupedSchedule {
  date: string;
  day: string;
  time: string;
  service: string;
  members: Member[];
}

// Helper functions
function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + 1;
  return new Date(d.setDate(diff));
}

const filipinoDays: Record<string, string> = {
  sunday: 'Linggo',
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miyerkules',
  thursday: 'Huwebes',
  friday: 'Biyernes',
  saturday: 'Sabado',
};

const dayOrder: Record<string, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

function timeToMinutes(time: string): number {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (match) {
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toUpperCase();
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  }
  return 0;
}

const dayOffsets: Record<string, number> = {
  sunday: 6,
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
};

function getAlignedDate(dayName: string) {
  const weekStart = getWeekStart(new Date());
  const offset = dayOffsets[dayName.toLowerCase()] ?? 0;
  const result = new Date(weekStart);
  result.setDate(weekStart.getDate() + offset);
  return result;
}

// Define the category type to match ScanMasterlist expected props
type CategoryType = "Emergency First Responder (EFR)" | "Communicators" | "Associate Members (Approved)" | "Associate Members (Not Approved)";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('crud');
  const [data, setData] = useState<{ members: Member[] }>({ members: [] });
  const [editingMember, setEditingMember] = useState<{ index: number; member: Member } | null>(null);
  const [newMember, setNewMember] = useState<Member>({
    name: '',
    kapisanan:'',
    kahilingan:'',
    callSign: '',
    function: '',
    picture: '',
    schedules: [{ date: '', day: '', time: '', service: 'worship' }]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [importedLSOData, setImportedLSOData] = useState<GroupedSchedule[]>([]);

  // Define tabs configuration - ADDED "Import LSO" tab
  const tabs = [
    { id: 'crud', label: 'Manage Members', icon: Users },
    { id: 'member-mgmt', label: 'Member Management', icon: UserCog },
    { id: 'print', label: 'Print Suguan', icon: Printer },
    { id: 'import-lso', label: 'Import LSO', icon: Import },
    { id: 'letter', label: 'Recommendation Letter', icon: FileText },
    { id: 'attendance', label: 'Attendance Sheet', icon: CalendarCheck },
    { id: 'masterlist', label: 'Masterlist', icon: ListChecks },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/members');
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Process data for LSOsuguan display (same logic as PrintableSuguan)
  useEffect(() => {
    const groupedSchedules: { [key: string]: GroupedSchedule } = {};

    data.members.forEach((member) => {
      member.schedules.forEach((schedule) => {
        if (schedule.day && schedule.time) {
          const serviceType = schedule.service || 'worship';
          let computedDate = getAlignedDate(schedule.day);
          
          if (serviceType === 'Distrito') {
            const newDate = new Date(computedDate);
            newDate.setDate(computedDate.getDate() + 7);
            computedDate = newDate;
          }

          const key = `${computedDate.toISOString().split('T')[0]}-${schedule.time}-${serviceType}`;

          if (!groupedSchedules[key]) {
            groupedSchedules[key] = {
              date: computedDate.toISOString(),
              day: schedule.day,
              time: schedule.time,
              service: serviceType,
              members: [],
            };
          }

          groupedSchedules[key].members.push(member);
        }
      });
    });

    const sortedSchedules = Object.values(groupedSchedules).sort((a, b) => {
      const dayA = dayOrder[a.day.toLowerCase()] ?? 999;
      const dayB = dayOrder[b.day.toLowerCase()] ?? 999;
      
      if (dayA !== dayB) {
        return dayA - dayB;
      }
      
      const timeA = timeToMinutes(a.time);
      const timeB = timeToMinutes(b.time);
      
      return timeA - timeB;
    });

    setImportedLSOData(sortedSchedules);
  }, [data.members]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const addMember = async () => {
    if (!newMember.name || !newMember.callSign) {
      setError('Please fill in name and call sign');
      return;
    }
    
    const memberToAdd = {
      ...newMember,
      schedules: newMember.schedules.filter(s => s.day && s.time)
    };
    
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberToAdd)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setData({ members: result.members });
        setNewMember({
          name: '',
          kapisanan:'',
          kahilingan:'',
          callSign: '',
          function: '',
          picture: '',
          schedules: [{ date: '', day: '', time: '', service: 'worship' }]
        });
        setSuccess('Member added successfully!');
      } else {
        setError(result.error || 'Failed to add member');
      }
    } catch (err) {
      setError('Error adding member');
      console.error(err);
    }
  };

  const updateMember = async () => {
    if (!editingMember) return;
    
    if (!editingMember.member.name || !editingMember.member.callSign) {
      setError('Please fill in name and call sign');
      return;
    }
    
    try {
      const response = await fetch('/api/members', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          index: editingMember.index,
          member: editingMember.member
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setData({ members: result.members });
        setEditingMember(null);
        setSuccess('Member updated successfully!');
      } else {
        setError(result.error || 'Failed to update member');
      }
    } catch (err) {
      setError('Error updating member');
      console.error(err);
    }
  };

  const deleteMember = async (index: number) => {
    if (confirm('Are you sure you want to delete this member?')) {
      try {
        const response = await fetch('/api/members', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ index })
        });
        
        const result = await response.json();
        
        if (response.ok) {
          setData({ members: result.members });
          setSuccess('Member deleted successfully!');
        } else {
          setError(result.error || 'Failed to delete member');
        }
      } catch (err) {
        setError('Error deleting member');
        console.error(err);
      }
    }
  };

  // Group schedules for printing
  const groupedSchedules: { [key: string]: GroupedSchedule } = {};

  data.members.forEach((member) => {
    member.schedules.forEach((schedule) => {
      if (schedule.day && schedule.time) {
        const serviceType = schedule.service || 'worship';
        let computedDate = getAlignedDate(schedule.day);
        
        if (serviceType === 'Distrito') {
          const newDate = new Date(computedDate);
          newDate.setDate(computedDate.getDate() + 7);
          computedDate = newDate;
        }

        const key = `${computedDate.toISOString().split('T')[0]}-${schedule.time}-${serviceType}`;

        if (!groupedSchedules[key]) {
          groupedSchedules[key] = {
            date: computedDate.toISOString(),
            day: schedule.day,
            time: schedule.time,
            service: serviceType,
            members: [],
          };
        }

        groupedSchedules[key].members.push(member);
      }
    });
  });

  const sortedSchedules = Object.values(groupedSchedules).sort((a, b) => {
    const dayA = dayOrder[a.day.toLowerCase()] ?? 999;
    const dayB = dayOrder[b.day.toLowerCase()] ?? 999;
    
    if (dayA !== dayB) {
      return dayA - dayB;
    }
    
    const timeA = timeToMinutes(a.time);
    const timeB = timeToMinutes(b.time);
    
    return timeA - timeB;
  });

  const form1 = sortedSchedules.filter(
    (s) =>
      (s.day.toLowerCase() === 'wednesday' || s.day.toLowerCase() === 'thursday') &&
      s.service === 'worship'
  );

  const form2 = sortedSchedules.filter(
    (s) =>
      (s.day.toLowerCase() === 'saturday' || s.day.toLowerCase() === 'sunday') &&
      s.service === 'worship'
  );

  const form3 = sortedSchedules.filter(
    (s) => s.service === 'PNK'
  );

  const form4 = sortedSchedules.filter(
    (s) => s.service === 'Distrito'
  );

  const forms = [form1, form2, form3, form4];

  const attendees = data.members
    .filter(member => member.kahilingan === "true")
    .map(member => ({
      name: member.name,
      signature: '',
      remarks: ''
    }));

  // FIXED: Added 'as const' to make this a readonly tuple with literal types
  const categories = [
    "Emergency First Responder (EFR)",
    "Communicators",
    "Associate Members (Approved)",
    "Associate Members (Not Approved)"
  ] as const;

  // Filter members
  const filteredMembers = data.members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.callSign.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {
    return (
      <div className="bg-gray-300 min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-lg">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-300 min-h-screen py-10 print:bg-white print:p-0 print:m-0 print:min-h-0">
      
      {/* Notifications */}
      {success && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          {success}
          <button onClick={() => setSuccess(null)} className="ml-4 font-bold">×</button>
        </div>
      )}

      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
          {error}
          <button onClick={() => setError(null)} className="ml-4 font-bold">×</button>
        </div>
      )}

      {/* Reusable Tabs Component */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 print:hidden w-auto min-w-[300px]">
        <ReusableTabs 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="pills"
          size="md"
        />
      </div>

      {/* Tab Content */}
      <div className="pt-24">
        {/* Member Management Tab */}
        <TabPanel activeTab={activeTab} tabId="member-mgmt">
          <div className="flex p-5 items-center justify-center">
            <MemberManagement />
          </div>
        </TabPanel>

        {/* CRUD Tab */}
        <TabPanel activeTab={activeTab} tabId="crud">
          <div className="max-w-6xl mx-auto mt-6 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Manage Members</h2>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search members by name or call sign..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Add Member Form */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-3">Add New Member</h3>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Call Sign"
                  value={newMember.callSign}
                  onChange={(e) => setNewMember({ ...newMember, callSign: e.target.value })}
                  className="border p-2 rounded"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mb-3">
                <input
                  type="text"
                  placeholder="Kapisanan"
                  value={newMember.kapisanan}
                  onChange={(e) => setNewMember({ ...newMember, kapisanan: e.target.value })}
                  className="border p-2 rounded"
                />
                <select
                  value={newMember.kahilingan}
                  onChange={(e) => setNewMember({ ...newMember, kahilingan: e.target.value })}
                  className="border p-2 rounded"
                >
                  <option value="">Select Status</option>
                  <option value="true">For Recommendation</option>
                  <option value="false">Not for Recommendation</option>
                </select>
                <input
                  type="text"
                  placeholder="Function"
                  value={typeof newMember.function === 'string' ? newMember.function : newMember.function.join(', ')}
                  onChange={(e) => setNewMember({ ...newMember, function: e.target.value })}
                  className="border p-2 rounded"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Schedules</label>
                {newMember.schedules.map((schedule, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Date"
                      value={schedule.date}
                      onChange={(e) => {
                        const updated = [...newMember.schedules];
                        updated[idx] = { ...updated[idx], date: e.target.value };
                        setNewMember({ ...newMember, schedules: updated });
                      }}
                      className="border p-2 rounded text-sm"
                    />
                    <select
                      value={schedule.day}
                      onChange={(e) => {
                        const updated = [...newMember.schedules];
                        updated[idx] = { ...updated[idx], day: e.target.value };
                        setNewMember({ ...newMember, schedules: updated });
                      }}
                      className="border p-2 rounded text-sm"
                    >
                      <option value="">Select Day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Time (e.g., 8:00 AM)"
                      value={schedule.time}
                      onChange={(e) => {
                        const updated = [...newMember.schedules];
                        updated[idx] = { ...updated[idx], time: e.target.value };
                        setNewMember({ ...newMember, schedules: updated });
                      }}
                      className="border p-2 rounded text-sm"
                    />
                    <select
                      value={schedule.service || 'worship'}
                      onChange={(e) => {
                        const updated = [...newMember.schedules];
                        updated[idx] = { ...updated[idx], service: e.target.value as 'PNK' | 'worship' | 'Distrito' };
                        setNewMember({ ...newMember, schedules: updated });
                      }}
                      className="border p-2 rounded text-sm"
                    >
                      <option value="worship">Worship</option>
                      <option value="PNK">PNK</option>
                      <option value="Distrito">Distrito</option>
                    </select>
                    {newMember.schedules.length > 1 && (
                      <button
                        onClick={() => {
                          const updated = newMember.schedules.filter((_, i) => i !== idx);
                          setNewMember({ ...newMember, schedules: updated });
                        }}
                        className="bg-red-500 text-white px-2 rounded text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setNewMember({
                    ...newMember,
                    schedules: [...newMember.schedules, { date: '', day: '', time: '', service: 'worship' }]
                  })}
                  className="text-blue-600 text-sm mt-1"
                >
                  + Add Schedule
                </button>
              </div>
              <button
                onClick={addMember}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Member
              </button>
            </div>

            {/* Members List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-3">Members List ({filteredMembers.length})</h3>
              {filteredMembers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No members found</p>
              ) : (
                filteredMembers.map((member, idx) => {
                  const originalIndex = data.members.findIndex(m => m.name === member.name && m.callSign === member.callSign);
                  return (
                    <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      {editingMember?.index === originalIndex ? (
                        <div>
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <input
                              type="text"
                              placeholder="Name"
                              value={editingMember.member.name}
                              onChange={(e) => setEditingMember({
                                index: editingMember.index,
                                member: { ...editingMember.member, name: e.target.value }
                              })}
                              className="border p-2 rounded"
                            />
                            <input
                              type="text"
                              placeholder="Call Sign"
                              value={editingMember.member.callSign}
                              onChange={(e) => setEditingMember({
                                index: editingMember.index,
                                member: { ...editingMember.member, callSign: e.target.value }
                              })}
                              className="border p-2 rounded"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <input
                              type="text"
                              placeholder="Kapisanan"
                              value={editingMember.member.kapisanan}
                              onChange={(e) => setEditingMember({
                                index: editingMember.index,
                                member: { ...editingMember.member, kapisanan: e.target.value }
                              })}
                              className="border p-2 rounded"
                            />
                            <select
                              value={editingMember.member.kahilingan}
                              onChange={(e) => setEditingMember({
                                index: editingMember.index,
                                member: { ...editingMember.member, kahilingan: e.target.value }
                              })}
                              className="border p-2 rounded"
                            >
                              <option value="">Select Status</option>
                              <option value="true">For Recommendation</option>
                              <option value="false">Not for Recommendation</option>
                            </select>
                            <input
                              type="text"
                              placeholder="Function"
                              value={typeof editingMember.member.function === 'string' ? editingMember.member.function : editingMember.member.function.join(', ')}
                              onChange={(e) => setEditingMember({
                                index: editingMember.index,
                                member: { ...editingMember.member, function: e.target.value }
                              })}
                              className="border p-2 rounded"
                            />
                          </div>
                          <div className="mb-3">
                            <label className="block text-sm font-medium mb-1">Schedules</label>
                            {editingMember.member.schedules.map((schedule, sIdx) => (
                              <div key={sIdx} className="grid grid-cols-4 gap-2 mb-2">
                                <input
                                  type="text"
                                  placeholder="Date"
                                  value={schedule.date}
                                  onChange={(e) => {
                                    const updatedSchedules = [...editingMember.member.schedules];
                                    updatedSchedules[sIdx] = { ...updatedSchedules[sIdx], date: e.target.value };
                                    setEditingMember({
                                      index: editingMember.index,
                                      member: { ...editingMember.member, schedules: updatedSchedules }
                                    });
                                  }}
                                  className="border p-2 rounded text-sm"
                                />
                                <select
                                  value={schedule.day}
                                  onChange={(e) => {
                                    const updatedSchedules = [...editingMember.member.schedules];
                                    updatedSchedules[sIdx] = { ...updatedSchedules[sIdx], day: e.target.value };
                                    setEditingMember({
                                      index: editingMember.index,
                                      member: { ...editingMember.member, schedules: updatedSchedules }
                                    });
                                  }}
                                  className="border p-2 rounded text-sm"
                                >
                                  <option value="">Select Day</option>
                                  <option value="Monday">Monday</option>
                                  <option value="Tuesday">Tuesday</option>
                                  <option value="Wednesday">Wednesday</option>
                                  <option value="Thursday">Thursday</option>
                                  <option value="Friday">Friday</option>
                                  <option value="Saturday">Saturday</option>
                                  <option value="Sunday">Sunday</option>
                                </select>
                                <input
                                  type="text"
                                  placeholder="Time (e.g., 8:00 AM)"
                                  value={schedule.time}
                                  onChange={(e) => {
                                    const updatedSchedules = [...editingMember.member.schedules];
                                    updatedSchedules[sIdx] = { ...updatedSchedules[sIdx], time: e.target.value };
                                    setEditingMember({
                                      index: editingMember.index,
                                      member: { ...editingMember.member, schedules: updatedSchedules }
                                    });
                                  }}
                                  className="border p-2 rounded text-sm"
                                />
                                <select
                                  value={schedule.service || 'worship'}
                                  onChange={(e) => {
                                    const updatedSchedules = [...editingMember.member.schedules];
                                    updatedSchedules[sIdx] = { ...updatedSchedules[sIdx], service: e.target.value as 'PNK' | 'worship' | 'Distrito' };
                                    setEditingMember({
                                      index: editingMember.index,
                                      member: { ...editingMember.member, schedules: updatedSchedules }
                                    });
                                  }}
                                  className="border p-2 rounded text-sm"
                                >
                                  <option value="worship">Worship</option>
                                  <option value="PNK">PNK</option>
                                  <option value="Distrito">Distrito</option>
                                </select>
                                {editingMember.member.schedules.length > 1 && (
                                  <button
                                    onClick={() => {
                                      const updatedSchedules = editingMember.member.schedules.filter((_, i) => i !== sIdx);
                                      setEditingMember({
                                        index: editingMember.index,
                                        member: { ...editingMember.member, schedules: updatedSchedules }
                                      });
                                    }}
                                    className="bg-red-500 text-white px-2 rounded text-xs hover:bg-red-600"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              onClick={() => setEditingMember({
                                index: editingMember.index,
                                member: {
                                  ...editingMember.member,
                                  schedules: [...editingMember.member.schedules, { date: '', day: '', time: '', service: 'worship' }]
                                }
                              })}
                              className="text-blue-600 text-sm mt-1 hover:text-blue-800"
                            >
                              + Add Schedule
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={updateMember}
                              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={() => setEditingMember(null)}
                              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-lg">{member.name}</h4>
                              <p className="text-gray-600">Call Sign: {member.callSign}</p>
                              <p className="text-gray-600 text-sm">Kapisanan: {member.kapisanan || 'N/A'}</p>
                              <p className="text-gray-600 text-sm">
                                Status: {member.kahilingan === "true" ? "For Recommendation" : "Not for Recommendation"}
                              </p>
                              <p className="text-gray-600 text-sm">
                                Function: {typeof member.function === 'string' ? member.function : member.function?.join(', ') || 'N/A'}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingMember({ 
                                  index: originalIndex, 
                                  member: JSON.parse(JSON.stringify(member)) 
                                })}
                                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteMember(originalIndex)}
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">Schedules:</p>
                            {member.schedules.length === 0 || (member.schedules.length === 1 && !member.schedules[0].day && !member.schedules[0].time) ? (
                              <p className="text-sm text-gray-500 italic">No schedules assigned</p>
                            ) : (
                              <ul className="list-disc list-inside text-sm mt-1">
                                {member.schedules.map((schedule, sIdx) => (
                                  schedule.day && schedule.time && (
                                    <li key={sIdx} className="text-gray-600">
                                      {schedule.day} at {schedule.time} ({schedule.service || 'worship'})
                                    </li>
                                  )
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </TabPanel>

        {/* Print Tab */}
        <TabPanel activeTab={activeTab} tabId="print">
          {/* Print Button */}
          {activeTab === 'print' && (
            <div className="print:hidden z-50">
              <button
                onClick={() => window.print()}
                className="bg-black text-white px-4 py-2 text-sm rounded shadow"
              >
                Print
              </button>
            </div>
          )}
          <PrintableSuguan forms={forms} filipinoDays={filipinoDays} />
        </TabPanel>

        {/* Import LSO Tab - NEW */}
        <TabPanel activeTab={activeTab} tabId="import-lso">
          <div className="max-w-6xl mx-auto mt-6 p-6 bg-white rounded-lg shadow-lg">
            
            
            {/* Display LSOsuguan with the same data */}
            <LSOsuguan 
              forms={forms} 
              filipinoDays={filipinoDays} 
            />
            

          </div>
        </TabPanel>

        {/* Letter Tab */}
        <TabPanel activeTab={activeTab} tabId="letter">
          <div className="flex p-5 items-center justify-center">
            <ScanRecommendationLetter 
              date={new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              districtMinister="Alfonso O. Rico"
              local="Kadalagahan"
              district="Rizal"
              members={data.members.filter((data)=> data.kahilingan === "true").map(member => ({
                name: member.name,
                kapisanan: member.kapisanan,
                recruitedBy: ""
              }))}
            />
          </div>
        </TabPanel>

        {/* Attendance Tab */}
        <TabPanel activeTab={activeTab} tabId="attendance">
          <div className="flex p-5 items-center justify-center">
            <AttendanceSheet
              local="Kadalagahan"
              district="Rizal"
              venue="CFO Office (Lokal)"
              date={new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              time="8:00 PM"
              attendees={attendees}
              seminarLeaders={{
                secretary: "Justine Jacob Rodriguez",
                president: "Federico Hernandez",
                overseer: "MARIANO M. LEBARDO JR."
              }}
              maxAttendees={30}
            />
          </div>
        </TabPanel>

        {/* Masterlist Tab - FIXED: Added type assertion */}
        <TabPanel activeTab={activeTab} tabId="masterlist">
          <div className="flex p-5 flex-col">
            {categories.map((category) => {
              const filteredMembers = data.members.filter((m: any) => m.function === category);
              return filteredMembers.length > 0 ? (
                <ScanMasterlist
                  key={category}
                  district="Rizal"
                  category={category as CategoryType}
                  members={filteredMembers.filter((data:any) => data.schedules && data.schedules.length > 0)}
                />
              ) : null;
            })}
          </div>
        </TabPanel>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        * {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        
        @page {
          size: A4;
          margin: 0mm;
        }

        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            width: 100%;
            height: auto !important;
            min-height: auto !important;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:page-break-after-always {
            page-break-after: always;
          }
          
          .print\\:m-0 {
            margin: 0 !important;
          }
          
          .print\\:p-0 {
            padding: 0 !important;
          }
          
          .print\\:bg-white {
            background: white !important;
          }
          
          .print\\:pt-0 {
            padding-top: 0 !important;
          }
          
          .print\\:mt-0 {
            margin-top: 0 !important;
          }
          
          .print\\:block {
            display: block !important;
          }
          
          /* Remove any flex centering */
          .min-h-screen {
            min-height: auto !important;
          }
          
          .flex, .items-center, .justify-center {
            display: block !important;
            align-items: normal !important;
            justify-content: normal !important;
          }
          
          table {
            page-break-inside: avoid;
          }
          
          /* Ensure content starts at top */
          div, section, article {
            break-inside: avoid;
          }
          
          /* Remove any automatic margins */
          * {
            margin-top: 0 !important;
          }
          
          /* First element should be at top */
          body > div:first-child {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
        }
      `}</style>
    </div>
  );
                                                         }
