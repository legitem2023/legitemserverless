import React from "react";

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
          className={`relative flex items-center justify-center px-4 py-2 text-[12px] text-white font-semibold cursor-pointer transition-all duration-300 
            ${index === activeStage ? "bg-blue-500" : "bg-gray-400"}
          `}
          onClick={() => onStageChange && onStageChange(index)}
          style={{
            clipPath: "polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%, 15% 50%)", // Pentagon shape
            marginLeft: index > 0 ? "1px" : "0", // 1px spacing between arrows
          }}
        >
          {stage}
        </div>
      ))}
    </div>
  );
};

export default ArrowTabs;