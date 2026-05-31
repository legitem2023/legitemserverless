'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import ScanRecommendationLetter from './ScanRecommendationLetter';

interface Schedule {
  date: string;
  day: string;
  time: string;
  service?: 'PNK' | 'worship' | 'Distrito';
}

interface Member {
  name: string;
  callSign: string;
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
  const [activeTab, setActiveTab] = useState<'print' | 'crud' | 'letter'>('crud');
  const [data, setData] = useState<{ members: Member[] }>({ members: [] });
  const [editingMember, setEditingMember] = useState<{ index: number; member: Member } | null>(null);
  const [newMember, setNewMember] = useState<Member>({
    name: '',
    callSign: '',
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
          callSign: '',
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
        
        // --- MODIFICATION START ---
        // If the service is 'distrito', add 3 days to the calculated date
        if (serviceType === 'Distrito') {
          const newDate = new Date(computedDate);
          newDate.setDate(computedDate.getDate() + 7);
          computedDate = newDate;
        }
        // --- MODIFICATION END ---

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
    <div className="bg-gray-300 min-h-screen py-10 print:bg-white print:p-0 print:m-0">
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

      <div className="fixed top-5 left-5 right-5 z-50 print:hidden bg-white rounded-lg shadow-md flex gap-2 p-2 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('print')}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'print'
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Print View
        </button>
        <button
          onClick={() => setActiveTab('crud')}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'crud'
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Manage Members
        </button>
        <button
          onClick={() => setActiveTab('letter')}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'letter'
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Recommendation Letter
        </button>
      </div>

      {activeTab === 'print' && (
        <div className="fixed top-5 right-5 print:hidden z-50">
          <button
            onClick={() => window.print()}
            className="bg-black text-white px-4 py-2 text-sm rounded shadow"
          >
            Print
          </button>
        </div>
      )}

      {activeTab === 'print' && (
        <div className="flex p-5 items-center flex-col gap-3">
          {forms.map((formSchedules, formIndex) => (
            <div
              key={formIndex}
              className="bg-white w-[210mm] min-h-[297mm] shadow-lg text-black print:shadow-none print:page-break-after-always print:m-0 print:p-0 m-0 p-0 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4 pt-4 pl-4 pr-4">
                <div className="w-[120px] flex justify-start">
                  <Image
                    src="/images.png"
                    alt="Logo"
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>

                <div className="text-center flex-1">
                  <h1 className="font-bold text-[13px] uppercase">SCAN INTERNATIONAL</h1>
                  <h2 className="font-semibold text-[12px] uppercase">DISTRITO NG RIZAL</h2>
                  <h3 className="text-[11px] uppercase">LOKAL NG KADALAGAHAN</h3>
                  <p className="text-[10px] uppercase">
                    {formIndex === 2 ? 'SUGUAN NG SCAN SA PNK' : 
                     formIndex === 3 ? 'SUGUAN NG PAGBABANTAY SA DISTRITO' : 
                     'SUGUAN NG SCAN SA PAGSAMBA'}
                  </p>
                </div>

                <div className="w-[70px]" />
              </div>

              <div className="space-y-6 pl-4 pr-4">
                {formSchedules.map((schedule, idx) => {
                  const dateObj = new Date(schedule.date);
                  const filipinoDay = filipinoDays[schedule.day.toLowerCase()] || schedule.day;

                  return (
                    <div key={idx} className="break-inside-avoid">
                      <table className="w-full border border-black text-[10px] table-fixed">
                        <thead>
                          <tr>
                            <th colSpan={5} className="border px-2 py-1 text-left" style={{ width: '33.33%' }}>
                              Petsa: {dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </th>
                            <th colSpan={2} className="border px-2 py-1 text-left" style={{ width: '33.33%' }}>
                              Araw: {filipinoDay}
                            </th>
                            <th colSpan={2} className="border px-2 py-1 text-left" style={{ width: '33.33%' }}>
                              Oras: {schedule.time}
                            </th>
                          </tr>
                          <tr>
                            <th className="border px-1 py-1" >Blg</th>
                            <th colSpan={4} className="border px-2 py-1 text-left">Pangalan</th>
                            <th className="border px-1 py-1">Call-Sign</th>
                            <th className="border px-1 py-1">Lagda Pagtanggap</th>
                            <th className="border px-1 py-1">Lagda Pagtupad</th>
                            <th className="border px-1 py-1">Gampanin</th>
                          </tr>
                        </thead>
                        <tbody>
                          {schedule.members.map((member, i) => (
                            <tr key={i}>
                              <td className="border text-center py-1">{i + 1}</td>
                              <td colSpan={4} className="border px-2 py-1">{member.name}</td>
                              <td className="border text-center py-1">{member.callSign}</td>
                              <td className="border h-[24px]" />
                              <td className="border h-[24px]" />
                              <td className="border" />
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>

              <div className="mt-14 text-[11px] pl-4 pr-4 pb-4">
                <p className="mb-6">Naghanda:</p>
                <div className="grid grid-cols-2 gap-20">
                  <div className="text-center">
                    <p className="font-semibold uppercase">JUSTINE JACOB RODRIGUEZ</p>
                    <p>KALIHIM SCAN</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold uppercase"></p>
                    <p>PANGULO NG SCAN</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-20 mt-12">
                  <div className="text-center">
                    <p className="font-semibold uppercase">MARIANO M. LEBARDO JR.</p>
                    <p>PD - TAGASUBAYBAY</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold uppercase">MARLON M. SEVILLA</p>
                    <p>DESTINADO NG LOKAL</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'letter' && (
        <div className="flex p-5 items-center justify-center">
          <ScanRecommendationLetter 
  date={new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
  districtMinister="Alfonso O. Rico"
  local="Kadalagahan"
  district="Rizal"
  members={data.members.map(member => ({
    name: member.name,
    kapisanan: "",
    recruitedBy: ""
  }))}
/>
        </div>
      )}

      {activeTab === 'crud' && (
        <div className="max-w-6xl mx-auto mt-24 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Manage Members</h2>

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
                    <option value="distrito">Distrito</option>
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

          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-3">Members List</h3>
            {data.members.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No members yet. Add your first member above!</p>
            ) : (
              data.members.map((member, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  {editingMember?.index === idx ? (
                    <div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <input
                          type="text"
                          placeholder="Name"
                          value={editingMember.member.name}
                          onChange={(e) => setEditingMember({
                            index: idx,
                            member: { ...editingMember.member, name: e.target.value }
                          })}
                          className="border p-2 rounded"
                        />
                        <input
                          type="text"
                          placeholder="Call Sign"
                          value={editingMember.member.callSign}
                          onChange={(e) => setEditingMember({
                            index: idx,
                            member: { ...editingMember.member, callSign: e.target.value }
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
                                  index: idx,
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
                                  index: idx,
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
                                  index: idx,
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
                                  index: idx,
                                  member: { ...editingMember.member, schedules: updatedSchedules }
                                });
                              }}
                              className="border p-2 rounded text-sm"
                            >
                              <option value="worship">Worship</option>
                              <option value="PNK">PNK</option>
                              <option value="distrito">Distrito</option>
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
                                className="bg-red-500 text-white px-2 rounded text-xs hover:bg-red-600"
                              >
                                Delete
                              </button>
                            )}
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
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingMember({ index: idx, member: JSON.parse(JSON.stringify(member)) })}
                            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteMember(idx)}
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
              ))
            )}
          </div>
        </div>
      )}

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
            width: 100%;
            height: 100%;
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
          
          table {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
                    }
