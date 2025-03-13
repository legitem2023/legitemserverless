import { setActiveIndex as Index2 } from "../Redux/swipeSlice";
import { useDispatch } from 'react-redux';
import { Icon } from "@iconify/react";

const BackButton = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <button 
        className="flex justify-center items-center p-1 rounded-md bg-brown-800 text-[#ffffff]" 
        onClick={() => dispatch(Index2(0))}
      >
        <Icon icon="mingcute:back-fill" className="mr-1" />
        Back
      </button> 
    </div>
  );
};

export default BackButton;
