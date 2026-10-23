/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flame, Heart, ShoppingBag, Star, BookOpen, Clock, 
  Sparkles, Filter, ChevronDown, Check, ArrowRight, Share2, Timer,
  ChefHat, Lightbulb, Compass, Award, ShieldCheck, HeartHandshake, Zap
} from 'lucide-react';
import { RECIPES_DATA, CHAPTERS_INFO, ChapterInfo } from './data/recipes';
import { Recipe, ShoppingItem, UserReview, ActiveTimer } from './types/recipe';
import { filterRecipes, categorizeIngredient } from './utils/recipeUtils';
import { Header } from './components/Header';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { IntegratedTimer } from './components/IntegratedTimer';
import { ShoppingListView } from './components/ShoppingListView';
import { FavoritesView } from './components/FavoritesView';
import { ReviewsView } from './components/ReviewsView';
import { SocialShareModal } from './components/SocialShareModal';
import { EbookPdfViewerModal } from './components/EbookPdfViewerModal';
import { CoverLightboxModal } from './components/CoverLightboxModal';

const FAVORITES_STORAGE_KEY = 'airfryer_secrets_favorites';
const SHOPPING_STORAGE_KEY = 'airfryer_secrets_shopping';
const REVIEWS_STORAGE_KEY = 'airfryer_secrets_reviews';

