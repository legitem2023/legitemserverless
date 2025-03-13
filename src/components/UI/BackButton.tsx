import { setActiveIndex as Index2 } from "../Redux/swipeSlice";
import {useDispatch} from 'react-redux';
const BackButton = () => {
  return (
    <button onClick={()=>useDispatch(Index2(0)}>Back</button>
  )
}
export default BackButton;
