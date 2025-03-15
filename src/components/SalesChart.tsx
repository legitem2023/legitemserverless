import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Timeframe = "daily" | "weekly" | "monthly";

const SalesChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>("daily");

  // Mock sales data
  const salesData = {
    daily: {
      labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      data: [120, 200, 150, 300, 250, 400, 500],
    },
    weekly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [3000, 4200, 3800, 5000],
    },
    monthly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      data: [15000, 18000, 20000, 22000, 25000, 23000, 28000, 30000, 31000, 29000, 27000, 35000],
    },
  };

  const chartData = {
    labels: salesData[timeframe].labels,
    datasets: [
      {
        label: `Sales (${timeframe})`,
        data: salesData[timeframe].data,
        fill: false,
        borderColor: "#3b82f6",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-4 shadow-lg rounded-lg">
      <div className="flex justify-center gap-3 mb-4">
        {["daily", "weekly", "monthly"].map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf as Timeframe)}
            className={`px-4 py-2 text-sm font-semibold rounded-md ${
              timeframe === tf ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {tf.charAt(0).toUpperCase() + tf.slice(1)}
          </button>
        ))}
      </div>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SalesChart;