import { setActiveIndex as Index2 } from "../Redux/swipeSlice";
import { useDispatch } from 'react-redux';

const BackButton = () => {
  const dispatch = useDispatch(); // ✅ Call useDispatch at the top level

  return (
    <div>
      <button onClick={() => dispatch(Index2(0))}>Back</button> 
    </div>
  );
};

export default BackButton;
