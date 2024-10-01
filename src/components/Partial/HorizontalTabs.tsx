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

const HorizontalTabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const handleTabClick = (index: number) => {
    setActiveTab(index);
    localStorage.setItem('activeTab', String(index));
  };
  useEffect(() => {
    const storedActiveTab = localStorage.getItem('activeTab');
    if (storedActiveTab !== null) {
      setActiveTab(parseInt(storedActiveTab, 10));
    }
  }, []);
  return (
    <div className="flex w-[100%] relative">
      <div className="flex flex-row border-r h-[100%] mt-1 border border-b-lime-800">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`grid 
                        sm:grid-cols-1 
                        md:grid-cols-1 
                        lg:grid-cols-3 
                        xl:grid-cols-3 
                        2xl:grid-cols-3 
                        items-center 
                        justify-center 
                        align-center 
                        p-2
                        text-xl
                        text-lime-800 
                        focus:outline-none 
                        ease-in-out duration-300 
                        w-[10vw] 
                        cursor-pointer
                        rounded-t-xl
                        ${
              activeTab === index
                ? 'border-b-4 border-lime-800 text-lime-800 bg-lime-600'
                : 'border-b-4 border-transparent flex-row align-center text-stone-600 hover:text-black-500'
            }`}
            onClick={() => handleTabClick(index)}
          >
            <span className='flex flex-row items-center justify-center col-span-1'>
                <Icon icon={tab.icon}/>
            </span>
            <span className='col-span-2'>{tab.label}</span>
          </div>
        ))}
      </div>
      <div className="ml-1 mt-1 w-[100%]">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default HorizontalTabs;
