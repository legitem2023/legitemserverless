"use client";
import { useQuery } from "@apollo/client";
import { GET_CHILD_INVENTORY } from "./graphql/queries/queries";
import { Icon } from "@iconify/react";
import Loading from "./Loading";
const Products = () => {
  const { data, loading, error } = useQuery(GET_CHILD_INVENTORY);
 if(loading) return <Loading/>

  return (
    <>{
      data.getChildInventory?.map((item:any,idx:number)=>(
      <div key={idx} className="flex flex-row w-full bg-[#f1f1f1] shadow-md mb-2">
      <div className="grow flex flex-col w-full text-[#000000] text-[15px] rounded-sm p-2">
        <div className="p-1 flex flex-row">{item.id}</div>
        <div className="p-1 flex flex-row"><b>{item.name}</b></div>
        <div className="p-1 flex flex-row">{item.productType}</div>
        <div className="p-1 flex flex-row"><b>{item.brandname}</div>
        <div className="p-1 flex flex-row">For Men</div>
        <div className="p-1 flex flex-row">Status</div>
      </div>
      <div className="grow-0">
        <div className="p-1 flex flex-col">
          <Icon icon="mage:edit" className="text-[25px] m-1 text-[#ffee8f]" />
          <Icon icon="mdi:delete" className="text-[25px] m-1 text-[#e81515]" />
          <Icon icon="carbon:folder-details" className="text-[25px] m-1 text-[#000000]" />
        </div>
      </div>
    </div>  
      ))
    }
    
    </>
  );
};

export default Products;
