'use client'
import { useMutation, useQuery } from "@apollo/client";

import { useState, useRef,useEffect } from "react";

import { READ_ORDERS } from "./graphql/queries/queries";
export default function NewOrder() {
 const { data: orders, loading: ordersLoading, error: orderError,refetch } = useQuery(READ_ORDERS, {
    variables: { emailAddress: useEmail },
  });  
  

  return (
<>
   <BackButton/>
    <div className="max-w-md mx-auto shadow-md bg-[#f1f1f1]">
          
    </div>
</>
  );
  }