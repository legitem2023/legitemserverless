import React, { useState } from "react";

interface AccordionProps {
  title: string;
  content: React.ReactNode;
}

const ReusableAccordion: React.FC<AccordionProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border my-1">
      <button
        className="w-full text-left py-1 text-[15px] font-medium bg-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </button>
      {isOpen && (
        <div className="px-2 py-1 text-[13px]">
          {content}
        </div>
      )}
    </div>
  );
};

export default ReusableAccordion;