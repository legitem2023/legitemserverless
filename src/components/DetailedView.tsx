"use client";

import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { GET_CHILD_INVENTORY_DETAIL } from "./graphql/queries/queries";
import SwiperGallery from "./SwiperGallery";
import Loading from "./Loading";

const DetailedView = () => {
  const styleCode = useSelector((state: any) => state.styleCode.styleCode);

  const { data, loading } = useQuery(GET_CHILD_INVENTORY_DETAIL, {
    variables: { styleCode },
  });

  if (loading) return <Loading />;

  return (
    <div className="w-full space-y-2">
      {data?.getChildInventory_details?.map((item: any, idx: number) => (
        <div
          key={idx}
          className="flex flex-col items-center w-full bg-[#f1f1f1] shadow-md rounded-md p-[2px] gap-y-2"
        >
          {/* Swiper Gallery */}
          <div className="w-full md:max-w-[200px] p-[2px]">
            <SwiperGallery
              images={item?.subImageFieldOut?.map((img: any) => img.ImagePath)}
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col w-full text-[12px] text-[#000] min-w-0 p-[2px]">
            {[
              { label: "Name:", value: item.name },
              { label: "Color:", value: item.color },
              { label: "Size:", value: item.size },
              { label: "Price:", value: item.price },
              { label: "Stock:", value: item.stock },
              { label: "Status:", value: item.status },
            ].map((field, index) => (
              <div key={index} className="flex p-[2px]">
                <div className="font-bold w-[70px] flex-shrink-0">{field.label}</div>
                <div className="truncate overflow-hidden text-ellipsis whitespace-nowrap">
                  {field.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailedView;