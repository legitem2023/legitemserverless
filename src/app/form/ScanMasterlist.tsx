'use client';

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
  const rowsPerPage = 12; // More rows to fill A4 landscape

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
      <style>{`
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
            page-break-inside: avoid;
            height: 100vh;
          }
          
          .print-page:last-child {
            page-break-after: auto;
          }
          
          @page {
            size: A4 landscape;
            margin: 1.5cm 1cm;
          }
          
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
        }
        
        /* Screen styles */
        .no-print {
          text-align: center;
          margin-bottom: 20px;
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
        }
        
        .print-btn:hover {
          background: #1d4ed8;
        }
        
        .print-page {
          background: white;
          width: 100%;
          max-width: 297mm;
          min-height: 210mm;
          margin: 0 auto 20px auto;
          padding: 15mm 10mm;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          font-family: 'Times New Roman', Times, serif;
          display: flex;
          flex-direction: column;
          page-break-after: always;
        }
        
        @media print {
          .print-page {
            box-shadow: none;
            max-width: none;
            margin: 0;
            padding: 0;
            min-height: 0;
            height: auto;
          }
        }
        
        .title {
          text-align: center;
          margin-bottom: 10px;
        }
        
        .title h1 {
          font-size: 16px;
          font-weight: bold;
          margin: 0;
          letter-spacing: 1px;
        }
        
        .title p {
          font-size: 11px;
          font-style: italic;
          margin-top: 4px;
        }
        
        .district-info {
          margin-bottom: 10px;
          font-size: 11px;
          display: flex;
          align-items: baseline;
        }
        
        .district-label {
          font-weight: bold;
          white-space: nowrap;
        }
        
        .district-line {
          border-bottom: 1px solid black;
          flex: 1;
          margin-left: 10px;
          height: 1px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9px;
          flex: 1;
        }
        
        th, td {
          border: 1px solid black;
          padding: 6px 4px;
          vertical-align: middle;
        }
        
        th {
          background: #f3f4f6;
          text-align: center;
          font-weight: bold;
        }
        
        @media print {
          th {
            background: #f3f4f6 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
        
        .text-center {
          text-align: center;
        }
        
        .picture-box {
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60px;
        }
        
        .picture-box img {
          max-width: 40px;
          max-height: 55px;
          object-fit: contain;
        }
        
        .page-num {
          text-align: right;
          font-size: 9px;
          margin-top: 10px;
        }
        
        /* Column widths */
        .col-pic { width: 8%; }
        .col-first { width: 14%; }
        .col-middle { width: 12%; }
        .col-last { width: 14%; }
        .col-local { width: 8%; }
        .col-date { width: 12%; }
        .col-special { width: 18%; }
        .col-call { width: 14%; }
        
        td {
          font-size: 9px;
          line-height: 1.3;
        }
      </style>`

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
      {Array.from({ length: totalPages }).map((_, pageIdx) => {
        const start = pageIdx * rowsPerPage;
        const pageMembers = transformedMembers.slice(start, start + rowsPerPage);
        
        return (
          <div key={pageIdx} className="print-page">
            {/* Title */}
            <div className="title">
              <h1>MASTERLIST NG SCAN SA DISTRITO</h1>
              <p>{category}</p>
            </div>

            {/* District */}
            <div className="district-info">
              <span className="district-label">Distrito:</span>
              <div className="district-line"></div>
              <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>{district}</span>
            </div>

            {/* Table */}
            <table>
              <thead>
                <tr>
                  <th rowSpan="2" className="col-pic">ID Picture<br/>(1x1)</th>
                  <th colSpan="3">PANGALAN</th>
                  <th rowSpan="2" className="col-local">LOKAL</th>
                  <th rowSpan="2" className="col-date">PETSA NG<br/>MAGING SCAN</th>
                  <th rowSpan="2" className="col-special">{getSpecialColumnHeader()}</th>
                  <th rowSpan="2" className="col-call">INTERNAL<br/>CALLSIGN</th>
                </tr>
                <tr>
                  <th className="col-first">FIRST NAME</th>
                  <th className="col-middle">MIDDLE NAME</th>
                  <th className="col-last">LAST NAME</th>
                </tr>
              </thead>
              <tbody>
                {pageMembers.map((m, idx) => (
                  <tr key={idx}>
                    <td className="text-center">
                      <div className="picture-box">
                        {m.picture ? (
                          <img src={m.picture} alt="ID" />
                        ) : (
                          <span style={{ fontSize: '7px', color: '#999' }}>No Photo</span>
                        )}
                      </div>
                    </td>
                    <td>{m.firstName || '—'}</td>
                    <td>{m.middleName || '—'}</td>
                    <td>{m.lastName || '—'}</td>
                    <td>{m.local || '—'}</td>
                    <td>{m.scanDate || '—'}</td>
                    <td>{getSpecialColumnValue(m) || '—'}</td>
                    <td>{m.internalCallsign || '—'}</td>
                  </tr>
                ))}
                {/* Fill remaining rows to complete the page */}
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
            </table>

            {/* Page Number */}
            <div className="page-num">
              Page {pageIdx + 1} of {totalPages}
            </div>
          </div>
        );
      })}
    </>
  );
      }
