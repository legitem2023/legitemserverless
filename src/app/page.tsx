'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from "react";
import SwipeTabs from "@/components/UI/SwipeTabs";

import Dashboard from "@/components/Dashboard";

import Transactions from "@/components/Transactions";

import Settings from "@/components/Settings";

import dynamic from 'next/dynamic';

const ProductDetails = dynamic(() => import('@/components/ProductDetails'), { ssr: false });

const DashboardTab = () => (
  <div className="h-[90vh] overflow-y-auto">
    <Dashboard />
  </div>
);

const InventoryTab = () => (
  <div id="InventoryTab" className="h-[90vh] overflow-y-auto">
    <ProductDetails />
  </div>
);

const TransactionTab = () => (
  <div id="TransactionTab" className="h-[90vh] overflow-y-auto">
    <Transactions />
  </div>
);

const SalesTab = () => <div id="SalesTab" className="h-[90vh] overflow-y-auto"></div>;

const StatisticsTab = () => (
<div id="StatisticsTab" className="h-[90vh] overflow-y-auto">

</div>);

const SettingsTab = () => (
<div id="SettingsTab" className="h-[90vh] overflow-y-auto">
  <Settings/>
</div>
);

const tabs = [
  { id: "Dashboard", label: "Dashboard", Icn: "material-symbols:dashboard", content: <DashboardTab /> },
  { id: "Inventory", label: "Inventory", Icn: "material-symbols:inventory", content: <InventoryTab /> },
  { id: "Transaction", label: "Transaction", Icn: "grommet-icons:transaction", content: <TransactionTab /> },
  { id: "Sales", label: "Sales", Icn: "tdesign:money", content: <SalesTab /> },
  { id: "Statistics", label: "Statistics", Icn: "akar-icons:statistic-up", content: <StatisticsTab /> },
  { id: "Bills", label: "Bills", Icn: "mdi:receipt-text", content: <SettingsTab /> },
  { id: "Settings", label: "Settings", Icn: "material-symbols:settings", content: <SettingsTab /> }
];

function ActiveTabContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const activeTab = tabs.find(tab => tab.id === id);
  return activeTab ? activeTab.content : <SwipeTabs tabs={tabs} />;
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading....</div>}>
      <ActiveTabContent />
    </Suspense>
  );
}