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
    <div className="bg-gradient-to-br from-purple-700 to-blue-800 text-white rounded-xl p-6 border border-blue-900 shadow-lg flex flex-col h-full">
      {/* Header with icon */}
      <div className="flex items-center space-x-2 mb-8">
        <ClockIcon className="h-6 w-6 text-white" />
        <h3 className="text-xl font-semibold">Next Appointment</h3>
      </div>

      {/* Client Name centered big */}
      <h2 className="text-5xl font-extrabold mb-10 text-center">{clientName}</h2>

      {/* Details left aligned with translucent border and spacing */}
      <div className="space-y-4">
        <div className="border border-white border-opacity-30 rounded-md px-4 py-2">
          <span className="font-semibold">Service:</span> {service}
        </div>
        <div className="border border-white border-opacity-30 rounded-md px-4 py-2">
          <span className="font-semibold">Date & Time:</span> {timeDisplay}
        </div>
        <div className="border border-white border-opacity-30 rounded-md px-4 py-2">
          <span className="font-semibold">Duration:</span> {duration} min
        </div>
        <div className="border border-white border-opacity-30 rounded-md px-4 py-2">
          <span className="font-semibold">Phone:</span> {phoneNumber}
        </div>
      </div>
    </div>
  );
}
