'use client';

import { useState } from 'react';
import { Card } from '../card';
import { Button } from '../button';
import { AIInsight } from '../types';

interface AIInsightsProps {
  onSendSMS: (message: string) => void;
  onCreatePromotion: (service: string) => void;
}

export function AIInsights({ onSendSMS, onCreatePromotion }: AIInsightsProps) {
  const [expandedPriority, setExpandedPriority] = useState<string | null>('high');

  const insights: AIInsight[] = [
    {
      id: '1',
      type: 'opportunity',
      title: 'Extend Friday Hours',
      description: 'Fridays are fully booked 4 weeks in advance. Consider extending hours for more revenue.',
      action: 'Extend Hours',
      priority: 'high',
      smsMessage: 'Great news! We\'re extending Friday hours. More slots available!'
    },
    {
      id: '2',
      type: 'promotion',
      title: 'Promote Mullet Cuts',
      description: 'Mullet is your top service. Offer promotion on slow days (Mon/Tue) to boost revenue.',
      action: 'Send SMS Promotion',
      priority: 'high',
      smsMessage: 'Special offer: 20% off Mullet cuts this Monday & Tuesday! Book now.'
    },
    {
      id: '3',
      type: 'bundle',
      title: 'Bundle Beard Trimming',
      description: 'No beard trimming bookings this week. Consider bundling with haircuts.',
      action: 'Create Bundle',
      priority: 'medium',
      smsMessage: 'New combo deal: Haircut + Beard trim for just $45! Limited time.'
    },
    {
      id: '4',
      type: 'scheduling',
      title: 'Fill Schedule Gaps',
      description: 'Wednesday 11AM-1PM consistently unbooked. Send targeted promotions.',
      action: 'Send Promotion',
      priority: 'medium',
      smsMessage: 'Midweek special: 15% off Wednesday appointments 11AM-1PM!'
    },
    {
      id: '5',
      type: 'opportunity',
      title: 'Weekend Availability',
      description: 'Saturday mornings show potential for additional bookings.',
      action: 'Analyze',
      priority: 'low',
      smsMessage: 'Saturday morning slots now available! Beat the weekend rush.'
    }
  ];

  const groupedInsights = insights.reduce((acc, insight) => {
    if (!acc[insight.priority]) acc[insight.priority] = [];
    acc[insight.priority].push(insight);
    return acc;
  }, {} as Record<string, AIInsight[]>);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityHeaderColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleAction = (insight: AIInsight) => {
    switch (insight.type) {
      case 'promotion':
      case 'scheduling':
        if (insight.smsMessage) {
          onSendSMS(insight.smsMessage);
        }
        break;
      case 'bundle':
        onCreatePromotion('Beard Trimming Bundle');
        break;
      default:
        console.log('Action:', insight.action);
    }
  };

  const handleScheduleSMS = (insight: AIInsight) => {
    if (insight.smsMessage) {
      onSendSMS(insight.smsMessage);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <h3 className="text-3xl font-bold text-blue-800" style={{ fontFamily: 'Bookmania, serif' }}>AI Insights</h3>
        </div>
        
        <div className="space-y-3">
          {(['high', 'medium', 'low'] as const).map((priority) => (
            <div key={priority} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedPriority(expandedPriority === priority ? null : priority)}
                className={`w-full px-4 py-3 text-left font-medium border ${getPriorityHeaderColor(priority)} hover:opacity-80 transition-opacity`}
              >
                <div className="flex justify-between items-center">
                  <span className="uppercase text-sm">
                    {priority} Priority ({groupedInsights[priority]?.length || 0})
                  </span>
                  <span className="text-lg">
                    {expandedPriority === priority ? '−' : '+'}
                  </span>
                </div>
              </button>
              
              {expandedPriority === priority && (
                <div className="p-4 space-y-3 bg-white">
                  {groupedInsights[priority]?.map((insight) => (
                    <div key={insight.id} className={`rounded-lg p-4 border ${getPriorityColor(insight.priority)}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 mb-1">{insight.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                        </div>
                        <div className="ml-4 space-y-2">
                          <Button 
                            onClick={() => handleAction(insight)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm w-full"
                          >
                            {insight.action}
                          </Button>
                          {insight.smsMessage && (
                            <Button 
                              onClick={() => handleScheduleSMS(insight)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-sm w-full"
                            >
                              📱 Schedule SMS
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}