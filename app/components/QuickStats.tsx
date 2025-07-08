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
      {/* Revenue */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 border border-blue-200 shadow-md">
        <div className="text-center">
          <h3 className="text-xl font-bold uppercase tracking-wide text-blue-700" style={{ fontFamily: 'Bookmania, serif' }}>
            Revenue
          </h3>
          <p className="text-3xl font-bold mt-2 text-blue-800">
            ${revenue.toLocaleString()}
          </p>
          <p className="text-sm text-blue-600 mt-1">
            +12% from last week
          </p>
        </div>
      </Card>

      {/* Spending */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 border border-blue-200 shadow-md">
        <div className="text-center">
          <h3 className="text-xl font-bold uppercase tracking-wide text-blue-700" style={{ fontFamily: 'Bookmania, serif' }}>
            Spending
          </h3>
          <p className="text-3xl font-bold mt-2 text-blue-800">
            ${spending.toLocaleString()}
          </p>
          <p className="text-sm text-blue-600 mt-1">
            -5% from last week
          </p>
        </div>
      </Card>

      {/* Profit */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 border border-blue-200 shadow-md">
        <div className="text-center">
          <h3 className="text-xl font-bold uppercase tracking-wide text-blue-700" style={{ fontFamily: 'Bookmania, serif' }}>
            Profit
          </h3>
          <p className="text-3xl font-bold mt-2 text-blue-800">
            ${profit.toLocaleString()}
          </p>
          <p className="text-sm text-blue-600 mt-1">
            +18% from last week
          </p>
        </div>
      </Card>
    </div>
  );
}
