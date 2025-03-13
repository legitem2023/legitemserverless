import SwipeContainer from "./UI/SwipeContainer";
import { useSelector } from "react-redux";
import Detailed from "./Detailed";

export default function DetailedSwipePage() {
  const activeIndex = useSelector((state:any) => state.swipe.activeIndex);

  return (
    <div>
      <SwipeContainer
        items={[
          <Detailed/>,
          <Detailed/>,
          <Detailed/>,
        ]}
      />
    </div>
  );
}
