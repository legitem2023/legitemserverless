"use client";
import { useQuery } from "@apollo/client";
import { GET_CHILD_INVENTORY } from "./queries";

const Products = () => {
  const { data, loading, error } = useQuery(GET_CHILD_INVENTORY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

console.log(data)
  return (
    <div>
      
    </div>
  );
};

export default Products;
