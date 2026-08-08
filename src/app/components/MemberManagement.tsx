// src/components/MemberManagement.tsx

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_MEMBERS,
  GET_MEMBERS_WITH_SCHEDULES,
  CREATE_MEMBER,
  UPDATE_MEMBER,
  DELETE_MEMBER,
  TOGGLE_MEMBER_KAHLINGAN,
  CREATE_SCHEDULE,
  UPDATE_SCHEDULE,
  DELETE_SCHEDULE,
  GET_SCHEDULES_BY_MEMBER,
} from '../../graphql/memberOperations';
import { format } from 'date-fns';

interface Member {
  id: string;
  userId: string;
  name: string;
  kapisanan: 'BUKLOD' | 'KADIWA' | 'BINHI';
  kahilingan: boolean;
  callSign: string;
  function: 'ASSOCIATE_MEMBERS_APPROVED' | 'ASSOCIATE_MEMBERS_NOT_APPROVED' | 'EMERGENCY_FIRST_RESPONDER';
  picture: string;
  Petsa_ng_maging_scan: string;
  Pagpapatibay: string;
  AssociateCategory: string;
  AmatureCallsign: string;
  schedules: Schedule[];
}

interface Schedule {
  id: string;
  service: 'WORSHIP' | 'PNK' | 'DISTRITO';
  date: string;
  day: string;
  time: string;
  memberId: string;
}

