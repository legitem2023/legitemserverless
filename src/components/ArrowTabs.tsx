import React from "react";
import { Icon } from "@iconify/react";

interface ArrowTabsProps {
  stages: string[];
  activeStage: number;
  onStageChange?: (index: number) => void;
}

const ArrowTabs: React.FC<ArrowTabsProps> = ({ stages, activeStage, onStageChange }) => {
  return (
    <div className="bg-[#ff9999] flex w-full">
      {stages.map((stage, index) => (
        <div
          key={index}
          className={`flex-1 flex-grow relative flex items-center justify-center px-3 py-2 text-[20px] text-white font-semibold cursor-pointer transition-all duration-300 
            ${index === activeStage ? "bg-[#451b05]" : "bg-[#ebb4a0]"}
          `}
          onClick={() => onStageChange && onStageChange(index)}
          style={{
            clipPath: "polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%, 10% 50%)", // Sharper arrow shape
            marginLeft: index > 0 ? "-8px" : "0px", // More overlap for better arrow effect
            padding: "8px 14px", // Balanced padding
          }}
        >
          <Icon icon={stage} className="text-[25px]" />
        </div>
      ))}
    </div>
  );
};

export default ArrowTabs;