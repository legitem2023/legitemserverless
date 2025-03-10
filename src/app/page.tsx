'use client';
import SwipeTabs from "@/components/UI/SwipeTabs";

function TabOneContent() {
  return <p>This is Tab 1 content.</p>;
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
      "Icn":"mdi:tags",
      "content":<TabOneContent/>
    },
    {
      "label": "Inventory",
      "Icn":"bxs:category",
      "content":<TabOneContent/>
    },
    {
      "label": "Transaction",
      "Icn":"bi:collection-fill",
      "content":<TabOneContent/>     
    },
    {
      "label": "Sales",
      "Icn":"bi:boxes",
      "content":<TabOneContent/>    
    },
    {
      "label": "Statistics",
      "Icn":"mdi:new-box",
      "content":<TabOneContent/>
    },
    {
      "label": "Settings",
      "Icn":"entypo:new",
      "content":<TabOneContent/>
    }
  ]

  return <SwipeTabs tabs={tabs} />;
}