const MemberManagement: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [filter, setFilter] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Queries
  const { loading, error, data, refetch } = useQuery(GET_MEMBERS, {
    variables: { 
      filter: {
        ...filter,
        search: searchTerm || undefined
      },
      limit: 100,
      offset: 0
    }
  });

  const { 
    data: schedulesData, 
    refetch: refetchSchedules 
  } = useQuery(GET_SCHEDULES_BY_MEMBER, {
    variables: { memberId: selectedMember?.id || '' },
    skip: !selectedMember
  });

  // Mutations
  const [createMember] = useMutation(CREATE_MEMBER);
  const [updateMember] = useMutation(UPDATE_MEMBER);
  const [deleteMember] = useMutation(DELETE_MEMBER);
  const [toggleKahilingan] = useMutation(TOGGLE_MEMBER_KAHLINGAN);
  const [createSchedule] = useMutation(CREATE_SCHEDULE);
  const [updateSchedule] = useMutation(UPDATE_SCHEDULE);
  const [deleteSchedule] = useMutation(DELETE_SCHEDULE);

  const handleCreateMember = async (memberData: any) => {
    try {
      await createMember({
        variables: { input: memberData },
        refetchQueries: [{ query: GET_MEMBERS }]
      });
      setIsModalOpen(false);
      alert('Member created successfully!');
    } catch (error: any) {
      alert(`Error creating member: ${error.message}`);
    }
  };

  const handleUpdateMember = async (id: string, memberData: any) => {
    try {
      await updateMember({
        variables: { id, input: memberData },
        refetchQueries: [{ query: GET_MEMBERS }]
      });
      setIsModalOpen(false);
      alert('Member updated successfully!');
    } catch (error: any) {
      alert(`Error updating member: ${error.message}`);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await deleteMember({
          variables: { id },
          refetchQueries: [{ query: GET_MEMBERS }]
        });
        alert('Member deleted successfully!');
      } catch (error: any) {
        alert(`Error deleting member: ${error.message}`);
      }
    }
  };

  const handleToggleKahilingan = async (id: string) => {
    try {
      await toggleKahilingan({
        variables: { id },
        refetchQueries: [{ query: GET_MEMBERS }]
      });
    } catch (error: any) {
      alert(`Error updating status: ${error.message}`);
    }
  };

  const handleCreateSchedule = async (scheduleData: any) => {
    try {
      await createSchedule({
        variables: { input: { ...scheduleData, memberId: selectedMember?.id } },
        refetchQueries: [
          { query: GET_MEMBERS },
          { query: GET_SCHEDULES_BY_MEMBER, variables: { memberId: selectedMember?.id } }
        ]
      });
      setIsScheduleModalOpen(false);
      alert('Schedule created successfully!');
    } catch (error: any) {
      alert(`Error creating schedule: ${error.message}`);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await deleteSchedule({
          variables: { id },
          refetchQueries: [
            { query: GET_MEMBERS },
            { query: GET_SCHEDULES_BY_MEMBER, variables: { memberId: selectedMember?.id } }
          ]
        });
        alert('Schedule deleted successfully!');
      } catch (error: any) {
        alert(`Error deleting schedule: ${error.message}`);
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Member Management</h1>
        <button
          onClick={() => {
            setSelectedMember(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add New Member
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search by name or call sign..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          onChange={(e) => setFilter({ ...filter, kapisanan: e.target.value || undefined })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Kapisanan</option>
          <option value="BUKLOD">Buklod</option>
          <option value="KADIWA">Kadiwa</option>
          <option value="BINHI">Binhi</option>
        </select>
        <select
          onChange={(e) => setFilter({ ...filter, function: e.target.value || undefined })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Functions</option>
          <option value="ASSOCIATE_MEMBERS_APPROVED">Approved</option>
          <option value="ASSOCIATE_MEMBERS_NOT_APPROVED">Not Approved</option>
          <option value="EMERGENCY_FIRST_RESPONDER">EFR</option>
        </select>
        <button
          onClick={() => setFilter({})}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          Clear Filters
        </button>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Call Sign</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kapisanan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Function</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedules</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.getMembers?.map((member: Member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {member.picture && (
                      <img 
                        src={member.picture} 
                        alt={member.name} 
                        className="w-8 h-8 rounded-full mr-2 object-cover"
                      />
                    )}
                    <span className="font-medium">{member.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{member.callSign || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    member.kapisanan === 'BUKLOD' ? 'bg-purple-100 text-purple-800' :
                    member.kapisanan === 'KADIWA' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {member.kapisanan}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {member.function.replace('_', ' ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleKahilingan(member.id)}
                    className={`px-2 py-1 text-xs rounded ${
                      member.kahilingan 
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {member.kahilingan ? 'Pending' : 'Approved'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      setIsScheduleModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {member.schedules?.length || 0} Schedules
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Member Form Modal */}
      <MemberFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        onSubmit={selectedMember ? handleUpdateMember : handleCreateMember}
      />

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        schedules={selectedMember?.schedules || []}
        onCreateSchedule={handleCreateSchedule}
        onDeleteSchedule={handleDeleteSchedule}
      />
    </div>
  );
};

// Member Form Modal Component
interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  onSubmit: (id: string, data: any) => void;
}

const MemberFormModal: React.FC<MemberFormModalProps> = ({
  isOpen,
  onClose,
  member,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    kapisanan: 'BUKLOD',
    kahilingan: false,
    callSign: '',
    function: 'ASSOCIATE_MEMBERS_NOT_APPROVED',
    picture: '',
    Petsa_ng_maging_scan: '',
    Pagpapatibay: '',
    AssociateCategory: '',
    AmatureCallsign: '',
  });

  useEffect(() => {
    if (member) {
      setFormData({
        userId: member.userId || '',
        name: member.name || '',
        kapisanan: member.kapisanan || 'BUKLOD',
        kahilingan: member.kahilingan || false,
        callSign: member.callSign || '',
        function: member.function || 'ASSOCIATE_MEMBERS_NOT_APPROVED',
        picture: member.picture || '',
        Petsa_ng_maging_scan: member.Petsa_ng_maging_scan || '',
        Pagpapatibay: member.Pagpapatibay || '',
        AssociateCategory: member.AssociateCategory || '',
        AmatureCallsign: member.AmatureCallsign || '',
      });
    } else {
      setFormData({
        userId: '',
        name: '',
        kapisanan: 'BUKLOD',
        kahilingan: false,
        callSign: '',
        function: 'ASSOCIATE_MEMBERS_NOT_APPROVED',
        picture: '',
        Petsa_ng_maging_scan: '',
        Pagpapatibay: '',
        AssociateCategory: '',
        AmatureCallsign: '',
      });
    }
  }, [member]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {member ? 'Edit Member' : 'Add New Member'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          if (member) {
            onSubmit(member.id, formData);
          } else {
            onSubmit('', formData);
          }
        }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">User ID</label>
              <input
                type="text"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Call Sign</label>
              <input
                type="text"
                value={formData.callSign}
                onChange={(e) => setFormData({ ...formData, callSign: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Kapisanan</label>
              <select
                value={formData.kapisanan}
                onChange={(e) => setFormData({ ...formData, kapisanan: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="BUKLOD">Buklod</option>
                <option value="KADIWA">Kadiwa</option>
                <option value="BINHI">Binhi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Function</label>
              <select
                value={formData.function}
                onChange={(e) => setFormData({ ...formData, function: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ASSOCIATE_MEMBERS_APPROVED">Approved</option>
                <option value="ASSOCIATE_MEMBERS_NOT_APPROVED">Not Approved</option>
                <option value="EMERGENCY_FIRST_RESPONDER">EFR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Picture URL</label>
              <input
                type="text"
                value={formData.picture}
                onChange={(e) => setFormData({ ...formData, picture: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.kahilingan ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, kahilingan: e.target.value === 'true' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="false">Approved</option>
                <option value="true">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amateur Callsign</label>
              <input
                type="text"
                value={formData.AmatureCallsign}
                onChange={(e) => setFormData({ ...formData, AmatureCallsign: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Associate Category</label>
              <input
                type="text"
                value={formData.AssociateCategory}
                onChange={(e) => setFormData({ ...formData, AssociateCategory: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Petsa ng Maging Scan</label>
              <input
                type="date"
                value={formData.Petsa_ng_maging_scan}
                onChange={(e) => setFormData({ ...formData, Petsa_ng_maging_scan: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Pagpapatibay</label>
              <input
                type="text"
                value={formData.Pagpapatibay}
                onChange={(e) => setFormData({ ...formData, Pagpapatibay: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {member ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Schedule Modal Component
interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  schedules: Schedule[];
  onCreateSchedule: (data: any) => void;
  onDeleteSchedule: (id: string) => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  member,
  schedules,
  onCreateSchedule,
  onDeleteSchedule,
}) => {
  const [newSchedule, setNewSchedule] = useState({
    service: 'WORSHIP',
    date: new Date().toISOString().split('T')[0],
    day: format(new Date(), 'EEEE'),
    time: '6:45 PM',
  });

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleAddSchedule = () => {
    onCreateSchedule({
      ...newSchedule,
      memberId: member?.id,
    });
    setNewSchedule({
      service: 'WORSHIP',
      date: new Date().toISOString().split('T')[0],
      day: format(new Date(), 'EEEE'),
      time: '6:45 PM',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Schedules for {member?.name}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Add Schedule Form */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Add New Schedule</h3>
          <div className="grid grid-cols-4 gap-3">
            <select
              value={newSchedule.service}
              onChange={(e) => setNewSchedule({ ...newSchedule, service: e.target.value })}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="WORSHIP">Worship</option>
              <option value="PNK">PNK</option>
              <option value="DISTRITO">Distrito</option>
            </select>
            <input
              type="date"
              value={newSchedule.date}
              onChange={(e) => {
                const date = new Date(e.target.value);
                setNewSchedule({
                  ...newSchedule,
                  date: e.target.value,
                  day: days[date.getDay()],
                });
              }}
              className="border border-gray-300 rounded-md p-2"
            />
            <input
              type="text"
              placeholder="Time (e.g., 6:45 PM)"
              value={newSchedule.time}
              onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
              className="border border-gray-300 rounded-md p-2"
            />
            <button
              onClick={handleAddSchedule}
              className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
            >
              Add Schedule
            </button>
          </div>
        </div>

        {/* Schedules List */}
        <div className="space-y-2">
          {schedules.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No schedules found for this member.</p>
          ) : (
            schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    schedule.service === 'WORSHIP' ? 'bg-blue-100 text-blue-800' :
                    schedule.service === 'PNK' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {schedule.service}
                  </span>
                  <span className="font-medium">{schedule.date}</span>
                  <span className="text-gray-600">{schedule.day}</span>
                  <span className="text-gray-800">{schedule.time}</span>
                </div>
                <button
                  onClick={() => onDeleteSchedule(schedule.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberManagement;
