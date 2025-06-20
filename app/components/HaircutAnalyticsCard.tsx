'use client';

import { useState } from 'react';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon 
} from '@heroicons/react/24/outline';
import { ExpandableCard } from './ExpandableCard';
import { Appointment, DashboardStats } from '../types';

interface HaircutAnalyticsCardProps {
  stats: DashboardStats;
  appointments: Appointment[];
}

export function HaircutAnalyticsCard({
  stats,
  appointments,
}: HaircutAnalyticsCardProps) {
  const [selectedAnalysis, setSelectedAnalysis] = useState<'popularity' | 'revenue' | 'timing'>('popularity');

  // Calculate haircut popularity
  const haircutCounts = appointments.reduce((acc, apt) => {
    acc[apt.haircutType] = (acc[apt.haircutType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostPopularCut = Object.entries(haircutCounts).sort((a, b) => b[1] - a[1])[0];

  // Calculate day of week analysis
  const dayCounts = appointments.reduce((acc, apt) => {
    const day = apt.date.toLocaleDateString('en-US', { weekday: 'long' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const slowestDay = Object.entries(dayCounts).sort((a, b) => a[1] - b[1])[0];
  const busiestDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0];

  // Collapsed content - shows most common cut this week
  const collapsedContent = (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 border border-blue-200">
        <div className="text-center">
          <div className="text-sm font-medium text-blue-600 uppercase tracking-wide">
            Most Popular Cut
          </div>
          <div className="text-2xl font-bold text-blue-800 mt-1">
            {mostPopularCut ? mostPopularCut[0] : 'N/A'}
          </div>
          <div className="text-sm text-blue-600 mt-1">
            {mostPopularCut ? `${mostPopularCut[1]} bookings` : 'No data'}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-3 border border-blue-200">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-800">
              ${stats.avgRevenuePerCut}
            </div>
            <div className="text-xs text-blue-600">Avg Revenue/Cut</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-blue-200">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-800">
              ${stats.avgProfitPerCut}
            </div>
            <div className="text-xs text-blue-600">Avg Profit/Cut</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Expanded content - shows detailed analytics
  const expandedContent = (
    <div className="space-y-6">
      {/* Analysis Type Selector */}
      <div className="flex space-x-2">
        {[
          { key: 'popularity', label: 'Cut Popularity', icon: <ChartBarIcon className="h-4 w-4" /> },
          { key: 'revenue', label: 'Revenue Analysis', icon: <ArrowTrendingUpIcon className="h-4 w-4" /> },
          { key: 'timing', label: 'Timing Insights', icon: <CalendarDaysIcon className="h-4 w-4" /> },
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setSelectedAnalysis(key as typeof selectedAnalysis)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedAnalysis === key
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Cut Popularity Analysis */}
      {selectedAnalysis === 'popularity' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h5 className="font-semibold text-gray-800 mb-3">Cut Popularity Ranking</h5>
            <div className="space-y-3">
              {Object.entries(haircutCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([cut, count], index) => (
                  <div key={cut} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-800">{cut}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-800">{count}</div>
                      <div className="text-xs text-gray-600">bookings</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Revenue Analysis */}
      {selectedAnalysis === 'revenue' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800">
                  ${stats.avgRevenuePerCut}
                </div>
                <div className="text-sm text-blue-600">Average Revenue per Cut</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800">
                  ${stats.avgProfitPerCut}
                </div>
                <div className="text-sm text-blue-600">Average Profit per Cut</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h5 className="font-semibold text-gray-800 mb-3">Revenue by Cut Type</h5>
            <div className="space-y-3">
              {Object.entries(
                appointments.reduce((acc, apt) => {
                  acc[apt.haircutType] = (acc[apt.haircutType] || 0) + apt.price;
                  return acc;
                }, {} as Record<string, number>)
              )
                .sort((a, b) => b[1] - a[1])
                .map(([cut, revenue]) => (
                  <div key={cut} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-800">{cut}</span>
                    <span className="font-bold text-blue-800">${revenue}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Timing Insights */}
      {selectedAnalysis === 'timing' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="text-center">
                <ArrowTrendingUpIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-green-800">
                  {busiestDay ? busiestDay[0] : 'N/A'}
                </div>
                <div className="text-sm text-green-600">Busiest Day</div>
                <div className="text-xs text-gray-600">
                  {busiestDay ? `${busiestDay[1]} bookings` : ''}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="text-center">
                <ArrowTrendingDownIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-red-800">
                  {slowestDay ? slowestDay[0] : 'N/A'}
                </div>
                <div className="text-sm text-red-600">Slowest Day</div>
                <div className="text-xs text-gray-600">
                  {slowestDay ? `${slowestDay[1]} bookings` : ''}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h5 className="font-semibold text-gray-800 mb-3">Daily Booking Distribution</h5>
            <div className="space-y-3">
              {Object.entries(dayCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([day, count]) => (
                  <div key={day} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-800">{day}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count / Math.max(...Object.values(dayCounts))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-blue-800">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ExpandableCard
      title="Haircut Analytics"
      subtitle="Cut popularity, revenue analysis, and timing insights"
      icon={<ChartBarIcon className="h-6 w-6 text-blue-600" />}
      variant="info"
      collapsedContent={collapsedContent}
      defaultExpanded={false}
    >
      {expandedContent}
    </ExpandableCard>
  );
} 