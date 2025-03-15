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
   <BackButton/>
    <div className="max-w-md mx-auto shadow-md bg-[#f1f1f1]">
          {  orders.readGroupedOrderHistory.map((item:any,idx:number) => (
<div key={idx}>
  <ReusableAccordion title={item.OrderNo} content=""/>
</div>
))  }
    </div>
  </>
  );
  }