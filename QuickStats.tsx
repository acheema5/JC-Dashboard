'use client';

import { Card } from '../card';

interface QuickStatsProps {
  revenue: number;
  spending: number;
  profit: number;
}

export function QuickStats({ revenue, spending, profit }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <div className="text-center">
          <h3 className="text-sm font-medium text-green-600 uppercase tracking-wide">Revenue</h3>
          <p className="text-3xl font-bold text-green-800 mt-2">${revenue.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-1">+12% from last week</p>
        </div>
      </Card>
      
      <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
        <div className="text-center">
          <h3 className="text-sm font-medium text-red-600 uppercase tracking-wide">Spending</h3>
          <p className="text-3xl font-bold text-red-800 mt-2">${spending.toLocaleString()}</p>
          <p className="text-sm text-red-600 mt-1">-5% from last week</p>
        </div>
      </Card>
      
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <div className="text-center">
          <h3 className="text-sm font-medium text-blue-600 uppercase tracking-wide">Profit</h3>
          <p className="text-3xl font-bold text-blue-800 mt-2">${profit.toLocaleString()}</p>
          <p className="text-sm text-blue-600 mt-1">+18% from last week</p>
        </div>
      </Card>
    </div>
  );
}