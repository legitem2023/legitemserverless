'use client'
import { useMutation, useQuery } from "@apollo/client";
import { useState, useRef,useEffect } from "react";
import BackButton from "./UI/BackButton";
import { READ_ORDERS } from "./graphql/queries/queries";

import ReusableAccordion from "./UI/ReusableAccordion";

export default function NewOrder() {
 const { data: orders, loading: ordersLoading, error: orderError,refetch } = useQuery(READ_ORDERS, {
    variables: { emailAddress: "Legitem2023@gmail.com" },
  });
if(ordersLoading) return;
console.log(orders.readGroupedOrderHistory);

  return (
  <>
    <div className="max-w-md mx-auto shadow-md bg-[#f1f1f1]">
          {  orders.readGroupedOrderHistory.map((item:any,idx:number) => (
<div key={idx}>
  <ReusableAccordion title={item.OrderNo} content={[{ label: "OrderStatus:", value: item.OrderStatus},
                { label: "Address:", value: item.Address},
                { label: "Contact:", value: item.Contact}].map((field, index) => (
                <div key={index} className="flex p-[2px]">
                  <div className="font-bold w-[70px] flex-shrink-0">
                    {field.label}
                  </div>
                  <div className="truncate overflow-hidden text-ellipsis whitespace-nowrap">
                    {field.value}
                  </div>
                </div>
              ))}/>
   
</div>
))  }
    </div>
  </>
  );
  }