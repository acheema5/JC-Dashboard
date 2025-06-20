'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { cn } from '../utils';

interface ExpandableCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
  collapsedContent?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'danger';
}

const variantStyles = {
  default: 'bg-white border-gray-200',
  success: 'bg-gradient-to-r from-green-50 to-green-100 border-green-200',
  warning: 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200',
  info: 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200',
  danger: 'bg-gradient-to-r from-red-50 to-red-100 border-red-200',
};

const variantTextStyles = {
  default: 'text-gray-800',
  success: 'text-green-800',
  warning: 'text-orange-800',
  info: 'text-blue-800',
  danger: 'text-red-800',
};

export function ExpandableCard({
  title,
  subtitle,
  icon,
  className,
  defaultExpanded = false,
  children,
  collapsedContent,
  actions,
  variant = 'default',
}: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      className={cn(
        'rounded-lg border shadow-sm transition-all duration-300 hover:shadow-md',
        variantStyles[variant],
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            <div>
              <h3 className={cn('text-lg font-semibold', variantTextStyles[variant])}>
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {actions && <div className="flex items-center space-x-2">{actions}</div>}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Collapsed Content */}
      {!isExpanded && collapsedContent && (
        <div className="p-4">
          {collapsedContent}
        </div>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
} 