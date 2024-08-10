import Tabs from "@/components/Partial/Tabs";

export default function Home() {
  const tabs = [
    { label: 'Profile', content: <div>Content for Tab 1</div> },
    { label: 'Address Book', content: <div>Content for Tab 2</div> },
    { label: 'My Orders', content: <div>Content for Tab 3</div> },
    { label: 'Wish List', content: <div>Content for Tab 3</div> },
  ];
  return (
    
    <main className="flex flex-wrap justify-center items-center w-full md:w-full lg:w-[100%]">
          <Tabs tabs={tabs} />
    </main>
  );
}
