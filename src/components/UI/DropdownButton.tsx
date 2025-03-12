import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";

interface DropdownButtonProps {
  options: { id: string; label: string; onClick: (id: any) => void }[];
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ options }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
      >
        <Icon icon="mdi:dots-vertical" className="text-2xl text-[#000000]" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-50">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                option.onClick(option.id);
                setOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
