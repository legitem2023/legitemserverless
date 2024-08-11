'use client'
import React from 'react'
import Tabs from '../Partial/Tabs';
import Profile from './Profile';
import AddressBook from './AddressBook';
import MyOrder from './MyOrder';
import WishList from './WishList';

const Account:React.FC = () => {
  const tabs = [
    { icon: 'mdi:badge-account-horizontal', label: 'Profile', content: <Profile/> },
    { icon: 'icomoon-free:address-book', label: 'Address Book', content: <AddressBook/> },
    { icon: 'mdi:border-all', label: 'My Orders', content: <MyOrder/> },
    { icon: 'mdi:star', label: 'Wish List', content: <WishList/> },
  ];
  return (
  <div className={'flex flex-wrap justify-left md:justify-center gap-0 md:w-full lg:w-[100vw] ' }>
    <Tabs tabs={tabs} />
  </div>
  )
}

export default Account