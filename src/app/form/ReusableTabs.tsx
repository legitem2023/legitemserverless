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
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const variantClasses = {
    default: {
      container: 'border-b border-gray-200 bg-white',
      button: (isActive: boolean) => `
        font-medium transition-all duration-200 border-b-2 -mb-px
        ${isActive 
          ? 'border-blue-600 text-blue-600' 
          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}
      `
    },
    pills: {
      container: 'gap-2 bg-white p-2 rounded-lg shadow-sm',
      button: (isActive: boolean) => `
        font-medium transition-all duration-200 rounded-lg
        ${isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'}
      `
    },
    underline: {
      container: 'gap-8 border-b border-gray-200 bg-white',
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

// Tab Panel Component for conditional rendering
export function TabPanel({ 
  activeTab, 
  tabId, 
  children 
}: { 
  activeTab: string; 
  tabId: string; 
  children: ReactNode 
}) {
  if (activeTab !== tabId) return null;
  return <div className="animate-fadeIn">{children}</div>;
}
