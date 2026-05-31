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
          min-h-[14in]
          p-6
          text-[10pt]
          leading-normal
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
        {/* Header */}
        <div className="text-center">
          <p className="text-xl font-bold uppercase">Attendance</p>
          <p className="text-lg font-semibold">Orientation Seminar</p>
          <p className="text-lg font-semibold">Associate Membership</p>
        </div>

        {/* Details */}
        <div className="mt-4">
          <p>Lokal ng {local.toUpperCase()}</p>
          <p>Distrito ng {district.toUpperCase()}</p>
          <p>Dako: {venue}</p>
          <p>Petsa: {date}</p>
          <p>Oras: {time}</p>
        </div>

        {/* Description */}
        <div className="mt-3">
          <p className="text-justify">
            Ang lahat ng mga pangalan na nakatala sa ibaba ay ang mga nakatapos
            ng preliminary screening process. Sila din ang naka-kumpleto ng mga
            requirements bago ang deliberasyon ng lokal:
          </p>
        </div>

        {/* Table - 30 rows with original spacing */}
        <table className="mt-3 w-full border-collapse border border-black text-[10pt]">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-black p-2 text-left w-[10%]">Blg</th>
              <th className="border border-black p-2 text-left w-[45%]">Pangalan</th>
              <th className="border border-black p-2 text-left w-[25%]">Lagda</th>
              <th className="border border-black p-2 text-left w-[20%]">Pansin</th>
            </tr>
          </thead>

          <tbody>
            {paddedAttendees.map((attendee, index) => (
              <tr key={index}>
                <td className="border border-black px-2 py-1 align-top">
                  {index + 1}
                </td>
                <td className="border border-black px-2 py-1 align-top">
                  {attendee.name}
                </td>
                <td className="border border-black px-2 py-1 align-top">
                  {attendee.signature || ''}
                </td>
                <td className="border border-black px-2 py-1 align-top">
                  {attendee.remarks || ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Note */}
        <div className="mt-3">
          <p className="text-sm italic">
            <span className="font-semibold">Nota:</span> Lahat lamang ng mga
            naka-kumpleto sa Orientation Seminar ang maaring hilingin ng lokal
            para pagtibayin ng Distrito.
          </p>
        </div>

        {/* Signatories - Reduced top margin */}
        <div className="mt-4">
          <p className="mb-3 font-semibold">Mga Nangasiwa ng Seminar:</p>

          <div className="grid grid-cols-3 gap-x-8 gap-y-4">
            <div className="text-center">
              <p className="font-semibold uppercase">
                {seminarLeaders.secretary}
              </p>
              <p>Kalihim ng SCAN</p>
            </div>

            <div className="text-center">
              <p className="font-semibold uppercase">
                {seminarLeaders.president}
              </p>
              <p>Pangulo ng SCAN</p>
            </div>

            <div className="text-center">
              <p className="font-semibold uppercase">
                {seminarLeaders.overseer}
              </p>
              <p>PD Tagasubaybay</p>
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
