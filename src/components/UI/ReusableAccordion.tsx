import { useState } from "react";

interface AccordionProps {
  title: string;
  content: string;
}

const ReusableAccordion: React.FC<AccordionProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-md">
      <button
        className="w-full text-left px-2 py-1 text-[12px] font-medium bg-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </button>
      {isOpen && (
        <div className="px-2 py-1 text-[12px]">
          {content}
        </div>
      )}
    </div>
  );
};

export default ReusableAccordion;