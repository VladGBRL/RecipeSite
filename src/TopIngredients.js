import React, { useEffect, useState } from 'react';

function TopIngredients({ allRecipes }) {
  const [topIngredients, setTopIngredients] = useState([]);

  useEffect(() => {
    const ingredientCounts = {};

    allRecipes.forEach(recipe => {
      recipe.ingredients.split(',').forEach(ingredient => {
        const trimmedIngredient = ingredient.trim().toLowerCase();
        ingredientCounts[trimmedIngredient] = (ingredientCounts[trimmedIngredient] || 0) + 1;
      });
    });

    const sortedIngredients = Object.entries(ingredientCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([ingredient]) => ingredient);

    setTopIngredients(sortedIngredients);
  }, [allRecipes]);

  return (
    <div>
      <h3>Top Ingredients</h3>
      <ul>
        {topIngredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
    </div>
  );
}

export default TopIngredients;
