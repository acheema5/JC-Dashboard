'use client';

import { useState } from 'react';
import { Card } from '../card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../dialog';
import { Appointment } from '../types';

interface CalendarProps {
  appointments: Appointment[];
}

export function Calendar({ appointments }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getAppointmentsForDay = (day: number) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.getDate() === day && 
             aptDate.getMonth() === currentMonth && 
             aptDate.getFullYear() === currentYear;
    });
  };

  const getDayColor = (appointmentCount: number) => {
    if (appointmentCount >= 6) return 'bg-green-200 border-green-400 text-green-800'; // Fully booked
    if (appointmentCount >= 3) return 'bg-yellow-200 border-yellow-400 text-yellow-800'; // Moderate
    if (appointmentCount >= 1) return 'bg-orange-200 border-orange-400 text-orange-800'; // Low
    return 'bg-red-100 border-red-300 text-red-600'; // No bookings
  };

  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-indigo-800">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
              {day}
            </div>
          ))}
          
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="p-2"></div>
          ))}
          
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dayAppointments = getAppointmentsForDay(day);
            const isToday = day === today.getDate();
            
            return (
              <Dialog key={day}>
                <DialogTrigger asChild>
                  <button 
                    className={`p-2 text-center text-sm border rounded cursor-pointer hover:shadow-md transition-all ${
                      isToday ? 'ring-2 ring-indigo-500 font-bold' : ''
                    } ${getDayColor(dayAppointments.length)}`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="font-medium">{day}</div>
                    {dayAppointments.length > 0 && (
                      <div className="mt-1">
                        <span className="text-xs font-bold">{dayAppointments.length}</span>
                      </div>
                    )}
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      Appointments for {monthNames[currentMonth]} {day}, {currentYear}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {dayAppointments.length > 0 ? (
                      dayAppointments.map(apt => (
                        <div key={apt.id} className="bg-gray-50 rounded-lg p-3 border">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">{apt.clientName}</h4>
                              <p className="text-sm text-gray-600">{apt.haircutType}</p>
                              <p className="text-sm text-gray-600">
                                {apt.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                                ({apt.duration} min)
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              apt.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {apt.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No appointments scheduled</p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
        
        <div className="flex justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-200 border border-green-400 rounded"></div>
            <span>Fully Booked (6+)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-200 border border-yellow-400 rounded"></div>
            <span>Moderate (3-5)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-200 border border-orange-400 rounded"></div>
            <span>Low (1-2)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
            <span>Empty</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
