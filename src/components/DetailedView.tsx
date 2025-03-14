"use client";
import { useQuery,useMutation } from "@apollo/client";
import { useSelector,useDispatch } from "react-redux";
import {setActiveIndex} from './Redux/activeIndexSlice';
import { setActiveIndex as Index2 } from "./Redux/swipeSlice";
import { GET_CHILD_INVENTORY_DETAIL } from "./graphql/queries/queries";

import Loading from "./Loading";




const DetailedView = () => {
   
  const dispatch = useDispatch();
  const styleCode = useSelector((state: any) => state.styleCode.styleCode);
  const { data, loading } = useQuery(GET_CHILD_INVENTORY_DETAIL, {
    variables: { styleCode },
  });

  if (loading) return <Loading/>
  



  const handleDelete = (id:any) => {
      console.log(id);
    
    return;
  }
  return (
    <div className="w-full mb-2">
        <div className="flex flex-row w-full min-w-0 bg-[#f1f1f1] shadow-md mb-2">

</div>
 {data?.getChildInventory_details?.map((item: any, idx: number) => (
        <div key={idx} className="flex flex-row w-full min-w-0 bg-[#f1f1f1] shadow-md mb-2">
          {/* Image */}
          <div className="flex-shrink-0 p-2">
            <img src={item.thumbnail} alt={item.name} className="w-[150px] h-[150px] object-cover rounded" />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-2 text-[12px] text-[#000] flex-grow min-w-0 p-2">
            {[
              { label: "Name:", value: item.name },
              { label: "Color:", value: item.color },
              { label: "Size:", value: item.size },
              { label: "Price:", value: item.price },
              { label: "Stock:", value: item.stock },
              { label: "Status:", value: item.status },
            ].map((field, index) => (
              <div key={index} className="flex min-w-0">
                <div className="font-bold w-[55px] flex-shrink-0">{field.label}</div>
                <div className="overflow-hidden whitespace-nowrap text-ellipsis min-w-0">
                  {field.value}
                </div>
              </div>
            ))}
          </div>
{itwm.subImageFieldOut.map(itm:any,index:number)=>(
<div key={index}>
<div>{itm.ImagePath}</div>
</div>
)}
        </div>
      ))}
    </div>
  );
};

export default DetailedView;