"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import { setActiveIndex as Index2 } from "../Redux/swipeSlice";

import {useDispatch} from "react-redux";
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
  // Get id from URL and set the active tab on initial render
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
   dispatch(Index2(0));
   setActiveTab(index);
    if (swiperRef.current && swiperRef.current.slideTo) {
      swiperRef.current.slideTo(index);
    }
    router.push(`./?id=${index}`, { scroll: false });
  };

  return (
    <div className="w-full">
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