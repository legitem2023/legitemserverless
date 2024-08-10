import { Icon } from '@iconify/react/dist/iconify.js';
import React from 'react'
type MyComponentProps = {
    title: string;
    Icons:string
  };
  
const Titlebar:React.FC<MyComponentProps> = ({title,Icons}) => {
  return (
    <div className='flex flex-1 p-1 border-b-4 border-t-4 border-solid col-span-2 border-lime-800 flex-row align-center bg-gradient-to-r from-lime-500 via-lime-700 to-lime-800 w-[100%]'>
      <div className='flex flex-col justify-center p-1'><Icon icon={Icons} /></div>
      <div className='flex flex-col justify-center p-1'>{title}</div>
    </div>
    
  )
}

export default Titlebar