"use client";
import { useQuery } from "@apollo/client";
import { GET_CHILD_INVENTORY } from "./queries";

const Products = () => {
  const { data, loading, error } = useQuery(GET_CHILD_INVENTORY);

  if (loading) return <p>Loading...</p>;
  if (error) return;

console.log(data);
  return (
    <div className="flex w-full" >
      <div className="flex flex-col w-full shadow-md bg-[#f1f1f1]">
        <div className="p-2">ID :</div>
        <div className="p-2">Name :</div>
        <div className="p-2">Product Type:</div>
        <div className="p-2">Brandname :</div>
        <div className="p-2">Status :</div>
        <div className="p-2">Action :</div>
      </div>
    </div>
  );
};

export default Products;
