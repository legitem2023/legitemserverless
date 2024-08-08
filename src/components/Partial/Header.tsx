'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import React from 'react'
import navigation from '../../../json/navigation.json'
import useCollapse from '../../../store/useCollapse';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useNav from '../../../store/useNav';
import CollapsibleComponent from './CollapsibleComponent';

const Header: React.FC = () => {
  const { status, setOn, setOff } = useCollapse();
  const { setNav } = useNav();

  const handle = (e: any) => {
    const data: boolean = e.target.checked;
    data === true ? setOn() : setOff();
  }


 

  let menu = ((navigation: any) => {
    return navigation.map((item: any) => {
      return item.Name !== 'Account' ? (
        <Link
          key={item.Link}
          href={"/" + item.Link}
          onClick={() => setNav(item.Link)}
          className='transition ease-in-out duration-500 col-span-1 flex flex-col justify-center item-center p-2 hover:bg-lime-500 cursor-pointer h-[8vh]'
        >
          <Icon icon={item.icon} className='w-[100%] h-[30px] text-lime-950' />
          <div>
            <span className='w-[100%] flex justify-center headLabel'>{item.Name}</span>
          </div>
        </Link>
      ) : (
        <CollapsibleComponent key={item.Link} title="Account" icon="mdi:account-tie">
          <div className='flex flex-wrap bg-[#f1f1f1] absolute w-[300px] my-2 portrait:my-5 portrait:w-[100vw] portrait:left-0 portrait:right-0 portrait:mx-auto'>
            <ul className='flex flex-wrap flex-col bg[#f1f1f1] w-[300px] portrait:w-[100%] left-0 mx-auto' >
              <li className='p-2 hover:bg-lime-500'>Profile</li>
              <li className='p-2 hover:bg-lime-500'>My Orders</li>
              <li className='p-2 hover:bg-lime-500'>Likes</li>
              <li className='p-2 hover:bg-lime-500'>Logout</li>
            </ul>
          </div>
        </CollapsibleComponent>
      )
    });
  });

  return (
    <nav className='flex flex-wrap flex-row h-[8vh] w-[100vw] lg:w-[100vw]'>
      <div className='grid grid-cols-9 w-[100%]'>
        <label htmlFor='sideCollapser' className='lg:col-span-2 col-span-2 logo'>
          <input type="checkbox" defaultChecked={status} id='sideCollapser' onChange={(e: any) => handle(e)} className="hidden" />
        </label>
        {menu(navigation)}
        <div className='lg:col-span-2 col-span-2'></div>
      </div>
    </nav>
  )
}

export default Header;
