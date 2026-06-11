// components/ReusableTabs.tsx
'use client';

import { ReactNode } from 'react';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface ReusableTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ReusableTabs({ 
  tabs, 
  activeTab, 
  onTabChange, 
  variant = 'default',
  size = 'md',
  className = ''
}: ReusableTabsProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const variantClasses = {
    default: {
      container: 'border-b border-gray-200 bg-white rounded-t-lg',
      button: (isActive: boolean) => `
        font-medium transition-all duration-200 border-b-2 -mb-px
        ${isActive 
          ? 'border-blue-600 text-blue-600' 
          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}
      `
    },
    pills: {
      container: 'gap-2 bg-gray-100 p-1 rounded-lg',
      button: (isActive: boolean) => `
        font-medium transition-all duration-200 rounded-md
        ${isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}
      `
    },
    underline: {
      container: 'gap-6 border-b border-gray-200 bg-white',
      button: (isActive: boolean) => `
        font-medium transition-all duration-200 relative
        ${isActive 
          ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full' 
          : 'text-gray-600 hover:text-gray-900'}
      `
    }
  };

  return (
    <div className={`flex ${variantClasses[variant].container} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex items-center gap-2 whitespace-nowrap
            ${sizeClasses[size]}
            ${variantClasses[variant].button(activeTab === tab.id)}
          `}
        >
          {tab.icon && <tab.icon className={iconSizes[size]} />}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// TabPanel Component
interface TabPanelProps {
  activeTab: string;
  tabId: string;
  children: ReactNode;
}

export function TabPanel({ activeTab, tabId, children }: TabPanelProps) {
  if (activeTab !== tabId) return null;
  return <div className="flex flex-col items-center animate-fadeIn">{children}</div>;
}
