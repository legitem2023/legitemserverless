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
    { label: "Tab 1", content: <TabOneContent /> },
    { label: "Tab 2", content: <TabTwoContent /> },
    { label: "Tab 3", content: <TabThreeContent /> },
  ];

  return <SwipeTabs tabs={tabs} />;
}
