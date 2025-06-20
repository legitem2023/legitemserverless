'use client';
import { Suspense, lazy } from "react"; 
import SwipeTabs from "@/components/UI/SwipeTabs";
import dynamic from 'next/dynamic';

// Lazy Load Components
const Dashboard = lazy(() => import("@/components/Dashboard"));
const Transactions = lazy(() => import("@/components/Transactions"));
const Settings = lazy(() => import("@/components/Settings"));
const ProductDetails = dynamic(() => import('@/components/ProductDetails'), { ssr: false });

const DashboardTab = () => (
  <div className="h-[90vh] overflow-y-auto">
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <Dashboard />
    </Suspense>
  </div>
);

const InventoryTab = () => (
  <div id="InventoryTab" className="h-[90vh] overflow-y-auto">
    <Suspense fallback={<div>Loading Inventory...</div>}>
      <ProductDetails />
    </Suspense>
  </div>
);

const TransactionTab = () => (
  <div id="TransactionTab" className="h-[90vh] overflow-y-auto">
    <Suspense fallback={<div>Loading Transactions...</div>}>
      <Transactions />
    </Suspense>
  </div>
);

const SalesTab = () => <div id="SalesTab" className="h-[90vh] overflow-y-auto"></div>;
const StatisticsTab = () => <div id="StatisticsTab" className="h-[90vh] overflow-y-auto"></div>;

const SettingsTab = () => (
  <div id="SettingsTab" className="h-[90vh] overflow-y-auto">
    <Suspense fallback={<div>Loading Settings...</div>}>
      <Settings />
    </Suspense>
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

export default function Home() {
  return (
    <Suspense fallback={<div>Loading....</div>}>
      <div className="flex h-[100px]">
        E-Crowd
      </div>
      <SwipeTabs tabs={tabs}/> {/* Default to first tab */}
    </Suspense>
  );
}
