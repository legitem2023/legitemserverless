"use client";
import React, { useState } from "react";
import ArrowTabs from "@/components/ArrowTabs";

const Transactions = () => {





  const stages = ["solar:add-circle-bold",
"solar:inbox-in-bold", "solar:loading-circle-bold", "solar:truck-bold","solar:box-send-bold","solar:check-circle-bold"];
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