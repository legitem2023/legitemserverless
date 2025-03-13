import { setActiveIndex as Index2 } from "../Redux/swipeSlice";
import { setTypes, setBrands, setDepartments,setCategories } from "../Redux/categorySlice";

import { useDispatch } from 'react-redux';
import { Icon } from "@iconify/react";

const BackButton = () => {
  const dispatch = useDispatch();
  const reset = () =>{
    dispatch(setTypes("Select Types"));
    dispatch(setBrands("Select Brand"));
    dispatch(setDepartments("Select Department"));
    dispatch(setCategories("Select Category"));
    dispatch(Index2(0))
  }
  return (
    <div>
      <button 
        className="flex justify-center items-center p-2 rounded-md bg-[#451b05] text-[#ffffff] shadow-lg m-2" 
        onClick={reset()}
      >
        <Icon icon="mingcute:back-fill" className="mr-1" />
        Back
      </button> 
    </div>
  );
};

export default BackButton;
