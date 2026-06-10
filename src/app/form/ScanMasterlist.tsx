'use client';

interface Schedule {
  date: string;
  day: string;
  time: string;
  service?: 'PNK' | 'worship' | 'Distrito';
}

interface ScanMember {
  name: string;
  kapisanan: string;
  kahilingan: string;
  callSign: string;
  function: string | string[];
  schedules: Schedule[];
  picture?: string;
}

interface Props {
  district: string;
  local?: string;
  category:
    | 'Communicators'
    | 'Emergency First Responder (EFR)'
    | 'Associate Members (Not Approved)'
    | 'Associate Members (Approved)';
  members: ScanMember[];
}

export default function ScanMasterlist({
  district,
  category,
  members,
}: Props) {
  const rowsPerPage = 5;

  const transformedMembers = members.map((member) => {
    const parts = member.name.trim().split(' ');
    
    const functionValue = Array.isArray(member.function) 
      ? member.function 
      : member.function ? [member.function] : [];

    return {
      firstName: parts[0] || '',
      middleName: parts.length > 2 ? parts.slice(1, -1).join(' ') : '',
      lastName: parts.length > 1 ? parts[parts.length - 1] : '',
      local: 'KADALAGAHAN',
      scanDate: member.schedules?.[0]?.date
        ? new Date(member.schedules[0].date).toLocaleDateString('en-US')
        : '',
      amateurCallsign: member.callSign,
      internalCallsign: member.callSign,
      associateCategory: member.kapisanan,
      functions: functionValue,
      picture: member.picture || '',
      certificateNumber: '',
    };
  });

  const getSpecialColumnHeader = () => {
    switch (category) {
      case 'Emergency First Responder (EFR)':
        return 'EFR CERTIFICATE SERIAL NUMBER';
      case 'Associate Members (Approved)':
        return 'ASSOCIATE MEMBER CATEGORY';
      case 'Communicators':
      default:
        return 'AMATEUR CALLSIGN';
    }
  };

  const getSpecialColumnValue = (member: typeof transformedMembers[0]) => {
    switch (category) {
      case 'Emergency First Responder (EFR)':
        return member.certificateNumber;
      case 'Associate Members (Approved)':
        return member.associateCategory;
      case 'Communicators':
      default:
        return member.amateurCallsign;
    }
  };

  const totalPages = Math.max(1, Math.ceil(transformedMembers.length / rowsPerPage));

  return (
    <>
      {Array.from({ length: totalPages }).map((_, pageIndex) => {
        const pageMembers = transformedMembers.slice(
          pageIndex * rowsPerPage,
          (pageIndex + 1) * rowsPerPage
        );

        return (
          <div
            key={pageIndex}
            className="
              bg-white
              w-[8.5in]
              min-h-[14in]
              mx-auto
              mb-6
              p-6
              text-black
              print:shadow-none
              print:m-0
              print:break-after-page
            "
          >
            <div className="text-center mb-6">
              <h1 className="font-bold text-[22px]">MASTERLIST NG SCAN SA DISTRITO</h1>
              <p className="italic text-[14px]">{category}</p>
            </div>

            <div className="mb-3 text-sm flex items-center gap-2">
              <span>Distrito:</span>
              <span className="font-bold">{district}</span>
              <div className="border-b border-black flex-1" />
            </div>

            <table className="w-full border-collapse text-[10px] table-fixed">
              <thead>
                <tr>
                  <th rowSpan={2} className="border border-black w-[90px]">
                    ID Picture
                    <br />
                    (1x1)
                  </th>
                  <th colSpan={3} className="border border-black">
                    PANGALAN
                  </th>
                  <th rowSpan={2} className="border border-black w-[90px]">
                    LOKAL
                  </th>
                  <th rowSpan={2} className="border border-black w-[90px]">
                    PETSA NG
                    <br />
                    MAGING SCAN
                  </th>
                  <th rowSpan={2} className="border border-black w-[120px]">
                    {getSpecialColumnHeader()}
                  </th>
                  <th rowSpan={2} className="border border-black w-[90px]">
                    INTERNAL
                    <br />
                    CALLSIGN
                  </th>
                  <th rowSpan={2} className="border border-black w-[160px]">
                    FUNCTION/S
                  </th>
                </tr>
                <tr>
                  <th className="border border-black">FIRST NAME</th>
                  <th className="border border-black">MIDDLE NAME</th>
                  <th className="border border-black">LAST NAME</th>
                </tr>
              </thead>

              <tbody>
                {pageMembers.map((member, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border border-black h-[105px] w-[90px] p-1 align-middle text-center">
                      {member?.picture && member.picture.length > 0 ? (
                        <div className="flex justify-center items-center h-full w-full">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={member.picture}
                            alt="ID"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="text-gray-400 text-[8px]">
                          No Photo
                        </div>
                      )}
                    </td>
                    <td className="border border-black px-1 align-top">
                      {member?.firstName || ''}
                    </td>
                    <td className="border border-black px-1 align-top">
                      {member?.middleName || ''}
                    </td>
                    <td className="border border-black px-1 align-top">
                      {member?.lastName || ''}
                    </td>
                    <td className="border border-black px-1 align-top">
                      {member?.local || ''}
                    </td>
                    <td className="border border-black px-1 align-top">
                      {member?.scanDate || ''}
                    </td>
                    <td className="border border-black px-1 align-top">
                      {getSpecialColumnValue(member)}
                    </td>
                    <td className="border border-black px-1 align-top">
                      {member?.internalCallsign || ''}
                    </td>
                    <td className="border border-black px-1 align-top">
                      {member?.functions && member.functions.length > 0 ? (
                        member.functions.length === 1 ? (
                          member.functions[0]
                        ) : (
                          <ul className="list-disc pl-4 m-0">
                            {member.functions.map((fn, idx) => (
                              <li key={idx}>{fn}</li>
                            ))}
                          </ul>
                        )
                      ) : (
                        ''
                      )}
                    </td>
                  </tr>
                ))}
                {/* Fill empty rows to maintain 5 rows per page */}
                {Array.from({ length: rowsPerPage - pageMembers.length }).map((_, emptyIndex) => (
                  <tr key={`empty-${emptyIndex}`}>
                    <td className="border border-black h-[105px]">&nbsp;</td>
                    <td className="border border-black">&nbsp;</td>
                    <td className="border border-black">&nbsp;</td>
                    <td className="border border-black">&nbsp;</td>
                    <td className="border border-black">&nbsp;</td>
                    <td className="border border-black">&nbsp;</td>
                    <td className="border border-black">&nbsp;</td>
                    <td className="border border-black">&nbsp;</td>
                    <td className="border border-black">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-3 text-xs text-right">
              Page {pageIndex + 1} of {totalPages}
            </div>
          </div>
        );
      })}
    </>
  );
                }
