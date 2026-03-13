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
  // ANIME COLLECTION
  {
    id: 1,
    name: "Naruto Uzumaki",
    category: "Anime Collection",
    description: "Rasengan energy effect with Nine-Tails chakra mode - metallic gold and orange gradient",
    technique: "8-Color Simulated with Metallic Inks",
    colors: 8,
    area: "Full Front (14\" x 18\")",
    turnaround: "5-7 business days",
    minOrder: 12,
    price: "$32.50 - $55.00",
    artwork: "Vector art • PMS matched",
    fabrics: ["Premium Cotton", "Tri-blend", "Athletic"],
    finish: ["Metallic", "Glow-in-Dark", "Soft-hand"],
    limited: true,
    goldLabel: true,
    pathData: "M50 12L20 28v36l30 24 30-24V28L50 12z M35 45L45 35L55 45L50 60L35 45Z"
  },
  {
    id: 2,
    name: "Goku Ultra Instinct",
    category: "Anime Collection",
    description: "Silver hair with aura effect - prismatic silver and blue metallic tones",
    technique: "9-Color Process with Prismatic Foil",
    colors: 9,
    area: "Full Front + Back",
    turnaround: "7-9 business days",
    minOrder: 6,
    price: "$45.00 - $75.00",
    artwork: "High-res • Color separations",
    fabrics: ["Heavy Cotton", "French Terry", "Blend"],
    finish: ["Foil", "Holographic", "Puff"],
    limited: true,
    goldLabel: true,
    pathData: "M30 20L70 20L80 40L50 80L20 40L30 20Z M45 35L55 35L50 50L45 35Z"
  },
  {
    id: 3,
    name: "Pikachu Thunder",
    category: "Pokémon Series",
    description: "Thunderbolt attack with sparkle effects - electric yellow with glitter base",
    technique: "5-Color Spot with Glitter Base",
    colors: 5,
    area: "Front Center (12\" x 14\")",
    turnaround: "4-6 business days",
    minOrder: 24,
    price: "$24.00 - $38.00",
    artwork: "Vector • Bold lines",
    fabrics: ["Cotton", "Baby Rib", "Youth"],
    finish: ["Glitter", "Puff", "Yellow Glow"],
    limited: false,
    pathData: "M40 30L60 30L70 50L50 75L30 50L40 30Z M45 45L55 45L50 60L45 45Z"
  },
  {
    id: 4,
    name: "Levi Ackerman",
    category: "Attack on Titan",
    description: "Survey Corps emblem with gear effects - dark tones with silver highlights",
    technique: "4-Color High-Density Discharge",
    colors: 4,
    area: "Full Back (15\" x 20\")",
    turnaround: "6-8 business days",
    minOrder: 12,
    price: "$38.00 - $58.00",
    artwork: "Vector • High contrast",
    fabrics: ["Heavy Cotton", "Dark Garments"],
    finish: ["Distressed", "Metallic", "Discharge"],
    limited: true,
    goldLabel: true,
    pathData: "M25 30L75 30L85 50L50 85L15 50L25 30Z M40 45L60 45L50 70L40 45Z"
  },

  // DISNEY COLLECTION
  {
    id: 5,
    name: "Mickey Mouse",
    category: "Disney Classics",
    description: "Vintage Mickey with sorcerer hat - nostalgic sepia with gold foil details",
    technique: "Vintage Discharge + Gold Foil",
    colors: 4,
    area: "Front (12\" x 14\")",
    turnaround: "5-7 business days",
    minOrder: 24,
    price: "$28.00 - $42.00",
    artwork: "Vector • Vintage style",
    fabrics: ["Soft Cotton", "Heritage Blend"],
    finish: ["Foil", "Sepia", "Vintage"],
    limited: false,
    pathData: "M35 25L65 25L80 45L50 80L20 45L35 25Z M40 40L60 40L50 60L40 40Z"
  },
  {
    id: 6,
    name: "Elsa",
    category: "Frozen Collection",
    description: "Ice palace background with snowflake details - crystal blue with glitter",
    technique: "6-Color with Glitter Overlay",
    colors: 6,
    area: "Full Front",
    turnaround: "5-7 business days",
    minOrder: 18,
    price: "$34.00 - $52.00",
    artwork: "Gradient • Snowflake details",
    fabrics: ["Premium Cotton", "Girls Fit"],
    finish: ["Glitter", "Holographic", "Ice Effect"],
    limited: true,
    goldLabel: true,
    pathData: "M30 25L70 25L85 45L50 85L15 45L30 25Z M35 40L65 40L50 70L35 40Z"
  },
  {
    id: 7,
    name: "Stitch",
    category: "Lilo & Stitch",
    description: "Experiment 626 with Elvis pose - electric blue with glow accents",
    technique: "5-Color with Glow-in-Dark",
    colors: 5,
    area: "Front Center",
    turnaround: "4-6 business days",
    minOrder: 24,
    price: "$26.00 - $40.00",
    artwork: "Vector • Cartoon style",
    fabrics: ["Cotton", "Youth", "Toddler"],
    finish: ["Glow-in-Dark", "Pop Art", "Soft-hand"],
    limited: false,
    pathData: "M40 30L60 30L75 50L50 75L25 50L40 30Z M42 45L58 45L50 60L42 45Z"
  },
  {
    id: 8,
    name: "Nightmare Before Christmas",
    category: "Tim Burton Collection",
    description: "Jack Skellington with Zero - gothic patterns with glow effects",
    technique: "7-Color with Glow + Metallic",
    colors: 7,
    area: "Full Front + Sleeve",
    turnaround: "6-8 business days",
    minOrder: 12,
    price: "$42.00 - $65.00",
    artwork: "Vector • Gothic style",
    fabrics: ["Heavy Cotton", "Dark Garments"],
    finish: ["Glow", "Metallic", "Striped"],
    limited: true,
    goldLabel: true,
    pathData: "M20 25L80 25L90 50L50 90L10 50L20 25Z M35 40L65 40L50 75L35 40Z"
  },

  // MARVEL COLLECTION
  {
    id: 9,
    name: "Iron Man",
    category: "Marvel Avengers",
    description: "Arc reactor with suit details - metallic red and gold foil",
    technique: "5-Color Metallic Foil",
    colors: 5,
    area: "Full Chest",
    turnaround: "5-7 business days",
    minOrder: 12,
    price: "$38.00 - $58.00",
    artwork: "Vector • Tech lines",
    fabrics: ["Premium Cotton", "Performance"],
    finish: ["Metallic", "Foil", "Armor effect"],
    limited: true,
    goldLabel: true,
    pathData: "M25 20L75 20L90 45L50 90L10 45L25 20Z M35 35L65 35L50 70L35 35Z"
  },
  {
    id: 10,
    name: "Spider-Man",
    category: "Spider-Verse",
    description: "Miles Morales graffiti style - urban art with spray paint effect",
    technique: "7-Color with Halftones",
    colors: 7,
    area: "Full Front",
    turnaround: "5-7 business days",
    minOrder: 18,
    price: "$32.00 - $48.00",
    artwork: "Comic style • Halftones",
    fabrics: ["Cotton", "Streetwear"],
    finish: ["Graffiti", "Urban", "Pop Art"],
    limited: false,
    pathData: "M30 25L70 25L85 48L50 85L15 48L30 25Z M38 38L62 38L50 68L38 38Z"
  },
  {
    id: 11,
    name: "Thor",
    category: "Marvel Avengers",
    description: "Stormbreaker with lightning effects - hammered metal texture",
    technique: "6-Color Puff + Metallic",
    colors: 6,
    area: "Full Back",
    turnaround: "6-8 business days",
    minOrder: 12,
    price: "$44.00 - $68.00",
    artwork: "Vector • Viking style",
    fabrics: ["Heavy Cotton", "Fleece"],
    finish: ["Puff", "Metallic", "Textured"],
    limited: true,
    goldLabel: true,
    pathData: "M22 22L78 22L92 47L50 92L8 47L22 22Z M32 37L68 37L50 75L32 37Z"
  },
  {
    id: 12,
    name: "Black Panther",
    category: "Wakanda Forever",
    description: "Vibranium suit pattern with purple glow - advanced texture print",
    technique: "5-Color High-Density + Glow",
    colors: 5,
    area: "Full Front",
    turnaround: "6-8 business days",
    minOrder: 12,
    price: "$40.00 - $62.00",
    artwork: "Tribal pattern • Vector",
    fabrics: ["Premium Cotton", "Dark garments"],
    finish: ["Glow", "Texture", "Tribal"],
    limited: true,
    goldLabel: true,
    pathData: "M28 23L72 23L88 46L50 88L12 46L28 23Z M36 36L64 36L50 72L36 36Z"
  },

  // ORIGINAL ANIME-STYLE
  {
    id: 13,
    name: "Cyber Samurai",
    category: "Original Series",
    description: "Futuristic samurai with neon accents - cyberpunk aesthetic",
    technique: "8-Color ChromaBlast + Neon",
    colors: 8,
    area: "Full Front + Sleeves",
    turnaround: "7-9 business days",
    minOrder: 10,
    price: "$48.00 - $72.00",
    artwork: "Vector • Cyberpunk",
    fabrics: ["Performance", "Streetwear"],
    finish: ["Neon", "Geometric", "Glow"],
    limited: true,
    goldLabel: true,
    pathData: "M20 20L80 20L95 50L50 95L5 50L20 20Z M30 35L70 35L50 80L30 35Z"
  },
  {
    id: 14,
    name: "Dragon Spirit",
    category: "Mythical Collection",
    description: "Eastern dragon with cloud details - traditional with modern gradient",
    technique: "9-Color Simulated Process",
    colors: 9,
    area: "Full Back",
    turnaround: "8-10 business days",
    minOrder: 8,
    price: "$55.00 - $85.00",
    artwork: "Detailed vector • Asian style",
    fabrics: ["Premium", "Silk blend"],
    finish: ["Gradient", "Detailed", "Metallic"],
    limited: true,
    goldLabel: true,
    pathData: "M15 15L85 15L98 50L50 98L2 50L15 15Z M25 30L75 30L50 85L25 30Z"
  }
];

