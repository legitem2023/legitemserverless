'use client';

interface Member {
  firstName: string;
  middleName?: string;
  lastName: string;
  local: string;
  scanDate?: string;
  amateurCallsign?: string;
  internalCallsign?: string;
  certificateNumber?: string;
  category?: string;
  picture?: string;
}

interface Props {
  district: string;
  category: string;
  members: Member[];
}

export default function ScanMasterlist({
  district,
  category,
  members,
}: Props) {
  const rowsPerPage = 5;

  const pages = [];

  for (let i = 0; i < members.length || i === 0; i += rowsPerPage) {
    pages.push(members.slice(i, i + rowsPerPage));
  }

  return (
    <>
      {pages.map((page, pageIndex) => (
        <div
          key={pageIndex}
          className="bg-white w-[8.5in] min-h-[14in] p-6 mx-auto mb-4 print:mb-0 print:break-after-page"
        >
          <div className="text-center">
            <h1 className="font-bold text-lg">
              MASTERLIST NG SCAN SA DISTRITO
            </h1>

            <p className="italic text-sm">{category}</p>
          </div>

          <div className="mt-4 text-sm">
            <span className="font-semibold">Distrito:</span>
            <span className="ml-2 font-bold">{district}</span>
          </div>

          <table className="w-full border-collapse border border-black mt-3 text-[10px]">
            <thead>
              <tr>
                <th className="border border-black w-[80px]">
                  ID Picture
                  <br />
                  (1x1)
                </th>

                <th
                  colSpan={3}
                  className="border border-black"
                >
                  PANGALAN
                </th>

                <th className="border border-black">
                  LOKAL
                </th>

                <th className="border border-black">
                  PETSA NG
                  <br />
                  MAGING SCAN
                </th>

                {category.includes('EFR') ? (
                  <th className="border border-black">
                    EFR Certificate
                    <br />
                    Serial Number
                  </th>
                ) : category.includes('Associate') ? (
                  <th className="border border-black">
                    ASSOCIATE MEMBER
                    <br />
                    CATEGORY
                  </th>
                ) : (
                  <th className="border border-black">
                    AMATEUR
                    <br />
                    CALLSIGN
                  </th>
                )}

                <th className="border border-black">
                  INTERNAL
                  <br />
                  CALLSIGN
                </th>
              </tr>

              <tr>
                <th className="border border-black"></th>

                <th className="border border-black">
                  FIRST NAME
                </th>

                <th className="border border-black">
                  MIDDLE NAME
                </th>

                <th className="border border-black">
                  LAST NAME
                </th>

                <th className="border border-black"></th>
                <th className="border border-black"></th>
                <th className="border border-black"></th>
                <th className="border border-black"></th>
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: rowsPerPage }).map(
                (_, rowIndex) => {
                  const member = page[rowIndex];

                  return (
                    <tr key={rowIndex}>
                      <td className="border border-black h-[90px]">
                        {member?.picture && (
                          <img
                            src={member.picture}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                      </td>

                      <td className="border border-black px-1">
                        {member?.firstName || ''}
                      </td>

                      <td className="border border-black px-1">
                        {member?.middleName || ''}
                      </td>

                      <td className="border border-black px-1">
                        {member?.lastName || ''}
                      </td>

                      <td className="border border-black px-1">
                        {member?.local || ''}
                      </td>

                      <td className="border border-black px-1">
                        {member?.scanDate || ''}
                      </td>

                      <td className="border border-black px-1">
                        {category.includes('EFR')
                          ? member?.certificateNumber
                          : category.includes('Associate')
                          ? member?.category
                          : member?.amateurCallsign}
                      </td>

                      <td className="border border-black px-1">
                        {member?.internalCallsign || ''}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}
