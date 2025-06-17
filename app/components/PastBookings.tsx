'use client';

import { useState } from 'react';
import { Card } from '../card';
import { Button } from '../button';
import { Appointment, ExportOptions } from '../types';

interface PastBookingsProps {
  appointments: Appointment[];
  onExportCSV: (options: ExportOptions) => void;
  onSendFollowUp: (appointment: Appointment) => void;
}

export function PastBookings({ appointments, onExportCSV, onSendFollowUp }: PastBookingsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'client' | 'service'>('all');
  const [showExportOptions, setShowExportOptions] = useState(false);

  const completedAppointments = appointments
    .filter(apt => apt.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredAppointments = completedAppointments.filter(apt => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    switch (filterType) {
      case 'client':
        return apt.clientName.toLowerCase().includes(searchLower);
      case 'service':
        return apt.haircutType.toLowerCase().includes(searchLower);
      default:
        return apt.clientName.toLowerCase().includes(searchLower) ||
               apt.haircutType.toLowerCase().includes(searchLower);
    }
  });

  const handleExport = (type: 'appointments' | 'inventory') => {
    const options: ExportOptions = {
      type,
      ...(searchTerm && filterType === 'client' && { client: searchTerm }),
      ...(searchTerm && filterType === 'service' && { serviceType: searchTerm })
    };
    onExportCSV(options);
    setShowExportOptions(false);
  };

  return (
    <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Past Bookings</h3>
          <div className="relative">
            <Button 
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="bg-gray-600 hover:bg-gray-700"
            >
              📊 Export Options
            </Button>
            {showExportOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2 space-y-2">
                  <Button
                    onClick={() => handleExport('appointments')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
                  >
                    Export Appointments
                  </Button>
                  <Button
                    onClick={() => handleExport('inventory')}
                    className="w-full bg-green-600 hover:bg-green-700 text-sm"
                  >
                    Export Inventory
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'client' | 'service')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <option value="all">All Fields</option>
            <option value="client">Client Name</option>
            <option value="service">Service Type</option>
          </select>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredAppointments.slice(0, 10).map(appointment => (
            <div key={appointment.id} className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                <div>
                  <span className="font-medium text-gray-600">Client:</span>
                  <p className="text-gray-800">{appointment.clientName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Phone:</span>
                  <p className="text-gray-800">{appointment.phoneNumber}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Service:</span>
                  <p className="text-gray-800">{appointment.haircutType}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Duration:</span>
                  <p className="text-gray-800">{appointment.duration} min</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  {new Date(appointment.date).toLocaleDateString()} - ${appointment.price}
                </div>
                <Button
                  onClick={() => onSendFollowUp(appointment)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
                >
                  📱 Send Follow-up
                </Button>
              </div>
            </div>
          ))}
          
          {filteredAppointments.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No bookings found matching your search
            </div>
          )}
        </div>
        
        {filteredAppointments.length > 10 && (
          <div className="text-center text-sm text-gray-500">
            Showing 10 of {filteredAppointments.length} results
          </div>
        )}
      </div>
    </Card>
  );
}
