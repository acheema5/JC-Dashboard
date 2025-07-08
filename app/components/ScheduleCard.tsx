'use client';

import { Schedule } from './Schedule';
import { Appointment } from '../types';

interface ScheduleCardProps {
  appointments: Appointment[];
}

export function ScheduleCard({ appointments }: ScheduleCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-2xl border border-blue-200 h-full min-h-[700px] overflow-hidden">
      <Schedule appointments={appointments} />
    </div>
  );
}