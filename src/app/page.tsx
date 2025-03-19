'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useMemo } from "react";
import SwipeTabs from "@/components/UI/SwipeTabs";

import Dashboard from "@/components/Dashboard";
import Transactions from "@/components/Transactions";
import Settings from "@/components/Settings";

import dynamic from 'next/dynamic';

const ProductDetails = dynamic(() => import('@/components/ProductDetails'), { ssr: false });

const tabs = [
  { id: "Dashboard", label: "Dashboard", Icn: "material-symbols:dashboard" },
  { id: "Inventory", label: "Inventory", Icn: "material-symbols:inventory" },
  { id: "Transaction", label: "Transaction", Icn: "grommet-icons:transaction" },
  { id: "Sales", label: "Sales", Icn: "tdesign:money" },
  { id: "Statistics", label: "Statistics", Icn: "akar-icons:statistic-up" },
  { id: "Bills", label: "Bills", Icn: "mdi:receipt-text" },
  { id: "Settings", label: "Settings", Icn: "material-symbols:settings" }
];

function ActiveTabContent({ activeTab }:any) {
  const content = useMemo(() => {
    switch (activeTab) {
      case "Dashboard":
        return <Dashboard />;
      case "Inventory":
        return <ProductDetails />;
      case "Transaction":
        return <Transactions />;
      case "Bills":
      case "Settings":
        return <Settings />;
      default:
        return null;
    }
  }, [activeTab]);

  return <div className="h-[90vh] overflow-y-auto">{content}</div>;
}

export default function Home() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('id');

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SwipeTabs tabs={tabs} />
      <ActiveTabContent activeTab={activeTab} />
    </Suspense>
  );
}