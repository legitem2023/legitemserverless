'use client';

interface Member {
  name: string;
  kapisanan: string;
  recruitedBy?: string;
}

interface Props {
  date: string;
  districtMinister: string;
  local: string;
  district: string;
  members: Member[];
}

export default function ScanRecommendationLetter({
  date,
  districtMinister,
  local,
  district,
  members,
}: Props) {
  return (
    <div className="flex flex-col items-center bg-gray-100 p-4 print:bg-white">
      <button
        onClick={() => window.print()}
        className="mb-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 print:hidden"
      >
        Print
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
          text-[11pt]
          leading-normal
        "
        style={{ 
          boxSizing: 'border-box',
          margin: 0,
          marginTop: 0,
          position: 'relative',
          top: 0,
        }}
      >
        {/* Header - Left aligned */}
        <div className="leading-tight">
          <p className="font-bold">IGLESIA NI CRISTO</p>
          <p>LOKAL NG {local.toUpperCase()}</p>
          <p>DISTRITO EKLESIASTIKO NG {district.toUpperCase()}</p>
        </div>

        {/* Date */}
        <div className="mt-6">
          <p>{date}</p>
        </div>

        {/* Recipient */}
        <div className="mt-6">
          <p>Kapatid na {districtMinister}</p>
          <p>Tagapangasiwa ng Distrito</p>
        </div>

        {/* Body */}
        <div className="mt-6">
          <p>Mahal na kapatid,</p>

          <p className="mt-3 text-justify indent-8">
            Magalang po naming hinihiling na inyong mapagtibay ang mga kapatid
            na nagnanais na tumanggap ng gampanin sa Iglesia bilang Associate
            Member ng samahang SCAN sa aming lokal.
          </p>

          <p className="mt-3">
            Sila po ay ang mga sumusunod:
          </p>
        </div>

        {/* Table - 15 rows */}
        <table className="mt-3 w-full border-collapse border border-black text-[10pt]">
          <thead>
            <tr>
              <th className="border border-black p-1 text-left w-[8%]">Blg.</th>
              <th className="border border-black p-1 text-left w-[37%]">
                Pangalan
              </th>
              <th className="border border-black p-1 text-left w-[25%]">
                Kapisanan
              </th>
              <th className="border border-black p-1 text-left w-[30%]">
                Nag recruit na Ministro/Manggagawa
              </th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 15 }).map((_, index) => {
              const member = members[index];

              return (
                <tr key={index}>
                  <td className="border border-black px-2 py-1 align-top">
                    {index + 1}
                  </td>
                  <td className="border border-black px-2 py-1 align-top">
                    {member?.name || ''}
                   </td>
                  <td className="border border-black px-2 py-1 align-top">
                    {member?.kapisanan || ''}
                   </td>
                  <td className="border border-black px-2 py-1 align-top">
                    {member?.recruitedBy || ''}
                   </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Closing statement */}
        <p className="mt-4">
          Anuman po ang inyong magiging pasya ay lubos po naming susundin at
          igagalang.
        </p>

        {/* Closing remark */}
        <p className="mt-6">
          Ang inyo pong mga kapatid sa Panginoon,
        </p>

        {/* Signatories - 3 columns */}
        <div className="mt-8">
          <div className="grid grid-cols-3 gap-x-8 gap-y-6">
            <div className="text-center">
              <p className="font-semibold uppercase">BONNARD JOSE ARAULLO</p>
              <p>V-Pangulong Diakono</p>
            </div>

            <div className="text-center">
              <p className="font-semibold uppercase">MARIANO LEBARDO JR</p>
              <p>IV-Pangulong Diakono</p>
            </div>

            <div className="text-center">
              <p className="font-semibold uppercase">NORMAN ARAULLO</p>
              <p>III-Pangulong Diakono</p>
            </div>

            <div className="text-center">
              <p className="font-semibold uppercase">ALVIN ADAME</p>
              <p>II-Pangulong Diakono</p>
            </div>

            <div className="text-center">
              <p className="font-semibold uppercase">RODELLO DELA PAZ</p>
              <p>Pangulong Diakono</p>
            </div>

            <div className="text-center">
              <p className="font-semibold uppercase">MARLON SEVILLA</p>
              <p>Pastor</p>
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
          html, body {
            height: auto;
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
