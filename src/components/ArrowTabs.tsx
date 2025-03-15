import React from "react";
import { Icon } from "@iconify/react";

interface ArrowTabsProps {
  stages: string[];
  activeStage: number;
  onStageChange?: (index: number) => void;
}

const ArrowTabs: React.FC<ArrowTabsProps> = ({ stages, activeStage, onStageChange }) => {
  return (
    <div className="bg-[#ff9999] flex w-full gap-1">
      {stages.map((stage, index) => {
        let clipPath = "polygon(0% 0%, 88% 0%, 100% 50%, 88% 100%, 0% 100%, 12% 50%)"; // Middle tabs (arrow on both sides)

        if (index === 0) {
          // First tab (flat left, arrow right)
          clipPath = "polygon(0% 0%, 88% 0%, 100% 50%, 88% 100%, 0% 100%)";
        } else if (index === stages.length - 1) {
          // Last tab (arrow left, flat right)
          clipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 12% 50%)";
        }

        return (
          <div
            key={index}
            className={`relative flex-1 flex items-center justify-center text-white font-semibold cursor-pointer transition-all duration-300 
              ${index === activeStage ? "bg-[#451b05]" : "bg-[#9a3610]"}
            `}
            onClick={() => onStageChange && onStageChange(index)}
            style={{
              clipPath,
              marginLeft: index > 0 ? "-4px" : "0px",
              padding: "8px 16px",
            }}
          >
            <Icon icon={stage} className="text-[18px]" />
          </div>
        );
      })}
    </div>
  );
};

export default ArrowTabs;