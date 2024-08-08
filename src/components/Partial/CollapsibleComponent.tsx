'use client';

import { Icon } from '@iconify/react/dist/iconify.js';
import { useState } from 'react';

const CollapsibleComponent = ({ title,icon, children }:any) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="transition ease-in-out duration-500 col-span-1 flex flex-col justify-center item-center p-0 hover:bg-lime-500 cursor-pointer h-[8vh]" onClick={toggleCollapse}>
      <span className='w-[100%] h-[30px] text-lime-950' >
        <Icon icon={icon} className='w-[100%] h-[30px] text-lime-950 scale-110'/>
      </span>
      <div className=''>
        <span className='w-[100%] flex justify-center headLabel'>{title}</span>
      </div>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

export default CollapsibleComponent;
