'use client';

import React from 'react';

interface PersonData {
  id: number;
  picture: string;
  name: string;
  kagamitan: string;
  commento: string;
  phone: string;
}

const sampleData: PersonData[] = [
  {
    id: 1,
    picture: 'https://i.pravatar.cc/150?img=1',
    name: 'Juan Dela Cruz',
    kagamitan: 'Laptop, Cellphone',
    commento: 'Regular na miyembro',
    phone: '0917-123-4567',
  },
  {
    id: 2,
    picture: 'https://i.pravatar.cc/150?img=2',
    name: 'Maria Santos',
    kagamitan: 'Tablet, Printer',
    commento: 'Bagong miyembro',
    phone: '0918-234-5678',
  },
  {
    id: 3,
    picture: 'https://i.pravatar.cc/150?img=3',
    name: 'Pedro Reyes',
    kagamitan: 'Desktop, Scanner',
    commento: 'Aktibong miyembro',
    phone: '0919-345-6789',
  },
];

export default function PrintTablePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print styles - inline para isang file lang */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background: '#f3f4f6',
          padding: '32px 16px',
        }}
        className="print-wrapper"
      >
        {/* Print Button */}
        <div
          className="no-print"
          style={{
            maxWidth: '210mm',
            margin: '0 auto 16px auto',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={handlePrint}
            style={{
              background: '#2563eb',
              color: 'white',
              fontWeight: 600,
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              fontSize: '14px',
            }}
          >
            🖨️ Print (A4 Portrait)
          </button>
        </div>

        {/* A4 Portrait Paper */}
        <div
          style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '15mm',
            margin: '0 auto',
            background: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            boxSizing: 'border-box',
            fontFamily: 'Arial, sans-serif',
            color: '#1f2937',
          }}
          className="a4-paper"
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1
              style={{
                fontSize: '22px',
                fontWeight: 'bold',
                margin: 0,
                color: '#111827',
              }}
            >
              Listahan ng mga Tao
            </h1>
            <p
              style={{
                fontSize: '12px',
                color: '#6b7280',
                marginTop: '6px',
              }}
            >
              Petsa: {new Date().toLocaleDateString('fil-PH')}
            </p>
          </div>

          {/* Table */}
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '12px',
            }}
          >
            <thead>
              <tr style={{ background: '#e5e7eb' }}>
                <th
                  style={{
                    border: '1px solid #9ca3af',
                    padding: '8px',
                    textAlign: 'left',
                    width: '15%',
                  }}
                >
                  Picture
                </th>
                <th
                  style={{
                    border: '1px solid #9ca3af',
                    padding: '8px',
                    textAlign: 'left',
                    width: '20%',
                  }}
                >
                  Pangalan
                </th>
                <th
                  style={{
                    border: '1px solid #9ca3af',
                    padding: '8px',
                    textAlign: 'left',
                    width: '20%',
                  }}
                >
                  Kagamitan
                </th>
                <th
                  style={{
                    border: '1px solid #9ca3af',
                    padding: '8px',
                    textAlign: 'left',
                    width: '25%',
                  }}
                >
                  Commento
                </th>
                <th
                  style={{
                    border: '1px solid #9ca3af',
                    padding: '8px',
                    textAlign: 'left',
                    width: '20%',
                  }}
                >
                  Phone Number
                </th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((person) => (
                <tr key={person.id} style={{ verticalAlign: 'top' }}>
                  <td
                    style={{
                      border: '1px solid #9ca3af',
                      padding: '8px',
                    }}
                  >
                    <img
                      src={person.picture}
                      alt={person.name}
                      style={{
                        width: '64px',
                        height: '64px',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: '2px solid #d1d5db',
                      }}
                    />
                  </td>
                  <td
                    style={{
                      border: '1px solid #9ca3af',
                      padding: '8px',
                      fontWeight: 500,
                    }}
                  >
                    {person.name}
                  </td>
                  <td
                    style={{
                      border: '1px solid #9ca3af',
                      padding: '8px',
                    }}
                  >
                    {person.kagamitan}
                  </td>
                  <td
                    style={{
                      border: '1px solid #9ca3af',
                      padding: '8px',
                    }}
                  >
                    {person.commento}
                  </td>
                  <td
                    style={{
                      border: '1px solid #9ca3af',
                      padding: '8px',
                    }}
                  >
                    {person.phone}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div
            style={{
              marginTop: '32px',
              fontSize: '11px',
              color: '#6b7280',
              textAlign: 'center',
            }}
          >
            Kabuuang bilang: {sampleData.length}
          </div>
        </div>
      </div>
    </>
  );
}
