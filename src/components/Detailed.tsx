"use client";
import { useQuery } from "@apollo/client";
import { useSelector,useDispatch } from "react-redux";
import {setActiveIndex} from './Redux/activeIndexSlice';
import { GET_CHILD_INVENTORY_DETAIL } from "./graphql/queries/queries";
import Loading from "./Loading";
import DropdownButton from "./UI/DropdownButton";

const Detailed = () => {
  const Dispatch = useDispatch();
  const styleCode = useSelector((state: any) => state.styleCode.styleCode);
  const { data, loading } = useQuery(GET_CHILD_INVENTORY_DETAIL, {
    variables: { styleCode },
  });

if (loading) return <Loading/>
const handleEdit = () => alert("Edit Clicked!");
const handleDelete = () => alert("Delete Clicked!");

  return (
    <div className="w-full mb-2">
      {data?.getChildInventory_details?.map((item: any, idx: number) => (
        <div key={idx} className="bg-[#f1f1f1] shadow-md p-3 rounded-sm flex items-start space-x-3 mb-2">
          {/* Image */}
          <div className="flex-shrink-0">
            <img src={item.thumbnail} alt={item.name} className="w-[75px] h-[75px] object-cover rounded" />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-2 text-[12px] text-[#000] flex-grow">
            <div className="flex flex-row">
              <div className="font-bold w-[55px]">Name:</div> <div className="overflow-hidden whitespace-nowrap text-ellipsis">{item.name}</div>
            </div>
            <div className="flex flex-row">
              <div className="font-bold w-[55px]">Color:</div> <div className="overflow-hidden whitespace-nowrap text-ellipsis"  >{item.color}</div>
            </div>
            <div className="flex flex-row">
              <div className="font-bold w-[55px]">Size:</div> <div className="overflow-hidden whitespace-nowrap text-ellipsis" >{item.size}</div>
            </div>
            <div className="flex flex-row">
              <div className="font-bold w-[55px]">Price:</div> <div className="overflow-hidden whitespace-nowrap text-ellipsis" >{item.price}</div>
            </div>
            <div className="flex flex-row">
              <div className="font-bold w-[55px]">Stock:</div> <div className="overflow-hidden whitespace-nowrap text-ellipsis"  >{item.stock}</div>
            </div>
            <div className="flex flex-row">
              <div className="font-bold w-[55px]">Status:</div> <div className="overflow-hidden whitespace-nowrap text-ellipsis" >{item.status}</div>
            </div>
          </div>
          <div className="">
        <div className="p-1 flex flex-col">
          <DropdownButton
           options={[
             { id:item.id,label: "Edit", onClick: handleEdit },
             { id:item.id,label: "Delete", onClick: handleDelete },
          ]}
          />
        </div>
      </div>
        </div>
      ))}
    </div>
  );
};

export default Detailed;
