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
  badge?: string | number; // optional badge (e.g., notification count)
};

export interface FbMenuProps {
  /** Array of tab objects. Each tab must have id, label, and content. */
  tabs?: TabItem[];
  /** Initial active tab ID. If not provided, first tab is active. */
  initialTabId?: string;
  /** Callback when tab changes. Receives the new tab ID. */
  onTabChange?: (tabId: string) => void;
  /** Custom render for the menu icon (hamburger). Receives click handler and active state. */
  renderMenuIcon?: (props: { onClick: () => void; isActive: boolean }) => React.ReactNode;
  /** Custom class name for the container. */
  className?: string;
  /** Whether to show dot indicators. Default: true. */
  showIndicators?: boolean;
  /** Swipe threshold as percentage of container width (0-1). Default: 0.2. */
  swipeThreshold?: number;
}

// ============================================================
// 2. DEFAULT TABS (example data – easily replaceable)
// ============================================================
const DEFAULT_TABS: TabItem[] = [
  {
    id: "feed",
    label: "Feed",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
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
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
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
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
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
// 3. MAIN COMPONENT – FbMenu (fully reusable)
// ============================================================
export default function FbMenu({
  tabs = DEFAULT_TABS,
  initialTabId,
  onTabChange,
  renderMenuIcon,
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
      // reset translate after transition
      setTimeout(() => {
        setIsAnimating(false);
      }, 350);
    },
    [totalTabs, isAnimating, onTabChange, tabs]
  );

  // ----- handle menu icon click (cycle to next tab by default) -----
  const handleIconClick = () => {
    const next = (activeIndex + 1) % totalTabs;
    goToTab(next);
  };

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

  // ----- render menu icon (custom or default) -----
  const renderDefaultMenuIcon = () => (
    <button
      className="menu-icon"
      onClick={handleIconClick}
      aria-label="Switch tab"
      title="Click to switch tab"
    >
      <span className="bar"></span>
      <span className="bar"></span>
      <span className="bar"></span>
    </button>
  );

  const menuIconElement = renderMenuIcon ? (
    renderMenuIcon({ onClick: handleIconClick, isActive: activeIndex > 0 })
  ) : (
    renderDefaultMenuIcon()
  );

  // ----- render -----
  return (
    <div className={`fb-menu-container ${className}`} ref={containerRef}>
      {/* Header with customizable menu icon */}
      <div className="menu-header">
        <div className="brand">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="#1b74e4">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Reusable</span>
        </div>
        {menuIconElement}
      </div>

      {/* Swipe area / tabs */}
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
              <h2>
                {tab.icon && <span className="tab-icon">{tab.icon}</span>}
                {tab.label}
                {tab.badge && <span className="badge">{tab.badge}</span>}
              </h2>
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
          max-width: 420px;
          background: #ffffff;
          border-radius: 28px 28px 20px 20px;
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          position: relative;
          font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
          touch-action: pan-y;
          margin: 0 auto;
        }

        .menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px 10px 18px;
          background: white;
          border-bottom: 1px solid #e4e6eb;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .brand span {
          font-size: 20px;
          font-weight: 700;
          color: #1b1f23;
          letter-spacing: -0.3px;
        }

        .menu-icon {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 6px 4px;
          cursor: pointer;
          border-radius: 30px;
          transition: background 0.15s;
          background: transparent;
          border: none;
          outline: none;
        }
        .menu-icon:hover {
          background: #f0f2f5;
        }
        .menu-icon .bar {
          display: block;
          width: 24px;
          height: 3px;
          background: #1b1f23;
          border-radius: 10px;
          transition: 0.2s;
        }

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
          padding: 16px 18px 20px;
          background: white;
          min-height: 300px;
        }
        .tab-panel h2 {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #050505;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tab-icon {
          display: inline-flex;
          align-items: center;
        }
        .badge {
          background: #e7f3ff;
          color: #1b74e4;
          font-size: 12px;
          font-weight: 600;
          padding: 2px 10px;
          border-radius: 30px;
          margin-left: auto;
        }
        .tab-panel p {
          color: #4b4f56;
          line-height: 1.5;
          font-size: 15px;
        }

        .card-item {
          background: #f7f8fa;
          border-radius: 16px;
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
          border-radius: 40px;
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
            border-radius: 20px;
          }
          .tab-panel {
            padding: 14px 16px 18px;
          }
        }
      `}</style>
    </div>
  );
}
