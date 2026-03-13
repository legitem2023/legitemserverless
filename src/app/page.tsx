"use client";

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
  // PROGRAMMING LANGUAGES COLLECTION
  {
    id: 1,
    name: "Python",
    category: "Programming Languages",
    description: "Python logo with snake design - blue and yellow gradient with code snippets background",
    technique: "6-Color Simulated with Metallic",
    colors: 6,
    area: "Full Front (14\" x 18\")",
    turnaround: "5-7 business days",
    minOrder: 12,
    price: "$28.50 - $45.00",
    artwork: "Vector • Python syntax pattern",
    fabrics: ["Premium Cotton", "Tri-blend", "Tech Wear"],
    finish: ["Metallic", "Glow-in-Dark", "Code Pattern"],
    limited: true,
    goldLabel: true,
    pathData: "M30 20L70 20L85 40L70 60L30 60L15 40L30 20Z M40 35L60 35L55 50L45 50L40 35Z"
  },
  {
    id: 2,
    name: "JavaScript",
    category: "Programming Languages",
    description: "JavaScript logo with yellow background and curly braces pattern - ES6+ edition",
    technique: "5-Color with Glitter Yellow",
    colors: 5,
    area: "Full Front",
    turnaround: "4-6 business days",
    minOrder: 18,
    price: "$26.00 - $42.00",
    artwork: "Vector • JSX elements",
    fabrics: ["Cotton", "Streetwear", "Developer Fit"],
    finish: ["Glitter", "Metallic", "Code Pattern"],
    limited: false,
    pathData: "M35 25L65 25L80 45L65 65L35 65L20 45L35 25Z M42 40L58 40L50 55L42 40Z"
  },
  {
    id: 3,
    name: "React",
    category: "Frameworks",
    description: "React logo with atomic design - blue gradient with component pattern background",
    technique: "7-Color with Holographic",
    colors: 7,
    area: "Full Front + Sleeves",
    turnaround: "6-8 business days",
    minOrder: 10,
    price: "$32.00 - $52.00",
    artwork: "Vector • Component hierarchy",
    fabrics: ["Premium Cotton", "Tech Fabric"],
    finish: ["Holographic", "Glow", "Geometric"],
    limited: true,
    goldLabel: true,
    pathData: "M25 20L75 20L90 45L75 70L25 70L10 45L25 20Z M30 35L45 45L30 55L40 45L30 35Z M70 35L55 45L70 55L60 45L70 35Z M50 45L45 50L50 55L55 50L50 45Z"
  },
  {
    id: 4,
    name: "Java",
    category: "Programming Languages",
    description: "Java logo with coffee cup - classic blue and red with enterprise patterns",
    technique: "5-Color High-Density",
    colors: 5,
    area: "Full Chest",
    turnaround: "5-7 business days",
    minOrder: 15,
    price: "$29.00 - $48.00",
    artwork: "Vector • Enterprise style",
    fabrics: ["Heavy Cotton", "Business Casual"],
    finish: ["Metallic", "Texture", "Classic"],
    limited: true,
    pathData: "M28 22L72 22L88 45L72 68L28 68L12 45L28 22Z M38 35L45 45L38 55L48 45L38 35Z M62 35L55 45L62 55L52 45L62 35Z"
  },
  {
    id: 5,
    name: "C++",
    category: "Programming Languages",
    description: "C++ logo with system architecture - performance edition with gear patterns",
    technique: "4-Color Metallic + Puff",
    colors: 4,
    area: "Full Back",
    turnaround: "6-8 business days",
    minOrder: 12,
    price: "$31.00 - $50.00",
    artwork: "Vector • System level",
    fabrics: ["Heavy Cotton", "Durable Blend"],
    finish: ["Puff", "Metallic", "Textured"],
    limited: false,
    pathData: "M26 24L74 24L89 45L74 66L26 66L11 45L26 24Z M36 38L50 45L36 52L44 45L36 38Z M64 38L50 45L64 52L56 45L64 38Z"
  },
  {
    id: 6,
    name: "TypeScript",
    category: "Programming Languages",
    description: "TypeScript logo with blue gradient - typed superset with interface patterns",
    technique: "6-Color with Blue Foil",
    colors: 6,
    area: "Full Front",
    turnaround: "5-7 business days",
    minOrder: 14,
    price: "$27.00 - $44.00",
    artwork: "Vector • Type definitions",
    fabrics: ["Premium Cotton", "Developer Edition"],
    finish: ["Foil", "Glow", "Modern"],
    limited: true,
    goldLabel: true,
    pathData: "M30 23L70 23L86 45L70 67L30 67L14 45L30 23Z M40 36L60 36L55 54L45 54L40 36Z"
  },
  {
    id: 7,
    name: "HTML5",
    category: "Web Technologies",
    description: "HTML5 shield logo with orange gradient - semantic web with document structure",
    technique: "4-Color with Orange Glitter",
    colors: 4,
    area: "Front Center",
    turnaround: "4-6 business days",
    minOrder: 20,
    price: "$22.00 - $35.00",
    artwork: "Vector • Tags and elements",
    fabrics: ["Cotton", "Casual"],
    finish: ["Glitter", "Bold", "Web Style"],
    limited: false,
    pathData: "M32 25L68 25L82 45L68 65L32 65L18 45L32 25Z M42 38L58 38L50 55L42 38Z"
  },
  {
    id: 8,
    name: "CSS3",
    category: "Web Technologies",
    description: "CSS3 shield with blue gradient - styling with flexbox and grid patterns",
    technique: "4-Color with Blue Metallic",
    colors: 4,
    area: "Front Center",
    turnaround: "4-6 business days",
    minOrder: 20,
    price: "$22.00 - $35.00",
    artwork: "Vector • Style rules",
    fabrics: ["Cotton", "Casual"],
    finish: ["Metallic", "Geometric", "Modern"],
    limited: false,
    pathData: "M33 26L67 26L81 45L67 64L33 64L19 45L33 26Z M43 39L57 39L50 54L43 39Z"
  },
  {
    id: 9,
    name: "Node.js",
    category: "Backend",
    description: "Node.js logo with green gradient - event-driven architecture with async patterns",
    technique: "5-Color with Green Foil",
    colors: 5,
    area: "Full Front",
    turnaround: "5-7 business days",
    minOrder: 12,
    price: "$29.00 - $46.00",
    artwork: "Vector • NPM packages",
    fabrics: ["Premium Cotton", "Developer"],
    finish: ["Foil", "Glow", "Server Style"],
    limited: true,
    pathData: "M29 24L71 24L87 45L71 66L29 66L13 45L29 24Z M39 37L61 37L50 58L39 37Z"
  },
  {
    id: 10,
    name: "SQL",
    category: "Databases",
    description: "SQL database logo with silver gradient - queries and table structures",
    technique: "4-Color Metallic Silver",
    colors: 4,
    area: "Full Chest",
    turnaround: "5-7 business days",
    minOrder: 15,
    price: "$26.00 - $40.00",
    artwork: "Vector • Query patterns",
    fabrics: ["Cotton", "Professional"],
    finish: ["Metallic", "Grid Pattern", "Data Style"],
    limited: false,
    pathData: "M31 25L69 25L84 45L69 65L31 65L16 45L31 25Z M41 38L59 38L50 55L41 38Z"
  },
  {
    id: 11,
    name: "Git",
    category: "Version Control",
    description: "Git logo with orange gradient - branching and merging with workflow patterns",
    technique: "5-Color with Orange Metallic",
    colors: 5,
    area: "Full Front",
    turnaround: "5-7 business days",
    minOrder: 12,
    price: "$25.00 - $38.00",
    artwork: "Vector • Branch diagram",
    fabrics: ["Cotton", "Developer"],
    finish: ["Metallic", "Flow Pattern", "Modern"],
    limited: true,
    pathData: "M34 24L66 24L80 45L66 66L34 66L20 45L34 24Z M44 37L56 37L50 53L44 37Z"
  },
  {
    id: 12,
    name: "Docker",
    category: "DevOps",
    description: "Docker whale with containers - blue gradient with microservices pattern",
    technique: "6-Color with Blue Glow",
    colors: 6,
    area: "Full Front + Back",
    turnaround: "6-8 business days",
    minOrder: 10,
    price: "$34.00 - $54.00",
    artwork: "Vector • Container ships",
    fabrics: ["Premium Cotton", "Tech"],
    finish: ["Glow", "Metallic", "Cloud Pattern"],
    limited: true,
    goldLabel: true,
    pathData: "M27 22L73 22L89 45L73 68L27 68L11 45L27 22Z M37 35L63 35L50 58L37 35Z"
  },
  {
    id: 13,
    name: "Rust",
    category: "Systems Programming",
    description: "Rust logo with gear - memory-safe with performance patterns",
    technique: "5-Color with Orange-Brown Gradient",
    colors: 5,
    area: "Full Front",
    turnaround: "6-8 business days",
    minOrder: 10,
    price: "$33.00 - $52.00",
    artwork: "Vector • Systems level",
    fabrics: ["Heavy Cotton", "Developer"],
    finish: ["Metallic", "Texture", "Modern"],
    limited: true,
    goldLabel: true,
    pathData: "M28 23L72 23L88 45L72 67L28 67L12 45L28 23Z M38 36L62 36L50 58L38 36Z"
  },
  {
    id: 14,
    name: "Go",
    category: "Programming Languages",
    description: "Golang gopher with blue - concurrent design with goroutine patterns",
    technique: "5-Color with Blue Metallic",
    colors: 5,
    area: "Full Front",
    turnaround: "5-7 business days",
    minOrder: 12,
    price: "$28.00 - $45.00",
    artwork: "Vector • Gopher mascot",
    fabrics: ["Cotton", "Developer"],
    finish: ["Metallic", "Playful", "Modern"],
    limited: true,
    pathData: "M30 24L70 24L85 45L70 66L30 66L15 45L30 24Z M40 37L60 37L50 55L40 37Z"
  },
  {
    id: 15,
    name: "Swift",
    category: "Mobile Development",
    description: "Swift logo with orange gradient - iOS development with swiftUI patterns",
    technique: "5-Color with Orange Foil",
    colors: 5,
    area: "Full Front",
    turnaround: "5-7 business days",
    minOrder: 12,
    price: "$30.00 - $48.00",
    artwork: "Vector • Swift syntax",
    fabrics: ["Premium Cotton", "iOS Dev"],
    finish: ["Foil", "Modern", "Apple Style"],
    limited: true,
    pathData: "M32 23L68 23L83 45L68 67L32 67L17 45L32 23Z M42 36L58 36L50 54L42 36Z"
  },
  {
    id: 16,
    name: "Kotlin",
    category: "Mobile Development",
    description: "Kotlin logo with purple gradient - android development with coroutines",
    technique: "5-Color with Purple Metallic",
    colors: 5,
    area: "Full Front",
    turnaround: "5-7 business days",
    minOrder: 12,
    price: "$29.00 - $46.00",
    artwork: "Vector • Android Studio",
    fabrics: ["Cotton", "Android Dev"],
    finish: ["Metallic", "Modern", "Gradient"],
    limited: false,
    pathData: "M33 24L67 24L82 45L67 66L33 66L18 45L33 24Z M43 37L57 37L50 54L43 37Z"
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
  // Color mapping for different programming languages
  const getLanguageColor = (lang: string) => {
    const colors: {[key: string]: string} = {
      "Python": "#3776AB",
      "JavaScript": "#F7DF1E",
      "React": "#61DAFB",
      "Java": "#007396",
      "C++": "#00599C",
      "TypeScript": "#3178C6",
      "HTML5": "#E34F26",
      "CSS3": "#1572B6",
      "Node.js": "#339933",
      "SQL": "#4479A1",
      "Git": "#F05032",
      "Docker": "#2496ED",
      "Rust": "#DEA584",
      "Go": "#00ADD8",
      "Swift": "#FA7343",
      "Kotlin": "#7F52FF"
    };
    return colors[name] || "#e3b34c";
  };

  const primaryColor = getLanguageColor(name);
  
  const svgMarkup = `
    <svg width="180" height="180" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="langGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primaryColor}"/>
          <stop offset="50%" style="stop-color:#fcf6ba"/>
          <stop offset="100%" style="stop-color:${primaryColor}"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <pattern id="code" patternUnits="userSpaceOnUse" width="20" height="20">
          <text x="2" y="10" fill="rgba(255,255,255,0.1)" font-size="6" font-family="monospace">{ }</text>
          <text x="12" y="18" fill="rgba(255,255,255,0.1)" font-size="6" font-family="monospace"> &lt;/&gt;</text>
        </pattern>
      </defs>
      <rect width="100" height="100" fill="#0a121c" rx="12" filter="url(#glow)"/>
      <rect width="100" height="100" fill="url(#code)" rx="12"/>
      <path d="${pathData}" fill="url(#langGradient)" transform="translate(0, 15) scale(0.85)" filter="url(#glow)"/>
      <circle cx="50" cy="85" r="4" fill="${primaryColor}" opacity="0.3"/>
      ${goldLabel ? `<text x="15" y="25" fill="${primaryColor}" font-size="8" font-family="Cormorant Garamond, serif" font-weight="bold">✦ LIMITED ✦</text>` : ''}
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
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Get unique categories - FIXED: Convert Set to array properly
  const uniqueCategories = Array.from(new Set(deluxeProducts.map(p => p.category)));
  const categories = ['all', ...uniqueCategories];
  
  const filteredProducts = filter === 'all' 
    ? deluxeProducts 
    : deluxeProducts.filter(p => p.category === filter);

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

      {/* Header - Mobile style only */}
      <div className="py-6 mb-6">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-[#f9e6b3] to-[#e3b34c] bg-clip-text text-transparent">
          A & R SILKSCREEN
        </h1>
        <div className="text-[#b8a87c] tracking-widest text-sm uppercase mt-1">
          ATELIER • EST. 2008
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filter === cat
                ? 'bg-gradient-to-r from-[#bf9530] to-[#f9e6b3] text-[#0a0c12]'
                : 'bg-[#14181f] border border-[#e3b34c]/30 text-[#b8a87c] hover:border-[#e3b34c]'
            }`}
          >
            {cat === 'all' ? '🔥 ALL' : cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="flex flex-col gap-4 md:gap-8">
        {filteredProducts.map((product) => (
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
