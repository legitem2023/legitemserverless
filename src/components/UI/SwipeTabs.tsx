"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import { setActiveIndex } from "../Redux/activeIndexSlice";
import { useDispatch } from "react-redux";

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
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabId = parseInt(params.get("id") || "0", 10);
      if (!isNaN(tabId) && tabId >= 0 && tabId < tabs.length) {
        setActiveTab(tabId);
        if (swiperRef.current && swiperRef.current.slideTo) {
          swiperRef.current.slideTo(tabId);
        }
      }
    }
  }, [tabs]);

  const handleTabClick = (index: number) => {
    dispatch(setActiveIndex(0));
    setActiveTab(index);
    if (swiperRef.current && swiperRef.current.slideTo) {
      swiperRef.current.slideTo(index);
    }
    router.push(`./?id=${index}`, { scroll: false });
  };

  return (
    <div className="w-full flex flex-col lg:flex-row">
      {/* Tabs Header - responsive direction */}
      <div className="bg-[#ebb4a0] border-b lg:border-b-0 lg:border-r border-gray-300 w-full lg:w-[15%]">
        <div className="flex lg:flex-col">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={clsx(
                "text-[25px] flex items-center justify-center lg:justify-start gap-2 p-3 transition-all duration-300 w-full",
                activeTab === index
                  ? "bg-[#451b05] text-white lg:border-r-4 border-b-2 border-[#451b05]"
                  : "text-[#451b05]"
              )}
              onClick={() => handleTabClick(index)}
            >
              <Icon icon={tab.Icn} />
              <span className="hidden lg:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Swiper Content */}
      <div className="w-full lg:w-[85%]">
        <Swiper
          allowTouchMove={false}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Pagination]}
          spaceBetween={10}
          slidesPerView={1}
          initialSlide={activeTab}
        >
          {tabs.map((tab, index) => (
            <SwiperSlide key={index}>
              <div className="p-2">{tab.content}</div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
