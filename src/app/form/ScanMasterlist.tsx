'use client';

import { useRef } from 'react';

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
  const printRef = useRef<HTMLDivElement>(null);
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
      scanDate: member.Petsa_ng_maging_scan,
      amateurCallsign: member.AmatureCallsign,
      internalCallsign: member.callSign,
      associateCategory: member.AssociateCategory,
      pagpapatibay: member.Pagpapatibay || '',
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
    if (printRef.current) {
      window.print();
    }
  };

  if (members.length === 0) {
    return null;
  }

  return (
    <>
      {/* Print Button */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={handlePrint}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          I-print ang Masterlist (PDF)
        </button>
      </div>

      {/* Printable Content */}
      <div ref={printRef}>
        <style type="text/css" media="print">
          {`
            @page {
              size: A4 landscape;
              margin: 15mm 10mm 15mm 10mm;
            }
            
            body {
              margin: 0;
              padding: 0;
            }
            
            .print-page {
              page-break-after: always;
              break-after: page;
            }
            
            .print-page:last-child {
              page-break-after: auto;
              break-after: auto;
            }
            
            .no-break {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            .print-button-container {
              display: none;
            }
          `}
        </style>
        
        <style type="text/css">
          {`
            .print-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 20px;
              padding: 20px;
              background: #f0f0f0;
            }
            
            .print-page {
              background-color: white;
              width: 100%;
              max-width: 1100px;
              min-height: 800px;
              padding: 20px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              font-family: 'Times New Roman', Times, serif;
              position: relative;
            }
            
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            
            .header h1 {
              font-size: 20px;
              font-weight: bold;
              margin: 0;
            }
            
            .header p {
              font-size: 13px;
              font-style: italic;
              margin-top: 5px;
            }
            
            .district-line {
              margin-bottom: 15px;
              font-size: 13px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .district-value {
              font-weight: bold;
              border-bottom: 1px solid black;
              min-width: 150px;
              display: inline-block;
            }
            
            .masterlist-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 9px;
              margin-bottom: 15px;
            }
            
            .masterlist-table th,
            .masterlist-table td {
              border: 1px solid black;
              padding: 4px;
              vertical-align: top;
            }
            
            .masterlist-table th {
              font-weight: bold;
              text-align: center;
              background-color: #f3f4f6;
            }
            
            .picture-cell {
              width: 70px;
              height: 90px;
              text-align: center;
              vertical-align: middle;
            }
            
            .picture-cell img {
              max-width: 50px;
              max-height: 70px;
              object-fit: contain;
            }
            
            .no-photo {
              color: #9CA3AF;
              font-size: 7px;
            }
            
            .page-number {
              margin-top: 10px;
              font-size: 12px;
              text-align: right;
            }
            
            @media print {
              .print-container {
                background: white;
                padding: 0;
                gap: 0;
              }
              
              .print-page {
                box-shadow: none;
                margin: 0;
                padding: 0;
                max-width: none;
                min-height: auto;
              }
              
              .masterlist-table th {
                background-color: #f3f4f6 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          `}
        </style>
        
        <div className="print-container">
          {Array.from({ length: totalPages }).map((_, pageIndex) => {
            const pageMembers = transformedMembers.slice(
              pageIndex * rowsPerPage,
              (pageIndex + 1) * rowsPerPage
            );

            return (
              <div key={pageIndex} className="print-page">
                {/* Header */}
                <div className="header">
                  <h1>MASTERLIST NG SCAN SA DISTRITO</h1>
                  <p>{category}</p>
                </div>

                {/* District Line */}
                <div className="district-line">
                  <span>Distrito:</span>
                  <span className="district-value">{district}</span>
                </div>

                {/* Table */}
                <table className="masterlist-table">
                  <thead>
                    <tr>
                      <th rowSpan={2} className="picture-cell">
                        ID Picture
                        <br />
                        (1x1)
                      </th>
                      <th colSpan={3}>PANGALAN</th>
                      <th rowSpan={2}>LOKAL</th>
                      <th rowSpan={2}>
                        PETSA NG
                        <br />
                        MAGING SCAN
                      </th>
                      <th rowSpan={2}>{getSpecialColumnHeader()}</th>
                      <th rowSpan={2}>
                        INTERNAL
                        <br />
                        CALLSIGN
                      </th>
                    </tr>
                    <tr>
                      <th>FIRST NAME</th>
                      <th>MIDDLE NAME</th>
                      <th>LAST NAME</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pageMembers.map((member, rowIndex) => (
                      <tr key={rowIndex} className="no-break">
                        <td className="picture-cell">
                          {member?.picture && member.picture.length > 0 ? (
                            <img src={member.picture} alt="ID" />
                          ) : (
                            <div className="no-photo">No Photo</div>
                          )}
                        </td>
                        <td style={{ fontSize: '8px' }}>{member?.firstName || ''}</td>
                        <td style={{ fontSize: '8px' }}>{member?.middleName || ''}</td>
                        <td style={{ fontSize: '8px' }}>{member?.lastName || ''}</td>
                        <td style={{ fontSize: '8px' }}>{member?.local || ''}</td>
                        <td style={{ fontSize: '8px' }}>{member?.scanDate || ''}</td>
                        <td style={{ fontSize: '8px' }}>{getSpecialColumnValue(member)}</td>
                        <td style={{ fontSize: '8px' }}>{member?.internalCallsign || ''}</td>
                      </tr>
                    ))}
                    
                    {/* Fill empty rows */}
                    {Array.from({ length: rowsPerPage - pageMembers.length }).map((_, emptyIndex) => (
                      <tr key={`empty-${emptyIndex}`} className="no-break">
                        <td className="picture-cell">&nbsp;</td>
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
                <div className="page-number">
                  Page {pageIndex + 1} of {totalPages}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
