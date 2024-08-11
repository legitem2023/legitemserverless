import Accounts from "@/components/Administrator_components/Accounts/Accounts";
import Dashboard from "@/components/Administrator_components/Dashboard/Dashboard";
import Inventory from "@/components/Administrator_components/Inventory/Inventory";
import Orders from "@/components/Administrator_components/Orders/Orders";
import Tabs from "@/components/Partial/Tabs";
import Titlebar from "@/components/UI/Titlebar";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Home() {
  const tabs = [
    { icon:'mdi:view-dashboard',label: 'Dashboard', content: <Dashboard/> },
    { icon:'material-symbols:inventory',label: 'Inventory', content: <Inventory/> },
    { icon:'mdi:tags',label: 'Orders', content: <Orders/> },
    { icon:'akar-icons:statistic-up',label: 'Statistics', content: <Orders/> },
    { icon:'mdi:accounts-group',label: 'Accounts', content: <Accounts/> },
    { icon:'mdi:cast-tutorial',label: 'Tutorials', content: <div>Content for Tab 3</div> },

  ];
  return (
    <main className="flex flex-wrap justify-center items-center w-full md:w-full lg:w-[100%]">
          <Titlebar title="Administrator" Icons='mdi:cart'/>
          <Tabs tabs={tabs} />
    </main>
  );
}
