'use client';

import { Schedule } from './Schedule';
import { Appointment } from '../types';

interface ScheduleCardProps {
  appointments: Appointment[];
}

export function ScheduleCard({ appointments }: ScheduleCardProps) {
  return (
    <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-700 h-full min-h-[700px] overflow-hidden">
      <Schedule appointments={appointments} />
    </div>
  );
}