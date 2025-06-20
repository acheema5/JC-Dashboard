'use client';

import { useState } from 'react';
import { 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon 
} from '@heroicons/react/24/outline';
import { ExpandableCard } from './ExpandableCard';

interface QuickStatsCardProps {
  revenue: number;
  spending: number;
  profit: number;
  revenueChange?: number;
  spendingChange?: number;
  profitChange?: number;
}

export function QuickStatsCard({
  revenue,
  spending,
  profit,
  revenueChange = 12,
  spendingChange = -5,
  profitChange = 18,
}: QuickStatsCardProps) {
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'spending' | 'profit'>('revenue');

  const metrics = {
    revenue: {
      value: revenue,
      change: revenueChange,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: <CurrencyDollarIcon className="h-6 w-6 text-green-600" />,
    },
    spending: {
      value: spending,
      change: spendingChange,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: <ArrowTrendingDownIcon className="h-6 w-6 text-red-600" />,
    },
    profit: {
      value: profit,
      change: profitChange,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600" />,
    },
  };

  const selectedMetricData = metrics[selectedMetric];

  // Collapsed content - shows summary of all metrics
  const collapsedContent = (
    <div className="grid grid-cols-3 gap-4">
      {Object.entries(metrics).map(([key, data]) => (
        <div
          key={key}
          className={`text-center p-3 rounded-lg border ${data.bgColor} ${data.borderColor} cursor-pointer transition-all hover:scale-105`}
          onClick={() => setSelectedMetric(key as keyof typeof metrics)}
        >
          <div className={`text-sm font-medium ${data.color} uppercase tracking-wide`}>
            {key}
          </div>
          <div className={`text-2xl font-bold ${data.color} mt-1`}>
            ${data.value.toLocaleString()}
          </div>
          <div className={`text-xs ${data.color} mt-1`}>
            {data.change > 0 ? '+' : ''}{data.change}% from last week
          </div>
        </div>
      ))}
    </div>
  );

  // Expanded content - shows detailed breakdown
  const expandedContent = (
    <div className="space-y-6">
      {/* Metric Selector */}
      <div className="flex space-x-2">
        {Object.entries(metrics).map(([key, data]) => (
          <button
            key={key}
            onClick={() => setSelectedMetric(key as keyof typeof metrics)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedMetric === key
                ? `${data.bgColor} ${data.color} border ${data.borderColor}`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* Detailed View */}
      <div className={`p-6 rounded-lg border ${selectedMetricData.bgColor} ${selectedMetricData.borderColor}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {selectedMetricData.icon}
            <h4 className={`text-xl font-bold ${selectedMetricData.color}`}>
              {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Details
            </h4>
          </div>
          <div className={`text-2xl font-bold ${selectedMetricData.color}`}>
            ${selectedMetricData.value.toLocaleString()}
          </div>
        </div>

        {/* Trend Chart Placeholder */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Weekly Trend</span>
            <span className={`text-sm font-medium ${selectedMetricData.color}`}>
              {selectedMetricData.change > 0 ? '+' : ''}{selectedMetricData.change}%
            </span>
          </div>
          <div className="h-32 bg-gray-50 rounded flex items-center justify-center">
            <span className="text-gray-500 text-sm">Chart visualization would go here</span>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-sm text-gray-600">Daily Average</div>
            <div className={`text-lg font-bold ${selectedMetricData.color}`}>
              ${Math.round(selectedMetricData.value / 7).toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-sm text-gray-600">Monthly Projection</div>
            <div className={`text-lg font-bold ${selectedMetricData.color}`}>
              ${Math.round(selectedMetricData.value * 4.33).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ExpandableCard
      title="Quick Stats"
      subtitle="Revenue, spending, and profit overview"
      icon={<CurrencyDollarIcon className="h-6 w-6 text-green-600" />}
      variant="success"
      collapsedContent={collapsedContent}
      defaultExpanded={false}
    >
      {expandedContent}
    </ExpandableCard>
  );
} 