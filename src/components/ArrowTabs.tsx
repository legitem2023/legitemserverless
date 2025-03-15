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
          className={`relative flex items-center px-6 py-3 text-white font-semibold cursor-pointer transition-all duration-300
            ${index === activeStage ? "bg-blue-500" : "bg-gray-400"}
          `}
          onClick={() => onStageChange && onStageChange(index)}
        >
          {/* Tab Label */}
          <span>{stage}</span>

          {/* Arrow Shape */}
          <div className={`absolute top-0 right-[-15px] w-0 h-0 border-t-[22px] border-t-transparent border-b-[22px] border-b-transparent 
            ${index === activeStage ? "border-l-[15px] border-l-blue-500" : "border-l-[15px] border-l-gray-400"}`}
          />
        </div>
      ))}
    </div>
  );
};

export default ArrowTabs;