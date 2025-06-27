'use client';

import { Appointment } from '../types';

interface ScheduleProps {
  appointments: Appointment[];
}

const weekdays = [
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const weekdayAbbr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function Schedule({ appointments }: ScheduleProps) {
  // group appointments by weekday
  const grouped: Record<string, Appointment[]> = {};
  weekdays.forEach((day) => {
    grouped[day] = [];
  });

  for (const apt of appointments) {
    const dayName = apt.date.toLocaleDateString('en-US', { weekday: 'long' });
    if (grouped[dayName]) {
      grouped[dayName].push(apt);
    }
  }

  for (const day in grouped) {
    grouped[day].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Weekly Schedule</h2>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 flex-1">
        {weekdays.map((day, index) => (
          <div
            key={day}
            className="flex flex-col bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-200 min-h-[220px] lg:min-h-[280px]"
          >
            {/* Day Header */}
            <div className="p-4 pb-2 border-b border-slate-700/50">
              <h3 className="text-center font-semibold">
                <span className="block lg:hidden text-sm">{weekdayAbbr[index]}</span>
                <span className="hidden lg:block text-sm">{day}</span>
              </h3>
              <div className="text-center text-xs text-slate-400 mt-1">
                {grouped[day].length} {grouped[day].length === 1 ? 'booking' : 'bookings'}
              </div>
            </div>

            {/* Appointments */}
            <div className="flex-1 p-3 overflow-y-auto">
              <div className="space-y-2">
                {grouped[day].length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-slate-400">
                      <div className="w-8 h-8 mx-auto mb-2 opacity-40">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-xs">No bookings</p>
                    </div>
                  </div>
                ) : (
                  grouped[day].map((apt, aptIndex) => (
                    <div
                      key={apt.id}
                      className="group relative p-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/15 hover:border-white/30 transition-all duration-200"
                    >
                      {/* Time badge */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {apt.date.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="text-xs text-slate-400">{apt.duration}min</span>
                      </div>

                      {/* Client info */}
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-white truncate">
                          {apt.clientName}
                        </div>
                        <div className="text-xs text-slate-300 truncate">
                          {apt.haircutType}
                        </div>
                      </div>

                      {/* Hover effect indicator */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-200 pointer-events-none" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}