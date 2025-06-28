'use client';

import { useState } from 'react';
import { 
  ArrowDownTrayIcon, 
  DocumentTextIcon,
  CalendarIcon,
  CubeIcon 
} from '@heroicons/react/24/outline';
import { Button } from '../button';
import { ExpandableCard } from './ExpandableCard';
import { ExportOptions } from '../types';

interface DataExportCardProps {
  onExportCSV: (options: ExportOptions) => void;
  onExport: (options: ExportOptions) => void;
}

export function DataExportCard({ onExportCSV, onExport }: DataExportCardProps) {
  const [exportType, setExportType] = useState<'appointments' | 'inventory'>('appointments');
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'year'>('all');
  const [clientFilter, setClientFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');

  const exportOptions = [
    {
      type: 'appointments' as const,
      label: 'Appointments',
      icon: <CalendarIcon className="h-5 w-5" />,
      description: 'Client bookings, services, and revenue data',
    },
    {
      type: 'inventory' as const,
      label: 'Inventory',
      icon: <CubeIcon className="h-5 w-5" />,
      description: 'Stock levels, costs, and purchase history',
    },
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  const handleExport = () => {
    const options: ExportOptions = {
      type: exportType,
      client: clientFilter || undefined,
      serviceType: serviceFilter || undefined,
    };

    if (dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(0);
      }
      
      options.dateRange = { start: startDate, end: now };
    }

    onExportCSV(options);
  };

  // Collapsed content - shows export summary
  const collapsedContent = (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Data Export Ready
          </div>
          <div className="text-2xl font-bold text-gray-800 mt-1">
            CSV Format
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Export appointments & inventory
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
          <CalendarIcon className="h-5 w-5 text-gray-600 mx-auto mb-1" />
          <div className="text-xs text-gray-600">Appointments</div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
          <CubeIcon className="h-5 w-5 text-gray-600 mx-auto mb-1" />
          <div className="text-xs text-gray-600">Inventory</div>
        </div>
      </div>
    </div>
  );

  // Expanded content - shows export options and filters
  const expandedContent = (
    <div className="space-y-6">
      {/* Export Type Selection */}
      <div>
        <h5 className="font-semibold text-gray-800 mb-3">Select Data Type</h5>
        <div className="grid grid-cols-1 gap-3">
          {exportOptions.map((option) => (
            <div
              key={option.type}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                exportType === option.type
                  ? 'ring-2 ring-gray-500 bg-gray-50'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setExportType(option.type)}
            >
              <div className="flex items-center space-x-3">
                <div className="text-gray-600">{option.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Date Range Filter */}
      <div>
        <h5 className="font-semibold text-gray-800 mb-3">Date Range</h5>
        <div className="grid grid-cols-2 gap-2">
          {dateRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setDateRange(option.value as typeof dateRange)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                dateRange === option.value
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      {exportType === 'appointments' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Client Name
            </label>
            <input
              type="text"
              placeholder="Enter client name..."
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Service Type
            </label>
            <input
              type="text"
              placeholder="Enter service type..."
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Export Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h5 className="font-semibold text-gray-800 mb-3">Export Preview</h5>
        <div className="space-y-2 text-sm text-gray-600">
          <div>• Data Type: <span className="font-medium text-gray-800">{exportOptions.find(opt => opt.type === exportType)?.label}</span></div>
          <div>• Date Range: <span className="font-medium text-gray-800">{dateRangeOptions.find(opt => opt.value === dateRange)?.label}</span></div>
          {clientFilter && <div>• Client Filter: <span className="font-medium text-gray-800">{clientFilter}</span></div>}
          {serviceFilter && <div>• Service Filter: <span className="font-medium text-gray-800">{serviceFilter}</span></div>}
        </div>
      </div>

      {/* Export Button */}
      <Button
        onClick={handleExport}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3"
      >
        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
        Export CSV
      </Button>

      {/* Export History Placeholder */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h5 className="font-semibold text-gray-800 mb-3">Recent Exports</h5>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>appointments_2025-01-15.csv</span>
            <span className="text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span>inventory_2025-01-10.csv</span>
            <span className="text-gray-500">5 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ExpandableCard
      title="Data Export"
      subtitle="Export dashboard data to CSV format"
      icon={<ArrowDownTrayIcon className="h-6 w-6 text-gray-600" />}
      variant="default"
      collapsedContent={collapsedContent}
      defaultExpanded={false}
    >
      {expandedContent}
    </ExpandableCard>
  );
} 