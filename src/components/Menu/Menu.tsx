
// app/page.tsx
import FbMenu, { TabItem } from "@/components/FbMenu";
import ChatApp from "@/components/chat/ChatApp";
import ScanPage from "@/components/ScanPage";
const myCustomTabs: TabItem[] = [
  {
    id: "home",
    label: "Home",
    icon: <span>🏠</span>,
    content: (
      <ScanPage/>
    ),
  },
  {
    id: "messages",
    label: "Messages",
    icon: <span>💬</span>,
    badge: "3",
    content: (
      <ChatApp/>
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
        <p>Member since: 2024</p>
        <div style={{ marginTop: "12px", padding: "12px", background: "#f0f2f5", borderRadius: "12px" }}>
          <strong>Stats</strong>
          <p>📊 234 posts</p>
          <p>👥 1.2K followers</p>
        </div>
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
        <p>Language: English</p>
        <div style={{ marginTop: "12px", padding: "12px", background: "#f0f2f5", borderRadius: "12px" }}>
          <button style={{ 
            width: "100%", 
            padding: "10px", 
            background: "#e74c3c", 
            color: "white", 
            border: "none", 
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600"
          }}>
            Log Out
          </button>
        </div>
      </div>
    ),
  },
];

export default function Home() {
  const handleTabChange = (tabId: string) => {
    console.log("Tab changed to:", tabId);
  };

  return (
    <main style={{ background: "#f0f2f5", minHeight: "100vh", zIndex:"999" }}>
      <FbMenu
        tabs={myCustomTabs}
        initialTabId="profile"
        onTabChange={handleTabChange}
        swipeThreshold={0.5}
      />
    </main>
  );
}
