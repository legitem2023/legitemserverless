import React from "react";

interface ArrowTabsProps {
  stages: string[];  // Array of stage names
  activeStage: number;  // Index of active stage
  onStageChange?: (index: number) => void;  // Click handler
}

const ArrowTabs: React.FC<ArrowTabsProps> = ({ stages, activeStage, onStageChange }) => {
  return (
    <div className="flex items-center w-full">
      {stages.map((stage, index) => (
        <div
          key={index}
          className={`relative flex items-center px-4 py-2 border ${
            index === activeStage ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
          } cursor-pointer transition-all duration-300`}
          onClick={() => onStageChange && onStageChange(index)}
        >
          <span className="font-semibold">{stage}</span>

          {/* Right Arrow */}
          {index < stages.length - 1 && (
            <div className="w-0 h-0 border-l-[15px] border-l-transparent border-t-[20px] border-t-gray-200 border-b-[20px] border-b-gray-200 absolute right-[-14px] top-1/2 transform -translate-y-1/2" />
          )}

          {/* Active Right Arrow */}
          {index < stages.length - 1 && index === activeStage && (
            <div className="w-0 h-0 border-l-[15px] border-l-transparent border-t-[20px] border-t-blue-500 border-b-[20px] border-b-blue-500 absolute right-[-14px] top-1/2 transform -translate-y-1/2" />
          )}
        </div>
      ))}
    </div>
  );
};

export default ArrowTabs;