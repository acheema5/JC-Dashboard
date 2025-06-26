'use client';

import { useState } from 'react';
import { Button } from '../button';
import { Card } from '../card';
import { Appointment, DashboardStats } from '../types';

interface AppointmentsOverviewProps {
  stats: DashboardStats;
  nextAppointment: Appointment | null;
  onRunningLate: () => void;
}

export function AppointmentsOverview({
  stats,
  nextAppointment,
  onRunningLate,
}: AppointmentsOverviewProps) {
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'month' | 'year'>(
    'week'
  );

  const getBookingCount = () => {
    switch (viewMode) {
      case 'today':
        return stats.totalBookings.today;
      case 'week':
        return stats.totalBookings.week;
      case 'month':
        return stats.totalBookings.month;
      case 'year':
        return stats.totalBookings.year;
      default:
        return stats.totalBookings.week;
    }
  };

  return (
    <Card className="bg-gradient-to-r from-purple-500 to-blue-500 border-0 text-white">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Appointments Overview</h3>
          <div className="flex bg-white/10 rounded-lg p-1">
            {(['today', 'week', 'month', 'year'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  viewMode === mode
                    ? 'bg-white text-purple-700'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
          <div className="text-center">
            <span className="text-3xl font-bold">{getBookingCount()}</span>
            <p className="text-sm opacity-80">bookings this {viewMode}</p>
          </div>
        </div>

        {nextAppointment ? (
          <div className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg p-4 shadow-lg">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <h4 className="font-bold">NEXT APPOINTMENT</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium opacity-80">Client:</span>
                  <p className="font-bold">{nextAppointment.clientName}</p>
                </div>
                <div>
                  <span className="font-medium opacity-80">Service:</span>
                  <p className="font-bold">{nextAppointment.haircutType}</p>
                </div>
                <div>
                  <span className="font-medium opacity-80">Time:</span>
                  <p className="font-bold">
                    {nextAppointment.date.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <span className="font-medium opacity-80">Duration:</span>
                  <p className="font-bold">{nextAppointment.duration} min</p>
                </div>
              </div>
            </div>
            <Button
              onClick={onRunningLate}
              className="mt-4 w-full bg-white text-orange-600 hover:bg-orange-100"
            >
              🕐 Running Late? (Send SMS)
            </Button>
          </div>
        ) : (
          <div className="bg-white/10 rounded-lg p-4 border border-white/20 text-center text-white/70">
            No upcoming appointments
          </div>
        )}
      </div>
    </Card>
  );
}
