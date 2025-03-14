import SwipeContainer from "./UI/SwipeContainer";
import { useSelector } from "react-redux";
import Detailed from "./Detailed";
import InsertDetails from "./InsertDetails";
import EditDetails from ./EditDetails";
export default function DetailedSwipePage() {
  const activeIndex = useSelector((state:any) => state.swipe.activeIndex);

  return (
    <div>
      <SwipeContainer
        items={[
          <Detailed/>,
          <InsertDetails/>,
          <EditDetails/>,
        ]}
      />
    </div>
  );
}
