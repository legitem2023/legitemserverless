"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
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
  const searchParams = useSearchParams(); // ✅ Get URL query params
  const router = useRouter();
  const swiperRef = useRef<any>(null);
  
  // ✅ Extract `id` from URL and parse it as a number
  const initialTab = Number(searchParams.get("id")) || 0;
  
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(activeTab);
    }
  }, [activeTab]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
    router.push(`?id=${index}`); // ✅ Update URL with selected tab
  };

  useEffect(() => {
    console.log(`Current Page URL: ${window.location.href}`);
    console.log(`Current Tab ID: ${activeTab}`);
    console.log(`Active Tab Label: ${tabs[activeTab]?.label}`);
  }, [activeTab, tabs]);

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
        initialSlide={initialTab} // ✅ Set initial slide from URL param
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