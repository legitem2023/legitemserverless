// app/components/DeluxePrintGallery.tsx
'use client'
import React, { useEffect, useState } from 'react';

interface DeluxeProduct {
  id: number;
  name: string;
  category: string;
  description: string;
  technique: string;
  colors: number;
  area: string;
  turnaround: string;
  minOrder: number;
  price: string;
  artwork: string;
  fabrics: string[];
  finish: string[];
  limited: boolean;
  goldLabel?: boolean;
  pathData: string;
}

const deluxeProducts: DeluxeProduct[] = [
  {
    id: 1,
    name: "Imperial Tee",
    category: "Haute Couture Apparel",
    description: "Premium 24-singles combed cotton with pearlized underbase",
    technique: "8-Color Simulated Process with Metallic Accents",
    colors: 8,
    area: "Full Front (14\" x 18\") + Left Chest",
    turnaround: "5-7 business days • White Glove",
    minOrder: 12,
    price: "$22.50 - $45.00",
    artwork: "Vector separations • PMS matched • Trap-ready",
    fabrics: ["Supima Cotton", "Modal Blend", "Tencel Luxe"],
    finish: ["Soft-hand", "Metallic", "Puff"],
    limited: true,
    goldLabel: true,
    pathData: "M50 12L20 28v36l30 24 30-24V28L50 12z"
  },
  {
    id: 2,
    name: "Regal Hoodie",
    category: "Luxury Outerwear",
    description: "14oz French Terry fleece with interior print detailing",
    technique: "Platinum Series • 10-Color with Foil Accents",
    colors: 10,
    area: "Full Back (15\" x 20\") + Sleeves",
    turnaround: "7-9 business days • Express Available",
    minOrder: 6,
    price: "$58.00 - $89.00",
    artwork: "High-res separations • Spot process",
    fabrics: ["Pima Cotton Fleece", "Cashmere Blend", "Bamboo Terry"],
    finish: ["Foil", "Glitter", "Puff", "Suede"],
    limited: true,
    goldLabel: true,
    pathData: "M20 30l30-14 30 14v28l-30 16-30-16V30z"
  },
  {
    id: 3,
    name: "Signature Tote",
    category: "Accessories Collection",
    description: "Hand-finished Italian canvas with leather trim options",
    technique: "High-Density • 3-Color with Blind Deboss",
    colors: 3,
    area: "Centerpiece (12\" x 12\") + Handles",
    turnaround: "10-12 business days",
    minOrder: 25,
    price: "$28.00 - $65.00",
    artwork: "Vector • Deboss template required",
    fabrics: ["Italian Cotton Canvas", "Waxed Canvas", "Vegan Leather"],
    finish: ["Deboss", "High-Density", "Metallic"],
    limited: false,
    pathData: "M24 34h52v38H24V34zM30 28h40v10H30z"
  },
  {
    id: 4,
    name: "Crown Cap",
    category: "Headwear Atelier",
    description: "Wool-blend structured cap with leather strap and custom undervisor",
    technique: "3D Puff Embroidery + Screen Printed Liner",
    colors: 5,
    area: "Front (5\" x 3\") + Back + Undervisor",
    turnaround: "8-10 business days",
    minOrder: 12,
    price: "$32.00 - $58.00",
    artwork: "Vector with 3D relief map",
    fabrics: ["Merino Wool Blend", "Premium Twill", "Leather"],
    finish: ["3D Puff", "Chainstitch", "Foil"],
    limited: true,
    pathData: "M22 40c0-11 12-20 28-20s28 9 28 20v18H22V40z"
  },
  {
    id: 5,
    name: "Opulent Raglan",
    category: "Luxury Sport",
    description: "Japanese ring-spun with contrast melange sleeves",
    technique: "Discharge • Waterbase • 4-Color Process",
    colors: 6,
    area: "Full Garment Printing",
    turnaround: "6-8 business days",
    minOrder: 24,
    price: "$34.00 - $62.00",
    artwork: "High-res • Color separations",
    fabrics: ["Japanese Cotton", "Bamboo Viscose", "Recycled Poly"],
    finish: ["Discharge", "Soft-hand", "Vintage"],
    limited: false,
    pathData: "M26 28l24-12 24 12v32l-24 14-24-14V28z"
  },
  {
    id: 6,
    name: "Artisan Apron",
    category: "Guild Collection",
    description: "Double-front apron with tool pockets and branded hardware",
    technique: "Leather Patch + Screen Printed Detail",
    colors: 2,
    area: "Bib + Pocket",
    turnaround: "7-10 business days",
    minOrder: 10,
    price: "$45.00 - $85.00",
    artwork: "Vector • Emboss template",
    fabrics: ["14oz Selvedge Denim", "Oilcloth", "Waxed Canvas"],
    finish: ["Leather Patch", "Deboss", "Contrast Stitch"],
    limited: true,
    goldLabel: true,
    pathData: "M32 40c0-14 36-14 36 0v36H32V40zM44 28h12v16H44z"
  },
  {
    id: 7,
    name: "Petite Luxe",
    category: "Youth Atelier",
    description: "Organic cotton kids wear with heirloom quality",
    technique: "Waterbase • 3-Color • Non-toxic inks",
    colors: 3,
    area: "Front (8\" x 10\")",
    turnaround: "5-7 business days",
    minOrder: 36,
    price: "$18.00 - $32.00",
    artwork: "Simple vector • Child-safe cert",
    fabrics: ["Organic Cotton", "Bamboo", "Oeko-tex Certified"],
    finish: ["Waterbase", "Eco-friendly", "Peach finish"],
    limited: false,
    pathData: "M54 20L74 32v24L54 68 34 56V32L54 20z"
  },
  {
    id: 8,
    name: "Majestic Crew",
    category: "Fleece Royale",
    description: "Heavyweight 16oz fleece with custom neck labels",
    technique: "Embroidery + Screen Print Combo",
    colors: 7,
    area: "Full Front + Left Chest Embroidery",
    turnaround: "8-11 business days",
    minOrder: 12,
    price: "$48.00 - $82.00",
    artwork: "Vector + Digitized embroidery file",
    fabrics: ["Supreme Fleece", "Alpaca Blend", "Heavy Cotton"],
    finish: ["Embroidery", "Suede", "Distressed"],
    limited: true,
    pathData: "M28 36l22-10 22 10v28l-22 12-22-12V36z"
  }
];

