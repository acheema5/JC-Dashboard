'use client';

import { Schedule } from './Schedule';
import { Appointment } from '../types';

interface ScheduleCardProps {
  appointments: Appointment[];
}

export function ScheduleCard({ appointments }: ScheduleCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full">
      <Schedule appointments={appointments} />
    </div>
  );
}