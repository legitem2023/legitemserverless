"use client";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions } from "chart.js";
import { useState } from "react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type IntervalType = "daily" | "weekly" | "monthly" | "yearly";

interface SalesChartProps {
  data: number[];
  labels: string[];
}

// ... (keep the existing getWeekNumber and processData functions)

const SalesChart: React.FC<SalesChartProps> = ({ data, labels }) => {
  const [selectedInterval, setSelectedInterval] = useState<IntervalType>("daily");
  
  // ... (keep existing processData logic)

  return (
    <div className="w-full h-[300px] p-2 bg-white shadow rounded">
      <div className="flex flex-col mb-2 space-y-2">
        <h2 className="text-base font-semibold">Sales Overview</h2>
        <div className="flex overflow-x-auto pb-2 space-x-2">
          {(["daily", "weekly", "monthly", "yearly"] as IntervalType[]).map((interval) => (
            <button
              key={interval}
              onClick={() => setSelectedInterval(interval)}
              className={`px-2 py-1 rounded text-xs min-w-[60px] ${
                selectedInterval === interval
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {interval.charAt(0).toUpperCase() + interval.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[200px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};