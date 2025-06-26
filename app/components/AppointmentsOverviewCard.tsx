'use client';

import { useState } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../button';
import { ExpandableCard } from './ExpandableCard';
import { Appointment, DashboardStats } from '../types';

interface AppointmentsOverviewCardProps {
  stats: DashboardStats;
  nextAppointment: Appointment | null;
  onRunningLate: () => void;
}

export function AppointmentsOverviewCard({
  stats,
  nextAppointment,
  onRunningLate,
}: AppointmentsOverviewCardProps) {
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'month' | 'year'>('week');

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

  const collapsedContent = (
    <div className="space-y-4">
      <div className="rounded-lg p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow">
        <div className="text-center">
          <span className="text-3xl font-bold">{getBookingCount()}</span>
          <p className="text-sm text-white/80">bookings this {viewMode}</p>
        </div>
      </div>

      {nextAppointment ? (
        <div className="bg-white text-gray-800 rounded-lg p-4 border border-purple-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <ClockIcon className="h-4 w-4 text-purple-600" />
            <h4 className="font-bold text-sm text-purple-800">NEXT APPOINTMENT</h4>
          </div>
          <div className="text-sm">
            <div className="font-bold">{nextAppointment.clientName}</div>
            <div className="text-gray-600">{nextAppointment.haircutType}</div>
            <div className="text-gray-600">
              {nextAppointment.date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg p-4 bg-white text-center text-gray-500 border border-purple-200">
          No upcoming appointments
        </div>
      )}
    </div>
  );

  const expandedContent = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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

      {nextAppointment && (
        <div className="bg-white text-gray-800 rounded-lg p-6 border border-purple-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <ExclamationTriangleIcon className="h-5 w-5 text-purple-600" />
            <h4 className="font-bold text-lg text-purple-800">NEXT APPOINTMENT</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-gray-600">Client:</span>
              <p className="font-bold">{nextAppointment.clientName}</p>
            </div>
            <div>
              <span className="text-gray-600">Service:</span>
              <p className="font-bold">{nextAppointment.haircutType}</p>
            </div>
            <div>
              <span className="text-gray-600">Time:</span>
              <p className="font-bold">
                {nextAppointment.date.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Duration:</span>
              <p className="font-bold">{nextAppointment.duration} min</p>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">Phone:</span>
              <p className="font-bold">{nextAppointment.phoneNumber}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={onRunningLate}
              className="flex-1 bg-purple-600 text-white hover:bg-purple-700"
            >
              🕐 Running 5 mins late
            </Button>
            <Button
              onClick={() => window.open(`tel:${nextAppointment.phoneNumber}`)}
              className="px-4 bg-green-600 text-white hover:bg-green-700"
            >
              <PhoneIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {(['today', 'week', 'month', 'year'] as const).map((period) => (
          <div
            key={period}
            className="rounded-lg p-4 bg-white border border-purple-200 text-center shadow-sm"
          >
            <div className="text-2xl font-bold text-purple-800">
              {stats.totalBookings[period]}
            </div>
            <div className="text-sm text-purple-600">
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-4 border border-purple-200 text-gray-800 shadow-sm">
        <h5 className="font-semibold mb-3">Full Appointment List</h5>
        <div className="h-48 bg-gray-50 rounded flex items-center justify-center">
          <span className="text-gray-500 text-sm">Detailed appointment list would go here</span>
        </div>
      </div>
    </div>
  );

  return (
    <ExpandableCard
      title="Appointments Overview"
      subtitle="Manage bookings and client communications"
      icon={<CalendarIcon className="h-6 w-6 text-purple-600" />}
      variant="default"
      collapsedContent={collapsedContent}
      defaultExpanded={false}
    >
      {expandedContent}
    </ExpandableCard>
  );
}
