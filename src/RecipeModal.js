import React from 'react';

function RecipeModal({ recipe, onClose, allRecipes }) {
  const computeSimilarity = (recipe1, recipe2) => {
    const ingredients1 = recipe1.ingredients.split(',').map(ingredient => ingredient.trim().toLowerCase());
    const ingredients2 = recipe2.ingredients.split(',').map(ingredient => ingredient.trim().toLowerCase());
    const sharedIngredients = ingredients1.filter(ingredient => ingredients2.includes(ingredient));
    const ingredientSimilarity = (sharedIngredients.length / Math.max(ingredients1.length, ingredients2.length)) * 100;

    const skillLevels = ["Easy", "More Effort", "A Challenge"];
    const skillLevelDifference = Math.abs(skillLevels.indexOf(recipe1.recipeSkillLevel) - skillLevels.indexOf(recipe2.recipeSkillLevel));
    const skillSimilarity = (1 - (skillLevelDifference / (skillLevels.length - 1))) * 100;

    const totalSimilarity = (ingredientSimilarity * 0.7) + (skillSimilarity * 0.3);
    return totalSimilarity;
  };

  const similarRecipes = allRecipes
    .filter(r => r.name !== recipe.name)
    .map(r => ({
      ...r,
      similarity: computeSimilarity(recipe, r)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{recipe.name}</h2>
        <p>Description: {recipe.description}</p>
        <p>Cooking Time: {recipe.cookingTime}</p>
        <p>Preparation Time: {recipe.preparationTime}</p>
        <p>Ingredients: {recipe.ingredients}</p>
        <p>Collections: {recipe.collections}</p>
        <p>Keywords: {recipe.keywords}</p>
        <p>DietTypes: {recipe.DietTypes}</p>
        <h3>Similar Recipes:</h3>
        <ul>
          {similarRecipes.map((simRecipe, index) => (
            <li key={index}>
              {simRecipe.name} - Similarity: {simRecipe.similarity.toFixed(2)}%
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RecipeModal;
