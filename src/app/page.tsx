// app/components/DeluxeAnimeGallery.tsx
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

// Mobile Menu Component
const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={onClose}>
      <div className="fixed top-0 right-0 w-4/5 max-w-md h-full bg-[#14181f] p-8 border-l border-[#e3b34c] animate-slideIn" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-3xl text-[#e3b34c] hover:text-[#f9e6b3]" onClick={onClose}>✕</button>
        <div className="mt-16 flex flex-col gap-6">
          <a href="#" className="text-white text-xl py-2 border-b border-[#e3b34c]/20 hover:border-[#e3b34c] transition">Collection</a>
          <a href="#" className="text-white text-xl py-2 border-b border-[#e3b34c]/20 hover:border-[#e3b34c] transition">Atelier</a>
          <a href="#" className="text-white text-xl py-2 border-b border-[#e3b34c]/20 hover:border-[#e3b34c] transition">Lookbook</a>
          <a href="#" className="text-white text-xl py-2 border-b border-[#e3b34c]/20 hover:border-[#e3b34c] transition">Contact</a>
          <a href="#" className="text-[#e3b34c] text-xl font-bold py-2 border-b border-[#e3b34c]">Book Consultation</a>
        </div>
      </div>
    </div>
  );
};

// Deluxe Thumbnail Component
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
    <div className="relative">
      <div className="p-1.5 bg-gradient-to-br from-[#bf9530] via-[#fcf6ba] to-[#b38728] rounded-xl shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={encodedSvg} alt={name} className="w-full h-auto rounded-lg" loading="lazy" />
      </div>
      {goldLabel && (
        <div className="absolute -top-1 -right-1 bg-gradient-to-br from-[#bf9530] to-[#fcf6ba] text-[#0a0c12] px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap shadow-lg">
          COUTURE
        </div>
      )}
    </div>
  );
};

// Main Component
export default function DeluxeAnimeGallery() {
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
    <div className="max-w-[1600px] mx-auto p-4 bg-[#0f0f13] min-h-screen relative overflow-hidden">
      {/* Background Patterns - Optimized */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(227,179,76,0.03)_0%,transparent_30%)]"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(227,179,76,0.02)_0px,rgba(227,179,76,0.02)_1px,transparent_1px,transparent_15px)]"></div>
      </div>

      {/* Mobile Navigation */}
      <div className="sticky top-0 z-40 bg-[#0a0c12]/95 backdrop-blur-sm p-4 border-b border-[#e3b34c]/30">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold bg-gradient-to-r from-white via-[#f9e6b3] to-[#e3b34c] bg-clip-text text-transparent">
            A&R SILKSCREEN
          </span>
          <button 
            className="border border-[#e3b34c] text-[#e3b34c] text-2xl px-4 py-2 rounded-lg"
            onClick={() => setMobileMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </div>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Header - Mobile style only (same for all devices) */}
      <div className="py-6 mb-6">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-[#f9e6b3] to-[#e3b34c] bg-clip-text text-transparent">
          A & R SILKSCREEN
        </h1>
        <div className="text-[#b8a87c] tracking-widest text-sm uppercase mt-1">
          ATELIER • EST. 2008
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex flex-col gap-4 md:gap-8">
        {deluxeProducts.map((product) => (
          <div 
            key={product.id} 
            className="relative bg-[#14181f] p-4 md:p-8 rounded-2xl md:rounded-[40px] border border-[#2a2f38] hover:border-[#e3b34c] transition-all duration-300 overflow-hidden group"
          >
            {/* Hover shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-[#e3b34c]/10 to-transparent pointer-events-none"></div>
            
            <div className={`grid ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-[180px_1fr]' : 'grid-cols-[240px_1fr]'} gap-4 md:gap-8`}>
              {/* Thumbnail */}
              <div className={`${isMobile ? 'w-32 mx-auto' : 'w-full'}`}>
                <DeluxeThumbnail 
                  pathData={product.pathData} 
                  name={product.name}
                  goldLabel={product.goldLabel}
                />
              </div>
              
              {/* Product Details */}
              <div>
                <div className={`flex ${isMobile ? 'flex-col' : 'flex-row items-center'} gap-2 md:gap-4 mb-4`}>
                  <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-[#e3b34c] bg-clip-text text-transparent">
                    {product.name}
                  </h2>
                  <span className="text-[#b8a87c] text-xs md:text-sm uppercase tracking-wider border border-[#e3b34c]/30 px-3 py-1 rounded-full whitespace-nowrap">
                    {product.category}
                  </span>
                </div>
                
                <p className="text-[#b0b7c5] text-sm md:text-base mb-6 italic border-l-2 border-[#e3b34c] pl-4">
                  "{product.description}"
                </p>
                
                {/* Specs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 bg-black/30 p-3 md:p-5 rounded-xl">
                  <div>
                    <div className="text-[#8f9bb3] text-xs uppercase tracking-wider">Technique</div>
                    <div className="text-[#e3b34c] text-sm md:text-base font-semibold">{product.technique.split(' ')[0]}</div>
                  </div>
                  <div>
                    <div className="text-[#8f9bb3] text-xs uppercase tracking-wider">Colors</div>
                    <div className="text-[#e3b34c] text-sm md:text-base font-semibold">{product.colors}</div>
                  </div>
                  <div>
                    <div className="text-[#8f9bb3] text-xs uppercase tracking-wider">Min Order</div>
                    <div className="text-[#e3b34c] text-sm md:text-base font-semibold">{product.minOrder}</div>
                  </div>
                  <div>
                    <div className="text-[#8f9bb3] text-xs uppercase tracking-wider">Price</div>
                    <div className="text-[#e3b34c] text-sm md:text-base font-semibold">{product.price}</div>
                  </div>
                </div>
                
                {/* Finish Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.finish.slice(0, isMobile ? 2 : 4).map((f, idx) => (
                    <span key={idx} className="bg-gradient-to-br from-[#1e2632] to-[#14181f] border border-[#e3b34c] text-[#e3b34c] px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                      ✦ {f} ✦
                    </span>
                  ))}
                  {isMobile && product.finish.length > 2 && (
                    <span className="bg-gradient-to-br from-[#1e2632] to-[#14181f] border border-[#e3b34c] text-[#e3b34c] px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                      +{product.finish.length - 2}
                    </span>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3`}>
                  <button className="bg-gradient-to-br from-[#bf9530] to-[#f9e6b3] border border-[#fcf6ba] text-[#0a0c12] px-4 md:px-8 py-3 rounded-full font-semibold text-sm md:text-base hover:shadow-xl hover:shadow-[#e3b34c]/30 transition-all w-full md:w-auto">
                    {isMobile ? 'Consult' : 'Request Consultation'}
                  </button>
                  <button className="bg-transparent border-2 border-[#e3b34c] text-[#e3b34c] px-4 md:px-8 py-3 rounded-full font-semibold text-sm md:text-base hover:bg-[#e3b34c]/10 transition-all w-full md:w-auto">
                    {isMobile ? 'View' : 'View Lookbook'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
      }
