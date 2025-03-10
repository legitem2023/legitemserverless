"use client";
import { useQuery } from "@apollo/client";
import { GET_CHILD_INVENTORY } from "./queries";

// Define the expected structure of the inventory items
interface ChildInventory {
  id: string;
  productCode: string;
  category: string;
  productType: string;
  brandname: string;
  // Add other necessary fields
}

interface GetChildInventoryData {
  getChildInventory: ChildInventory[];
}

const Products = () => {
  const { data, loading, error } = useQuery<GetChildInventoryData>(GET_CHILD_INVENTORY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      
    </div>
  );
};

export default Products;
