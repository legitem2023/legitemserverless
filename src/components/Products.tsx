"use client";
import { useQuery } from "@apollo/client";
import { GET_CHILD_INVENTORY } from "./queries";

const Products = () => {
  const { data: ProductsData, loading: productsLoading, error: productsError } = useQuery(GET_CHILD_INVENTORY);

  if (productsLoading) return <p>Loading...</p>;
  if (productsError) return <p>Error: {productsError.message}</p>;

  return (
    <>
      {ProductsData?.getChildInventory.map((item: any, idx: number) => (
        <div key={idx}>{/* I-add ang data dito kung gusto mo */}</div>
      ))}
    </>
  );
};

export default Products;
