import React from "react";

interface ArrowTabsProps {
  stages: string[];
  activeStage: number;
  onStageChange?: (index: number) => void;
}

const ArrowTabs: React.FC<ArrowTabsProps> = ({ stages, activeStage, onStageChange }) => {
  return (
    <div className="flex items-center w-full">
      {stages.map((stage, index) => (
        <div
          key={index}
          className={`relative flex items-center justify-center px-4 py-2 text-[12px] text-white font-semibold cursor-pointer transition-all duration-300 
            ${index === activeStage ? "bg-blue-500" : "bg-gray-400"}
          `}
          onClick={() => onStageChange && onStageChange(index)}
          style={{
            clipPath: "polygon(0% 50%, 10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%)",
            marginRight: index < stages.length - 1 ? "2px" : "0", // Small spacing between arrows
          }}
        >
          {stage}
        </div>
      ))}
    </div>
  );
};

export default ArrowTabs;