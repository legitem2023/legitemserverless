'use client';
import React, { useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import Category from './MenuCategory';
import Menu from '../../../json/menu.json'
import useCollapse from '../../../store/useCollapse';
import { usePathname } from "next/navigation";
const Aside: React.FC = () => {
  const {status} = useCollapse();
  const reference = useRef<HTMLDivElement>(null);
  useEffect(() => {

    if(window?.innerWidth > 1080){
      if (reference.current) {
        if (status==false) {
          reference.current.classList.add('left-0');
          reference.current.classList.remove('left-[-100vw]');
        } else {
          reference.current.classList.add('left-[-100vw]');
          reference.current.classList.remove('left-0');
        }
      }
    }else{

      if (reference.current) {
        if (status==true) {
          reference.current.classList.add('left-0');
          reference.current.classList.remove('left-[-100vw]');
        } else {
          reference.current.classList.add('left-[-100vw]');
          reference.current.classList.remove('left-0');
        }
      }
    }
    

  }, [status]);
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/Administrator');
  const isAdminRoute_2 = pathname.startsWith('/Account');

  if (isAdminRoute || isAdminRoute_2) {
    return null; // Return null if not on an admin route
  }

  return (
    <nav id="Aside" ref={reference} className='flex flex-wrap flex-col absolute top-[8vh] h-[100%] text-lime-950 w-[100vw] lg:w-[21.80vw] z-30 m-auto lg:left-0 sm:left-[-100vw] transition ease-in-out'>
      <div className='flex flex-wrap flex-col w-[100%] bg-stone-300'>
      {Menu.map((item, idx) => (
        <div key={idx} className='flex flex-row align-center transition ease-in-out duration-500 flex-1 p-2 border-b-4 border-b-solid border-b-lime-800 hover:bg-lime-500 cursor-pointer'>
          {item.Name==='Category'?'':<div className='flex flex-col justify-center p-2'><Icon icon={item.Icc}/></div>}
          {item.Name==='Category'?<Category/>:<div className='flex flex-col justify-center'>{item.Name}</div>}
        </div>
      ))}
      </div>
    </nav>
  );
}

export default Aside;
