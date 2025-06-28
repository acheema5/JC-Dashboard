'use client';

import { useState } from 'react';
import { 
  CubeIcon, 
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  CogIcon 
} from '@heroicons/react/24/outline';
import { Button } from '../button';
import { ExpandableCard } from './ExpandableCard';
import { InventoryItem } from '../types';

interface InventoryTrackingCardProps {
  inventory: InventoryItem[];
  onReorder: (itemId: string) => void;
  onUpdateThreshold: (itemId: string, threshold: number) => void;
  onToggleAutoReorder: (itemId: string) => void;
}

export function InventoryTrackingCard({
  inventory, 
  onReorder, 
  onUpdateThreshold, 
  onToggleAutoReorder 
}: InventoryTrackingCardProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Calculate inventory statistics
  const lowStockItems = inventory.filter(item => item.quantity <= item.restockThreshold);
  const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
  const itemsNeedingReorder = inventory.filter(item => item.quantity <= item.restockThreshold * 1.5);

  // Get item status
  const getItemStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return { status: 'Out of Stock', color: 'text-red-600 bg-red-50 border-red-200' };
    if (item.quantity <= item.restockThreshold) return { status: 'Low Stock', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    if (item.quantity <= item.restockThreshold * 1.5) return { status: 'Monitor', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
    return { status: 'In Stock', color: 'text-green-600 bg-green-50 border-green-200' };
  };

  // Calculate days until restock needed
  const getDaysUntilRestock = (item: InventoryItem) => {
    if (item.usageRate === 0) return Infinity;
    return Math.floor(item.quantity / item.usageRate);
  };

  // Collapsed content - shows recent spending summary
  const collapsedContent = (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 border border-amber-200">
        <div className="text-center">
          <div className="text-sm font-medium text-amber-600 uppercase tracking-wide">
            Low Stock Alerts
          </div>
          <div className="text-2xl font-bold text-amber-800 mt-1">
            {lowStockItems.length}
          </div>
          <div className="text-sm text-amber-600 mt-1">
            Items need reorder
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-3 border border-amber-200">
          <div className="text-center">
            <div className="text-lg font-bold text-amber-800">
              ${totalInventoryValue.toLocaleString()}
            </div>
            <div className="text-xs text-amber-600">Total Value</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-amber-200">
          <div className="text-center">
            <div className="text-lg font-bold text-amber-800">
              {inventory.length}
            </div>
            <div className="text-xs text-amber-600">Total Items</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Expanded content - shows full inventory management
  const expandedContent = (
    <div className="space-y-6">
      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border-2 border-red-300">
          <div className="flex items-center space-x-2 mb-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
            <h4 className="font-bold text-red-800">Low Stock Alerts</h4>
          </div>
          <div className="space-y-2">
            {lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                <div>
                  <div className="font-medium text-gray-800">{item.name}</div>
                  <div className="text-sm text-gray-600">
                    {item.quantity} remaining (threshold: {item.restockThreshold})
                  </div>
                </div>
                <Button
                  onClick={() => onReorder(item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm"
                >
                  Reorder
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory List */}
      <div className="space-y-4">
        {inventory.map((item) => {
          const itemStatus = getItemStatus(item);
          const daysUntilRestock = getDaysUntilRestock(item);

          return (
            <div
              key={item.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                selectedItem === item.id
                  ? 'ring-2 ring-amber-500 bg-amber-50'
                  : 'bg-white border-gray-200'
              }`}
              onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h5 className="font-semibold text-gray-800">{item.name}</h5>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${itemStatus.color}`}>
                      {itemStatus.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div>Qty: <span className="font-medium">{item.quantity}</span></div>
                    <div>Cost: <span className="font-medium">${item.cost}</span></div>
                    <div>Value: <span className="font-medium">${(item.quantity * item.cost).toLocaleString()}</span></div>
                    {daysUntilRestock !== Infinity && (
                      <div className="flex items-center space-x-1">
                        <ArrowTrendingUpIcon className="h-4 w-4" />
                        <span>{daysUntilRestock} days left</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right text-sm text-gray-500">
                  <div>Last purchased:</div>
                  <div className="font-medium">
                    {item.purchaseDate.toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Expanded Item Details */}
              {selectedItem === item.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Usage Rate</div>
                      <div className="font-bold text-amber-800">{item.usageRate} items/day</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Restock Threshold</div>
                      <div className="font-bold text-amber-800">{item.restockThreshold} items</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Auto Reorder</div>
                      <div className="font-bold text-amber-800">
                        {item.autoReorder ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Estimated Usage</div>
                      <div className="font-bold text-amber-800">{item.estimatedUsage} days</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => onReorder(item.id)}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium"
                    >
                      Reorder Now
                    </Button>
                    <Button
                      onClick={() => onToggleAutoReorder(item.id)}
                      className={`px-4 ${
                        item.autoReorder 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      } text-white`}
                    >
                      {item.autoReorder ? 'Disable' : 'Enable'} Auto
                    </Button>
                  </div>
                  
                  <div className="mt-3">
                    <label className="text-sm text-gray-600">Update Restock Threshold:</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <input
                        type="number"
                        min="0"
                        value={item.restockThreshold}
                        onChange={(e) => onUpdateThreshold(item.id, parseInt(e.target.value) || 0)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                      />
                      <Button
                        onClick={() => onUpdateThreshold(item.id, item.restockThreshold)}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm"
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Inventory Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-amber-200">
          <div className="text-center">
            <div className="text-lg font-bold text-amber-800">
              {lowStockItems.length}
            </div>
            <div className="text-sm text-amber-600">Low Stock Items</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-amber-200">
          <div className="text-center">
            <div className="text-lg font-bold text-amber-800">
              {itemsNeedingReorder.length}
            </div>
            <div className="text-sm text-amber-600">Need Reorder Soon</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-amber-200">
          <div className="text-center">
            <div className="text-lg font-bold text-amber-800">
              ${totalInventoryValue.toLocaleString()}
            </div>
            <div className="text-sm text-amber-600">Total Inventory Value</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ExpandableCard
      title="Inventory Tracking"
      subtitle="Stock management, alerts, and usage predictions"
      icon={<CubeIcon className="h-6 w-6 text-amber-600" />}
      variant="warning"
      collapsedContent={collapsedContent}
      defaultExpanded={false}
    >
      {expandedContent}
    </ExpandableCard>
  );
} 