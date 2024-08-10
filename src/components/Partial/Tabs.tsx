'use client'
import { useState, ReactNode } from 'react';
interface Tab {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex w-[100%]">
      <div className="flex flex-col border-r bg-lime-700">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`py-2 px-4 focus:outline-none ease-in-out duration-300 text-left w-[20vw] ${
              activeTab === index
                ? 'border-r-4 border-lime-500 text-[#ffffff]'
                : 'border-r-4 border-stone-500 text-black-600 hover:text-lime-500'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="ml-1 mt-1 w-[100%]">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;
