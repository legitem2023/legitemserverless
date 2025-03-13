import SwipeContainer from "./UI/SwipeContainer";
import { useSelector } from "react-redux";
import Products from "./Products";
import InsertProducts from "./UI/InsertProducts";
export default function ProductSwipePage() {
  const activeIndex = useSelector((state:any) => state.swipe.activeIndex);

  return (
    <div>
      <h1>Active Slide: {activeIndex}</h1>
      <SwipeContainer
        items={[
          <Products/>,
          <InsertProducts/>,
          <div className="p-10 bg-green-500 text-white text-center">Slide 3</div>,
        ]}
      />
    </div>
  );
}
