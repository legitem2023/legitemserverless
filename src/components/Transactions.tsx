"use client";
import React, { useState } from "react";
import ArrowTabs from "@/components/ArrowTabs";

const Transactions = () => {





 const stages = [
  "mdi:file-plus",        // New  
  "mdi:inbox-arrow-down", // Receive  
  "mdi:cog-sync",         // Processing  
  "mdi:truck-fast",       // Logistic  
  "mdi:package-variant",  // Delivery  
  "mdi:check-circle",     // Finished  
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