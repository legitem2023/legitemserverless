'use client';

import React from 'react';

interface PersonData {
  id: number;
  picture: string;
  name: string;
  kagamitan: string;
  commento: string;
  phone: string;
  color: string;
}

const sampleData: PersonData[] = [
  {
    id: 1,
    picture: '/pix/RobsM.jpg',
    name: 'Robert Marquez',
    kagamitan: 'Paet, Level bar',
    commento: 'Masiglang maytungkulin sa scan at mananampalataya',
    phone: '0915-339-2813',
    color:'#ffffff'
  },
  {
    id: 2,
    picture: '/pix/RicoH.jpg',
    name: 'Federico Hernandez',
    kagamitan: 'Paet, Level bar',
    commento: 'Masiglang maytungkulin sa SCAN maaasahan at mananampalataya',
    phone: '0928-155-3448',
    color:'#ffffff'
  },
  {
    id: 3,
    picture: '/pix/JorgeD.jpg',
    name: 'Jorge Diocano',
    kagamitan: 'Paet, Level bar',
    commento: 'Masiglang Maytungkulin bilang Diakono at mananampalataya',
    phone: '0992-211-5630',
    color:'#ffffff'
  },
  {
    id: 4,
    picture: '/pix/NoImg.jpg',
    name: 'Eduardo Rosales',
    kagamitan: 'Paet, Level bar',
    commento: '',
    phone: '0951-958-4772',
    color:'#ffffff'
  },
  {
    id: 5,
    picture: '/pix/WillyS.jpg',
    name: 'Willy Sabado',
    kagamitan: 'Paet, Level bar, Barreta',
    commento: 'Masiglang kaanib at mananampalataya',
    phone: '0991-259-5112 ',
    color:'#ffffff'
  },{
    id: 6,
    picture: '/pix/JamesB.jpg',
    name: 'James Barrios',
    kagamitan: 'Paet, Level bar',
    commento: 'Masiglang maytungkulin bilang Diakono',
    phone: '0991-259-5112',
    color:'#ffffff'
  },
  {
    id: 7,
    picture: '/pix/AlvinBancat.jpg',
    name: 'Alvin Bancat',
    kagamitan: 'Paet, Level bar',
    commento: 'Masiglang maytungkulin bilang LSO at TSV mananampalataya',
    phone: '0993-106-8327',
    color:'#ffffff'
  },
  {
    id: 8,
    picture: '/pix/GerwinV.jpg',
    name: 'Gerwin Valle',
    kagamitan: 'Paet, Level bar',
    commento: 'Masiglang maytungkulin sa TSV mananampalataya',
    phone: '0992-610-6179',
    color:'#ffffff'
  },
  {
    id: 9,
    picture: '/pix/RhodzM.jpg',
    name: 'Rhodz Malabag',
    kagamitan: 'Paet, Level bar',
    commento: 'Masiglang maytungkulin bilang Mang-aawit at kagawad sa PNK',
    phone: '0947-752-5480',
    color:'#ffffff'
  },
  {
    id: 10,
    picture: '/pix/AnthonyB.jpg',
    name: 'Anthony Bancat',
    kagamitan: 'Paet, Level bar',
    commento: 'Masiglang mang-aawit mananampalataya',
    phone: '0920-367-1941',
    color:'#aff0d7'
  },
  {
    id: 11,
    picture: '/pix/DavidB.jpg',
    name: 'David Balubal',
    kagamitan: 'Paet, Level bar',
    commento: 'Masiglang maytungkulin bilang mang-aawit',
    phone: '0963-175-8402',
    color:'#aff0d7'
  },  
  {
    id: 12,
    picture: '/pix/DanDanB.jpg',
    name: 'Dan Dan Balubal',
    kagamitan: 'Paet, Level bar',
    commento: '',
    phone: '0970-580-8470',
    color:'#aff0d7'
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
            padding: '10mm',
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
          <div style={{ textAlign: 'left', marginBottom: '24px' }}>
            <h1
              style={{
                fontSize: '22px',
                fontWeight: 'bold',
                margin: 0,
                color: '#111827',
              }}
            >
              Construction Workers
            </h1>
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
                <tr key={person.id} style={{ verticalAlign: 'top',backgroundColor:person.color }}>
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
                        width: '55px',
                        height: '55px',
                        objectFit: 'cover',
                        borderRadius: '2px',
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
