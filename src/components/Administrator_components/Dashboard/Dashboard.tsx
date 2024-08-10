import Titlebar from '@/components/UI/Titlebar'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

const Dashboard = () => {
  return (
    <div>
        <div className='flex flex-1 col-span-2  flex-row w-[100%]'>
              <Titlebar title="Dashboard" Icons='mdi:cart'/>
        </div>
    </div>
  )
}

export default Dashboard