// Mobile menu component (EXACTLY THE SAME)
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

// Deluxe Thumbnail with Gold Accents (UPDATED with anime/DIsney/Marvel paths)
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

// Main Deluxe Gallery Component (EXACTLY THE SAME DESIGN, ONLY PRODUCTS CHANGED)
export default function DeluxePrintGallery() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
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

        /* Header - EXACTLY THE SAME */
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

        /* Products Grid - SAME LAYOUT */
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

        /* Specs Grid */
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

        /* Action Buttons */
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

        @media (max-width: 767px) {
          .mobile-nav {
            display: block;
          }
        }

        @media (max-width: 380px) {
          .specs-grid-luxury {
            grid-template-columns: 1fr;
          }
          
          .product-name {
            font-size: 1.3rem;
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

      {/* Header - EXACTLY THE SAME */}
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

      {/* Products Grid - UPDATED WITH ANIME/DISNEY/MARVEL PRODUCTS */}
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
                <span className="product-category">{product.category}</span>
              </div>
              
              <p className="product-description">"{product.description}"</p>
              
              <div className="specs-grid-luxury">
                <div className="spec-luxury">
                  <span className="spec-luxury-label">Technique</span>
                  <span className="spec-luxury-value">{product.technique.split(' ')[0]}</span>
                </div>
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
