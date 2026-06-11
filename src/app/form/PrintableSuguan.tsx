// PrintableSuguan.tsx
'use client';

import React from 'react';

interface Member {
  name: string;
  callSign: string;
  function: string | string[];
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

export const PrintableSuguan: React.FC<PrintableSuguanProps> = ({ forms, filipinoDays }) => {
  const formLabels = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];

  return (
    <>
      {forms.map((form, formIndex) => (
        form.length > 0 && (
          <div 
            key={formIndex} 
            className="print-page"
            style={{ 
              pageBreakAfter: formIndex < forms.length - 1 ? 'always' : 'auto',
              breakInside: 'avoid'
            }}
          >
            {/* Header */}
            <div className="print-header">
              <div className="text-center">
                <h1 className="text-2xl font-bold uppercase print:text-xl">Republic of the Philippines</h1>
                <h2 className="text-xl font-bold uppercase print:text-lg">Iglesia Ni Cristo</h2>
                <h3 className="text-lg font-semibold print:text-base">Locality of Kadalagahan</h3>
                <h4 className="text-md font-medium print:text-sm">{formLabels[formIndex]}</h4>
                <p className="text-sm print:text-xs">Schedule of Church Duties</p>
              </div>
            </div>

            {/* Form content */}
            <div className="print-content">
              {form.map((schedule, idx) => (
                <div key={idx} className="mb-6 print:mb-4 schedule-section">
                  <div className="mb-2">
                    <p className="font-semibold print:text-sm">
                      {filipinoDays[schedule.day.toLowerCase()] || schedule.day}: {schedule.time}
                    </p>
                    <p className="text-sm print:text-xs">
                      Service: {schedule.service === 'PNK' ? 'Pagsamba ng Kabataan' : 
                               schedule.service === 'Distrito' ? 'Distrito Worship' : 'Worship Service'}
                    </p>
                  </div>

                  <table className="w-full border-collapse border border-black">
                    <thead>
                      <tr className="bg-gray-100 print:bg-gray-200">
                        <th className="border border-black p-2 text-left print:p-1 print:text-xs" style={{ width: '40%' }}>Name</th>
                        <th className="border border-black p-2 text-left print:p-1 print:text-xs" style={{ width: '25%' }}>Call Sign</th>
                        <th className="border border-black p-2 text-left print:p-1 print:text-xs" style={{ width: '35%' }}>Function</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.members.map((member, memberIdx) => (
                        <tr key={memberIdx}>
                          <td className="border border-black p-2 print:p-1 print:text-xs">{member.name}</td>
                          <td className="border border-black p-2 print:p-1 print:text-xs">{member.callSign}</td>
                          <td className="border border-black p-2 print:p-1 print:text-xs">
                            {typeof member.function === 'string' ? member.function : member.function.join(', ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                   </table>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
      
      <style jsx global>{`
        @media print {
          /* Reset all margins and padding */
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white;
          }
          
          /* Each page container */
          .print-page {
            position: relative;
            margin: 0 !important;
            padding: 10mm 15mm !important;
            page-break-after: always;
            break-inside: avoid;
            box-sizing: border-box;
          }
          
          /* Remove page break after last page */
          .print-page:last-child {
            page-break-after: auto;
          }
          
          /* Header styling */
          .print-header {
            margin-top: 0 !important;
            padding-top: 0 !important;
            margin-bottom: 10mm;
          }
          
          /* Content styling */
          .print-content {
            margin-top: 0 !important;
          }
          
          /* Table styling */
          table {
            page-break-inside: avoid;
            width: 100%;
          }
          
          /* Consistent spacing */
          .schedule-section {
            margin-bottom: 8mm;
            page-break-inside: avoid;
          }
          
          /* Ensure all pages have the same top position */
          @page {
            size: A4;
            margin: 0mm;
          }
          
          /* Remove any automatic spacing from browser */
          * {
            margin-top: 0;
          }
          
          /* First child elements should have no top margin */
          .print-page > *:first-child {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
        }
        
        /* Screen styles */
        @media screen {
          .print-page {
            margin: 20px auto;
            padding: 20px;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            max-width: 210mm;
          }
        }
      `}</style>
    </>
  );
};
