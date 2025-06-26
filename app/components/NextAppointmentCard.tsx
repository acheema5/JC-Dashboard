'use client';

interface NextAppointmentCardProps {
  clientName: string;
  service: string;
  time: Date | string; // accept string too, just in case
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
  // Parse time if it is a string to Date
  const parsedTime = typeof time === 'string' ? new Date(time) : time;

  // If time is invalid or undefined, show fallback text
  const timeDisplay =
    parsedTime && !isNaN(parsedTime.getTime())
      ? `${parsedTime.toLocaleDateString()} ${parsedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : 'Time not available';

  return (
    <div className="bg-gradient-to-br from-purple-700 to-blue-800 text-white rounded-lg p-6 border border-blue-900 shadow-lg">
      <h3 className="text-xl font-bold mb-4">Next Appointment</h3>
      <div className="space-y-2">
        <div>
          <span className="font-semibold">Client:</span> {clientName}
        </div>
        <div>
          <span className="font-semibold">Service:</span> {service}
        </div>
        <div className="flex justify-between">
          <div>
            <span className="font-semibold">Time:</span> {timeDisplay}
          </div>
          <div>
            <span className="font-semibold">Duration:</span> {duration} min
          </div>
        </div>
        <div>
          <span className="font-semibold">Phone:</span> {phoneNumber}
        </div>
      </div>
    </div>
  );
}
