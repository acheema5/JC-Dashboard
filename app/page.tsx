"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { QuickStatsCard } from "./components/QuickStatsCard";
import { AppointmentsOverviewCard } from "./components/AppointmentsOverviewCard";
import { HaircutAnalyticsCard } from "./components/HaircutAnalyticsCard";
import { AIInsightsCard } from "./components/AIInsightsCard";
import { CalendarCard } from "./components/CalendarCard";
import { NextAppointmentCard } from "./components/NextAppointmentCard";
import { InventoryTrackingCard } from "./components/InventoryTrackingCard";
import { DataExportCard } from "./components/DataExportCard";
import { QuickActionsCard } from "./components/QuickActionsCard";
import { fetchTransformedData } from "./dataTransformation";
import { validateAppointmentData, logWebhookConnection } from "./debugHelpers";
import { ScheduleCard } from "./components/ScheduleCard";
import {
 Appointment,
 InventoryItem,
 DashboardStats,
 ExportOptions,
} from "./types";

// Add AI insights interface
interface AIInsights {
 performanceScore: number;
 keyInsights: string[];
 peakHours: string[];
 topServices: { service: string; count: number }[];
 revenueThisWeek: number;
 recommendations: string[];
 lastUpdated: string;
 status: string;
}

interface Expense {
 date: Date;
 amount: number;
}

// Mock inventory data (unchanged)
const mockInventory: InventoryItem[] = [
 {
  id: "1",
  name: "Hair Clippers",
  quantity: 3,
  cost: 150,
  purchaseDate: new Date(2024, 11, 1),
  estimatedUsage: 30,
  restockThreshold: 2,
  autoReorder: true,
  usageRate: 0.1,
 },
 {
  id: "2",
  name: "Shampoo",
  quantity: 2,
  cost: 25,
  purchaseDate: new Date(2025, 0, 5),
  estimatedUsage: 5,
  restockThreshold: 5,
  autoReorder: false,
  usageRate: 0.4,
 },
 {
  id: "3",
  name: "Hair Gel",
  quantity: 8,
  cost: 15,
  purchaseDate: new Date(2024, 11, 20),
  estimatedUsage: 15,
  restockThreshold: 3,
  autoReorder: true,
  usageRate: 0.5,
 },
 {
  id: "4",
  name: "Towels",
  quantity: 12,
  cost: 8,
  purchaseDate: new Date(2024, 10, 15),
  estimatedUsage: 45,
  restockThreshold: 6,
  autoReorder: false,
  usageRate: 0.3,
 },
];

// Fallback mock appointments (in case webhook fails)
const fallbackAppointments: Appointment[] = [
 {
  id: "1",
  clientName: "John Smith",
  phoneNumber: "(555) 123-4567",
  haircutType: "Burst Fade",
  date: new Date(2025, 6, 20, 14, 30),
  duration: 45,
  price: 35,
  cost: 8,
  status: "scheduled",
  note: "short",
 },
 {
  id: "2",
  clientName: "Mike Johnson",
  phoneNumber: "(555) 987-6543",
  haircutType: "Buzz Cut",
  date: new Date(2025, 6, 22, 10, 0),
  duration: 25,
  price: 25,
  cost: 5,
  status: "completed",
  note: "quick fade",
 },
];

// Loading component
function LoadingSpinner() {
 return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
   <div className="text-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-800 mb-4"></div>
    <p className="text-gray-600">Loading dashboard...</p>
   </div>
  </div>
 );
}

// Login component
function LoginPage() {
 return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
   <div className="max-w-md w-full space-y-8">
    <div className="text-center">
     <h2 className="text-6xl font-bold text-blue-800 mb-6" style={{ fontFamily: "Bookmania, serif" }}>
      JC BarbieCuts
     </h2>
     <p className="text-gray-600 mb-8">Please sign in to access the dashboard</p>
     <button
      onClick={() => signIn('google')}
      className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
     >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
       <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
       <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
       <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
       <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Sign in with Google
     </button>
    </div>
   </div>
  </div>
 );
}

