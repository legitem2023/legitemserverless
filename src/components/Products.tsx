"use client";
import { useQuery } from "@apollo/client";
import { useDispatch, useSelector } from 'react-redux';
import { setActiveIndex } from './Redux/activeIndexSlice';
import { setStyleCode } from './Redux/styleCodeSlice';
import { useState } from 'react'
import { GET_CHILD_INVENTORY } from "./graphql/queries/queries";
import { Icon } from "@iconify/react";
import Loading from "./Loading";
import Detailed from "./Detailed";
import DropdownButton from "./UI/DropdownButton"

const Products = () => {
  const dispatch = useDispatch();
  const [useSlide, setSlide] = useState(false);
  const { data, loading, error } = useQuery(GET_CHILD_INVENTORY);
  
  if (loading) return <Loading />;

  const handleEdit = () => alert("Edit Clicked!");
  const handleDelete = () => alert("Delete Clicked!");

  const handleDetail = (item: any) => {
    dispatch(setStyleCode(item));
    dispatch(setActiveIndex(1));
  }

  return (
    <>
      {data.getChildInventory?.map((item: any, idx: number) => (
        <div key={idx} className="flex w-full bg-[#f1f1f1] shadow-md mb-2 min-w-0">
          {/* Details Container */}
          <div className="flex flex-col flex-grow min-w-0 p-2 text-[12px]">
            {[
              { label: "Name", value: item.name },
              { label: "Type", value: item.productType },
              { label: "Brand", value: item.brandname },
              { label: "Department", value: "For Men" },
              { label: "Status", value: "Active" },
            ].map((field, index) => (
              <div key={index} className="flex p-1 min-w-0">
                <div className="font-bold w-[100px] flex-shrink-0 pr-2">
                  {field.label}
                </div>
                <div className="overflow-hidden whitespace-nowrap text-ellipsis min-w-0">
                  {field.value}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col flex-shrink-0 p-1 self-start">
            <DropdownButton
              options={[
                { id: item.id, label: "Edit", onClick: handleEdit },
                { id: item.id, label: "Delete", onClick: handleDelete },
              ]}
            />
            <Icon 
              icon="carbon:folder-details" 
              className="text-[25px] m-1 text-[#000000] cursor-pointer"
              onClick={() => handleDetail(item.style_Code)}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default Products;