// Mobile menu component
const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  
  return (
    <div className="mobile-menu-overlay" onClick={onClose}>
      <div className="mobile-menu-content" onClick={e => e.stopPropagation()}>
        <button className="mobile-menu-close" onClick={onClose}>✕</button>
        <div className="mobile-menu-items">
          <a href="#" className="mobile-menu-item">Collection</a>
          <a href="#" className="mobile-menu-item">Atelier</a>
          <a href="#" className="mobile-menu-item">Lookbook</a>
          <a href="#" className="mobile-menu-item">Contact</a>
          <a href="#" className="mobile-menu-item gold">Book Consultation</a>
        </div>
      </div>
    </div>
  );
};

// Deluxe Thumbnail with Gold Accents
const DeluxeThumbnail = ({ pathData, name, goldLabel }: { pathData: string; name: string; goldLabel?: boolean }) => {
  const svgMarkup = `
    <svg width="180" height="180" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#bf9530"/>
          <stop offset="50%" style="stop-color:#fcf6ba"/>
          <stop offset="100%" style="stop-color:#b38728"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <pattern id="damask" patternUnits="userSpaceOnUse" width="20" height="20">
          <path d="M10 0L20 10L10 20L0 10Z" fill="none" stroke="rgba(227,179,76,0.1)" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="100" height="100" fill="#0a121c" rx="12" filter="url(#glow)"/>
      <rect width="100" height="100" fill="url(#damask)" rx="12"/>
      <path d="${pathData}" fill="url(#goldGradient)" transform="translate(0, 15) scale(0.85)" filter="url(#glow)"/>
      <circle cx="50" cy="85" r="4" fill="#e3b34c" opacity="0.3"/>
      ${goldLabel ? `<text x="15" y="25" fill="#e3b34c" font-size="8" font-family="Cormorant Garamond, serif" font-weight="bold">✦ LIMITED ✦</text>` : ''}
    </svg>
  `;
  
  const encodedSvg = `data:image/svg+xml,${encodeURIComponent(svgMarkup)}`;
  
  return (
    <div className="deluxe-thumbnail-wrapper">
      <div className="thumbnail-gold-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={encodedSvg} alt={name} className="deluxe-thumbnail" loading="lazy" />
      </div>
      {goldLabel && <div className="gold-badge">COUTURE</div>}
    </div>
  );
};

