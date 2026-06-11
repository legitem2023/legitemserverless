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
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
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
          
          @page {
            size: A4 landscape;
            margin: 1.5cm 1cm 1.5cm 1cm;
          }
        }
        
        /* Screen styles */
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
            padding: 0;
            margin: 0;
            max-width: none;
          }
        }
        
        .masterlist-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        
        .masterlist-table th,
        .masterlist-table td {
          border: 1px solid black;
          padding: 6px 4px;
          word-wrap: break-word;
        }
        
        .masterlist-table th {
          font-weight: bold;
          text-align: center;
          background-color: #f3f4f6;
        }
        
        @media print {
          .masterlist-table th {
            background-color: #f3f4f6 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
        
        .col-picture { width: 10%; }
        .col-firstname { width: 15%; }
        .col-middlename { width: 15%; }
        .col-lastname { width: 15%; }
        .col-local { width: 8%; }
        .col-date { width: 12%; }
        .col-special { width: 15%; }
        .col-callsign { width: 10%; }
        
        .picture-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80px;
        }
        
        .picture-container img {
          max-width: 60px;
          max-height: 70px;
          object-fit: contain;
        }
        
        .no-photo {
          color: #9CA3AF;
          font-size: 10px;
          text-align: center;
        }
        
        .header {
          text-align: center;
          margin-bottom: 15px;
        }
        
        .header h1 {
          font-size: 18px;
          font-weight: bold;
          margin: 0 0 5px 0;
        }
        
        .header p {
          font-size: 12px;
          font-style: italic;
          margin: 0;
        }
        
        .district-line {
          margin-bottom: 15px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .district-value {
          font-weight: bold;
          border-bottom: 1px solid black;
          padding-bottom: 2px;
          min-width: 200px;
        }
        
        .page-number {
          margin-top: 15px;
          font-size: 11px;
          text-align: right;
        }
        
        .text-small {
          font-size: 10px;
        }
        
        @media print {
          .text-small {
            font-size: 9px;
          }
        }
      `}</style>

      {/* Print Button */}
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
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          I-print ang Masterlist (PDF)
        </button>
      </div>

      {/* Printable Pages */}
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

            {/* District */}
            <div className="district-line">
              <span>Distrito:</span>
              <span className="district-value">{district}</span>
            </div>

            {/* Table */}
            <table className="masterlist-table">
              <thead>
                <tr>
                  <th rowSpan={2} className="col-picture">ID Picture<br/>(1x1)</th>
                  <th colSpan={3}>PANGALAN</th>
                  <th rowSpan={2} className="col-local">LOKAL</th>
                  <th rowSpan={2} className="col-date">PETSA NG<br/>MAGING SCAN</th>
                  <th rowSpan={2} className="col-special">{getSpecialColumnHeader()}</th>
                  <th rowSpan={2} className="col-callsign">INTERNAL<br/>CALLSIGN</th>
                </tr>
                <tr>
                  <th className="col-firstname">FIRST NAME</th>
                  <th className="col-middlename">MIDDLE NAME</th>
                  <th className="col-lastname">LAST NAME</th>
                </tr>
              </thead>
              <tbody>
                {pageMembers.map((member, idx) => (
                  <tr key={idx}>
                    <td className="text-small">
                      <div className="picture-container">
                        {member.picture ? (
                          <img src={member.picture} alt="ID" />
                        ) : (
                          <div className="no-photo">No Photo</div>
                        )}
                      </div>
                    </td>
                    <td className="text-small">{member.firstName || ''}</td>
                    <td className="text-small">{member.middleName || ''}</td>
                    <td className="text-small">{member.lastName || ''}</td>
                    <td className="text-small">{member.local || ''}</td>
                    <td className="text-small">{member.scanDate || ''}</td>
                    <td className="text-small">{getSpecialColumnValue(member)}</td>
                    <td className="text-small">{member.internalCallsign || ''}</td>
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
            </table>

            {/* Page number */}
            <div className="page-number">
              Page {pageIndex + 1} of {totalPages}
            </div>
          </div>
        );
      })}
    </>
  );
}
