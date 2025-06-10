'use client';

import { useState } from 'react';
import { Home, Calendar, BarChart3, Settings, Plus } from 'lucide-react';

export default function MobileNavigation() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', name: 'Home', icon: Home, href: '/' },
    { id: 'calendar', name: 'Calendar', icon: Calendar, href: '/calendar' },
    { id: 'create', name: 'Create', icon: Plus, href: '/create' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, href: '/analytics' },
    { id: 'settings', name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 sm:hidden z-40">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isCreate = tab.id === 'create';
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex flex-col items-center justify-center p-2 rounded-lg transition-colors
                ${isCreate 
                  ? 'bg-blue-600 text-white -mt-4 shadow-lg' 
                  : isActive 
                    ? 'text-blue-600' 
                    : 'text-gray-500'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isCreate ? 'w-6 h-6' : ''}`} />
              <span className={`text-xs mt-1 ${isCreate ? 'text-xs' : ''}`}>
                {tab.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}