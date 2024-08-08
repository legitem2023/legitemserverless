'use client';

import { useState } from 'react';
import Paragraph from '../Partial/Paragraph';

interface CollapseProps {
  title: string;
  children: any;
}

const Accordion: React.FC<CollapseProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-md shadow-sm my-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full p-4 text-left bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-300"
      >
        <span>{title}</span>
        <svg
          className={`w-6 h-6 transition-transform transform ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-screen border-t' : 'max-h-0'
        }`}
      >
        {isOpen && <Paragraph Paragraph={children}/>}
      </div>
    </div>
  );
};

export default Accordion;
