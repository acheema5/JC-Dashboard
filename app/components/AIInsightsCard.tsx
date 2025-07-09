"use client";

import { DashboardStats, Appointment, InventoryItem } from "../types";
import { useState } from "react";
import {
 LightBulbIcon,
 SparklesIcon,
 ChatBubbleLeftRightIcon,
 MegaphoneIcon,
 ChartBarIcon,
 ClockIcon,
 TrophyIcon,
 CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../button";
import { ExpandableCard } from "./ExpandableCard";

// AI Insights interface (matching the webhook response)
export interface AIInsights {
 performanceScore: number;
 keyInsights: string[];
 peakHours: string[];
 topServices: { service: string; count: number }[];
 revenueThisWeek: number;
 recommendations: string[];
 lastUpdated: string;
 status: string;
}

interface AIInsightsCardProps {
 onSendSMS: (message: string) => void;
 onCreatePromotion: (service: string) => void;
 stats: DashboardStats;
 appointments: Appointment[];
 inventory: InventoryItem[];
 aiInsights: AIInsights | null;
 onSendFollowUp: (appointment: Appointment) => void;
}

export function AIInsightsCard({
 onSendSMS,
 onCreatePromotion,
 stats,
 appointments,
 inventory,
 aiInsights,
 onSendFollowUp,
}: AIInsightsCardProps) {
 const [selectedTab, setSelectedTab] = useState<
  "insights" | "recommendations" | "performance"
 >("insights");

 // Fallback mock data when AI insights are not available
 const fallbackInsights: AIInsights = {
  performanceScore: 75,
  keyInsights: [
   "Revenue increased 15% this month",
   "Most popular service is Line Up",
   "Peak hours: 2-4 PM weekdays",
  ],
  peakHours: ["2:00 PM - 4:00 PM"],
  topServices: [
   { service: "Line Up", count: 12 },
   { service: "Mullet", count: 8 },
  ],
  revenueThisWeek: 850,
  recommendations: [
   "Consider extending hours during peak times",
   "Promote less popular services with discounts",
   "Implement appointment reminders to reduce no-shows",
  ],
  lastUpdated: new Date().toISOString(),
  status: "mock",
 };

 const insights = aiInsights || fallbackInsights;
 const isLiveData = !!aiInsights;

 const getPerformanceColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
 };

 const getPerformanceText = (score: number) => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  return "Needs Improvement";
 };

 const getPerformanceIcon = (score: number) => {
  if (score >= 80) return "🎉";
  if (score >= 60) return "👍";
  return "⚠️";
 };

 // Collapsed content - shows performance score and data status
 const collapsedContent = (
  <div className="flex items-center justify-between">
   <div className="flex items-center space-x-4">
    <div className="flex items-center space-x-2">
     <SparklesIcon className="w-5 h-5 text-purple-600" />
     <span className="text-sm font-medium">Performance Score</span>
    </div>
    <div className="flex items-center space-x-2">
     <span
      className={`text-2xl font-bold ${getPerformanceColor(
       insights.performanceScore
      )}`}
     >
      {insights.performanceScore}%
     </span>
     <span className="text-lg">
      {getPerformanceIcon(insights.performanceScore)}
     </span>
     <span className="text-sm text-gray-500">
      {getPerformanceText(insights.performanceScore)}
     </span>
    </div>
   </div>

   <div className="flex items-center space-x-2">
    <div
     className={`w-2 h-2 rounded-full ${
      isLiveData ? "bg-green-500" : "bg-orange-500"
     }`}
    ></div>
    <span className="text-xs text-gray-500">
     {isLiveData ? "Live AI Data" : "Using Mock Data"}
    </span>
    {isLiveData && (
     <span className="text-xs text-gray-400">
      {new Date(insights.lastUpdated).toLocaleString()}
     </span>
    )}
   </div>
  </div>
 );

 // Expanded content - shows detailed insights with tabs
 const expandedContent = (
  <div className="space-y-6">
   {/* Tab Navigation */}
   <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
    {[
     { key: "insights", label: "Key Insights", icon: LightBulbIcon },
     { key: "recommendations", label: "Recommendations", icon: ChartBarIcon },
     { key: "performance", label: "Performance", icon: TrophyIcon },
    ].map(({ key, label, icon: Icon }) => (
     <button
      key={key}
      onClick={() => setSelectedTab(key as typeof selectedTab)}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
       selectedTab === key
        ? "bg-white text-purple-700 shadow-sm"
        : "text-gray-600 hover:text-gray-900"
      }`}
     >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
     </button>
    ))}
   </div>

   {/* Key Insights Tab */}
   {selectedTab === "insights" && (
    <div className="space-y-4">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
       <div className="flex items-center space-x-2 mb-2">
        <CurrencyDollarIcon className="w-5 h-5 text-blue-600" />
        <h4 className="font-medium text-blue-900">Revenue This Week</h4>
       </div>
       <p className="text-2xl font-bold text-blue-700">
        ${insights.revenueThisWeek}
       </p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
       <div className="flex items-center space-x-2 mb-2">
        <ClockIcon className="w-5 h-5 text-green-600" />
        <h4 className="font-medium text-green-900">Peak Hours</h4>
       </div>
       <p className="text-sm text-green-700">{insights.peakHours.join(", ")}</p>
      </div>
     </div>

     <div>
      <h4 className="font-medium text-gray-900 mb-3">Key Business Insights</h4>
      <div className="space-y-2">
       {insights.keyInsights.map((insight, index) => (
        <div key={index} className="flex items-start space-x-2">
         <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
         <p className="text-sm text-gray-700">{insight}</p>
        </div>
       ))}
      </div>
     </div>

     <div>
      <h4 className="font-medium text-gray-900 mb-3">Top Services</h4>
      <div className="space-y-2">
       {insights.topServices.map((service, index) => (
        <div
         key={index}
         className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
        >
         <span className="text-sm font-medium text-gray-900">
          {service.service}
         </span>
         <span className="text-sm text-gray-600">{service.count} bookings</span>
        </div>
       ))}
      </div>
     </div>
    </div>
   )}

   {/* Recommendations Tab */}
   {selectedTab === "recommendations" && (
    <div className="space-y-4">
     <h4 className="font-medium text-gray-900">AI-Powered Recommendations</h4>
     <div className="space-y-3">
      {insights.recommendations.map((recommendation, index) => (
       <div
        key={index}
        className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
       >
        <div className="flex items-start space-x-3">
         <LightBulbIcon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
         <div>
          <p className="text-sm text-yellow-800">{recommendation}</p>
         </div>
        </div>
       </div>
      ))}
     </div>

     <div className="mt-4 pt-4 border-t border-gray-200">
      <h5 className="font-medium text-gray-900 mb-3">Quick Actions</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
       <button
        onClick={() =>
         onSendSMS("Special offer: Book your next haircut and get 10% off!")
        }
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
       >
        Send Promotion SMS
       </button>
       <button
        onClick={() => onCreatePromotion("Hair Services")}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
       >
        Create Service Promotion
       </button>
      </div>
     </div>
    </div>
   )}

   {/* Performance Tab */}
   {selectedTab === "performance" && (
    <div className="space-y-4">
     <div className="text-center">
      <div
       className={`text-6xl font-bold ${getPerformanceColor(
        insights.performanceScore
       )} mb-2`}
      >
       {insights.performanceScore}%
      </div>
      <p className="text-lg text-gray-600">
       {getPerformanceText(insights.performanceScore)}{" "}
       {getPerformanceIcon(insights.performanceScore)}
      </p>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="text-center p-4 bg-gray-50 rounded-lg">
       <div className="text-2xl font-bold text-gray-900">
        {appointments.length}
       </div>
       <div className="text-sm text-gray-600">Total Appointments</div>
      </div>
      <div className="text-center p-4 bg-gray-50 rounded-lg">
       <div className="text-2xl font-bold text-gray-900">${stats.revenue}</div>
       <div className="text-sm text-gray-600">Total Revenue</div>
      </div>
      <div className="text-center p-4 bg-gray-50 rounded-lg">
       <div className="text-2xl font-bold text-gray-900">
        ${stats.avgRevenuePerCut}
       </div>
       <div className="text-sm text-gray-600">Avg Revenue/Cut</div>
      </div>
     </div>

     <div className="mt-4 p-3 bg-blue-50 rounded-lg">
      <div className="flex items-center space-x-2">
       <div
        className={`w-2 h-2 rounded-full ${
         isLiveData ? "bg-blue-500" : "bg-orange-500"
        }`}
       ></div>
       <span className="text-sm text-blue-700">
        {isLiveData ? (
         <>Last updated: {new Date(insights.lastUpdated).toLocaleString()}</>
        ) : (
         "Using fallback data - AI insights not available"
        )}
       </span>
      </div>
     </div>

     {!isLiveData && (
      <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
       <div className="flex items-center space-x-2">
        <span className="text-sm text-orange-700">
         ⚠️ AI insights are currently unavailable. Performance metrics
         calculated from appointment data.
        </span>
       </div>
      </div>
     )}
    </div>
   )}
  </div>
 );

 return (
  <ExpandableCard
   title="AI Business Insights"
   subtitle={`${isLiveData ? "Live AI Analysis" : "Fallback Data"}`}
   icon={<SparklesIcon className="w-5 h-5 text-purple-600" />}
   variant="info"
   collapsedContent={collapsedContent}
   defaultExpanded={false}
  >
   {expandedContent}
  </ExpandableCard>
 );
}
