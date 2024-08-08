import Thumbnail from "@/components/Products/Thumbnail";
type InventoryItem = {
  id: string;
  name: string | null;
  price: number | null;
  thumbnail: string | null;
  category: string | null;
  color: string | null;
};

export default function Product() {
  return (
    <main className="flex flex-wrap justify-center items-center w-full md:w-full lg:w-[100%]">
        <Thumbnail/>
    </main>
  );
}
