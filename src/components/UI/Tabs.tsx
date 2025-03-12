import { useState } from "react";

type Tab = {
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
};

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full">
      {/* Tab Buttons */}
      <div className="flex border-b">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`px-4 py-2 text-sm font-medium ${
              activeIndex === index
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-0">{tabs[activeIndex]?.content}</div>
    </div>
  );
};

export default Tabs;
