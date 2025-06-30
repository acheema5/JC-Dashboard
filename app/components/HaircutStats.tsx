'use client';

import { useState } from 'react';
import { Card } from '../card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../dialog';
import { Appointment, DashboardStats } from '../types';

interface HaircutStatsProps {
  stats: DashboardStats;
  appointments: Appointment[];
}

export function HaircutStats({ stats, appointments }: HaircutStatsProps) {
  const [selectedCut, setSelectedCut] = useState<string | null>(null);

  const thisWeek = new Date();
  const weekStart = new Date(thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay()));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const thisWeekAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate >= weekStart && aptDate <= weekEnd && apt.status === 'completed';
  });

  const cutBreakdown = thisWeekAppointments.reduce((acc, apt) => {
    acc[apt.haircutType] = (acc[apt.haircutType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCuts = Object.entries(cutBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const getSelectedCutDetails = (cutType: string) => {
    const cutAppointments = thisWeekAppointments.filter(apt => apt.haircutType === cutType);
    const byDay = cutAppointments.reduce((acc, apt) => {
      const day = apt.date.toLocaleDateString('en-US', { weekday: 'long' });
      if (!acc[day]) acc[day] = [];
      acc[day].push(apt);
      return acc;
    }, {} as Record<string, Appointment[]>);

    return { cutAppointments, byDay };
  };

  return (
    <Card className="bg-gradient-to-br from-teal-50 to-white border border-teal-200 shadow-sm rounded-xl">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-teal-800">Haircut Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-3 border border-teal-100 shadow-sm">
              <span className="text-sm font-medium text-gray-600">Slowest Days:</span>
              <p className="text-gray-800 font-semibold">Monday, Tuesday</p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-3 border border-teal-100 shadow-sm">
              <span className="text-sm font-medium text-gray-600">Busiest Day:</span>
              <p className="text-gray-800 font-semibold">{stats.busiestDay}</p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-3 border border-teal-100 shadow-sm">
              <span className="text-sm font-medium text-gray-600">Avg Revenue/Cut:</span>
              <p className="text-gray-800 font-bold">${stats.avgRevenuePerCut}</p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-3 border border-teal-100 shadow-sm">
              <span className="text-sm font-medium text-gray-600">Avg Profit/Cut:</span>
              <p className="text-gray-800 font-bold text-green-600">${stats.avgProfitPerCut}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-3 border border-teal-100 shadow-sm">
              <span className="text-sm font-medium text-gray-600">Most Common Cut (This Week):</span>
              <p className="text-gray-800 font-semibold">{stats.mostCommonCut}</p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-3 border border-teal-100 shadow-sm">
              <div className="text-sm">
                <div className="font-medium text-gray-600 mb-2">Popular Cuts This Week:</div>
                <div className="space-y-2">
                  {sortedCuts.map(([cut, count]) => {
                    const percentage = Math.round((count / thisWeekAppointments.length) * 100);
                    return (
                      <Dialog key={cut}>
                        <DialogTrigger asChild>
                          <button 
                            className="w-full text-left hover:bg-teal-100/50 p-2 rounded-lg transition-colors"
                            onClick={() => setSelectedCut(cut)}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-gray-800 font-medium">{cut}</span>
                              <div className="flex items-center space-x-2">
                                <span className="flex items-center space-x-2">
                                  <span className="block h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                                    <span 
                                      className="block h-2 bg-teal-500 rounded-full transition-all"
                                      style={{ width: `${percentage}%` }}
                                    ></span>
                                  </span>
                                  <span className="text-teal-800 font-medium">{percentage}%</span>
                                </span>
                                <span className="text-xs text-gray-500">({count})</span>
                              </div>
                            </div>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle className="text-teal-800 font-bold">{cut} - Weekly Breakdown</DialogTitle>
                          </DialogHeader>
                          {selectedCut === cut && (
                            <div className="bg-gradient-to-br from-white to-teal-50 p-4 rounded-xl border border-teal-100 shadow-sm space-y-4">
                              {(() => {
                                const { cutAppointments, byDay } = getSelectedCutDetails(cut);
                                return (
                                  <>
                                    <div className="bg-teal-50 rounded-lg p-3">
                                      <h4 className="font-medium text-teal-800 mb-2">Summary</h4>
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <span className="text-gray-600">Total This Week:</span>
                                          <p className="font-bold text-gray-800">{cutAppointments.length}</p>
                                        </div>
                                        <div>
                                          <span className="text-gray-600">Avg Revenue:</span>
                                          <p className="font-bold text-gray-800">
                                            ${Math.round(cutAppointments.reduce((sum, apt) => sum + apt.price, 0) / cutAppointments.length)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h4 className="font-medium text-gray-800 mb-3">By Day</h4>
                                      <div className="space-y-2">
                                        {Object.entries(byDay).map(([day, dayAppointments]) => (
                                          <div key={day} className="bg-gradient-to-r from-teal-50 to-white rounded-xl p-3 border border-teal-100 shadow-sm">
                                            <div className="font-medium text-gray-700 mb-1">
                                              {day} ({dayAppointments.length})
                                            </div>
                                            <div className="space-y-1">
                                              {dayAppointments.map(apt => (
                                                <div key={apt.id} className="text-sm text-gray-700 ml-3">
                                                  • {apt.clientName} - {apt.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
