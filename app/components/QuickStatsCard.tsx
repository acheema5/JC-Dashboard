"use client";

import {
 CurrencyDollarIcon,
 BanknotesIcon,
 ChartBarIcon,
 ArrowTrendingUpIcon,
 ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import { Appointment, DashboardStats } from "../types";

interface QuickStatsCardProps {
 stats: DashboardStats;
 appointments: Appointment[];
 type: "revenue" | "spending" | "profit" | "bookings";
}

export function QuickStatsCard({
 stats,
 appointments,
 type,
}: QuickStatsCardProps) {
 // Calculate current period data (last 30 days)
 const getCurrentPeriodData = () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  /*const [selectedMetric, setSelectedMetric] = useState<
    'revenue' | 'spending' | 'profit'
  >('revenue');*/

  /*const metrics = {
    revenue: {
      value: revenue,
      change: revenueChange,
      textColor: 'text-white-400',
      bgColor: 'bg-gradient-to-br from-green-600 to-green-800',
      borderColor: 'border-green-700',
      icon: <CurrencyDollarIcon className="h-6 w-6 text-green-400" />,
    },
    spending: {
      value: spending,
      change: spendingChange,
      textColor: 'text-white-400',
      bgColor: 'bg-gradient-to-br from-red-600 to-red-800',
      borderColor: 'border-red-700',
      icon: <ArrowTrendingDownIcon className="h-6 w-6 text-red-400" />,
    },
    profit: {
      value: profit,
      change: profitChange,
      textColor: 'text-white-400',
      bgColor: 'bg-gradient-to-br from-purple-600 via-blue-700 to-slate-800',
      borderColor: 'border-blue-700',
      icon: <ArrowTrendingUpIcon className="h-6 w-6 text-blue-400" />,
    },
  };*/

  const currentPeriodAppointments = appointments.filter(
   (apt) => apt.status === "completed" && new Date(apt.date) >= thirtyDaysAgo
  );

  const revenue = currentPeriodAppointments.reduce(
   (sum, apt) => sum + apt.price,
   0
  );
  const costs = currentPeriodAppointments.reduce(
   (sum, apt) => sum + apt.cost,
   0
  );
  const profit = revenue - costs;

  return {
   revenue,
   spending: costs,
   profit,
   bookings: currentPeriodAppointments.length,
  };
 };

 // Calculate previous period data (30 days before that)
 const getPreviousPeriodData = () => {
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const previousPeriodAppointments = appointments.filter(
   (apt) =>
    apt.status === "completed" &&
    new Date(apt.date) >= sixtyDaysAgo &&
    new Date(apt.date) < thirtyDaysAgo
  );

  const revenue = previousPeriodAppointments.reduce(
   (sum, apt) => sum + apt.price,
   0
  );
  const costs = previousPeriodAppointments.reduce(
   (sum, apt) => sum + apt.cost,
   0
  );
  const profit = revenue - costs;

  return {
   revenue,
   spending: costs,
   profit,
   bookings: previousPeriodAppointments.length,
  };
 };

 const currentData = getCurrentPeriodData();
 const previousData = getPreviousPeriodData();

 // Calculate percentage change
 const calculateChange = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
 };

 // Get card configuration based on type
 const getCardConfig = () => {
  switch (type) {
   case "revenue":
    return {
     title: "Revenue",
     value: currentData.revenue,
     previousValue: previousData.revenue,
     icon: <CurrencyDollarIcon className="w-6 h-6" />,
     bgColor: "bg-gradient-to-r from-green-500 to-green-600",
     format: (val: number) => `$${val.toLocaleString()}`,
    };
   case "spending":
    return {
     title: "Spending",
     value: currentData.spending,
     previousValue: previousData.spending,
     icon: <BanknotesIcon className="w-6 h-6" />,
     bgColor: "bg-gradient-to-r from-red-500 to-red-600",
     format: (val: number) => `$${val.toLocaleString()}`,
    };
   case "profit":
    return {
     title: "Profit",
     value: currentData.profit,
     previousValue: previousData.profit,
     icon: <ChartBarIcon className="w-6 h-6" />,
     bgColor: "bg-gradient-to-r from-blue-500 to-blue-600",
     format: (val: number) => `$${val.toLocaleString()}`,
    };
   case "bookings":
    return {
     title: "Total Bookings",
     value: currentData.bookings,
     previousValue: previousData.bookings,
     icon: <ChartBarIcon className="w-6 h-6" />,
     bgColor: "bg-gradient-to-r from-purple-500 to-purple-600",
     format: (val: number) => val.toString(),
    };
   default:
    return {
     title: "Revenue",
     value: currentData.revenue,
     previousValue: previousData.revenue,
     icon: <CurrencyDollarIcon className="w-6 h-6" />,
     bgColor: "bg-gradient-to-r from-green-500 to-green-600",
     format: (val: number) => `$${val.toLocaleString()}`,
    };
  }
 };

 const config = getCardConfig();
 const change = calculateChange(config.value, config.previousValue);
 const isPositive = change > 0;
 const isNegative = change < 0;

 return (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
   <div className={`${config.bgColor} p-4`}>
    <div className="flex items-center justify-between text-white">
     <div className="flex items-center space-x-3">
      {config.icon}
      <h3 className="text-lg font-semibold">{config.title}</h3>
     </div>
     <div className="text-right">
      <div className="text-2xl font-bold">{config.format(config.value)}</div>
      <div className="text-sm opacity-90">Last 30 days</div>
     </div>
    </div>
   </div>

   <div className="p-4">
    <div className="flex items-center justify-between">
     <div className="text-sm text-gray-600">vs previous 30 days</div>
     <div
      className={`flex items-center space-x-1 text-sm font-medium ${
       isPositive
        ? "text-green-600"
        : isNegative
        ? "text-red-600"
        : "text-gray-600"
      }`}
     >
      {isPositive && <ArrowTrendingUpIcon className="w-4 h-4" />}
      {isNegative && <ArrowTrendingDownIcon className="w-4 h-4" />}
      <span>
       {change > 0 ? "+" : ""}
       {change}%
      </span>
     </div>
    </div>

    <div className="mt-2 text-xs text-gray-500">
     Previous: {config.format(config.previousValue)}
    </div>
   </div>
  </div>
 );
}
