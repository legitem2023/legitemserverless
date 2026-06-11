'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import ScanRecommendationLetter from './ScanRecommendationLetter';
import AttendanceSheet from './AttendanceSheet';
import ScanMasterlist from './ScanMasterlist';

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

export default function Home() {
  const [activeTab, setActiveTab] = useState<'print' | 'crud' | 'letter' | 'attendance' | 'masterlist'>('crud');
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

const categories: Array<"Communicators" | "Emergency First Responder (EFR)" | "Associate Members (Approved)" | "Associate Members (Not Approved)"> = [
  "Emergency First Responder (EFR)",
  "Communicators",
  "Associate Members (Approved)",
  "Associate Members (Not Approved)"
];

  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Toast Notifications */}
      {success && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-3 animate-in slide-in-from-top duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="ml-4 hover:opacity-75">×</button>
        </div>
      )}

      {error && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-3 animate-in slide-in-from-top duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-4 hover:opacity-75">×</button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center space-x-1 py-3">
            {[
              { id: 'print', label: 'Print View', icon: '🖨️' },
              { id: 'crud', label: 'Manage Members', icon: '👥' },
              { id: 'letter', label: 'Recommendation Letter', icon: '📄' },
              { id: 'attendance', label: 'Attendance Sheet', icon: '📝' },
              { id: 'masterlist', label: 'Masterlist', icon: '📋' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Print Button */}
      {activeTab === 'print' && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Schedules</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="pt-20 pb-8">
        {activeTab === 'print' && (
          <div className="flex flex-col items-center gap-8 p-8">
            {forms.map((formSchedules, formIndex) => (
              <div
                key={formIndex}
                className="bg-white w-[210mm] min-h-[297mm] shadow-2xl rounded-lg print:shadow-none print:rounded-none text-black overflow-hidden"
              >
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="w-[100px]">
                    <Image
                      src="/images.png"
                      alt="Logo"
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                  </div>

                  <div className="text-center flex-1">
                    <h1 className="font-bold text-lg uppercase tracking-wide">SCAN INTERNATIONAL</h1>
                    <h2 className="font-semibold text-md uppercase">DISTRITO NG RIZAL</h2>
                    <h3 className="text-sm uppercase text-gray-600">LOKAL NG KADALAGAHAN</h3>
                    <p className="text-xs uppercase text-blue-600 font-medium mt-1">
                      {formIndex === 2 ? 'SUGUAN NG SCAN SA PNK' : 
                       formIndex === 3 ? 'SUGUAN NG PAGBABANTAY SA DISTRITO' : 
                       'SUGUAN NG SCAN SA PAGSAMBA'}
                    </p>
                  </div>

                  <div className="w-[60px]" />
                </div>

                <div className="p-6 space-y-8">
                  {formSchedules.map((schedule, idx) => {
                    const dateObj = new Date(schedule.date);
                    const filipinoDay = filipinoDays[schedule.day.toLowerCase()] || schedule.day;

                    return (
                      <div key={idx} className="break-inside-avoid">
                        <table className="w-full border-collapse border border-gray-800 text-sm">
                          <thead>
                            <tr className="bg-gray-50">
                              <th colSpan={5} className="border border-gray-800 px-3 py-2 text-left font-semibold">
                                Petsa: {dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </th>
                              <th colSpan={2} className="border border-gray-800 px-3 py-2 text-left font-semibold">
                                Araw: {filipinoDay}
                              </th>
                              <th colSpan={2} className="border border-gray-800 px-3 py-2 text-left font-semibold">
                                Oras: {schedule.time}
                              </th>
                            </tr>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-800 px-2 py-2 text-center w-12">#</th>
                              <th colSpan={4} className="border border-gray-800 px-3 py-2 text-left">Pangalan</th>
                              <th className="border border-gray-800 px-2 py-2 text-center">Call-Sign</th>
                              <th className="border border-gray-800 px-2 py-2 text-center">Lagda Pagtanggap</th>
                              <th className="border border-gray-800 px-2 py-2 text-center">Lagda Pagtupad</th>
                              <th className="border border-gray-800 px-2 py-2 text-center">Gampanin</th>
                            </tr>
                          </thead>
                          <tbody>
                            {schedule.members.map((member, i) => (
                              <tr key={i} className="hover:bg-gray-50">
                                <td className="border border-gray-800 text-center py-2">{i + 1}</td>
                                <td colSpan={4} className="border border-gray-800 px-3 py-2">{member.name}</td>
                                <td className="border border-gray-800 text-center py-2 font-mono">{member.callSign}</td>
                                <td className="border border-gray-800 h-8"></td>
                                <td className="border border-gray-800 h-8"></td>
                                <td className="border border-gray-800"></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-auto p-6 border-t">
                  <p className="mb-6 text-sm">Naghanda:</p>
                  <div className="grid grid-cols-2 gap-20">
                    <div className="text-center">
                      <p className="font-semibold uppercase">JUSTINE JACOB RODRIGUEZ</p>
                      <p className="text-xs text-gray-600">KALIHIM SCAN</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold uppercase"></p>
                      <p className="text-xs text-gray-600">PANGULO NG SCAN</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-20 mt-8">
                    <div className="text-center">
                      <p className="font-semibold uppercase">MARIANO M. LEBARDO JR.</p>
                      <p className="text-xs text-gray-600">PD - TAGASUBAYBAY</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold uppercase">RODOLFO DE GUZMAN</p>
                      <p className="text-xs text-gray-600">DESTINADO NG LOKAL</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'letter' && (
          <div className="flex justify-center p-8">
            <ScanRecommendationLetter 
              date={new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              districtMinister="Alfonso O. Rico"
              local="Kadalagahan"
              district="Rizal"
              members={data.members.filter((data)=> data.kahilingan ==="true").map(member => ({
                name: member.name,
                kapisanan: member.kapisanan,
                recruitedBy: ""
              }))}
            />
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="flex justify-center p-8">
            <AttendanceSheet
              local="Kadalagahan"
              district="Rizal"
              venue="CFO Office (Lokal)"
              date={new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              time="8:00 PM"
              attendees={attendees}
              seminarLeaders={{
                secretary: "Justine Jacob Rodriguez",
                president: "Julian Ramirez",
                overseer: "MARIANO M. LEBARDO JR."
              }}
              maxAttendees={30}
            />
          </div>
        )}

        {activeTab === 'masterlist' && (
          <div className="max-w-7xl mx-auto px-6 space-y-8">
            {categories.map((category) => {
              const filteredMembers = data.members.filter((m: any) => m.function === category);
              return filteredMembers.length > 0 ? (
                <ScanMasterlist
                  key={category}
                  district="Rizal"
                  category={category}
                  members={filteredMembers.filter((data:any) => data.schedules && data.schedules.length > 0)}
                />
              ) : null;
            })}
          </div>
        )}

        {activeTab === 'crud' && (
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                <h2 className="text-2xl font-bold text-white">Manage Members</h2>
                <p className="text-blue-100 mt-1">Add, edit, or remove members from the database</p>
              </div>

              {/* Add Member Form */}
              <div className="p-8 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Member</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Call Sign"
                    value={newMember.callSign}
                    onChange={(e) => setNewMember({ ...newMember, callSign: e.target.value })}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Kapisanan"
                    value={newMember.kapisanan}
                    onChange={(e) => setNewMember({ ...newMember, kapisanan: e.target.value })}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <select
                    value={newMember.kahilingan}
                    onChange={(e) => setNewMember({ ...newMember, kahilingan: e.target.value })}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
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
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                {/* Schedules Section */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Schedules</label>
                  {newMember.schedules.map((schedule, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-3 mb-3">
                      <input
                        type="text"
                        placeholder="Date (optional)"
                        value={schedule.date}
                        onChange={(e) => {
                          const updated = [...newMember.schedules];
                          updated[idx] = { ...updated[idx], date: e.target.value };
                          setNewMember({ ...newMember, schedules: updated });
                        }}
                        className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={schedule.day}
                        onChange={(e) => {
                          const updated = [...newMember.schedules];
                          updated[idx] = { ...updated[idx], day: e.target.value };
                          setNewMember({ ...newMember, schedules: updated });
                        }}
                        className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                        className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex space-x-2">
                        <select
                          value={schedule.service || 'worship'}
                          onChange={(e) => {
                            const updated = [...newMember.schedules];
                            updated[idx] = { ...updated[idx], service: e.target.value as any };
                            setNewMember({ ...newMember, schedules: updated });
                          }}
                          className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                            className="bg-red-500 text-white px-3 rounded-lg hover:bg-red-600 transition-colors text-sm"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setNewMember({
                      ...newMember,
                      schedules: [...newMember.schedules, { date: '', day: '', time: '', service: 'worship' }]
                    })}
                    className="text-blue-600 text-sm mt-2 hover:text-blue-700 font-medium"
                  >
                    + Add Schedule
                  </button>
                </div>
                
                <button
                  onClick={addMember}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  Add Member
                </button>
              </div>

              {/* Members List */}
              <div className="p-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Members List</h3>
                {data.members.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <p className="text-gray-500">No members yet. Add your first member above!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.members.map((member, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                        {editingMember?.index === idx ? (
                          <div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <input
                                type="text"
                                placeholder="Name"
                                value={editingMember.member.name}
                                onChange={(e) => setEditingMember({
                                  index: idx,
                                  member: { ...editingMember.member, name: e.target.value }
                                })}
                                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <input
                                type="text"
                                placeholder="Call Sign"
                                value={editingMember.member.callSign}
                                onChange={(e) => setEditingMember({
                                  index: idx,
                                  member: { ...editingMember.member, callSign: e.target.value }
                                })}
                                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <input
                                type="text"
                                placeholder="Kapisanan"
                                value={editingMember.member.kapisanan}
                                onChange={(e) => setEditingMember({
                                  index: idx,
                                  member: { ...editingMember.member, kapisanan: e.target.value }
                                })}
                                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <select
                                value={editingMember.member.kahilingan}
                                onChange={(e) => setEditingMember({
                                  index: idx,
                                  member: { ...editingMember.member, kahilingan: e.target.value }
                                })}
                                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                                  index: idx,
                                  member: { ...editingMember.member, function: e.target.value }
                                })}
                                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Schedules</label>
                              {editingMember.member.schedules.map((schedule, sIdx) => (
                                <div key={sIdx} className="grid grid-cols-4 gap-3 mb-3">
                                  <input
                                    type="text"
                                    placeholder="Date"
                                    value={schedule.date}
                                    onChange={(e) => {
                                      const updatedSchedules = [...editingMember.member.schedules];
                                      updatedSchedules[sIdx] = { ...updatedSchedules[sIdx], date: e.target.value };
                                      setEditingMember({
                                        index: idx,
                                        member: { ...editingMember.member, schedules: updatedSchedules }
                                      });
                                    }}
                                    className="border border-gray-300 rounded-lg p-2 text-sm"
                                  />
                                  <select
                                    value={schedule.day}
                                    onChange={(e) => {
                                      const updatedSchedules = [...editingMember.member.schedules];
                                      updatedSchedules[sIdx] = { ...updatedSchedules[sIdx], day: e.target.value };
                                      setEditingMember({
                                        index: idx,
                                        member: { ...editingMember.member, schedules: updatedSchedules }
                                      });
                                    }}
                                    className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
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
                                    placeholder="Time"
                                    value={schedule.time}
                                    onChange={(e) => {
                                      const updatedSchedules = [...editingMember.member.schedules];
                                      updatedSchedules[sIdx] = { ...updatedSchedules[sIdx], time: e.target.value };
                                      setEditingMember({
                                        index: idx,
                                        member: { ...editingMember.member, schedules: updatedSchedules }
                                      });
                                    }}
                                    className="border border-gray-300 rounded-lg p-2 text-sm"
                                  />
                                  <div className="flex space-x-2">
                                    <select
                                      value={schedule.service || 'worship'}
                                      onChange={(e) => {
                                        const updatedSchedules = [...editingMember.member.schedules];
                                        updatedSchedules[sIdx] = { ...updatedSchedules[sIdx], service: e.target.value as any };
                                        setEditingMember({
                                          index: idx,
                                          member: { ...editingMember.member, schedules: updatedSchedules }
                                        });
                                      }}
                                      className="flex-1 border border-gray-300 rounded-lg p-2 text-sm bg-white"
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
                                            index: idx,
                                            member: { ...editingMember.member, schedules: updatedSchedules }
                                          });
                                        }}
                                        className="bg-red-500 text-white px-3 rounded-lg hover:bg-red-600 text-sm"
                                      >
                                        ×
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                              <button
                                onClick={() => setEditingMember({
                                  index: idx,
                                  member: {
                                    ...editingMember.member,
                                    schedules: [...editingMember.member.schedules, { date: '', day: '', time: '', service: 'worship' }]
                                  }
                                })}
                                className="text-blue-600 text-sm mt-2 hover:text-blue-700"
                              >
                                + Add Schedule
                              </button>
                            </div>
                            <div className="flex space-x-3">
                              <button
                                onClick={updateMember}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Save Changes
                              </button>
                              <button
                                onClick={() => setEditingMember(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-semibold text-lg text-gray-800">{member.name}</h4>
                                <div className="flex items-center space-x-4 mt-1">
                                  <p className="text-sm text-gray-600">Call Sign: <span className="font-mono">{member.callSign}</span></p>
                                  <p className="text-sm text-gray-600">Kapisanan: {member.kapisanan || 'N/A'}</p>
                                </div>
                                <div className="flex items-center space-x-4 mt-1">
                                  <p className="text-sm text-gray-600">
                                    Status: <span className={member.kahilingan === "true" ? "text-green-600 font-medium" : "text-gray-500"}>{member.kahilingan === "true" ? "For Recommendation" : "Not for Recommendation"}</span>
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Function: {typeof member.function === 'string' ? member.function : member.function?.join(', ') || 'N/A'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setEditingMember({ index: idx, member: JSON.parse(JSON.stringify(member)) })}
                                  className="bg-amber-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-amber-600 transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteMember(idx)}
                                  className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-sm font-medium text-gray-700 mb-2">Schedules:</p>
                              {member.schedules.length === 0 || (member.schedules.length === 1 && !member.schedules[0].day && !member.schedules[0].time) ? (
                                <p className="text-sm text-gray-500 italic">No schedules assigned</p>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  {member.schedules.map((schedule, sIdx) => (
                                    schedule.day && schedule.time && (
                                      <span key={sIdx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {schedule.day} at {schedule.time} ({schedule.service || 'worship'})
                                      </span>
                                    )
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        * {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        
        @page {
          size: A4;
          margin: 1mm;
        }

        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:rounded-none {
            border-radius: 0 !important;
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
          
          table {
            page-break-inside: avoid;
          }
        }

        @keyframes slide-in-from-top {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }

        .animate-in {
          animation: slide-in-from-top 0.3s ease-out;
        }
      `}</style>
    </div>
  );
      }
