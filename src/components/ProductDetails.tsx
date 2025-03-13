import Tabs from "./UI/Tabs";
import ProductSwipePage from "./ProductSwipePage";
import Detailed from "./Detailed";
const ProductDetails = () => {
  const tabData = [
    { label: "Products", content: <ProductSwipePage/> },
    { label: "Details", content: <Detailed/> },
  ];

  return (
    <div className="w-full mt-2">
      <Tabs tabs={tabData} />
    </div>
  );
};

export default ProductDetails;
