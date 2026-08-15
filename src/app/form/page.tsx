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

// Sample static data since we're not using a database
const sampleMembers: Member[] = [
  {
    name: "John Doe",
    kapisanan: "Kadalagahan",
    kahilingan: "true",
    callSign: "JD001",
    function: "Emergency First Responder (EFR)",
    picture: "",
    schedules: [
      { date: "", day: "Monday", time: "8:00 AM", service: "worship" }
    ]
  },
  {
    name: "Jane Smith",
    kapisanan: "Kadalagahan",
    kahilingan: "false",
    callSign: "JS002",
    function: "Communicators",
    picture: "",
    schedules: [
      { date: "", day: "Wednesday", time: "2:00 PM", service: "PNK" }
    ]
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('print');
  // Use static data instead of fetching from API
  const [data, setData] = useState<{ members: Member[] }>({ members: sampleMembers });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [importedLSOData, setImportedLSOData] = useState<GroupedSchedule[]>([]);

  // Define tabs configuration - REMOVED "crud" tab
  const tabs = [
    { id: 'member-mgmt', label: 'Member Management', icon: UserCog },
    { id: 'print', label: 'Print Suguan', icon: Printer },
    { id: 'import-lso', label: 'Import LSO', icon: Import },
    { id: 'letter', label: 'Recommendation Letter', icon: FileText },
    { id: 'attendance', label: 'Attendance Sheet', icon: CalendarCheck },
    { id: 'masterlist', label: 'Masterlist', icon: ListChecks },
  ];

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

  // Filter members for display
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

        {/* Import LSO Tab */}
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

        {/* Masterlist Tab */}
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
