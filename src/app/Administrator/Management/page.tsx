import AddressBook from "@/components/Account/AddressBook";
import MyOrder from "@/components/Account/MyOrder";
import Profile from "@/components/Account/Profile";
import WishList from "@/components/Account/WishList";
import Tabs from "@/components/Partial/Tabs";

export default function Home() {
  const tabs = [
    { icon: 'mdi:badge-account-horizontal', label: 'Profile', content: <Profile/> },
    { icon: 'icomoon-free:address-book', label: 'Address Book', content: <AddressBook/> },
    { icon: 'mdi:border-all', label: 'My Orders', content: <MyOrder/> },
    { icon: 'mdi:star', label: 'Wish List', content: <WishList/> },
  ];
  return (
    
    <main className="flex flex-wrap justify-center items-center w-full md:w-full lg:w-[100%]">
          <Tabs tabs={tabs} />
    </main>
  );
}
