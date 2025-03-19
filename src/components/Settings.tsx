import ArrowTabs from "@/components/ArrowTabs";


const Settings = () => {

const tabs = [{
icon: "fluent:document-add-24-filled",
content: "" },{ 
icon: "mdi:inbox-arrow-down", 
content: "" },{ 
icon: "solar:settings-bold", 
content: "" },{ 
icon: "mdi:truck-cargo-container", 
content: ""},{
icon: "material-symbols:local-shipping", content: ""},{
icon: "mdi:check-decagram", 
content: ""},
];

result (
       <div className="p-2 bg-[#f1f1f1]">
          <div className="flex-1 flex flex-wrap relative p-2 font-bold">Transactions</div>
          <hr></hr>
      <ArrowTabs
        tabs={tabs}
      />
    </div>
)
}

export default Settings;