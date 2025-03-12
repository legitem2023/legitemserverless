"use client";
import { useQuery } from "@apollo/client";
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react'
import { GET_CHILD_INVENTORY_DETAIL } from "./graphql/queries/queries";
import { Icon } from "@iconify/react";
import Loading from "./Loading";
import DropdownButton from "./UI/DropdownButton"
const Detailed = () => {
  const styleCode = useSelector((state: any) => state.styleCode.styleCode);
  console.log(styleCode);
  const [useSlide,setSlide] = useState(false);
  const { data, loading, error } = useQuery(GET_CHILD_INVENTORY_DETAIL,{
    variables :{
       styleCode:styleCode
    }
  });
 if(loading) return <Loading/>
const handleEdit = () => alert("Edit Clicked!");
const handleDelete = () => alert("Delete Clicked!"); 
  return (
    <>{
        
      data.getChildInventory_details?.map((item:any,idx:number)=>(
     <div key={idx} className="flex flex-row w-full bg-[#f1f1f1] shadow-md mb-2">
        <div className="grow flex flex-col w-full text-[#000000] text-[12px] rounded-sm p-2">
          <div className="p-1 flex flex-row">
            <div className="font-bold w-[100px]">
             <img src={item.thumbnail} className="w-[75px] h-[75px]"/>
            </div>
            <div className="font-bold w-[100px]" >
            yyyy
            </div>
            <div className="font-bold w-[100px]" ></div>

          </div>
        </div>
        <div className="grow-0"></div>
      </div>  
      ))
    }
    </>
  );
};

export default Detailed;
