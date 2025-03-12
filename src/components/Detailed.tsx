"use client";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { GET_CHILD_INVENTORY_DETAIL } from "./graphql/queries/queries";
import Loading from "./Loading";
import DropdownButton from "./UI/DropdownButton";

const Detailed = () => {
  const styleCode = useSelector((state: any) => state.styleCode.styleCode);
  const { data, loading } = useQuery(GET_CHILD_INVENTORY_DETAIL, {
    variables: { styleCode },
  });

  if (loading) return;
const handleEdit = () => alert("Edit Clicked!");
const handleDelete = () => alert("Delete Clicked!");

  return (
    <div className="w-full space-y-2">
      {data?.getChildInventory_details?.map((item: any, idx: number) => (
        <div key={idx} className="bg-[#f1f1f1] shadow-md p-3 rounded-md flex items-start space-x-3">
          {/* Image */}
          <div className="flex-shrink-0">
            <img src={item.thumbnail} alt={item.name} className="w-[75px] h-[75px] object-cover rounded" />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-2 text-[12px] text-[#000] flex-grow">
            <div>
              <span className="font-bold">Name:</span> {item.name}
            </div>
            <div>
              <span className="font-bold">Color:</span> {item.color}
            </div>
            <div>
              <span className="font-bold">Size:</span> {item.size}
            </div>
            <div>
              <span className="font-bold">Price:</span> {item.price}
            </div>
            <div>
              <span className="font-bold">Stock:</span> {item.stock}
            </div>
            <div>
              <span className="font-bold">Status:</span> {item.status}
            </div>
            <div>
              <span className="font-bold">Editor:</span> {item.editor}
            </div>
            <div>
              <span className="font-bold">Date Created:</span> {item.dateCreated}
            </div>
            <div>
              <span className="font-bold">Date Updated:</span> {item.dateUpdated}
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
