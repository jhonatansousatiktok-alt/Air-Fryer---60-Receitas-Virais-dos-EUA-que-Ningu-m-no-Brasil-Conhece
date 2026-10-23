import React from 'react';
import { Star, Sparkles, MessageSquare, ChefHat, Clock, ArrowRight } from 'lucide-react';
import { Recipe, UserReview } from '../types/recipe';

interface ReviewsViewProps {
  reviews: Record<number, UserReview>;
  recipes: Recipe[];
  onOpenRecipe: (recipe: Recipe) => void;
  onExploreRecipes: () => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({
  reviews,
  recipes,
  onOpenRecipe,
  onExploreRecipes,
}) => {
  const reviewedList = Object.values(reviews)
    .map((rev) => {
      const recipe = recipes.find((r) => r.id === rev.recipeId);
      return { review: rev, recipe };
    })
    .filter((item): item is { review: UserReview; recipe: Recipe } => !!item.recipe);

  if (reviewedList.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center animate-fadeIn">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-500 mb-6 shadow-xl shadow-amber-950/20">
          <Star className="w-10 h-10 stroke-[1.5] fill-amber-500/20" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Você ainda não avaliou nenhum prato</h2>
        <p className="text-neutral-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
          Depois de preparar uma receita na Air Fryer, abra os detalhes dela para deixar sua nota com estrelas e registrar seus segredos, pontos de cozimento e notas de chef!
        </p>

        <button
          onClick={onExploreRecipes}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-lg shadow-amber-500/20 transition active:scale-95"
        >
          <Sparkles className="w-5 h-5" />
          Escolher uma Receita para Avaliar
        </button>
      </div>
    );
  }

  const averageUserRating = (
    reviewedList.reduce((acc, curr) => acc + curr.review.rating, 0) / reviewedList.length
  ).toFixed(1);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fadeIn">
      {/* Header bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            <h2 className="text-2xl font-black text-white">Minhas Avaliações & Notas de Chef</h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Seu diário culinário com notas e adaptações de cada prato.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-neutral-850 border border-neutral-750 px-4 py-2 rounded-xl self-start sm:self-auto">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-bold text-lg text-white">{averageUserRating}</span>
          </div>
          <div className="border-l border-neutral-700 pl-3">
            <span className="text-[11px] text-neutral-400 block font-medium">Média das suas notas</span>
            <span className="text-xs font-semibold text-amber-400">{reviewedList.length} receitas avaliadas</span>
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviewedList.map(({ review, recipe }) => (
          <div
            key={recipe.id}
            onClick={() => onOpenRecipe(recipe)}
            className="group bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-lg transition cursor-pointer flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
          >
            <div className="flex gap-4 items-center">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-20 h-20 rounded-xl object-cover border border-neutral-800 shrink-0"
              />
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  #{recipe.id} • {recipe.chapterTitle.split('-')[0]}
                </span>
                <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition">
                  {recipe.title}
                </h3>
                
                {/* Stars */}
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-neutral-200">
                    {review.rating}/5 estrelas
                  </span>
                </div>

                {/* Notes if any */}
                {review.notes && (
                  <p className="text-xs text-neutral-400 mt-2 bg-neutral-850 p-2.5 rounded-lg border border-neutral-800 italic line-clamp-2">
                    &quot;{review.notes}&quot;
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                className="flex items-center gap-1 text-xs font-semibold text-neutral-400 group-hover:text-amber-400 transition"
              >
                <span>Editar / Ver Receita</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
