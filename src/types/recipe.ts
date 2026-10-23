export interface Ingredient {
  raw: string;
  name: string;
  amount?: number;
  unit?: string;
  category?: string;
}

export interface Recipe {
  id: number;
  chapter: number;
  chapterTitle: string;
  category: 'petiscos' | 'contrastes' | 'fusao' | 'sobremesas' | 'fastfood' | 'reaquecimento';
  title: string;
  subtitle: string;
  image: string;
  prepTime: string;
  prepTimeMinutes: number;
  airFryerTime: string;
  airFryerTimeMinutes: number;
  temperature: number; // in °C
  servings: number;
  servingsUnit: string;
  ingredients: string[];
  steps: string[];
  chefTip: string;
  difficulty: 'Fácil' | 'Médio' | 'Avançado';
  tags: string[];
  defaultRating: number;
  ratingCount: number;
}

export interface UserReview {
  recipeId: number;
  rating: number;
  notes: string;
  updatedAt: string;
}

export interface ShoppingItem {
  id: string;
  recipeId?: number;
  recipeTitle?: string;
  text: string;
  category: string;
  checked: boolean;
  addedAt: number;
}

export interface ActiveTimer {
  id: string;
  recipeId: number;
  recipeTitle: string;
  label: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
}
