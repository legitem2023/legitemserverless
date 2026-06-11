'use client';

import { useRef, useEffect, useState } from 'react';

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
  const [scale, setScale] = useState(1);
  const rowsPerPage = 6;

  // Handle responsive scaling
  useEffect(() => {
    const handleResize = () => {
      const container = printRef.current;
      if (container) {
        const containerWidth = container.parentElement?.clientWidth || 1200;
        const originalWidth = 1100; // Approximate original width in px
        setScale(Math.min(1, containerWidth / originalWidth));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
      let styleHTML = '';
      styles.forEach((style) => {
        if (style.tagName === 'STYLE') {
          styleHTML += style.outerHTML;
        } else if (style.tagName === 'LINK') {
          styleHTML += style.outerHTML;
        }
      });

      const printWindow = window.open('', '_blank');
      printWindow?.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Masterlist ng Scan - ${district}</title>
            ${styleHTML}
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              @media print {
                @page {
                  size: landscape;
                  margin: 0.2in;
                }
                
                body {
                  margin: 0;
                  padding: 0;
                  background: white;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                
                .print-container {
                  margin: 0;
                  padding: 0;
                  width: 100%;
                }
                
                .print-page {
                  page-break-after: always;
                  break-after: page;
                  page-break-inside: avoid;
                  width: 100%;
                  min-height: 100vh;
                  position: relative;
                }
                
                .print-page:last-child {
                  page-break-after: auto;
                }
                
                .no-break {
                  page-break-inside: avoid;
                  break-inside: avoid;
                }
                
                table {
                  width: 100% !important;
                  table-layout: fixed !important;
                }
                
                td, th {
                  word-break: break-word;
                }
                
                img {
                  max-width: 100%;
                  height: auto;
                }
              }
              
              @media screen {
                .print-page {
                  margin: 0 auto 20px auto;
                  box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
              }
              
              body {
                margin: 0;
                padding: 20px;
                background: #f0f0f0;
              }
              
              .print-button-container {
                text-align: center;
                margin-bottom: 20px;
              }
              
              @media print {
                .print-button-container {
                  display: none;
                }
                body {
                  background: white;
                  padding: 0;
                }
              }
            </style>
          </head>
          <body>
            <div style="transform: scale(1); transform-origin: top left; width: 100%;">
              ${printContent.outerHTML}
            </div>
          </body>
        </html>
      `);
      printWindow?.document.close();
      
      // Wait for images to load before printing
      setTimeout(() => {
        printWindow?.print();
        printWindow?.close();
      }, 500);
    }
  };

  if (members.length === 0) {
    return null;
  }

  return (
    <>
      {/* Print Button */}
      <div className="print-button-container">
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors flex items-center gap-2 mx-auto"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          I-print ang Masterlist (PDF)
        </button>
      </div>

      {/* Print Content - Responsive Container */}
      <div 
        ref={printRef}
        style={{
          width: '100%',
          maxWidth: '100%',
          overflowX: 'auto',
        }}
      >
        <div 
          className="print-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => {
            const pageMembers = transformedMembers.slice(
              pageIndex * rowsPerPage,
              (pageIndex + 1) * rowsPerPage
            );

            return (
              <div
                key={pageIndex}
                className="print-page"
                style={{
                  backgroundColor: 'white',
                  width: '100%',
                  maxWidth: '1200px',
                  margin: '0 auto 20px auto',
                  padding: '20px',
                  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                  fontFamily: 'Times New Roman, serif',
                  position: 'relative',
                }}
              >
                {/* Header */}
                <div className="text-center mb-4">
                  <h1 style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: 'bold', margin: 0 }}>
                    MASTERLIST NG SCAN SA DISTRITO
                  </h1>
                  <p style={{ fontSize: 'clamp(11px, 3vw, 13px)', fontStyle: 'italic', marginTop: '5px' }}>
                    {category}
                  </p>
                </div>

                {/* District Line */}
                <div className="mb-3" style={{ fontSize: 'clamp(11px, 3vw, 13px)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Distrito:</span>
                  <span style={{ fontWeight: 'bold', position: 'relative', display: 'inline-block', minWidth: '100px' }}>
                    {district}
                    <div style={{ position: 'absolute', left: 0, bottom: '-2px', width: '100%', borderBottom: '1px solid black' }} />
                  </span>
                </div>

                {/* Table - Responsive */}
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <table className="w-full border-collapse" style={{ 
                    width: '100%', 
                    fontSize: 'clamp(8px, 2.5vw, 9px)',
                    borderCollapse: 'collapse',
                    minWidth: '600px'
                  }}>
                    <thead>
                      <tr>
                        <th rowSpan={2} style={{ border: '1px solid black', width: 'clamp(60px, 10%, 70px)', padding: '8px 4px' }}>
                          ID Picture
                          <br />
                          (1x1)
                        </th>
                        <th colSpan={3} style={{ border: '1px solid black', padding: '8px 4px' }}>
                          PANGALAN
                        </th>
                        <th rowSpan={2} style={{ border: '1px solid black', width: 'clamp(60px, 10%, 70px)', padding: '8px 4px' }}>
                          LOKAL
                        </th>
                        <th rowSpan={2} style={{ border: '1px solid black', width: 'clamp(70px, 12%, 80px)', padding: '8px 4px' }}>
                          PETSA NG
                          <br />
                          MAGING SCAN
                        </th>
                        <th rowSpan={2} style={{ border: '1px solid black', width: 'clamp(90px, 15%, 110px)', padding: '8px 4px' }}>
                          {getSpecialColumnHeader()}
                        </th>
                        <th rowSpan={2} style={{ border: '1px solid black', width: 'clamp(70px, 12%, 80px)', padding: '8px 4px' }}>
                          INTERNAL
                          <br />
                          CALLSIGN
                        </th>
                      </tr>
                      <tr>
                        <th style={{ border: '1px solid black', padding: '8px 4px' }}>FIRST NAME</th>
                        <th style={{ border: '1px solid black', padding: '8px 4px' }}>MIDDLE NAME</th>
                        <th style={{ border: '1px solid black', padding: '8px 4px' }}>LAST NAME</th>
                      </tr>
                    </thead>

                    <tbody>
                      {pageMembers.map((member, rowIndex) => (
                        <tr key={rowIndex} className="no-break">
                          <td style={{ border: '1px solid black', height: 'clamp(70px, 15vh, 90px)', padding: '4px', textAlign: 'center', verticalAlign: 'middle' }}>
                            {member?.picture && member.picture.length > 0 ? (
                              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={member.picture}
                                  alt="ID"
                                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                />
                              </div>
                            ) : (
                              <div style={{ color: '#9CA3AF', fontSize: 'clamp(6px, 2vw, 7px)' }}>
                                No Photo
                              </div>
                            )}
                          </td>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: 'clamp(7px, 2vw, 8px)' }}>
                            {member?.firstName || ''}
                          </td>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: 'clamp(7px, 2vw, 8px)' }}>
                            {member?.middleName || ''}
                          </td>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: 'clamp(7px, 2vw, 8px)' }}>
                            {member?.lastName || ''}
                          </td>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: 'clamp(7px, 2vw, 8px)' }}>
                            {member?.local || ''}
                          </td>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: 'clamp(7px, 2vw, 8px)' }}>
                            {member?.scanDate || ''}
                          </td>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: 'clamp(7px, 2vw, 8px)' }}>
                            {getSpecialColumnValue(member)}
                          </td>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: 'clamp(7px, 2vw, 8px)' }}>
                            {member?.internalCallsign || ''}
                          </td>
                        </tr>
                      ))}
                      
                      {/* Fill empty rows */}
                      {Array.from({ length: rowsPerPage - pageMembers.length }).map((_, emptyIndex) => (
                        <tr key={`empty-${emptyIndex}`} className="no-break">
                          <td style={{ border: '1px solid black', height: 'clamp(70px, 15vh, 90px)' }}>&nbsp;</td>
                          <td style={{ border: '1px solid black' }}>&nbsp;</td>
                          <td style={{ border: '1px solid black' }}>&nbsp;</td>
                          <td style={{ border: '1px solid black' }}>&nbsp;</td>
                          <td style={{ border: '1px solid black' }}>&nbsp;</td>
                          <td style={{ border: '1px solid black' }}>&nbsp;</td>
                          <td style={{ border: '1px solid black' }}>&nbsp;</td>
                          <td style={{ border: '1px solid black' }}>&nbsp;</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Page Number */}
                <div className="mt-3" style={{ fontSize: 'clamp(10px, 3vw, 12px)', textAlign: 'right' }}>
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
