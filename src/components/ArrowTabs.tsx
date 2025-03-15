import React from "react";

interface ArrowTabsProps {
  stages: string[]; // Array of stage names
  activeStage: number; // Active stage index
  onStageChange?: (index: number) => void; // Click handler
}

const ArrowTabs: React.FC<ArrowTabsProps> = ({ stages, activeStage, onStageChange }) => {
  return (
    <div className="flex items-center w-full">
      {stages.map((stage, index) => (
        <div
          key={index}
          className={`relative flex items-center px-2 py-2 text-[12px] text-white font-semibold cursor-pointer transition-all duration-300
            ${index === activeStage ? "bg-blue-500" : "bg-gray-400"}
          `}
          onClick={() => onStageChange && onStageChange(index)}
        >
          {/* Tab Label */}
          <span>{stage}</span>

          {/* Arrow Shape with 1px spacing */}
          <div className={`absolute top-0 right-[-1px] w-0 h-0 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent 
            ${index === activeStage ? "border-l-[15px] border-l-blue-500" : "border-l-[15px] border-l-gray-400"}`}
          />
        </div>
      ))}
    </div>
  );
};

export default ArrowTabs;