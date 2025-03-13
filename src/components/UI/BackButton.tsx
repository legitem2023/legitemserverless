import { setActiveIndex as Index2 } from "../Redux/swipeSlice";
import { useDispatch } from 'react-redux';
import { Icon } from "@iconify/react";

const BackButton = () => {
  const dispatch = useDispatch(); // ✅ Call useDispatch at the top level

  return (
    <div>
      <button className="flex justify-center item-center p-1 rounded-md" onClick={() => dispatch(Index2(0))}>
        <Icon icon="mingcute:back-fill" />Back
      </button> 
    </div>
  );
};

export default BackButton;
