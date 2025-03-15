"use client";
import React, { useState } from "react";
import ArrowTabs from "@/components/ArrowTabs";

const Transactions = () => {
  const stages = ["Step 1", "Step 2", "Step 3", "Step 4"];
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