import { FC, useEffect, useState } from "react";
import { Icon } from "@iconify/react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
}

const StatsCard: FC<StatsCardProps> = ({ title, value, icon, color }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 10; // 1 second
    const stepTime = Math.abs(Math.floor(duration / value));
    const timer = setInterval(() => {
      start += 1;
      setCount((prev) => (start > value ? value : start));
      if (start >= value) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="flex-grow flex-1 bg-white shadow-md rounded-lg p-2 flex items-center gap-2 border border-gray-200 transition-transform hover:scale-105">
      <div className={`p-3 rounded-full text-white ${color}`}>
        <Icon icon={icon} width={24} height={24} />
      </div>
      <div>
        <h4 className="text-sm text-gray-500">{title}</h4>
        <p className="text-xl font-semibold">{count.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default StatsCard;