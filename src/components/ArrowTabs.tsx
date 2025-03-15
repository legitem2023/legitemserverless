import React from "react";
import { Icon } from "@iconify/react";

interface ArrowTabsProps {
  stages: string[];
  activeStage: number;
  onStageChange?: (index: number) => void;
}

const ArrowTabs: React.FC<ArrowTabsProps> = ({ stages, activeStage, onStageChange }) => {
  return (
    <div className="bg-[#ff9999] flex w-full gap-2"> {/* Increased gap for clarity */}
      {stages.map((stage, index) => (
        <div
          key={index}
          className={`relative flex flex-1 items-center justify-center text-white font-semibold cursor-pointer transition-all duration-300 
            ${index === activeStage ? "bg-[#451b05]" : "bg-[#9a3610]"}
          `}
          onClick={() => onStageChange && onStageChange(index)}
          style={{
            clipPath: "polygon(0% 0%, 88% 0%, 100% 50%, 88% 100%, 0% 100%, 12% 50%)",
            marginLeft: index > 0 ? "-6px" : "0px", // Small overlap for smooth transitions
            padding: "10px 20px", // Comfortable spacing
            fontSize: "18px",
          }}
        >
          <Icon icon={stage} className="text-[20px]" />
        </div>
      ))}
    </div>
  );
};

export default ArrowTabs;