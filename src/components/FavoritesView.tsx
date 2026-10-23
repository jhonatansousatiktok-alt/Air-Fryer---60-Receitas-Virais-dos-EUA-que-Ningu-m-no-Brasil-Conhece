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
        <div className="w-20 h-20 mx-auto rounded-3xl bg-white border border-[#E8DFD5] flex items-center justify-center text-rose-500 mb-6 shadow-md shadow-rose-900/5">
          <Heart className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#0F2942] mb-2">Você ainda não tem favoritos salvos</h2>
        <p className="text-[#64748B] max-w-md mx-auto mb-8 text-sm leading-relaxed">
          Navegue pelas 60 receitas virais e clique no ícone de coração para salvar os pratos que você mais deseja fazer na sua Air Fryer!
        </p>

        <button
          onClick={onExploreRecipes}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-[#C8521A] hover:bg-[#B34514] text-white shadow-md shadow-[#C8521A]/20 transition active:scale-95 text-sm"
        >
          <Sparkles className="w-4 h-4" />
          Ver 60 Receitas do Livro
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white border border-[#E8DFD5] rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2942]">Meus Pratos Favoritos</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
              {favoriteRecipes.length} receitas
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Seu livro pessoal de pratos preferidos com cronômetros e ingredientes prontos.
          </p>
        </div>

        <button
          onClick={handleAddAllFavoritesToCart}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#3D5A3C] hover:bg-[#324B31] text-white transition active:scale-95 shadow-md shadow-[#3D5A3C]/15"
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
