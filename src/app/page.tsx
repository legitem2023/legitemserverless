'use client'; 
import { useSearchParams } from 'next/navigation'; 
import { Suspense, useState, useEffect } from "react"; 
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
const StatisticsTab = () => <div id="StatisticsTab" className="h-[90vh] overflow-y-auto"></div>;
const SettingsTab = () => (
  <div id="SettingsTab" className="h-[90vh] overflow-y-auto">
    <Settings />
  </div>
);

function ActiveTabContent({ useActive }: { useActive: number }) {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const tabs = [
    { id: "Dashboard", label: "Dashboard", Icn: "material-symbols:dashboard", content: useActive === 0 ? <DashboardTab /> : '' },
    { id: "Inventory", label: "Inventory", Icn: "material-symbols:inventory", content: useActive === 1 ? <InventoryTab /> : '' },
    { id: "Transaction", label: "Transaction", Icn: "grommet-icons:transaction", content: useActive === 2 ? <TransactionTab /> : '' },
    { id: "Sales", label: "Sales", Icn: "tdesign:money", content: useActive === 3 ? <SalesTab /> : '' },
    { id: "Statistics", label: "Statistics", Icn: "akar-icons:statistic-up", content: useActive === 4 ? <StatisticsTab /> : '' },
    { id: "Bills", label: "Bills", Icn: "mdi:receipt-text", content: useActive === 5 ? <SettingsTab /> : '' },
    { id: "Settings", label: "Settings", Icn: "material-symbols:settings", content: useActive === 6 ? <SettingsTab /> : '' }
  ];

  return <SwipeTabs tabs={tabs} />;
}

export default function Home() {
  const [useActive, setActive] = useState(0); // Default to first tab

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    if (id) {
      const tabIndex = ["Dashboard", "Inventory", "Transaction", "Sales", "Statistics", "Bills", "Settings"].indexOf(id);
      if (tabIndex !== -1) {
        setActive(tabIndex);
      }
    }
  });

  return (
    <Suspense fallback={<div>Loading....</div>}>
      <ActiveTabContent useActive={useActive} />
    </Suspense>
  );
}