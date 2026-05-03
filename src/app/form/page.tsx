// app/page.tsx
'use client';

import records from './Data.json';

interface RecordItem {
  name: string;
  callSign: string;
  schedules: {
    date: string;
    day: string;
    time: string;
  }[];
}

export default function Home() {
  const data = records as { members: RecordItem[] };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          SCAN Schedule Records
        </h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Pangalan
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Call Sign
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Mga Schedule
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {data.members.map((member, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {member.name}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {member.callSign}
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {member.schedules.map((schedule, idx) => (
                          <div
                            key={idx}
                            className="border rounded-md p-2 bg-gray-50"
                          >
                            <p>
                              <span className="font-semibold">Date:</span>{' '}
                              {schedule.date}
                            </p>

                            <p>
                              <span className="font-semibold">Day:</span>{' '}
                              {schedule.day}
                            </p>

                            <p>
                              <span className="font-semibold">Time:</span>{' '}
                              {schedule.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
