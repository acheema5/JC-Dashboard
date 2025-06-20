'use client';

import { useState, useEffect } from 'react';
import { QuickStatsCard } from './components/QuickStatsCard';
import { AppointmentsOverviewCard } from './components/AppointmentsOverviewCard';
import { HaircutAnalyticsCard } from './components/HaircutAnalyticsCard';
import { AIInsightsCard } from './components/AIInsightsCard';
import { CalendarCard } from './components/CalendarCard';
import { ClientHistoryCard } from './components/ClientHistoryCard';
import { InventoryTrackingCard } from './components/InventoryTrackingCard';
import { DataExportCard } from './components/DataExportCard';
import { QuickActionsCard } from './components/QuickActionsCard';
import {
  Appointment,
  InventoryItem,
  DashboardStats,
  ExportOptions,
} from './types';

// Enhanced mock data with cost for profit calculation
const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientName: 'John Smith',
    phoneNumber: '(555) 123-4567',
    haircutType: 'Burst Fade',
    date: new Date(2025, 6, 20, 14, 30),
    duration: 45,
    price: 35,
    cost: 8, // Added cost for profit calculation
    status: 'scheduled',
  },
  {
    id: '2',
    clientName: 'Mike Johnson',
    phoneNumber: '(555) 987-6543',
    haircutType: 'Buzz Cut',
    date: new Date(2025, 6, 22, 10, 0),
    duration: 25,
    price: 25,
    cost: 5,
    status: 'completed',
  },
  {
    id: '3',
    clientName: 'David Wilson',
    phoneNumber: '(555) 456-7890',
    haircutType: 'Mullet',
    date: new Date(2025, 7, 1, 16, 0),
    duration: 40,
    price: 45,
    cost: 10,
    status: 'scheduled',
  },
  {
    id: '4',
    clientName: 'Chris Brown',
    phoneNumber: '(555) 321-0987',
    haircutType: 'Undercut',
    date: new Date(2025, 7, 5, 15, 30),
    duration: 35,
    price: 30,
    cost: 7,
    status: 'completed',
  },
  {
    id: '5',
    clientName: 'Alex Davis',
    phoneNumber: '(555) 654-3210',
    haircutType: 'Burst Fade',
    date: new Date(2025, 7, 21, 11, 0),
    duration: 45,
    price: 35,
    cost: 8,
    status: 'scheduled',
  },
  {
    id: '6',
    clientName: 'Tom Wilson',
    phoneNumber: '(555) 111-2222',
    haircutType: 'Mullet',
    date: new Date(2025, 8, 12, 9, 0),
    duration: 40,
    price: 45,
    cost: 10,
    status: 'completed',
  },
  {
    id: '7',
    clientName: 'Steve Miller',
    phoneNumber: '(555) 333-4444',
    haircutType: 'Burst Fade',
    date: new Date(2025, 10, 11, 16, 30),
    duration: 45,
    price: 35,
    cost: 8,
    status: 'completed',
  },
];

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Hair Clippers',
    quantity: 3,
    cost: 150,
    purchaseDate: new Date(2024, 11, 1),
    estimatedUsage: 30,
    restockThreshold: 2,
    autoReorder: true,
    usageRate: 0.1,
  },
  {
    id: '2',
    name: 'Shampoo',
    quantity: 2,
    cost: 25,
    purchaseDate: new Date(2025, 0, 5),
    estimatedUsage: 5,
    restockThreshold: 5,
    autoReorder: false,
    usageRate: 0.4,
  },
  {
    id: '3',
    name: 'Hair Gel',
    quantity: 8,
    cost: 15,
    purchaseDate: new Date(2024, 11, 20),
    estimatedUsage: 15,
    restockThreshold: 3,
    autoReorder: true,
    usageRate: 0.5,
  },
  {
    id: '4',
    name: 'Towels',
    quantity: 12,
    cost: 8,
    purchaseDate: new Date(2024, 10, 15),
    estimatedUsage: 45,
    restockThreshold: 6,
    autoReorder: false,
    usageRate: 0.3,
  },
];

