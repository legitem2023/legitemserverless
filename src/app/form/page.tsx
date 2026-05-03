// app/page.tsx
'use client';

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

export default function Home() {
  const data = records as { members: Member[] };

  // Group schedules
  const groupedSchedules: {
    [key: string]: {
      date: string;
      day: string;
      time: string;
      members: Member[];
    };
  } = {};

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

  // Sort by schedule
  const schedules = Object.values(groupedSchedules).sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`).getTime();
    const dateB = new Date(`${b.date} ${b.time}`).getTime();

    return dateA - dateB;
  });

  return (
    <div className="bg-gray-300 min-h-screen py-10">
      <div className="flex flex-col items-center gap-10">
        {schedules.map((schedule, index) => (
          <div
            key={index}
            className="
              bg-white
              w-[210mm]
              min-h-[297mm]
              p-[15mm]
              shadow-lg
              text-black
            "
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="font-bold text-[14px] uppercase">
                SCAN INTERNATIONAL
              </h1>

              <h2 className="font-semibold text-[13px] uppercase">
                DISTRITO NG RIZAL
              </h2>

              <h3 className="text-[12px] uppercase">
                LOKAL NG KADALAGAHAN
              </h3>

              <p className="text-[11px] uppercase">
                SUGUAN NG SCAN SA PAGSAMBA
              </p>
            </div>

            {/* Schedule Info */}
            <div className="flex justify-between text-[12px] font-semibold mb-3">
              <p>
                Petsa:{' '}
                {new Date(schedule.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>

              <p>Araw: {schedule.day}</p>

              <p>Oras: {schedule.time}</p>
            </div>

            {/* Table */}
            <table className="w-full border-collapse border border-black text-[11px]">
              <thead>
                <tr>
                  <th className="border border-black px-2 py-1 w-[40px]">
                    Blg
                  </th>

                  <th className="border border-black px-2 py-1 text-left">
                    Pangalan
                  </th>

                  <th className="border border-black px-2 py-1 w-[90px]">
                    Call-Sign
                  </th>

                  <th className="border border-black px-2 py-1 w-[120px]">
                    Lagda Pagtanggap
                  </th>

                  <th className="border border-black px-2 py-1 w-[120px]">
                    Lagda Pagtupad
                  </th>

                  <th className="border border-black px-2 py-1 w-[100px]">
                    Gampanin
                  </th>
                </tr>
              </thead>

              <tbody>
                {schedule.members.map((member, idx) => (
                  <tr key={idx}>
                    <td className="border border-black px-2 py-1 text-center">
                      {idx + 1}
                    </td>

                    <td className="border border-black px-2 py-1">
                      {member.name}
                    </td>

                    <td className="border border-black px-2 py-1 text-center">
                      {member.callSign}
                    </td>

                    <td className="border border-black px-2 py-1 h-[32px]"></td>

                    <td className="border border-black px-2 py-1 h-[32px]"></td>

                    <td className="border border-black px-2 py-1"></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signatories */}
            <div className="mt-20 grid grid-cols-2 gap-20 text-center text-[12px]">
              <div>
                <p className="font-semibold uppercase">
                  JUSTINE JACOB RODRIGUEZ
                </p>

                <p>KALIHIM SCAN</p>
              </div>

              <div>
                <p className="font-semibold uppercase">
                  MARLON M. SEVILLA
                </p>

                <p>DESTINADO NG LOKAL</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Print Style */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }

          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
