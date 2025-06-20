'use client';

import { useState } from 'react';
import { 
  CalendarDaysIcon, 
  ChevronLeftIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';
import { ExpandableCard } from './ExpandableCard';
import { Appointment } from '../types';

interface CalendarCardProps {
  appointments: Appointment[];
}

export function CalendarCard({ appointments }: CalendarCardProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get today's appointments
  const todayAppointments = appointments.filter(
    (apt) => apt.date.toDateString() === new Date().toDateString()
  );

  // Get appointments for current month
  const currentMonthAppointments = appointments.filter(
    (apt) => 
      apt.date.getMonth() === currentDate.getMonth() &&
      apt.date.getFullYear() === currentDate.getFullYear()
  );

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty days for padding
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(
      (apt) => apt.date.toDateString() === date.toDateString()
    );
  };

  const getBookingDensity = (date: Date) => {
    const dayAppointments = getAppointmentsForDay(date);
    if (dayAppointments.length === 0) return 'bg-gray-100';
    if (dayAppointments.length <= 2) return 'bg-green-200';
    if (dayAppointments.length <= 4) return 'bg-yellow-200';
    return 'bg-red-200';
  };

  const calendarDays = getDaysInMonth(currentDate);

  // Collapsed content - shows today's booking overview
  const collapsedContent = (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 border border-indigo-200">
        <div className="text-center">
          <div className="text-sm font-medium text-indigo-600 uppercase tracking-wide">
            Today's Bookings
          </div>
          <div className="text-2xl font-bold text-indigo-800 mt-1">
            {todayAppointments.length}
          </div>
          <div className="text-sm text-indigo-600 mt-1">
            {todayAppointments.length === 0 
              ? 'No bookings today' 
              : `${todayAppointments.length} appointment${todayAppointments.length > 1 ? 's' : ''}`
            }
          </div>
        </div>
      </div>
      
      {todayAppointments.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-4 border-2 border-indigo-300">
          <div className="text-sm font-bold text-indigo-800 mb-2">Today's Schedule:</div>
          <div className="space-y-2">
            {todayAppointments.slice(0, 3).map((apt, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-800">{apt.clientName}</span>
                <span className="text-indigo-600">
                  {apt.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {todayAppointments.length > 3 && (
              <div className="text-xs text-indigo-600 text-center">
                +{todayAppointments.length - 3} more appointments
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Expanded content - shows full calendar
  const expandedContent = (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        
        <h3 className="text-lg font-semibold text-gray-800">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRightIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg border border-indigo-200 overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-indigo-50 border-b border-indigo-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-indigo-800">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`min-h-[80px] p-2 border-r border-b border-gray-200 ${
                day ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              {day && (
                <div className="space-y-1">
                  <div className={`text-sm font-medium ${
                    day.toDateString() === new Date().toDateString()
                      ? 'text-white bg-indigo-600 rounded-full w-6 h-6 flex items-center justify-center'
                      : 'text-gray-800'
                  }`}>
                    {day.getDate()}
                  </div>
                  
                  {day && (
                    <div className={`w-full h-2 rounded-sm ${getBookingDensity(day)}`}></div>
                  )}
                  
                  {day && getAppointmentsForDay(day).length > 0 && (
                    <div className="text-xs text-indigo-600 font-medium">
                      {getAppointmentsForDay(day).length} booking{getAppointmentsForDay(day).length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Booking Density Legend */}
      <div className="bg-white rounded-lg p-4 border border-indigo-200">
        <h5 className="font-semibold text-gray-800 mb-3">Booking Density</h5>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 rounded-sm"></div>
            <span className="text-gray-600">No bookings</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-200 rounded-sm"></div>
            <span className="text-gray-600">1-2 bookings</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-200 rounded-sm"></div>
            <span className="text-gray-600">3-4 bookings</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-200 rounded-sm"></div>
            <span className="text-gray-600">5+ bookings</span>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 border border-indigo-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-800">
              {currentMonthAppointments.length}
            </div>
            <div className="text-sm text-indigo-600">Total Bookings</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-indigo-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-800">
              ${currentMonthAppointments.reduce((sum, apt) => sum + apt.price, 0).toLocaleString()}
            </div>
            <div className="text-sm text-indigo-600">Monthly Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ExpandableCard
      title="Calendar"
      subtitle="Visual booking calendar and schedule management"
      icon={<CalendarDaysIcon className="h-6 w-6 text-indigo-600" />}
      variant="info"
      collapsedContent={collapsedContent}
      defaultExpanded={false}
    >
      {expandedContent}
    </ExpandableCard>
  );
} 