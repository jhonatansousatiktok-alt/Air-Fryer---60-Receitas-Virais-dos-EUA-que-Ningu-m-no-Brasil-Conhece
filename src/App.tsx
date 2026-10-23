/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flame, Heart, ShoppingBag, Star, BookOpen, Clock, 
  Sparkles, Filter, ChevronDown, Check, ArrowRight, Share2, Timer,
  ChefHat, Lightbulb, Compass, Award
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

  // Persistent States
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [1, 11, 21, 31, 41, 51]; // Initial favorites
    } catch {
      return [1, 11, 21, 31, 41, 51];
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
    setShoppingList([]);
  };

  const handleAddCustomShoppingItem = (text: string) => {
    const newItem: ShoppingItem = {
      id: `custom-${Date.now()}`,
      text,
      category: categorizeIngredient(text),
      checked: false,
      addedAt: Date.now(),
    };
    setShoppingList((prev) => [newItem, ...prev]);
  };

  const handleStartTimer = (recipe: Recipe, minutes: number, label: string) => {
    const totalSecs = minutes * 60;
    setActiveTimer({
      id: `timer-${Date.now()}`,
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      label,
      totalSeconds: totalSecs,
      remainingSeconds: totalSecs,
      isRunning: true,
    });
  };

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return filterRecipes(RECIPES_DATA, searchQuery, selectedCategory, maxTimeFilter, sortBy);
  }, [searchQuery, selectedCategory, maxTimeFilter, sortBy]);

  const favoriteRecipes = useMemo(() => {
    return RECIPES_DATA.filter((r) => favorites.includes(r.id));
  }, [favorites]);

  // Group recipes by chapter for structured section view
  const chaptersList = useMemo(() => {
    return CHAPTERS_INFO.filter((c) => c.id !== 'todos');
  }, []);

  const getRecipesForChapter = (chapterId: string) => {
    return filteredRecipes.filter((r) => r.category === chapterId);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        favoritesCount={favorites.length}
        shoppingCount={shoppingList.length}
        reviewsCount={Object.keys(reviews).length}
        onOpenPdf={() => setShowEbookModal(true)}
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
            {/* Hero Banner when no search and on 'todos' */}
            {!searchQuery && selectedCategory === 'todos' && (
              <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-neutral-900 via-amber-950/40 to-neutral-900 border border-neutral-800 p-6 sm:p-10 shadow-2xl">
                <div className="max-w-2xl relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    60 Receitas Virais dos EUA Adaptadas ao Brasil
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                    Domine os 90% Secretos da Sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">Air Fryer</span>
                  </h1>
                  <p className="text-sm sm:text-base text-neutral-300 mt-3 leading-relaxed">
                    Livro interativo organizado pelos 6 capítulos oficiais do e-book: fotos reais de cada prato, lista de compras inteligente por corredor, cronômetro automático e truques de chefs renomados.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-6">
                    <button
                      onClick={() => setShowEbookModal(true)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 hover:bg-amber-400 text-neutral-950 transition active:scale-95 shadow-lg shadow-amber-500/20"
                    >
                      <BookOpen className="w-4 h-4" />
                      Acessar E-book em PDF
                    </button>

                    <button
                      onClick={() => setSelectedCategory('contrastes')}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-neutral-850 hover:bg-neutral-800 text-neutral-200 border border-neutral-750 transition"
                    >
                      <span>Capítulo 2: Contrastes & Texturas</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>
                </div>

                <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden md:block bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/30 to-transparent" />
              </div>
            )}

            {/* Chapters Navigation Tabs Ribbon */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-bold text-white">Navegar por Capítulos do Livro</h2>
                </div>
                <span className="text-xs text-neutral-400 font-medium">
                  {filteredRecipes.length} receitas visíveis
                </span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {CHAPTERS_INFO.map((chap) => {
                  const isSelected = selectedCategory === chap.id;

                  return (
                    <button
                      key={chap.id}
                      onClick={() => setSelectedCategory(chap.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                        isSelected
                          ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20 scale-[1.02]'
                          : 'bg-neutral-900 hover:bg-neutral-850 text-neutral-300 border border-neutral-800'
                      }`}
                    >
                      <span>{chap.title.split(':')[0]}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                        isSelected ? 'bg-neutral-950/20 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {chap.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Filters Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-850 text-xs">
                {/* Max Time Filter */}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span className="text-neutral-400 font-medium">Tempo Máximo:</span>
                  <div className="flex items-center gap-1">
                    {[
                      { label: 'Todos', val: 0 },
                      { label: 'Até 10 min', val: 10 },
                      { label: 'Até 15 min', val: 15 },
                      { label: 'Até 25 min', val: 25 },
                    ].map((btn) => (
                      <button
                        key={btn.val}
                        onClick={() => setMaxTimeFilter(btn.val)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          maxTimeFilter === btn.val
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                            : 'text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-neutral-400 font-medium">Ordenar por:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'recommended' | 'time' | 'rating')}
                    className="bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-amber-500"
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
                      {/* Chapter Title & Description Card */}
                      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-850 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                        <div className="relative z-10 max-w-4xl">
                          <div className="flex flex-wrap items-center gap-2.5 mb-3">
                            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-500 text-neutral-950">
                              {chap.badge}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-amber-300 border border-neutral-700">
                              {chap.recipeRange}
                            </span>
                          </div>

                          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                            {chap.title}
                          </h2>

                          <p className="text-sm sm:text-base text-neutral-300 mt-2.5 leading-relaxed">
                            {chap.desc}
                          </p>

                          <div className="mt-4 pt-4 border-t border-neutral-800/80 flex items-center gap-2 text-xs text-amber-300/90 font-medium">
                            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>{chap.highlightTip}</span>
                          </div>
                        </div>

                        <div className="absolute right-0 bottom-0 top-0 w-1/4 opacity-10 bg-contain bg-no-repeat bg-right pointer-events-none" style={{ backgroundImage: `url(${chap.coverImage})` }} />
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
                    <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-850 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl mb-6">
                      <div className="flex flex-wrap items-center gap-2.5 mb-2">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-500 text-neutral-950">
                          {curChap.badge}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-amber-300 border border-neutral-700">
                          {curChap.recipeRange}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white">
                        {curChap.title}
                      </h2>
                      <p className="text-sm text-neutral-300 mt-2 max-w-3xl leading-relaxed">
                        {curChap.desc}
                      </p>
                      <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center gap-2 text-xs text-amber-300 font-medium">
                        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
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
                  <div className="text-center py-16 bg-neutral-900/50 rounded-3xl border border-neutral-800 max-w-xl mx-auto">
                    <p className="text-neutral-300 font-bold text-lg mb-1">Nenhuma receita encontrada</p>
                    <p className="text-xs text-neutral-500 mb-6">
                      Tente alterar seus termos de busca ou remover os filtros de tempo aplicados.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('todos');
                        setMaxTimeFilter(0);
                      }}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold transition"
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