export default function BarberDashboard() {
 const { data: session, status } = useSession();

 // State management
 const [appointments, setAppointments] =
  useState<Appointment[]>(fallbackAppointments);
 const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
 const [inventory, setInventory] = useState(mockInventory);
 const [isLoading, setIsLoading] = useState(true);
 const [isConnectedToLiveData, setIsConnectedToLiveData] = useState(false);
 const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
 const [connectionError, setConnectionError] = useState<string | null>(null);
 const [expenses, setExpenses] = useState<Expense[]>([]);
 const [isRefreshing, setIsRefreshing] = useState(false);
 const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);

 // Fetch data from webhook
 const fetchAppointments = async () => {
  try {
   setIsLoading(true);
   setConnectionError(null);
   console.log("🔄 Fetching data from webhook...");
  

   const result = await fetchTransformedData();

   if (result.success && result.data.length > 0) {
    // Validate the appointment data
    const validation = validateAppointmentData(result.data);
    if (validation.issues.length > 0) {
     console.warn("⚠️ Data validation issues:", validation.issues);
    }

    console.log("✅ Data validation summary:", validation.summary);

    // Set appointments
    setAppointments(result.data);
    setExpenses(result.expenses);

    // Set AI insights if available
    if (result.aiInsights) {
     setAiInsights(result.aiInsights);
     console.log("🤖 AI insights loaded:", result.aiInsights);
    } else {
     console.log("🤖 No AI insights in response");
    }

    setIsConnectedToLiveData(true);
    setLastUpdateTime(new Date());

    logWebhookConnection(
     process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "Not configured",
     true,
     result.data
    );

    console.log(`📊 Loaded ${result.data.length} appointments from webhook`);
   } else {
    throw new Error(result.error || "No data received from webhook");
   }
  } catch (error) {
   console.error("❌ Failed to fetch webhook data:", error);
   setConnectionError(error instanceof Error ? error.message : "Unknown error");
   setIsConnectedToLiveData(false);

   logWebhookConnection(
    process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "Not configured",
    false,
    null,
    error instanceof Error ? error.message : "Unknown error"
   );

   // Keep fallback data if webhook fails
   console.log("📋 Using fallback mock data");
  } finally {
   setIsLoading(false);
  }
 };

 const handleRefreshData = async () => {
  try {
   setIsRefreshing(true);
   console.log("🔄 Triggering data refresh...");

   // Call the n8n webhook to trigger haircut_scraping workflow
   const refreshResponse = await fetch(
    process.env.NEXT_PUBLIC_N8N_REFRESH_WEBHOOK_URL!,
    {
     method: "GET",
     headers: {
      Accept: "application/json",
     },
    }
   );

   if (!refreshResponse.ok) {
    throw new Error(`Refresh failed: ${refreshResponse.status}`);
   }

   const refreshResult = await refreshResponse.json();
   console.log("✅ Data refresh completed:", refreshResult);

   // Wait a moment for data to be processed, then fetch updated appointments
   setTimeout(() => {
    fetchAppointments();
   }, 3000);

   setLastRefreshTime(new Date());
   alert("Data refresh completed successfully!");
  } catch (error) {
   console.error("❌ Data refresh failed:", error);
   alert("Data refresh failed. Please try again.");
  } finally {
   setIsRefreshing(false);
  }
 };

 // Initial data fetch and auto-refresh
 useEffect(() => {
  if (session) {
   fetchAppointments();
   // Set up auto-refresh every 5 minutes
   const interval = setInterval(fetchAppointments, 5 * 60 * 1000);
   return () => clearInterval(interval);
  }
 }, [session]);

 // Show loading while checking session
 if (status === "loading") {
  return <LoadingSpinner />;
 }

 // Show login if not authenticated
 if (status === "unauthenticated") {
  return <LoginPage />;
 }

 // Calculate dashboard statistics
 const completedAppointments = appointments.filter(
  (apt) => apt.status === "completed"
 );
 const totalRevenue = completedAppointments.reduce(
  (sum, apt) => sum + apt.price,
  0
 );
 const totalCosts = completedAppointments.reduce(
  (sum, apt) => sum + apt.cost,
  0
 );

  const totalExpenses = expenses.reduce(
   (sum, expense) => sum + expense.amount,
   0
  );

  const totalSpending = totalExpenses > 0 ? totalExpenses : 940;
 const totalProfit = totalRevenue - totalSpending;
 const avgProfitPerCut =
  completedAppointments.length > 0
   ? Math.round(totalProfit / completedAppointments.length)
   : 0;

 const today = new Date();
 const todayAppointments = appointments.filter(
  (apt) => apt.date.toDateString() === today.toDateString()
 ).length;

 const weekStart = new Date(today);
 weekStart.setDate(today.getDate() - today.getDay());
 const weekAppointments = appointments.filter(
  (apt) => apt.date >= weekStart
 ).length;

 const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
 const monthAppointments = appointments.filter(
  (apt) => apt.date >= monthStart
 ).length;

 const yearStart = new Date(today.getFullYear(), 0, 1);
 const yearAppointments = appointments.filter(
  (apt) => apt.date >= yearStart
 ).length;

 // Calculate most common cut
 const cutCounts = appointments.reduce((acc, apt) => {
  acc[apt.haircutType] = (acc[apt.haircutType] || 0) + 1;
  return acc;
 }, {} as Record<string, number>);

 const mostCommonCut =
  Object.entries(cutCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "No data";

 // Calculate day analysis
 const dayCounts = appointments.reduce((acc, apt) => {
  const day = apt.date.toLocaleDateString("en-US", { weekday: "long" });
  acc[day] = (acc[day] || 0) + 1;
  return acc;
 }, {} as Record<string, number>);

 const slowestDay =
  Object.entries(dayCounts).sort(([, a], [, b]) => a - b)[0]?.[0] || "Monday";

 const busiestDay =
  Object.entries(dayCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "Friday";

 const dashboardStats: DashboardStats = {
  revenue: totalRevenue,
  spending: totalSpending,
  profit: totalProfit,
  totalBookings: {
   today: todayAppointments,
   week: weekAppointments,
   month: monthAppointments,
   year: yearAppointments,
  },
  avgRevenuePerCut:
   completedAppointments.length > 0
    ? Math.round(totalRevenue / completedAppointments.length)
    : 0,
  avgProfitPerCut,
  mostCommonCut,
  slowestDay,
  busiestDay,
 };

 // Find next appointment
 const nextAppointment = appointments
  .filter(
   (apt) => apt.status === "scheduled" && new Date(apt.date) > new Date()
  )
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

 // Event handlers
 const handleRunningLate = () => {
  if (nextAppointment) {
   alert(
    `SMS sent to ${nextAppointment.clientName} (${nextAppointment.phoneNumber}): "Hey! Running 5 minutes behind, see you soon."`
   );
  }
 };

 const handleExportCSV = (options: ExportOptions) => {
  console.log("Exporting data with options:", options);
 };

 const handleReorderItem = (itemId: string) => {
  const item = inventory.find((i) => i.id === itemId);
  if (item) {
   alert(
    `Reorder request sent for ${item.name}. ${
     item.autoReorder ? "Auto-reorder is enabled." : "Manual reorder required."
    }`
   );
  }
 };

 const handleUpdateThreshold = (itemId: string, threshold: number) => {
  setInventory((prev) =>
   prev.map((item) =>
    item.id === itemId ? { ...item, restockThreshold: threshold } : item
   )
  );
 };

 const handleToggleAutoReorder = (itemId: string) => {
  setInventory((prev) =>
   prev.map((item) =>
    item.id === itemId ? { ...item, autoReorder: !item.autoReorder } : item
   )
  );
 };

 const handleSendSMS = (message: string) => {
  alert(`SMS sent to clients: "${message}"`);
 };

 const handleCreatePromotion = (service: string) => {
  alert(`Promotion created for ${service}`);
 };

 const handleSendFollowUp = (appointment: Appointment) => {
  const message = `Hi ${appointment.clientName}! Hope you enjoyed your ${appointment.haircutType}! Book your next appointment: [booking-link]`;
  alert(
   `Follow-up SMS sent to ${appointment.clientName} (${appointment.phoneNumber}): "${message}"`
  );
 };

 return (
  <div className="min-h-screen bg-gray-100 p-4">
    <div className="container mx-auto px-4 py-4">
   {/* Top Bar with User Info and Sign Out */}
   <div className="mb-4 flex justify-between items-center">
    <div className="flex items-center space-x-3">
     {session?.user?.image && (
      <img
       src={session.user.image}
       alt="Profile"
       className="w-8 h-8 rounded-full"
      />
     )}
     <span className="text-sm text-gray-600">
      Welcome, {session?.user?.name || session?.user?.email}
     </span>
    </div>
    <div className="flex items-center space-x-4">
     <a
      href="https://docs.google.com/spreadsheets/d/1BkhpwheJbR90wpwU5NpR7URHjrVKyAqNOe3iyF_M4f0/edit"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
     >
      <svg
       xmlns="http://www.w3.org/2000/svg"
       fill="currentColor"
       viewBox="0 0 24 24"
       className="w-4 h-4"
      >
       <path d="M19.615 3.184A1.5 1.5 0 0018.382 2H6.75A1.75 1.75 0 005 3.75v16.5A1.75 1.75 0 006.75 22h10.5A1.75 1.75 0 0019 20.25V4.118a1.5 1.5 0 00-.385-0.934zM8 5h7v2H8V5zm0 4h5v2H8V9zm0 4h7v2H8v-2zm0 4h5v2H8v-2z" />
      </svg>
      <span>Open Appointment Sheet</span>
     </a>
     <button
      onClick={() => signOut()}
      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
     >
      <svg
       xmlns="http://www.w3.org/2000/svg"
       fill="none"
       viewBox="0 0 24 24"
       strokeWidth={1.5}
       stroke="currentColor"
       className="w-4 h-4"
      >
       <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
       />
      </svg>
      <span>Sign Out</span>
     </button>
    </div>
   </div>

   {/* Header */}
   <div className="text-center mb-8">
    <h1
     className="text-5xl font-bold text-blue-800 mb-2 
                    transition-transform transition-colors duration-300 ease-in-out
                    hover:text-purple-500 hover:scale-105
                    "
     style={{ fontFamily: "Bookmania, serif" }}
    >
     JC BarbieCuts Dashboard
    </h1>
   </div>

   {/* Connection Status */}
   <div className="mb-6 flex items-center justify-center space-x-4">
    <div className="flex items-center space-x-2">
     <div
      className={`w-3 h-3 rounded-full ${
       isConnectedToLiveData ? "bg-green-500" : "bg-red-500"
      }`}
     ></div>
     <span
      className={`text-sm font-medium ${
       isConnectedToLiveData ? "text-green-700" : "text-red-700"
      }`}
     >
      {isConnectedToLiveData ? "Connected to Live Data" : "Using Mock Data"}
     </span>
    </div>

    {lastRefreshTime && (
     <span className="text-xs text-gray-500">
      Last refresh: {lastRefreshTime.toLocaleTimeString()}
     </span>
    )}

    <div className="flex items-center space-x-3">
     {/* Refresh Data Button */}
     <button
      onClick={handleRefreshData}
      disabled={isRefreshing}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
       isRefreshing
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 text-white"
      }`}
     >
      <svg
       className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
       fill="none"
       stroke="currentColor"
       viewBox="0 0 24 24"
      >
       <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
       />
      </svg>
      <span>{isRefreshing ? "Refreshing..." : "Refresh Data"}</span>
     </button>
    </div>

    {lastUpdateTime && (
     <span className="text-sm text-gray-500">
      Last updated: {lastUpdateTime.toLocaleTimeString()}
     </span>
    )}

    {isLoading && (
     <span className="text-sm text-blue-600">🔄 Refreshing data...</span>
    )}

    {connectionError && (
     <span className="text-sm text-red-600">
      Connection Error: {connectionError}
     </span>
    )}
   </div>

   {/* Row 1: Quick Stats */}
   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <QuickStatsCard
     type="revenue"
     stats={dashboardStats}
     appointments={appointments}
    />
    <QuickStatsCard
     type="spending"
     stats={dashboardStats}
     appointments={appointments}
    />
    <QuickStatsCard
     type="profit"
     stats={dashboardStats}
     appointments={appointments}
    />
   </div>

   {/* Row 2: Next Appointment | Appointments Overview | AI Insights */}
   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
    <NextAppointmentCard
     clientName={nextAppointment?.clientName || "No upcoming appointments"}
     service={nextAppointment?.haircutType || ""}
     time={nextAppointment?.date || new Date()}
     duration={nextAppointment?.duration || 0}
     phoneNumber={nextAppointment?.phoneNumber || ""}
     note={nextAppointment?.note || ""}
    />
    <AppointmentsOverviewCard
     stats={dashboardStats}
     appointments={appointments}
     //nextAppointment={nextAppointment || null}
     //onRunningLate={handleRunningLate}
    />
    <AIInsightsCard
     stats={dashboardStats}
     appointments={appointments}
     inventory={inventory}
     aiInsights={aiInsights}
     onSendFollowUp={handleSendFollowUp}
     onSendSMS={handleSendSMS}
     onCreatePromotion={handleCreatePromotion}
    />
   </div>

   {/* Row 3: Calendar | Haircut Analytics | Quick Actions */}
   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <CalendarCard appointments={appointments} />
    <HaircutAnalyticsCard stats={dashboardStats} appointments={appointments} />
    <div className="space-y-6">
     <QuickActionsCard
      onSendSMS={handleSendSMS}
      onCreatePromotion={handleCreatePromotion}
     />
    </div>
   </div>
   
   {/* Row 4: Full Width Weekly Schedule */}
   <div className="grid grid-cols-1 mt-6">
    <ScheduleCard appointments={appointments} />
    </div>
   </div>
  </div>
 );
}