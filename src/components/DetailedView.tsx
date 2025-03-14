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
          className="flex flex-col md:flex-row w-full bg-[#f1f1f1] shadow-md rounded-md p-3"
        >
          {/* Image Section */}
          <div className="flex-shrink-0">
            <img
              src={item.thumbnail}
              alt={item.name}
              className="w-[150px] h-[150px] object-cover rounded"
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col flex-grow text-sm text-[#000] min-w-0 px-4 py-2">
            {[
              { label: "Name:", value: item.name },
              { label: "Color:", value: item.color },
              { label: "Size:", value: item.size },
              { label: "Price:", value: item.price },
              { label: "Stock:", value: item.stock },
              { label: "Status:", value: item.status },
            ].map((field, index) => (
              <div key={index} className="flex">
                <div className="font-bold w-[60px] flex-shrink-0">{field.label}</div>
                <div className="truncate">{field.value}</div>
              </div>
            ))}
          </div>

          {/* Swiper Gallery */}
          <div className="w-full md:w-[200px] mt-3 md:mt-0">
            <SwiperGallery
              images={item?.subImageFieldOut?.map((img: any) => img.ImagePath)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailedView;