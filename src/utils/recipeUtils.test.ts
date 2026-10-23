import test from 'node:test';
import assert from 'node:assert/strict';
import {
  categorizeIngredient,
  scaleIngredient,
  formatTimerDisplay,
  filterRecipes,
} from './recipeUtils';
import { Recipe } from '../types/recipe';

test('categorizeIngredient correctly classifies items into supermarket aisles', () => {
  assert.equal(categorizeIngredient('200g de queijo mussarela ralado'), 'Laticínios & Ovos');
  assert.equal(categorizeIngredient('500g de peito de frango cortado'), 'Carnes & Pescados');
  assert.equal(categorizeIngredient('4 batatas inglesas grandes'), 'Hortifrúti');
  assert.equal(categorizeIngredient('1 xícara de farinha de trigo'), 'Mercearia & Farinhas');
  assert.equal(categorizeIngredient('2 colheres (sopa) de azeite de oliva'), 'Temperos & Molhos');
});

test('scaleIngredient scales proportions accurately', () => {
  // Scaling 4 servings to 8 servings (factor 2)
  assert.equal(scaleIngredient('200g de macarrão tipo penne', 4, 8), '400g de macarrão tipo penne');
  assert.equal(scaleIngredient('2 colheres (sopa) de azeite', 4, 8), '4 colheres (sopa) de azeite');
  // Scaling fractions: 1/2 xícara for 4 servings to 2 servings (factor 0.5)
  assert.equal(scaleIngredient('1/2 xícara de farinha', 4, 2), '1/4 xícara de farinha');
  // Identity when base equals new
  assert.equal(scaleIngredient('100g de queijo', 4, 4), '100g de queijo');
});

test('formatTimerDisplay formats seconds into MM:SS correctly', () => {
  assert.equal(formatTimerDisplay(0), '00:00');
  assert.equal(formatTimerDisplay(45), '00:45');
  assert.equal(formatTimerDisplay(180), '03:00');
  assert.equal(formatTimerDisplay(615), '10:15');
});

test('filterRecipes filters by category, query and max time', () => {
  const dummyRecipes: Recipe[] = [
    {
      id: 1,
      chapter: 1,
      chapterTitle: 'Petiscos',
      category: 'petiscos',
      title: 'Pasta Chips',
      subtitle: 'O Snack Viciante',
      image: 'https://example.com/pasta.jpg',
      prepTime: '15 min',
      prepTimeMinutes: 15,
      airFryerTime: '10-12 min',
      airFryerTimeMinutes: 11,
      temperature: 190,
      servings: 4,
      servingsUnit: 'porções',
      ingredients: ['200g de macarrão', 'azeite', 'páprica'],
      steps: ['Misture o macarrão', 'Asse na airfryer'],
      chefTip: 'Não sobrecarregue a cesta',
      difficulty: 'Fácil',
      tags: ['Snack', 'Crocante'],
      defaultRating: 4.8,
      ratingCount: 38,
    },
    {
      id: 31,
      chapter: 4,
      chapterTitle: 'Sobremesas',
      category: 'sobremesas',
      title: 'Cheesecake Basco',
      subtitle: 'A sobremesa mais fotografada',
      image: 'https://example.com/cheesecake.jpg',
      prepTime: '10 min',
      prepTimeMinutes: 10,
      airFryerTime: '15-18 min',
      airFryerTimeMinutes: 16,
      temperature: 200,
      servings: 4,
      servingsUnit: 'porções',
      ingredients: ['300g cream cheese', 'açúcar', 'ovos'],
      steps: ['Bata os ovos', 'Asse até dourar'],
      chefTip: 'O queimado dá o sabor característico',
      difficulty: 'Médio',
      tags: ['Doce', 'Cremoso'],
      defaultRating: 4.9,
      ratingCount: 52,
    },
  ];

  const searchResult = filterRecipes(dummyRecipes, 'chips', 'todos');
  assert.equal(searchResult.length, 1);
  assert.equal(searchResult[0].title, 'Pasta Chips');

  const catResult = filterRecipes(dummyRecipes, '', 'sobremesas');
  assert.equal(catResult.length, 1);
  assert.equal(catResult[0].title, 'Cheesecake Basco');

  const timeResult = filterRecipes(dummyRecipes, '', 'todos', 12);
  assert.equal(timeResult.length, 1);
  assert.equal(timeResult[0].title, 'Pasta Chips');
});
