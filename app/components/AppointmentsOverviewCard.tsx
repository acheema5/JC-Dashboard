"use client";

import { useState } from "react";
import {
 CalendarIcon,
 ClockIcon,
 PhoneIcon,
 ExclamationTriangleIcon,
 UserIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../button";
import { ExpandableCard } from "./ExpandableCard";
import { Appointment, DashboardStats } from "../types";

interface AppointmentsOverviewCardProps {
 stats: DashboardStats;
 appointments: Appointment[];
 nextAppointment: Appointment | null;
 onRunningLate: () => void;
}

export function AppointmentsOverviewCard({
 stats,
 appointments,
 nextAppointment,
 onRunningLate,
}: AppointmentsOverviewCardProps) {
 const [viewMode, setViewMode] = useState<"today" | "week" | "month" | "year">(
  "week"
 );
 const [statusFilter, setStatusFilter] = useState<
  "all" | "scheduled" | "completed"
 >("all");

 const getFilteredAppointments = () => {
  const now = new Date();
  let filteredByTime: Appointment[] = [];

  switch (viewMode) {
   case "today":
    filteredByTime = appointments.filter(
     (apt) => apt.date.toDateString() === now.toDateString()
    );
    break;
   case "week":
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    filteredByTime = appointments.filter((apt) => apt.date >= weekStart);
    break;
   case "month":
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    filteredByTime = appointments.filter((apt) => apt.date >= monthStart);
    break;
   case "year":
    const yearStart = new Date(now.getFullYear(), 0, 1);
    filteredByTime = appointments.filter((apt) => apt.date >= yearStart);
    break;
  }

  if (statusFilter === "all") return filteredByTime;
  return filteredByTime.filter((apt) => apt.status === statusFilter);
 };

 const filteredAppointments = getFilteredAppointments();
 const totalRevenue = filteredAppointments
  .filter((apt) => apt.status === "completed")
  .reduce((sum, apt) => sum + apt.price, 0);

 const getBookingCount = () => {
  switch (viewMode) {
   case "today":
    return stats.totalBookings.today;
   case "week":
    return stats.totalBookings.week;
   case "month":
    return stats.totalBookings.month;
   case "year":
    return stats.totalBookings.year;
  }
 };

 const collapsedContent = (
  <div className="space-y-3">
   <div className="text-center">
    <div className="text-2xl font-bold text-gray-900">{getBookingCount()}</div>
    <div className="text-sm text-gray-600">bookings this {viewMode}</div>
   </div>

   {nextAppointment && (
    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
     <div className="flex items-center space-x-2 text-blue-800 font-medium text-sm mb-2">
      <ClockIcon className="w-4 h-4" />
      <span>NEXT APPOINTMENT</span>
     </div>
     <div className="space-y-1 text-sm">
      <div className="flex items-center space-x-2">
       <UserIcon className="w-4 h-4 text-gray-500" />
       <span className="font-medium">{nextAppointment.clientName}</span>
      </div>
      <div className="flex items-center space-x-2">
       <CalendarIcon className="w-4 h-4 text-gray-500" />
       <span>{nextAppointment.haircutType}</span>
      </div>
      <div className="flex items-center space-x-2">
       <ClockIcon className="w-4 h-4 text-gray-500" />
       <span>
        {nextAppointment.date.toLocaleTimeString([], {
         hour: "2-digit",
         minute: "2-digit",
        })}{" "}
        ({nextAppointment.duration} min)
       </span>
      </div>
      <div className="flex items-center space-x-2">
       <PhoneIcon className="w-4 h-4 text-gray-500" />
       <span>{nextAppointment.phoneNumber}</span>
      </div>
     </div>
    </div>
   )}
  </div>
 );

 const expandedContent = (
  <div className="space-y-4">
   {/* View Mode Selector */}
   <div className="flex space-x-2">
    {(["today", "week", "month", "year"] as const).map((mode) => (
     <button
      key={mode}
      onClick={() => setViewMode(mode)}
      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
       viewMode === mode
        ? "bg-purple-100 text-purple-700 border border-purple-300"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
     >
      {mode.charAt(0).toUpperCase() + mode.slice(1)}
     </button>
    ))}
   </div>

   {/* Status Filter */}
   <div className="flex space-x-2">
    {(["all", "scheduled", "completed"] as const).map((status) => (
     <button
      key={status}
      onClick={() => setStatusFilter(status)}
      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
       statusFilter === status
        ? "bg-blue-100 text-blue-700 border border-blue-300"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
     >
      {status.charAt(0).toUpperCase() + status.slice(1)}
     </button>
    ))}
   </div>

   {/* Appointments List */}
   <div className="max-h-64 overflow-y-auto space-y-2">
    {filteredAppointments.length > 0 ? (
     filteredAppointments
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((appointment) => (
       <div
        key={appointment.id}
        className={`p-3 rounded-lg border ${
         appointment.status === "completed"
          ? "bg-green-50 border-green-200"
          : "bg-blue-50 border-blue-200"
        }`}
       >
        <div className="flex justify-between items-start">
         <div className="space-y-1">
          <div className="font-medium text-gray-900">
           {appointment.clientName}
          </div>
          <div className="text-sm text-gray-600">{appointment.haircutType}</div>
          <div className="text-xs text-gray-500">
           {appointment.date.toLocaleDateString()} at{" "}
           {appointment.date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
           })}
          </div>
         </div>
         <div className="text-right">
          <div className="font-medium text-gray-900">${appointment.price}</div>
          <div className="text-xs text-gray-500">
           {appointment.duration} min
          </div>
          <div
           className={`text-xs px-2 py-1 rounded mt-1 ${
            appointment.status === "completed"
             ? "bg-green-100 text-green-800"
             : "bg-blue-100 text-blue-800"
           }`}
          >
           {appointment.status}
          </div>
         </div>
        </div>
       </div>
      ))
    ) : (
     <div className="text-center text-gray-500 py-8">
      No appointments found for this period
     </div>
    )}
   </div>

   {/* Summary Stats */}
   <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
    <div className="text-center">
     <div className="font-bold text-gray-900">
      {filteredAppointments.length}
     </div>
     <div className="text-xs text-gray-600">Total</div>
    </div>
    <div className="text-center">
     <div className="font-bold text-gray-900">
      {filteredAppointments.filter((apt) => apt.status === "completed").length}
     </div>
     <div className="text-xs text-gray-600">Completed</div>
    </div>
    <div className="text-center">
     <div className="font-bold text-gray-900">${totalRevenue}</div>
     <div className="text-xs text-gray-600">Revenue</div>
    </div>
   </div>

   {/* Running Late Button */}
   {nextAppointment && (
    <div className="pt-4 border-t border-gray-200">
     <Button
      onClick={onRunningLate}
      className="w-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center space-x-2"
     >
      <ExclamationTriangleIcon className="w-4 h-4" />
      <span>🕐 Running Late? (Send SMS)</span>
     </Button>
    </div>
   )}
  </div>
 );

 return (
  <ExpandableCard
   title="Appointments Overview"
   subtitle={`${getBookingCount()} bookings this ${viewMode}`}
   icon={<CalendarIcon className="w-5 h-5" />}
   variant="info"
   collapsedContent={collapsedContent}
   defaultExpanded={true}
  >
   {expandedContent}
  </ExpandableCard>
 );
}