export default function App() {
  // Navigation & filters
  const [activeTab, setActiveTab] = useState<'recipes' | 'favorites' | 'shopping' | 'reviews'>('recipes');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxTimeFilter, setMaxTimeFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'recommended' | 'time' | 'rating'>('recommended');

  // Modals & Active elements
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shareRecipe, setShareRecipe] = useState<Recipe | null>(null);
  const [showEbookModal, setShowEbookModal] = useState<boolean>(false);
  const [showCoverModal, setShowCoverModal] = useState<boolean>(false);

  // Persistent States
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [1, 11, 20, 21, 31, 41];
    } catch {
      return [1, 11, 20, 21, 31, 41];
    }
  });

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    try {
      const saved = localStorage.getItem(SHOPPING_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviews, setReviews] = useState<Record<number, UserReview>>(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Active Timer state
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(shoppingList));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [shoppingList]);

  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [reviews]);

  // Handlers
  const toggleFavorite = (recipeId: number) => {
    setFavorites((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  const handleSaveReview = (recipeId: number, rating: number, notes: string) => {
    setReviews((prev) => ({
      ...prev,
      [recipeId]: {
        recipeId,
        rating,
        notes,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  const handleAddAllToShoppingList = (recipe: Recipe) => {
    const newItems: ShoppingItem[] = recipe.ingredients.map((ingText, idx) => ({
      id: `${recipe.id}-${idx}-${Date.now()}`,
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      text: ingText,
      category: categorizeIngredient(ingText),
      checked: false,
      addedAt: Date.now(),
    }));

    setShoppingList((prev) => [...prev, ...newItems]);
  };

  const handleAddSelectedToShoppingList = (recipe: Recipe, selectedIngredients: string[]) => {
    const newItems: ShoppingItem[] = selectedIngredients.map((ingText, idx) => ({
      id: `${recipe.id}-${idx}-${Date.now()}`,
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      text: ingText,
      category: categorizeIngredient(ingText),
      checked: false,
      addedAt: Date.now(),
    }));

    setShoppingList((prev) => [...prev, ...newItems]);
  };

  const handleAddMultipleToShoppingList = (recipes: Recipe[]) => {
    const newItems: ShoppingItem[] = [];
    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingText, idx) => {
        newItems.push({
          id: `${recipe.id}-${idx}-${Date.now()}-${Math.random()}`,
          recipeId: recipe.id,
          recipeTitle: recipe.title,
          text: ingText,
          category: categorizeIngredient(ingText),
          checked: false,
          addedAt: Date.now(),
        });
      });
    });

    setShoppingList((prev) => [...prev, ...newItems]);
  };

  const handleToggleShoppingItem = (id: string) => {
    setShoppingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleDeleteShoppingItem = (id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCompletedShopping = () => {
    setShoppingList((prev) => prev.filter((item) => !item.checked));
  };

  const handleClearAllShopping = () => {
    if (confirm('Tem certeza de que deseja limpar todos os itens da lista de compras?')) {
      setShoppingList([]);
    }
  };

  const handleAddCustomShoppingItem = (text: string) => {
    setShoppingList((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        text,
        category: categorizeIngredient(text),
        checked: false,
        addedAt: Date.now(),
      },
    ]);
  };

  // Timer controls
  const handleStartTimer = (recipe: Recipe, minutes: number, label: string) => {
    const seconds = minutes * 60;
    setActiveTimer({
      id: `timer-${recipe.id}-${Date.now()}`,
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      totalSeconds: seconds,
      remainingSeconds: seconds,
      isRunning: true,
      label,
    });
  };

  // Filtered & Sorted Recipes
  const filteredRecipes = useMemo(() => {
    return filterRecipes(RECIPES_DATA, {
      category: selectedCategory,
      search: searchQuery,
      maxTime: maxTimeFilter,
      sortBy: sortBy,
    });
  }, [selectedCategory, searchQuery, maxTimeFilter, sortBy]);

  // Favorite Recipes list
  const favoriteRecipes = useMemo(() => {
    return RECIPES_DATA.filter((r) => favorites.includes(r.id));
  }, [favorites]);

  // Group recipes by chapter for chaptered view
  const chaptersList = useMemo(() => {
    return CHAPTERS_INFO.filter((c) => c.id !== 'todos');
  }, []);

  const getRecipesForChapter = (chapterId: string) => {
    return filteredRecipes.filter((r) => r.category === chapterId);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E293B] flex flex-col font-sans selection:bg-[#FCE8DC] selection:text-[#C8521A]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        favoritesCount={favorites.length}
        shoppingCount={shoppingList.length}
        reviewsCount={Object.keys(reviews).length}
        onOpenPdf={() => setShowEbookModal(true)}
        onOpenCover={() => setShowCoverModal(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTimer={activeTimer}
        onOpenTimerRecipe={() => {
          if (activeTimer) {
            const r = RECIPES_DATA.find((rec) => rec.id === activeTimer.recipeId);
            if (r) setSelectedRecipe(r);
          }
        }}
      />

      {/* Main Content Area based on Tab */}
      <main className="flex-1">
        {activeTab === 'recipes' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            
            {/* Hero Editorial Banner with Official Book Cover */}
            {!searchQuery && selectedCategory === 'todos' && (
              <div className="relative rounded-3xl overflow-hidden mb-10 bg-white border border-[#E8DFD5] p-6 sm:p-10 shadow-[0_4px_24px_-4px_rgba(45,30,15,0.06)]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                  
                  {/* Left Column: Editorial Presentation */}
                  <div className="lg:col-span-8 space-y-4">
                    {/* Kicker with accent line and dot */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C8521A] mb-1">
                        <span>Air Fryer Secrets</span>
                        <span>•</span>
                        <span>60 Receitas Virais dos EUA</span>
                        <span>•</span>
                        <span className="text-[#0F2942]">100% Adaptado ao Brasil</span>
                      </div>

                      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#0F2942] tracking-tight leading-tight">
                        Acordando a Air Fryer —{' '}
                        <span className="text-[#C8521A]">Pequenos Petiscos com Grandes Sabores</span>
                      </h1>
                    </div>

                    {/* Decorative dot and dividing line (exact book motif) */}
                    <div className="flex items-center gap-2 py-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C8521A] shrink-0" />
                      <div className="h-[1.5px] bg-[#E8DFD5] w-full" />
                    </div>

                    <p className="text-sm sm:text-base text-[#374151] leading-relaxed">
                      Este é o seu ponto de partida. Antes de mergulharmos em pratos complexos e sobremesas elaboradas, construímos confiança na cozinha. Estas 60 receitas foram testadas a dedo para provar, de forma rápida e visualmente impressionante, que sua Air Fryer é capaz de muito mais do que você imagina.
                    </p>

                    {/* 3 Circular Editorial Badges (Exact match to Screenshot 3) */}
                    <div className="grid grid-cols-3 gap-3 py-3 max-w-lg">
                      <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#FAF5EE] border border-[#E9DDCF]">
                        <div className="w-10 h-10 rounded-full border border-[#C8521A] text-[#C8521A] flex items-center justify-center mb-1.5 shadow-xs bg-white">
                          <Clock className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#0F2942]">
                          RÁPIDO E PRÁTICO
                        </span>
                      </div>

                      <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#FAF5EE] border border-[#E9DDCF]">
                        <div className="w-10 h-10 rounded-full border border-[#C8521A] text-[#C8521A] flex items-center justify-center mb-1.5 shadow-xs bg-white">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#0F2942]">
                          ALTO IMPACTO
                        </span>
                      </div>

                      <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#FAF5EE] border border-[#E9DDCF]">
                        <div className="w-10 h-10 rounded-full border border-[#C8521A] text-[#C8521A] flex items-center justify-center mb-1.5 shadow-xs bg-white">
                          <Heart className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#0F2942]">
                          MAIS CONFIANÇA
                        </span>
                      </div>
                    </div>

                    {/* Bottom Banner (Exact match to Screenshot 3 bottom banner) */}
                    <div className="bg-[#FAF3EB] border border-[#ECD9C6] rounded-2xl p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#C8521A] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Lightbulb className="w-5 h-5" />
                      </div>
                      <span className="font-serif font-bold text-sm sm:text-base text-[#8A4A28]">
                        Cada receita é um passo para você dominar sua Air Fryer.
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => setShowEbookModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#0F2942] hover:bg-[#1E3A5A] text-white transition active:scale-95 shadow-md shadow-[#0F2942]/15"
                      >
                        <BookOpen className="w-4 h-4 text-[#E2692D]" />
                        Acessar Livro em PDF
                      </button>

                      <button
                        onClick={() => setShowCoverModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#FAF0E7] hover:bg-[#F5E2D3] text-[#C8521A] border border-[#E9CABE] transition active:scale-95 shadow-xs"
                      >
                        <Sparkles className="w-4 h-4" />
                        Ver Capa Oficial
                      </button>

                      <button
                        onClick={() => setSelectedCategory('contrastes')}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#FAF5EE] hover:bg-[#F2E8DC] text-[#0F2942] border border-[#E5DACD] transition shadow-xs"
                      >
                        <span>Capítulo 2</span>
                        <ArrowRight className="w-4 h-4 text-[#C8521A]" />
                      </button>
                    </div>
                  </div>

                  {/* Right Column: 3D Official Book Cover Showcase */}
                  <div className="lg:col-span-4 flex flex-col items-center">
                    <div 
                      onClick={() => setShowCoverModal(true)}
                      className="group cursor-pointer relative max-w-[260px] sm:max-w-[280px] transition-transform duration-300 hover:-translate-y-1"
                      title="Clique para ampliar a capa oficial"
                    >
                      {/* Ambient background glow */}
                      <div className="absolute inset-0 bg-[#C8521A]/15 rounded-3xl blur-2xl group-hover:bg-[#C8521A]/25 transition duration-300" />

                      {/* Book Cover Container with realistic spine & shadow */}
                      <div className="relative rounded-2xl overflow-hidden shadow-[0_16px_36px_rgba(15,41,66,0.18)] border-2 border-white ring-1 ring-[#DFCDBB] bg-[#1B2430]">
                        <img
                          src="/assets/aistudio/image_f932da62.png"
                          alt="Capa Oficial do Livro Air Fryer Secrets"
                          className="w-full h-auto object-cover block"
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-white text-center backdrop-blur-xs">
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2 shadow-lg">
                            <Sparkles className="w-5 h-5 text-amber-300" />
                          </div>
                          <span className="font-serif font-bold text-sm">Ampliar Capa</span>
                          <span className="text-[11px] text-amber-200">Alta Resolução</span>
                        </div>
                      </div>

                      {/* Badge underneath */}
                      <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-[#0F2942]">
                        <span className="w-2 h-2 rounded-full bg-[#C8521A] animate-pulse" />
                        <span>Capa Oficial do Livro</span>
                        <span className="text-[#94A3B8]">• 60 Receitas</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Chapters Navigation Tabs Ribbon */}
            <div className="space-y-4 mb-8 bg-white border border-[#E8DFD5] rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(45,30,15,0.04)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Flame className="w-5 h-5 text-[#C8521A]" />
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F2942]">Navegar por Capítulos do Livro</h2>
                </div>
                <span className="text-xs text-[#64748B] font-bold">
                  {filteredRecipes.length} receitas visíveis
                </span>
              </div>

              {/* Category Filter Pills (Styled like warm segmented book tabs) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {CHAPTERS_INFO.map((chap) => {
                  const isSelected = selectedCategory === chap.id;

                  return (
                    <button
                      key={chap.id}
                      onClick={() => setSelectedCategory(chap.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                        isSelected
                          ? 'bg-[#0F2942] text-white shadow-md shadow-[#0F2942]/15 scale-[1.01]'
                          : 'bg-[#FAF7F2] hover:bg-[#F2E8DC] text-[#475569] border border-[#E5DACD]'
                      }`}
                    >
                      <span>{chap.title.split(':')[0]}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#EFE6DC] text-[#64748B]'
                      }`}>
                        {chap.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Filters Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-[#F0E8DD] text-xs">
                {/* Max Time Filter */}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C8521A]" />
                  <span className="text-[#64748B] font-bold">Tempo Máximo:</span>
                  <div className="flex items-center gap-1.5">
                    {[
                      { label: 'Todos', val: 0 },
                      { label: 'Até 10 min', val: 10 },
                      { label: 'Até 15 min', val: 15 },
                      { label: 'Até 25 min', val: 25 },
                    ].map((btn) => (
                      <button
                        key={btn.val}
                        onClick={() => setMaxTimeFilter(btn.val)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          maxTimeFilter === btn.val
                            ? 'bg-[#FAF0E7] text-[#C8521A] border border-[#E9D0C1]'
                            : 'text-[#64748B] hover:text-[#0F2942] bg-[#FAF7F2] border border-[#E5DACD]'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-[#64748B]" />
                  <span className="text-[#64748B] font-bold">Ordenar por:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'recommended' | 'time' | 'rating')}
                    className="bg-[#FAF7F2] border border-[#E5DACD] text-[#0F2942] rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-[#C8521A]"
                  >
                    <option value="recommended">Ordem do E-book (1 a 60)</option>
                    <option value="rating">Mais Bem Avaliados</option>
                    <option value="time">Mais Rápidos (Menor Tempo)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SEPARATED CATEGORIES ACCORDING TO E-BOOK CHAPTERS */}
            {selectedCategory === 'todos' && !searchQuery ? (
              <div className="space-y-16">
                {chaptersList.map((chap) => {
                  const chapterRecipes = getRecipesForChapter(chap.id);
                  if (chapterRecipes.length === 0) return null;

                  return (
                    <section key={chap.id} className="space-y-6">
                      {/* Chapter Title & Description Card (Styled like Book Opener) */}
                      <div className="bg-white border border-[#E8DFD5] rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(45,30,15,0.06)] relative overflow-hidden">
                        <div className="relative z-10 max-w-4xl space-y-3">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#0F2942] text-white shadow-xs">
                              {chap.badge}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FAF0E7] text-[#C8521A] border border-[#E9D0C1]">
                              {chap.recipeRange}
                            </span>
                          </div>

                          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0F2942] tracking-tight leading-snug">
                            {chap.title}
                          </h2>

                          <p className="text-sm sm:text-base text-[#374151] leading-relaxed">
                            {chap.desc}
                          </p>

                          {/* Highlight Tip */}
                          <div className="mt-4 pt-4 border-t border-[#F0E8DD] flex items-center gap-2.5 text-xs text-[#8A4A28] font-bold">
                            <Lightbulb className="w-4 h-4 text-[#C8521A] shrink-0" />
                            <span>{chap.highlightTip}</span>
                          </div>
                        </div>
                      </div>

                      {/* Chapter Grid of 10 Recipes */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {chapterRecipes.map((recipe) => (
                          <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            isFavorite={favorites.includes(recipe.id)}
                            onToggleFavorite={toggleFavorite}
                            onOpenDetails={setSelectedRecipe}
                            onAddAllToShoppingList={handleAddAllToShoppingList}
                            onStartTimer={handleStartTimer}
                            onShare={setShareRecipe}
                            userRating={reviews[recipe.id]?.rating}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              /* Specific Category view or Search Results */
              <div className="space-y-6">
                {/* Category Header banner if single category selected and no search */}
                {!searchQuery && selectedCategory !== 'todos' && (() => {
                  const curChap = CHAPTERS_INFO.find((c) => c.id === selectedCategory);
                  if (!curChap) return null;
                  return (
                    <div className="bg-white border border-[#E8DFD5] rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(45,30,15,0.06)] mb-6">
                      <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#0F2942] text-white shadow-xs">
                          {curChap.badge}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FAF0E7] text-[#C8521A] border border-[#E9D0C1]">
                          {curChap.recipeRange}
                        </span>
                      </div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0F2942]">
                        {curChap.title}
                      </h2>
                      <p className="text-sm sm:text-base text-[#374151] mt-2 max-w-3xl leading-relaxed">
                        {curChap.desc}
                      </p>
                      <div className="mt-4 pt-3.5 border-t border-[#F0E8DD] flex items-center gap-2 text-xs text-[#8A4A28] font-bold">
                        <Lightbulb className="w-4 h-4 text-[#C8521A] shrink-0" />
                        <span>{curChap.highlightTip}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Filtered Grid */}
                {filteredRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRecipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        isFavorite={favorites.includes(recipe.id)}
                        onToggleFavorite={toggleFavorite}
                        onOpenDetails={setSelectedRecipe}
                        onAddAllToShoppingList={handleAddAllToShoppingList}
                        onStartTimer={handleStartTimer}
                        onShare={setShareRecipe}
                        userRating={reviews[recipe.id]?.rating}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-3xl border border-[#E8DFD5] max-w-xl mx-auto shadow-sm">
                    <p className="font-serif text-[#0F2942] font-bold text-xl mb-1">Nenhuma receita encontrada</p>
                    <p className="text-xs text-[#64748B] mb-6">
                      Tente alterar seus termos de busca ou remover os filtros de tempo aplicados.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('todos');
                        setMaxTimeFilter(0);
                      }}
                      className="px-5 py-2.5 bg-[#0F2942] hover:bg-[#1E3A5A] text-white rounded-xl text-xs font-bold transition shadow-xs"
                    >
                      Limpar Todos os Filtros
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <FavoritesView
            favoriteRecipes={favoriteRecipes}
            onToggleFavorite={toggleFavorite}
            onOpenDetails={setSelectedRecipe}
            onAddAllToShoppingList={handleAddAllToShoppingList}
            onAddMultipleToShoppingList={handleAddMultipleToShoppingList}
            onStartTimer={handleStartTimer}
            onShare={setShareRecipe}
            reviews={reviews}
            onExploreRecipes={() => setActiveTab('recipes')}
          />
        )}

        {activeTab === 'shopping' && (
          <ShoppingListView
            items={shoppingList}
            onToggleItem={handleToggleShoppingItem}
            onDeleteItem={handleDeleteShoppingItem}
            onClearCompleted={handleClearCompletedShopping}
            onClearAll={handleClearAllShopping}
            onAddItem={handleAddCustomShoppingItem}
            onExploreRecipes={() => setActiveTab('recipes')}
          />
        )}

        {activeTab === 'reviews' && (
          <ReviewsView
            reviews={reviews}
            recipes={RECIPES_DATA}
            onOpenRecipe={setSelectedRecipe}
            onExploreRecipes={() => setActiveTab('recipes')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#E8DFD5] bg-white py-8 text-center text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#C8521A]" />
            <span className="font-serif font-bold text-[#0F2942]">Air Fryer Secrets</span>
            <span>—</span>
            <span>60 Receitas Virais dos EUA</span>
          </div>
          <p>© {new Date().getFullYear()} Guia Culinário Oficial Adaptado ao Brasil. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          isFavorite={favorites.includes(selectedRecipe.id)}
          userReview={reviews[selectedRecipe.id]}
          onToggleFavorite={toggleFavorite}
          onSaveReview={handleSaveReview}
          onAddSelectedToShoppingList={handleAddSelectedToShoppingList}
          onStartTimer={handleStartTimer}
          onShare={setShareRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* Social Share Modal */}
      {shareRecipe && (
        <SocialShareModal
          recipe={shareRecipe}
          onClose={() => setShareRecipe(null)}
        />
      )}

      {/* Original PDF Reader / Download Modal */}
      {showEbookModal && (
        <EbookPdfViewerModal
          onClose={() => setShowEbookModal(false)}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            setActiveTab('recipes');
          }}
        />
      )}

      {/* Official Book Cover Lightbox Modal */}
      {showCoverModal && (
        <CoverLightboxModal
          onClose={() => setShowCoverModal(false)}
          onOpenPdf={() => setShowEbookModal(true)}
        />
      )}

      {/* Active Floating Integrated Timer */}
      <IntegratedTimer
        timer={activeTimer}
        onUpdateRemaining={(remaining) =>
          setActiveTimer((prev) => (prev ? { ...prev, remainingSeconds: remaining } : null))
        }
        onTogglePlay={() =>
          setActiveTimer((prev) => (prev ? { ...prev, isRunning: !prev.isRunning } : null))
        }
        onAddMinute={() =>
          setActiveTimer((prev) =>
            prev
              ? {
                  ...prev,
                  remainingSeconds: prev.remainingSeconds + 60,
                  totalSeconds: prev.totalSeconds + 60,
                }
              : null
          )
        }
        onReset={() =>
          setActiveTimer((prev) =>
            prev ? { ...prev, remainingSeconds: prev.totalSeconds, isRunning: true } : null
          )
        }
        onClose={() => setActiveTimer(null)}
        onSelectRecipe={(recipeId) => {
          const r = RECIPES_DATA.find((item) => item.id === recipeId);
          if (r) setSelectedRecipe(r);
        }}
      />
    </div>
  );
}
