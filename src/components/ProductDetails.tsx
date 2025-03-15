import ArrowTabs from "./UI/ArrowTabs";
import ProductSwipePage from "./ProductSwipePage";
import DetailedSwipePage from "./DetailedSwipePage";
const ProductDetails = () => {
  const tabData = [
    { icon: "Products", content: <ProductSwipePage/> },
    { icon: "Details", content: <DetailedSwipePage/> },
  ];

  return (
    <div className="w-full">
      <ArrowTabs tabs={tabData} />
    </div>
  );
};

export default ProductDetails;
