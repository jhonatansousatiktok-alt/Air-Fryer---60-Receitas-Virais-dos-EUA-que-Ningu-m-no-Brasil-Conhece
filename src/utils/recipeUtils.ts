import { Recipe } from '../types/recipe';

/**
 * Categorize ingredient into common supermarket aisles
 */
export function categorizeIngredient(text: string): string {
  const lower = text.toLowerCase();
  
  if (
    lower.includes('queijo') ||
    lower.includes('mussarela') ||
    lower.includes('muçarela') ||
    lower.includes('catupiry') ||
    lower.includes('requeijão') ||
    lower.includes('cream cheese') ||
    lower.includes('leite') ||
    lower.includes('manteiga') ||
    lower.includes('parmesão') ||
    lower.includes('coalho') ||
    lower.includes('cheddar') ||
    lower.includes('iogurte') ||
    lower.includes('creme de leite') ||
    lower.includes('ricota') ||
    lower.includes('gema') ||
    lower.includes('clara') ||
    lower.includes('ovo')
  ) {
    return 'Laticínios & Ovos';
  }

  if (
    lower.includes('carne') ||
    lower.includes('frango') ||
    lower.includes('bacon') ||
    lower.includes('presunto') ||
    lower.includes('salsicha') ||
    lower.includes('linguiça') ||
    lower.includes('camarão') ||
    lower.includes('peixe') ||
    lower.includes('tilápia') ||
    lower.includes('pescada') ||
    lower.includes('patinho') ||
    lower.includes('acém') ||
    lower.includes('fraldinha')
  ) {
    return 'Carnes & Pescados';
  }

  if (
    lower.includes('batata') ||
    lower.includes('cebola') ||
    lower.includes('tomate') ||
    lower.includes('alho') ||
    lower.includes('abobrinha') ||
    lower.includes('limão') ||
    lower.includes('maçã') ||
    lower.includes('abacaxi') ||
    lower.includes('banana') ||
    lower.includes('mandioca') ||
    lower.includes('aipim') ||
    lower.includes('pimentão') ||
    lower.includes('pimenta') ||
    lower.includes('salsinha') ||
    lower.includes('coentro') ||
    lower.includes('alecrim') ||
    lower.includes('manjericão') ||
    lower.includes('repolho') ||
    lower.includes('alface') ||
    lower.includes('abacate')
  ) {
    return 'Hortifrúti';
  }

  if (
    lower.includes('farinha') ||
    lower.includes('fubá') ||
    lower.includes('panko') ||
    lower.includes('amido') ||
    lower.includes('maizena') ||
    lower.includes('açúcar') ||
    lower.includes('macarrão') ||
    lower.includes('pão') ||
    lower.includes('tortilha') ||
    lower.includes('chips') ||
    lower.includes('grão-de-bico') ||
    lower.includes('feijão') ||
    lower.includes('arroz') ||
    lower.includes('massa') ||
    lower.includes('croissant') ||
    lower.includes('bolacha') ||
    lower.includes('fermento') ||
    lower.includes('bicarbonato') ||
    lower.includes('papel de arroz')
  ) {
    return 'Mercearia & Farinhas';
  }

  if (
    lower.includes('azeite') ||
    lower.includes('óleo') ||
    lower.includes('sal') ||
    lower.includes('páprica') ||
    lower.includes('orégano') ||
    lower.includes('cominho') ||
    lower.includes('shoyu') ||
    lower.includes('mostarda') ||
    lower.includes('ketchup') ||
    lower.includes('maionese') ||
    lower.includes('molho') ||
    lower.includes('baunilha') ||
    lower.includes('canela') ||
    lower.includes('mel') ||
    lower.includes('urucum') ||
    lower.includes('colorau') ||
    lower.includes('picles') ||
    lower.includes('gergelim')
  ) {
    return 'Temperos & Molhos';
  }

  return 'Outros Ingredientes';
}

/**
 * Scale ingredient portion quantity
 */
