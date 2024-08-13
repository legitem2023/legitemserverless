import React from 'react'
import Titlebar from '../UI/Titlebar'
import HorizontalTabs from '../Partial/HorizontalTabs'
import Profile from './Profile';
import AddressBook from './AddressBook';
import WishList from './WishList';

const MyOrder = () => {
  const tabs = [
    { icon: 'mdi:new-box', label: 'New Order', content: <></> },
    { icon: 'tdesign:undertake-delivery', label: 'Recieved', content: <></> },
    { icon: 'line-md:confirm-square', label: 'Confirmation', content: <></> },
    { icon: 'ph:recycle-bold', label: 'Processing', content: <></> },
    { icon: 'fa6-solid:boxes-packing', label: 'Packing', content: <></> },
    { icon: 'iconamoon:delivery-fast-fill', label: 'Delivery', content: <></> },

  ];
  return (
    <div className='w-[100%]'>
        <Titlebar title="My Orders" Icons='ic:baseline-shopping-cart'/>
        <HorizontalTabs tabs={tabs}></HorizontalTabs>
    </div>
  )
}

export default MyOrder