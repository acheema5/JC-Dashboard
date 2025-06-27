'use client';

import { Appointment } from '../types';

interface ScheduleProps {
  appointments: Appointment[];
}

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const fullWeekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Generate hourly time slots from 10 AM to 6 PM
const timeSlots = Array.from({ length: 9 }, (_, i) => {
  const hour = 10 + i;
  return {
    hour24: hour,
    display: hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`,
    time: `${hour}:00`
  };
});

export function Schedule({ appointments }: ScheduleProps) {
  // Group appointments by day
  const appointmentsByDay: Record<string, Appointment[]> = {};
  fullWeekdays.forEach(day => {
    appointmentsByDay[day] = [];
  });

  appointments.forEach(apt => {
    const dayName = apt.date.toLocaleDateString('en-US', { weekday: 'long' });
    if (appointmentsByDay[dayName]) {
      appointmentsByDay[dayName].push(apt);
    }
  });

  // Sort appointments by time for each day
  Object.keys(appointmentsByDay).forEach(day => {
    appointmentsByDay[day].sort((a, b) => a.date.getTime() - b.date.getTime());
  });

  // Calculate appointment positioning
  const getAppointmentPosition = (appointment: Appointment) => {
    const startHour = appointment.date.getHours();
    const startMinute = appointment.date.getMinutes();
    const startDecimal = startHour + startMinute / 60;
    
    // Calculate position from 10 AM (our start time)
    const topPercent = ((startDecimal - 10) / 8) * 100; // 8 hours total (10-6)
    const heightPercent = (appointment.duration / 60 / 8) * 100; // Duration as percentage
    
    return {
      top: `${Math.max(0, topPercent)}%`,
      height: `${Math.max(heightPercent, 8)}%`, // Minimum 8% height for visibility
    };
  };

  return (
    <div className="bg-gray-900 text-white h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700">
        <h1 className="text-2xl font-semibold">Weekly Schedule</h1>
        <p className="text-gray-400 text-sm mt-1">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Time Column */}
        <div className="w-20 flex-shrink-0 border-r border-gray-700">
          {/* Empty header space */}
          <div className="h-16 border-b border-gray-700"></div>
          
          {/* Time slots */}
          <div className="relative">
            {timeSlots.map((slot, index) => (
              <div 
                key={slot.hour24}
                className="h-20 border-b border-gray-700 flex items-start justify-end pr-3 pt-2"
              >
                <span className="text-sm text-gray-400 font-medium">{slot.display}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Days Grid */}
        <div className="flex-1 grid grid-cols-7 divide-x divide-gray-700">
          {fullWeekdays.map((day, dayIndex) => (
            <div key={day} className="flex flex-col min-w-0">
              {/* Day Header */}
              <div className="h-16 border-b border-gray-700 flex flex-col items-center justify-center bg-gray-800">
                <div className="text-sm font-medium text-gray-300">{weekdays[dayIndex]}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date().getDate() + dayIndex}
                </div>
              </div>

              {/* Day Content */}
              <div className="flex-1 relative">
                {/* Hour grid lines */}
                {timeSlots.map((slot, index) => (
                  <div 
                    key={slot.hour24}
                    className="absolute w-full h-20 border-b border-gray-800"
                    style={{ top: `${index * 80}px` }}
                  />
                ))}

                {/* Appointments */}
                {appointmentsByDay[day].map((apt) => {
                  const position = getAppointmentPosition(apt);
                  return (
                    <div
                      key={apt.id}
                      className="absolute left-1 right-1 bg-blue-600 rounded-md border-l-4 border-blue-400 shadow-sm hover:bg-blue-700 transition-colors cursor-pointer overflow-hidden"
                      style={{
                        top: position.top,
                        height: position.height,
                        minHeight: '40px'
                      }}
                    >
                      <div className="p-2 h-full flex flex-col justify-start text-left">
                        <div className="text-xs font-semibold text-white mb-1">
                          {apt.date.toLocaleTimeString([], {
                            hour: 'numeric',
                            minute: '2-digit',
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
          ))}
        </div>
      </div>
    </div>
  );
}