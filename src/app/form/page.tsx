'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Schedule {
  date: string;
  day: string;
  time: string;
  service?: 'PNK' | 'worship';
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
  const [activeTab, setActiveTab] = useState<'print' | 'crud'>('crud');
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
        const computedDate = getAlignedDate(schedule.day);
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
    if (dayA !== dayB) return dayA - dayB;
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
  const form3 = sortedSchedules.filter((s) => s.service === 'PNK');
  const forms = [form1, form2, form3];

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
    <div className="bg-gray-300 min-h-screen print:bg-white">
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

      <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 print:hidden bg-white rounded-lg shadow-md flex gap-2 p-2 w-auto min-w-[200px]">
        <button
          onClick={() => setActiveTab('print')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'print' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Print View
        </button>
        <button
          onClick={() => setActiveTab('crud')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'crud' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Manage Members
        </button>
      </div>

      {activeTab === 'print' && (
        <div className="fixed bottom-4 right-4 print:hidden z-50">
          <button onClick={() => window.print()} className="bg-black text-white px-4 py-2 text-sm rounded shadow">
            Print
          </button>
        </div>
      )}

      {activeTab === 'print' && (
        <div className="print-container">
          {forms.map((formSchedules, formIndex) => (
            <div key={formIndex} className="print-page">
              {/* HEADER */}
              <div className="print-header">
                <div className="logo-left">
                  <Image src="/images.png" alt="Logo" width={60} height={60} className="object-contain" />
                </div>
                <div className="title-section">
                  <h1>SCAN INTERNATIONAL</h1>
                  <h2>DISTRITO NG RIZAL</h2>
                  <h3>LOKAL NG KADALAGAHAN</h3>
                  <p>{formIndex === 2 ? 'SUGUAN NG SCAN SA PNK' : 'SUGUAN NG SCAN SA PAGSAMBA'}</p>
                </div>
                <div className="logo-right"></div>
              </div>

              {/* TABLES - exact same structure, never changes */}
              <div className="schedules-list">
                {formSchedules.map((schedule, idx) => {
                  const dateObj = new Date(schedule.date);
                  const filipinoDay = filipinoDays[schedule.day.toLowerCase()] || schedule.day;
                  return (
                    <div key={idx} className="schedule-wrapper">
                      <table className="print-table">
                        <thead>
                          <tr>
                            <th colSpan={2}>Petsa: {dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</th>
                            <th colSpan={2}>Araw: {filipinoDay}</th>
                            <th colSpan={2}>Oras: {schedule.time}</th>
                          </tr>
                          <tr>
                            <th className="col-blg">Blg</th>
                            <th className="col-name">Pangalan</th>
                            <th className="col-callsign">Call-Sign</th>
                            <th className="col-sign-receive">Lagda Pagtanggap</th>
                            <th className="col-sign-fulfill">Lagda Pagtupad</th>
                            <th className="col-role">Gampanin</th>
                          </tr>
                        </thead>
                        <tbody>
                          {schedule.members.map((member, i) => (
                            <tr key={i}>
                              <td className="text-center">{i + 1}</td>
                              <td>{member.name}</td>
                              <td className="text-center">{member.callSign}</td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          ))}
                        </tbody>
                       </table>
                    </div>
                  );
                })}
              </div>

              {/* SIGNATORIES - 2x2 grid */}
              <div className="signatures">
                <p className="naghanda-label">Naghanda:</p>
                <div className="signature-2x2">
                  <div className="signature-item">
                    <p className="signature-name">JUSTINE JACOB RODRIGUEZ</p>
                    <p>KALIHIM SCAN</p>
                  </div>
                  <div className="signature-item">
                    <p className="signature-name"></p>
                    <p>PANGULO NG SCAN</p>
                  </div>
                  <div className="signature-item">
                    <p className="signature-name">MARIANO M. LEBARDO JR.</p>
                    <p>PD - TAGASUBAYBAY</p>
                  </div>
                  <div className="signature-item">
                    <p className="signature-name">MARLON M. SEVILLA</p>
                    <p>DESTINADO NG LOKAL</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'crud' && (
        <div className="crud-container">
          <h2>Manage Members</h2>
          <div className="add-member-form">
            <h3>Add New Member</h3>
            <div className="form-row">
              <input type="text" placeholder="Name" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} />
              <input type="text" placeholder="Call Sign" value={newMember.callSign} onChange={(e) => setNewMember({ ...newMember, callSign: e.target.value })} />
            </div>
            <div className="schedules-section">
              <label>Schedules</label>
              {newMember.schedules.map((schedule, idx) => (
                <div key={idx} className="schedule-row">
                  <input type="text" placeholder="Date" value={schedule.date} onChange={(e) => {
                    const updated = [...newMember.schedules];
                    updated[idx] = { ...updated[idx], date: e.target.value };
                    setNewMember({ ...newMember, schedules: updated });
                  }} />
                  <select value={schedule.day} onChange={(e) => {
                    const updated = [...newMember.schedules];
                    updated[idx] = { ...updated[idx], day: e.target.value };
                    setNewMember({ ...newMember, schedules: updated });
                  }}>
                    <option value="">Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                  <input type="text" placeholder="Time" value={schedule.time} onChange={(e) => {
                    const updated = [...newMember.schedules];
                    updated[idx] = { ...updated[idx], time: e.target.value };
                    setNewMember({ ...newMember, schedules: updated });
                  }} />
                  <select value={schedule.service || 'worship'} onChange={(e) => {
                    const updated = [...newMember.schedules];
                    updated[idx] = { ...updated[idx], service: e.target.value as 'PNK' | 'worship' };
                    setNewMember({ ...newMember, schedules: updated });
                  }}>
                    <option value="worship">Worship</option>
                    <option value="PNK">PNK</option>
                  </select>
                  {newMember.schedules.length > 1 && (
                    <button onClick={() => {
                      const updated = newMember.schedules.filter((_, i) => i !== idx);
                      setNewMember({ ...newMember, schedules: updated });
                    }}>Remove</button>
                  )}
                </div>
              ))}
              <button onClick={() => setNewMember({
                ...newMember,
                schedules: [...newMember.schedules, { date: '', day: '', time: '', service: 'worship' }]
              })}>+ Add Schedule</button>
            </div>
            <button onClick={addMember}>Add Member</button>
          </div>

          <div className="members-list">
            <h3>Members List</h3>
            {data.members.length === 0 ? (
              <p>No members yet. Add your first member above!</p>
            ) : (
              data.members.map((member, idx) => (
                <div key={idx} className="member-card">
                  {editingMember?.index === idx ? (
                    <div>
                      <div className="form-row">
                        <input type="text" placeholder="Name" value={editingMember.member.name} onChange={(e) => setEditingMember({ index: idx, member: { ...editingMember.member, name: e.target.value } })} />
                        <input type="text" placeholder="Call Sign" value={editingMember.member.callSign} onChange={(e) => setEditingMember({ index: idx, member: { ...editingMember.member, callSign: e.target.value } })} />
                      </div>
                      <div className="schedules-section">
                        <label>Schedules</label>
                        {editingMember.member.schedules.map((schedule, sIdx) => (
                          <div key={sIdx} className="schedule-row">
                            <input type="text" placeholder="Date" value={schedule.date} onChange={(e) => {
                              const updated = [...editingMember.member.schedules];
                              updated[sIdx] = { ...updated[sIdx], date: e.target.value };
                              setEditingMember({ index: idx, member: { ...editingMember.member, schedules: updated } });
                            }} />
                            <select value={schedule.day} onChange={(e) => {
                              const updated = [...editingMember.member.schedules];
                              updated[sIdx] = { ...updated[sIdx], day: e.target.value };
                              setEditingMember({ index: idx, member: { ...editingMember.member, schedules: updated } });
                            }}>
                              <option value="">Select Day</option>
                              <option value="Monday">Monday</option>
                              <option value="Tuesday">Tuesday</option>
                              <option value="Wednesday">Wednesday</option>
                              <option value="Thursday">Thursday</option>
                              <option value="Friday">Friday</option>
                              <option value="Saturday">Saturday</option>
                              <option value="Sunday">Sunday</option>
                            </select>
                            <input type="text" placeholder="Time" value={schedule.time} onChange={(e) => {
                              const updated = [...editingMember.member.schedules];
                              updated[sIdx] = { ...updated[sIdx], time: e.target.value };
                              setEditingMember({ index: idx, member: { ...editingMember.member, schedules: updated } });
                            }} />
                            <select value={schedule.service || 'worship'} onChange={(e) => {
                              const updated = [...editingMember.member.schedules];
                              updated[sIdx] = { ...updated[sIdx], service: e.target.value as 'PNK' | 'worship' };
                              setEditingMember({ index: idx, member: { ...editingMember.member, schedules: updated } });
                            }}>
                              <option value="worship">Worship</option>
                              <option value="PNK">PNK</option>
                            </select>
                            {editingMember.member.schedules.length > 1 && (
                              <button onClick={() => {
                                const updated = editingMember.member.schedules.filter((_, i) => i !== sIdx);
                                setEditingMember({ index: idx, member: { ...editingMember.member, schedules: updated } });
                              }}>Delete</button>
                            )}
                          </div>
                        ))}
                        <button onClick={() => setEditingMember({
                          index: idx,
                          member: { ...editingMember.member, schedules: [...editingMember.member.schedules, { date: '', day: '', time: '', service: 'worship' }] }
                        })}>+ Add Schedule</button>
                      </div>
                      <div className="action-buttons">
                        <button onClick={updateMember}>Save Changes</button>
                        <button onClick={() => setEditingMember(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="member-header">
                        <div>
                          <h4>{member.name}</h4>
                          <p>Call Sign: {member.callSign}</p>
                        </div>
                        <div className="action-buttons">
                          <button onClick={() => setEditingMember({ index: idx, member: JSON.parse(JSON.stringify(member)) })}>Edit</button>
                          <button onClick={() => deleteMember(idx)}>Delete</button>
                        </div>
                      </div>
                      <div className="member-schedules">
                        <p>Schedules:</p>
                        {member.schedules.length === 0 || (member.schedules.length === 1 && !member.schedules[0].day && !member.schedules[0].time) ? (
                          <p>No schedules assigned</p>
                        ) : (
                          <ul>
                            {member.schedules.map((schedule, sIdx) => (
                              schedule.day && schedule.time && (
                                <li key={sIdx}>{schedule.day} at {schedule.time} ({schedule.service || 'worship'})</li>
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
        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          body {
            background: white !important;
            margin: 0;
            padding: 0;
          }
          .print-container {
            background: white;
          }
          .print-page {
            margin: 0;
            box-shadow: none;
            page-break-after: always;
            page-break-inside: avoid;
          }
        }

        /* Print container - fluid width on mobile, fixed on desktop */
        .print-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #e5e7eb;
          padding: 20px;
        }

        /* Each page - uses viewport width on mobile, fixed A4 on desktop */
        .print-page {
          background: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          box-sizing: border-box;
          margin-bottom: 20px;
        }

        /* Desktop: exact A4 size */
        @media (min-width: 641px) {
          .print-page {
            width: 210mm;
            min-height: 297mm;
            padding: 12mm;
          }
        }

        /* Mobile: 100% width, proportional scaling - table structure stays identical */
        @media (max-width: 640px) {
          .print-container {
            padding: 10px;
          }
          
          .print-page {
            width: 100%;
            padding: 5%;
          }
        }

        /* HEADER - same structure on all devices */
        .print-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 8mm;
        }

        .logo-left {
          width: 70px;
          flex-shrink: 0;
        }

        .logo-right {
          width: 70px;
          flex-shrink: 0;
        }

        .title-section {
          text-align: center;
          flex: 1;
          padding: 0 10px;
        }

        .title-section h1 {
          font-size: 13px;
          font-weight: bold;
          text-transform: uppercase;
          margin: 0;
          letter-spacing: 0.5px;
        }

        .title-section h2 {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          margin: 2px 0 0 0;
        }

        .title-section h3 {
          font-size: 11px;
          text-transform: uppercase;
          margin: 2px 0 0 0;
        }

        .title-section p {
          font-size: 10px;
          text-transform: uppercase;
          margin: 2px 0 0 0;
        }

        /* TABLES - exact same column widths proportionally */
        .schedules-list {
          display: flex;
          flex-direction: column;
          gap: 6mm;
        }

        .schedule-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .print-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid black;
          /* Font size scales with viewport on mobile, fixed on desktop */
          font-size: 10px;
        }

        /* Responsive font sizing - scales proportionally */
        @media (max-width: 640px) {
          .print-table {
            font-size: clamp(6px, 3vw, 10px);
          }
          .title-section h1 {
            font-size: clamp(8px, 3vw, 13px);
          }
          .title-section h2 {
            font-size: clamp(7px, 2.8vw, 12px);
          }
          .title-section h3 {
            font-size: clamp(6px, 2.5vw, 11px);
          }
          .title-section p {
            font-size: clamp(5px, 2.2vw, 10px);
          }
          .signature-name, .signature-item p {
            font-size: clamp(6px, 2.5vw, 11px);
          }
          .logo-left, .logo-right {
            width: clamp(35px, 15vw, 70px);
          }
        }

        .print-table th,
        .print-table td {
          border: 1px solid black;
          padding: 4px 6px;
          vertical-align: top;
        }

        .print-table th {
          font-weight: bold;
          text-align: left;
          background-color: #f9fafb;
        }

        /* Column widths - proportional */
        .col-blg {
          width: 8%;
          text-align: center;
        }
        .col-name {
          width: 32%;
        }
        .col-callsign {
          width: 12%;
          text-align: center;
        }
        .col-sign-receive {
          width: 18%;
        }
        .col-sign-fulfill {
          width: 18%;
        }
        .col-role {
          width: 12%;
        }

        .text-center {
          text-align: center;
        }

        /* Signatures - 2x2 grid, same on all devices */
        .signatures {
          margin-top: 14mm;
        }

        .naghanda-label {
          font-size: 11px;
          margin-bottom: 6mm;
        }

        .signature-2x2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12mm 20mm;
        }

        .signature-item {
          text-align: center;
        }

        .signature-name {
          font-weight: 600;
          text-transform: uppercase;
          font-size: 11px;
          margin-bottom: 2px;
        }

        .signature-item p {
          margin: 2px 0;
          font-size: 11px;
        }

        @media (max-width: 640px) {
          .signature-2x2 {
            gap: 8mm 10mm;
          }
        }

        /* CRUD styles (unchanged) */
        .crud-container {
          max-width: 1200px;
          margin: 80px auto 40px auto;
          padding: 24px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .crud-container h2 {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 24px;
        }

        .add-member-form {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .add-member-form h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 12px;
        }

        .form-row input {
          border: 1px solid #d1d5db;
          padding: 8px;
          border-radius: 4px;
        }

        .schedules-section {
          margin-bottom: 12px;
        }

        .schedules-section label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .schedule-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr auto;
          gap: 8px;
          margin-bottom: 8px;
        }

        .schedule-row input,
        .schedule-row select {
          border: 1px solid #d1d5db;
          padding: 8px;
          border-radius: 4px;
          font-size: 14px;
        }

        .schedule-row button {
          background: #ef4444;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
        }

        .members-list h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .member-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .member-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .member-header h4 {
          font-size: 18px;
          font-weight: 600;
        }

        .member-header p {
          color: #4b5563;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-buttons button {
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          border: none;
        }

        .action-buttons button:first-child {
          background: #eab308;
          color: white;
        }

        .action-buttons button:last-child {
          background: #ef4444;
          color: white;
        }

        .member-schedules {
          margin-top: 8px;
        }

        .member-schedules p {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .member-schedules ul {
          list-style: disc;
          list-style-position: inside;
          font-size: 14px;
          color: #4b5563;
        }

        button {
          cursor: pointer;
          transition: opacity 0.2s;
        }

        button:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
                                   }
