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

/**
 * Start of week (Monday-based)
 */
function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0 Sunday
  const diff = d.getDate() - day + 1;
  return new Date(d.setDate(diff));
}

/**
 * Filipino day mapping
 */
const filipinoDays: Record<string, string> = {
  sunday: 'Linggo',
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miyerkules',
  thursday: 'Huwebes',
  friday: 'Biyernes',
  saturday: 'Sabado',
};

/**
 * Day offset inside a fixed week
 */
const dayOffsets: Record<string, number> = {
  sunday: 6,
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
};

/**
 * Get aligned date inside SAME week
 */
function getAlignedDate(dayName: string) {
  const weekStart = getWeekStart(new Date());
  const offset = dayOffsets[dayName.toLowerCase()] ?? 0;

  const result = new Date(weekStart);
  result.setDate(weekStart.getDate() + offset);

  return result;
}

export default function Home() {
  const data = records as { members: Member[] };

  const groupedSchedules: { [key: string]: GroupedSchedule } = {};

  data.members.forEach((member) => {
    member.schedules.forEach((schedule) => {
      const computedDate = getAlignedDate(schedule.day);
      const key = `${computedDate.toISOString().split('T')[0]}-${schedule.time}`;

      if (!groupedSchedules[key]) {
        groupedSchedules[key] = {
          date: computedDate.toISOString(),
          day: schedule.day,
          time: schedule.time,
          members: [],
        };
      }

      groupedSchedules[key].members.push(member);
    });
  });

  const sortedSchedules = Object.values(groupedSchedules).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

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
          className="bg-black text-white px-4 py-2 text-sm rounded shadow"
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
              <div className="w-[70px] flex justify-start">
                <Image
                  src="/images.png"
                  alt="Logo"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>

              <div className="text-center flex-1">
                <h1 className="font-bold text-[13px] uppercase">
                  SCAN INTERNATIONAL
                </h1>
                <h2 className="font-semibold text-[12px] uppercase">
                  DISTRITO NG RIZAL
                </h2>
                <h3 className="text-[11px] uppercase">
                  LOKAL NG KALADLAGAHAN
                </h3>
                <p className="text-[10px] uppercase">
                  SUGUAN NG SCAN SA PAGSAMBA
                </p>
              </div>

              <div className="w-[70px]" />
            </div>

            {/* TABLES */}
            <div className="space-y-6">
              {formSchedules.map((schedule, idx) => {
                const dateObj = new Date(schedule.date);
                const filipinoDay =
                  filipinoDays[schedule.day.toLowerCase()] ||
                  schedule.day;

                return (
                  <div key={idx} className="break-inside-avoid">

                    <table className="w-full border border-black text-[10px]">

                      {/* HEADER ROW */}
                      <thead>
                        <tr>
                          <th colSpan={2} className="border px-2 py-1 text-left">
                            Petsa:{' '}
                            {dateObj.toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </th>

                          <th colSpan={2} className="border px-2 py-1 text-left">
                            Araw: {filipinoDay}
                          </th>

                          <th colSpan={2} className="border px-2 py-1 text-left">
                            Oras: {schedule.time}
                          </th>
                        </tr>

                        <tr>
                          <th className="border px-1 py-1 w-[35px]">Blg</th>
                          <th className="border px-2 py-1 text-left">
                            Pangalan
                          </th>
                          <th className="border px-1 py-1 w-[75px]">
                            Call-Sign
                          </th>
                          <th className="border px-1 py-1 w-[95px]">
                            Lagda Pagtanggap
                          </th>
                          <th className="border px-1 py-1 w-[95px]">
                            Lagda Pagtupad
                          </th>
                          <th className="border px-1 py-1 w-[70px]">
                            Gampanin
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {schedule.members.map((member, i) => (
                          <tr key={i}>
                            <td className="border text-center py-1">
                              {i + 1}
                            </td>
                            <td className="border px-2 py-1">
                              {member.name}
                            </td>
                            <td className="border text-center py-1">
                              {member.callSign}
                            </td>
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

            {/* SIGNATORIES */}
            <div className="mt-14 text-[11px]">
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
        }
      `}</style>
    </div>
  );
}
