'use client';

import { Icon } from '@iconify/react/dist/iconify.js';
import { useState, useEffect, ReactNode } from 'react';

interface Tab {
  label: string;
  content: ReactNode;
  icon: string;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  // Retrieve the active tab from localStorage on component mount
  useEffect(() => {
    const storedActiveTab = localStorage.getItem('activeTab');
    if (storedActiveTab !== null) {
      setActiveTab(parseInt(storedActiveTab, 10)); // Make sure to parse the string to a number
    }
  }, []);

  // Update localStorage whenever the active tab changes
  const handleTabClick = (index: number) => {
    setActiveTab(index);
    localStorage.setItem('activeTab', String(index)); // Save the index as a string
  };

  return (
    <div className="flex w-[100vw]">
      <div className="flex flex-col border-r bg-lime-700 h-[100%]">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`flex flex-row items-center py-2 px-4 focus:outline-none ease-in-out duration-300 text-left w-[21.80vw] ${
              activeTab === index
                ? 'border-r-4 border-lime-500 text-[#ffffff] bg-lime-600'
                : 'border-r-4 border-stone-500 text-black-600 hover:text-lime-500'
            }`}
            onClick={() => handleTabClick(index)}
          >
            <Icon icon={tab.icon} className="mr-2"/>{tab.label}
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
