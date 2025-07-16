"use client";

import { useState } from "react";
import { CalendarIcon, UserIcon } from "@heroicons/react/24/outline";
import { ExpandableCard } from "./ExpandableCard";
import { Appointment, DashboardStats } from "../types";

interface AppointmentsOverviewCardProps {
  stats: DashboardStats;
  appointments: Appointment[];
}

export function AppointmentsOverviewCard({
  stats,
  appointments,
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

   // Filter by status
   let statusFiltered =
    statusFilter === "all"
     ? filteredByTime
     : filteredByTime.filter((apt) => apt.status === statusFilter);

   // Sort by date and time (earlier to later)
   return statusFiltered.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
   });
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
    <div className="space-y-4">
      <div className="text-center bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-10 border border-blue-100">
        <div className="text-6xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
          {getBookingCount()}
        </div>
        <div className="text-lg font-medium text-gray-600 tracking-wide">
          bookings{" "}
          {viewMode === "today" ? (
            <span className="text-blue-600 font-extrabold">today</span>
          ) : (
            <>
              this{" "}
              <span className="text-blue-600 font-extrabold">
                {viewMode}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
  

  const expandedContent = (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <div className="flex space-x-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
        {(["today", "week", "month", "year"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex-1 px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 transform ${
              viewMode === mode
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-600 hover:text-blue-600 hover:bg-blue-50 shadow-sm"
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Status Filter */}
      <div className="flex space-x-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
        {(["all", "scheduled", "completed"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`flex-1 px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
              statusFilter === status
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:text-green-600 hover:bg-green-50 shadow-sm"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="max-h-80 overflow-y-auto space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
        {filteredAppointments.length > 0 ? (
          filteredAppointments
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map((appointment) => {
              const status = appointment.status ?? "unknown";
              const isCompleted = status === "completed";
              const statusColor = isCompleted ? "green" : "blue";

              return (
                <div
                  key={appointment.id}
                  className={`relative p-4 rounded-xl border-2 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-br from-${statusColor}-50 to-${statusColor}-100 border-${statusColor}-200 hover:border-${statusColor}-300`}
                >
                  {/* Status indicator */}
                  <div
                    className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                      isCompleted ? "bg-green-400" : "bg-blue-400 animate-pulse"
                    }`}
                  ></div>

                  <div className="flex justify-between items-start pr-6">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`p-1 rounded-full bg-${statusColor}-200`}
                        >
                          <UserIcon
                            className={`w-4 h-4 text-${statusColor}-700`}
                          />
                        </div>
                        <span className="font-bold text-gray-900 text-lg">
                          {appointment.clientName}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 font-medium bg-white/60 px-3 py-1 rounded-full border border-gray-200">
                        {appointment.haircutType}
                      </div>
                      <div className="text-xs text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                        {appointment.date.toLocaleDateString()} at{" "}
                        {appointment.date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="font-black text-xl text-gray-900 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${appointment.price}
                      </div>
                      <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        {appointment.duration} min
                      </div>
                      <div
                        className={`text-xs px-3 py-1 rounded-full font-bold border-2 bg-${statusColor}-100 text-${statusColor}-800 border-${statusColor}-300`}
                      >
                        {status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
        ) : (
          <div className="text-center text-gray-500 py-12">
            <div className="p-4 bg-gray-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="font-medium">No appointments found for this period</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-gray-200">
        <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <div className="font-black text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {filteredAppointments.length}
          </div>
          <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">
            Total
          </div>
        </div>
        <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="font-black text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {filteredAppointments.filter((apt) => apt.status === "completed").length}
          </div>
          <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">
            Completed
          </div>
        </div>
        <div className="text-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
          <div className="font-black text-2xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            ${totalRevenue}
          </div>
          <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">
            Revenue
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ExpandableCard
      title="Appointments Overview"
      subtitle={`${getBookingCount()} bookings${
        viewMode === "today" ? " today" : ` this ${viewMode}`
      }`}
      icon={<CalendarIcon className="w-5 h-5" />}
      variant="info"
      collapsedContent={collapsedContent}
      defaultExpanded={false}
    >
      {expandedContent}
    </ExpandableCard>
  );  
}
