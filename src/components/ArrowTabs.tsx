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
    <div className="w-full">
      {/* Tab Buttons (Curved Arrow Style) */}
      <div className="flex p-1 gap-1 shadow-lg shadow-inner">
        {tabs.map((tab, index) => {
          let clipPath =
            "polygon(0% 10%, 85% 0%, 100% 50%, 85% 100%, 0% 90%, 12% 50%)"; // Middle tabs (slightly curved)

          if (index === 0) {
            clipPath = "polygon(0% 10%, 85% 0%, 100% 50%, 85% 100%, 0% 90%)"; // First tab (flat left, curved right)
          } else if (index === tabs.length - 1) {
            clipPath = "polygon(0% 10%, 100% 0%, 100% 100%, 0% 90%, 12% 50%)"; // Last tab (curved left, flat right)
          }

          return (
            <div
              key={index}
              onClick={() => dispatch(setActiveIndex(index))}
              className={`relative flex items-center justify-center text-white font-semibold cursor-pointer transition-all duration-300 
                ${activeIndex === index ? "bg-[#606060]" : "bg-[#e1e1e1]"}
              `}
              style={{
                clipPath,
                marginLeft: index > 0 ? "-6px" : "0px",
                padding: "10px 20px",
                boxShadow: activeIndex === index
                  ? "0px 5px 10px rgba(0, 0, 0, 0.2)"
                  : "0px 2px 5px rgba(0, 0, 0, 0.1)", // Raised effect
                transform: activeIndex === index ? "translateY(-3px)" : "translateY(0px)", // Slight lift when active
                background: activeIndex === index
                  ? "linear-gradient(145deg, #707070, #505050)"
                  : "linear-gradient(145deg, #f0f0f0, #d8d8d8)", // Gradient effect
              }}
            >
              <Icon icon={tab.icon} className="text-[18px]" />
            </div>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-gray-100 text-gray-800 rounded-md p-4">
        {tabs[activeIndex]?.content}
      </div>
    </div>
  );
};

export default ArrowTabs;