export default function BarberDashboard() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(mockAppointments);
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);

  // Calculate enhanced dashboard stats
  const completedAppointments = appointments.filter(
    (apt) => apt.status === 'completed'
  );
  const totalRevenue = completedAppointments.reduce(
    (sum, apt) => sum + apt.price,
    0
  );
  const totalCosts = completedAppointments.reduce(
    (sum, apt) => sum + apt.cost,
    0
  );
  const totalProfit = totalRevenue - totalCosts;
  const avgProfitPerCut =
    completedAppointments.length > 0
      ? Math.round(totalProfit / completedAppointments.length)
      : 0;

  // Calculate bookings by period
  const today = new Date();
  const todayAppointments = appointments.filter(
    (apt) => apt.date.toDateString() === today.toDateString()
  ).length;

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekAppointments = appointments.filter(
    (apt) => apt.date >= weekStart
  ).length;

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthAppointments = appointments.filter(
    (apt) => apt.date >= monthStart
  ).length;

  const yearStart = new Date(today.getFullYear(), 0, 1);
  const yearAppointments = appointments.filter(
    (apt) => apt.date >= yearStart
  ).length;

  const dashboardStats: DashboardStats = {
    revenue: totalRevenue,
    spending: 940,
    profit: totalProfit,
    totalBookings: {
      today: todayAppointments,
      week: weekAppointments,
      month: monthAppointments,
      year: yearAppointments,
    },
    avgRevenuePerCut:
      completedAppointments.length > 0
        ? Math.round(totalRevenue / completedAppointments.length)
        : 0,
    avgProfitPerCut,
    mostCommonCut: 'Burst Fade',
    slowestDay: 'Monday',
    busiestDay: 'Friday',
  };

  const nextAppointment = appointments
    .filter(
      (apt) => apt.status === 'scheduled' && new Date(apt.date) > new Date()
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const handleRunningLate = () => {
    if (nextAppointment) {
      alert(
        `SMS sent to ${nextAppointment.clientName} (${nextAppointment.phoneNumber}): "Hey! Running 5 minutes behind, see you soon."`
      );
    }
  };

  const handleExportCSV = (options: ExportOptions) => {
    let csvContent = '';
    let filename = '';

    if (options.type === 'appointments') {
      csvContent = [
        [
          'Client Name',
          'Phone Number',
          'Haircut Type',
          'Date',
          'Duration',
          'Price',
          'Cost',
          'Profit',
          'Status',
        ],
        ...appointments
          .filter((apt) => {
            if (options.client)
              return apt.clientName
                .toLowerCase()
                .includes(options.client.toLowerCase());
            if (options.serviceType)
              return apt.haircutType
                .toLowerCase()
                .includes(options.serviceType.toLowerCase());
            return true;
          })
          .map((apt) => [
            apt.clientName,
            apt.phoneNumber,
            apt.haircutType,
            apt.date.toLocaleDateString(),
            apt.duration.toString(),
            apt.price.toString(),
            apt.cost.toString(),
            (apt.price - apt.cost).toString(),
            apt.status,
          ]),
      ]
        .map((row) => row.join(','))
        .join('\n');
      filename = 'appointments.csv';
    } else {
      csvContent = [
        [
          'Item Name',
          'Quantity',
          'Cost',
          'Purchase Date',
          'Usage Rate',
          'Restock Threshold',
          'Auto Reorder',
        ],
        ...inventory.map((item) => [
          item.name,
          item.quantity.toString(),
          item.cost.toString(),
          item.purchaseDate.toLocaleDateString(),
          item.usageRate.toString(),
          item.restockThreshold.toString(),
          item.autoReorder.toString(),
        ]),
      ]
        .map((row) => row.join(','))
        .join('\n');
      filename = 'inventory.csv';
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleReorderItem = (itemId: string) => {
    const item = inventory.find((i) => i.id === itemId);
    if (item) {
      alert(
        `Reorder request sent for ${item.name}. ${
          item.autoReorder
            ? 'Auto-reorder is enabled.'
            : 'Manual reorder required.'
        }`
      );
    }
  };

  const handleUpdateThreshold = (itemId: string, threshold: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, restockThreshold: threshold } : item
      )
    );
  };

  const handleToggleAutoReorder = (itemId: string) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, autoReorder: !item.autoReorder } : item
      )
    );
  };

  const handleSendSMS = (message: string) => {
    alert(`SMS sent to clients: "${message}"`);
  };

  const handleCreatePromotion = (service: string) => {
    alert(`Promotion created for ${service}`);
  };

  const handleSendFollowUp = (appointment: Appointment) => {
    const message = `Hi ${appointment.clientName}! Hope you enjoyed your ${appointment.haircutType}! Book your next appointment: [booking-link]`;
    alert(
      `Follow-up SMS sent to ${appointment.clientName} (${appointment.phoneNumber}): "${message}"`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Barber Shop Dashboard
          </h1>
          <p className="text-gray-600">
            Modern card-based business management with automation-ready features
          </p>
        </div>

        {/* Quick Stats Card */}
        <QuickStatsCard
          revenue={dashboardStats.revenue}
          spending={dashboardStats.spending}
          profit={dashboardStats.profit}
        />

        {/* Main Grid - Responsive Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Appointments Overview Card */}
          <AppointmentsOverviewCard
            stats={dashboardStats}
            nextAppointment={nextAppointment}
            onRunningLate={handleRunningLate}
          />

          {/* Haircut Analytics Card */}
          <HaircutAnalyticsCard
            stats={dashboardStats}
            appointments={appointments}
          />

          {/* AI Insights Card */}
          <AIInsightsCard
            onSendSMS={handleSendSMS}
            onCreatePromotion={handleCreatePromotion}
          />

          {/* Calendar Card */}
          <CalendarCard appointments={appointments} />

          {/* Client History Card */}
          <ClientHistoryCard
            appointments={appointments}
            onSendFollowUp={handleSendFollowUp}
          />

          {/* Inventory Tracking Card */}
          <InventoryTrackingCard
            inventory={inventory}
            onReorderItem={handleReorderItem}
            onUpdateThreshold={handleUpdateThreshold}
            onToggleAutoReorder={handleToggleAutoReorder}
          />

          {/* Data Export Card */}
          <DataExportCard onExportCSV={handleExportCSV} />

          {/* Quick Actions Card */}
          <QuickActionsCard onSendSMS={handleSendSMS} />
        </div>
      </div>
    </div>
  );
}
