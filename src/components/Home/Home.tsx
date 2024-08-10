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
            <div className='flex flex-1 flex-row align-center'>
                <Titlebar title="Categories" Icons='bx:category'/>
            </div>
            
            <HomeGallery/>
        
            <div className='flex flex-1 flex-row align-center'>
                <Titlebar title="About" Icons='mdi:about'/>
            </div>
            <div>
                <Paragraph Paragraph={ParagraphAll[0].Name}/>
            </div>
            <div className='flex flex-1 flex-row align-center'>
                <Titlebar title="Disclaimer" Icons='bxs:hand'/>
            </div>
            <div>
                <Paragraph Paragraph={ParagraphAll[1].Name}/>
            </div>
            <div className='flex flex-1 flex-row align-center'>
                <Titlebar title="Frequently Asked Questions" Icons='wpf:faq'/>
            </div>
            <div>
                {
                    faq.map((faq: any) => <Accordion key={faq.question} title={faq.question}>{faq.answer}</Accordion>)
                }
            </div>
            <div className='flex flex-1 flex-row align-center'>
                <Titlebar title="Privacy" Icons='material-symbols:privacy-tip'/>
            </div>
            <div className='flex flex-1 p-2 border-b-4 border-t-4 border-solid border-lime-800 flex-row align-center bg-[#f1f1f1]'>
                <Privacy/>
            </div>
            <div className='flex flex-1 flex-row align-center'>
                <Titlebar title="Contact Us" Icons='ic:baseline-phone'/>
            </div>

            

        </div>
    </div>
  );
}

export default Home;
