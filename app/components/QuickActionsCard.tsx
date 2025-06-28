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
      <div className="rounded-lg p-4 border border-white/10 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">
            Notifications
          </div>
          <div className="text-2xl font-bold text-white mt-1">{unreadCount}</div>
          <div className="text-sm text-gray-400 mt-1">Unread messages</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg p-3 border border-white/10 bg-slate-800 text-center">
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-300 mx-auto mb-1" />
          <div className="text-xs text-gray-300">Quick SMS</div>
        </div>
        <div className="rounded-lg p-3 border border-white/10 bg-slate-800 text-center">
          <BellIcon className="h-5 w-5 text-gray-300 mx-auto mb-1" />
          <div className="text-xs text-gray-300">Alerts</div>
        </div>
      </div>
    </div>
  );

  const expandedContent = (
    <div className="space-y-6">
      <div>
        <h5 className="font-semibold text-white mb-3">Recent Notifications</h5>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-all ${
                notification.unread
                  ? 'bg-gradient-to-r from-blue-900 via-purple-900 to-slate-900 border-blue-600'
                  : 'bg-slate-800 border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h6 className="font-medium text-white">{notification.title}</h6>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                  <div className="text-xs text-gray-500 mt-2">{notification.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h5 className="font-semibold text-white mb-3">Quick Actions</h5>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => setSelectedAction(selectedAction === action.id ? null : action.id)}
              className={`p-3 rounded-lg border transition-all ${
                selectedAction === action.id
                  ? 'ring-2 ring-purple-600 bg-slate-800'
                  : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="text-gray-300">{action.icon}</div>
                <span className="text-sm font-medium text-white">{action.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedAction && (
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-4 border border-purple-700">
          <h6 className="font-semibold text-white mb-3">
            {quickActions.find((a) => a.id === selectedAction)?.title}
          </h6>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Message Preview
              </label>
              <div className="bg-slate-700 rounded-lg p-3 border border-slate-600">
                <p className="text-sm text-gray-200">
                  {quickActions.find((a) => a.id === selectedAction)?.message}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Customize Message (Optional)
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Customize the message..."
                className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-800 text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold shadow-md"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      )}

      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <h5 className="font-semibold text-white mb-3">Automation Status</h5>
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
      icon={<BoltIcon className="h-6 w-6 text-gray-300" />}
      variant="default"
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
      <span className="text-sm text-gray-300">{label}</span>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="text-center">
        <div className="text-lg font-bold text-white">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>
    </div>
  );
}
