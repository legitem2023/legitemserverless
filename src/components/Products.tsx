"use client";
import { useQuery } from "@apollo/client";
import { useDispatch, useSelector } from 'react-redux';
import {setActiveIndex} from './Redux/activeIndexSlice';
import {setStyleCode} from './Redux/styleCodeSlice';
import { useState } from 'react'
import { GET_CHILD_INVENTORY } from "./graphql/queries/queries";
import { Icon } from "@iconify/react";
import Loading from "./Loading";
import Detailed from "./Detailed";
import DropdownButton from "./UI/DropdownButton"
import Sortings from './UI/Sortings';
const Products = () => {
  const dispatch = useDispatch();
  const [useSlide,setSlide] = useState(false);
  const { data, loading, error } = useQuery(GET_CHILD_INVENTORY);
  
  if(loading) return <Loading/>

  const handleEdit = () => alert("Edit Clicked!");
  const handleDelete = () => alert("Delete Clicked!");

  const handleDetail = (item:any) => {
    dispatch(setStyleCode(item));
    dispatch(setActiveIndex(1));
  }
 
  return (
    <>
        <div className="flex flex-col w-full min-w-0 bg-[#f1f1f1] shadow-md mb-2">
          <div className="flex-1 flex relative p-2">
            <input type="text" name="search" list="searchList" className="p-2 text-[13px] text-[#000000] w-full" placeholder="Search..."/>
             <datalist id="searchList">
               <option value="A"></option> 
               <option value="B"></option>
             </datalist>          
          </div>
          <Sortings/>
          <div className="flex-1 flex flex-wrap relative p-2">
            <select className="p-2 text-[13px] text-[#000000] w-full my-2">
              <option>Category</option>
            </select>
            <select className="p-2 text-[13px] text-[#000000] w-full my-2">
              <option>Type</option>
            </select>
            <select className="p-2 text-[13px] text-[#000000] w-full my-2">
              <option>Brand</option>
            </select>
            <select className="p-2 text-[13px] text-[#000000] w-full my-2">
              <option>Department</option>
            </select>
          </div>
        </div>
      {data.getChildInventory?.map((item:any,idx:number) => (
        // Added min-w-0 to product container
        <div key={idx} className="flex flex-row w-full min-w-0 bg-[#f1f1f1] shadow-md mb-2">
          {/* Left Section - Product Info */}
         
          <div className="flex flex-col gap-2 text-[12px] text-[#000] flex-grow min-w-0 p-2">
            {[
              { label: "Name:", value: item.name },
              { label: "Category:", value: item.category },
              { label: "Type:", value: item.productType },
              { label: "Brand:", value: item.brandname },
              { label: "Department:", value:"For Men" },
              { label: "Status:", value: item.status },
            ].map((field, index) => (
              <div key={index} className="flex min-w-0">
                <div className="font-bold w-[75px] flex-shrink-0">{field.label}</div>
                <div className="overflow-hidden whitespace-nowrap text-ellipsis min-w-0">
                  {field.value}
                </div>
              </div>
            ))}
          </div>
          
          {/* Right Section - Actions */}
          <div className="grow-0">
            <div className="p-1 flex flex-col">
              <DropdownButton
                options={[
                  { id:item.id,label: "Edit", onClick: handleEdit },
                  { id:item.id,label: "Delete", onClick: handleDelete },
                ]}
              />
              <Icon 
                icon="carbon:folder-details" 
                className="text-[25px] m-1 text-[#000000]" 
                onClick={() => handleDetail(item.style_Code)}
              />
            </div>
          </div>
        </div>  
      ))}
    </>
  );
};

export default Products;
