// Updated transformation utility for actual webhook format
export interface WebhookAppointment {
  id: string;
  clientName: string;
  phoneNumber: number; // Note: webhook returns number
  haircutType: string;
  duration: number;
  price: number;
  date: string; // Format: "6/26/2025"
  time: string; // Format: "12:30 PM"
  status: boolean; // false = scheduled, true = completed
}

export interface Appointment {
  id: string;
  clientName: string;
  phoneNumber: string; // Frontend expects string
  haircutType: string;
  date: Date; // Frontend expects Date object
  duration: number;
  price: number;
  cost: number; // Missing from webhook, needs estimation
  status: 'scheduled' | 'completed'; // Frontend expects string
}

// Cost mapping for different haircut types
const HAIRCUT_COSTS: Record<string, number> = {
  'Burst Fade': 8,
  'Buzz Cut': 5,
  'Mullet': 10,
  'Undercut': 7,
  'Line Up': 6,
  'Fade': 8,
  'Taper': 7,
  'Crew Cut': 5,
  'Trim': 4,
};

/**
 * Parse separate date and time strings into Date object
 */
function parseDateTime(dateStr: string, timeStr: string): Date {
  try {
    // Combine date and time strings
    const dateTimeStr = `${dateStr} ${timeStr}`;
    // Parse the combined string (MM/DD/YYYY h:mm AM/PM)
    return new Date(dateTimeStr);
  } catch (error) {
    console.error(`Error parsing date/time: ${dateStr} ${timeStr}`, error);
    return new Date(); // Fallback to current date
  }
}

/**
 * Format phone number from integer to (XXX) XXX-XXXX format
 */
function formatPhoneNumber(phoneNum: number): string {
  try {
    // Convert to string and handle 10-11 digit numbers
    let phoneStr = phoneNum.toString();
    
    // Remove leading 1 if present (11-digit number)
    if (phoneStr.length === 11 && phoneStr.startsWith('1')) {
      phoneStr = phoneStr.substring(1);
    }
    
    // Format as (XXX) XXX-XXXX
    if (phoneStr.length === 10) {
      return `(${phoneStr.substring(0, 3)}) ${phoneStr.substring(3, 6)}-${phoneStr.substring(6)}`;
    }
    
    return phoneStr; // Return as-is if unexpected length
  } catch (error) {
    console.error('Error formatting phone number:', phoneNum, error);
    return phoneNum.toString();
  }
}

/**
 * Map boolean status to string status
 */
function mapStatus(statusBool: boolean): 'scheduled' | 'completed' {
  return statusBool ? 'completed' : 'scheduled';
}

/**
 * Estimate cost based on haircut type
 */
function estimateCost(haircutType: string): number {
  return HAIRCUT_COSTS[haircutType] || 6; // Default to $6
}

/**
 * Transform webhook data to frontend format
 */
export function transformWebhookData(webhookData: WebhookAppointment[]): Appointment[] {
  return webhookData.map((appointment) => {
    try {
      return {
        id: appointment.id,
        clientName: appointment.clientName,
        phoneNumber: formatPhoneNumber(appointment.phoneNumber),
        haircutType: appointment.haircutType,
        date: parseDateTime(appointment.date, appointment.time),
        duration: appointment.duration,
        price: appointment.price,
        cost: estimateCost(appointment.haircutType),
        status: mapStatus(appointment.status),
      };
    } catch (error) {
      console.error(`Error transforming appointment ${appointment.id}:`, error);
      // Return a fallback appointment to prevent crashes
      return {
        id: appointment.id || 'error',
        clientName: appointment.clientName || 'Unknown',
        phoneNumber: '(000) 000-0000',
        haircutType: appointment.haircutType || 'Unknown',
        date: new Date(),
        duration: appointment.duration || 30,
        price: appointment.price || 0,
        cost: 6,
        status: 'scheduled' as const,
      };
    }
  });
}

/**
 * Fetch and transform data from webhook
 */
export async function fetchTransformedData(): Promise<{
  success: boolean;
  data: Appointment[];
  error?: string;
}> {
  try {
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    
    if (!webhookUrl) {
      throw new Error('Webhook URL not configured');
    }

    console.log('Fetching data from webhook:', webhookUrl);
    
    const response = await fetch(webhookUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();
    console.log('Raw webhook response:', rawData);

    // Validate that we received an array
    if (!Array.isArray(rawData)) {
      throw new Error('Webhook returned non-array data');
    }

    // Transform the data
    const transformedData = transformWebhookData(rawData);
    console.log('Transformed data:', transformedData);

    return {
      success: true,
      data: transformedData,
    };

  } catch (error) {
    console.error('Error fetching webhook data:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
