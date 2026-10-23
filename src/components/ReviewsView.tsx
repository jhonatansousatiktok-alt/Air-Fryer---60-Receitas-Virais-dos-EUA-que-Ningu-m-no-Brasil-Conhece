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
        <div className="w-20 h-20 mx-auto rounded-3xl bg-white border border-[#E8DFD5] flex items-center justify-center text-[#E59819] mb-6 shadow-md shadow-amber-900/5">
          <Star className="w-10 h-10 stroke-[1.5] fill-[#E59819]/20" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#0F2942] mb-2">Você ainda não avaliou nenhum prato</h2>
        <p className="text-[#64748B] max-w-md mx-auto mb-8 text-sm leading-relaxed">
          Depois de preparar uma receita na Air Fryer, abra os detalhes dela para deixar sua nota com estrelas e registrar seus segredos, pontos de cozimento e notas de chef!
        </p>

        <button
          onClick={onExploreRecipes}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-[#C8521A] hover:bg-[#B34514] text-white shadow-md shadow-[#C8521A]/20 transition active:scale-95 text-sm"
        >
          <Sparkles className="w-4 h-4" />
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
      <div className="bg-white border border-[#E8DFD5] rounded-3xl p-6 sm:p-7 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <Star className="w-6 h-6 text-[#E59819] fill-[#E59819]" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2942]">Minhas Avaliações & Notas de Chef</h2>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Seu diário culinário pessoal com adaptações e notas de cada prato preparado.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#FAF5EE] border border-[#E5DACD] px-4 py-2.5 rounded-2xl self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <Star className="w-5 h-5 text-[#E59819] fill-[#E59819]" />
            <span className="font-bold text-xl text-[#0F2942]">{averageUserRating}</span>
          </div>
          <div className="border-l border-[#DFCDBA] pl-3">
            <span className="text-[11px] text-[#64748B] block font-medium">Média das suas notas</span>
            <span className="text-xs font-bold text-[#C8521A]">{reviewedList.length} receitas avaliadas</span>
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviewedList.map(({ review, recipe }) => (
          <div
            key={recipe.id}
            onClick={() => onOpenRecipe(recipe)}
            className="group bg-white border border-[#E8DFD5] hover:border-[#C8521A]/50 rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(45,30,15,0.04)] hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
          >
            <div className="flex gap-4 items-center">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-20 h-20 rounded-2xl object-cover border border-[#E8DFD5] shrink-0"
              />
              <div>
                <span className="text-[11px] font-bold text-[#C8521A] uppercase tracking-wider">
                  #{recipe.id} • {recipe.chapterTitle.split('-')[0]}
                </span>
                <h3 className="font-serif font-bold text-[#0F2942] text-lg group-hover:text-[#C8521A] transition leading-snug">
                  {recipe.title}
                </h3>
                
                {/* Stars */}
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= review.rating ? 'text-[#E59819] fill-[#E59819]' : 'text-[#CBD5E1]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#0F2942]">
                    {review.rating}/5 estrelas
                  </span>
                </div>

                {/* Notes if any */}
                {review.notes && (
                  <p className="text-xs text-[#526071] mt-2 bg-[#FAF5EE] p-3 rounded-xl border border-[#ECE0D3] italic line-clamp-2">
                    &quot;{review.notes}&quot;
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                className="flex items-center gap-1 text-xs font-bold text-[#0F2942] group-hover:text-[#C8521A] transition"
              >
                <span>Ver Receita</span>
                <ArrowRight className="w-4 h-4 text-[#C8521A]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
