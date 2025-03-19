'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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

const SalesTab = () => (
  <div id="SalesTab" className="h-[90vh] overflow-y-auto"></div>
);

const StatisticsTab = () => (
  <div id="StatisticsTab" className="h-[90vh] overflow-y-auto"></div>
);

const SettingsTab = () => (
  <div id="SettingsTab" className="h-[90vh] overflow-y-auto">
    <Settings />
  </div>
);

export default function Home() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setActiveTab(parseInt(id, 10));
    }
  }, [searchParams]);

  const tabs = [
    { id: "Dashboard", label: "Dashboard", Icn: "material-symbols:dashboard", content: activeTab === 0 ? <DashboardTab /> : '' },
    { id: "Inventory", label: "Inventory", Icn: "material-symbols:inventory", content: activeTab === 1 ? <InventoryTab /> : '' },
    { id: "Transaction", label: "Transaction", Icn: "grommet-icons:transaction", content: activeTab === 2 ? <TransactionTab /> : '' },
    { id: "Sales", label: "Sales", Icn: "tdesign:money", content: activeTab === 3 ? <SalesTab /> : '' },
    { id: "Statistics", label: "Statistics", Icn: "akar-icons:statistic-up", content: activeTab === 4 ? <StatisticsTab /> : '' },
    { id: "Bills", label: "Bills", Icn: "mdi:receipt-text", content: activeTab === 5 ? <SettingsTab /> : '' },
    { id: "Settings", label: "Settings", Icn: "material-symbols:settings", content: activeTab === 6 ? <SettingsTab /> : '' }
  ];

  return <SwipeTabs tabs={tabs} />;
}