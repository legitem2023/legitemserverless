'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from "react";
import SwipeTabs from "@/components/UI/SwipeTabs";
import SalesChart from "@/components/SalesChart";
import Transactions from "@/components/Transactions";
import Dashboard from "@/components/Dashboard";
import dynamic from 'next/dynamic';

const ProductDetails = dynamic(() => import('@/components/ProductDetails'), { ssr: false });

type DataProps = {
  data: any;
  labels: any;
};

const DashboardTab: React.FC<DataProps> = ({ data, labels }) => {
  return (
    <div className="h-[90vh] overflow-y-auto">
      <Dashboard />
    </div>
  );
};

function InventoryTab() {
  return <div id="InventoryTab" className="h-[90vh] overflow-y-auto"><ProductDetails /></div>;
}

function TransactionTab() {
  return <div id="TransactionTab" className="h-[90vh] overflow-y-auto"><Transactions /></div>;
}

function SalesTab() {
  return <div id="SalesTab" className="h-[90vh] overflow-y-auto"></div>;
}

function StatisticsTab() {
  return <div id="StatisticsTab" className="h-[90vh] overflow-y-auto"></div>;
}

function SettingsTab() {
  return <div id="SettingsTab" className="h-[90vh] overflow-y-auto"></div>;
}

export default function Home() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Get `id` from the URL

  const dailySalesData = {
    labels: ["2024-03-01", "2024-03-02", "2024-03-03"],
    data: [1200, 1800, 1500]
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", Icn: "material-symbols:dashboard", content: <DashboardTab data={dailySalesData.data} labels={dailySalesData.labels} /> },
    { id: "inventory", label: "Inventory", Icn: "material-symbols:inventory", content: <InventoryTab /> },
    { id: "transaction", label: "Transaction", Icn: "grommet-icons:transaction", content: <TransactionTab /> },
    { id: "sales", label: "Sales", Icn: "tdesign:money", content: <SalesTab /> },
    { id: "statistics", label: "Statistics", Icn: "akar-icons:statistic-up", content: <StatisticsTab /> },
    { id: "bills", label: "Bills", Icn: "mdi:receipt-text", content: <SettingsTab /> },
    { id: "settings", label: "Settings", Icn: "material-symbols:settings", content: <SettingsTab /> }
  ];

  // Find the tab content based on the id
  const activeTab = tabs.find(tab => tab.id === id);

  return (
<Suspense fallback = {<div>Loading....</div>}>
{
activeTab ? activeTab.content : <SwipeTabs tabs={tabs} />;
}

</Suspense>
)

