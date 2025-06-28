"use client";

import { Appointment } from "../types";
import clsx from "clsx";

interface ScheduleProps {
 appointments: Appointment[];
}

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const fullWeekdays = [
 "Monday",
 "Tuesday",
 "Wednesday",
 "Thursday",
 "Friday",
 "Saturday",
 "Sunday",
];

const timeSlots = Array.from({ length: 9 }, (_, i) => {
 const hour = 10 + i;
 return {
  hour24: hour,
  display: hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`,
  time: `${hour}:00`,
 };
});

export function Schedule({ appointments }: ScheduleProps) {
 // Calculate dynamic week dates
 const today = new Date();
 const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, etc.
 const monday = new Date(today);
 monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
 monday.setHours(0, 0, 0, 0);

 const weekDates = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date(monday);
  d.setDate(monday.getDate() + i);
  return d;
 });

 // Group appointments by specific date within the week range
 const appointmentsByDay: Record<string, Appointment[]> = {};

 // Initialize with actual week dates
 weekDates.forEach((date, index) => {
  const dayName = fullWeekdays[index];
  appointmentsByDay[dayName] = [];
 });

 // Only include appointments that fall within this specific week
 appointments.forEach((apt) => {
  const aptDate = new Date(apt.date);
  aptDate.setHours(0, 0, 0, 0); // Reset time for date comparison

  // Find which day of this specific week this appointment belongs to
  weekDates.forEach((weekDate, index) => {
   const compareDate = new Date(weekDate);
   compareDate.setHours(0, 0, 0, 0);

   if (aptDate.getTime() === compareDate.getTime()) {
    const dayName = fullWeekdays[index];
    appointmentsByDay[dayName].push(apt);
   }
  });
 });

 // Sort appointments within each day by time
 Object.keys(appointmentsByDay).forEach((day) => {
  appointmentsByDay[day].sort((a, b) => a.date.getTime() - b.date.getTime());
 });

 const getAppointmentPosition = (appointment: Appointment) => {
  const startHour = appointment.date.getHours();
  const startMinute = appointment.date.getMinutes();
  const startDecimal = startHour + startMinute / 60;
  const topPercent = ((startDecimal - 10) / 8) * 100;
  const heightPercent = (appointment.duration / 60 / 8) * 100;

  return {
   top: `${Math.max(0, topPercent)}%`,
   height: `${Math.max(heightPercent, 8)}%`,
  };
 };

 return (
  <div className="bg-gradient-to-br from-purple-700 to-blue-800 rounded-lg shadow-lg border border-blue-700 p-6 text-white">
   {/* Header */}
   <div className="flex items-center justify-between mb-6">
    <h3 className="text-lg font-semibold text-white-900">Weekly Schedule</h3>
    <div className="text-sm font-semibold text-white-500">
     {weekDates[0].toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
     })}{" "}
     -{" "}
     {weekDates[6].toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
     })}
    </div>
   </div>

   {/* Calendar Grid */}
   <div className="grid grid-cols-8 gap-px bg-gray-200 rounded-lg overflow-hidden">
    {/* Time Column */}
    <div className="bg-blue-50">
     <div className="h-12 border-b border-gray-200"></div>
     {timeSlots.map((slot, index) => (
      <div
       key={index}
       className="h-16 flex items-center justify-center text-xs text-gray-500 border-b border-gray-200"
      >
       {slot.display}
      </div>
     ))}
    </div>

    {/* Days Grid */}
    {weekDates.map((date, dayIndex) => {
     const dayName = fullWeekdays[dayIndex];
     const isToday =
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate();

     return (
      <div key={dayIndex} className="bg-white relative">
       {/* Day Header */}
       <div
        className={clsx(
         "h-12 flex flex-col items-center justify-center border-b border-gray-200 text-xs",
         isToday ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-600"
        )}
       >
        <div>{weekdays[dayIndex]}</div>
        <div className="text-black-500">
         {date.getMonth() + 1}/{date.getDate()}
        </div>
       </div>

       {/* Day Content */}
       <div className="relative">
        {timeSlots.map((slot, index) => (
         <div
          key={index}
          className="h-16 border-b border-gray-100 relative"
         ></div>
        ))}

        {appointmentsByDay[dayName].map((apt, aptIndex) => {
         const position = getAppointmentPosition(apt);
         return (
          <div
           key={`${apt.id}-${aptIndex}`}
           className="absolute left-1 right-1 bg-blue-100 border border-blue-300 rounded text-xs p-1 overflow-hidden"
           style={position}
          >
           <div className="font-medium text-blue-800">
            {apt.date.toLocaleTimeString([], {
             hour: "numeric",
             minute: "2-digit",
            })}
           </div>
           <div className="text-blue-600 truncate">{apt.clientName}</div>
          </div>
         );
        })}
       </div>
      </div>
     );
    })}
   </div>
  </div>
 );
}
