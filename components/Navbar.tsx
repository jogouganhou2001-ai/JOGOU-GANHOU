import React from 'react';
import { Home, ScrollText, History, Gift } from './Icons';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { view: ViewState.HOME, icon: Home, label: 'Sorteio' },
    { view: ViewState.REWARDS, icon: Gift, label: 'Bônus' },
    { view: ViewState.HISTORY, icon: History, label: 'Ganhadores' },
    { view: ViewState.RULES, icon: ScrollText, label: 'Regras' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe pt-2 px-6 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto pb-4">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onChangeView(item.view)}
              className={`flex flex-col items-center gap-1 w-16 transition-colors ${
                isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};