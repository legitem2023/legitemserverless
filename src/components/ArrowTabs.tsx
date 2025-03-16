"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveIndex } from "./Redux/activeIndexSlice";
import { Icon } from "@iconify/react";

type Tab = {
  icon: string; // Iconify icon name
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
};

const ArrowTabs: React.FC<TabsProps> = ({ tabs }) => {
  const dispatch = useDispatch();
  const activeIndex = useSelector((state: any) => state.activeIndex.activeIndex);

  return (
    <div className="w-full bg-[#f1f1f1] shadow-lg shadow-inner">
      {/* Tab Buttons (Arrow Style) */}
      <div className="flex p-1 gap-1 shadow-lg shadow-inner">
        {tabs.map((tab, index) => {
          let clipPath =
            "polygon(0% 0%, 88% 0%, 100% 50%, 88% 100%, 0% 100%, 12% 50%)"; // Middle tabs (arrow on both sides)

          if (index === 0) {
            clipPath = "polygon(0% 0%, 88% 0%, 100% 50%, 88% 100%, 0% 100%)"; // First tab (flat left, arrow right)
          } else if (index === tabs.length - 1) {
            clipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 12% 50%)"; // Last tab (arrow left, flat right)
          }

          return (
            <div
              key={index}
              onClick={() => dispatch(setActiveIndex(index))}
              className={`relative flex items-center justify-center text-white font-semibold cursor-pointer transition-all duration-300 ${
                activeIndex === index ? "bg-[#606060]" : "bg-[#e1e1e1]"
              }`}
              style={{
                clipPath,
                borderRadius: "3px",
                marginLeft: index > 0 ? "-5px" : "0px",
                padding: "8px 17px",
                backgroundImage: activeIndex === index
                  ? "linear-gradient(to right, #505050, #606060, #505050)"
                  : "linear-gradient(to right, #d1d1d1, #e1e1e1, #d1d1d1)",
                boxShadow: activeIndex === index
                  ? "inset 1px 1px 3px rgba(255, 255, 255, 0.3), inset -1px -1px 3px rgba(0, 0, 0, 0.2), 3px 3px 5px rgba(0, 0, 0, 0.3)" // Outer shadow added
                  : "inset 1px 1px 3px rgba(255, 255, 255, 0.3), inset -1px -1px 3px rgba(0, 0, 0, 0.1), 2px 2px 4px rgba(0, 0, 0, 0.2)" // Softer shadow for inactive tabs
              }}
            >
              <Icon icon={tab.icon} className="text-[18px]" />
            </div>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-gray-100 text-gray-800 rounded-md">{tabs[activeIndex]?.content}</div>
    </div>
  );
};

export default ArrowTabs;