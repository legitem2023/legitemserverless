"use client";
import { useQuery } from '@apollo/client';
import { GET_CATEGORY, GET_CHILD_INVENTORY } from './queries';
const Products = () =>{
const { data: ProductsData, loading: productsLoading, error: productsError } = useQuery(GET_CHILD_INVENTORY);
if(productsLoading) return
  return (
    <>{
      ProductsData?.getChildInventory.map((item:any,idx:number)=>(
        <div key={index}></div>
      ))
    }
    </>
  )
}
export default Products;
