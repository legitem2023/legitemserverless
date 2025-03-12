"use client";
import { useQuery } from "@apollo/client";
import { useDispatch, useSelector } from 'react-redux';
import {setStyleCode} from './Redux/styleCodeSlice';
import { useState } from 'react'
import { GET_CHILD_INVENTORY } from "./graphql/queries/queries";
import { Icon } from "@iconify/react";
import Loading from "./Loading";
import Detailed from "./Detailed";
import DropdownButton from "./UI/DropdownButton"
const Products = () => {
  const dispatch = useDispatch();
  const [useSlide,setSlide] = useState(false);
  const { data, loading, error } = useQuery(GET_CHILD_INVENTORY);
 if(loading) return <Loading/>
const handleEdit = () => alert("Edit Clicked!");
const handleDelete = () => alert("Delete Clicked!");

const handleDetail = (item:any) => {
  dispatch(setStyleCode(item));
}
 
  return (
    <>{
      data.getChildInventory?.map((item:any,idx:number)=>(
      <div key={idx} className="flex flex-row w-full bg-[#f1f1f1] shadow-md mb-2">
  
      <div className="grow flex flex-col w-full text-[#000000] text-[12px] rounded-sm p-2">
        <div className="p-1 flex flex-row">
          <div className="font-bold w-[100px]">Name</div>
          <div>{item.name}</div>
        </div>
        <div className="p-1 flex flex-row">
          <div className="font-bold w-[100px]" >Type</div>
          <div>{item.productType}</div>
        </div>
        <div className="p-1 flex flex-row">
         <div className="font-bold w-[100px]">Brand</div>
          <div>{item.brandname}</div>
        </div>
        <div className="p-1 flex flex-row">
         <div className="font-bold w-[100px]">Department</div>
         <div>For Men</div>
        </div>
        <div className="p-1 flex flex-row">
          <div className="font-bold w-[100px]">Status</div>
          <div>Active</div>
        </div>
      </div>
      <div className="grow-0">
        <div className="p-1 flex flex-col">
          <DropdownButton
           options={[
             { id:item.id,label: "Edit", onClick: handleEdit },
             { id:item.id,label: "Delete", onClick: handleDelete },
          ]}
          />
          
          <Icon icon="carbon:folder-details" className="text-[25px] m-1 text-[#000000]" onClick={()=>{handleDetail(item.style_Code)}}/>
        </div>
      </div>
    </div>  
      ))
    }
    </>
  );
};

export default Products;
