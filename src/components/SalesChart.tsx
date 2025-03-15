"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type IntervalType = "daily" | "weekly" | "monthly" | "yearly";

interface SalesChartProps {
  data: number[];
  labels: string[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data, labels }) => {
  const [selectedInterval, setSelectedInterval] = useState<IntervalType>("daily");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7; // Bilang ng araw per page sa daily view

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const processData = () => {
    let processedLabels = labels;
    let processedData = data;
    let totalPages = 1;

    if (selectedInterval === "daily") {
      totalPages = Math.ceil(labels.length / itemsPerPage);
      const start = currentPage * itemsPerPage;
      const end = start + itemsPerPage;
      processedLabels = labels.slice(start, end);
      processedData = data.slice(start, end);
    }

    return { processedLabels, processedData, totalPages };
  };

  const { processedLabels, processedData, totalPages } = processData();

  const chartData = {
    labels: processedLabels,
    datasets: [
      {
        label: "Sales",
        data: processedData,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        pointRadius: isMobile ? 2 : 4,
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: !isMobile,
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        type: "category",
        grid: {
          display: false,
        },
      },
      y: {
        type: "linear",
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  return (
    <div className="w-full p-4 bg-white shadow rounded h-64 sm:h-72 md:h-80">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Sales Overview</h2>
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap">
          {(["daily", "weekly", "monthly", "yearly"] as IntervalType[]).map((interval) => (
            <button
              key={interval}
              onClick={() => {
                setSelectedInterval(interval);
                setCurrentPage(0); // Reset sa unang page
              }}
              className={`px-3 py-1 rounded text-sm ${
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
      <div className="h-48">
        <Line data={chartData} options={options} />
      </div>

      {/* Pagination Controls (for Daily View) */}
      {selectedInterval === "daily" && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          <button 
            disabled={currentPage === 0} 
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1 bg-gray-100 rounded text-sm">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button 
            disabled={currentPage >= (totalPages - 1)}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SalesChart;