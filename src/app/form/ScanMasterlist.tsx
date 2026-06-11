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
    window.print();
  };

  if (members.length === 0) {
    return null;
  }

  return (
    <>
      {/* Global Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          
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
          
          .no-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          @page {
            size: A4 landscape;
          }
        }
      `}</style>

      {/* Print Button - Hidden when printing */}
      <div className="no-print" style={{ textAlign: 'center', marginBottom: '20px' }}>
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

      {/* Printable Content - A4 size on screen */}
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
              style={{
                backgroundColor: 'white',
                width: '297mm',
                minHeight: '210mm',
                margin: '0 auto 20px auto',
                padding: '10mm',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                fontFamily: 'Times New Roman, Times, serif',
                position: 'relative',
                boxSizing: 'border-box',
              }}
            >
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '8mm' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                  MASTERLIST NG SCAN SA DISTRITO
                </h1>
                <p style={{ fontSize: '13px', fontStyle: 'italic', marginTop: '5px' }}>
                  {category}
                </p>
              </div>

              {/* District Line */}
              <div style={{ marginBottom: '6mm', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Distrito:</span>
                <span style={{ fontWeight: 'bold', borderBottom: '1px solid black', minWidth: '150px', display: 'inline-block' }}>
                  {district}
                </span>
              </div>

              {/* Table */}
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '9px',
                marginBottom: '6mm'
              }}>
                <thead>
                  <tr>
                    <th rowSpan={2} style={{ border: '1px solid black', width: '18mm', padding: '3mm 2mm' }}>
                      ID Picture
                      <br />
                      (1x1)
                    </th>
                    <th colSpan={3} style={{ border: '1px solid black', padding: '3mm 2mm' }}>
                      PANGALAN
                    </th>
                    <th rowSpan={2} style={{ border: '1px solid black', width: '18mm', padding: '3mm 2mm' }}>
                      LOKAL
                    </th>
                    <th rowSpan={2} style={{ border: '1px solid black', width: '21mm', padding: '3mm 2mm' }}>
                      PETSA NG
                      <br />
                      MAGING SCAN
                    </th>
                    <th rowSpan={2} style={{ border: '1px solid black', width: '29mm', padding: '3mm 2mm' }}>
                      {getSpecialColumnHeader()}
                    </th>
                    <th rowSpan={2} style={{ border: '1px solid black', width: '21mm', padding: '3mm 2mm' }}>
                      INTERNAL
                      <br />
                      CALLSIGN
                    </th>
                  </tr>
                  <tr>
                    <th style={{ border: '1px solid black', padding: '3mm 2mm' }}>FIRST NAME</th>
                    <th style={{ border: '1px solid black', padding: '3mm 2mm' }}>MIDDLE NAME</th>
                    <th style={{ border: '1px solid black', padding: '3mm 2mm' }}>LAST NAME</th>
                  </tr>
                </thead>

                <tbody>
                  {pageMembers.map((member, rowIndex) => (
                    <tr key={rowIndex} className="no-break">
                      <td style={{ 
                        border: '1px solid black', 
                        height: '24mm', 
                        padding: '2mm', 
                        textAlign: 'center', 
                        verticalAlign: 'middle' 
                      }}>
                        {member?.picture && member.picture.length > 0 ? (
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={member.picture}
                              alt="ID"
                              style={{ maxWidth: '14mm', maxHeight: '20mm', objectFit: 'contain' }}
                            />
                          </div>
                        ) : (
                          <div style={{ color: '#9CA3AF', fontSize: '7px' }}>No Photo</div>
                        )}
                      </td>
                      <td style={{ border: '1px solid black', padding: '2mm', fontSize: '8px' }}>
                        {member?.firstName || ''}
                      </td>
                      <td style={{ border: '1px solid black', padding: '2mm', fontSize: '8px' }}>
                        {member?.middleName || ''}
                      </td>
                      <td style={{ border: '1px solid black', padding: '2mm', fontSize: '8px' }}>
                        {member?.lastName || ''}
                      </td>
                      <td style={{ border: '1px solid black', padding: '2mm', fontSize: '8px' }}>
                        {member?.local || ''}
                      </td>
                      <td style={{ border: '1px solid black', padding: '2mm', fontSize: '8px' }}>
                        {member?.scanDate || ''}
                      </td>
                      <td style={{ border: '1px solid black', padding: '2mm', fontSize: '8px' }}>
                        {getSpecialColumnValue(member)}
                      </td>
                      <td style={{ border: '1px solid black', padding: '2mm', fontSize: '8px' }}>
                        {member?.internalCallsign || ''}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Fill empty rows */}
                  {Array.from({ length: rowsPerPage - pageMembers.length }).map((_, emptyIndex) => (
                    <tr key={`empty-${emptyIndex}`} className="no-break">
                      <td style={{ border: '1px solid black', height: '24mm' }}>&nbsp;</td>
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

              {/* Page Number */}
              <div style={{ marginTop: '6mm', fontSize: '11px', textAlign: 'right' }}>
                Page {pageIndex + 1} of {totalPages}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