// Main Deluxe Gallery Component
export default function DeluxePrintGallery() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Set initial width
    setWindowWidth(window.innerWidth);
    
    // Handle resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  return (
    <div className="deluxe-container">
      <style jsx>{`
        .deluxe-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 1rem;
          background: #0f0f13;
          background-image: 
            radial-gradient(circle at 30% 40%, rgba(227, 179, 76, 0.03) 0%, transparent 30%),
            repeating-linear-gradient(45deg, rgba(227, 179, 76, 0.02) 0px, rgba(227, 179, 76, 0.02) 1px, transparent 1px, transparent 15px);
          font-family: 'Cormorant Garamond', 'Times New Roman', serif;
          min-height: 100vh;
        }

        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&display=swap');

        /* Mobile Navigation */
        .mobile-nav {
          display: none;
          position: sticky;
          top: 0;
          z-index: 100;
          background: #0a0c12;
          padding: 1rem;
          border-bottom: 1px solid rgba(227, 179, 76, 0.3);
          backdrop-filter: blur(10px);
        }

        .mobile-nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mobile-logo {
          font-size: 1.4rem;
          font-weight: 700;
          background: linear-gradient(135deg, #ffffff 0%, #e3b34c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .mobile-menu-button {
          background: none;
          border: 1px solid #e3b34c;
          color: #e3b34c;
          font-size: 1.5rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
        }

        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          z-index: 1000;
          backdrop-filter: blur(5px);
        }

        .mobile-menu-content {
          position: fixed;
          top: 0;
          right: 0;
          width: 80%;
          max-width: 400px;
          height: 100vh;
          background: #14181f;
          padding: 2rem;
          border-left: 1px solid #e3b34c;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .mobile-menu-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #e3b34c;
          font-size: 2rem;
          cursor: pointer;
        }

        .mobile-menu-items {
          margin-top: 4rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .mobile-menu-item {
          color: white;
          text-decoration: none;
          font-size: 1.2rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(227, 179, 76, 0.2);
        }

        .mobile-menu-item.gold {
          color: #e3b34c;
          font-weight: 700;
        }

        /* Header */
        .deluxe-header {
          background: linear-gradient(165deg, #0c1119 0%, #1a1f2b 100%);
          padding: clamp(1.5rem, 5vw, 4rem);
          border-radius: clamp(20px, 5vw, 40px);
          margin-bottom: clamp(1.5rem, 4vw, 4rem);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(227, 179, 76, 0.3);
          box-shadow: 0 20px 40px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.1);
        }

        .header-gold-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, transparent, #e3b34c, #f9e6b3, #e3b34c, transparent);
        }

        .deluxe-header h1 {
          font-size: clamp(2rem, 8vw, 5rem);
          font-weight: 700;
          margin: 0;
          line-height: 1.1;
          position: relative;
          z-index: 2;
          background: linear-gradient(135deg, #ffffff 0%, #f9e6b3 50%, #e3b34c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 2px 5px rgba(0,0,0,0.3);
          letter-spacing: clamp(1px, 2vw, 2px);
        }

        .header-subtitle {
          font-size: clamp(0.9rem, 3vw, 1.4rem);
          color: #b8a87c;
          letter-spacing: clamp(2px, 1vw, 4px);
          margin-top: 0.5rem;
          font-weight: 300;
          text-transform: uppercase;
        }

        .header-emblems {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(1rem, 3vw, 3rem);
          margin-top: clamp(1rem, 3vw, 2rem);
        }

        .emblem {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #e3b34c;
          border-right: 1px solid rgba(227, 179, 76, 0.3);
          padding-right: clamp(1rem, 3vw, 2rem);
        }

        .emblem:last-child {
          border-right: none;
        }

        .emblem-number {
          font-size: clamp(1.2rem, 4vw, 2.2rem);
          font-weight: 700;
          color: white;
        }

        .emblem-text {
          font-size: clamp(0.7rem, 2vw, 0.9rem);
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #b8a87c;
          text-align: center;
        }

        /* Products Grid */
        .deluxe-products-grid {
          display: flex;
          flex-direction: column;
          gap: clamp(1rem, 3vw, 2.5rem);
        }

        .deluxe-card {
          display: grid;
          grid-template-columns: ${isMobile ? '1fr' : (isTablet ? '180px 1fr' : '220px 1fr')};
          gap: clamp(1rem, 3vw, 2.5rem);
          padding: clamp(1rem, 3vw, 2.5rem);
          background: #14181f;
          border-radius: clamp(20px, 4vw, 40px);
          border: 1px solid #2a2f38;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          position: relative;
          overflow: hidden;
        }

        .deluxe-card:hover {
          transform: ${!isMobile ? 'scale(1.02) translateY(-5px)' : 'none'};
          border-color: #e3b34c;
        }

        /* Thumbnail */
        .deluxe-thumbnail-wrapper {
          position: relative;
          width: ${isMobile ? '120px' : (isTablet ? '160px' : '100%')};
          margin: ${isMobile ? '0 auto' : '0'};
        }

        .thumbnail-gold-border {
          padding: 6px;
          background: linear-gradient(145deg, #bf9530, #fcf6ba, #b38728);
          border-radius: 16px;
        }

        .deluxe-thumbnail {
          width: 100%;
          height: auto;
          border-radius: 12px;
          display: block;
        }

        .gold-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: linear-gradient(145deg, #bf9530, #fcf6ba);
          color: #0a0c12;
          padding: 0.25rem 0.75rem;
          border-radius: 40px;
          font-weight: 700;
          font-size: 0.7rem;
          white-space: nowrap;
        }

        /* Product Details */
        .product-header {
          display: flex;
          flex-direction: ${isMobile ? 'column' : 'row'};
          align-items: ${isMobile ? 'flex-start' : 'center'};
          gap: ${isMobile ? '0.5rem' : '1.5rem'};
          margin-bottom: 1rem;
        }

        .product-name {
          font-size: clamp(1.5rem, 5vw, 2.8rem);
          font-weight: 700;
          margin: 0;
          background: linear-gradient(135deg, #ffffff 0%, #e3b34c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .product-category {
          font-size: clamp(0.7rem, 2vw, 1rem);
          color: #b8a87c;
          text-transform: uppercase;
          letter-spacing: 1px;
          border: 1px solid rgba(227, 179, 76, 0.3);
          padding: 0.25rem 1rem;
          border-radius: 40px;
          white-space: nowrap;
        }

        .product-description {
          font-size: clamp(0.9rem, 2.5vw, 1.1rem);
          color: #b0b7c5;
          margin-bottom: 1.5rem;
          line-height: 1.6;
          font-style: italic;
          border-left: 2px solid #e3b34c;
          padding-left: 1rem;
        }

        /* Specs Grid - Responsive */
        .specs-grid-luxury {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(${isMobile ? '140px' : '200px'}, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
          background: rgba(0,0,0,0.3);
          padding: clamp(0.8rem, 2vw, 1.5rem);
          border-radius: 16px;
        }

        .spec-luxury-label {
          font-size: clamp(0.7rem, 1.8vw, 0.8rem);
          text-transform: uppercase;
          color: #8f9bb3;
          letter-spacing: 0.5px;
        }

        .spec-luxury-value {
          font-size: clamp(0.9rem, 2.2vw, 1.1rem);
          font-weight: 600;
          color: #e3b34c;
        }

        /* Finish Tags */
        .finish-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .finish-tag {
          background: linear-gradient(145deg, #1e2632, #14181f);
          border: 1px solid #e3b34c;
          color: #e3b34c;
          padding: 0.3rem 0.8rem;
          border-radius: 40px;
          font-size: clamp(0.7rem, 2vw, 0.85rem);
          white-space: nowrap;
        }

        /* Action Buttons - Stack on mobile */
        .action-buttons-luxury {
          display: flex;
          flex-direction: ${isMobile ? 'column' : 'row'};
          gap: 1rem;
          margin-top: 1rem;
        }

        .btn-primary-luxury,
        .btn-secondary-luxury {
          padding: ${isMobile ? '0.8rem 1rem' : '1rem 2rem'};
          border-radius: 50px;
          font-weight: 600;
          font-size: clamp(0.8rem, 2.2vw, 1rem);
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          width: ${isMobile ? '100%' : 'auto'};
        }

        .btn-primary-luxury {
          background: linear-gradient(145deg, #bf9530, #f9e6b3);
          border: 1px solid #fcf6ba;
          color: #0a0c12;
        }

        .btn-secondary-luxury {
          background: transparent;
          border: 1px solid #e3b34c;
          color: #e3b34c;
        }

        /* Tablet and Desktop adjustments */
        @media (min-width: 1024px) {
          .deluxe-container {
            padding: 2rem;
          }
        }

        /* Hide desktop elements on mobile */
        @media (max-width: 767px) {
          .mobile-nav {
            display: block;
          }
          
          .desktop-only {
            display: none;
          }
        }

        /* Small phone adjustments */
        @media (max-width: 380px) {
          .specs-grid-luxury {
            grid-template-columns: 1fr;
          }
          
          .product-name {
            font-size: 1.3rem;
          }
          
          .finish-tag {
            font-size: 0.65rem;
          }
        }
      `}</style>

      {/* Mobile Navigation */}
      <div className="mobile-nav">
        <div className="mobile-nav-header">
          <span className="mobile-logo">A&R SILKSCREEN</span>
          <button className="mobile-menu-button" onClick={() => setMobileMenuOpen(true)}>
            ☰
          </button>
        </div>
      </div>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Header */}
      <header className="deluxe-header">
        <div className="header-gold-accent"></div>
        <h1>A & R <span>SILKSCREEN</span></h1>
        <div className="header-subtitle">ATELIER • EST. 2008</div>
        <div className="header-emblems">
          <div className="emblem">
            <span className="emblem-number">✦ 24K ✦</span>
            <span className="emblem-text">Gold Service</span>
          </div>
          <div className="emblem">
            <span className="emblem-number">∞</span>
            <span className="emblem-text">Unlimited Revisions</span>
          </div>
          <div className="emblem">
            <span className="emblem-number">8</span>
            <span className="emblem-text">Master Printers</span>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <div className="deluxe-products-grid">
        {deluxeProducts.map((product) => (
          <div key={product.id} className="deluxe-card">
            <DeluxeThumbnail 
              pathData={product.pathData} 
              name={product.name}
              goldLabel={product.goldLabel}
            />
            
            <div className="product-details">
              <div className="product-header">
                <h2 className="product-name">{product.name}</h2>
                <span className="product-category">{product.category.split(' ')[0]}</span>
              </div>
              
              <p className="product-description">"{product.description}"</p>
              
              <div className="specs-grid-luxury">
                <div className="spec-luxury">
                  <span className="spec-luxury-label">Colors</span>
                  <span className="spec-luxury-value">{product.colors}</span>
                </div>
                <div className="spec-luxury">
                  <span className="spec-luxury-label">Min Order</span>
                  <span className="spec-luxury-value">{product.minOrder}</span>
                </div>
                <div className="spec-luxury">
                  <span className="spec-luxury-label">Price</span>
                  <span className="spec-luxury-value">{product.price}</span>
                </div>
                <div className="spec-luxury">
                  <span className="spec-luxury-label">Turnaround</span>
                  <span className="spec-luxury-value">{product.turnaround.split('•')[0]}</span>
                </div>
              </div>
              
              <div className="finish-tags">
                {product.finish.slice(0, isMobile ? 2 : 4).map((f, idx) => (
                  <span key={idx} className="finish-tag">✦ {f} ✦</span>
                ))}
                {isMobile && product.finish.length > 2 && (
                  <span className="finish-tag">+{product.finish.length - 2}</span>
                )}
              </div>
              
              <div className="action-buttons-luxury">
                <button className="btn-primary-luxury">
                  {isMobile ? 'Consult' : 'Request Consultation'}
                </button>
                <button className="btn-secondary-luxury">
                  {isMobile ? 'View' : 'View Lookbook'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
