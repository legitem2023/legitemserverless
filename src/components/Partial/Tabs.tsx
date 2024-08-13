'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState, useEffect, ReactNode } from 'react';
import useMenutoggle from '../../../store/useMenutoggle';

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
  const { isMenuToggled,menutoggle } = useMenutoggle();

  useEffect(() => {
    const storedActiveTab = localStorage.getItem('activeTab');
    if (storedActiveTab !== null) {
      setActiveTab(parseInt(storedActiveTab, 10));
    }
  }, []);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    localStorage.setItem('activeTab', String(index));
    menutoggle();
  };


  return (
    <div className="flex flex-col md:flex-row w-full top-10vh">
      <div
        className={`fixed top-[8vh] 
                    left-0 
                    z-10 
                    h-full 
                    bg-stone-300
                    border-r 
                    border-lime-800 
                    landscape:w-[22vw] 
                    portrait:w-[100vw] 
                    transition-transform 
                    transform 
                    ${ isMenuToggled ? 'portrait:translate-x-0':'portrait:-translate-x-full'}`}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`flex flex-row items-center p-3 focus:outline-none ease-in-out duration-300 text-left w-full ${
              activeTab === index
                ? 'border-b-4  border-lime-500 text-black bg-stone-400'
                : 'border-b-4  border-solid border-lime-800 flex-row align-center text-black-600 hover:text-lime-500'
            }`}
            onClick={() => handleTabClick(index)}
          >
            <Icon icon={tab.icon} className="mr-2" />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 p-1 landscape:ml-[22vw]">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;
