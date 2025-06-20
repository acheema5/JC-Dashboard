'use client';

import { useState } from 'react';
import { 
  UsersIcon, 
  MagnifyingGlassIcon,
  PhoneIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';
import { ExpandableCard } from './ExpandableCard';
import { Appointment } from '../types';

interface ClientHistoryCardProps {
  appointments: Appointment[];
  onSendFollowUp: (appointment: Appointment) => void;
}

export function ClientHistoryCard({
  appointments,
  onSendFollowUp,
}: ClientHistoryCardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  // Get unique clients
  const uniqueClients = Array.from(
    new Set(appointments.map(apt => apt.clientName))
  );

  // Get client history
  const getClientHistory = (clientName: string) => {
    return appointments
      .filter(apt => apt.clientName === clientName)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Filter clients based on search
  const filteredClients = uniqueClients.filter(client =>
    client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get recent bookings count
  const recentBookings = appointments.filter(
    apt => new Date(apt.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;

  // Collapsed content - shows recent booking count
  const collapsedContent = (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 border border-teal-200">
        <div className="text-center">
          <div className="text-sm font-medium text-teal-600 uppercase tracking-wide">
            Recent Bookings
          </div>
          <div className="text-2xl font-bold text-teal-800 mt-1">
            {recentBookings}
          </div>
          <div className="text-sm text-teal-600 mt-1">
            Last 30 days
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 border border-teal-200">
        <div className="text-center">
          <div className="text-sm font-medium text-teal-600 uppercase tracking-wide">
            Total Clients
          </div>
          <div className="text-2xl font-bold text-teal-800 mt-1">
            {uniqueClients.length}
          </div>
          <div className="text-sm text-teal-600 mt-1">
            Unique clients
          </div>
        </div>
      </div>
    </div>
  );

  // Expanded content - shows searchable client list and history
  const expandedContent = (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Client List */}
      <div className="space-y-4">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => {
            const clientHistory = getClientHistory(client);
            const totalSpent = clientHistory.reduce((sum, apt) => sum + apt.price, 0);
            const lastVisit = clientHistory[0];

            return (
              <div
                key={client}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedClient === client
                    ? 'ring-2 ring-teal-500 bg-teal-50'
                    : 'bg-white border-gray-200'
                }`}
                onClick={() => setSelectedClient(selectedClient === client ? null : client)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800">{client}</h5>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{clientHistory.length} visits</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <PhoneIcon className="h-4 w-4" />
                        <span>{lastVisit?.phoneNumber}</span>
                      </div>
                      <div>
                        <span className="font-medium text-teal-600">${totalSpent}</span> total spent
                      </div>
                    </div>
                  </div>
                  
                  {lastVisit && (
                    <div className="text-right text-sm text-gray-500">
                      <div>Last visit:</div>
                      <div className="font-medium">
                        {lastVisit.date.toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Expanded Client History */}
                {selectedClient === client && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h6 className="font-semibold text-gray-800 mb-3">Booking History</h6>
                    <div className="space-y-3">
                      {clientHistory.slice(0, 5).map((apt, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{apt.haircutType}</div>
                            <div className="text-sm text-gray-600">
                              {apt.date.toLocaleDateString()} at {apt.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-teal-600">${apt.price}</div>
                            <div className="text-xs text-gray-500">{apt.duration} min</div>
                          </div>
                        </div>
                      ))}
                      
                      {clientHistory.length > 5 && (
                        <div className="text-center text-sm text-gray-500">
                          +{clientHistory.length - 5} more bookings
                        </div>
                      )}
                      
                      <button
                        onClick={() => onSendFollowUp(lastVisit)}
                        className="w-full mt-3 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Send Follow-up Message
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No clients found matching your search.' : 'No clients found.'}
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-teal-200">
          <div className="text-center">
            <div className="text-lg font-bold text-teal-800">
              {uniqueClients.length}
            </div>
            <div className="text-sm text-teal-600">Total Clients</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-teal-200">
          <div className="text-center">
            <div className="text-lg font-bold text-teal-800">
              {recentBookings}
            </div>
            <div className="text-sm text-teal-600">Recent Bookings</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-teal-200">
          <div className="text-center">
            <div className="text-lg font-bold text-teal-800">
              ${appointments.reduce((sum, apt) => sum + apt.price, 0).toLocaleString()}
            </div>
            <div className="text-sm text-teal-600">Total Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ExpandableCard
      title="Client History"
      subtitle="Searchable client database and booking history"
      icon={<UsersIcon className="h-6 w-6 text-teal-600" />}
      variant="success"
      collapsedContent={collapsedContent}
      defaultExpanded={false}
    >
      {expandedContent}
    </ExpandableCard>
  );
} 