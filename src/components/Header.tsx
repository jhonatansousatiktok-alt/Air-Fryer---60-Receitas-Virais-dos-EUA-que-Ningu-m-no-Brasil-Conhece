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
  onOpenCover?: () => void;
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
  onOpenCover,
  searchQuery,
  onSearchChange,
  activeTimer,
  onOpenTimerRecipe,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8DFD3] shadow-[0_2px_15px_-3px_rgba(40,25,10,0.04)]">
      {/* Top Bar with Brand, Search & PDF */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center justify-between">
          <div 
            onClick={() => onSelectTab('recipes')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C8521A] to-[#E2692D] flex items-center justify-center text-white shadow-md shadow-[#C8521A]/25 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 fill-current stroke-[1.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-black text-[#0F2942] tracking-tight leading-none group-hover:text-[#C8521A] transition-colors">
                  Air Fryer Secrets
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F9ECE3] text-[#C8521A] border border-[#E9CABE]">
                  60 Receitas Virais
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-1 font-medium hidden sm:block">
                O Livro Secreto das Tendências Americanas Adaptadas ao Brasil
              </p>
            </div>
          </div>

          {/* Active timer badge (mobile view) */}
          {activeTimer && (
            <button
              onClick={onOpenTimerRecipe}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C8521A] text-white font-bold text-xs shadow-md animate-pulse"
            >
              <Timer className="w-3.5 h-3.5" />
              <span>{formatTimerDisplay(activeTimer.remainingSeconds)}</span>
            </button>
          )}
        </div>

        {/* Search bar & E-book PDF Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 md:max-w-md md:justify-end">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeTab !== 'recipes') onSelectTab('recipes');
              }}
              placeholder="Buscar receita ou ingrediente..."
              className="w-full bg-[#FAF7F2] hover:bg-white focus:bg-white border border-[#E5DACD] focus:border-[#C8521A] rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-[#0F2942] placeholder-[#94A3B8] focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                aria-label="Limpar busca"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F2942]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {onOpenCover && (
            <button
              onClick={onOpenCover}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#FAF0E7] hover:bg-[#F5E2D3] text-[#C8521A] border border-[#E9CABE] transition shadow-xs shrink-0"
              title="Visualizar Capa Oficial do Livro"
            >
              <img
                src="/assets/aistudio/image_f932da62.png"
                alt="Capa"
                className="w-4 h-5 object-cover rounded shadow-xs"
              />
              <span className="hidden sm:inline">Capa do Livro</span>
            </button>
          )}

          <button
            onClick={onOpenPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FBF7F0] hover:bg-[#F2E8DC] text-[#0F2942] border border-[#E2D5C5] transition shadow-sm shrink-0"
            title="Abrir E-book em PDF original"
          >
            <BookOpen className="w-4 h-4 text-[#C8521A]" />
            <span className="hidden sm:inline">E-book PDF</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar (Desktop) */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar border-t border-[#F0E8DD] py-2">
        <button
          onClick={() => onSelectTab('recipes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
            activeTab === 'recipes'
              ? 'bg-[#0F2942] text-white shadow-md shadow-[#0F2942]/15'
              : 'text-[#475569] hover:text-[#0F2942] hover:bg-[#F5EFE6]'
          }`}
        >
          <Flame className={`w-4 h-4 ${activeTab === 'recipes' ? 'text-[#E2692D]' : ''}`} />
          <span>Receitas</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
            activeTab === 'recipes' ? 'bg-white/20 text-white' : 'bg-[#EFE6DC] text-[#64748B]'
          }`}>
            60
          </span>
        </button>

        <button
          onClick={() => onSelectTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
            activeTab === 'favorites'
              ? 'bg-[#C8521A] text-white shadow-md shadow-[#C8521A]/20'
              : 'text-[#475569] hover:text-[#C8521A] hover:bg-[#F5EFE6]'
          }`}
        >
          <Heart className={`w-4 h-4 ${activeTab === 'favorites' ? 'fill-current' : ''}`} />
          <span>Favoritos</span>
          {favoritesCount > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'favorites' ? 'bg-white/20 text-white' : 'bg-[#F9ECE3] text-[#C8521A]'
            }`}>
              {favoritesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectTab('shopping')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
            activeTab === 'shopping'
              ? 'bg-[#3D5A3C] text-white shadow-md shadow-[#3D5A3C]/20'
              : 'text-[#475569] hover:text-[#3D5A3C] hover:bg-[#F5EFE6]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Lista de Compras</span>
          {shoppingCount > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'shopping' ? 'bg-white/20 text-white' : 'bg-[#EAF2E8] text-[#3D5A3C]'
            }`}>
              {shoppingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
            activeTab === 'reviews'
              ? 'bg-[#8A4A28] text-white shadow-md shadow-[#8A4A28]/20'
              : 'text-[#475569] hover:text-[#8A4A28] hover:bg-[#F5EFE6]'
          }`}
        >
          <Star className={`w-4 h-4 ${activeTab === 'reviews' ? 'fill-current' : ''}`} />
          <span>Minhas Avaliações & Notas</span>
          {reviewsCount > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'reviews' ? 'bg-white/20 text-white' : 'bg-[#FBF0E4] text-[#8A4A28]'
            }`}>
              {reviewsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
