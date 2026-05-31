'use client';

interface Attendee {
  name: string;
  signature?: string;
  remarks?: string;
}

interface AttendanceSheetProps {
  local: string;
  district: string;
  venue: string;
  date: string;
  time: string;
  attendees: Attendee[];
  seminarLeaders: {
    secretary: string;
    president: string;
    overseer: string;
  };
  maxAttendees?: number;
}

export default function AttendanceSheet({
  local,
  district,
  venue,
  date,
  time,
  attendees,
  seminarLeaders,
  maxAttendees = 30,
}: AttendanceSheetProps) {
  // Pad attendees array to maxAttendees
  const paddedAttendees = [...attendees];
  while (paddedAttendees.length < maxAttendees) {
    paddedAttendees.push({ name: '' });
  }

  return (
    <div className="flex flex-col items-center bg-gray-100 p-4 print:bg-white">
      <button
        onClick={() => window.print()}
        className="mb-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 print:hidden"
      >
        Print Attendance Sheet
      </button>

      <div
        className="
          bg-white
          text-black
          shadow-lg
          print:shadow-none
          w-[8.5in]
          h-[14in]
          p-4
          text-[10pt]
          leading-tight
          font-sans
        "
        style={{
          boxSizing: 'border-box',
          margin: 0,
          marginTop: 0,
          position: 'relative',
          top: 0,
        }}
      >
        {/* Header - Compact */}
        <div className="text-center">
          <p className="text-base font-bold uppercase">Attendance</p>
          <p className="text-sm font-semibold">Orientation Seminar</p>
          <p className="text-sm font-semibold">Associate Membership</p>
        </div>

        {/* Details - Compact */}
        <div className="mt-2 text-[9pt]">
          <p>Lokal ng {local.toUpperCase()}</p>
          <p>Distrito ng {district.toUpperCase()}</p>
          <p>Dako: {venue}</p>
          <p>Petsa: {date}</p>
          <p>Oras: {time}</p>
        </div>

        {/* Description - Compact */}
        <div className="mt-2">
          <p className="text-justify text-[9pt] leading-tight">
            Ang lahat ng mga pangalan na nakatala sa ibaba ay ang mga nakatapos
            ng preliminary screening process. Sila din ang naka-kumpleto ng mga
            requirements bago ang deliberasyon ng lokal:
          </p>
        </div>

        {/* Table - Very Compact for 30 rows */}
        <table className="mt-2 w-full border-collapse border border-black text-[8pt]">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-black p-0.5 text-left w-[8%] text-[8pt]">Blg</th>
              <th className="border border-black p-0.5 text-left w-[47%] text-[8pt]">Pangalan</th>
              <th className="border border-black p-0.5 text-left w-[25%] text-[8pt]">Lagda</th>
              <th className="border border-black p-0.5 text-left w-[20%] text-[8pt]">Pansin</th>
            </tr>
          </thead>

          <tbody>
            {paddedAttendees.map((attendee, index) => (
              <tr key={index}>
                <td className="border border-black px-1 py-0 align-top text-[8pt]">
                  {index + 1}
                </td>
                <td className="border border-black px-1 py-0 align-top text-[8pt]">
                  {attendee.name}
                </td>
                <td className="border border-black px-1 py-0 align-top text-[8pt]">
                  {attendee.signature || ''}
                </td>
                <td className="border border-black px-1 py-0 align-top text-[8pt]">
                  {attendee.remarks || ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Note - Compact */}
        <div className="mt-2">
          <p className="text-[8pt] italic leading-tight">
            <span className="font-semibold">Nota:</span> Lahat lamang ng mga
            naka-kumpleto sa Orientation Seminar ang maaring hilingin ng lokal
            para pagtibayin ng Distrito.
          </p>
        </div>

        {/* Signatories - Compact */}
        <div className="mt-3">
          <p className="mb-1 font-semibold text-[9pt]">Mga Nangasiwa ng Seminar:</p>

          <div className="grid grid-cols-3 gap-x-4 gap-y-1">
            <div className="text-center">
              <p className="font-semibold uppercase text-[8pt]">
                {seminarLeaders.secretary}
              </p>
              <p className="text-[7pt]">Kalihim ng SCAN</p>
            </div>

            <div className="text-center">
              <p className="font-semibold uppercase text-[8pt]">
                {seminarLeaders.president}
              </p>
              <p className="text-[7pt]">Pangulo ng SCAN</p>
            </div>

            <div className="text-center">
              <p className="font-semibold uppercase text-[8pt]">
                {seminarLeaders.overseer}
              </p>
              <p className="text-[7pt]">PD Tagasubaybay</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: legal;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
          }
          html,
          body {
            height: auto;
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
