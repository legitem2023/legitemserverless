// app/dashboard/page.tsx
import DashboardStats from "@/components/DashboardStats";
import SalesChart from "@/components/SalesChart";

const Dashboard = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Panel - Full width on mobile, 1/3 width on desktop */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 shadow-md rounded-lg">
            <DashboardStats />
          </div>
        </div>

        {/* Sales Chart - Full width on mobile, 2/3 width on desktop */}
        <div className="lg:col-span-2">
          <div className="bg-white p-4 shadow-md rounded-lg">
            <SalesChart
              data={[120, 200, 150, 300]}
              labels={["2024-03-01", "2024-03-02", "2024-03-03", "2024-03-04"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;