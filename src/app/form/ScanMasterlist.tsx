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
  Petsa_ng_maging_scan?: string;  // New field
  Pagpapatibay?: string;          // New field
  AssociateCategory?: string;     // New field
  AmatureCallsign?: string;       // New field
}

interface Props {
  district: string;
  local?: string;
  category:
    | 'Communicators'
    | 'Emergency First Responder (EFR)'
    | 'Associate Members (Approved)'
    | 'Associate Members (Not Approved)';
  members: ScanMember[];
}

export default function ScanMasterlist({
  district,
  category,
  members,
}: Props) {
  const rowsPerPage = 6; // Increased for landscape

const transformedMembers = members.map((member) => {
  const parts = member.name.trim().split(' ');
  
  const functionValue = Array.isArray(member.function) 
    ? member.function 
    : member.function ? [member.function] : [];

  let firstName, lastName;
  
  if (parts.length === 1) {
    firstName = parts[0];
    lastName = '';
  } else {
    firstName = parts.slice(0, -1).join(' ');
    lastName = parts[parts.length - 1];
  }

  return {
    firstName: firstName,
    middleName: '',
    lastName: lastName,
    local: 'KADALAGAHAN',
    scanDate: member.Petsa_ng_maging_scan,
    amateurCallsign: member.AmatureCallsign,
    internalCallsign: member.callSign,
    associateCategory: member.AssociateCategory,
    pagpapatibay: member.Pagpapatibay || '',
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
      case 'Associate Members (Not Approved)':
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
      case 'Associate Members (Not Approved)':
        return member.associateCategory;
      case 'Communicators':
      default:
        return member.amateurCallsign;
    }
  };

  const totalPages = Math.max(1, Math.ceil(transformedMembers.length / rowsPerPage));

  // Don't render if no members
  if (members.length === 0) {
    return null;
  }

  return (
    <div className="print-container">
      <style jsx global>{`
        @media print {
          @page {
            size: landscape;
            margin: 0.5in;
          }
          body {
            margin: 0;
            padding: 0;
          }
          .print-container {
            margin: 0;
            padding: 0;
          }
          .no-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .page-break {
            page-break-after: always;
            break-after: page;
          }
        }
      `}</style>

      {Array.from({ length: totalPages }).map((_, pageIndex) => {
        const pageMembers = transformedMembers.slice(
          pageIndex * rowsPerPage,
          (pageIndex + 1) * rowsPerPage
        );

        return (
          <div
            key={pageIndex}
            className="
              page-break
              bg-white
              w-[11in]
              min-h-[8.5in]
              mx-auto
              mb-4
              p-4
              text-black
              print:shadow-none
              print:m-0
              print:p-4
            "
          >
            {/* Header */}
            <div className="text-center mb-4" style={{ fontFamily: 'Times New Roman, serif' }}>
              <h1 className="font-bold text-[20px]">MASTERLIST NG SCAN SA DISTRITO</h1>
              <p className="italic text-[13px]">{category}</p>
            </div>

            {/* District Line */}
            <div className="mb-3 text-sm flex items-center gap-2">
              <span>Distrito:</span>
              <span className="font-bold relative inline-block min-w-[100px]">
              {district}
               <div className="absolute left-0 -bottom-1 w-full border-b border-black" />
              </span>
            </div>

            {/* Table */}
            <table className="w-full border-collapse text-[9px] table-fixed">
              <thead>
                <tr>
                  <th rowSpan={2} className="border border-black w-[70px]">
                    ID Picture
                    <br />
                    (1x1)
                  </th>
                  <th colSpan={3} className="border border-black">
                    PANGALAN
                  </th>
                  <th rowSpan={2} className="border border-black w-[70px]">
                    LOKAL
                  </th>
                  <th rowSpan={2} className="border border-black w-[80px]">
                    PETSA NG
                    <br />
                    MAGING SCAN
                  </th>
                  <th rowSpan={2} className="border border-black w-[110px]">
                    {getSpecialColumnHeader()}
                  </th>
                  <th rowSpan={2} className="border border-black w-[80px]">
                    INTERNAL
                    <br />
                    CALLSIGN
                  </th>
                  {/*<th rowSpan={2} className="border border-black w-[140px]">
                    FUNCTION/S
                  </th>*/}
                </tr>
                <tr>
                  <th className="border border-black">FIRST NAME</th>
                  <th className="border border-black">MIDDLE NAME</th>
                  <th className="border border-black">LAST NAME</th>
                </tr>
              </thead>

              <tbody>
                {pageMembers.map((member, rowIndex) => (
                  <tr key={rowIndex} className="no-break">
                    <td className="border border-black h-[90px] w-[70px] p-1 align-middle text-center">
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
                        <div className="text-gray-400 text-[7px]">
                          No Photo
                        </div>
                      )}
                    </td>
                    <td className="border border-black px-1 text-[8px]">
                      {member?.firstName || ''}
                    </td>
                    <td className="border border-black px-1 text-[8px]">
                      {member?.middleName || ''}
                    </td>
                    <td className="border border-black px-1 text-[8px]">
                      {member?.lastName || ''}
                    </td>
                    <td className="border border-black px-1 text-[8px]">
                      {member?.local || ''}
                    </td>
                    <td className="border border-black px-1 text-[8px]">
                      {member?.scanDate || ''}
                    </td>
                    <td className="border border-black px-1 text-[8px]">
                      {getSpecialColumnValue(member)}
                    </td>
                    <td className="border border-black px-1 text-[8px]">
                      {member?.internalCallsign || ''}
                    </td>
                    {/*<td className="border border-black px-1 text-[8px]">
                      {member?.functions && member.functions.length > 0 ? (
                        member.functions.length === 1 ? (
                          member.functions[0]
                        ) : (
                          <ul className="list-disc pl-3 m-0">
                            {member.functions.map((fn, idx) => (
                              <li key={idx}>{fn}</li>
                            ))}
                          </ul>
                        )
                      ) : (
                        ''
                      )}
                    </td>*/}
                  </tr>
                ))}
                {/* Fill empty rows to maintain rowsPerPage */}
                {Array.from({ length: rowsPerPage - pageMembers.length }).map((_, emptyIndex) => (
                  <tr key={`empty-${emptyIndex}`} className="no-break">
                    <td className="border border-black h-[90px]">&nbsp;</td>
                    <td className="border border-black">&nbsp;</td>
                    <td className="border border-black">&nbsp;</td>
                    <td className="border border-black">&nbsp;</td>
                    <td className="border border-black">&nbsp;</td>
                    <td className="border border-black">&nbsp;</td>
                    <td className="border border-black">&nbsp;</td>
                    <td className="border border-black">&nbsp;</td>
                    {/* <td className="border border-black">&nbsp;</td>*/}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Page Number */}
            <div className="mt-3 text-xs text-right">
              Page {pageIndex + 1} of {totalPages}
            </div>
          </div>
        );
      })}
    </div>
  );
                    }
