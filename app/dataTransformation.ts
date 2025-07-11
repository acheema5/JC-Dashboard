// Updated transformation utility for webhook format with appointments, expenses, and AI insights

export interface WebhookAppointment {
 id: string;
 clientName: string;
 phoneNumber: number;
 haircutType: string;
 duration: number;
 price: number;
 date: string;
 time: string;
 status: boolean;
}

export interface Appointment {
 id: string;
 clientName: string;
 phoneNumber: string;
 haircutType: string;
 date: Date;
 duration: number;
 price: number;
 cost: number;
 status: "scheduled" | "completed";
}

export interface Expense {
 date: Date;
 amount: number;
}

export interface AIInsights {
 performanceScore: number;
 keyInsights: string[];
 peakHours: string[];
 topServices: { service: string; count: number }[];
 revenueThisWeek: number;
 recommendations: string[];
 lastUpdated: string;
 status: string;
}

export interface TransformedData {
 appointments: Appointment[];
 expenses: Expense[];
 aiInsights: AIInsights | null;
}

// Cost mapping for different haircut types
const HAIRCUT_COSTS: Record<string, number> = {
 "Burst Fade": 8,
 "Buzz Cut": 5,
 Mullet: 10,
 Undercut: 7,
 "Line Up": 6,
 Fade: 8,
 Taper: 7,
 "Crew Cut": 5,
 Trim: 4,
};

/**
 * Parse separate date and time strings into Date object
 */
function parseDateTime(dateStr: string, timeStr: string): Date {
 try {
  const dateTimeStr = `${dateStr} ${timeStr}`;
  return new Date(dateTimeStr);
 } catch (error) {
  console.error(`Error parsing date/time: ${dateStr} ${timeStr}`, error);
  return new Date();
 }
}

/**
 * Parse date string (for expenses) into Date object
 */
function parseDate(dateStr: string): Date {
 try {
  return new Date(dateStr);
 } catch (error) {
  console.error(`Error parsing date: ${dateStr}`, error);
  return new Date();
 }
}

/**
 * Format phone number from integer to (XXX) XXX-XXXX format
 */
function formatPhoneNumber(phoneNum: number): string {
 try {
  let phoneStr = phoneNum.toString();
  if (phoneStr.length === 11 && phoneStr.startsWith("1")) {
   phoneStr = phoneStr.substring(1);
  }

  if (phoneStr.length === 10) {
   return `(${phoneStr.substring(0, 3)}) ${phoneStr.substring(
    3,
    6
   )}-${phoneStr.substring(6)}`;
  }

  return phoneStr;
 } catch (error) {
  console.error("Error formatting phone number:", phoneNum, error);
  return phoneNum.toString();
 }
}

/**
 * Map boolean status to string status
 */
function mapStatus(statusBool: boolean): "scheduled" | "completed" {
 return statusBool ? "completed" : "scheduled";
}

/**
 * Estimate cost based on haircut type
 */
function estimateCost(haircutType: string): number {
 return HAIRCUT_COSTS[haircutType] || 6;
}

/**
 * Transform webhook data to frontend format - handles appointments, expenses, and AI insights
 */
export function transformWebhookData(webhookData: any[]): TransformedData {
 const appointments: Appointment[] = [];
 const expenses: Expense[] = [];
 let aiInsights: AIInsights | null = null;

 // Separate appointments, expenses, and AI insights
 webhookData.forEach((item) => {
  if (item.aiInsights) {
   // This is the AI insights object
   aiInsights = {
    performanceScore: item.aiInsights.performanceScore,
    keyInsights: item.aiInsights.keyInsights,
    peakHours: item.aiInsights.peakHours,
    topServices: item.aiInsights.topServices,
    revenueThisWeek: item.aiInsights.revenueThisWeek,
    recommendations: item.aiInsights.recommendations,
    lastUpdated: item.lastUpdated,
    status: item.status,
   };
  } else if (item.clientName) {
   // This is an appointment object
   try {
    const transformedAppointment: Appointment = {
     id: item.id || `${Date.now()}-${Math.random()}`,
     clientName: item.clientName,
     phoneNumber: formatPhoneNumber(item.phoneNumber),
     haircutType: item.haircutType,
     date: parseDateTime(item.date, item.time),
     duration: item.duration,
     price: item.price,
     cost: estimateCost(item.haircutType),
     status: mapStatus(item.status),
    };
    appointments.push(transformedAppointment);
   } catch (error) {
    console.error(`Error transforming appointment:`, error);
   }
  } else if (item.amount && item.date && !item.clientName) {
   // This is an expense object
   try {
    const transformedExpense: Expense = {
     date: parseDate(item.date),
     amount:
      typeof item.amount === "number" ? item.amount : parseFloat(item.amount),
    };
    expenses.push(transformedExpense);
   } catch (error) {
    console.error(`Error transforming expense:`, error);
   }
  }
 });

 console.log(`✅ Transformed ${appointments.length} appointments`);
 console.log(`✅ Transformed ${expenses.length} expenses`);
 console.log(`✅ AI insights ${aiInsights ? "found" : "not found"}`);

 return {
  appointments,
  expenses,
  aiInsights,
 };
}

/**
 * Fetch and transform data from webhook
 */
export async function fetchTransformedData(): Promise<{
 success: boolean;
 data: Appointment[];
 expenses: Expense[];
 aiInsights: AIInsights | null;
 error?: string;
}> {
 try {
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
  if (!webhookUrl) {
   throw new Error("Webhook URL not configured");
  }

  console.log("🔄 Fetching data from webhook:", webhookUrl);
  const response = await fetch(webhookUrl, {
   method: "GET",
   headers: {
    Accept: "application/json",
   },
  });

  if (!response.ok) {
   throw new Error(`HTTP error! status: ${response.status}`);
  }

  const rawData = await response.json();
  console.log("📥 Raw webhook response:", rawData);

  if (!Array.isArray(rawData)) {
   throw new Error("Webhook returned non-array data");
  }

  const transformedData = transformWebhookData(rawData);
  console.log("📊 Transformed data:", transformedData);

  return {
   success: true,
   data: transformedData.appointments,
   expenses: transformedData.expenses,
   aiInsights: transformedData.aiInsights,
  };
 } catch (error) {
  console.error("❌ Error fetching webhook data:", error);
  return {
   success: false,
   data: [],
   expenses: [],
   aiInsights: null,
   error: error instanceof Error ? error.message : "Unknown error",
  };
 }
}
