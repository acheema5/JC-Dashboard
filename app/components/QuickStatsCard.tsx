'use client';

import { useState } from 'react';
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
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
  const [selectedMetric, setSelectedMetric] = useState<
    'revenue' | 'spending' | 'profit'
  >('revenue');

  const metrics = {
    revenue: {
      value: revenue,
      change: revenueChange,
      textColor: 'text-white-400',
      bgColor: 'bg-gradient-to-br from-green-600 to-green-800',
      borderColor: 'border-green-700',
      icon: <CurrencyDollarIcon className="h-6 w-6 text-green-400" />,
    },
    spending: {
      value: spending,
      change: spendingChange,
      textColor: 'text-white-400',
      bgColor: 'bg-gradient-to-br from-red-600 to-red-800',
      borderColor: 'border-red-700',
      icon: <ArrowTrendingDownIcon className="h-6 w-6 text-red-400" />,
    },
    profit: {
      value: profit,
      change: profitChange,
      textColor: 'text-white-400',
      bgColor: 'bg-gradient-to-br from-purple-600 via-blue-700 to-slate-800',
      borderColor: 'border-blue-700',
      icon: <ArrowTrendingUpIcon className="h-6 w-6 text-blue-400" />,
    },
  };

  const selectedMetricData = metrics[selectedMetric];

  const collapsedContent = (
    <div className="grid grid-cols-3 gap-4">
      {Object.entries(metrics).map(([key, data]) => (
        <div
          key={key}
          className={`cursor-pointer transition-all hover:scale-105 p-3 rounded-lg border ${data.bgColor} ${data.borderColor}`}
          onClick={() => setSelectedMetric(key as keyof typeof metrics)}
        >
          <div className={`text-sm font-medium ${data.textColor} uppercase tracking-wide`}>
            {key}
          </div>
          <div className={`text-2xl font-bold ${data.textColor} mt-1`}>
            ${data.value.toLocaleString()}
          </div>
          <div className={`text-xs ${data.textColor} mt-1`}>
            {data.change > 0 ? '+' : ''}
            {data.change}% from last week
          </div>
        </div>
      ))}
    </div>
  );

  const expandedContent = (
    <div className="space-y-6">
      {/* Metric Selector */}
      <div className="flex space-x-2">
        {Object.entries(metrics).map(([key, data]) => (
          <button
            key={key}
            onClick={() => setSelectedMetric(key as keyof typeof metrics)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedMetric === key
                ? `${data.bgColor} ${data.textColor} border ${data.borderColor}`
                : 'bg-slate-800 text-gray-400 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* Detailed View */}
      <div
        className={`p-6 rounded-lg border ${selectedMetricData.bgColor} ${selectedMetricData.borderColor}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {selectedMetricData.icon}
            <h4 className={`text-xl font-bold ${selectedMetricData.textColor}`}>
              {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Details
            </h4>
          </div>
          <div className={`text-2xl font-bold ${selectedMetricData.textColor}`}>
            ${selectedMetricData.value.toLocaleString()}
          </div>
        </div>

        {/* Trend Chart Placeholder */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-400">Weekly Trend</span>
            <span className={`text-sm font-medium ${selectedMetricData.textColor}`}>
              {selectedMetricData.change > 0 ? '+' : ''}
              {selectedMetricData.change}%
            </span>
          </div>
          <div className="h-32 bg-slate-700 rounded flex items-center justify-center">
            <span className="text-gray-500 text-sm">
              Chart visualization would go here
            </span>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <div className="text-sm text-gray-400">Daily Average</div>
            <div className={`text-lg font-bold ${selectedMetricData.textColor}`}>
              ${Math.round(selectedMetricData.value / 7).toLocaleString()}
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <div className="text-sm text-gray-400">Monthly Projection</div>
            <div className={`text-lg font-bold ${selectedMetricData.textColor}`}>
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
      icon={<CurrencyDollarIcon className="h-6 w-6 text-green-400" />}
      variant="success"
      collapsedContent={collapsedContent}
      defaultExpanded={false}
    >
      {expandedContent}
    </ExpandableCard>
  );
}
