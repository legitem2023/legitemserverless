'use client';
import React from 'react';
import Titlebar from '../UI/Titlebar';
import { Icon } from '@iconify/react/dist/iconify.js';
import Paragraph from '../Partial/Paragraph';
import ParagraphAll from '../../../json/Paragraph.json'
import Accordion from '../Accordion/Accordion';
import faq from '../../../json/faq.json';
import { HomeGallery } from '../Gallery/HomeGallery';
import Privacy from './Privacy';
const Home = () => {



  return (
    <div className='flex flex-wrap justify-left md:justify-center gap-0 md:w-full lg:w-[55.56vw]'>
        
        <div className="grid w-[100vw]">
            <div className='flex flex-1 p-2 border-b-4 border-t-4 border-solid border-lime-800 flex-row align-center bg-lime-600'>
                <div className='flex flex-col justify-center p-2'><Icon icon="bx:category-alt" /></div>
                <Titlebar title="Categories"/>
            </div>
            <div>
            <HomeGallery/>
            </div>
            <div className='flex flex-1 p-2 border-b-4 border-t-4 border-solid border-lime-800 flex-row align-center bg-lime-600'>
                <div className='flex flex-col justify-center p-2'><Icon icon="mdi:about" /></div>
                <Titlebar title="About"/>
            </div>
            <div>
                <Paragraph Paragraph={ParagraphAll[0].Name}/>
            </div>
            <div className='flex flex-1 p-2 border-b-4 border-t-4 border-solid border-lime-800 flex-row align-center bg-lime-600'>
                <div className='flex flex-col justify-center p-2'><Icon icon="bxs:hand" /></div>
                <Titlebar title="Disclaimer"/>
            </div>
            <div>
                <Paragraph Paragraph={ParagraphAll[1].Name}/>
            </div>
            <div className='flex flex-1 p-2 border-b-4 border-t-4 border-solid border-lime-800 flex-row align-center bg-lime-600'>
                <div className='flex flex-col justify-center p-2'><Icon icon="wpf:faq" /></div>
                <Titlebar title="Frequently Asked Questions"/>
            </div>
            <div>
                {
                    faq.map((faq: any) => <Accordion key={faq.question} title={faq.question}>{faq.answer}</Accordion>)
                }
            </div>
            <div className='flex flex-1 p-2 border-b-4 border-t-4 border-solid border-lime-800 flex-row align-center bg-lime-600'>
                <div className='flex flex-col justify-center p-2'><Icon icon="material-symbols:privacy-tip" /></div>
                <Titlebar title="Privacy"/>
            </div>
            <div className='flex flex-1 p-2 border-b-4 border-t-4 border-solid border-lime-800 flex-row align-center bg-[#f1f1f1]'>
                <Privacy/>
            </div>
            <div className='flex flex-1 p-2 border-b-4 border-t-4 border-solid border-lime-800 flex-row align-center bg-lime-600'>
                <div className='flex flex-col justify-center p-2'><Icon icon="ic:baseline-phone" /></div>
                <Titlebar title="Contact Us"/>
            </div>

            

        </div>
    </div>
  );
}

export default Home;
