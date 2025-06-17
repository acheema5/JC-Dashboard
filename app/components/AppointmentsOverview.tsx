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
    <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-purple-800">
            Appointments Overview
          </h3>
          <div className="flex bg-white rounded-lg p-1 border border-purple-200">
            {(['today', 'week', 'month', 'year'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  viewMode === mode
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-purple-200">
          <div className="text-center">
            <span className="text-3xl font-bold text-purple-800">
              {getBookingCount()}
            </span>
            <p className="text-sm text-purple-600">bookings this {viewMode}</p>
          </div>
        </div>

        {nextAppointment ? (
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border-2 border-orange-300 shadow-lg">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <h4 className="font-bold text-orange-800">NEXT APPOINTMENT</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-600">Client:</span>
                  <p className="font-bold text-gray-800">
                    {nextAppointment.clientName}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Service:</span>
                  <p className="font-bold text-gray-800">
                    {nextAppointment.haircutType}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Time:</span>
                  <p className="font-bold text-gray-800">
                    {nextAppointment.date.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Duration:</span>
                  <p className="font-bold text-gray-800">
                    {nextAppointment.duration} min
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={onRunningLate}
              className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white font-medium"
            >
              🕐 Running Late? (Send SMS)
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-4 border border-purple-200 text-center text-gray-500">
            No upcoming appointments
          </div>
        )}
      </div>
    </Card>
  );
}
