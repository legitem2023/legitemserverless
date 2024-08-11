import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({ options, value, onChange, label, placeholder, className }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 w-[100%] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {/* {placeholder && (
          <option value="" disabled key='001'>
            {placeholder}
          </option>
        )} */}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
