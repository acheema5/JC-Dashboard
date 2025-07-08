'use client';

import { NextAppointmentCard } from './NextAppointmentCard';
import { Appointment } from '../types';

interface NextAppointmentProps {
  nextAppointment: Appointment | null;
}

export function NextAppointment({ nextAppointment }: NextAppointmentProps) {
  if (!nextAppointment) {
    return (
      <div className="text-center text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 rounded-md p-6 border border-blue-200">
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
