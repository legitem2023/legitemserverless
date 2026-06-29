"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

// ============================================================
// 1. TYPE DEFINITIONS – for full reusability
// ============================================================
export type TabItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  badge?: string | number;
};

export interface FbMenuProps {
  tabs?: TabItem[];
  initialTabId?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  showIndicators?: boolean;
  swipeThreshold?: number;
}

// ============================================================
// 2. DEFAULT TABS (example data)
// ============================================================
const DEFAULT_TABS: TabItem[] = [
  {
    id: "feed",
    label: "Feed",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
      </svg>
    ),
    content: (
      <div>
        <p style={{ marginBottom: 12, color: "#4b4f56" }}>
          Your feed updates appear here.
        </p>
        <div className="card-item">
          <div className="avatar">JD</div>
          <div className="info">
            <strong>John Doe</strong>
            <span>2 min ago • shared a post</span>
          </div>
        </div>
        <div className="card-item">
          <div className="avatar">AK</div>
          <div className="info">
            <strong>Anna K.</strong>
            <span>15 min ago • commented</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "messages",
    label: "Messages",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
      </svg>
    ),
    badge: 3,
    content: (
      <div>
        <p style={{ marginBottom: 12, color: "#4b4f56" }}>
          Your recent conversations.
        </p>
        <div className="card-item">
          <div className="avatar">MC</div>
          <div className="info">
            <strong>Maria C.</strong>
            <span>Hey! How are you?</span>
          </div>
        </div>
        <div className="card-item">
          <div className="avatar">TR</div>
          <div className="info">
            <strong>Tom R.</strong>
            <span>See you tomorrow 👍</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
      </svg>
    ),
    badge: "12",
    content: (
      <div>
        <p style={{ marginBottom: 12, color: "#4b4f56" }}>
          Your latest notifications.
        </p>
        <div className="card-item">
          <div className="avatar">👍</div>
          <div className="info">
            <strong>Liked your post</strong>
            <span>Sarah and 3 others</span>
          </div>
        </div>
        <div className="card-item">
          <div className="avatar">💬</div>
          <div className="info">
            <strong>New comment</strong>
            <span>on your photo</span>
          </div>
        </div>
      </div>
    ),
  },
];

