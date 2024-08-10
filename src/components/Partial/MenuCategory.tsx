import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import CategoryData from '../../../json/category.json'
import useCategory from '../../../store/useCategory'
const Category:React.FC = () => {
    const {setText} = useCategory();
    const trigger = (param:string) =>{
        setText(param);
    }
  return (
    <div className="w-full">
    <input type="checkbox" id="collapse-toggle" className="hidden-checkbox peer hidden"/>
    <label htmlFor="collapse-toggle" className="transition ease-in-out flex flex-row align-center">
      <div className='flex flex-col justify-center p-2'><Icon icon='bxs:category'/></div>
      <div className='flex flex-col justify-center'>Category</div>
    </label>
    <div className="overflow-hidden transition-all max-h-0 peer-checked:max-h-screen duration-500 ease-in-out">
        <ul>
        {
            CategoryData.map((item:any,idx:number)=>(
                <li key={idx} className='transition ease-in-out duration-500 flex-1 flex flex-row align-center hover:bg-lime-700 hover:text-[#ffffff] cursor-pointer p-2' onClick={()=>trigger(item.Name)}>
                    <div className='flex flex-col justify-center p-2'><Icon icon={item.icon}/></div>
                    <div className='flex flex-col justify-center'>{item.Name}</div></li>
            ))
        }
        </ul>
    </div>
  </div>
  )
}

export default Category