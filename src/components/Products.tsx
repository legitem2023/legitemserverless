"use client";
import { useQuery } from "@apollo/client";
import { GET_CHILD_INVENTORY } from "./queries";
import { Icon } from "@iconify/react";
const Products = () => {
 /* const { data, loading, error } = useQuery(GET_CHILD_INVENTORY);*/


  return (
    <div className="flex w-full" >
      <div className="flex flex-col w-full shadow-md bg-[#f1f1f1] text-[#000000]">
        <div className="p-2 flex flex-row">ID :</div>
        <div className="p-2 flex flex-row">Name :</div>
        <div className="p-2 flex flex-row ">Product Type:</div>
        <div className="p-2 flex flex-row ">Brandname :</div>
        <div className="p-2 flex flex-row ">Status :</div>
        <div className="p-2 flex flex-row ">Action :
<Icon icon="mage:edit" className="text-[25px]"/>

<Icon icon="mdi:delete" className="text-[25px]"/> 
</div>
      </div>
    </div>
  );
};

export default Products;
