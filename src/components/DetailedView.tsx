"use client";

import { useQuery } from "@apollo/client"; import { useSelector } from "react-redux"; import { useState } from "react"; import { GET_CHILD_INVENTORY_DETAIL } from "./graphql/queries/queries"; import SwiperGallery from "./SwiperGallery"; import Loading from "./Loading"; import BackButton from "./UI/BackButton";

const DetailedView = () => { const styleCode = useSelector((state: any) => state.styleCode.styleCode); const { data, loading } = useQuery(GET_CHILD_INVENTORY_DETAIL, { variables: { styleCode }, }); const [previewImages, setPreviewImages] = useState<string[]>([]);

const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => { if (event.target.files) { const files = Array.from(event.target.files); const previews = files.map((file) => URL.createObjectURL(file)); setPreviewImages(previews); } };

if (loading) return <Loading />;

return ( <> <BackButton /> <div className="w-full space-y-2 "> {/* Image Upload UI */} <div className="flex flex-col items-center p-4 border rounded-md shadow-md bg-white"> <input
type="file"
accept="image/*"
multiple
onChange={handleImageUpload}
className="mb-2"
/> <div className="flex flex-wrap gap-2"> {previewImages.map((src, index) => ( <img key={index} src={src} alt={preview-${index}} className="w-20 h-20 object-cover rounded-md shadow-md" /> ))} </div> </div>

{data?.getChildInventory_details?.map((item: any, idx: number) => (
      <div
        key={idx}
        className="flex flex-col items-center w-full bg-[#f1f1f1] shadow-md rounded-md p-[4px] gap-y-2 m-[2px]"
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
            { label: "Creator:", value: item.creator },
            { label: "Editor:", value: item.editor },
            { label: "Created Date:", value: item.dateCreated },
            { label: "Updated Date:", value: item.dateUpdated },
          ].map((field, index) => (
            <div key={index} className="flex p-[2px]">
              <div className="font-bold w-[70px] flex-shrink-0">
                {field.label}
              </div>
              <div className="truncate overflow-hidden text-ellipsis whitespace-nowrap">
                {field.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
</>

); };

export default DetailedView;

