'use client';
import SwipeTabs from "@/components/UI/SwipeTabs";
import SalesChart from "@/components/SalesChart";
import dynamic from 'next/dynamic';

const ProductDetails = dynamic(() => import('@/components/ProductDetails'), { ssr: false });

type DataProps = {
  data: any;
  labels: any;
};

const DashboardTab: React.FC<DataProps> = ({ data, labels }) => {
  return (
    <div className="h-[90vh] overflow-y-auto">
      <SalesChart data={data} labels={labels} />
    </div>
  );
};

function InventoryTab() {
  return <div id="InventoryTab" className="h-[90vh] overflow-y-auto"><ProductDetails /></div>;
}

function TransactionTab() {
  return <div id="TransactionTab" className="h-[90vh] overflow-y-auto"></div>;
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
  const salesData = [120, 200, 150, 300, 250, 400, 380];
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  const tabs = [
    { label: "Dashboard", Icn: "material-symbols:dashboard", content: <DashboardTab data={salesData} labels={labels} /> },
    { label: "Inventory", Icn: "material-symbols:inventory", content: <InventoryTab /> },
    { label: "Transaction", Icn: "grommet-icons:transaction", content: <TransactionTab /> },
    { label: "Sales", Icn: "tdesign:money", content: <SalesTab /> },
    { label: "Statistics", Icn: "akar-icons:statistic-up", content: <StatisticsTab /> },
    { label: "Settings", Icn: "material-symbols:settings", content: <SettingsTab /> }
  ];

  return <SwipeTabs tabs={tabs} />;
}