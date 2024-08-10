'use client'
import React from 'react'
import Tabs from '../Partial/Tabs';

const Account:React.FC = () => {
  const tabs = [
    { label: 'Profile', content: <div>Content for Tab 1</div> },
    { label: 'Address Book', content: <div>Content for Tab 2</div> },
    { label: 'My Orders', content: <div>Content for Tab 3</div> },
    { label: 'Wish List', content: <div>Content for Tab 3</div> },
  ];
  return (
    <div className="p-8 w-[55.56vw]">
    <Tabs tabs={tabs} />
  </div>
  )
}

export default Account