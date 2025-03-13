import SwipeContainer from "./UI/SwipeContainer";
import { useSelector } from "react-redux";
import Products from "./Products";
import InsertProducts "./UI/InsertProducts";
export default function ProductSwipePage() {
  const activeIndex = useSelector((state:any) => state.swipe.activeIndex);

  return (
    <div>
      <h1>Active Slide: {activeIndex}</h1>
      <SwipeContainer
        items={[
          <Products/>,
          <div className="p-10 bg-blue-500 text-white text-center">
          <InsertProducts/>
          </div>,
          <div className="p-10 bg-green-500 text-white text-center">Slide 3</div>,
        ]}
      />
    </div>
  );
}
