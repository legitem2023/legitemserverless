'use client';

import Image from 'next/image';

interface Member {
  name: string;
  kapisanan: string;
  kahilingan: string;
  callSign: string;
  function: string | string[];
  picture: string;
  schedules: Schedule[];
}

interface Schedule {
  date: string;
  day: string;
  time: string;
  service?: 'PNK' | 'worship' | 'Distrito';
}

interface GroupedSchedule {
  date: string;
  day: string;
  time: string;
  service: string;
  members: Member[];
}

interface PrintableSuguanProps {
  forms: GroupedSchedule[][];
  filipinoDays: Record<string, string>;
}

export function PrintableSuguan({ forms, filipinoDays }: PrintableSuguanProps) {
  return (
    <div className="print-container">
      {forms.map((formSchedules, formIndex) => (
        <div key={formIndex} className="print-page">
          <div className="page-content">
            {/* Header Section */}
            <div className="header">
              <div className="logo">
                <Image
                  src="/images.png"
                  alt="Logo"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>

              <div className="title-section">
                <h1>SCAN INTERNATIONAL</h1>
                <h2>DISTRITO NG RIZAL</h2>
                <h3>LOKAL NG KADALAGAHAN</h3>
                <p className="service-type">
                  {formIndex === 2 
                    ? 'SUGUAN NG SCAN SA PNK' 
                    : formIndex === 3 
                      ? 'SUGUAN NG PAGBABANTAY SA DISTRITO' 
                      : 'SUGUAN NG SCAN SA PAGSAMBA'}
                </p>
              </div>

              <div className="spacer" />
            </div>

            {/* Schedules Section */}
            <div className="schedules">
              {formSchedules.map((schedule, idx) => {
                const dateObj = new Date(schedule.date);
                const filipinoDay = filipinoDays[schedule.day.toLowerCase()] || schedule.day;

                return (
                  <div key={idx} className="schedule-table-wrapper">
                    <table className="schedule-table">
                      <thead>
                        <tr className="schedule-header-row">
                          <th colSpan={3} className="header-date">
                            Petsa: {dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </th>
                          <th colSpan={3} className="header-day">
                            Araw: {filipinoDay}
                          </th>
                          <th colSpan={3} className="header-time">
                            Oras: {schedule.time}
                          </th>
                        </tr>
                        <tr className="column-headers">
                          <th className="col-blg">Blg</th>
                          <th colSpan={3} className="col-name">Pangalan</th>
                          <th className="col-callsign">Call Sign</th>
                          <th className="col-sign-receive">Lagda Pagtanggap</th>
                          <th className="col-sign-fulfill">Lagda Pagtupad</th>
                          <th className="col-role">Gampanan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.members.map((member, i) => (
                          <tr key={i}>
                            <td className="text-center">{i + 1}</td>
                            <td colSpan={3}>{member.name}</td>
                            <td className="text-center">{member.callSign}</td>
                            <td className="sign-cell"></td>
                            <td className="sign-cell"></td>
                            <td className="role-cell"></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>

            {/* Footer Signatures Section */}
            <div className="footer">
              <p className="prepared-by">Naghanda:</p>
              <div className="signatures">
                <div className="signature">
                  <p className="name">JUSTINE JACOB RODRIGUEZ</p>
                  <p className="title">KALIHIM SCAN</p>
                </div>
                <div className="signature">
                  <p className="name">________________________</p>
                  <p className="title">PANGULO NG SCAN</p>
                </div>
              </div>
              <div className="signatures second-row">
                <div className="signature">
                  <p className="name">MARIANO M. LEBARDO JR.</p>
                  <p className="title">PD - TAGASUBAYBAY</p>
                </div>
                <div className="signature">
                  <p className="name">RODOLFO DE GUZMAN</p>
                  <p className="title">DESTINADO NG LOKAL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <style jsx global>{`
        /* Print Styles */
        @media print {
          @page {
            margin: 0.5in;
            size: letter;
          }
          
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          
          .print-container {
            display: block;
            margin: 0;
            padding: 0;
          }
          
          .print-page {
            break-after: page;
            page-break-after: always;
            margin: 0;
            padding: 0;
            background: white;
          }
          
          .page-content {
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .logo img {
            print-color-adjust: exact;
          }
        }
        
        /* Screen Styles */
        .print-page {
          background: white;
          width: 216mm;
          min-height: 279mm;
          margin: 0 auto 20px auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          border-radius: 4px;
        }
        
        .page-content {
          padding: 0.5in;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        /* Header Styles */
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-shrink: 0;
        }
        
        .logo {
          width: 100px;
          flex-shrink: 0;
        }
        
        .title-section {
          text-align: center;
          flex: 1;
        }
        
        .title-section h1 {
          font-size: 14px;
          font-weight: bold;
          text-transform: uppercase;
          margin: 0;
          letter-spacing: 0.5px;
        }
        
        .title-section h2 {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          margin: 4px 0;
          letter-spacing: 0.3px;
        }
        
        .title-section h3 {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          margin: 4px 0;
        }
        
        .service-type {
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
          margin: 6px 0 0 0;
          color: #000;
          border-top: 1px solid #ccc;
          display: inline-block;
          padding-top: 4px;
        }
        
        .spacer {
          width: 70px;
          flex-shrink: 0;
        }
        
        /* Schedules Styles */
        .schedules {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .schedule-table-wrapper {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        
        .schedule-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
          border: 1px solid #000;
        }
        
        .schedule-table th,
        .schedule-table td {
          border: 1px solid #000;
          padding: 6px 8px;
          vertical-align: top;
        }
        
        .schedule-header-row th {
          text-align: left;
          font-weight: normal;
          background-color: #f9f9f9;
          padding: 6px 8px;
        }
        
        .header-date,
        .header-day,
        .header-time {
          width: 33.33%;
        }
        
        .column-headers th {
          font-weight: bold;
          text-align: center;
          background-color: #f5f5f5;
          font-size: 9px;
          padding: 6px 4px;
        }
        
        .col-blg {
          width: 6%;
          text-align: center;
        }
        
        .col-name {
          width: 34%;
        }
        
        .col-callsign {
          width: 12%;
          text-align: center;
        }
        
        .col-sign-receive,
        .col-sign-fulfill {
          width: 20%;
        }
        
        .col-role {
          width: 8%;
        }
        
        .schedule-table tbody tr:hover {
          background-color: #fafafa;
        }
        
        .sign-cell {
          height: 28px;
        }
        
        .role-cell {
          height: 28px;
        }
        
        .text-center {
          text-align: center;
        }
        
        /* Footer Styles */
        .footer {
          margin-top: 32px;
          font-size: 10px;
          flex-shrink: 0;
        }
        
        .prepared-by {
          margin: 0 0 12px 0;
          font-weight: 500;
        }
        
        .signatures {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          margin-top: 8px;
        }
        
        .signatures.second-row {
          margin-top: 40px;
        }
        
        .signature {
          text-align: center;
        }
        
        .signature .name {
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 6px;
          font-size: 10px;
          letter-spacing: 0.3px;
        }
        
        .signature .title {
          font-size: 9px;
          text-transform: uppercase;
          color: #333;
          margin: 0;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .print-page {
            width: 100%;
            margin: 0 auto 16px auto;
          }
          
          .page-content {
            padding: 0.3in;
          }
          
          .signatures {
            gap: 30px;
          }
        }
      `}</style>
    </div>
  );
}
