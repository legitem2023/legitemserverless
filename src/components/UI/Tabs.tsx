import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {setActiveIndex} from '../Redux/activeIndexSlice';
type Tab = {
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
};

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const Dispatch = useDispatch();
  const activeIndex = useSelector((state:any)=>state.activeIndex.activeIndex);
  return (
    <div className="w-full">
      {/* Tab Buttons */}
      <div className="flex border-b">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => Dispatch(setActiveIndex(index))}
            className={`px-4 py-2 text-sm font-medium ${
              activeIndex === index
                ? "border-b-2 border-[#451b05] text-[#451b05]"
                : "text-gray-500 hover:text-[#451b05]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-0">{tabs[activeIndex]?.content}</div>
    </div>
  );
};

export default Tabs;
