import ArrowTabs from "./ArrowTabs";
import ProductSwipePage from "./ProductSwipePage";
import DetailedSwipePage from "./DetailedSwipePage";
const ProductDetails = () => {
  const tabData = [
    { icon: "mdi:tag", content: <ProductSwipePage/> },
    { icon: "mdi:details", content: <DetailedSwipePage/> },
  ];

  return (
    <div className="w-full">
      <ArrowTabs tabs={tabData} />
    </div>
  );
};

export default ProductDetails;
