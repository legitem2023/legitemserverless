import Tabs from "./UI/Tabs";
import Products from "./Products";
import Detailed from "./Detailed";
const ProductDetails = () => {
  const tabData = [
    { label: "Products", content: <Products/> },
    { label: "Details", content: <Detailed/> },
  ];

  return (
    <div className="w-full mt-2">
      <Tabs tabs={tabData} />
    </div>
  );
};

export default ProductDetails;
