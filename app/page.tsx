'use client';

import { useState } from 'react';
import { QuickStatsCard } from './components/QuickStatsCard';
import { AppointmentsOverviewCard } from './components/AppointmentsOverviewCard';
import { HaircutAnalyticsCard } from './components/HaircutAnalyticsCard';
import { AIInsightsCard } from './components/AIInsightsCard';
import { CalendarCard } from './components/CalendarCard';
import { NextAppointmentCard } from './components/NextAppointmentCard';
import { InventoryTrackingCard } from './components/InventoryTrackingCard';
import { DataExportCard } from './components/DataExportCard';
import { QuickActionsCard } from './components/QuickActionsCard';
import {
  Appointment,
  InventoryItem,
  DashboardStats,
  ExportOptions,
} from './types';

const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientName: 'John Smith',
    phoneNumber: '(555) 123-4567',
    haircutType: 'Burst Fade',
    date: new Date(2025, 6, 20, 14, 30),
    duration: 45,
    price: 35,
    cost: 8,
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
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);

  const completedAppointments = appointments.filter((apt) => apt.status === 'completed');
  const totalRevenue = completedAppointments.reduce((sum, apt) => sum + apt.price, 0);
  const totalCosts = completedAppointments.reduce((sum, apt) => sum + apt.cost, 0);
  const totalProfit = totalRevenue - totalCosts;

  const avgProfitPerCut = completedAppointments.length > 0
    ? Math.round(totalProfit / completedAppointments.length)
    : 0;

  const today = new Date();
  const todayAppointments = appointments.filter((apt) => apt.date.toDateString() === today.toDateString()).length;

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekAppointments = appointments.filter((apt) => apt.date >= weekStart).length;

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthAppointments = appointments.filter((apt) => apt.date >= monthStart).length;

  const yearStart = new Date(today.getFullYear(), 0, 1);
  const yearAppointments = appointments.filter((apt) => apt.date >= yearStart).length;

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
    avgRevenuePerCut: completedAppointments.length > 0
      ? Math.round(totalRevenue / completedAppointments.length)
      : 0,
    avgProfitPerCut,
    mostCommonCut: 'Burst Fade',
    slowestDay: 'Monday',
    busiestDay: 'Friday',
  };

  const nextAppointment = appointments
    .filter((apt) => apt.status === 'scheduled' && new Date(apt.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const handleRunningLate = () => {
    if (nextAppointment) {
      alert(`SMS sent to ${nextAppointment.clientName} (${nextAppointment.phoneNumber}): "Hey! Running 5 minutes behind, see you soon."`);
    }
  };

  const handleExportCSV = (options: ExportOptions) => {};

  const handleReorderItem = (itemId: string) => {
    const item = inventory.find((i) => i.id === itemId);
    if (item) {
      alert(`Reorder request sent for ${item.name}. ${item.autoReorder ? 'Auto-reorder is enabled.' : 'Manual reorder required.'}`);
    }
  };

  const handleUpdateThreshold = (itemId: string, threshold: number) => {
    setInventory((prev) => prev.map((item) => item.id === itemId ? { ...item, restockThreshold: threshold } : item));
  };

  const handleToggleAutoReorder = (itemId: string) => {
    setInventory((prev) => prev.map((item) => item.id === itemId ? { ...item, autoReorder: !item.autoReorder } : item));
  };

  const handleSendSMS = (message: string) => {
    alert(`SMS sent to clients: "${message}"`);
  };

  const handleCreatePromotion = (service: string) => {
    alert(`Promotion created for ${service}`);
  };

  const handleSendFollowUp = (appointment: Appointment) => {
    const message = `Hi ${appointment.clientName}! Hope you enjoyed your ${appointment.haircutType}! Book your next appointment: [booking-link]`;
    alert(`Follow-up SMS sent to ${appointment.clientName} (${appointment.phoneNumber}): "${message}"`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Barber Shop Dashboard</h1>
          <p className="text-gray-400">Modern card-based business management with automation-ready features</p>
        </div>

        {/* Row 1: Quick Stats */}
        <QuickStatsCard
          revenue={dashboardStats.revenue}
          spending={dashboardStats.spending}
          profit={dashboardStats.profit}
        />

        {/* Row 2: Left (Next Appointment), Middle (Appointments Overview), Right (AI Insights) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <NextAppointmentCard
            clientName={nextAppointment.clientName}
            service={nextAppointment.haircutType}
            time={nextAppointment.date.toISOString()} // pass time as string
            duration={nextAppointment.duration}
            phoneNumber={nextAppointment.phoneNumber}
          />

          <AppointmentsOverviewCard
            stats={dashboardStats}
            nextAppointment={nextAppointment}
            onRunningLate={handleRunningLate}
          />
          <AIInsightsCard
            onSendSMS={handleSendSMS}
            onCreatePromotion={handleCreatePromotion}
          />
        </div>

        {/* Row 3: Left (Calendar), Middle (Haircut Stats), Right (Quick Actions) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <CalendarCard appointments={appointments} />
          <HaircutAnalyticsCard stats={dashboardStats} appointments={appointments} />
          <QuickActionsCard onSendSMS={handleSendSMS} />
        </div>

        {/* Row 4: Full Width Schedule Visualization */}
        <div className="bg-white rounded-xl p-6 shadow">
          Weekly Schedule Visualization Placeholder
        </div>

        {/* Floating View Tab Button */}
        <div className="fixed top-6 right-6 z-50">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded shadow">
            View Tab
          </button>
        </div>
      </div>
    </div>
  );
}
