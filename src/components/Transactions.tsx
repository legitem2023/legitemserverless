"use client";
import React, { useState } from "react";
import ArrowTabs from "@/components/ArrowTabs";

const Transactions = () => {





 const stages = [
  "fluent:document-add-24-filled",  // New (Adding a new entry/document)
  "mdi:inbox-arrow-down",           // Receive (Receiving an order/item)
  "solar:settings-bold",             // Processing (Gears turning for processing)
  "mdi:truck-cargo-container",       // Logistic (Cargo truck for logistics)
  "material-symbols:local-shipping", // Delivery (Truck with motion effect)
  "mdi:check-decagram",              // Finished (Check badge for completion)
];


  const [activeStage, setActiveStage] = useState(0);

  return (
    <div className="p-6">
      <ArrowTabs
        stages={stages}
        activeStage={activeStage}
        onStageChange={setActiveStage}
      />
      
      <div className="mt-4 p-4 border rounded-md">
        <h2 className="text-xl font-bold">Current Stage: {stages[activeStage]}</h2>
      </div>
    </div>
  );
};

export default Transactions;