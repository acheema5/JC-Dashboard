'use client';

import { useState } from 'react';
import {
  BoltIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  EnvelopeIcon,
  PhoneIcon,
  MegaphoneIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../button';
import { ExpandableCard } from './ExpandableCard';

interface QuickActionsCardProps {
  onSendSMS: (message: string) => void;
  onCreatePromotion: (service: string) => void;
}

const mockNotifications = [
  {
    id: '1',
    type: 'appointment',
    title: 'New booking request',
    message: 'John Smith wants to book a Mullet cut for tomorrow',
    time: '2 minutes ago',
    unread: true,
  },
  {
    id: '2',
    type: 'inventory',
    title: 'Low stock alert',
    message: 'Hair Gel is running low (2 items remaining)',
    time: '15 minutes ago',
    unread: true,
  },
  {
    id: '3',
    type: 'system',
    title: 'System update',
    message: 'Dashboard updated with new analytics features',
    time: '1 hour ago',
    unread: false,
  },
];

const quickActions = [
  {
    id: 'running-late',
    title: 'Running Late',
    message: 'Hey! Running 5 minutes behind, see you soon.',
    icon: <ClockIcon className="h-4 w-4" />,
  },
  {
    id: 'reminder',
    title: 'Appointment Reminder',
    message: 'Hi! Just a friendly reminder about your appointment tomorrow.',
    icon: <BellIcon className="h-4 w-4" />,
  },
  {
    id: 'follow-up',
    title: 'Follow-up',
    message: 'Hope you enjoyed your haircut! Book your next appointment.',
    icon: <EnvelopeIcon className="h-4 w-4" />,
  },
  {
    id: 'promotion',
    title: 'Special Offer',
    message: 'Limited time offer: 20% off all services this week!',
    icon: <MegaphoneIcon className="h-4 w-4" />,
  },
];

export function QuickActionsCard({ onSendSMS, onCreatePromotion }: QuickActionsCardProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [notifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const collapsedContent = (
    <div className="space-y-4">
      <div className="rounded-lg p-4 border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="text-sm font-medium text-blue-600 uppercase tracking-wide">
            Notifications
          </div>
          <div className="text-2xl font-bold text-blue-800 mt-1">{unreadCount}</div>
          <div className="text-sm text-blue-600 mt-1">Unread messages</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg p-3 border border-blue-200 bg-white text-center">
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600 mx-auto mb-1" />
          <div className="text-xs text-blue-600">Quick SMS</div>
        </div>
        <div className="rounded-lg p-3 border border-blue-200 bg-white text-center">
          <BellIcon className="h-5 w-5 text-blue-600 mx-auto mb-1" />
          <div className="text-xs text-blue-600">Alerts</div>
        </div>
      </div>
    </div>
  );

  const expandedContent = (
    <div className="space-y-6">
      <div>
        <h5 className="font-semibold text-blue-800 mb-3">Recent Notifications</h5>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-all ${
                notification.unread
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300'
                  : 'bg-white border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h6 className="font-medium text-blue-800">{notification.title}</h6>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-blue-700 mt-1">{notification.message}</p>
                  <div className="text-xs text-blue-600 mt-2">{notification.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h5 className="font-semibold text-blue-800 mb-3">Quick Actions</h5>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => setSelectedAction(selectedAction === action.id ? null : action.id)}
              className={`p-3 rounded-lg border transition-all ${
                selectedAction === action.id
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : 'bg-white border-blue-200 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="text-blue-600">{action.icon}</div>
                <span className="text-sm font-medium text-blue-800">{action.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedAction && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-300">
          <h6 className="font-semibold text-blue-800 mb-3">
            {quickActions.find((a) => a.id === selectedAction)?.title}
          </h6>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Message Preview
              </label>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <p className="text-sm text-blue-800">
                  {quickActions.find((a) => a.id === selectedAction)?.message}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Customize Message (Optional)
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Customize the message..."
                className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white text-blue-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <Button
              onClick={() => {
                const message =
                  customMessage ||
                  quickActions.find((a) => a.id === selectedAction)?.message ||
                  '';
                onSendSMS(message);
                setSelectedAction(null);
                setCustomMessage('');
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-md"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg p-4 border border-blue-200">
        <h5 className="font-semibold text-blue-800 mb-3">Automation Status</h5>
        <div className="grid grid-cols-2 gap-4">
          <StatusDot label="SMS Gateway Active" color="green" />
          <StatusDot label="n8n Connected" color="green" />
          <StatusDot label="AI Integration Pending" color="yellow" />
          <StatusDot label="Webhook Ready" color="blue" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatBox label="Total Notifications" value={notifications.length} />
        <StatBox label="Quick Actions" value={quickActions.length} />
        <StatBox label="Active Integrations" value={4} />
      </div>
    </div>
  );

  return (
    <ExpandableCard
      title="Quick Actions"
      subtitle="Message center and automation controls"
      icon={<BoltIcon className="h-6 w-6 text-blue-600" />}
      variant="info"
      collapsedContent={collapsedContent}
      defaultExpanded={false}
    >
      {expandedContent}
    </ExpandableCard>
  );
}

function StatusDot({ label, color }: { label: string; color: string }) {
  const colorMap: Record<string, string> = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${colorMap[color]}`}></div>
      <span className="text-sm text-blue-700">{label}</span>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-lg p-4 border border-blue-200">
      <div className="text-center">
        <div className="text-lg font-bold text-blue-800">{value}</div>
        <div className="text-sm text-blue-600">{label}</div>
      </div>
    </div>
  );
}
