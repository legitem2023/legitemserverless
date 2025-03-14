export const autoScrollTop = () => {
  const tabs = [
    "DashboardTab",
    "InventoryTab",
    "TransactionTab",
    "SalesTab",
    "StatisticsTab",
    "SettingsTab",
  ];

  tabs.forEach((tabId) => {
    const element = document.getElementById(tabId);
    if (element) {
      element.scrollTop = 0; // Scroll the element itself to top
      
    }
  });
};