export function scaleIngredient(ingredientStr: string, baseServings: number, newServings: number): string {
  if (baseServings <= 0 || newServings <= 0 || baseServings === newServings) {
    return ingredientStr;
  }
  const ratio = newServings / baseServings;

  // Match fraction like 1/2, 1/4, 3/4
  const fractionMatch = ingredientStr.match(/^(\d+)\/(\d+)\s*(.*)$/);
  if (fractionMatch) {
    const num = parseFloat(fractionMatch[1]);
    const den = parseFloat(fractionMatch[2]);
    const newQty = (num / den) * ratio;
    const formatted = formatNumber(newQty);
    return `${formatted} ${fractionMatch[3]}`.trim();
  }

  // Match leading integer or decimal with units e.g. "200g", "2 colheres", "1.5 kg"
  const qtyMatch = ingredientStr.match(/^(\d+(?:[.,]\d+)?)\s*(g|kg|ml|l|xícaras?|colheres?|fatias?|dentes?|unidades?|pacote[s]?|discos?|cubos?|ovos?|latas?|gotas?|tiras?)?\s*(.*)$/i);
  if (qtyMatch) {
    const rawVal = parseFloat(qtyMatch[1].replace(',', '.'));
    const unit = qtyMatch[2] || '';
    const rest = qtyMatch[3] || '';
    const newQty = rawVal * ratio;
    const formatted = formatNumber(newQty);
    return `${formatted}${unit ? (unit.match(/^[a-z]+$/i) && unit.length <= 2 ? unit : ' ' + unit) : ''} ${rest}`.replace(/\s+/g, ' ').trim();
  }

  return ingredientStr;
}

function formatNumber(num: number): string {
  if (Math.abs(num - 0.25) < 0.05) return '1/4';
  if (Math.abs(num - 0.33) < 0.05) return '1/3';
  if (Math.abs(num - 0.5) < 0.05) return '1/2';
  if (Math.abs(num - 0.75) < 0.05) return '3/4';
  if (Math.abs(num - 1.5) < 0.05) return '1 1/2';
  if (Math.abs(num - 2.5) < 0.05) return '2 1/2';
  
  if (num % 1 === 0) {
    return num.toString();
  }
  return num.toFixed(1).replace(/\.0$/, '');
}

/**
 * Format timer seconds into MM:SS
 */
export function formatTimerDisplay(seconds: number): string {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export interface FilterRecipesOptions {
  query?: string;
  search?: string;
  category?: string;
  maxTime?: number;
  sortBy?: 'recommended' | 'time' | 'rating';
}

/**
 * Filter and search recipes
 */
export function filterRecipes(
  recipes: Recipe[],
  queryOrOptions: string | FilterRecipesOptions,
  categoryArg?: string,
  maxTimeArg?: number,
  sortByArg: 'recommended' | 'time' | 'rating' = 'recommended'
): Recipe[] {
  let query = '';
  let category = 'todos';
  let maxTime: number | undefined = undefined;
  let sortBy: 'recommended' | 'time' | 'rating' = 'recommended';

  if (typeof queryOrOptions === 'object' && queryOrOptions !== null) {
    query = queryOrOptions.query || queryOrOptions.search || '';
    category = queryOrOptions.category || 'todos';
    maxTime = queryOrOptions.maxTime;
    sortBy = queryOrOptions.sortBy || 'recommended';
  } else {
    query = typeof queryOrOptions === 'string' ? queryOrOptions : '';
    category = categoryArg || 'todos';
    maxTime = maxTimeArg;
    sortBy = sortByArg || 'recommended';
  }

  let filtered = [...recipes];

  if (category && category !== 'todos') {
    filtered = filtered.filter((r) => r.category === category);
  }

  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)) ||
        r.ingredients.some((ing) => ing.toLowerCase().includes(q)) ||
        r.chefTip.toLowerCase().includes(q)
    );
  }

  if (maxTime && maxTime > 0) {
    filtered = filtered.filter((r) => r.airFryerTimeMinutes <= maxTime);
  }

  if (sortBy === 'time') {
    filtered.sort((a, b) => a.airFryerTimeMinutes - b.airFryerTimeMinutes);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.defaultRating - a.defaultRating);
  } else {
    // Default by id
    filtered.sort((a, b) => a.id - b.id);
  }

  return filtered;
}

/**
 * Play a culinary chime sound using Web Audio API safely
 */
export function playChimeSound(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 chime chord
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.12);

      gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.12);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + index * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.12 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.12);
      osc.stop(ctx.currentTime + index * 0.12 + 0.85);
    });
  } catch (err) {
    console.warn('Audio chime notice:', err);
  }
}
