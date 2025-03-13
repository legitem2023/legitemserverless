import React from 'react'
import {GET_CATEGORY, GET_PRODUCT_TYPES, GET_BRANDS } from '../graphql/queries/queries';
import { useSelector,useDispatch } from 'react-redux';
import { setTypes, setBrands, setDepartments,setCategories } from "../Redux/categorySlice";
import { useQuery } from '@apollo/client';
import Select from './Select';
const CategorySelect = () => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state:any)=>state.category.categories);
  const selectedType = useSelector((state:any)=>state.category.types);
  const selectedBrand = useSelector((state:any)=>state.category.brands);

  const { data:Category, loading:Category_loading } = useQuery(GET_CATEGORY);
  const { data:Product_Type,loading:Product_loading } = useQuery(GET_PRODUCT_TYPES);
  const { data:Brands,loading:Brand_loading } = useQuery(GET_BRANDS);

  if(Category_loading) return ;
  if(Product_loading) return ;
  if(Brand_loading) return ;

 const CollapsibleCategory = () =>{
    return Category?.getCategory?.map((item: any) => {
        return {
            "Value": item.Name,
            "Text": item.Name
        }
    })
 }

 const CollapsibleProductType = () =>{
    return Product_Type?.getProductTypes?.map((item: any) => {
        return {
            "Value": item.Name,
            "Text": item.Name
        }
    })
 }

 const CollapsibleBrandName = () =>{
    return Brands?.getBrand?.map((item: any) => {
        return {
            "Value": item.Name,
            "Text": item.Name
        }
    })
 }

 const CollapsiblePages = () =>{
  const data = [{"Name":"20"},{"Name":"50"},{"Name":"100"}];
  return data.map((item:any)=>{
      return {
          "Value":item.Name,
          "Text":item.Name
      }
  })
}

  return (
        <div className="flex-1 flex flex-wrap relative p-2">
          <select name={Name} value={Selected} onChange={function_event} className="p-2 text-[13px] text-[#000000] w-full">
            <option value="">{InitialText}</option>
             {CollapsibleCategory()?.map((item, idx) => (
            <option key={idx} value={item.Value}>
          {item.Text}
           </option>
      ))}
    </select>
        </div>
  )
}

export default CategorySelect
