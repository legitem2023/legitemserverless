"use client";
import { useQuery } from "@apollo/client";
import { useDispatch, useSelector } from 'react-redux';
import {setActiveIndex} from './Redux/activeIndexSlice';
import { setActiveIndex as Index2 } from "./Redux/swipeSlice";
import { setTypes, setBrands, setDepartments,setCategories,setStatus,setName,setID} from "./Redux/categorySlice";
import {autoScrollTop} from "./utils"
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



  const handleEdit = (id:any) => {
autoScrollTop();
const filter = data.getChildInventory?.filter((item: any) => item.id === id);
// Unang dispatch para sa Index2
dispatch(Index2(2));
// Gamitin ang na-filter na data kung available ito
if (filter?.length) {
    dispatch(setTypes([filter[0].productType || "Select Types"]));
    dispatch(setBrands([filter[0].brandname || "Select Brand"]));
    dispatch(setDepartments([filter[0].department || "Select Department"]));
    dispatch(setCategories([filter[0].category || "Select Category"]));
    dispatch(setStatus([filter[0].status || "Select Status"]));
    dispatch(setName(filter[0].name || [""]));
    dispatch(setID(filter[0].id || [""]));
} else {
    dispatch(setTypes(["Select Types"]));
    dispatch(setBrands(["Select Brand"]));
    dispatch(setDepartments(["Select Department"]));
    dispatch(setCategories(["Select Category"]));
    dispatch(setStatus(["Select Status"]));
    dispatch(setName([""]));
    dispatch(setID([""]));
}

  };
  const handleDelete = () => alert("Delete Clicked!");

  const handleDetail = (item:any) => {
    dispatch(setStyleCode(item));
    dispatch(setActiveIndex(1));
  }
 
  return (
    <>
        <div className="flex flex-col w-full min-w-0 bg-[#f1f1f1] shadow-md mb-2">
          <div className="flex-1 flex flex-wrap relative p-2 font-bold">Filter Products</div>
          <hr></hr>
          <div className="flex-1 flex relative p-2">
            <input type="text" name="search" list="searchList" className="p-2 text-[13px] text-[#000000] w-full" placeholder="Search..."/>
             <datalist id="searchList">
               <option value="A"></option> 
               <option value="B"></option>
             </datalist>          
          </div>
          <Sortings/>
          <div className="flex-1 flex relative p-2">
            <button onClick={()=> dispatch(Index2(1))}  className="flex justify-center items-center p-2 rounded-md bg-[#451b05] text-[#ffffff] shadow-lg m-2">New Product</button>
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
