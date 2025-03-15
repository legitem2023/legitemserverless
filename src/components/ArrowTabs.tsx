import React from "react";
import { Icon } from "@iconify/react";

interface ArrowTabsProps {
  stages: string[];
  activeStage: number;
  onStageChange?: (index: number) => void;
}

const ArrowTabs: React.FC<ArrowTabsProps> = ({ stages, activeStage, onStageChange }) => {
  return (
    <div className="bg-[#ff9999] flex w-full gap-1"> {/* Added gap-1 for spacing */}
      {stages.map((stage, index) => (
        <div
          key={index}
          className={`flex-1 flex-grow relative flex items-center justify-center px-3 py-2 text-[20px] text-white font-semibold cursor-pointer transition-all duration-300 
            ${index === activeStage ? "bg-[#451b05]" : "bg-[#9a3610]"}
          `}
          onClick={() => onStageChange && onStageChange(index)}
          style={{
            clipPath: "polygon(0% 0%, 88% 0%, 100% 50%, 88% 100%, 0% 100%, 12% 50%)", // Sharper arrowhead
            marginLeft: index > 0 ? "-2px" : "0px", // Small overlap for distinction
            padding: "8px 16px", // Comfortable spacing
          }}
        >
          <Icon icon={stage} className="text-[25px]" />
        </div>
      ))}
    </div>
  );
};

export default ArrowTabs;