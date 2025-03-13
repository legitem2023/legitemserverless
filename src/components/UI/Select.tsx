import React from 'react';

interface SelectProps {
  Selected: string;
  InitialText: string;
  Name: string;
  Data: { Value: string; Text: string }[];
  function_event: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select: React.FC<SelectProps> = ({ Selected, InitialText, Name, Data, function_event }) => {
  return (
    <select name={Name} value={Selected} onChange={function_event} className="p-2 text-[13px] text-[#000000] w-full">
      <option value="">{InitialText}</option>
      {Data?.map((item, idx) => (
        <option key={idx} value={item.Value}>
          {item.Text}
        </option>
      ))}
    </select>
  );
};

export default Select;
