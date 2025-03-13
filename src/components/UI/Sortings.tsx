import React from 'react'
import {GET_CATEGORY, GET_PRODUCT_TYPES, GET_BRANDS } from 'graphql/queries/queries';

import { useQuery } from '@apollo/client';
import Select from './Select';
const Sortings = () => {

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
    <div className='Search_container'>
      <div className='Search_container_grid'>
        <div className='SortColumn'>
          <input type='text' placeholder='Search By Name' onChange={(e:any)=>{}}></input>
        </div>
        <div className='SortColumn'>
          <Select Selected={productCategory} InitialText="Select Category" Name="Category" Data={CollapsibleCategory()} function_event={(e:any)=>{}}/>
        </div>
        <div className='SortColumn'>
          <Select Selected={productType} InitialText="Select Product Type" Name="ProductType" Data={CollapsibleProductType()} function_event={(e:any)=>{}}/>
        </div>
        <div className='SortColumn'>
          <Select Selected={productBrand} InitialText="Select Product Brand" Name="Brandname" Data={CollapsibleBrandName()} function_event={(e:any)=>{}}/>
        </div>
      </div>
    </div>
  )
}

export default Sortings
