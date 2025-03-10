"use client";

import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import clsx from "clsx";
import { Icon } from '@iconify/react';

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
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* Tabs Header */}
      <div className="relative flex space-x-2 border-b border-gray-300 bg-[#ebb4a0]">
        {tabs.map((tab, index) => (
          <button
            key={index}
            ref={(el) => (tabRefs.current[index] = el)}
            className={clsx(
              "text-[25px] flex flex-col items-center justify-center flex-1 py-2 transition-all duration-300 text-[#451b05]",
              activeTab === index && "text-[#ffffff]"
            )}
            onClick={() => handleTabClick(index)}
          >
            <Icon icon={tab.Icn} />
          </button>
        ))}
        {/* Animated Bottom Border */}
        <div
          className="absolute bottom-0 h-1 bg-[#451b05] transition-all duration-300"
          style={{
            width: tabRefs.current[activeTab]?.offsetWidth || 0,
            transform: `translateX(${tabRefs.current[activeTab]?.offsetLeft || 0}px)`,
          }}
        />
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
