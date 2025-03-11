"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation"; // Import usePathname
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import clsx from "clsx";
import { Icon } from "@iconify/react";

interface TabItem {
  label: string;
  Icn: string;
  content: React.ReactNode;
}

interface SwipeTabsProps {
  tabs: TabItem[];
}

export default function SwipeTabs({ tabs }: SwipeTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const swiperRef = useRef<any>(null);
  const pathname = usePathname(); // Get current URL

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  // Detect current page URL and active tab, then log them
  useEffect(() => {
    console.log(`Current Page URL: ${pathname}, Active Tab: ${tabs[activeTab].label}`);
  }, [activeTab, pathname, tabs]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Tabs Header */}
      <div className="flex space-x-2 border-b border-gray-300 bg-[#ebb4a0]">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={clsx(
              "text-[25px] flex flex-col items-center justify-center flex-1 py-2 transition-all duration-300",
              activeTab === index
                ? "border-b-2 border-[#451b05] bg-[#451b05] text-[#ffffff]"
                : "text-[#451b05]"
            )}
            onClick={() => handleTabClick(index)}
          >
            <Icon icon={tab.Icn} />
          </button>
        ))}
      </div>

      {/* Swiper Content */}
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        onSlideChange={(swiper) => setActiveTab(swiper.activeIndex)}
        initialSlide={activeTab}
        className="w-full"
      >
        {tabs.map((tab, index) => (
          <SwiperSlide key={index}>
            <div className="p-3 shadow-md">{tab.content}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}