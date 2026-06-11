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
        <div
          key={formIndex}
          className="print-page"
        >
          {/* Header Section - Fixed for printing */}
          <div className="print-header">
            <div className="logo-container">
              <Image
                src="/images.png"
                alt="Logo"
                width={120}
                height={120}
                className="logo-image"
              />
            </div>

            <div className="title-container">
              <h1 className="title-main">SCAN INTERNATIONAL</h1>
              <h2 className="title-sub">DISTRITO NG RIZAL</h2>
              <h3 className="title-lokal">LOKAL NG KADALAGAHAN</h3>
              <p className="title-service">
                {formIndex === 2 ? 'SUGUAN NG SCAN SA PNK' : 
                 formIndex === 3 ? 'SUGUAN NG PAGBABANTAY SA DISTRITO' : 
                 'SUGUAN NG SCAN SA PAGSAMBA'}
              </p>
            </div>

            <div className="spacer" />
          </div>

          {/* Schedules Section */}
          <div className="schedules-container">
            {formSchedules.map((schedule, idx) => {
              const dateObj = new Date(schedule.date);
              const filipinoDay = filipinoDays[schedule.day.toLowerCase()] || schedule.day;

              return (
                <div key={idx} className="schedule-table-wrapper">
                  <table className="schedule-table">
                    <thead>
                      <tr>
                        <th colSpan={5} className="date-cell">
                          Petsa: {dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </th>
                        <th colSpan={2} className="day-cell">
                          Araw: {filipinoDay}
                        </th>
                        <th colSpan={2} className="time-cell">
                          Oras: {schedule.time}
                        </th>
                      </tr>
                      <tr>
                        <th className="col-number">Blg</th>
                        <th colSpan={4} className="col-name">Pangalan</th>
                        <th className="col-callsign">Call-Sign</th>
                        <th className="col-signature">Lagda Pagtanggap</th>
                        <th className="col-signature">Lagda Pagtupad</th>
                        <th className="col-role">Gampanan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.members.map((member, i) => (
                        <tr key={i}>
                          <td className="text-center">{i + 1}</td>
                          <td colSpan={4}>{member.name}</td>
                          <td className="text-center">{member.callSign}</td>
                          <td className="signature-cell"></td>
                          <td className="signature-cell"></td>
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
          <div className="footer-signatures">
            <p className="prepared-by">Naghanda:</p>
            <div className="signature-row">
              <div className="signature-item">
                <p className="signature-name">JUSTINE JACOB RODRIGUEZ</p>
                <p className="signature-title">KALIHIM SCAN</p>
              </div>
              <div className="signature-item">
                <p className="signature-name"></p>
                <p className="signature-title">PANGULO NG SCAN</p>
              </div>
            </div>
            <div className="signature-row">
              <div className="signature-item">
                <p className="signature-name">MARIANO M. LEBARDO JR.</p>
                <p className="signature-title">PD - TAGASUBAYBAY</p>
              </div>
              <div className="signature-item">
                <p className="signature-name">RODOLFO DE GUZMAN</p>
                <p className="signature-title">DESTINADO NG LOKAL</p>
              </div>
            </div>
          </div>
        </div>
      ))}

      <style jsx global>{`
        /* Print styles */
        @media print {
          * {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          @page {
            size: portrait;
            margin: 0.75cm;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
        }
        
        /* Screen styles */
        .print-container {
          display: flex;
          padding: 0.75rem;
          flex-direction: column;
          gap: 1rem;
        }
        
        .print-page {
          background: white;
          width: 216mm;
          min-height: 279mm;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          color: black;
          overflow: hidden;
          page-break-after: always;
          break-after: page;
        }
        
        /* Fixed Header Layout */
        .print-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding: 1rem 1rem 0 1rem;
        }
        
        .logo-container {
          width: 120px;
          flex-shrink: 0;
        }
        
        .logo-image {
          object-fit: contain;
          width: 100%;
          height: auto;
        }
        
        .title-container {
          flex: 1;
          text-align: center;
        }
        
        .title-main {
          font-weight: bold;
          font-size: 13px;
          text-transform: uppercase;
          margin: 0;
        }
        
        .title-sub {
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          margin: 0;
        }
        
        .title-lokal {
          font-size: 11px;
          text-transform: uppercase;
          margin: 0;
        }
        
        .title-service {
          font-size: 10px;
          text-transform: uppercase;
          margin: 0;
        }
        
        .spacer {
          width: 70px;
          flex-shrink: 0;
        }
        
        /* Schedules */
        .schedules-container {
          padding: 0 1rem;
          space-y: 1.5rem;
        }
        
        .schedule-table-wrapper {
          break-inside: avoid;
          page-break-inside: avoid;
          margin-bottom: 1.5rem;
        }
        
        .schedule-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
          border: 1px solid #c0c0c0;
        }
        
        .schedule-table th,
        .schedule-table td {
          border: 1px solid #c0c0c0;
          padding: 0.25rem 0.5rem;
        }
        
        .schedule-table th {
          font-weight: 600;
        }
        
        .date-cell,
        .day-cell,
        .time-cell {
          text-align: left;
        }
        
        .date-cell {
          width: 33.33%;
        }
        
        .day-cell {
          width: 33.33%;
        }
        
        .time-cell {
          width: 33.33%;
        }
        
        .col-number {
          width: 5%;
          text-align: center;
        }
        
        .col-name {
          width: 35%;
          text-align: left;
        }
        
        .col-callsign {
          width: 10%;
          text-align: center;
        }
        
        .col-signature {
          width: 15%;
          text-align: center;
        }
        
        .col-role {
          width: 10%;
          text-align: center;
        }
        
        .signature-cell {
          height: 24px;
        }
        
        .text-center {
          text-align: center;
        }
        
        /* Footer Signatures */
        .footer-signatures {
          margin-top: 3.5rem;
          padding: 0 1rem 1rem 1rem;
          font-size: 11px;
        }
        
        .prepared-by {
          margin-bottom: 1.5rem;
        }
        
        .signature-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          margin-bottom: 2rem;
        }
        
        .signature-item {
          text-align: center;
        }
        
        .signature-name {
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }
        
        .signature-title {
          margin: 0;
        }
        
        /* Print-specific overrides */
        @media print {
          .print-container {
            display: block;
            padding: 0;
            margin: 0;
          }
          
          .print-page {
            box-shadow: none;
            min-height: auto;
            margin-bottom: 0;
            width: 100%;
          }
          
          .print-header {
            padding: 0 0 0 0;
          }
          
          .schedules-container {
            padding: 0;
          }
          
          .footer-signatures {
            padding: 0;
          }
          
          .signature-row {
            gap: 5rem;
          }
          
          .schedule-table {
            break-inside: avoid;
          }
          
          
        }
      `}</style>
    </div>
  );
}
