"use client";
import { useQuery } from "@apollo/client";
import BackButton from "./UI/BackButton";
import { READ_ORDERS } from "./graphql/queries/queries";
import ReusableAccordion from "./UI/ReusableAccordion";

export default function NewOrder() {
  const { data, loading, error, refetch } = useQuery(READ_ORDERS, {
    variables: { emailAddress: "Legitem2023@gmail.com" },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.readGroupedOrderHistory) return <p>No orders found</p>;

  return (
    <div className="max-w-md mx-auto shadow-md bg-[#f1f1f1]">
      {data.readGroupedOrderHistory.map((item: any, idx: number) => (
        <div key={idx}>
          <ReusableAccordion
            title={item.OrderNo}
            content={
              <div className="flex p-[2px] flex-col">
                <div className="flex">
                  <div className="font-bold w-[70px] flex-shrink-0">Status:</div>
                  <div className="truncate overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.OrderStatus}
                  </div>
                </div>

                <div className="mt-2">
                  {item.OrderHistory.map((hisItem: any, index: number) => (
                    <div key={index} className="border-b pb-2 mb-2">
                      <div className="font-bold">Color: {hisItem.Color}</div>
                      <div className="font-bold">Size: {hisItem.Size}</div>
                      <div className="font-bold">Price: {hisItem.Price}</div>
                      <div className="font-bold">Quantity: {hisItem.Quantity}</div>
                    
<div className="font-bold">SubTotal: {hisItem.Quantity * hisItem.Price}</div>
                    </div>
                  ))}
                </div>
              </div>
            }
          />
        </div>
      ))}
    </div>
  );
}