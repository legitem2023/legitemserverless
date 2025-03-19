import ArrowTabs from "@/components/ArrowTabs";


const Settings = () => {

const tabs = [{
icon: "mdi:about",
content: "" },{ 
icon: "wpf:faq", 
content: "" },{ 
icon: "material-symbols:gpp-maybe", 
content: "" },{ 
icon: "ic:outline-privacy-tip", 
content: ""},{
icon: "ic:baseline-phone", content: ""},{
icon: "mdi:check-decagram", 
content: ""},
];

return (
       <div className="p-2 bg-[#f1f1f1]">
          <div className="flex-1 flex flex-wrap relative p-2 font-bold">Settings</div>
          <hr></hr>
      <ArrowTabs
        tabs={tabs}
      />
    </div>
)
}

export default Settings;