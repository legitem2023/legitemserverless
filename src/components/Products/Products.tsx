import { PrismaClient } from '@prisma/client';
import Thumbnail from "@/components/Products/Thumbnail";
import type { InferGetStaticPropsType, GetStaticProps } from 'next';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define type for inventory items
type InventoryItem = {
  id: string;
  productCode: string | null;
  styleCode: string | null;
  category: string | null;
  productType: string | null;
  size: string | null;
  color: string | null;
  price: number | null;
  stock: number | null;
  name: string | null;
  creator: string | null;
  editor: string | null;
  accountCode: string | null;
};

// Fetch data in `getStaticProps`
export const getStaticProps: GetStaticProps<{ inventory: InventoryItem[] }> = async () => {
  try {
    const inventory = await prisma.inventory.findMany();
    return { props: { inventory } };
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return { props: { inventory: [] } }; // Return empty array on error
  }
};

// Component to use the fetched data
export default function Products({ inventory }: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log(inventory)
    return (
    <main className="flex flex-wrap justify-center items-center w-full md:w-full lg:w-[100%]">
        <Thumbnail item={inventory} />
    </main>
  );
}
