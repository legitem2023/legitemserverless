import { GET_CATEGORY, GET_CHILD_INVENTORY } from './queries';
const Products = () =>{
const { data: ProductsData, loading: productsLoading, error: productsError } = useQuery(GET_CHILD_INVENTORY);
if(productsLoading) return
  return (
    <div></div>
  )
}
export default Products;
