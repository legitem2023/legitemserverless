import React from "react";
import { Icon } from "@iconify/react";

interface ArrowTabsProps {
  stages: string[];
  activeStage: number;
  onStageChange?: (index: number) => void;
}

const ArrowTabs: React.FC<ArrowTabsProps> = ({ stages, activeStage, onStageChange }) => {
  return (
    <div className="flex w-full">
      {stages.map((stage, index) => (
        <div
          key={index}
          className={`border flex-1 flex-grow relative flex items-center justify-center px-3 py-2 text-[20px] text-white font-semibold cursor-pointer transition-all duration-300 
            ${index === activeStage ? "bg-[#451b05]" : "bg-[#ebb4a0]"}
          `}
          onClick={() => onStageChange && onStageChange(index)}
          style={{
            clipPath: "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)", // Tighter pentagon shape
            marginLeft: index > 0 ? "-5px" : "0px", // Overlapping effect without merging
            padding: "6px 12px", // Compact padding
          }}
        >
          <Icon icon={stage} className="text-[25px]" />
        </div>
      ))}
    </div>
  );
};

export default ArrowTabs;