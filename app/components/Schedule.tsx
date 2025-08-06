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

// Extended to 12-hour day: 8 AM to 8 PM
const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const hour = 8 + i;
  return {
    hour24: hour,
    display: hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`,
    time: `${hour}:00`,
  };
});

export function Schedule({ appointments }: ScheduleProps) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  // Calculate Monday (dayOfWeek 1 means Monday, 0 is Sunday)
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  const appointmentsByDay: Record<string, Appointment[]> = {};
  weekDates.forEach((date, index) => {
    const dayName = fullWeekdays[index];
    appointmentsByDay[dayName] = [];
  });

  appointments.forEach((apt) => {
    const aptDate = new Date(apt.date);
    aptDate.setHours(0, 0, 0, 0);

    weekDates.forEach((weekDate, index) => {
      const compareDate = new Date(weekDate);
      compareDate.setHours(0, 0, 0, 0);

      if (aptDate.getTime() === compareDate.getTime()) {
        const dayName = fullWeekdays[index];
        appointmentsByDay[dayName].push(apt);
      }
    });
  });

  Object.keys(appointmentsByDay).forEach((day) => {
    appointmentsByDay[day].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
  });

  const getAppointmentPosition = (appointment: Appointment) => {
    const startHour = appointment.date.getHours();
    const startMinute = appointment.date.getMinutes();
    const startDecimal = startHour + startMinute / 60;

    // 8 AM to 8 PM = 12-hour range
    const topPercent = ((startDecimal - 8) / 12) * 100;
    const heightPercent = (appointment.duration / 60 / 12) * 100;

    return {
      top: `${Math.max(0, topPercent)}%`,
      height: `${Math.max(heightPercent, 6)}%`, // Minimum height for readability
    };
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 h-full flex flex-col">
      {/* Compact Header */}
      <div className="px-4 py-3 border-b border-blue-300 flex-shrink-0">
        <h1 className="text-2xl font-bold text-blue-800">Weekly Schedule</h1>
        <p className="text-blue-600 text-xs mt-0.5">
          {weekDates[0].toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}{" "}
          -{" "}
          {weekDates[6].toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="flex-1 flex overflow-hidden h-full">
        {/* Time labels - more compact */}
        <div className="w-16 flex-shrink-0 border-r border-blue-300 flex flex-col">
          {/* Compact header spacer - no bottom border to avoid cutting 9am */}
          <div className="h-12 flex-shrink-0"></div>
          <div className="flex-1 relative">
            {timeSlots.map((slot, index) => (
              <div
                key={slot.hour24}
                className="absolute w-full flex items-start justify-end pr-2"
                style={{ 
                  top: `${(index * 100) / timeSlots.length}%`,
                  height: `${100 / timeSlots.length}%`,
                  transform: 'translateY(-6px)' // Move up to align with grid line
                }}
              >
                <span className="text-xs text-blue-600 font-medium select-none leading-none">
                  {slot.display}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Days grid */}
        <div className="flex-1 grid grid-cols-7 divide-x divide-blue-300">
          {weekDates.map((date, dayIndex) => {
            const dayName = fullWeekdays[dayIndex];
            const isToday =
              today.getFullYear() === date.getFullYear() &&
              today.getMonth() === date.getMonth() &&
              today.getDate() === date.getDate();

            return (
              <div key={dayIndex} className="flex flex-col min-w-0">
                {/* Compact day header */}
                <div
                  className={clsx(
                    "h-12 border-b border-blue-300 flex flex-col items-center justify-center",
                    isToday ? "bg-blue-200" : "bg-white/60"
                  )}
                >
                  <div className="text-xs font-medium text-blue-800">
                    {weekdays[dayIndex]}
                  </div>
                  <div className="text-xs text-blue-600">{date.getDate()}</div>
                </div>

                {/* Day body */}
                <div className="flex-1 relative">
                  {/* Hour grid lines - aligned with time labels */}
                  {timeSlots.map((slot, index) => (
                    <div
                      key={slot.hour24}
                      className="absolute w-full border-b border-blue-200"
                      style={{
                        top: `${(index * 100) / timeSlots.length}%`,
                        height: `${100 / timeSlots.length}%`,
                      }}
                    />
                  ))}

                  {/* Appointments - properly aligned */}
                  {appointmentsByDay[dayName].map((apt) => {
                    const position = getAppointmentPosition(apt);
                    return (
                      <div
                        key={apt.id}
                        className="absolute left-0.5 right-0.5 bg-blue-600 rounded-sm border-l-2 border-blue-400 shadow-sm hover:bg-blue-700 transition-colors cursor-pointer overflow-hidden"
                        style={{
                          top: position.top,
                          height: position.height,
                          minHeight: "24px",
                        }}
                      >
                        <div className="p-1 h-full flex flex-col justify-start text-left">
                          <div className="text-xs font-semibold text-white leading-tight truncate">
                            {apt.date.toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </div>
                          <div className="text-xs text-blue-100 truncate leading-tight">
                            {apt.clientName}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}