import React from 'react';

export interface TabItem<T = string> {
  id: T;
  label: string;
  badge?: number | string;
  icon?: React.ReactNode;
}

interface TabsProps<T = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (id: T) => void;
  id?: string;
  variant?: 'underline' | 'pills';
}

export function Tabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  id,
  variant = 'underline'
}: TabsProps<T>) {
  if (variant === 'pills') {
    return (
      <div id={id} className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-lg w-fit">
        {tabs.map(tab => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                isActive 
                  ? 'bg-white text-slate-900 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div id={id} className="border-b border-slate-200 flex gap-6">
      {tabs.map(tab => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-all relative ${
              isActive 
                ? 'border-emerald-600 text-emerald-700' 
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
