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
    display:
      hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`,
    time: `${hour}:00`,
  };
});

export function Schedule({ appointments }: ScheduleProps) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
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
    const topPercent = ((startDecimal - 10) / 8) * 100;
    const heightPercent = (appointment.duration / 60 / 8) * 100;

    return {
      top: `${Math.max(0, topPercent)}%`,
      height: `${Math.max(heightPercent, 8)}%`,
    };
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 h-full flex flex-col">
      <div className="px-6 py-4 border-b border-blue-300">
        <h1 className="text-4xl font-bold text-blue-800">Weekly Schedule</h1>
        <p className="text-blue-600 text-sm mt-1">
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
        </p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-20 flex-shrink-0 border-r border-blue-300">
          <div className="h-16 border-b border-blue-300"></div>
          <div className="relative">
            {timeSlots.map((slot) => (
              <div
                key={slot.hour24}
                className="h-20 border-b border-blue-300 flex items-start justify-end pr-3 pt-2"
              >
                <span className="text-sm text-blue-600 font-medium">
                  {slot.display}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-7 divide-x divide-blue-300">
          {weekDates.map((date, dayIndex) => {
            const dayName = fullWeekdays[dayIndex];
            const isToday =
              today.getFullYear() === date.getFullYear() &&
              today.getMonth() === date.getMonth() &&
              today.getDate() === date.getDate();

            return (
              <div key={dayIndex} className="flex flex-col min-w-0">
                <div
                  className={clsx(
                    "h-16 border-b border-blue-300 flex flex-col items-center justify-center",
                    isToday ? "bg-blue-200" : "bg-white/60"
                  )}
                >
                  <div className="text-sm font-medium text-blue-800">
                    {weekdays[dayIndex]}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    {date.getDate()}
                  </div>
                </div>

                <div className="flex-1 relative">
                  {timeSlots.map((slot, index) => (
                    <div
                      key={slot.hour24}
                      className="absolute w-full h-20 border-b border-blue-200"
                      style={{ top: `${index * 80}px` }}
                    />
                  ))}

                  {appointmentsByDay[dayName].map((apt) => {
                    const position = getAppointmentPosition(apt);
                    return (
                      <div
                        key={apt.id}
                        className="absolute left-1 right-1 bg-blue-600 rounded-md border-l-4 border-blue-400 shadow-sm hover:bg-blue-700 transition-colors cursor-pointer overflow-hidden"
                        style={{
                          top: position.top,
                          height: position.height,
                          minHeight: "40px",
                        }}
                      >
                        <div className="p-2 h-full flex flex-col justify-start text-left">
                          <div className="text-xs font-semibold text-white mb-1">
                            {apt.date.toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </div>
                          <div className="text-xs text-blue-100 truncate">
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
