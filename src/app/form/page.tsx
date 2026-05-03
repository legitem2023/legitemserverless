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

  // Group schedules by date + time
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

  const schedules = Object.values(groupedSchedules);

  return (
    <div className="min-h-screen bg-gray-200 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        {schedules.map((schedule, index) => (
          <div
            key={index}
            className="bg-white border border-gray-400 p-6 shadow-sm"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="font-bold text-sm uppercase">
                SCAN INTERNATIONAL
              </h1>

              <h2 className="font-semibold text-sm uppercase">
                DISTRITO NG RIZAL
              </h2>

              <h3 className="text-sm uppercase">
                LOKAL NG KALADLAGAHAN
              </h3>

              <p className="text-xs uppercase">
                SUGUAN NG SCAN SA PAGSAMBA
              </p>
            </div>

            {/* Schedule Info */}
            <div className="flex justify-between text-sm font-semibold mb-2">
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
            <table className="w-full border-collapse border border-black text-sm">
              <thead>
                <tr>
                  <th className="border border-black px-2 py-1 w-14">Blg</th>

                  <th className="border border-black px-2 py-1 text-left">
                    Pangalan
                  </th>

                  <th className="border border-black px-2 py-1">
                    Call-Sign
                  </th>

                  <th className="border border-black px-2 py-1">
                    Lagda Pagtanggap
                  </th>

                  <th className="border border-black px-2 py-1">
                    Lagda Pagtupad
                  </th>

                  <th className="border border-black px-2 py-1">
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

                    <td className="border border-black px-2 py-1"></td>

                    <td className="border border-black px-2 py-1"></td>

                    <td className="border border-black px-2 py-1"></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div className="mt-10 grid grid-cols-2 gap-10 text-center text-sm">
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
    </div>
  );
}
