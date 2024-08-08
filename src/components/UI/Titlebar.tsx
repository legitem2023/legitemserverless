import React from 'react'
type MyComponentProps = {
    title: string;
  };
  
const Titlebar:React.FC<MyComponentProps> = ({title}) => {
  return (
    <div className='flex flex-col justify-center p-2'>{title}</div>
  )
}

export default Titlebar