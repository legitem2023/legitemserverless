import Tabs from "./UI/Tabs";
import ProductSwipePage from "./ProductSwipePage";
import DetailedSwipePage from "./DetailedSwipePage";
const ProductDetails = () => {
  const tabData = [
    { label: "Products", content: <ProductSwipePage/> },
    { label: "Details", content: <DetailedSwipePage/> },
  ];

  return (
    <div className="w-full">
      <Tabs tabs={tabData} />
    </div>
  );
};

export default ProductDetails;
