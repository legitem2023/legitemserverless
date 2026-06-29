
// app/page.tsx
import FbMenu, { TabItem } from "@/components/FbMenu";

const myCustomTabs: TabItem[] = [
  {
    id: "home",
    label: "Home",
    icon: <span>🏠</span>,
    content: (
      <div>
        <h3>Welcome Home</h3>
        <p>This is your custom home tab content.</p>
      </div>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: <span>👤</span>,
    badge: "2",
    content: (
      <div>
        <h3>Your Profile</h3>
        <p>Name: John Doe</p>
        <p>Email: john@example.com</p>
      </div>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: <span>⚙️</span>,
    content: (
      <div>
        <h3>Settings</h3>
        <p>Theme: Dark</p>
        <p>Notifications: On</p>
      </div>
    ),
  },
];

export default function Home() {
  const handleTabChange = (tabId: string) => {
    console.log("Tab changed to:", tabId);
  };

  return (
    <main style={{ padding: "20px", background: "#f0f2f5", minHeight: "100vh" }}>
      <FbMenu
        tabs={myCustomTabs}
        initialTabId="profile"
        onTabChange={handleTabChange}
      />
    </main>
  );
}
