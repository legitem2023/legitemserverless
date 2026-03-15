"use client";
import ClothViewer from '../components/ClothViewer';
import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

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
  imageUrl: string;
}

const deluxeProducts: DeluxeProduct[] = [
  // ========== OPERATING SYSTEMS ==========
  {
    id: 17,
    name: "Windows 11",
    category: "Operating Systems",
    description: "Modern Windows logo with gradient - blue window design",
    technique: "4-Color with Blue Metallic",
    colors: 4,
    area: "Full Chest",
    turnaround: "4-6 business days",
    minOrder: 15,
    price: "₱24.00 - ₱38.00",
    artwork: "Vector • Windows style",
    fabrics: ["Cotton", "Tech Wear"],
    finish: ["Metallic", "Glossy", "Modern"],
    limited: false,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Windows_logo_and_wordmark_-_2021.svg"
  },
  {
    id: 18,
    name: "macOS",
    category: "Operating Systems",
    description: "Apple macOS logo - sleek silver design",
    technique: "3-Color with Silver Foil",
    colors: 3,
    area: "Front Center",
    turnaround: "4-6 business days",
    minOrder: 12,
    price: "₱28.00 - ₱42.00",
    artwork: "Vector • Apple style",
    fabrics: ["Premium Cotton", "Tech"],
    finish: ["Foil", "Matte", "Premium"],
    limited: true,
    goldLabel: true,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
  },
  {
    id: 19,
    name: "Kali Linux",
    category: "Operating Systems",
    description: "Kali Linux dragon logo - security and penetration testing",
    technique: "4-Color with Black & White",
    colors: 4,
    area: "Full Front",
    turnaround: "5-7 business days",
    minOrder: 10,
    price: "₱26.00 - ₱40.00",
    artwork: "Vector • Dragon design",
    fabrics: ["Cotton", "Developer"],
    finish: ["Matte", "Classic", "Soft-hand"],
    limited: false,
    imageUrl: "https://www.kali.org/images/kali-logo.svg"
  },
  {
    id: 20,
    name: "Ubuntu",
    category: "Operating Systems",
    description: "Ubuntu logo with orange and white - circle of friends",
    technique: "4-Color with Orange Metallic",
    colors: 4,
    area: "Full Front",
    turnaround: "5-7 business days",
    minOrder: 12,
    price: "₱25.00 - ₱38.00",
    artwork: "Vector • Ubuntu style",
    fabrics: ["Cotton", "Developer"],
    finish: ["Metallic", "Matte", "Modern"],
    limited: true,
    imageUrl: "https://assets.ubuntu.com/v1/29985a98-ubuntu-logo32.png"
  },
  {
    id: 21,
    name: "Android",
    category: "Operating Systems",
    description: "Android robot logo - green with modern design",
    technique: "4-Color with Green Glow",
    colors: 4,
    area: "Full Front",
    turnaround: "4-6 business days",
    minOrder: 15,
    price: "₱23.00 - ₱36.00",
    artwork: "Vector • Android robot",
    fabrics: ["Cotton", "Tech"],
    finish: ["Glow", "Matte", "Fun"],
    limited: false,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg"
  },
  {
    id: 22,
    name: "iOS",
    category: "Operating Systems",
    description: "Apple iOS logo - sleek design",
    technique: "3-Color with Silver Foil",
    colors: 3,
    area: "Front Center",
    turnaround: "4-6 business days",
    minOrder: 12,
    price: "₱27.00 - ₱41.00",
    artwork: "Vector • Apple style",
    fabrics: ["Premium Cotton", "Tech"],
    finish: ["Foil", "Matte", "Premium"],
    limited: true,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
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
const DeluxeThumbnail = ({ imageUrl, name, goldLabel }: { imageUrl: string; name: string; goldLabel?: boolean }) => {
  return (
    <div className="relative">
      <div className="p-1.5 bg-gradient-to-br from-[#bf9530] via-[#fcf6ba] to-[#b38728] rounded-xl shadow-lg">
        <div className="relative w-full aspect-square bg-[#0a121c] rounded-lg overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-contain p-2"
            loading="lazy"
          />
        </div>
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
  const [showClothViewer, setShowClothViewer] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DeluxeProduct | null>(null);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showClothViewer || showInstructions) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showClothViewer, showInstructions]);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Get unique categories
  const uniqueCategories = Array.from(new Set(deluxeProducts.map(p => p.category)));
  const categories = ['all', ...uniqueCategories];
  
  const filteredProducts = filter === 'all' 
    ? deluxeProducts 
    : deluxeProducts.filter(p => p.category === filter);

  const handleConsultClick = (product: DeluxeProduct) => {
    setSelectedProduct(product);
    setShowInstructions(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Message copied to clipboard! Please paste it in Messenger.');
    }).catch(() => {
      alert('Could not copy message. Please manually type it.');
    });
  };

  const openMessenger = () => {
    if (selectedProduct) {
      // Create a simple message with just the essential info
      const message = encodeURIComponent(
        `Hi! I'm interested in the "${selectedProduct.name}" design.\n\n` +
        `View the design here: ${selectedProduct.imageUrl}\n\n` +
        `Category: ${selectedProduct.category}\n` +
        `Technique: ${selectedProduct.technique}\n` +
        `Min Order: ${selectedProduct.minOrder}\n` +
        `Price: ${selectedProduct.price}\n\n` +
        `I'd like to get a consultation for this print. Thanks!`
      );
      
      // Open Messenger
      window.open(`https://m.me/robert.marquez.9404362?text=${message}`, '_blank');
      
      // Close instructions
      setShowInstructions(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-0 bg-[#0f0f13] min-h-screen relative overflow-hidden">
      {/* Background Patterns */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(227,179,76,0.03)_0%,transparent_30%)]"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(227,179,76,0.02)_0px,rgba(227,179,76,0.02)_1px,transparent_1px,transparent_15px)]"></div>
      </div>

      {/* Mobile Navigation */}
      <div className="sticky top-0 z-40 bg-[#0a0c12]/95 backdrop-blur-sm p-1 border-b border-[#e3b34c]/30">
        <div className="flex justify-between items-center">
          <img src="/ARSP.svg" className="h-[100px] p-2 " alt="Logo" />
          <button 
            className="border border-[#e3b34c] text-[#e3b34c] text-2xl px-4 py-2 rounded-lg"
            onClick={() => setMobileMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </div>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Category Filter - Horizontal Scroll */}
      <div className="overflow-x-auto whitespace-nowrap py-2 px-2 mb-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`inline-block mr-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
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
      <div className="flex flex-col gap-4 md:gap-8 p-2">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="relative bg-[#14181f] p-4 md:p-8 rounded-2xl md:rounded-[40px] border border-[#2a2f38] hover:border-[#e3b34c] transition-all duration-300 overflow-hidden group"
          >
            {/* Hover shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-[#e3b34c]/10 to-transparent pointer-events-none"></div>
            
            <div className={`grid ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-[180px_1fr]' : 'grid-cols-[240px_1fr]'} gap-4 md:gap-8`}>
              {/* Thumbnail */}
              <div className={`${isMobile ? 'w-full mx-auto' : 'w-full'}`}>
                <DeluxeThumbnail 
                  imageUrl={product.imageUrl} 
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
                  <button 
                    onClick={() => handleConsultClick(product)}
                    className="bg-gradient-to-br from-[#bf9530] to-[#f9e6b3] border border-[#fcf6ba] text-[#0a0c12] px-4 md:px-8 py-3 rounded-full font-semibold text-sm md:text-base hover:shadow-xl hover:shadow-[#e3b34c]/30 transition-all w-full md:w-auto"
                  >
                    {isMobile ? 'Consult' : 'Request Consultation'}
                  </button>
                  <button 
                    onClick={() => setShowClothViewer(true)}
                    className="bg-transparent border-2 border-[#e3b34c] text-[#e3b34c] px-4 md:px-8 py-3 rounded-full font-semibold text-sm md:text-base hover:bg-[#e3b34c]/10 transition-all w-full md:w-auto"
                  >
                    {isMobile ? 'View' : 'View Lookbook'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions Modal */}
      {showInstructions && selectedProduct && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={() => {
              setShowInstructions(false);
              setSelectedProduct(null);
            }}
          />
          
          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-[#14181f] border-2 border-[#e3b34c] rounded-2xl shadow-2xl max-w-md w-full animate-fadeIn">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-[#e3b34c]/30">
                <h3 className="text-[#e3b34c] font-bold text-xl">📱 Send Consultation Request</h3>
                <button 
                  onClick={() => {
                    setShowInstructions(false);
                    setSelectedProduct(null);
                  }}
                  className="text-[#e3b34c] hover:text-[#f9e6b3] text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#e3b34c]/10 transition-all"
                >
                  ✕
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#bf9530] to-[#f9e6b3] rounded-lg flex items-center justify-center">
                      <span className="text-[#0a0c12] font-bold text-xl">📋</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{selectedProduct.name}</p>
                      <p className="text-[#b8a87c] text-sm">{selectedProduct.category}</p>
                    </div>
                  </div>
                  
                  <div className="bg-black/30 p-4 rounded-lg mb-4">
                    <p className="text-[#e3b34c] font-semibold mb-2">⚠️ Important:</p>
                    <p className="text-[#b0b7c5] text-sm">
                      Facebook Messenger may not always show the pre-filled message. 
                      If the message box is empty, please:
                    </p>
                    <ol className="text-[#b0b7c5] text-sm list-decimal list-inside mt-2 space-y-1">
                      <li>Copy the message below</li>
                      <li>Paste it in Messenger</li>
                      <li>Click Send</li>
                    </ol>
                  </div>
                  
                  <div className="bg-[#1e2632] p-3 rounded-lg mb-3">
                    <p className="text-[#b8a87c] text-xs mb-1">Message to send:</p>
                    <p className="text-white text-sm">
                      Hi! I'm interested in the "{selectedProduct.name}" design.
                      <br /><br />
                      View the design here: {selectedProduct.imageUrl}
                      <br /><br />
                      Category: {selectedProduct.category} | Technique: {selectedProduct.technique} | Min Order: {selectedProduct.minOrder} | Price: {selectedProduct.price}
                      <br /><br />
                      I'd like to get a consultation for this print. Thanks!
                    </p>
                  </div>
                  
                  <button
                    onClick={() => copyToClipboard(
                      `Hi! I'm interested in the "${selectedProduct.name}" design.\n\n` +
                      `View the design here: ${selectedProduct.imageUrl}\n\n` +
                      `Category: ${selectedProduct.category} | Technique: ${selectedProduct.technique} | Min Order: ${selectedProduct.minOrder} | Price: ${selectedProduct.price}\n\n` +
                      `I'd like to get a consultation for this print. Thanks!`
                    )}
                    className="w-full bg-[#1e2632] border border-[#e3b34c] text-[#e3b34c] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#e3b34c]/10 transition-all mb-3"
                  >
                    📋 Copy Message to Clipboard
                  </button>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={openMessenger}
                    className="flex-1 bg-gradient-to-br from-[#bf9530] to-[#f9e6b3] border border-[#fcf6ba] text-[#0a0c12] px-4 py-3 rounded-full font-semibold text-sm hover:shadow-xl hover:shadow-[#e3b34c]/30 transition-all"
                  >
                    Open Messenger
                  </button>
                  <button
                    onClick={() => {
                      setShowInstructions(false);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 bg-transparent border-2 border-[#e3b34c] text-[#e3b34c] px-4 py-3 rounded-full font-semibold text-sm hover:bg-[#e3b34c]/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ClothViewer Modal */}
      {showClothViewer && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={() => setShowClothViewer(false)}
          />
          
          {/* Modal Content */}
          <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-y-auto">
            <div className="bg-[#14181f] border-t-2 border-[#e3b34c] rounded-t-3xl shadow-2xl animate-slideUp">
              {/* Header */}
              <div className="sticky top-0 bg-[#14181f] flex justify-between items-center p-4 border-b border-[#e3b34c]/30 rounded-t-3xl">
                <h3 className="text-[#e3b34c] font-semibold text-lg">Cloth Viewer</h3>
                <button 
                  onClick={() => setShowClothViewer(false)}
                  className="text-[#e3b34c] hover:text-[#f9e6b3] text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#e3b34c]/10 transition-all"
                >
                  ✕
                </button>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <ClothViewer/>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
    }
