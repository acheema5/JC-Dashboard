'use client';

import { useState } from 'react';
import { 
  CalendarIcon, 
  ClockIcon,
  PhoneIcon,
  ExclamationTriangleIcon 
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

  // Collapsed content - shows summary and next appointment
  const collapsedContent = (
    <div className="space-y-4">
      {/* Booking Summary */}
      <div className="bg-white rounded-lg p-4 border border-purple-200">
        <div className="text-center">
          <span className="text-3xl font-bold text-purple-800">
            {getBookingCount()}
          </span>
          <p className="text-sm text-purple-600">bookings this {viewMode}</p>
        </div>
      </div>

      {/* Next Appointment Preview */}
      {nextAppointment ? (
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border-2 border-orange-300">
          <div className="flex items-center space-x-2 mb-2">
            <ClockIcon className="h-4 w-4 text-orange-600" />
            <h4 className="font-bold text-orange-800 text-sm">NEXT APPOINTMENT</h4>
          </div>
          <div className="text-sm">
            <div className="font-bold text-gray-800">{nextAppointment.clientName}</div>
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
        <div className="bg-white rounded-lg p-4 border border-purple-200 text-center text-gray-500">
          No upcoming appointments
        </div>
      )}
    </div>
  );

  // Expanded content - shows full appointment list and controls
  const expandedContent = (
    <div className="space-y-6">
      {/* View Mode Toggles */}
      <div className="flex justify-between items-center">
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

      {/* Next Appointment Details */}
      {nextAppointment && (
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border-2 border-orange-300 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />
            <h4 className="font-bold text-orange-800 text-lg">NEXT APPOINTMENT</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="font-medium text-gray-600">Client:</span>
              <p className="font-bold text-gray-800">{nextAppointment.clientName}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Service:</span>
              <p className="font-bold text-gray-800">{nextAppointment.haircutType}</p>
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
              <p className="font-bold text-gray-800">{nextAppointment.duration} min</p>
            </div>
            <div className="col-span-2">
              <span className="font-medium text-gray-600">Phone:</span>
              <p className="font-bold text-gray-800">{nextAppointment.phoneNumber}</p>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex space-x-3">
            <Button
              onClick={onRunningLate}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium"
            >
              🕐 Running 5 mins late
            </Button>
            <Button
              onClick={() => window.open(`tel:${nextAppointment.phoneNumber}`)}
              className="px-4 bg-green-600 hover:bg-green-700 text-white"
            >
              <PhoneIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Booking Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 border border-purple-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-800">{stats.totalBookings.today}</div>
            <div className="text-sm text-purple-600">Today</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-purple-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-800">{stats.totalBookings.week}</div>
            <div className="text-sm text-purple-600">This Week</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-purple-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-800">{stats.totalBookings.month}</div>
            <div className="text-sm text-purple-600">This Month</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-purple-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-800">{stats.totalBookings.year}</div>
            <div className="text-sm text-purple-600">This Year</div>
          </div>
        </div>
      </div>

      {/* Placeholder for full appointment list */}
      <div className="bg-white rounded-lg p-4 border border-purple-200">
        <h5 className="font-semibold text-gray-800 mb-3">Full Appointment List</h5>
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
      variant="warning"
      collapsedContent={collapsedContent}
      defaultExpanded={false}
    >
      {expandedContent}
    </ExpandableCard>
  );
} 