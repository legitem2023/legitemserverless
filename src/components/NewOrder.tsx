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
  <ReusableAccordion title={item.OrderNo} content={(<div key={index} className="flex p-[2px]">
<div className="font-bold w-[70px] flex-shrink-0">Status</div>
<div className="truncate overflow-hidden text-ellipsis whitespace-nowrap">
 {item.OrderStatus}</div>
<div>{item.OrderHistory.map((hisItem:any,index:number) => (
<div key={index}>
<div className="font-bold w-[70px] flex-shrink-0">{hisItem.Color}</div>

<div className="font-bold w-[70px] flex-shrink-0">{hisItem.Size}</div>

<div className="font-bold w-[70px] flex-shrink-0">{hisItem.Price}</div>

<div className="font-bold w-[70px] flex-shrink-0">{hisItem.Quantity}</div>


))}</div>

                </div>)}/>
</div>
))  }
    </div>
  </>
  );
  }