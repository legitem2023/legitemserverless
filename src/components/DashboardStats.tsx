// components/DashboardStats.tsx
"use client";

import { useEffect, useState } from "react";
import StatsCard from "./StatsCard";

const DashboardStats = () => {
  const [todaysVisit, setTodaysVisit] = useState(0);
  const [totalVisit, setTotalVisit] = useState(0);
  const [todaysViews, setTodaysViews] = useState(0);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    // Sample fetching function (palitan mo ng actual API call mo)
    const fetchStats = async () => {
      // Dummy values (palitan mo ito ng actual data from GraphQL/API)
      setTodaysVisit(120);
      setTotalVisit(12345);
      setTodaysViews(200);
      setTotalViews(56789);
    };

    fetchStats();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-4">
      <StatsCard title="Today's Visit" value={todaysVisit} icon="mdi:account-multiple" color="bg-blue-500" />
      <StatsCard title="Total Visits" value={totalVisit} icon="mdi:chart-bar" color="bg-green-500" />
      <StatsCard title="Today's Views" value={todaysViews} icon="mdi:eye-outline" color="bg-yellow-500" />
      <StatsCard title="Total Views" value={totalViews} icon="mdi:eye" color="bg-red-500" />
    </div>
  );
};

export default DashboardStats;