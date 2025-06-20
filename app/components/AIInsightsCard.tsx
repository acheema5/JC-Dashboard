'use client';

import { useState } from 'react';
import { 
  LightBulbIcon, 
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  MegaphoneIcon 
} from '@heroicons/react/24/outline';
import { Button } from '../button';
import { ExpandableCard } from './ExpandableCard';
import { AIInsight } from '../types';

interface AIInsightsCardProps {
  onSendSMS: (message: string) => void;
  onCreatePromotion: (service: string) => void;
}

// Mock AI insights data
const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    type: 'scheduling',
    title: 'Extend Friday Hours',
    description: 'Fridays are consistently your busiest day. Consider extending hours by 2-3 hours to capture more bookings.',
    action: 'Extend Friday hours to 8 PM',
    priority: 'high',
    smsMessage: 'New Friday evening slots available! Book now for extended hours.',
  },
  {
    id: '2',
    type: 'promotion',
    title: 'Promote Mullet on Slow Days',
    description: 'Mullet cuts are your highest-revenue service. Promote them on Mondays and Tuesdays to boost slow day bookings.',
    action: 'Create Monday/Tuesday mullet promotion',
    priority: 'medium',
    smsMessage: 'Monday/Tuesday special: 20% off Mullet cuts! Limited time offer.',
  },
  {
    id: '3',
    type: 'bundle',
    title: 'Beard Trim Bundle',
    description: 'No beard trims booked this week. Consider bundling with haircuts to increase average ticket value.',
    action: 'Create haircut + beard trim bundle',
    priority: 'low',
    smsMessage: 'New bundle: Haircut + Beard Trim for $50 (save $10)!',
  },
  {
    id: '4',
    type: 'opportunity',
    title: 'Client Retention Campaign',
    description: '15 clients haven\'t rebooked in 30+ days. Send follow-up messages to bring them back.',
    action: 'Send retention campaign',
    priority: 'high',
    smsMessage: 'Miss you! Book your next appointment and get 15% off.',
  },
];

export function AIInsightsCard({
  onSendSMS,
  onCreatePromotion,
}: AIInsightsCardProps) {
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [insights] = useState<AIInsight[]>(mockAIInsights);

  const topInsight = insights.find(insight => insight.priority === 'high');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'scheduling':
        return <ChatBubbleLeftRightIcon className="h-4 w-4" />;
      case 'promotion':
        return <MegaphoneIcon className="h-4 w-4" />;
      case 'bundle':
        return <SparklesIcon className="h-4 w-4" />;
      case 'opportunity':
        return <LightBulbIcon className="h-4 w-4" />;
      default:
        return <LightBulbIcon className="h-4 w-4" />;
    }
  };

  // Collapsed content - shows top recommendation
  const collapsedContent = (
    <div className="space-y-4">
      {topInsight ? (
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border-2 border-purple-300">
          <div className="flex items-center space-x-2 mb-2">
            <SparklesIcon className="h-4 w-4 text-purple-600" />
            <h4 className="font-bold text-purple-800 text-sm">TOP AI RECOMMENDATION</h4>
          </div>
          <div className="text-sm">
            <div className="font-bold text-gray-800">{topInsight.title}</div>
            <div className="text-gray-600 mt-1">{topInsight.description}</div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-4 border border-purple-200 text-center text-gray-500">
          No AI insights available
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg p-3 border border-purple-200 text-center">
          <div className="text-lg font-bold text-purple-800">
            {insights.filter(i => i.priority === 'high').length}
          </div>
          <div className="text-xs text-purple-600">High Priority</div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-purple-200 text-center">
          <div className="text-lg font-bold text-purple-800">
            {insights.filter(i => i.priority === 'medium').length}
          </div>
          <div className="text-xs text-purple-600">Medium Priority</div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-purple-200 text-center">
          <div className="text-lg font-bold text-purple-800">
            {insights.filter(i => i.priority === 'low').length}
          </div>
          <div className="text-xs text-purple-600">Low Priority</div>
        </div>
      </div>
    </div>
  );

  // Expanded content - shows all insights with actions
  const expandedContent = (
    <div className="space-y-6">
      {/* AI Insights List */}
      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
              selectedInsight?.id === insight.id
                ? 'ring-2 ring-purple-500'
                : 'bg-white border-gray-200'
            }`}
            onClick={() => setSelectedInsight(insight)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${getPriorityColor(insight.priority)}`}>
                  {getTypeIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h5 className="font-semibold text-gray-800">{insight.title}</h5>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(insight.priority)}`}>
                      {insight.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                  <div className="text-sm font-medium text-purple-600">
                    💡 {insight.action}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Insight Actions */}
      {selectedInsight && (
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border-2 border-purple-300">
          <h4 className="font-bold text-purple-800 mb-4">Take Action</h4>
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Suggested SMS Message:</h5>
              <div className="bg-white rounded-lg p-3 border border-purple-200">
                <p className="text-sm text-gray-700">{selectedInsight.smsMessage}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={() => onSendSMS(selectedInsight.smsMessage || '')}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                Send SMS Campaign
              </Button>
              
              {selectedInsight.type === 'promotion' && (
                <Button
                  onClick={() => onCreatePromotion(selectedInsight.title)}
                  className="px-4 bg-green-600 hover:bg-green-700 text-white"
                >
                  <MegaphoneIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Automation Status */}
      <div className="bg-white rounded-lg p-4 border border-purple-200">
        <h5 className="font-semibold text-gray-800 mb-3">Automation Status</h5>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">SMS Automation Ready</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">AI API Integration Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">n8n Webhook Ready</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Square API Connected</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ExpandableCard
      title="AI Insights"
      subtitle="Intelligent recommendations and automation"
      icon={<LightBulbIcon className="h-6 w-6 text-purple-600" />}
      variant="default"
      collapsedContent={collapsedContent}
      defaultExpanded={false}
    >
      {expandedContent}
    </ExpandableCard>
  );
} 