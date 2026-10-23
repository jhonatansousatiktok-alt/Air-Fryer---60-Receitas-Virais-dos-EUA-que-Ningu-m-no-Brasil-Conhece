import React, { useState } from 'react';
import { 
  X, Heart, Share2, Timer, ShoppingBag, Plus, Minus, Check, 
  Star, Thermometer, Clock, Users, Lightbulb, Play, MessageSquare, 
  Sparkles, ChefHat, CheckCircle2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Recipe, UserReview } from '../types/recipe';
import { scaleIngredient } from '../utils/recipeUtils';

interface RecipeDetailModalProps {
  recipe: Recipe;
  isFavorite: boolean;
  userReview?: UserReview;
  onToggleFavorite: (recipeId: number) => void;
  onSaveReview: (recipeId: number, rating: number, notes: string) => void;
  onAddSelectedToShoppingList: (recipe: Recipe, selectedIngredients: string[]) => void;
  onStartTimer: (recipe: Recipe, minutes: number, label: string) => void;
  onShare: (recipe: Recipe) => void;
  onClose: () => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  isFavorite,
  userReview,
  onToggleFavorite,
  onSaveReview,
  onAddSelectedToShoppingList,
  onStartTimer,
  onShare,
  onClose,
}) => {
  const [servings, setServings] = useState<number>(recipe.servings);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {};
    recipe.ingredients.forEach((_, idx) => {
      init[idx] = true;
    });
    return init;
  });
  const [addedToListNotification, setAddedToListNotification] = useState(false);

  // Review states
  const [rating, setRating] = useState<number>(userReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>(userReview?.notes || '');
  const [savedNoteMessage, setSavedNoteMessage] = useState(false);

  const toggleStep = (idx: number) => {
    if (completedSteps.includes(idx)) {
      setCompletedSteps(completedSteps.filter((s) => s !== idx));
    } else {
      const nextSteps = [...completedSteps, idx];
      setCompletedSteps(nextSteps);
      if (nextSteps.length === recipe.steps.length) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleAddIngredientsToShopping = () => {
    const selected = recipe.ingredients
      .map((ing, idx) => ({ ing: scaleIngredient(ing, recipe.servings, servings), checked: checkedIngredients[idx] }))
      .filter((item) => item.checked)
      .map((item) => item.ing);

    if (selected.length > 0) {
      onAddSelectedToShoppingList(recipe, selected);
      setAddedToListNotification(true);
      setTimeout(() => setAddedToListNotification(false), 2500);
    }
  };

  const handleSaveReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveReview(recipe.id, rating, notes);
    setSavedNoteMessage(true);
    setTimeout(() => setSavedNoteMessage(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-750 rounded-3xl shadow-2xl overflow-hidden my-auto text-neutral-100 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-recipe-title"
      >
        {/* Sticky Header with Close button & Actions */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800">
          <div className="flex items-center gap-2 truncate pr-4">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold shrink-0">
              #{recipe.id}
            </span>
            <span className="text-xs text-neutral-400 truncate">
              {recipe.chapterTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShare(recipe)}
              aria-label="Compartilhar esta receita"
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition"
              title="Compartilhar"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleFavorite(recipe.id)}
              aria-label={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
              className={`p-2 rounded-xl transition ${
                isFavorite
                  ? 'bg-rose-500 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:text-rose-400 hover:bg-neutral-700'
              }`}
              title={isFavorite ? 'Favoritada' : 'Favoritar'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              aria-label="Fechar detalhes da receita"
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 divide-y divide-neutral-800">
          {/* Hero Section with Real Photo */}
          <div className="relative aspect-[21/9] sm:aspect-[21/8] w-full bg-neutral-950 overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
            
            <div className="absolute bottom-4 left-6 right-6">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {recipe.tags.map((t) => (
                  <span key={t} className="px-2.5 py-0.5 rounded-full bg-neutral-950/70 backdrop-blur-md text-amber-300 text-xs font-semibold border border-neutral-700">
                    {t}
                  </span>
                ))}
              </div>
              <h1 id="modal-recipe-title" className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {recipe.title}
              </h1>
              <p className="text-sm text-neutral-300 mt-1 max-w-2xl">
                {recipe.subtitle}
              </p>
            </div>
          </div>

          {/* Quick Info & Timer launch bar */}
          <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-neutral-900/60">
            <div className="bg-neutral-850/80 p-3 rounded-2xl border border-neutral-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">Temperatura</span>
                <span className="text-lg font-bold text-white">{recipe.temperature}°C</span>
              </div>
            </div>

            <div className="bg-neutral-850/80 p-3 rounded-2xl border border-neutral-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">Air Fryer</span>
                <span className="text-lg font-bold text-white">{recipe.airFryerTime}</span>
              </div>
            </div>

            <div className="bg-neutral-850/80 p-3 rounded-2xl border border-neutral-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">Preparo Prévio</span>
                <span className="text-lg font-bold text-white">{recipe.prepTime}</span>
              </div>
            </div>

            {/* Direct Timer Starter */}
            <button
              onClick={() => onStartTimer(recipe, recipe.airFryerTimeMinutes, `Cozinhando ${recipe.title}`)}
              className="bg-gradient-to-br from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white p-3 rounded-2xl shadow-lg shadow-orange-950/40 flex items-center justify-center gap-2.5 font-bold text-sm transition active:scale-95 group text-left"
            >
              <Timer className="w-5 h-5 group-hover:rotate-12 transition-transform shrink-0" />
              <div>
                <span className="block text-[10px] text-amber-100 font-normal">Iniciar</span>
                <span>Timer ({recipe.airFryerTimeMinutes}m)</span>
              </div>
            </button>
          </div>

          {/* Servings Scaler & Ingredients */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                  Ingredientes Necessários
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Ajuste o rendimento para recalcular as medidas automaticamente.
                </p>
              </div>

              {/* Servings Adjuster */}
              <div className="flex items-center gap-3 bg-neutral-800 border border-neutral-700 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                <span className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-400" />
                  Porções:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setServings((s) => Math.max(1, s - 1))}
                    aria-label="Diminuir porções"
                    className="p-1 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-neutral-200 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-amber-400 text-sm">
                    {servings}
                  </span>
                  <button
                    onClick={() => setServings((s) => s + 1)}
                    aria-label="Aumentar porções"
                    className="p-1 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-neutral-200 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Ingredients Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 my-4">
              {recipe.ingredients.map((ing, idx) => {
                const scaled = scaleIngredient(ing, recipe.servings, servings);
                const isChecked = !!checkedIngredients[idx];

                return (
                  <label
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer ${
                      isChecked
                        ? 'bg-neutral-850 border-neutral-750 text-neutral-200'
                        : 'bg-neutral-900/60 border-neutral-850 text-neutral-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleIngredient(idx)}
                      className="w-4 h-4 mt-0.5 rounded border-neutral-700 text-amber-500 focus:ring-amber-500/40 bg-neutral-800 shrink-0"
                    />
                    <span className="text-sm leading-snug">{scaled}</span>
                  </label>
                );
              })}
            </div>

            {/* Add to Shopping List Button */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleAddIngredientsToShopping}
                className="flex items-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 hover:bg-amber-400 text-neutral-950 transition active:scale-95 shadow-lg shadow-amber-500/20"
              >
                {addedToListNotification ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-950" />
                    Adicionado à Lista de Compras!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Adicionar Ingredientes Selecionados à Lista de Compras
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preparation Steps */}
          <div className="p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <ChefHat className="w-5 h-5 text-amber-400" />
              Modo de Preparo Passo a Passo
            </h2>
            <p className="text-xs text-neutral-400 mb-4">
              Clique nos passos conforme for preparando para acompanhar seu progresso!
            </p>

            <div className="space-y-3">
              {recipe.steps.map((step, idx) => {
                const isCompleted = completedSteps.includes(idx);

                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 ${
                      isCompleted
                        ? 'bg-neutral-900 border-neutral-800 text-neutral-500'
                        : 'bg-neutral-850 border-neutral-750 text-neutral-200 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="shrink-0 pt-0.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-neutral-750 text-amber-400'
                      }`}>
                        {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>
                    </div>

                    <div className="flex-1">
                      <p className={`text-sm leading-relaxed ${isCompleted ? 'line-through' : ''}`}>
                        {step}
                      </p>

                      {/* Step specific timer helpers */}
                      {step.toLowerCase().includes('pré-aqueça') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartTimer(recipe, 3, 'Pré-aquecimento');
                          }}
                          className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition"
                        >
                          <Play className="w-3 h-3 fill-current" /> Timer 3 min Pré-aquecer
                        </button>
                      )}

                      {step.toLowerCase().includes('asse por') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartTimer(recipe, recipe.airFryerTimeMinutes, `Assando ${recipe.title}`);
                          }}
                          className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 transition"
                        >
                          <Play className="w-3 h-3 fill-current" /> Timer Principal ({recipe.airFryerTime})
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chef Tip Callout */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-neutral-900 border border-amber-500/40 text-neutral-200 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-300 text-sm">💡 Dica do Chef</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed mt-1">
                    {recipe.chefTip}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* User Review & Notes Journal */}
          <div className="p-6 bg-neutral-900/80">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              Sua Avaliação & Anotações de Chef
            </h2>
            <p className="text-xs text-neutral-400 mb-4">
              Avalie este prato e anote seus ajustes pessoais de tempo, temperatura e sabor!
            </p>

            <form onSubmit={handleSaveReviewSubmit} className="space-y-4">
              {/* Star selector */}
              <div>
                <span className="block text-xs font-semibold text-neutral-300 mb-2">Quantas estrelas você dá a este prato?</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      aria-label={`Avaliar com ${star} estrelas`}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating !== null ? star <= hoverRating : star <= rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-neutral-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-bold text-amber-400">
                    {hoverRating !== null ? hoverRating : rating} de 5 estrelas
                  </span>
                </div>
              </div>

              {/* Personal notes */}
              <div>
                <label htmlFor="chef-notes" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Minhas Notas de Preparo (visível apenas para você):
                </label>
                <textarea
                  id="chef-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Na minha Air Fryer 180°C por 7 minutos foi o ponto perfeito. Adicionei um toque de orégano fresco no final..."
                  className="w-full bg-neutral-850 border border-neutral-750 rounded-xl p-3 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold bg-neutral-800 hover:bg-neutral-750 text-amber-400 border border-amber-500/30 transition active:scale-95"
                >
                  Salvar Avaliação & Notas
                </button>

                {savedNoteMessage && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4" />
                    Avaliação salva com sucesso!
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
