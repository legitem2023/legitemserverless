import React from 'react'
import {GET_CATEGORY } from '../graphql/queries/queries';
import { useSelector,useDispatch } from 'react-redux';
import { setCategories } from "../Redux/categorySlice";
import { useQuery } from '@apollo/client';

const CategorySelect = () => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state:any)=>state.category.categories);
  
  const { data:Category, loading:Category_loading } = useQuery(GET_CATEGORY);
  
  if(Category_loading) return ;
  
  return (
        <div className="flex-1 flex flex-wrap relative p-2">
          <select name={Name} value={Selected} onChange={function_event} className="p-2 text-[13px] text-[#000000] w-full">
            <option value="">{InitialText}</option>
            { Category?.getCategory?.map((item, idx) => (
            <option key={idx} value={item.Value}>
          {item.Text}
           </option>
      ))}
    </select>
        </div>
  )
}

export default CategorySelect
