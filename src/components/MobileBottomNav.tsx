import React from 'react';
import { Flame, Heart, ShoppingBag, Star, BookOpen } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'recipes' | 'favorites' | 'shopping' | 'reviews';
  onSelectTab: (tab: 'recipes' | 'favorites' | 'shopping' | 'reviews') => void;
  favoritesCount: number;
  shoppingCount: number;
  reviewsCount: number;
  onOpenCover: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  favoritesCount,
  shoppingCount,
  reviewsCount,
  onOpenCover,
}) => {
  return (
    <nav 
      aria-label="Navegação móvel inferior"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E8DFD3] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-area-pb"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* Receitas */}
        <button
          onClick={() => onSelectTab('recipes')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition relative min-w-[56px] min-h-[48px] ${
            activeTab === 'recipes'
              ? 'text-[#C8521A]'
              : 'text-[#64748B] hover:text-[#0F2942]'
          }`}
          aria-label="Ver receitas"
        >
          <div className={`p-1 rounded-xl transition ${activeTab === 'recipes' ? 'bg-[#FAF0E7]' : ''}`}>
            <Flame className={`w-5 h-5 ${activeTab === 'recipes' ? 'fill-[#C8521A]' : ''}`} />
          </div>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Receitas</span>
          <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#C8521A]" />
        </button>

        {/* Favoritos */}
        <button
          onClick={() => onSelectTab('favorites')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition relative min-w-[56px] min-h-[48px] ${
            activeTab === 'favorites'
              ? 'text-rose-600'
              : 'text-[#64748B] hover:text-[#0F2942]'
          }`}
          aria-label="Ver favoritos"
        >
          <div className={`p-1 rounded-xl transition ${activeTab === 'favorites' ? 'bg-rose-50' : ''}`}>
            <Heart className={`w-5 h-5 ${activeTab === 'favorites' ? 'fill-rose-600' : ''}`} />
          </div>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Favoritos</span>
          {favoritesCount > 0 && (
            <span className="absolute top-0.5 right-1.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black shadow-xs">
              {favoritesCount}
            </span>
          )}
        </button>

        {/* Capa Oficial (Quick Access Button in Center) */}
        <button
          onClick={onOpenCover}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition min-w-[52px] min-h-[48px] group"
          aria-label="Ver Capa Oficial do Livro"
          title="Ver Capa Oficial"
        >
          <div className="relative p-0.5 rounded-xl border border-amber-500/40 shadow-xs group-hover:scale-105 transition-transform bg-[#0F2942]">
            <img
              src="/assets/aistudio/image_f932da62.png"
              alt="Capa"
              className="w-5 h-6 object-cover rounded-lg"
            />
          </div>
          <span className="text-[9px] font-bold mt-0.5 text-amber-600 tracking-tight">Capa</span>
        </button>

        {/* Lista de Compras */}
        <button
          onClick={() => onSelectTab('shopping')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition relative min-w-[56px] min-h-[48px] ${
            activeTab === 'shopping'
              ? 'text-[#3D5A3C]'
              : 'text-[#64748B] hover:text-[#0F2942]'
          }`}
          aria-label="Ver lista de compras"
        >
          <div className={`p-1 rounded-xl transition ${activeTab === 'shopping' ? 'bg-[#EEF5ED]' : ''}`}>
            <ShoppingBag className={`w-5 h-5 ${activeTab === 'shopping' ? 'fill-[#3D5A3C]' : ''}`} />
          </div>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Lista</span>
          {shoppingCount > 0 && (
            <span className="absolute top-0.5 right-1.5 px-1.5 py-0.2 rounded-full bg-[#3D5A3C] text-white text-[9px] font-black shadow-xs">
              {shoppingCount}
            </span>
          )}
        </button>

        {/* Avaliações & Notas */}
        <button
          onClick={() => onSelectTab('reviews')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition relative min-w-[56px] min-h-[48px] ${
            activeTab === 'reviews'
              ? 'text-amber-600'
              : 'text-[#64748B] hover:text-[#0F2942]'
          }`}
          aria-label="Ver avaliações e notas"
        >
          <div className={`p-1 rounded-xl transition ${activeTab === 'reviews' ? 'bg-amber-50' : ''}`}>
            <Star className={`w-5 h-5 ${activeTab === 'reviews' ? 'fill-amber-500' : ''}`} />
          </div>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Notas</span>
          {reviewsCount > 0 && (
            <span className="absolute top-0.5 right-1.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[9px] font-black shadow-xs">
              {reviewsCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};
