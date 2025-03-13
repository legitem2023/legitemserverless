import React from 'react'
import {GET_CATEGORY, GET_PRODUCT_TYPES, GET_BRANDS } from '../graphql/queries/queries';
import { useSelector,useDispatch } from 'react-redux';
import { setTypes, setBrands, setDepartments,setCategories } from "../Redux/categorySlice";
import { useQuery } from '@apollo/client';
import Select from './Select';
const Sortings = () => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state:any)=>state.category);
  const selectedType = useSelector((state:any)=>state.category.types);
  const selectedBrand = useSelector((state:any)=>state.category.brands);
  const selectedDepartment = useSelector((state:any)=>state.category.department);


console.log(selectedCategory,selectedType,selectedBrand);
  
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

 const CollapsibleDepartment = () =>{
  const data = [{"Name":"For Men"},{"Name":"For Women"},{"Name":"For Kids"},{"Name":"Unisex"},{"Name":"Others"}];
  return data.map((item:any)=>{
      return {
          "Value":item.Name,
          "Text":item.Name
      }
  })
}

  return (
      <div className='Search_container_grid'>
        <div className="flex-1 flex flex-wrap relative p-2">
          <Select Selected={selectedCategory} InitialText="Select Category" Name="Category" Data={CollapsibleCategory()} function_event={(e:any)=>{dispatch(setCategories(e.value))}}/>
        </div>
        <div className="flex-1 flex flex-wrap relative p-2">
          <Select Selected={selectedType} InitialText="Select Type" Name="ProductType" Data={CollapsibleProductType()} function_event={(e:any)=>{dispatch(setTypes(e.value))}}/>
        </div>
        <div className="flex-1 flex flex-wrap relative p-2">
          <Select Selected={selectedBrand} InitialText="Select Brand" Name="Brandname" Data={CollapsibleBrandName()} function_event={(e:any)=>{dispatch(setBrands(e.value))}}/>
        </div>
        <div className="flex-1 flex flex-wrap relative p-2">
          <Select Selected={selectedDepartment} InitialText="Select Department" Name="Department" Data={CollapsibleDepartment()} function_event={(e:any)=>{dispatch(setDepartments(e.value))}}/>
        </div>
      </div>
  )
}

export default Sortings
