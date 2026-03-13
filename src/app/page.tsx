// app/components/DeluxeAnimeGallery.tsx
'use client'
import React, { useEffect, useState } from 'react';

interface AnimeProduct {
  id: number;
  name: string;
  franchise: 'Anime' | 'Disney' | 'Marvel' | 'Original';
  series: string;
  description: string;
  technique: string;
  colors: number;
  style: string[];
  popular: boolean;
  exclusive: boolean;
  limited: boolean;
  pathData: string;
  character: string;
}

const animeProducts: AnimeProduct[] = [
  // ANIME COLLECTION
  {
    id: 1,
    name: "Naruto Uzumaki",
    franchise: "Anime",
    series: "Naruto Shippuden",
    description: "Rasengan energy effect with Nine-Tails chakra mode - metallic gold and orange gradient",
    technique: "Simulated Process with Metallic Inks",
    colors: 8,
    style: ["Manga Halftone", "Metallic", "Glow-in-Dark"],
    popular: true,
    exclusive: true,
    limited: false,
    character: "Naruto",
    pathData: "M50 12L20 28v36l30 24 30-24V28L50 12z M35 45L45 35L55 45L50 60L35 45Z"
  },
  {
    id: 2,
    name: "Goku Ultra Instinct",
    franchise: "Anime",
    series: "Dragon Ball Super",
    description: "Silver hair with aura effect - prismatic silver and blue tones",
    technique: "8-Color Process with Prismatic Foil",
    colors: 9,
    style: ["Manga Effect", "Foil", "Holographic"],
    popular: true,
    exclusive: true,
    limited: true,
    character: "Goku",
    pathData: "M30 20L70 20L80 40L50 80L20 40L30 20Z M45 35L55 35L50 50L45 35Z"
  },
  {
    id: 3,
    name: "Pikachu Thunder",
    franchise: "Anime",
    series: "Pokémon",
    description: "Thunderbolt attack with sparkle effects - electric yellow with foil accents",
    technique: "Spot Color with Glitter Base",
    colors: 5,
    style: ["Chibi Style", "Glitter", "Puff"],
    popular: true,
    exclusive: false,
    limited: false,
    character: "Pikachu",
    pathData: "M40 30L60 30L70 50L50 75L30 50L40 30Z M45 45L55 45L50 60L45 45Z"
  },
  {
    id: 4,
    name: "Levi Ackerman",
    franchise: "Anime",
    series: "Attack on Titan",
    description: "Survey Corps emblem with gear effects - dark tones with silver highlights",
    technique: "High-Density Discharge",
    colors: 4,
    style: ["Dark Fantasy", "Metallic", "Distressed"],
    popular: false,
    exclusive: true,
    limited: true,
    character: "Levi",
    pathData: "M25 30L75 30L85 50L50 85L15 50L25 30Z M40 45L60 45L50 70L40 45Z"
  },

  // DISNEY COLLECTION
  {
    id: 5,
    name: "Mickey Mouse",
    franchise: "Disney",
    series: "Classic",
    description: "Vintage Mickey with sorcerer hat - nostalgic sepia tones with gold details",
    technique: "Vintage Discharge with Gold Foil",
    colors: 4,
    style: ["Vintage", "Foil", "Sepia"],
    popular: true,
    exclusive: true,
    limited: false,
    character: "Mickey",
    pathData: "M35 25L65 25L80 45L50 80L20 45L35 25Z M40 40L60 40L50 60L40 40Z"
  },
  {
    id: 6,
    name: "Elsa",
    franchise: "Disney",
    series: "Frozen",
    description: "Ice palace background with snowflake details - crystal blue with glitter",
    technique: "Crystal Process with Glitter Overlay",
    colors: 6,
    style: ["Glitter", "Holographic", "Ice Effect"],
    popular: true,
    exclusive: true,
    limited: true,
    character: "Elsa",
    pathData: "M30 25L70 25L85 45L50 85L15 45L30 25Z M35 40L65 40L50 70L35 40Z"
  },
  {
    id: 7,
    name: "Stitch",
    franchise: "Disney",
    series: "Lilo & Stitch",
    description: "Experiment 626 with Elvis pose - electric blue with glow accents",
    technique: "4-Color Process with Glow-in-Dark",
    colors: 5,
    style: ["Glow-in-Dark", "Cartoon", "Pop Art"],
    popular: true,
    exclusive: false,
    limited: false,
    character: "Stitch",
    pathData: "M40 30L60 30L75 50L50 75L25 50L40 30Z M42 45L58 45L50 60L42 45Z"
  },
  {
    id: 8,
    name: "Nightmare Before Christmas",
    franchise: "Disney",
    series: "Tim Burton",
    description: "Jack Skellington with Zero - gothic patterns with glow effects",
    technique: "6-Color with Glow-in-Dark and Metallic",
    colors: 7,
    style: ["Gothic", "Glow", "Striped"],
    popular: false,
    exclusive: true,
    limited: true,
    character: "Jack",
    pathData: "M20 25L80 25L90 50L50 90L10 50L20 25Z M35 40L65 40L50 75L35 40Z"
  },

  // MARVEL COLLECTION
  {
    id: 9,
    name: "Iron Man",
    franchise: "Marvel",
    series: "Avengers",
    description: "Arc reactor with suit details - metallic red and gold foil",
    technique: "Metallic Foil + High-Density",
    colors: 5,
    style: ["Metallic", "Tech", "Armor"],
    popular: true,
    exclusive: true,
    limited: true,
    character: "Tony Stark",
    pathData: "M25 20L75 20L90 45L50 90L10 45L25 20Z M35 35L65 35L50 70L35 35Z"
  },
  {
    id: 10,
    name: "Spider-Man",
    franchise: "Marvel",
    series: "Spider-Verse",
    description: "Miles Morales graffiti style - urban art with spray paint effect",
    technique: "Simulated Process with Halftones",
    colors: 7,
    style: ["Graffiti", "Comic Dots", "Urban"],
    popular: true,
    exclusive: false,
    limited: false,
    character: "Miles Morales",
    pathData: "M30 25L70 25L85 48L50 85L15 48L30 25Z M38 38L62 38L50 68L38 38Z"
  },
  {
    id: 11,
    name: "Thor",
    franchise: "Marvel",
    series: "Avengers",
    description: "Stormbreaker with lightning effects - hammered metal texture",
    technique: "Puff + Metallic + Glitter",
    colors: 6,
    style: ["Viking", "Metallic", "Texture"],
    popular: false,
    exclusive: true,
    limited: true,
    character: "Thor",
    pathData: "M22 22L78 22L92 47L50 92L8 47L22 22Z M32 37L68 37L50 75L32 37Z"
  },
  {
    id: 12,
    name: "Black Panther",
    franchise: "Marvel",
    series: "Wakanda Forever",
    description: "Vibranium suit pattern with purple glow - advanced texture print",
    technique: "High-Density + Glow",
    colors: 5,
    style: ["Tribal", "Glow", "Texture"],
    popular: true,
    exclusive: true,
    limited: true,
    character: "T'Challa",
    pathData: "M28 23L72 23L88 46L50 88L12 46L28 23Z M36 36L64 36L50 72L36 36Z"
  },

  // ORIGINAL DESIGNS
  {
    id: 13,
    name: "Cyber Samurai",
    franchise: "Original",
    series: "Neo Tokyo",
    description: "Futuristic samurai with neon accents - cyberpunk aesthetic",
    technique: "ChromaBlast + Neon",
    colors: 8,
    style: ["Cyberpunk", "Neon", "Geometric"],
    popular: true,
    exclusive: true,
    limited: true,
    character: "Original",
    pathData: "M20 20L80 20L95 50L50 95L5 50L20 20Z M30 35L70 35L50 80L30 35Z"
  },
  {
    id: 14,
    name: "Dragon Spirit",
    franchise: "Original",
    series: "Mythical",
    description: "Eastern dragon with cloud details - traditional with modern flair",
    technique: "9-Color Simulated Process",
    colors: 9,
    style: ["Traditional", "Gradient", "Detailed"],
    popular: false,
    exclusive: true,
    limited: true,
    character: "Dragon",
    pathData: "M15 15L85 15L98 50L50 98L2 50L15 15Z M25 30L75 30L50 85L25 30Z"
  }
];

