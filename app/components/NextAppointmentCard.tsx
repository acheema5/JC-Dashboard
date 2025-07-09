'use client';

import { ClockIcon } from '@heroicons/react/24/outline';

interface NextAppointmentCardProps {
  clientName: string;
  service: string;
  time: Date | string;
  duration: number;
  phoneNumber: string;
}

export function NextAppointmentCard({
  clientName,
  service,
  time,
  duration,
  phoneNumber,
}: NextAppointmentCardProps) {
  // Parse time if string
  const parsedTime = typeof time === 'string' ? new Date(time) : time;

  const timeDisplay =
    parsedTime && !isNaN(parsedTime.getTime())
      ? `${parsedTime.toLocaleDateString(undefined, {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })} ${parsedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : 'Time not available';

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 rounded-xl p-6 border border-blue-200 shadow-lg flex flex-col h-full">
      {/* Header with icon */}
      <div className="flex items-center space-x-2 mb-8">
        <ClockIcon className="h-6 w-6 text-blue-600" />
        <h3 className="text-3xl font-bold text-blue-800">Next Appointment</h3>
      </div>

      {/* Client Name centered big */}
      <h2 className="text-5xl font-extrabold mb-10 text-center text-blue-800">{clientName}</h2>

      {/* Details left aligned with translucent border and spacing */}
      <div className="space-y-4">
        <div className="border border-blue-300 border-opacity-30 rounded-md px-4 py-2 bg-white/60">
          <span className="font-semibold text-blue-800">Service:</span> <span className="text-blue-700">{service}</span>
        </div>
        <div className="border border-blue-300 border-opacity-30 rounded-md px-4 py-2 bg-white/60">
          <span className="font-semibold text-blue-800">Date & Time:</span> <span className="text-blue-700">{timeDisplay}</span>
        </div>
        <div className="border border-blue-300 border-opacity-30 rounded-md px-4 py-2 bg-white/60">
          <span className="font-semibold text-blue-800">Duration:</span> <span className="text-blue-700">{duration} min</span>
        </div>
        <div className="border border-blue-300 border-opacity-30 rounded-md px-4 py-2 bg-white/60">
          <span className="font-semibold text-blue-800">Phone:</span> <span className="text-blue-700">{phoneNumber}</span>
        </div>
      </div>
    </div>
  );
}
