import React, { useState } from 'react';
import { 
  X, Heart, Share2, Timer, ShoppingBag, Plus, Minus, Check, 
  Star, Thermometer, Clock, Users, Lightbulb, Play, MessageSquare, 
  Sparkles, ChefHat, CheckCircle2, AlertCircle, Info, Leaf
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

  // Why it matters scientific note per recipe (matching Screenshot 2 "POR QUE ISSO É IMPORTANTE?")
  const scientificWhyItMatters = recipe.chefTip.length > 50 
    ? recipe.chefTip 
    : `O fluxo de ar quente a ${recipe.temperature}°C desidrata a superfície instantaneamente, criando a reação de Maillard que doura o alimento enquanto preserva a maciez suculenta no interior.`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm overflow-hidden animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-[#FCFAF7] border-t sm:border border-[#E8DFD3] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden text-[#1E293B] h-[94vh] sm:h-auto sm:max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-recipe-title"
      >
        {/* Mobile Pull Bar */}
        <div className="sm:hidden pt-2.5 pb-1 bg-white/95 flex justify-center">
          <div className="w-12 h-1 bg-[#D1C7BA] rounded-full" />
        </div>

        {/* Top Editorial Nav Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white/95 backdrop-blur-md border-b border-[#EBE3D7]">
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="px-2 py-0.5 rounded-md bg-[#FAF0E7] text-[#C8521A] text-xs font-bold border border-[#E9D0C1] shrink-0">
              #{recipe.id}
            </span>
            <span className="text-xs font-semibold text-[#64748B] truncate">
              {recipe.chapterTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShare(recipe)}
              aria-label="Compartilhar esta receita"
              className="p-2 rounded-xl bg-[#FAF5EE] hover:bg-[#F2E8DC] text-[#475569] hover:text-[#0F2942] border border-[#E5DACD] transition"
              title="Compartilhar"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleFavorite(recipe.id)}
              aria-label={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
              className={`p-2 rounded-xl transition border ${
                isFavorite
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-[#FAF5EE] text-[#475569] hover:text-rose-500 hover:bg-rose-50 border-[#E5DACD]'
              }`}
              title={isFavorite ? 'Favoritada' : 'Favoritar'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              aria-label="Fechar detalhes da receita"
              className="p-2 rounded-xl bg-[#FAF5EE] hover:bg-[#F2E8DC] text-[#64748B] hover:text-[#0F2942] border border-[#E5DACD] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Editorial Content */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-8 divide-y divide-[#EFE7DC]">
          
          {/* Section 1: Editorial Title & Introductory Paragraph (Matching Screenshot 1) */}
          <div className="space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8A4A28] mb-1">
                <span>Capítulo {recipe.chapter}</span>
                <span>•</span>
                <span>{recipe.difficulty}</span>
              </div>
              
              <h1 id="modal-recipe-title" className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0F2942] leading-tight">
                {recipe.id}. {recipe.title}:
              </h1>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[#C8521A] mt-1 leading-snug">
                {recipe.subtitle}
              </p>
            </div>

            {/* Small decorative line with accent dot */}
            <div className="flex items-center gap-2 py-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C8521A] shrink-0" />
              <div className="h-[1.5px] bg-[#E8DFD5] w-full" />
            </div>

            <p className="text-[#374151] text-sm sm:text-base leading-relaxed">
              Esqueça as receitas complicadas. Esta preparação viral foi testada e adaptada para garantir máxima crocância por fora e textura macia e suculenta por dentro, extraindo 100% da tecnologia de convecção da sua Air Fryer.
            </p>

            {/* Info Strip (Matching Screenshot 1) */}
            <div className="bg-[#F7F2EA] border border-[#E5DACB] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white text-[#C8521A] shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#64748B] block uppercase tracking-wider">Tempo de preparo:</span>
                  <span className="font-bold text-[#0F2942] text-sm sm:text-base">{recipe.prepTime}</span>
                </div>
              </div>

              <div className="h-8 w-[1px] bg-[#DFCDBA] hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white text-[#C8521A] shadow-xs">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#64748B] block uppercase tracking-wider">Air Fryer:</span>
                  <span className="font-bold text-[#0F2942] text-sm sm:text-base">{recipe.airFryerTime} a {recipe.temperature}°C</span>
                </div>
              </div>

              <div className="h-8 w-[1px] bg-[#DFCDBA] hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white text-[#C8521A] shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#64748B] block uppercase tracking-wider">Rendimento:</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <button
                      onClick={() => setServings((s) => Math.max(1, s - 1))}
                      aria-label="Diminuir porções"
                      className="w-5 h-5 rounded bg-white hover:bg-[#EBE3D7] text-[#0F2942] flex items-center justify-center font-bold text-xs shadow-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-[#0F2942] text-sm px-1 min-w-[20px] text-center">{servings}</span>
                    <button
                      onClick={() => setServings((s) => s + 1)}
                      aria-label="Aumentar porções"
                      className="w-5 h-5 rounded bg-white hover:bg-[#EBE3D7] text-[#0F2942] flex items-center justify-center font-bold text-xs shadow-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <span className="text-xs text-[#64748B] ml-1">{recipe.servingsUnit}</span>
                  </div>
                </div>
              </div>

              {/* Direct Timer Starter */}
              <button
                onClick={() => onStartTimer(recipe, recipe.airFryerTimeMinutes, `Assando ${recipe.title}`)}
                className="ml-auto w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#C8521A] hover:bg-[#B34514] text-white shadow-md shadow-[#C8521A]/20 transition active:scale-95"
              >
                <Timer className="w-4 h-4" />
                <span>Iniciar Timer ({recipe.airFryerTimeMinutes}m)</span>
              </button>
            </div>
          </div>

          {/* Section 2: Ingredients & Real Photo with Circular Badge (Matching Screenshot 1) */}
          <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Ingredients Box */}
            <div className="lg:col-span-5 order-last lg:order-first bg-white border border-[#E8DFD5] rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(45,30,15,0.04)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0E7DC] pb-3">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F2942]">
                  Ingredientes:
                </h2>
                <span className="text-xs font-semibold text-[#8A4A28] bg-[#FBF3EB] px-2.5 py-1 rounded-full border border-[#EED7C4]">
                  {servings} {recipe.servingsUnit}
                </span>
              </div>

              {/* Ingredients List with warm terracotta bullets */}
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, idx) => {
                  const scaled = scaleIngredient(ing, recipe.servings, servings);
                  const isChecked = !!checkedIngredients[idx];

                  return (
                    <li 
                      key={idx}
                      onClick={() => toggleIngredient(idx)}
                      className="flex items-start gap-2.5 text-sm sm:text-base text-[#334155] cursor-pointer group"
                    >
                      <span className={`w-2 h-2 rounded-full mt-2 shrink-0 transition-colors ${
                        isChecked ? 'bg-[#C8521A]' : 'bg-[#CBD5E1]'
                      }`} />
                      <span className={`leading-snug transition ${
                        isChecked ? 'text-[#1E293B] font-medium' : 'text-[#94A3B8] line-through'
                      }`}>
                        {scaled}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* Add to shopping list button */}
              <button
                onClick={handleAddIngredientsToShopping}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[#3D5A3C] hover:bg-[#324B31] text-white transition active:scale-95 shadow-md shadow-[#3D5A3C]/15 mt-2"
              >
                {addedToListNotification ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Adicionado à Lista de Compras!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Adicionar à Lista de Compras</span>
                  </>
                )}
              </button>
            </div>

            {/* Right: High-Res Real Photo with Circular Dark Stamp Badge */}
            <div className="lg:col-span-7 order-first lg:order-last relative">
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#E5DACD] bg-[#FAF5EE] aspect-[4/3]">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />

                {/* Dark Navy Circular Stamp (Matching Screenshot 1) */}
                <div className="absolute top-4 right-4 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#0F2942]/95 backdrop-blur-xs text-white p-2.5 flex flex-col items-center justify-center text-center shadow-xl border-2 border-white/20 transform rotate-6 hover:rotate-0 transition-transform">
                  <span className="text-[10px] font-black tracking-widest text-[#E2692D] uppercase">
                    CROCANTE
                  </span>
                  <span className="text-[11px] sm:text-xs font-black uppercase leading-tight mt-0.5">
                    POR FORA,
                  </span>
                  <span className="text-[9px] font-bold text-neutral-300 uppercase leading-none mt-1">
                    SURPREENDENTE
                  </span>
                  <span className="text-[10px] font-extrabold text-[#E2692D] uppercase leading-tight">
                    POR DENTRO!
                  </span>
                </div>

                {/* Bottom Photo Metadata Caption */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md rounded-xl p-2.5 text-xs text-[#0F2942] font-semibold flex items-center justify-between border border-white/80 shadow-sm">
                  <span>Foto real da receita testada</span>
                  <span className="text-[#C8521A] font-bold">Temperatura Ideal: {recipe.temperature}°C</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Modo de Preparo (Matching Screenshot 1) */}
          <div className="pt-8 space-y-4">
            <div className="bg-white border border-[#E8DFD5] rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(45,30,15,0.04)]">
              <h2 className="font-serif text-2xl font-bold text-[#0F2942] mb-1">
                Modo de Preparo:
              </h2>
              <p className="text-xs text-[#64748B] mb-6">
                Clique nos passos para marcar como concluído durante a execução na cozinha.
              </p>

              <div className="space-y-4">
                {recipe.steps.map((step, idx) => {
                  const isCompleted = completedSteps.includes(idx);

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                        isCompleted
                          ? 'bg-[#F2F7F1] border-[#CDE0CC]'
                          : 'bg-[#FCFAF7] border-[#ECE3D7] hover:border-[#C8521A]/40'
                      }`}
                    >
                      {/* Orange solid circle with step number */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-[#3D5A3C] text-white shadow-xs'
                          : 'bg-[#C8521A] text-white shadow-xs'
                      }`}>
                        {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>

                      <div className="flex-1">
                        <p className={`text-sm sm:text-base leading-relaxed ${
                          isCompleted ? 'text-[#3D5A3C] line-through font-medium' : 'text-[#1E293B]'
                        }`}>
                          {step}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Tip Callout (Matching Bottom of Screenshot 1) */}
            <div className="bg-[#FDF8F0] border border-[#ECD9C5] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-[#F6E6D3] text-[#C8521A] shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif font-bold text-[#8A4A28] text-sm sm:text-base block">
                  Dica de Mestre do Chef:
                </span>
                <p className="text-xs sm:text-sm text-[#4A3828] mt-0.5 leading-relaxed">
                  {recipe.chefTip}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Science & Culinary Guidance (Matching Screenshot 2 - "POR QUE ISSO É IMPORTANTE?") */}
          <div className="pt-8 space-y-4">
            {/* "Por que isso é importante?" in Sage Green (Screenshot 2) */}
            <div className="bg-[#F3F7F1] border border-[#CCDBC7] rounded-3xl p-6 sm:p-7">
              <div className="flex items-center gap-2.5 text-[#3D5A3C] font-bold text-xs uppercase tracking-wider mb-2">
                <Leaf className="w-4 h-4" />
                <span>Por que isso é importante?</span>
              </div>
              <p className="text-sm sm:text-base text-[#2E452D] leading-relaxed font-medium">
                {scientificWhyItMatters}
              </p>
            </div>

            {/* Dica & Observe Dual Cards (Screenshot 2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-[#D5E3D2] rounded-2xl p-4 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#3D5A3C] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#3D5A3C] block">
                    DICA
                  </span>
                  <p className="text-xs sm:text-sm text-[#475569] mt-0.5 leading-relaxed">
                    Não sobreponha os alimentos na cesta. O ar precisa circular livremente por baixo para que a textura fique uniforme.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-[#EBDCD0] rounded-2xl p-4 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#8A4A28] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#8A4A28] block">
                    OBSERVE
                  </span>
                  <p className="text-xs sm:text-sm text-[#475569] mt-0.5 leading-relaxed">
                    Aos {Math.round(recipe.airFryerTimeMinutes / 2)} minutos de preparo, abra a cesta e dê uma leve sacudida para garantir dourado homogêneo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Review, Notes & Social Share */}
          <div className="pt-8">
            <div className="bg-white border border-[#E8DFD5] rounded-3xl p-6 sm:p-7 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-[#0F2942] mb-1 flex items-center gap-2">
                <Star className="w-5 h-5 text-[#E59819] fill-[#E59819]" />
                Avaliação & Caderno de Notas Pessoal
              </h2>
              <p className="text-xs text-[#64748B] mb-5">
                Avalie esta receita e anote adaptações da sua cozinha (tempo na sua air fryer, marcas preferidas, temperos extras).
              </p>

              <form onSubmit={handleSaveReviewSubmit} className="space-y-4">
                {/* 5-Star Rating Buttons */}
                <div>
                  <label className="block text-xs font-bold text-[#0F2942] uppercase tracking-wider mb-2">
                    Sua nota para esta receita:
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => {
                      const isFilled = (hoverRating !== null ? hoverRating : rating) >= s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setRating(s)}
                          className="p-1 text-2xl transition hover:scale-110"
                          aria-label={`Avaliar com ${s} estrelas`}
                        >
                          <Star className={`w-7 h-7 ${isFilled ? 'fill-[#E59819] text-[#E59819]' : 'text-[#CBD5E1]'}`} />
                        </button>
                      );
                    })}
                    <span className="ml-3 font-bold text-[#0F2942] text-sm">
                      {rating} de 5 estrelas
                    </span>
                  </div>
                </div>

                {/* Notes Input */}
                <div>
                  <label htmlFor="chef-notes" className="block text-xs font-bold text-[#0F2942] uppercase tracking-wider mb-1.5">
                    Suas anotações pessoais do prato:
                  </label>
                  <textarea
                    id="chef-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Ficou perfeito em 7 minutos a 180°C. Na próxima vez vou adicionar uma pitada de noz-moscada..."
                    rows={3}
                    className="w-full bg-[#FAF7F2] border border-[#E2D8CC] focus:border-[#C8521A] rounded-2xl p-3.5 text-sm text-[#0F2942] placeholder-[#94A3B8] focus:outline-none focus:bg-white transition"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#0F2942] hover:bg-[#1E3A5A] text-white transition active:scale-95 shadow-md shadow-[#0F2942]/10"
                  >
                    Salvar Avaliação & Notas
                  </button>

                  {savedNoteMessage && (
                    <span className="text-xs font-bold text-[#3D5A3C] flex items-center gap-1 animate-fadeIn">
                      <Check className="w-4 h-4" />
                      Anotação salva com sucesso!
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>

        </div>

        {/* Sticky Mobile Bottom Quick Action Bar for Cooking */}
        <div className="sm:hidden sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E8DFD5] px-4 py-2.5 flex items-center gap-2 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
          <button
            onClick={() => onStartTimer(recipe, recipe.airFryerTimeMinutes, `Assando ${recipe.title}`)}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl font-bold text-xs bg-[#C8521A] hover:bg-[#B34514] text-white transition active:scale-95 shadow-md shadow-[#C8521A]/20"
          >
            <Timer className="w-4 h-4" />
            <span>Timer ({recipe.airFryerTimeMinutes}m)</span>
          </button>

          <button
            onClick={handleAddIngredientsToShopping}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl font-bold text-xs bg-[#3D5A3C] hover:bg-[#324B31] text-white transition active:scale-95 shadow-md shadow-[#3D5A3C]/20"
          >
            {addedToListNotification ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Adicionado!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>+ Lista Compras</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