// Franchise color themes
const franchiseColors = {
  Anime: { primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#FFE66D' },
  Disney: { primary: '#6C5CE7', secondary: '#A8E6CF', accent: '#FFD93D' },
  Marvel: { primary: '#E74C3C', secondary: '#3498DB', accent: '#F1C40F' },
  Original: { primary: '#9B59B6', secondary: '#1ABC9C', accent: '#E67E22' }
};

// Mobile menu component
const MobileMenu = ({ isOpen, onClose, franchise }: { isOpen: boolean; onClose: () => void; franchise: string }) => {
  if (!isOpen) return null;
  
  return (
    <div className="mobile-menu-overlay" onClick={onClose}>
      <div className="mobile-menu-content" onClick={e => e.stopPropagation()}>
        <button className="mobile-menu-close" onClick={onClose}>✕</button>
        <div className="mobile-menu-header">
          <span className="mobile-menu-title">Collections</span>
        </div>
        <div className="mobile-menu-items">
          <a href="#" className={`mobile-menu-item ${franchise === 'Anime' ? 'active' : ''}`}>Anime</a>
          <a href="#" className={`mobile-menu-item ${franchise === 'Disney' ? 'active' : ''}`}>Disney</a>
          <a href="#" className={`mobile-menu-item ${franchise === 'Marvel' ? 'active' : ''}`}>Marvel</a>
          <a href="#" className={`mobile-menu-item ${franchise === 'Original' ? 'active' : ''}`}>Original</a>
          <div className="mobile-menu-divider"></div>
          <a href="#" className="mobile-menu-item gold">✨ Exclusive Drops</a>
          <a href="#" className="mobile-menu-item gold">🎨 Custom Design</a>
        </div>
      </div>
    </div>
  );
};

// Anime-style thumbnail generator
const AnimeThumbnail = ({ product }: { product: AnimeProduct }) => {
  const colors = franchiseColors[product.franchise];
  
  const svgMarkup = `
    <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1f2f"/>
          <stop offset="100%" style="stop-color:#0f1219"/>
        </linearGradient>
        <linearGradient id="charGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary}"/>
          <stop offset="50%" style="stop-color:${colors.accent}"/>
          <stop offset="100%" style="stop-color:${colors.secondary}"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <pattern id="stars" patternUnits="userSpaceOnUse" width="20" height="20">
          <circle cx="5" cy="5" r="1" fill="white" opacity="0.3"/>
          <circle cx="15" cy="15" r="1" fill="white" opacity="0.3"/>
        </pattern>
      </defs>
      
      <!-- Background -->
      <rect width="100" height="100" fill="url(#bgGradient)" rx="16"/>
      <rect width="100" height="100" fill="url(#stars)" rx="16"/>
      
      <!-- Character Silhouette -->
      <path d="${product.pathData}" fill="url(#charGradient)" transform="translate(0, 10) scale(0.9)" filter="url(#glow)"/>
      
      <!-- Anime Effects -->
      <circle cx="70" cy="25" r="8" fill="white" opacity="0.2"/>
      <circle cx="75" cy="30" r="4" fill="white" opacity="0.3"/>
      
      <!-- Franchise Badge -->
      <rect x="10" y="10" width="25" height="8" rx="4" fill="${colors.accent}" opacity="0.9"/>
      <text x="12" y="17" fill="#0f1219" font-size="4" font-weight="bold">${product.franchise}</text>
      
      ${product.popular ? `<circle cx="85" cy="15" r="6" fill="#FFD700" opacity="0.9"/>` : ''}
      ${product.popular ? `<text x="83" y="18" fill="#000" font-size="3" font-weight="bold">★</text>` : ''}
      
      ${product.limited ? `<text x="70" y="90" fill="${colors.accent}" font-size="4" font-weight="bold">LIMITED</text>` : ''}
    </svg>
  `;
  
  const encodedSvg = `data:image/svg+xml,${encodeURIComponent(svgMarkup)}`;
  
  return (
    <div className="anime-thumbnail-wrapper">
      <div className="thumbnail-glow" style={{ background: `linear-gradient(145deg, ${colors.primary}, ${colors.accent})` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={encodedSvg} alt={product.name} className="anime-thumbnail" loading="lazy" />
      </div>
      {product.exclusive && <div className="exclusive-badge">EXCLUSIVE</div>}
    </div>
  );
};

// Main Component
export default function DeluxeAnimeGallery() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [selectedFranchise, setSelectedFranchise] = useState<string>('all');

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const filteredProducts = selectedFranchise === 'all' 
    ? animeProducts 
    : animeProducts.filter(p => p.franchise === selectedFranchise);

  const franchises = ['all', 'Anime', 'Disney', 'Marvel', 'Original'];

  return (
    <div className="anime-container">
      <style jsx>{`
        .anime-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 1rem;
          background: #0a0c15;
          background-image: 
            radial-gradient(circle at 10% 20%, rgba(255, 107, 107, 0.05) 0%, transparent 30%),
            radial-gradient(circle at 90% 70%, rgba(78, 205, 196, 0.05) 0%, transparent 30%),
            repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.02) 0px, rgba(255, 255, 255, 0.02) 2px, transparent 2px, transparent 8px);
          font-family: 'Poppins', 'Segoe UI', sans-serif;
          min-height: 100vh;
        }

        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap');

        /* Mobile Navigation */
        .mobile-nav {
          display: none;
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(10, 12, 21, 0.95);
          backdrop-filter: blur(10px);
          padding: 1rem;
          border-bottom: 2px solid;
          border-image: linear-gradient(90deg, #FF6B6B, #4ECDC4, #6C5CE7) 1;
        }

        .mobile-nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mobile-logo {
          font-size: 1.4rem;
          font-weight: 800;
          background: linear-gradient(135deg, #FF6B6B, #4ECDC4, #6C5CE7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .mobile-menu-button {
          background: none;
          border: 2px solid #4ECDC4;
          color: #4ECDC4;
          font-size: 1.5rem;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 0 15px rgba(78, 205, 196, 0.3);
        }

        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.9);
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
          background: #141a26;
          padding: 2rem;
          border-left: 3px solid;
          border-image: linear-gradient(180deg, #FF6B6B, #4ECDC4, #6C5CE7) 1;
          animation: slideIn 0.3s ease;
        }

        .mobile-menu-header {
          margin-bottom: 2rem;
        }

        .mobile-menu-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: white;
        }

        .mobile-menu-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mobile-menu-item {
          color: #b8c7e0;
          text-decoration: none;
          font-size: 1.2rem;
          padding: 0.8rem 0;
          border-bottom: 1px solid rgba(78, 205, 196, 0.2);
          transition: all 0.3s;
        }

        .mobile-menu-item.active {
          color: #4ECDC4;
          font-weight: 700;
          border-bottom-color: #4ECDC4;
        }

        .mobile-menu-item.gold {
          color: #FFD700;
        }

        .mobile-menu-divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, #4ECDC4, transparent);
          margin: 1rem 0;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        /* Header */
        .anime-header {
          background: linear-gradient(165deg, #0f1420 0%, #1a1f30 100%);
          padding: clamp(2rem, 6vw, 4rem);
          border-radius: clamp(24px, 5vw, 48px);
          margin-bottom: clamp(2rem, 4vw, 3rem);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(78, 205, 196, 0.3);
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
        }

        .anime-header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            rgba(78, 205, 196, 0.05) 20px,
            rgba(78, 205, 196, 0.05) 40px
          );
          animation: shine 30s linear infinite;
        }

        @keyframes shine {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .header-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #FF6B6B, #4ECDC4, #6C5CE7, #FFD93D);
        }

        .anime-header h1 {
          font-size: clamp(2rem, 8vw, 4.5rem);
          font-weight: 800;
          margin: 0;
          line-height: 1.1;
          background: linear-gradient(135deg, #FF6B6B, #4ECDC4, #6C5CE7, #FFD93D);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 30px rgba(78, 205, 196, 0.3);
        }

        .header-subtitle {
          font-size: clamp(1rem, 3vw, 1.4rem);
          color: #b8c7e0;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .header-stats {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(1rem, 3vw, 2rem);
          margin-top: 2rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
          border-right: 2px solid rgba(78, 205, 196, 0.3);
          padding-right: 2rem;
        }

        .stat:last-child {
          border-right: none;
        }

        .stat-number {
          font-size: clamp(1.5rem, 4vw, 2.2rem);
          font-weight: 800;
          color: #4ECDC4;
        }

        .stat-label {
          font-size: clamp(0.8rem, 2vw, 1rem);
          color: #8f9fb0;
        }

        /* Franchise Filter */
        .franchise-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2.5rem;
          padding: 0.5rem;
          background: rgba(20, 26, 38, 0.6);
          border-radius: 60px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(78, 205, 196, 0.2);
        }

        .filter-btn {
          padding: 0.8rem 2rem;
          border-radius: 40px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          background: transparent;
          color: #b8c7e0;
          flex: ${isMobile ? '1' : 'none'};
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #4ECDC4, #6C5CE7);
          color: white;
          box-shadow: 0 5px 20px rgba(78, 205, 196, 0.4);
        }

        /* Products Grid */
        .products-grid {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .product-card {
          display: grid;
          grid-template-columns: ${isMobile ? '1fr' : (isTablet ? '200px 1fr' : '240px 1fr')};
          gap: clamp(1.5rem, 3vw, 2.5rem);
          padding: clamp(1.5rem, 3vw, 2rem);
          background: #141a26;
          border-radius: 32px;
          border: 1px solid #2a3240;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .product-card:hover {
          transform: ${!isMobile ? 'translateY(-5px)' : 'none'};
          border-color: #4ECDC4;
          box-shadow: 0 20px 40px rgba(78, 205, 196, 0.2);
        }

        .product-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(78, 205, 196, 0.1), transparent);
          transition: left 0.5s;
        }

        .product-card:hover::after {
          left: 150%;
        }

        /* Thumbnail */
        .anime-thumbnail-wrapper {
          position: relative;
          width: ${isMobile ? '160px' : '100%'};
          margin: ${isMobile ? '0 auto' : '0'};
        }

        .thumbnail-glow {
          padding: 8px;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .anime-thumbnail {
          width: 100%;
          height: auto;
          border-radius: 18px;
          display: block;
          background: #0f1420;
        }

        .exclusive-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: linear-gradient(135deg, #FF6B6B, #FFD93D);
          color: #0a0c15;
          padding: 0.4rem 1rem;
          border-radius: 40px;
          font-weight: 800;
          font-size: 0.8rem;
          box-shadow: 0 5px 15px rgba(255, 107, 107, 0.5);
        }

        /* Product Info */
        .product-franchise {
          display: inline-block;
          padding: 0.3rem 1rem;
          border-radius: 40px;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .product-header {
          display: flex;
          flex-direction: ${isMobile ? 'column' : 'row'};
          align-items: ${isMobile ? 'flex-start' : 'center'};
          gap: 0.5rem 1rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .product-name {
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          font-weight: 800;
          margin: 0;
          background: linear-gradient(135deg, #fff, #b8c7e0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .product-series {
          font-size: 1rem;
          color: #8f9fb0;
          font-style: italic;
        }

        .product-description {
          font-size: clamp(0.95rem, 2.2vw, 1.1rem);
          color: #b8c7e0;
          margin-bottom: 1.5rem;
          line-height: 1.6;
          padding: 1rem;
          background: rgba(0,0,0,0.2);
          border-radius: 16px;
          border-left: 4px solid #4ECDC4;
        }

        /* Style Tags */
        .style-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .style-tag {
          background: rgba(78, 205, 196, 0.1);
          border: 1px solid #4ECDC4;
          color: #4ECDC4;
          padding: 0.4rem 1rem;
          border-radius: 40px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        /* Specs */
        .specs-row {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(${isMobile ? '120px' : '150px'}, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #0f1420;
          border-radius: 16px;
        }

        .spec-item {
          display: flex;
          flex-direction: column;
        }

        .spec-label {
          font-size: 0.7rem;
          color: #6f7f90;
          text-transform: uppercase;
        }

        .spec-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #4ECDC4;
        }

        /* Actions */
        .action-buttons {
          display: flex;
          flex-direction: ${isMobile ? 'column' : 'row'};
          gap: 1rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #4ECDC4, #6C5CE7);
          border: none;
          padding: ${isMobile ? '0.8rem' : '1rem 2rem'};
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
          width: ${isMobile ? '100%' : 'auto'};
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(78, 205, 196, 0.4);
        }

        .btn-secondary {
          background: transparent;
          border: 2px solid #4ECDC4;
          padding: ${isMobile ? '0.8rem' : '1rem 2rem'};
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          color: #4ECDC4;
          cursor: pointer;
          transition: all 0.3s;
          width: ${isMobile ? '100%' : 'auto'};
        }

        @media (max-width: 767px) {
          .mobile-nav {
            display: block;
          }
          
          .franchise-filter {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding: 0.5rem;
            -webkit-overflow-scrolling: touch;
          }
          
          .filter-btn {
            white-space: nowrap;
          }
        }

        @media (max-width: 380px) {
          .specs-row {
            grid-template-columns: 1fr;
          }
          
          .product-name {
            font-size: 1.5rem;
          }
        }
      `}</style>

      {/* Mobile Navigation */}
      <div className="mobile-nav">
        <div className="mobile-nav-header">
          <span className="mobile-logo">A&R ANIME COLLECTION</span>
          <button className="mobile-menu-button" onClick={() => setMobileMenuOpen(true)}>
            ⚡
          </button>
        </div>
      </div>

      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        franchise={selectedFranchise}
      />

      {/* Header */}
      <header className="anime-header">
        <div className="header-accent"></div>
        <h1>A & R SILKSCREEN</h1>
        <div className="header-subtitle">
          <span>⚡ ANIME COLLECTION</span>
          <span>✨ DISNEY</span>
          <span>⚡ MARVEL</span>
        </div>
        <div className="header-stats">
          <div className="stat">
            <span className="stat-number">14+</span>
            <span className="stat-label">Exclusive Designs</span>
          </div>
          <div className="stat">
            <span className="stat-number">8-Color</span>
            <span className="stat-label">Premium Printing</span>
          </div>
          <div className="stat">
            <span className="stat-number">✨</span>
            <span className="stat-label">Glow/Foil Options</span>
          </div>
        </div>
      </header>

      {/* Franchise Filter */}
      <div className="franchise-filter">
        {franchises.map(f => (
          <button
            key={f}
            className={`filter-btn ${selectedFranchise === f ? 'active' : ''}`}
            onClick={() => setSelectedFranchise(f)}
          >
            {f === 'all' ? '🔥 ALL' : f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map((product) => {
          const colors = franchiseColors[product.franchise];
          
          return (
            <div key={product.id} className="product-card">
              <AnimeThumbnail product={product} />
              
              <div className="product-info">
                <div 
                  className="product-franchise"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    color: '#0a0c15'
                  }}
                >
                  {product.franchise} • {product.character}
                </div>
                
                <div className="product-header">
                  <h2 className="product-name">{product.name}</h2>
                  <span className="product-series">{product.series}</span>
                </div>
                
                <p className="product-description">{product.description}</p>
                
                <div className="style-tags">
                  {product.style.slice(0, isMobile ? 2 : 3).map((style, idx) => (
                    <span key={idx} className="style-tag">{style}</span>
                  ))}
                  {isMobile && product.style.length > 2 && (
                    <span className="style-tag">+{product.style.length - 2}</span>
                  )}
                </div>
                
                <div className="specs-row">
                  <div className="spec-item">
                    <span className="spec-label">Technique</span>
                    <span className="spec-value">{product.technique.split(' ')[0]}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Colors</span>
                    <span className="spec-value">{product.colors}-Color</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Edition</span>
                    <span className="spec-value">{product.limited ? 'Limited' : 'Standard'}</span>
                  </div>
                </div>
                
                <div className="action-buttons">
                  <button className="btn-primary">
                    {isMobile ? 'Print This' : 'Print This Design'}
                  </button>
                  <button className="btn-secondary">
                    {isMobile ? 'Customize' : 'Customize Character'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
      }
