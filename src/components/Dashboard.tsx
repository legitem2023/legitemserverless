// app/dashboard/page.tsx
import { useState } from 'react';
import DashboardStats from "@/components/DashboardStats";
import SalesChart from "@/components/SalesChart";
import {READ_CHART_SALES} from "@/components/graphql/queries/queries";
import { useQuery } from '@apollo/client'
const Dashboard = () => {

const [usePeriod,setPeriod] = useState("Daily");
const {data:ChartData,loading:ChartLoading} = useQuery(READ_CHART_SALES,{variables:{
    period:usePeriod
}});

if(ChartLoading) return

  return (
    <div className="min-h-screen p-2 bg-gray-100">
                <div className="flex-1 flex flex-wrap relative p-2 font-bold">Dashboard</div>
          <hr></hr>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Stats Panel - Full width on mobile, 1/3 width on desktop */}
        <div className="lg:col-span-1">
          <div className="bg-white  shadow-md rounded-lg">
            <DashboardStats />
          </div>
        </div>

        {/* Sales Chart - Full width on mobile, 2/3 width on desktop */}
        <div className="lg:col-span-2">
          <div className="bg-white p-2 shadow-md rounded-lg">
            <SalesChart
              data={ChartData.readSales.map((data: any) => data.totalSales}
              labels={ChartData.readSales.map((data: any) => data.Interval)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;