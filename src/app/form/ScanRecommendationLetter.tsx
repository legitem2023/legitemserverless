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
          h-[14in]
          p-4
          text-[11pt]
          leading-tight
        "
        style={{ boxSizing: 'border-box' }}
      >
        {/* Header - Tighter */}
        <div className="text-center leading-tight">
          <p className="font-bold text-[10pt]">IGLESIA NI CRISTO</p>
          <p className="text-[10pt]">LOKAL NG {local.toUpperCase()}</p>
          <p className="text-[10pt]">DISTRITO EKLESIASTIKO NG {district.toUpperCase()}</p>
        </div>

        {/* Date - Minimal spacing */}
        <div className="mt-2">
          <p className="text-[10pt]">{date}</p>
        </div>

        {/* Recipient - Minimal spacing */}
        <div className="mt-3">
          <p className="text-[10pt]">Kapatid na {districtMinister}</p>
          <p className="text-[10pt]">Tagapangasiwa ng Distrito</p>
        </div>

        {/* Body - Compact */}
        <div className="mt-3">
          <p className="text-[10pt]">Mahal na kapatid,</p>

          <p className="mt-2 text-justify indent-6 text-[10pt] leading-tight">
            Magalang po naming hinihiling na inyong mapagtibay ang mga kapatid
            na nagnanais na tumanggap ng gampanin sa Iglesia bilang Associate
            Member ng samahang SCAN sa aming lokal.
          </p>

          <p className="mt-2 text-[10pt]">
            Sila po ay ang mga sumusunod:
          </p>
        </div>

        {/* Table - Compact rows */}
        <table className="mt-2 w-full border-collapse border border-black text-[9pt]">
          <thead>
            <tr>
              <th className="border border-black px-1 py-0.5 text-left w-[8%]">Blg.</th>
              <th className="border border-black px-1 py-0.5 text-left w-[37%]">
                Pangalan
              </th>
              <th className="border border-black px-1 py-0.5 text-left w-[25%]">
                Kapisanan
              </th>
              <th className="border border-black px-1 py-0.5 text-left w-[30%]">
                Nag recruit
              </th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 15 }).map((_, index) => {
              const member = members[index];

              return (
                <tr key={index}>
                  <td className="border border-black px-1 py-0.5 text-center align-top">
                    {index + 1}
                   </td>

                  <td className="border border-black px-1 py-0.5 align-top">
                    {member?.name || ''}
                   </td>

                  <td className="border border-black px-1 py-0.5 align-top">
                    {member?.kapisanan || ''}
                   </td>

                  <td className="border border-black px-1 py-0.5 align-top">
                    {member?.recruitedBy || ''}
                   </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Closing statement */}
        <p className="mt-2 text-[10pt]">
          Anuman po ang inyong magiging pasya ay lubos po naming susundin at
          igagalang.
        </p>

        {/* Closing remark */}
        <p className="mt-3 text-[10pt]">
          Ang inyo pong mga kapatid sa Panginoon,
        </p>

        {/* Signatories - 2 columns, compact */}
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-center">
          <div>
            <p className="font-semibold uppercase text-[9pt] leading-tight">BONNARD JOSE ARAULLO</p>
            <p className="text-[9pt]">V-Pangulong Diakono</p>
          </div>

          <div>
            <p className="font-semibold uppercase text-[9pt] leading-tight">MARIANO LEBARDO JR</p>
            <p className="text-[9pt]">IV-Pangulong Diakono</p>
          </div>

          <div>
            <p className="font-semibold uppercase text-[9pt] leading-tight">NORMAN</p>
            <p className="text-[9pt]">III-Pangulong Diakono</p>
          </div>

          <div>
            <p className="font-semibold uppercase text-[9pt] leading-tight">ALVI ADAME</p>
            <p className="text-[9pt]">II-Pangulong Diakono</p>
          </div>

          <div>
            <p className="font-semibold uppercase text-[9pt] leading-tight">RODELLO DELA PAZ</p>
            <p className="text-[9pt]">Pangulong Diakono</p>
          </div>

          <div>
            <p className="font-semibold uppercase text-[9pt] leading-tight">MARLON SEVILLA</p>
            <p className="text-[9pt]">Pastor</p>
          </div>
        </div>
      </div>
    </div>
  );
}
