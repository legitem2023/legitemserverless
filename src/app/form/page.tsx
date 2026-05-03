'use client';

import Image from 'next/image';
import records from './Data.json';

interface Schedule {
  date: string;
  day: string;
  time: string;
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
  members: Member[];
}

export default function Home() {
  const data = records as { members: Member[] };

  const groupedSchedules: { [key: string]: GroupedSchedule } = {};

  data.members.forEach((member) => {
    member.schedules.forEach((schedule) => {
      const key = `${schedule.date}-${schedule.time}`;

      if (!groupedSchedules[key]) {
        groupedSchedules[key] = {
          date: schedule.date,
          day: schedule.day,
          time: schedule.time,
          members: [],
        };
      }

      groupedSchedules[key].members.push(member);
    });
  });

  const sortedSchedules = Object.values(groupedSchedules).sort((a, b) => {
    return (
      new Date(`${a.date} ${a.time}`).getTime() -
      new Date(`${b.date} ${b.time}`).getTime()
    );
  });

  const forms = [
    sortedSchedules.filter(
      (s) =>
        s.day.toLowerCase() === 'wednesday' ||
        s.day.toLowerCase() === 'thursday'
    ),
    sortedSchedules.filter(
      (s) =>
        s.day.toLowerCase() === 'saturday' ||
        s.day.toLowerCase() === 'sunday'
    ),
  ];

  return (
    <div className="bg-gray-300 min-h-screen py-10 print:bg-white">

      {/* PRINT BUTTON */}
      <div className="fixed top-5 right-5 print:hidden z-50">
        <button
          onClick={() => window.print()}
          className="bg-black text-white px-4 py-2 text-sm rounded shadow hover:bg-gray-800"
        >
          Print
        </button>
      </div>

      <div className="flex flex-col items-center gap-10">
        {forms.map((formSchedules, formIndex) => (
          <div
            key={formIndex}
            className="
              bg-white
              w-[210mm]
              min-h-[297mm]
              p-[12mm]
              shadow-lg
              text-black
              print:shadow-none
              print:page-break-after-always
            "
          >
            {/* HEADER */}
            <div className="flex items-start justify-between mb-4">
              {/* LOGO */}
              <div className="w-[70px] flex justify-start">
                <Image
                  src="/images.png"
                  alt="Logo"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>

              {/* TITLE */}
              <div className="text-center flex-1">
                <h1 className="font-bold text-[13px] uppercase">
                  SCAN INTERNATIONAL
                </h1>
                <h2 className="font-semibold text-[12px] uppercase">
                  DISTRITO NG RIZAL
                </h2>
                <h3 className="text-[11px] uppercase">
                  LOKAL NG KADALAGAHAN
                </h3>
                <p className="text-[10px] uppercase">
                  SUGUAN NG SCAN SA PAGSAMBA
                </p>
              </div>

              <div className="w-[70px]" />
            </div>

            {/* SCHEDULES */}
            <div className="space-y-6">
              {formSchedules.map((schedule, scheduleIndex) => (
                <div key={scheduleIndex} className="break-inside-avoid">
                  <table className="w-full border border-black text-[10px]">
                    <thead>
                      <tr>
                        <th
                          colSpan={2}
                          className="border border-black px-2 py-1 text-left"
                        >
                          Petsa:{' '}
                          {new Date(schedule.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </th>

                        <th
                          colSpan={2}
                          className="border border-black px-2 py-1 text-left"
                        >
                          Araw: {schedule.day}
                        </th>

                        <th
                          colSpan={2}
                          className="border border-black px-2 py-1 text-left"
                        >
                          Oras: {schedule.time}
                        </th>
                      </tr>

                      <tr>
                        <th className="border border-black px-1 py-1 w-[35px]">
                          Blg
                        </th>
                        <th className="border border-black px-2 py-1 text-left">
                          Pangalan
                        </th>
                        <th className="border border-black px-1 py-1 w-[75px]">
                          Call-Sign
                        </th>
                        <th className="border border-black px-1 py-1 w-[95px]">
                          Lagda Pagtanggap
                        </th>
                        <th className="border border-black px-1 py-1 w-[95px]">
                          Lagda Pagtupad
                        </th>
                        <th className="border border-black px-1 py-1 w-[70px]">
                          Gampanin
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {schedule.members.map((member, idx) => (
                        <tr key={idx}>
                          <td className="border border-black text-center py-1">
                            {idx + 1}
                          </td>
                          <td className="border border-black px-2 py-1">
                            {member.name}
                          </td>
                          <td className="border border-black text-center py-1">
                            {member.callSign}
                          </td>
                          <td className="border border-black h-[24px]" />
                          <td className="border border-black h-[24px]" />
                          <td className="border border-black" />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            {/* SIGNATORIES */}
            <div className="mt-14 text-[11px] print:mt-10">
              <p className="mb-6">Naghanda:</p>

              <div className="grid grid-cols-2 gap-20">
                <div className="text-center">
                  <p className="font-semibold uppercase">
                    JUSTINE JACOB RODRIGUEZ
                  </p>
                  <p>KALIHIM SCAN</p>
                </div>

                <div className="text-center">
                  <p className="font-semibold uppercase">
                    ______________________
                  </p>
                  <p>PANGULO NG SCAN</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-20 mt-12">
                <div className="text-center">
                  <p className="font-semibold uppercase">
                    MARIANO M. LEBRADO JR.
                  </p>
                  <p>PD - TAGASUBAYBAY</p>
                </div>

                <div className="text-center">
                  <p className="font-semibold uppercase">
                    MARLON M. SEVILLA
                  </p>
                  <p>DESTINADO NG LOKAL</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PRINT STYLES */}
      <style jsx global>{`
        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          body {
            background: white !important;
          }

          .print\\:shadow-none {
            box-shadow: none !important;
          }

          .print\\:page-break-after-always {
            page-break-after: always;
          }

          .print\\:mt-10 {
            margin-top: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
