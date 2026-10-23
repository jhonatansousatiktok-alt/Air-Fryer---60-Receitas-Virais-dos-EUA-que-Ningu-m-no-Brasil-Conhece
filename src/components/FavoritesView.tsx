import React from 'react';
import { Heart, Sparkles, ShoppingBag, Check } from 'lucide-react';
import { Recipe, UserReview } from '../types/recipe';
import { RecipeCard } from './RecipeCard';

interface FavoritesViewProps {
  favoriteRecipes: Recipe[];
  onToggleFavorite: (recipeId: number) => void;
  onOpenDetails: (recipe: Recipe) => void;
  onAddAllToShoppingList: (recipe: Recipe) => void;
  onAddMultipleToShoppingList: (recipes: Recipe[]) => void;
  onStartTimer: (recipe: Recipe, minutes: number, label: string) => void;
  onShare: (recipe: Recipe) => void;
  reviews: Record<number, UserReview>;
  onExploreRecipes: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteRecipes,
  onToggleFavorite,
  onOpenDetails,
  onAddAllToShoppingList,
  onAddMultipleToShoppingList,
  onStartTimer,
  onShare,
  reviews,
  onExploreRecipes,
}) => {
  const [addedAll, setAddedAll] = React.useState(false);

  const handleAddAllFavoritesToCart = () => {
    onAddMultipleToShoppingList(favoriteRecipes);
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2500);
  };

  if (favoriteRecipes.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center animate-fadeIn">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-500 mb-6 shadow-xl shadow-rose-950/20">
          <Heart className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Você ainda não tem favoritos salvos</h2>
        <p className="text-neutral-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
          Navegue pelas 60 receitas e clique no ícone de coração para salvar os pratos que você mais deseja fazer na sua Air Fryer!
        </p>

        <button
          onClick={onExploreRecipes}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-lg shadow-amber-500/20 transition active:scale-95"
        >
          <Sparkles className="w-5 h-5" />
          Ver 60 Receitas Virais
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <h2 className="text-2xl font-black text-white">Meus Pratos Favoritos</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300">
              {favoriteRecipes.length} receitas
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Seu livro pessoal de pratos preferidos da Air Fryer.
          </p>
        </div>

        <button
          onClick={handleAddAllFavoritesToCart}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-neutral-800 hover:bg-neutral-750 text-emerald-400 border border-emerald-500/40 transition active:scale-95 shadow-md"
        >
          {addedAll ? (
            <>
              <Check className="w-4 h-4" />
              Ingredientes Adicionados!
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              Adicionar Todos à Lista de Compras
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isFavorite={true}
            onToggleFavorite={onToggleFavorite}
            onOpenDetails={onOpenDetails}
            onAddAllToShoppingList={onAddAllToShoppingList}
            onStartTimer={onStartTimer}
            onShare={onShare}
            userRating={reviews[recipe.id]?.rating}
          />
        ))}
      </div>
    </div>
  );
};
