import Image from "next/image";
import { Inter } from "next/font/google";
import Thumbnail from "@/components/Products/Thumbnail";
import Titlebar from "@/components/UI/Titlebar";
import Home from "@/components/Home/Home";
const inter = Inter({ subsets: ["latin"] });
export default function Product() {
  return (
    <main className="flex flex-wrap justify-center items-center w-full md:w-full lg:w-[100%]">
      <Home/>
    </main>
  );
}
