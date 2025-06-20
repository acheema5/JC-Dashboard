'use client';

import { useState } from 'react';
import { 
  BoltIcon, 
  ChatBubbleLeftRightIcon,
  BellIcon,
  EnvelopeIcon,
  PhoneIcon,
  MegaphoneIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';
import { Button } from '../button';
import { ExpandableCard } from './ExpandableCard';

interface QuickActionsCardProps {
  onSendSMS: (message: string) => void;
}

// Mock notifications data
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

// Quick action templates
const quickActions = [
  {
    id: 'running-late',
    title: 'Running Late',
    message: 'Hey! Running 5 minutes behind, see you soon.',
    icon: <ClockIcon className="h-4 w-4" />,
    color: 'bg-orange-600 hover:bg-orange-700',
  },
  {
    id: 'reminder',
    title: 'Appointment Reminder',
    message: 'Hi! Just a friendly reminder about your appointment tomorrow.',
    icon: <BellIcon className="h-4 w-4" />,
    color: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    id: 'follow-up',
    title: 'Follow-up',
    message: 'Hope you enjoyed your haircut! Book your next appointment.',
    icon: <EnvelopeIcon className="h-4 w-4" />,
    color: 'bg-green-600 hover:bg-green-700',
  },
  {
    id: 'promotion',
    title: 'Special Offer',
    message: 'Limited time offer: 20% off all services this week!',
    icon: <MegaphoneIcon className="h-4 w-4" />,
    color: 'bg-purple-600 hover:bg-purple-700',
  },
];

export function QuickActionsCard({ onSendSMS }: QuickActionsCardProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [notifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Collapsed content - shows notifications and quick actions
  const collapsedContent = (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Notifications
          </div>
          <div className="text-2xl font-bold text-gray-800 mt-1">
            {unreadCount}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Unread messages
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-600 mx-auto mb-1" />
          <div className="text-xs text-gray-600">Quick SMS</div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
          <BellIcon className="h-5 w-5 text-gray-600 mx-auto mb-1" />
          <div className="text-xs text-gray-600">Alerts</div>
        </div>
      </div>
    </div>
  );

  // Expanded content - shows full message center and actions
  const expandedContent = (
    <div className="space-y-6">
      {/* Notifications */}
      <div>
        <h5 className="font-semibold text-gray-800 mb-3">Recent Notifications</h5>
        <div className="space-y-3">
          {notifications.slice(0, 3).map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-all ${
                notification.unread
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h6 className="font-medium text-gray-800">{notification.title}</h6>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <div className="text-xs text-gray-500 mt-2">{notification.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h5 className="font-semibold text-gray-800 mb-3">Quick Actions</h5>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => setSelectedAction(selectedAction === action.id ? null : action.id)}
              className={`p-3 rounded-lg border transition-all ${
                selectedAction === action.id
                  ? 'ring-2 ring-gray-500 bg-gray-50'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="text-gray-600">{action.icon}</div>
                <span className="text-sm font-medium text-gray-800">{action.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Action Details */}
      {selectedAction && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border-2 border-gray-300">
          <h6 className="font-semibold text-gray-800 mb-3">
            {quickActions.find(a => a.id === selectedAction)?.title}
          </h6>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Preview
              </label>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-sm text-gray-700">
                  {quickActions.find(a => a.id === selectedAction)?.message}
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customize Message (Optional)
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Customize the message..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                rows={3}
              />
            </div>
            
            <Button
              onClick={() => {
                const message = customMessage || quickActions.find(a => a.id === selectedAction)?.message || '';
                onSendSMS(message);
                setSelectedAction(null);
                setCustomMessage('');
              }}
              className={`w-full ${quickActions.find(a => a.id === selectedAction)?.color} text-white font-medium`}
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      )}

      {/* Automation Status */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h5 className="font-semibold text-gray-800 mb-3">Automation Status</h5>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">SMS Gateway Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">n8n Connected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">AI Integration Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Webhook Ready</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">
              {notifications.length}
            </div>
            <div className="text-sm text-gray-600">Total Notifications</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">
              {quickActions.length}
            </div>
            <div className="text-sm text-gray-600">Quick Actions</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">
              4
            </div>
            <div className="text-sm text-gray-600">Active Integrations</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ExpandableCard
      title="Quick Actions"
      subtitle="Message center and automation controls"
      icon={<BoltIcon className="h-6 w-6 text-gray-600" />}
      variant="default"
      collapsedContent={collapsedContent}
      defaultExpanded={false}
    >
      {expandedContent}
    </ExpandableCard>
  );
} 