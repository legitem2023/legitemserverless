import React from 'react'
import Titlebar from '../UI/Titlebar'
import faq from '../../../json/faq.json';
import Accordion from '../Accordion/Accordion';

const AddressBook = () => {
  return (
    <div className='w-[100%]'>
        <Titlebar title="Address Book" Icons='ic:baseline-location-on'/>
        {
          faq.map((faq: any) => <Accordion key={faq.question} title={faq.question}>{faq.answer}</Accordion>)
        }
    </div>
  )
}
export default AddressBook