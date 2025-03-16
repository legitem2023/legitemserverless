"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
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

function SwipeTabsComponent({ tabs }: SwipeTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const swiperRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabId = parseInt(params.get("id") || "0", 10);
      if (!isNaN(tabId) && tabId >= 0 && tabId < tabs.length) {
        setActiveTab(tabId);
        if (swiperRef.current) {
          swiperRef.current.slideTo(tabId);
        }
      }
    }
  }, [tabs]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
    router.push(`./?id=${index}`, { scroll: false });
  };

  return (
    <div className="relative w-full">
      {/* Gradient Overlays */}
      <div className="absolute top-0 left-0 h-full w-6 bg-gradient-to-r from-[#ebb4a0] to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-[#ebb4a0] to-transparent pointer-events-none" />

      {/* Tabs Header */}
      <div className="flex space-x-2 border-b border-gray-300 bg-[#ebb4a0] relative overflow-hidden">
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
        allowTouchMove={false}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        initialSlide={activeTab}
        className="w-full"
      >
        {tabs.map((tab, index) => (
          <SwiperSlide key={index} className="relative">
            <div className="p-2">{tab.content}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

// Wrap in Suspense for Next.js compatibility
export default function SwipeTabs(props: SwipeTabsProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SwipeTabsComponent {...props} />
    </Suspense>
  );
}