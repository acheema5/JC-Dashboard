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
      <Card className="bg-gradient-to-br from-black to-green-600 text-white border border-transparent shadow-md">
        <div className="text-center">
          <h3 className="text-sm font-medium uppercase tracking-wide">
            Revenue
          </h3>
          <p className="text-3xl font-bold mt-2">
            ${revenue.toLocaleString()}
          </p>
          <p className="text-sm text-white-100 mt-1">
            +12% from last week
          </p>
        </div>
      </Card>

      {/* Spending */}
      <Card className="bg-gradient-to-br from-black to-red-600 text-white border border-transparent shadow-md">
        <div className="text-center">
          <h3 className="text-sm font-medium uppercase tracking-wide">
            Spending
          </h3>
          <p className="text-3xl font-bold mt-2">
            ${spending.toLocaleString()}
          </p>
          <p className="text-sm text-red-100 mt-1">
            -5% from last week
          </p>
        </div>
      </Card>

      {/* Profit */}
      <Card className="bg-gradient-to-br from-black to-purple-700 text-white border border-transparent shadow-md">
        <div className="text-center">
          <h3 className="text-sm font-medium uppercase tracking-wide">
            Profit
          </h3>
          <p className="text-3xl font-bold mt-2">
            ${profit.toLocaleString()}
          </p>
          <p className="text-sm text-blue-100 mt-1">
            +18% from last week
          </p>
        </div>
      </Card>
    </div>
  );
}
