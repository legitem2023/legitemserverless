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
    
    const functionValue = Array.isArray(member.function) 
      ? member.function 
      : member.function ? [member.function] : [];

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
    const printContent = printRef.current?.cloneNode(true) as HTMLDivElement;
    if (printContent) {
      const printWindow = window.open('', '_blank');
      printWindow?.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Masterlist ng Scan - ${district}</title>
            <meta charset="utf-8" />
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                margin: 0;
                padding: 0;
                background: white;
              }
              
              @page {
                size: A4 landscape;
                margin: 15mm 10mm 15mm 10mm;
              }
              
              @media print {
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
                
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                
                td, th {
                  border: 1px solid black !important;
                }
              }
              
              /* Screen styles */
              .print-page {
                background: white;
                width: 100%;
                max-width: 297mm;
                min-height: 210mm;
                margin: 0 auto 20px auto;
                padding: 10mm;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                font-family: 'Times New Roman', Times, serif;
                position: relative;
              }
              
              .header {
                text-align: center;
                margin-bottom: 8mm;
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
                margin-bottom: 6mm;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 8px;
              }
              
              .district-value {
                font-weight: bold;
                position: relative;
                display: inline-block;
                min-width: 100px;
                border-bottom: 1px solid black;
              }
              
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 9px;
                table-layout: fixed;
              }
              
              th, td {
                border: 1px solid black;
                padding: 3px;
                vertical-align: top;
              }
              
              .picture-cell {
                width: 18mm;
                height: 24mm;
                text-align: center;
                vertical-align: middle;
                padding: 2mm;
              }
              
              .picture-cell img {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
              }
              
              .no-photo {
                color: #9CA3AF;
                font-size: 7px;
              }
              
              .page-number {
                margin-top: 6mm;
                font-size: 11px;
                text-align: right;
              }
              
              .print-button-container {
                text-align: center;
                margin-bottom: 20px;
              }
              
              .print-button {
                background-color: #2563eb;
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                border: none;
                cursor: pointer;
                font-size: 16px;
                font-family: system-ui, -apple-system, sans-serif;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              
              .print-button:hover {
                background-color: #1d4ed8;
              }
              
              @media print {
                .print-button-container {
                  display: none;
                }
                
                .print-page {
                  box-shadow: none;
                  margin: 0;
                  padding: 0;
                  max-width: none;
                  min-height: auto;
                }
              }
            </style>
          </head>
          <body>
            ${printContent.outerHTML}
          </body>
        </html>
      `);
      printWindow?.document.close();
      
      printWindow?.addEventListener('load', () => {
        printWindow?.print();
        printWindow?.close();
      });
    }
  };

  if (members.length === 0) {
    return null;
  }

  return (
    <>
      {/* Print Button */}
      <div className="print-button-container">
        <button onClick={handlePrint} className="print-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          I-print ang Masterlist (PDF)
        </button>
      </div>

      {/* Print Content */}
      <div ref={printRef}>
        {Array.from({ length: totalPages }).map((_, pageIndex) => {
          const pageMembers = transformedMembers.slice(
            pageIndex * rowsPerPage,
            (pageIndex + 1) * rowsPerPage
          );

          return (
            <div
              key={pageIndex}
              className="print-page"
            >
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
              <table>
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
                          <img
                            src={member.picture}
                            alt="ID"
                          />
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
    </>
  );
}
