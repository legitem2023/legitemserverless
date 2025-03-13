import SwipeContainer from "./UI/SwipeContainer";
import { useSelector } from "react-redux";
import Products from "./Products";
import InsertProducts from "./UI/InsertProducts";
import EditProducts from "./UI/EditProducts";
export default function ProductSwipePage() {
  const activeIndex = useSelector((state:any) => state.swipe.activeIndex);

  return (
    <div>
      <SwipeContainer
        items={[
          <Products/>,
          <InsertProducts/>,
          <EditProducts/>,
        ]}
      />
    </div>
  );
}
