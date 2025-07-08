'use client';

import { useState } from 'react';
import { Button } from '../button';
import { Card } from '../card';
import { Appointment, DashboardStats } from '../types';

interface AppointmentsOverviewProps {
  stats: DashboardStats;
}

export function AppointmentsOverview({
  stats,
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
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 border-0 text-white shadow-2xl">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-4 right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent" style={{ fontFamily: 'Bookmania, serif' }}>
              Appointments Overview
            </h3>
          </div>
          <div className="flex bg-black/20 backdrop-blur-sm rounded-xl p-1 border border-white/10 shadow-inner">
            {(['today', 'week', 'month', 'year'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 transform ${
                  viewMode === mode
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg scale-105'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="text-center space-y-2">
            <div className="relative">
              <span className="text-5xl font-black bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                {getBookingCount()}
              </span>
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <p className="text-lg font-medium text-gray-300">
              bookings this <span className="text-amber-400 font-bold">{viewMode}</span>
            </p>
          </div>
        </div>


      </div>
    </Card>
  );
}