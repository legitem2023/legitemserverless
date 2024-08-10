import Titlebar from '@/components/UI/Titlebar'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

const Orders = () => {
  return (
    <div>
        <div className='flex flex-1 col-span-2 flex-row align-center'>
          <Titlebar title="Orders" Icons='mdi:cart'/>
        </div>
    </div>
  )
}

export default Orders