'use client';
import SwipeTabs from "@/components/UI/SwipeTabs";
import dynamic from 'next/dynamic';

const ProductDetails = dynamic(() => import('@/components/ProductDetails'), { ssr: false });

function TabOneContent() {
  return <p>This is Tab 2 content.</p>;
}

function TabContentProduct {
return <div className="h-[90vh] overflow"><ProductDetails/></div>
}
function TabTwoContent() {
  return <p>This is Tab 2 content.</p>;
}

function TabThreeContent() {
  return <p>This is Tab 3 content.</p>;
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
