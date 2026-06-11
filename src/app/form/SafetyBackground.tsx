// app/components/SafetyBackground.tsx
'use client';

import React, { useEffect, useRef } from 'react';

const SafetyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rippleRadius = 0;
    let rippleOpacity = 0.8;
    let expanding = true;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawGrid = (width: number, height: number) => {
      if (!ctx) return;
      const gridSize = 40;
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.08)';
      ctx.lineWidth = 0.5;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const drawRadarLines = (width: number, height: number, centerX: number, centerY: number, radius: number) => {
      if (!ctx) return;
      const angles = [0, 45, 90, 135, 180, 225, 270, 315];
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
      ctx.lineWidth = 0.5;

      angles.forEach(angle => {
        const rad = (angle * Math.PI) / 180;
        const x = centerX + Math.cos(rad) * radius;
        const y = centerY + Math.sin(rad) * radius;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
      });
    };

    const drawScanRipple = (
      width: number,
      height: number,
      centerX: number,
      centerY: number,
      radius: number,
      opacity: number
    ) => {
      if (!ctx) return;

      // Outer glow
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.3})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Main ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inner pulse
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 10, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.6})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Dashed ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.5})`;
      ctx.setLineDash([5, 10]);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawScanLine = (width: number, height: number, timeValue: number) => {
      if (!ctx) return;
      const scanY = (timeValue % (height + 100)) - 50;

      const gradient = ctx.createLinearGradient(0, scanY, 0, scanY + 30);
      gradient.addColorStop(0, 'rgba(0, 255, 255, 0)');
      gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY, width, 30);

      ctx.beginPath();
      ctx.moveTo(0, scanY + 15);
      ctx.lineTo(width, scanY + 15);
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    const drawCorners = (width: number, height: number) => {
      if (!ctx) return;
      const cornerLength = 40;
      const strokeColor = 'rgba(0, 255, 255, 0.6)';
      ctx.lineWidth = 3;
      ctx.strokeStyle = strokeColor;

      // Top-left
      ctx.beginPath();
      ctx.moveTo(0, cornerLength);
      ctx.lineTo(0, 0);
      ctx.lineTo(cornerLength, 0);
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(width - cornerLength, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, cornerLength);
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(0, height - cornerLength);
      ctx.lineTo(0, height);
      ctx.lineTo(cornerLength, height);
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(width - cornerLength, height);
      ctx.lineTo(width, height);
      ctx.lineTo(width, height - cornerLength);
      ctx.stroke();
    };

    const draw = () => {
      if (!ctx || !canvas) return;

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Dark background
      ctx.fillStyle = '#0a0f1a';
      ctx.fillRect(0, 0, width, height);

      // Gradient overlay
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, 'rgba(0, 20, 40, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 5, 15, 0.5)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      drawGrid(width, height);

      const maxRadius = Math.min(width, height) * 0.45;
      if (expanding && rippleRadius >= maxRadius) {
        expanding = false;
        rippleRadius = maxRadius;
        rippleOpacity = 0.8;
        setTimeout(() => {
          rippleRadius = 30;
          expanding = true;
        }, 500);
      } else if (!expanding && rippleRadius <= 30) {
        expanding = true;
        rippleRadius = 30;
      } else {
        if (expanding) {
          rippleRadius += 2.5;
          rippleOpacity = Math.max(0.2, 0.8 * (1 - rippleRadius / maxRadius));
        } else {
          rippleRadius -= 4;
          rippleOpacity = Math.min(0.8, rippleOpacity + 0.05);
        }
      }

      drawRadarLines(width, height, centerX, centerY, maxRadius);
      drawScanRipple(width, height, centerX, centerY, rippleRadius, rippleOpacity);
      drawScanLine(width, height, time);
      drawCorners(width, height);

      time += 2;
      animationFrameId = requestAnimationFrame(draw);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="safety-background">
      <canvas ref={canvasRef} className="canvas-layer" />
      <div className="content-overlay">
        <div className="brand">
          <div className="brand-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4L4 12V28L20 36L36 28V12L20 4Z" stroke="#0ff" strokeWidth="2" fill="none" />
              <path d="M20 12L12 16.5V25.5L20 30L28 25.5V16.5L20 12Z" stroke="#0ff" strokeWidth="1.5" fill="none" />
              <circle cx="20" cy="20" r="3" fill="#0ff" fillOpacity="0.8" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-dx">DX6</span>
            <span className="brand-ev">EV</span>
          </div>
        </div>

        <div className="tagline">
          <span className="tagline-line">INTERNATIONAL</span>
          <div className="tagline-main">
            <span>Saving Lives</span>
            <span>Is Our Priority</span>
          </div>
        </div>

        <div className="scan-indicator">
          <div className="scan-dot"></div>
          <span>SCANNING...</span>
          <div className="scan-pulse"></div>
        </div>
      </div>

      <style jsx>{`
        .safety-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
        }

        .canvas-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: block;
        }

        .content-overlay {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px 48px;
          box-sizing: border-box;
          font-family: 'Courier New', 'SF Mono', 'Space Mono', monospace;
        }

        /* Brand section - top left */
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon svg {
          filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.5));
        }

        .brand-text {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .brand-dx {
          color: #fff;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }

        .brand-ev {
          color: #0ff;
          text-shadow: 0 0 8px #0ff;
        }

        /* Tagline section - bottom left */
        .tagline {
          text-align: left;
        }

        .tagline-line {
          font-size: 14px;
          letter-spacing: 6px;
          color: rgba(0, 255, 255, 0.7);
          text-transform: uppercase;
          display: block;
          margin-bottom: 16px;
        }

        .tagline-main {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .tagline-main span:first-child {
          font-size: 42px;
          font-weight: 800;
          color: #fff;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        }

        .tagline-main span:last-child {
          font-size: 42px;
          font-weight: 800;
          color: #0ff;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
        }

        /* Scan indicator - bottom right */
        .scan-indicator {
          position: absolute;
          bottom: 40px;
          right: 48px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0, 20, 30, 0.7);
          backdrop-filter: blur(4px);
          padding: 10px 20px;
          border-radius: 40px;
          border: 1px solid rgba(0, 255, 255, 0.3);
        }

        .scan-dot {
          width: 10px;
          height: 10px;
          background-color: #0ff;
          border-radius: 50%;
          animation: blink 1s infinite;
          box-shadow: 0 0 8px #0ff;
        }

        .scan-indicator span {
          color: #0ff;
          font-size: 14px;
          letter-spacing: 2px;
          font-weight: 600;
        }

        .scan-pulse {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: rgba(0, 255, 255, 0.2);
          animation: pulse-ring 1.5s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .content-overlay {
            padding: 24px 28px;
          }
          .brand-text {
            font-size: 22px;
          }
          .tagline-main span:first-child,
          .tagline-main span:last-child {
            font-size: 28px;
          }
          .tagline-line {
            font-size: 10px;
            letter-spacing: 4px;
          }
          .scan-indicator {
            bottom: 24px;
            right: 28px;
            padding: 6px 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default SafetyBackground;