// ============================================================
// 3. MAIN COMPONENT – FbMenu (with Facebook-style top tabs)
// ============================================================
export default function FbMenu({
  tabs = DEFAULT_TABS,
  initialTabId,
  onTabChange,
  className = "",
  showIndicators = true,
  swipeThreshold = 0.2,
}: FbMenuProps) {
  // ----- state -----
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    if (initialTabId) {
      const idx = tabs.findIndex((t) => t.id === initialTabId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  // refs for swipe handling
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const totalTabs = tabs.length;
  const activeTabId = tabs[activeIndex]?.id || "";

  // ----- navigate to tab (with animation) -----
  const goToTab = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalTabs || isAnimating) return;
      setIsAnimating(true);
      setActiveIndex(index);
      if (onTabChange) onTabChange(tabs[index].id);
      setTimeout(() => {
        setIsAnimating(false);
      }, 350);
    },
    [totalTabs, isAnimating, onTabChange, tabs]
  );

  // ----- swipe handlers (touch & mouse) -----
  const handleDragStart = (clientX: number) => {
    if (isAnimating) return;
    setIsDragging(true);
    setStartX(clientX);
    setCurrentTranslate(0);
    if (scrollRef.current) {
      scrollRef.current.style.transition = "none";
    }
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const delta = clientX - startX;
    setCurrentTranslate(delta);
    if (scrollRef.current && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const offset = -activeIndex * 100 + (delta / containerWidth) * 100;
      scrollRef.current.style.transform = `translateX(${offset}%)`;
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.transition =
        "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    }
    const containerWidth = containerRef.current?.offsetWidth || 300;
    const threshold = swipeThreshold * containerWidth;
    if (Math.abs(currentTranslate) > threshold) {
      if (currentTranslate < 0 && activeIndex < totalTabs - 1) {
        goToTab(activeIndex + 1);
      } else if (currentTranslate > 0 && activeIndex > 0) {
        goToTab(activeIndex - 1);
      } else {
        goToTab(activeIndex);
      }
    } else {
      goToTab(activeIndex);
    }
    setCurrentTranslate(0);
  };

  // mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };
  const onMouseUp = () => {
    handleDragEnd();
  };
  const onMouseLeave = () => {
    if (isDragging) handleDragEnd();
  };

  // touch events
  const onTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };
  const onTouchEnd = () => {
    handleDragEnd();
  };

  // update transform when activeIndex changes (non-drag)
  useEffect(() => {
    if (!isDragging && scrollRef.current) {
      scrollRef.current.style.transform = `translateX(-${activeIndex * 100}%)`;
    }
  }, [activeIndex, isDragging]);

  // clean up global mouseup
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) handleDragEnd();
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging]);

  // ----- render -----
  return (
    <div className={`fb-menu-container ${className}`} ref={containerRef}>
      {/* Facebook-style top tab bar */}
      <div className="tab-bar">
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={tab.id}
              className={`tab-button ${isActive ? "active" : ""}`}
              onClick={() => goToTab(index)}
              aria-label={tab.label}
            >
              <span className="tab-icon-wrapper">
                {tab.icon && <span className="tab-icon">{tab.icon}</span>}
                {tab.badge && <span className="tab-badge">{tab.badge}</span>}
              </span>
              <span className="tab-label">{tab.label}</span>
              {isActive && <span className="tab-indicator" />}
            </button>
          );
        })}
      </div>

      {/* Swipe area / content */}
      <div
        className="tabs-wrapper"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="tabs-scroll" ref={scrollRef}>
          {tabs.map((tab) => (
            <div className="tab-panel" key={tab.id}>
              {tab.content}
            </div>
          ))}
        </div>

        {/* Dot indicators (optional) */}
        {showIndicators && totalTabs > 1 && (
          <div className="dot-indicators">
            {tabs.map((_, idx) => (
              <span
                key={idx}
                className={`dot ${idx === activeIndex ? "active" : ""}`}
                onClick={() => goToTab(idx)}
                role="button"
                tabIndex={0}
                aria-label={`Go to tab ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .fb-menu-container {
          width: 100%;
          
          background:transparent;
          
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          touch-action: pan-y;
          margin: 0 auto;
        }

        /* ===== TOP TAB BAR (Facebook style) ===== */
        .tab-bar {
          display: flex;
          align-items: stretch;
          background:transparent;
          filter:blur(0.3);
          border-bottom: 1px solid #e4e6eb;
          padding: 0 4px;
          position: relative;
        }

        .tab-button {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          padding: 10px 4px 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          position: relative;
          transition: background 0.15s;
          border-radius: 8px 8px 0 0;
          min-height: 56px;
          color: #65676b;
          font-family: inherit;
        }

        .tab-button:hover {
          background: #f0f2f5;
        }

        .tab-button.active {
          color: #1b74e4;
        }

        .tab-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tab-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          line-height: 1;
        }

        .tab-icon svg {
          width: 24px;
          height: 24px;
        }

        .tab-badge {
          position: absolute;
          top: -6px;
          right: -12px;
          background: #e41e3f;
          color: white;
          font-size: 11px;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          border: 2px solid #ffffff;
        }

        .tab-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2px;
          line-height: 1.2;
        }

        .tab-indicator {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 3px;
          background: #1b74e4;
          border-radius: 10px 10px 0 0;
          transition: width 0.2s;
        }

        .tab-button.active .tab-indicator {
          width: 28px;
        }

        /* ===== CONTENT AREA ===== */
        .tabs-wrapper {
          position: relative;
          overflow: hidden;
          touch-action: none;
          user-select: none;
        }

        .tabs-scroll {
          display: flex;
          flex-wrap: nowrap;
          transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform;
        }

        .tab-panel {
          flex: 0 0 100%;
          padding:0px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          min-height: 280px;
        }

        .tab-panel h3 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #050505;
        }

        .tab-panel p {
          color: #4b4f56;
          line-height: 1.5;
          font-size: 15px;
          margin-bottom: 8px;
        }

        /* Card items */
        .card-item {
          background: #f7f8fa;
          border-radius: 12px;
          padding: 12px 14px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid #e4e6eb;
        }

        .card-item .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e4e6eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #1b1f23;
          flex-shrink: 0;
        }

        .card-item .info {
          flex: 1;
        }

        .card-item .info strong {
          display: block;
          font-size: 15px;
          color: #050505;
        }

        .card-item .info span {
          font-size: 13px;
          color: #65676b;
        }

        /* Dot indicators */
        .dot-indicators {
          display: flex;
          justify-content: center;
          gap: 8px;
          padding: 8px 0 14px 0;
          background: white;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 20px;
          background: #ced0d4;
          cursor: pointer;
          transition: 0.2s;
          display: inline-block;
        }

        .dot.active {
          background: #1b74e4;
          width: 22px;
        }

        .dot:hover {
          background: #8b8f9c;
        }

        .dot.active:hover {
          background: #1b74e4;
        }

        @media (max-width: 480px) {
          .fb-menu-container {
            max-width: 100%;
            border-radius: 12px;
          }

          .tab-button {
            min-height: 48px;
            padding: 6px 2px 6px;
          }

          .tab-label {
            font-size: 10px;
          }

          .tab-icon svg {
            width: 20px;
            height: 20px;
          }

          .tab-panel {
            padding: 12px 14px 10px;
          }
        }
      `}</style>
    </div>
  );
}
