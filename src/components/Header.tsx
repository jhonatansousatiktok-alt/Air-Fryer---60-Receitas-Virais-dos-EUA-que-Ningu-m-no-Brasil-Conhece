import React from 'react';
import { Flame, Heart, ShoppingBag, Star, BookOpen, Search, Timer, X } from 'lucide-react';
import { ActiveTimer } from '../types/recipe';
import { formatTimerDisplay } from '../utils/recipeUtils';

interface HeaderProps {
  activeTab: 'recipes' | 'favorites' | 'shopping' | 'reviews';
  onSelectTab: (tab: 'recipes' | 'favorites' | 'shopping' | 'reviews') => void;
  favoritesCount: number;
  shoppingCount: number;
  reviewsCount: number;
  onOpenPdf: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTimer: ActiveTimer | null;
  onOpenTimerRecipe: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  favoritesCount,
  shoppingCount,
  reviewsCount,
  onOpenPdf,
  searchQuery,
  onSearchChange,
  activeTimer,
  onOpenTimerRecipe,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      {/* Top Banner / Brand */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center justify-between">
          <div 
            onClick={() => onSelectTab('recipes')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-neutral-950 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 fill-current stroke-[1.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white tracking-tight leading-none group-hover:text-amber-400 transition-colors">
                  Air Fryer Secrets
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  60 Receitas Virais
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5 hidden sm:block">
                O Livro Secreto das Tendências Americanas Adaptadas ao Brasil
              </p>
            </div>
          </div>

          {/* Active timer mini pill badge */}
          {activeTimer && (
            <button
              onClick={onOpenTimerRecipe}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs shadow-md animate-pulse"
            >
              <Timer className="w-3.5 h-3.5" />
              <span>{formatTimerDisplay(activeTimer.remainingSeconds)}</span>
            </button>
          )}
        </div>

        {/* Search bar & E-book PDF Button */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 md:max-w-md md:justify-end">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeTab !== 'recipes') onSelectTab('recipes');
              }}
              placeholder="Buscar por prato, ingrediente (bacon, queijo, brownie)..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                aria-label="Limpar busca"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={onOpenPdf}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-850 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 transition shadow-sm shrink-0"
            title="Abrir E-book em PDF original"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">E-book PDF</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar border-t border-neutral-900 py-1.5">
        <button
          onClick={() => onSelectTab('recipes')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
            activeTab === 'recipes'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Receitas</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeTab === 'recipes' ? 'bg-neutral-950/20 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-400'
          }`}>
            60
          </span>
        </button>

        <button
          onClick={() => onSelectTab('favorites')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
            activeTab === 'favorites'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Heart className={`w-4 h-4 ${activeTab === 'favorites' ? 'fill-current' : ''}`} />
          <span>Favoritos</span>
          {favoritesCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === 'favorites' ? 'bg-white/20 text-white font-bold' : 'bg-neutral-800 text-rose-400 font-bold'
            }`}>
              {favoritesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectTab('shopping')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
            activeTab === 'shopping'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Lista de Compras</span>
          {shoppingCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === 'shopping' ? 'bg-white/20 text-white font-bold' : 'bg-neutral-800 text-emerald-400 font-bold'
            }`}>
              {shoppingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectTab('reviews')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
            activeTab === 'reviews'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Star className={`w-4 h-4 ${activeTab === 'reviews' ? 'fill-current' : ''}`} />
          <span>Minhas Avaliações & Notas</span>
          {reviewsCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === 'reviews' ? 'bg-white/20 text-white font-bold' : 'bg-neutral-800 text-amber-400 font-bold'
            }`}>
              {reviewsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
