"use client";
import { useQuery } from "@apollo/client";
import { GET_CHILD_INVENTORY } from "./queries";
import { Icon } from "@iconify/react";

const Products = () => {
  /* const { data, loading, error } = useQuery(GET_CHILD_INVENTORY); */

  return (
    <div className="flex w-full">
      <div className="grow flex flex-col w-full shadow-md bg-[#f1f1f1] text-[#000000] text-[15px] rounded-sm p-2">
        <div className="p-1 flex flex-row">ID :</div>
        <div className="p-1 flex flex-row">Name :</div>
        <div className="p-1 flex flex-row">Product Type:</div>
        <div className="p-1 flex flex-row">Brandname :</div>
        <div className="p-1 flex flex-row">Status :</div>
      </div>
      <div className="grow-0">
        <div className="p-1 flex flex-col">
          <Icon icon="mage:edit" className="text-[25px] m-1 text-[#ffee8f]" />
          <Icon icon="mdi:delete" className="text-[25px] m-1 text-[#e81515]" />
        </div>
      </div>
    </div>
  );
};

export default Products;
