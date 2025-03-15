import { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import { GET_NUM_OF_VIEWS, GET_WEBSITE_VISITS } from "./graphql/queries/queries";
const DashboardStats = () => {
  const [todaysVisit, setTodaysVisit] = useState(0);
  const [totalVisit, setTotalVisit] = useState(0);
  const [todaysViews, setTodaysViews] = useState(0);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      setTodaysVisit(120);
      setTotalVisit(12345);
      setTodaysViews(200);
      setTotalViews(56789);
    };

    fetchStats();
  }, []);

  return (
    <div className="flex flex-wrap justify-center md:justify-start gap-2 p-2">
      <StatsCard title="Today's Visit" value={todaysVisit} icon="mdi:account-multiple" color="bg-blue-500" />
      <StatsCard title="Total Visits" value={totalVisit} icon="mdi:chart-bar" color="bg-green-500" />
      <StatsCard title="Today's Views" value={todaysViews} icon="mdi:eye-outline" color="bg-yellow-500" />
      <StatsCard title="Total Views" value={totalViews} icon="mdi:eye" color="bg-red-500" />
    </div>
  );
};

export default DashboardStats;