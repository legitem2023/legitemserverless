import React from 'react'

const Select = ({Selected,InitialText,Name,Data,function_event}) => {

  return (
    <select name={Name} value={Selected} onChange={function_event}>
        <option value={InitialText}>{InitialText}</option>

        {Data?.map((item: any, idx: any) => (
          <option key={idx} value={item.Value}>{item.Text}</option>
        ))}
    </select>
  )
}

export default Select
