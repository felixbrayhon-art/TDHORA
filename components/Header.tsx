
import React from 'react';
import { UserStats, getFishRank } from '../types';
import FishLogo from './FishLogo';

interface HeaderProps {
  stats: UserStats;
  onProfileClick: () => void;
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ stats, onProfileClick, onLogoClick }) => {
  const progressPercent = (stats.xp % 1000) / 10;
  const rank = getFishRank(stats.totalDaysStudied);

  return (
    <header className="bg-white border-b border-gray-100 py-4 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-8">
        <button 
          onClick={onLogoClick}
          className="hover:opacity-80 transition-opacity active:scale-95"
          title="Ir para o Hub"
        >
          <FishLogo days={stats.totalDaysStudied} className="scale-90 md:scale-100 origin-left" />
        </button>

        <div className="hidden md:flex items-center gap-4 bg-gray-50 rounded-full px-4 py-1.5 border border-gray-100">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400 text-white font-bold text-xs">
            {stats.level}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider gap-4">
              <span className="truncate max-w-[100px]">{stats.name}</span>
              <span className="text-blue-500 italic">{rank.label}</span>
              <span>{stats.xp % 1000}/1000 XP</span>
            </div>
            <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-0.5">
              <div 
                className="h-full bg-yellow-400 transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full font-bold text-xs uppercase tracking-tighter">
          DIAS estendidos: {stats.totalDaysStudied}
        </div>
        <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full font-bold text-xs uppercase tracking-tighter">
          RITMO: {stats.streak}
        </div>
        <button 
          onClick={onProfileClick}
          className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm hover:ring-2 hover:ring-yellow-400 transition-all flex items-center justify-center"
          style={{ backgroundColor: stats.avatarColor }}
        >
          <FishLogo iconOnly primaryColor="white" className="scale-50" days={stats.totalDaysStudied} />
        </button>
      </div>
    </header>
  );
};

export default Header;
