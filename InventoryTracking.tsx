'use client';

import { useState } from 'react';
import { Card } from '../card';
import { Button } from '../button';
import { InventoryItem } from '../types';

interface InventoryTrackingProps {
  inventory: InventoryItem[];
  onReorderItem: (itemId: string) => void;
  onUpdateThreshold: (itemId: string, threshold: number) => void;
  onToggleAutoReorder: (itemId: string) => void;
}

export function InventoryTracking({ 
  inventory, 
  onReorderItem, 
  onUpdateThreshold, 
  onToggleAutoReorder 
}: InventoryTrackingProps) {
  const [editingThreshold, setEditingThreshold] = useState<string | null>(null);
  const [thresholdValue, setThresholdValue] = useState<number>(0);

  const calculateOutOfStockDate = (item: InventoryItem) => {
    const daysRemaining = Math.floor(item.quantity / item.usageRate);
    const outOfStockDate = new Date();
    outOfStockDate.setDate(outOfStockDate.getDate() + daysRemaining);
    return { daysRemaining, outOfStockDate };
  };

  const lowStockItems = inventory.filter(item => item.quantity <= item.restockThreshold);

  const handleThresholdEdit = (item: InventoryItem) => {
    setEditingThreshold(item.id);
    setThresholdValue(item.restockThreshold);
  };

  const handleThresholdSave = (itemId: string) => {
    onUpdateThreshold(itemId, thresholdValue);
    setEditingThreshold(null);
  };

  return (
    <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-yellow-800">Inventory Tracking</h3>
        
        <div className="space-y-3">
          {inventory.map(item => {
            const { daysRemaining, outOfStockDate } = calculateOutOfStockDate(item);
            const isLowStock = item.quantity <= item.restockThreshold;
            
            return (
              <div key={item.id} className="bg-white rounded-lg p-4 border border-yellow-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      {isLowStock && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                          LOW STOCK
                        </span>
                      )}
                      {item.autoReorder && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          AUTO-REORDER
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                        <p><strong>Cost:</strong> ${item.cost}</p>
                      </div>
                      <div>
                        <p><strong>Usage Rate:</strong> {item.usageRate}/day</p>
                        <p className={`${daysRemaining <= 7 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                          <strong>Days Remaining:</strong> {daysRemaining}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>🤖 AI Prediction:</strong> Out of stock by{' '}
                        <span className="font-medium">
                          {outOfStockDate.toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                    
                    <div className="mt-3 flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Restock Threshold:</span>
                        {editingThreshold === item.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={thresholdValue}
                              onChange={(e) => setThresholdValue(Number(e.target.value))}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                              min="0"
                            />
                            <Button
                              onClick={() => handleThresholdSave(item.id)}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
                            >
                              Save
                            </Button>
                            <Button
                              onClick={() => setEditingThreshold(null)}
                              className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-2 py-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleThresholdEdit(item)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            {item.restockThreshold} (Edit)
                          </button>
                        )}
                      </div>
                      
                      <button
                        onClick={() => onToggleAutoReorder(item.id)}
                        className={`text-sm font-medium px-3 py-1 rounded ${
                          item.autoReorder
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        Auto-Reorder: {item.autoReorder ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="ml-4 space-y-2">
                    {isLowStock && (
                      <Button 
                        onClick={() => onReorderItem(item.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm"
                      >
                        🚨 Reorder Now
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {lowStockItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2 flex items-center">
              ⚠️ Critical Stock Alert
            </h4>
            <p className="text-sm text-red-700 mb-3">
              {lowStockItems.length} item(s) below restock threshold
            </p>
            <div className="space-y-1">
              {lowStockItems.map(item => (
                <div key={item.id} className="text-sm text-red-800">
                  • <strong>{item.name}</strong>: {item.quantity} remaining (threshold: {item.restockThreshold})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}