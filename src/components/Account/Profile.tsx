import React from 'react'
import Titlebar from '../UI/Titlebar'
import Image from 'next/image'

const Profile = () => {
  return (
    <div className='w-[100%]'>
        <Titlebar title="Profile" Icons='ic:baseline-account-circle'/>
        <div className='grid grid-cols-3'>
          <div>
            <Image className='m-5' src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 3c2.21 0 4 1.79 4 4s-1.79 4-4 4s-4-1.79-4-4s1.79-4 4-4m4 10.54c0 1.06-.28 3.53-2.19 6.29L13 15l.94-1.88c-.62-.07-1.27-.12-1.94-.12s-1.32.05-1.94.12L11 15l-.81 4.83C8.28 17.07 8 14.6 8 13.54c-2.39.7-4 1.96-4 3.46v4h16v-4c0-1.5-1.6-2.76-4-3.46'/%3E%3C/svg%3E" alt='1' width={200} height={200}/>
          </div>
          <div>
            <div>Name</div>
          </div>
          <div></div>
          <div className='col-span-3 bg-[#3f6212]'>dddd</div>
        </div>
    </div>
  )
}

export default Profile