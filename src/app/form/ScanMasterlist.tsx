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
  Petsa_ng_maging_scan?: string;
  Pagpapatibay?: string;
  AssociateCategory?: string;
  AmatureCallsign?: string;
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
  const rowsPerPage = 6;

  const parseName = (fullName: string): { firstName: string; lastName: string } => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return { firstName: '', lastName: '' };
    if (parts.length === 1) return { firstName: parts[0], lastName: '' };
    const lastName = parts[parts.length - 1];
    const firstName = parts.slice(0, -1).join(' ');
    return { firstName, lastName };
  };

  const transformedMembers = members.map((member) => {
    const { firstName, lastName } = parseName(member.name);
    return {
      firstName,
      middleName: '',
      lastName,
      local: 'KADALAGAHAN',
      scanDate: member.Petsa_ng_maging_scan || '',
      amateurCallsign: member.AmatureCallsign || '',
      internalCallsign: member.callSign || '',
      associateCategory: member.AssociateCategory || '',
      picture: member.picture || '',
      certificateNumber: '',
    };
  });

  const getSpecialColumnHeader = () => {
    switch (category) {
      case 'Emergency First Responder (EFR)':
        return 'EFR CERTIFICATE SERIAL NUMBER';
      case 'Associate Members (Approved)':
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
      case 'Associate Members (Not Approved)':
        return member.associateCategory;
      case 'Communicators':
      default:
        return member.amateurCallsign;
    }
  };

  const totalPages = Math.max(1, Math.ceil(transformedMembers.length / rowsPerPage));

  const handlePrint = () => {
    window.print();
  };

  if (members.length === 0) return null;

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        @media print {
          .no-print {
            display: none !important;
          }
          
          .print-page {
            page-break-after: always;
            break-after: page;
          }
          
          .print-page:last-child {
            page-break-after: auto;
            break-after: auto;
          }
          
          @page {
            size: A4 landscape;
            margin: 1cm 0.8cm;
          }
          
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          
          table {
            break-inside: avoid;
          }
          
          tr {
            break-inside: avoid;
          }
        }
        
        /* Screen styles */
        .no-print {
          text-align: center;
          margin: 20px 0;
          position: sticky;
          top: 10px;
          z-index: 100;
        }
        
        .print-btn {
          background: #2563eb;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .print-btn:hover {
          background: #1d4ed8;
        }
        
        .print-page {
          background: white;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto 20px auto;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          font-family: 'Times New Roman', Times, serif;
        }
        
        @media print {
          .print-page {
            box-shadow: none;
            max-width: none;
            margin: 0;
            padding: 0;
          }
        }
        
        .masterlist-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
        }
        
        .masterlist-table th,
        .masterlist-table td {
          border: 1px solid black;
          padding: 8px 5px;
          vertical-align: middle;
        }
        
        .masterlist-table th {
          background-color: #f3f4f6;
          text-align: center;
          font-weight: bold;
        }
        
        @media print {
          .masterlist-table th {
            background-color: #f3f4f6 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
        
        .text-center {
          text-align: center;
        }
        
        .picture-cell {
          text-align: center;
          vertical-align: middle;
          width: 96px;
          height: 96px;
        }
        
        .picture-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80px;
          height: 96px;
          width: 96px;
        }
        
        .picture-container img {
          max-width: 90px;
          max-height: 90px;
          object-fit: contain;
        }
        
        .no-photo {
          color: #9ca3af;
          font-size: 8px;
        }
        
        .page-number {
          text-align: right;
          font-size: 10px;
          margin-top: 15px;
        }
        
        .header-title {
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          padding: 15px 5px;
        }
        
        .header-category {
          text-align: center;
          font-size: 12px;
          font-style: italic;
          padding: 5px;
        }
        
        .district-row {
          font-size: 12px;
        }
        
        .district-label {
          font-weight: bold;
        }
        
        /* Fixed column widths */
        .col-picture { width: 8%; }
        .col-firstname { width: 14%; }
        .col-middlename { width: 12%; }
        .col-lastname { width: 14%; }
        .col-local { width: 8%; }
        .col-scandate { width: 12%; }
        .col-special { width: 18%; }
        .col-callsign { width: 14%; }
      `}</style>

      {/* Print Button */}
      <div className="no-print">
        <button className="print-btn" onClick={handlePrint}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
          I-print ang Masterlist (PDF)
        </button>
      </div>

      {/* Print Pages */}
      {Array.from({ length: totalPages }).map((_, pageIndex) => {
        const start = pageIndex * rowsPerPage;
        const pageMembers = transformedMembers.slice(start, start + rowsPerPage);
        
        return (
          <div key={pageIndex} className="print-page">
            <table className="masterlist-table">
              {/* Header Section inside table */}
              <tbody>
                <tr>
                  <td colSpan={8} className="header-title">
                    MASTERLIST NG SCAN SA DISTRITO
                  </td>
                </tr>
                <tr>
                  <td colSpan={8} className="header-category">
                    {category}
                  </td>
                </tr>
                <tr>
                  <td colSpan={8} className="district-row">
                    <span className="district-label">Distrito:</span> {district}
                  </td>
                </tr>
              </tbody>
              
              {/* Main Table Header */}
              <thead>
                <tr>
                  <th rowSpan={2} className="col-picture">ID Picture<br/>(1x1)</th>
                  <th colSpan={3}>PANGALAN</th>
                  <th rowSpan={2} className="col-local">LOKAL</th>
                  <th rowSpan={2} className="col-scandate">PETSA NG<br/>MAGING SCAN</th>
                  <th rowSpan={2} className="col-special">{getSpecialColumnHeader()}</th>
                  <th rowSpan={2} className="col-callsign">INTERNAL<br/>CALLSIGN</th>
                </tr>
                <tr>
                  <th className="col-firstname">FIRST NAME</th>
                  <th className="col-middlename">MIDDLE NAME</th>
                  <th className="col-lastname">LAST NAME</th>
                </tr>
              </thead>
              
              {/* Table Body */}
              <tbody>
                {pageMembers.map((member, idx) => (
                  <tr key={idx}>
                    <td className="picture-cell">
                      <div className="picture-container">
                        {member.picture ? (
                          <img src={member.picture} alt="ID" />
                        ) : (
                          <img src="https://www.kindpng.com/picc/m/80-807524_no-profile-hd-png-download.png" alt="ID" />   
                        )}
                      </div>
                    </td>
                    <td>{member.firstName || '—'}</td>
                    <td>{member.middleName || '—'}</td>
                    <td>{member.lastName || '—'}</td>
                    <td>{member.local || '—'}</td>
                    <td>{member.scanDate || '—'}</td>
                    <td>{getSpecialColumnValue(member) || '—'}</td>
                    <td>{member.internalCallsign || '—'}</td>
                  </tr>
                ))}
                
                {/* Fill empty rows */}
                {Array.from({ length: rowsPerPage - pageMembers.length }).map((_, idx) => (
                  <tr key={`empty-${idx}`}>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                ))}
              </tbody>
              
              {/* Page Number inside table */}
              <tfoot>
                <tr>
                  <td colSpan={8} className="page-number">
                    Page {pageIndex + 1} of {totalPages}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        );
      })}
    </>
  );
}
