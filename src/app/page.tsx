'use client';
import SwipeTabs from "@/components/UI/SwipeTabs";
import SalesChart from "@/components/SalesChart";

import Transactions from "@/components/Transactions";

import Dashboard from "@/components/Dashboard"
import dynamic from 'next/dynamic';

const ProductDetails = dynamic(() => import('@/components/ProductDetails'), { ssr: false });

type DataProps = {
  data: any;
  labels: any;
};

const DashboardTab: React.FC<DataProps> = ({ data, labels }) => {
  return (
    <div className="h-[90vh] overflow-y-auto">
<Dashboard/>
    </div>
  );
};

function InventoryTab() {
  return <div id="InventoryTab" className="h-[90vh] overflow-y-auto"><ProductDetails /></div>;
}

function TransactionTab() {
  return <div id="TransactionTab" className="h-[90vh] overflow-y-auto">
<Transactions/>
</div>;
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



const dailySalesData = {
    labels: [
      "2024-03-01", "2024-03-02", "2024-03-03", "2024-03-04", "2024-03-05",
      "2024-03-06", "2024-03-07", "2024-03-08", "2024-03-09", "2024-03-10",
      "2024-03-11", "2024-03-12", "2024-03-13", "2024-03-14", "2024-03-15",
      "2024-03-16", "2024-03-17", "2024-03-18", "2024-03-19", "2024-03-20",
      "2024-03-21", "2024-03-22", "2024-03-23", "2024-03-24", "2024-03-25",
      "2024-03-26", "2024-03-27", "2024-03-28", "2024-03-29", "2024-03-30",
      "2024-03-31"
    ],
    data: [
      1200, 1800, 1500, 2000, 1700, 2100, 1900, 2300, 2050, 2400,
      2200, 2100, 1950, 2450, 2300, 2000, 1850, 2550, 2350, 2150,
      2250, 2400, 2100, 1950, 2500, 2300, 2200, 2100, 2650, 2400, 2250
    ]
  };

  const tabs = [
    { label: "Dashboard", Icn: "material-symbols:dashboard", content: <DashboardTab data={dailySalesData.data} labels={dailySalesData.labels} /> },
    { label: "Inventory", Icn: "material-symbols:inventory", content: <InventoryTab /> },
    { label: "Transaction", Icn: "grommet-icons:transaction", content: <TransactionTab /> },
    { label: "Sales", Icn: "tdesign:money", content: <SalesTab /> },
    { label: "Statistics", Icn: "akar-icons:statistic-up", content: <StatisticsTab /> },
{ label: "Bills", Icn: "mdi:reciept-text", content: <SettingsTab /> },
    { label: "Settings", Icn: "material-symbols:settings", content: <SettingsTab /> }
  ];

  return <SwipeTabs tabs={tabs} />;
}