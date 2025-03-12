import Tabs from "./UI/Tabs";
import Products from "./Products";
import Detailed from "./Detailed";
const ProductDetails = () => {
  const tabData = [
    { label: "Products", content: <Products/> },
    { label: "Details", content: <Detailed/> },
  ];

  return (
    <div className="mx-auto mt-10">
      <Tabs tabs={tabData} />
    </div>
  );
};

export default ProductDetails;
