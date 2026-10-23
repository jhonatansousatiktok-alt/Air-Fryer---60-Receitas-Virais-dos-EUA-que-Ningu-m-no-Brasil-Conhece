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
      className="group relative bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-950/20 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
      aria-label={`Receita ${recipe.title}`}
    >
      {/* Recipe Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
        <img
          src={recipe.image}
          alt={recipe.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-neutral-900/80 backdrop-blur-md text-amber-300 border border-neutral-700 pointer-events-auto">
            #{recipe.id} • Cap. {recipe.chapter}
          </span>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={handleShareClick}
              aria-label={`Compartilhar ${recipe.title}`}
              className="p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 backdrop-blur-md text-neutral-300 hover:text-white transition shadow"
              title="Compartilhar com amigos"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? `Remover ${recipe.title} dos favoritos` : `Salvar ${recipe.title} nos favoritos`}
              className={`p-2 rounded-full backdrop-blur-md transition shadow ${
                isFavorite
                  ? 'bg-rose-500 text-white'
                  : 'bg-neutral-900/80 text-neutral-300 hover:text-rose-400 hover:bg-neutral-800'
              }`}
              title={isFavorite ? 'Favoritado' : 'Adicionar aos favoritos'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom specs on image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-900/90 backdrop-blur-md text-amber-400 font-semibold border border-neutral-750">
            <Thermometer className="w-3.5 h-3.5" />
            {recipe.temperature}°C
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-900/90 backdrop-blur-md text-neutral-200 font-medium border border-neutral-750">
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            {recipe.airFryerTime}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {recipe.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-neutral-800 text-neutral-400"
              >
                {tag}
              </span>
            ))}
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-500/10 text-amber-400/90">
              {recipe.difficulty}
            </span>
          </div>

          <h3 className="font-bold text-white text-base leading-snug group-hover:text-amber-400 transition-colors line-clamp-1">
            {recipe.title}
          </h3>
          <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
            {recipe.subtitle}
          </p>
        </div>

        {/* Rating & Actions Bottom */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-neutral-200">
              {userRating ? userRating.toFixed(1) : recipe.defaultRating.toFixed(1)}
            </span>
            <span className="text-[11px] text-neutral-500">
              ({userRating ? 'Sua nota' : `${recipe.ratingCount}`})
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleTimerClick}
              aria-label={`Iniciar cronômetro de ${recipe.airFryerTimeMinutes} minutos para ${recipe.title}`}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-amber-500/20 text-neutral-300 hover:text-amber-400 transition"
              title="Iniciar Cronômetro Rápido"
            >
              <Timer className="w-4 h-4" />
            </button>

            <button
              onClick={handleAddShopping}
              aria-label={`Adicionar ingredientes de ${recipe.title} à lista de compras`}
              className={`p-1.5 rounded-lg transition ${
                addedToList
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white'
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
