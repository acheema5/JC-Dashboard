import { Appointment } from './dataTransformation';

export function validateAppointmentData(appointments: Appointment[]): {
  isValid: boolean;
  issues: string[];
  summary: {
    total: number;
    scheduled: number;
    completed: number;
    phoneFormatIssues: number;
    dateIssues: number;
  };
} {
  const issues: string[] = [];
  let phoneFormatIssues = 0;
  let dateIssues = 0;
  
  const scheduled = appointments.filter(apt => apt.status === 'scheduled').length;
  const completed = appointments.filter(apt => apt.status === 'completed').length;
  
  appointments.forEach((apt, index) => {
    // Check phone number format
    if (!apt.phoneNumber.match(/^\(\d{3}\) \d{3}-\d{4}$/)) {
      phoneFormatIssues++;
      issues.push(`Appointment ${index + 1}: Invalid phone format "${apt.phoneNumber}"`);
    }
    
    // Check date validity
    if (isNaN(apt.date.getTime())) {
      dateIssues++;
      issues.push(`Appointment ${index + 1}: Invalid date "${apt.date}"`);
    }
    
    // Check required fields
    if (!apt.id || !apt.clientName || !apt.haircutType) {
      issues.push(`Appointment ${index + 1}: Missing required fields`);
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues,
    summary: {
      total: appointments.length,
      scheduled,
      completed,
      phoneFormatIssues,
      dateIssues,
    },
  };
}

export function logWebhookConnection(url: string, success: boolean, data?: any, error?: string) {
  const timestamp = new Date().toISOString();
  
  if (success) {
    console.log(`✅ [${timestamp}] Webhook connection successful`);
    console.log(`📍 URL: ${url}`);
    console.log(`📊 Data received: ${Array.isArray(data) ? data.length : 0} appointments`);
  } else {
    console.error(`❌ [${timestamp}] Webhook connection failed`);
    console.error(`📍 URL: ${url}`);
    console.error(`🚫 Error: ${error}`);
  }
}
