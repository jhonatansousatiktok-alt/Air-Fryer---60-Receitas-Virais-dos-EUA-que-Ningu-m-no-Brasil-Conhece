import React from 'react';
import { Heart, Clock, Thermometer, Star, Plus, Share2, Timer, Check } from 'lucide-react';
import { Recipe } from '../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (recipeId: number) => void;
  onOpenDetails: (recipe: Recipe) => void;
  onAddAllToShoppingList: (recipe: Recipe) => void;
  onStartTimer: (recipe: Recipe, minutes: number, label: string) => void;
  onShare: (recipe: Recipe) => void;
  userRating?: number;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
  onAddAllToShoppingList,
  onStartTimer,
  onShare,
  userRating,
}) => {
  const [addedToList, setAddedToList] = React.useState(false);

  const handleAddShopping = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddAllToShoppingList(recipe);
    setAddedToList(true);
    setTimeout(() => setAddedToList(false), 2000);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(recipe.id);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare(recipe);
  };

  const handleTimerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStartTimer(recipe, recipe.airFryerTimeMinutes, `Assando ${recipe.title}`);
  };

  return (
    <article
      onClick={() => onOpenDetails(recipe)}
      className="group relative bg-white border border-[#E9E0D4] hover:border-[#C8521A]/50 rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(45,30,15,0.06)] hover:shadow-[0_12px_28px_-6px_rgba(45,30,15,0.12)] transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
      aria-label={`Receita ${recipe.title}`}
    >
      {/* Recipe Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAF6F0]">
        <img
          src={recipe.image}
          alt={recipe.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white/95 backdrop-blur-md text-[#0F2942] border border-[#E5DACD] shadow-sm pointer-events-auto">
            #{recipe.id} • Cap. {recipe.chapter}
          </span>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={handleShareClick}
              aria-label={`Compartilhar ${recipe.title}`}
              className="p-2 rounded-full bg-white/90 hover:bg-white backdrop-blur-md text-[#475569] hover:text-[#0F2942] transition shadow-sm"
              title="Compartilhar com amigos"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? `Remover ${recipe.title} dos favoritos` : `Salvar ${recipe.title} nos favoritos`}
              className={`p-2 rounded-full backdrop-blur-md transition shadow-sm ${
                isFavorite
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/90 text-[#475569] hover:text-rose-500 hover:bg-white'
              }`}
              title={isFavorite ? 'Favoritado' : 'Adicionar aos favoritos'}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom specs on image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md text-[#C8521A] font-bold border border-white/80 shadow-sm">
            <Thermometer className="w-3.5 h-3.5" />
            {recipe.temperature}°C
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md text-[#0F2942] font-semibold border border-white/80 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-[#C8521A]" />
            {recipe.airFryerTime}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Subtle Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2 text-xs">
            {recipe.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-[#FAF4ED] text-[#8A4A28] border border-[#ECDCCB]"
              >
                {tag}
              </span>
            ))}
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-[#EEF5ED] text-[#3D5A3C] border border-[#D5E5D3]">
              {recipe.difficulty}
            </span>
          </div>

          <h3 className="font-serif font-bold text-[#0F2942] text-base sm:text-lg leading-snug group-hover:text-[#C8521A] transition-colors line-clamp-1">
            {recipe.title}
          </h3>
          <p className="text-xs text-[#526071] line-clamp-2 mt-1.5 leading-relaxed">
            {recipe.subtitle}
          </p>
        </div>

        {/* Rating & Actions Bottom */}
        <div className="mt-4 pt-3.5 border-t border-[#F0E8DD] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs">
            <Star className="w-3.5 h-3.5 fill-[#E59819] text-[#E59819]" />
            <span className="font-bold text-[#0F2942]">
              {userRating ? userRating.toFixed(1) : recipe.defaultRating.toFixed(1)}
            </span>
            <span className="text-[11px] text-[#78889B]">
              ({userRating ? 'Sua nota' : `${recipe.ratingCount}`})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTimerClick}
              aria-label={`Iniciar cronômetro de ${recipe.airFryerTimeMinutes} minutos para ${recipe.title}`}
              className="p-2 sm:p-1.5 rounded-xl bg-[#FAF4ED] hover:bg-[#F3E5D4] text-[#C8521A] border border-[#E9D9C8] transition min-w-[36px] min-h-[36px] flex items-center justify-center"
              title="Iniciar Cronômetro Rápido"
            >
              <Timer className="w-4 h-4" />
            </button>

            <button
              onClick={handleAddShopping}
              aria-label={`Adicionar ingredientes de ${recipe.title} à lista de compras`}
              className={`p-2 sm:p-1.5 rounded-xl border transition min-w-[36px] min-h-[36px] flex items-center justify-center ${
                addedToList
                  ? 'bg-[#3D5A3C] text-white border-[#3D5A3C]'
                  : 'bg-[#F2F7F1] hover:bg-[#E3EEE2] text-[#3D5A3C] border-[#D5E5D3]'
              }`}
              title="Adicionar à Lista de Compras"
            >
              {addedToList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
