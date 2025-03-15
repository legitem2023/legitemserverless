"use client";
import React, { useState } from "react";
import ArrowTabs from "@/components/ArrowTabs";
import NewOrder from "./NewOrder";
const Transactions = () => {


const tabs = [{
icon: "fluent:document-add-24-filled",
content: <NewOrder/> },{ 
icon: "mdi:inbox-arrow-down", 
content: <NewOrder/> },{ 
icon: "solar:settings-bold", 
content: <p>✅</p> },{ 
icon: "mdi:truck-cargo-container", 
content: <p>✅</p>},{
icon: "material-symbols:local-shipping", content: <p>✅</p>},{
icon: "mdi:check-decagram", 
content: <p>✅</p>},
];



  const [activeStage, setActiveStage] = useState(0);

  return (
    <div className="p-2 bg-[#f1f1f1]">
          <div className="flex-1 flex flex-wrap relative p-2 font-bold">Transactions</div>
          <hr></hr>
      <ArrowTabs
        tabs={tabs}
      />
    </div>
  );
};

export default Transactions;