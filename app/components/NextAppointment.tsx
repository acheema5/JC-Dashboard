'use client';

import { NextAppointmentCard } from './NextAppointmentCard';
import { Appointment } from '../types';

interface NextAppointmentProps {
  nextAppointment: Appointment | null;
}

export function NextAppointment({ nextAppointment }: NextAppointmentProps) {
  if (!nextAppointment) {
    return (
      <div className="text-center text-gray-400 bg-slate-800 rounded-md p-6 border border-slate-700">
        No upcoming appointments
      </div>
    );
  }

  return (
    <NextAppointmentCard
      clientName={nextAppointment.clientName}
      service={nextAppointment.haircutType}
      time={nextAppointment.date}
      duration={nextAppointment.duration}
      phoneNumber={nextAppointment.phoneNumber}
    />
  );
}
