'use client';
import SwipeTabs from "@/components/UI/SwipeTabs";
import dynamic from 'next/dynamic';

const ProductDetails = dynamic(() => import('@/components/ProductDetails'), { ssr: false });

function TabOneContent() {
  return <div className="min-h-[80vh] h-auto"></div>
}

function TabContentProduct() {
return <div id="ParentTab" className="min-h-[80vh] h-auto"><ProductDetails/></div>
}

export default function Home() {
  const tabs = [
    {
      "label": "Dashboard",
      "Icn":"material-symbols:dashboard",
      "content":<TabOneContent/>
    },
    {
      "label": "Inventory",
      "Icn":"material-symbols:inventory",
      "content":<TabContentProduct/>
    },
    {
      "label": "Transaction",
      "Icn":"grommet-icons:transaction",
      "content":<TabOneContent/>     
    },
    {
      "label": "Sales",
      "Icn":"tdesign:money",
      "content":<TabOneContent/>    
    },
    {
      "label": "Statistics",
      "Icn":"akar-icons:statistic-up",
      "content":<TabOneContent/>
    },
    {
      "label": "Settings",
      "Icn":"material-symbols:settings",
      "content":<TabOneContent/>
    }
  ]

  return <SwipeTabs tabs={tabs} />;
}
