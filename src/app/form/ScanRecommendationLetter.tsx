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
          p-[0.75in]
          text-[12pt]
          leading-normal
        "
      >
        {/* Header */}
        <div className="leading-tight">
          <p className="font-bold">IGLESIA NI CRISTO</p>
          <p>LOKAL NG {local.toUpperCase()}</p>
          <p>DISTRITO EKLESIASTIKO NG {district.toUpperCase()}</p>
        </div>

        <div className="mt-8">
          <p>{date}</p>
        </div>

        <div className="mt-8">
          <p>Kapatid na {districtMinister}</p>
          <p>Tagapangasiwa ng Distrito</p>
        </div>

        <div className="mt-8">
          <p>Mahal na kapatid,</p>

          <p className="mt-4 text-justify indent-10">
            Magalang po naming hinihiling na inyong mapagtibay ang mga kapatid
            na nagnanais na tumanggap ng gampanin sa Iglesia bilang Associate
            Member ng samahang SCAN sa aming lokal.
          </p>

          <p className="mt-4">
            Sila po ay ang mga sumusunod:
          </p>
        </div>

        {/* Table */}
        <table className="mt-4 w-full border-collapse border border-black">
          <thead>
            <tr>
              <th className="border border-black p-1 text-left">Blg.</th>
              <th className="border border-black p-1 text-left">
                Pangalan
              </th>
              <th className="border border-black p-1 text-left">
                Kapisanan
              </th>
              <th className="border border-black p-1 text-left">
                Nag recruit na Ministro/Manggagawa
              </th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 15 }).map((_, index) => {
              const member = members[index];

              return (
                <tr key={index}>
                  <td className="h-8 border border-black px-2">
                    {index + 1}
                  </td>

                  <td className="border border-black px-2">
                    {member?.name || ''}
                  </td>

                  <td className="border border-black px-2">
                    {member?.kapisanan || ''}
                  </td>

                  <td className="border border-black px-2">
                    {member?.recruitedBy || ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <p className="mt-4">
          Anuman po ang inyong magiging pasya ay lubos po naming susundin at
          igagalang.
        </p>

        <p className="mt-8">
          Ang inyo pong mga kapatid sa Panginoon,
        </p>

        {/* Signatories */}
        <div className="mt-12 grid grid-cols-3 gap-y-12 text-center">
          <div>
            <p className="font-semibold uppercase">
              BONNARD JOSE ARAULLO
            </p>
            <p>V-Pangulong Diakono</p>
          </div>

          <div>
            <p className="font-semibold uppercase">
              MARIANO LEBARDO JR
            </p>
            <p>IV-Pangulong Diakono</p>
          </div>

          <div>
            <p className="font-semibold uppercase">
              NORMAN
            </p>
            <p>III-Pangulong Diakono</p>
          </div>

          <div>
            <p className="font-semibold uppercase">
              ALVI ADAME
            </p>
            <p>II-Pangulong Diakono</p>
          </div>

          <div>
            <p className="font-semibold uppercase">
              RODELLO DELA PAZ
            </p>
            <p>Pangulong Diakono</p>
          </div>

          <div>
            <p className="font-semibold uppercase">
              MARLON SEVILLA
            </p>
            <p>Pastor</p>
          </div>
        </div>

        {/* Approval */}
        <div className="mt-16">
          <div className="border border-black py-2 text-center font-bold">
            PAGPAPATIBAY NG DISTRITO
          </div>

          <table className="w-full border-collapse border-x border-b border-black">
            <tbody>
              <tr>
                <td className="border border-black p-2 text-center">
                  NAGSIYASAT SA DISTRITO
                </td>
                <td className="border border-black p-2 text-center">
                  PINAGTIBAY
                </td>
              </tr>

              <tr>
                <td className="h-24 border border-black" />
                <td className="border border-black" />
              </tr>

              <tr>
                <td className="border border-black p-2 text-center">
                  PETSA
                </td>

                <td className="border border-black p-2 text-center">
                  PETSA
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
