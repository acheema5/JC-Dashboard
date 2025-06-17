export interface Appointment {
  id: string;
  clientName: string;
  phoneNumber: string;
  haircutType: string;
  date: Date;
  duration: number;
  price: number;
  cost: number; // Added for profit calculation
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  cost: number;
  purchaseDate: Date;
  estimatedUsage: number; // days until empty
  restockThreshold: number; // custom threshold
  autoReorder: boolean; // auto-reorder toggle
  usageRate: number; // items per day
}

export interface DashboardStats {
  revenue: number;
  spending: number;
  profit: number;
  totalBookings: {
    today: number;
    week: number;
    month: number;
    year: number;
  };
  avgRevenuePerCut: number;
  avgProfitPerCut: number;
  mostCommonCut: string;
  slowestDay: string;
  busiestDay: string;
}

export interface AIInsight {
  id: string;
  type: 'opportunity' | 'promotion' | 'bundle' | 'scheduling';
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  smsMessage?: string;
}

export interface ExportOptions {
  type: 'appointments' | 'inventory';
  dateRange?: { start: Date; end: Date };
  client?: string;
  serviceType?: string;
}