'use client';

import Image from 'next/image';

interface Member {
  name: string;
  kapisanan: string;
  kahilingan: string;
  callSign: string;
  function: string | string[];
  picture: string;
  schedules: Schedule[];
}

interface Schedule {
  date: string;
  day: string;
  time: string;
  service?: 'PNK' | 'worship' | 'Distrito';
}

interface GroupedSchedule {
  date: string;
  day: string;
  time: string;
  service: string;
  members: Member[];
}

interface PrintableSuguanProps {
  forms: GroupedSchedule[][];
  filipinoDays: Record<string, string>;
}

export function PrintableSuguan({ forms, filipinoDays }: PrintableSuguanProps) {
  return (
    <div className="flex p-5 flex-col gap-3 print:block print:p-0 print:m-0">
      {forms.map((formSchedules, formIndex) => (
        <div
          key={formIndex}
          className="bg-white w-[210mm] min-h-[297mm] shadow-lg text-black print:shadow-none print:page-break-after-always print:m-0 print:p-0 print:pt-[10mm] m-0 p-0 overflow-hidden"
        >
          {/* Header Section with vertically centered logo and text */}
          <div className="flex items-center justify-between mb-4 pt-4 pl-4 pr-4">
            <div className="w-[100px] flex items-center">
              <Image
                src="/images.png"
                alt="Logo"
                width={100}
                height={100}
                className="object-contain"
                priority
              />
            </div>

            <div className="text-center flex-1">
              <h1 className="font-bold text-[13px] uppercase leading-tight">SCAN INTERNATIONAL</h1>
              <h2 className="font-semibold text-[12px] uppercase leading-tight">DISTRITO NG RIZAL</h2>
              <h3 className="text-[11px] uppercase leading-tight">LOKAL NG KADALAGAHAN</h3>
              <p className="text-[10px] uppercase leading-tight mt-1">
                {formIndex === 2 ? 'SUGUAN NG SCAN SA PNK' : 
                 formIndex === 3 ? 'SUGUAN NG PAGBABANTAY SA DISTRITO' : 
                 'SUGUAN NG SCAN SA PAGSAMBA'}
              </p>
            </div>

            <div className="w-[70px]" />
          </div>

          {/* Schedules Section */}
          <div className="space-y-6 pl-4 pr-4">
            {formSchedules.map((schedule, idx) => {
              const dateObj = new Date(schedule.date);
              const filipinoDay = filipinoDays[schedule.day.toLowerCase()] || schedule.day;

              return (
                <div key={idx} className="break-inside-avoid">
                  <table className="w-full border border-black text-[10px] table-fixed">
                    <thead>
                      <tr>
                        <th colSpan={5} className="border px-2 py-1 text-left font-semibold" style={{ width: '33.33%' }}>
                          Petsa: {dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </th>
                        <th colSpan={2} className="border px-2 py-1 text-left font-semibold" style={{ width: '33.33%' }}>
                          Araw: {filipinoDay}
                        </th>
                        <th colSpan={2} className="border px-2 py-1 text-left font-semibold" style={{ width: '33.33%' }}>
                          Oras: {schedule.time}
                        </th>
                      </tr>
                      <tr className="bg-gray-50">
                        <th className="border px-1 py-1 font-semibold">Blg</th>
                        <th colSpan={4} className="border px-2 py-1 text-left font-semibold">Pangalan</th>
                        <th className="border px-1 py-1 font-semibold">Call-Sign</th>
                        <th className="border px-1 py-1 font-semibold">Lagda Pagtanggap</th>
                        <th className="border px-1 py-1 font-semibold">Lagda Pagtupad</th>
                        <th className="border px-1 py-1 font-semibold">Gampanin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.members.map((member, i) => (
                        <tr key={i}>
                          <td className="border text-center py-1">{i + 1}</td>
                          <td colSpan={4} className="border px-2 py-1">{member.name}</td>
                          <td className="border text-center py-1 font-mono text-xs">{member.callSign}</td>
                          <td className="border h-[24px]" />
                          <td className="border h-[24px]" />
                          <td className="border" />
                        </td>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>

          {/* Footer Signatures Section */}
          <div className="mt-14 text-[11px] pl-4 pr-4 pb-4">
            <p className="mb-6">Naghanda:</p>
            <div className="grid grid-cols-2 gap-20">
              <div className="text-center">
                <p className="font-semibold uppercase">JUSTINE JACOB RODRIGUEZ</p>
                <p className="text-[10px]">KALIHIM SCAN</p>
              </div>
              <div className="text-center">
                <p className="font-semibold uppercase"></p>
                <p className="text-[10px]">PANGULO NG SCAN</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-20 mt-12">
              <div className="text-center">
                <p className="font-semibold uppercase">MARIANO M. LEBARDO JR.</p>
                <p className="text-[10px]">PD - TAGASUBAYBAY</p>
              </div>
              <div className="text-center">
                <p className="font-semibold uppercase">RODOLFO DE GUZMAN</p>
                <p className="text-[10px]">DESTINADO NG LOKAL</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
