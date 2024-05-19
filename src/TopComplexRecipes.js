import React, { useEffect, useState } from 'react';

function TopComplexRecipes({ allRecipes }) {
  const [topComplexRecipes, setTopComplexRecipes] = useState([]);

  useEffect(() => {
    const sortedComplexRecipes = [...allRecipes]
      .sort((a, b) => {
        const difficultyOrder = {
          "easy": 0,
          "more effort": 1,
          "a challenge": 2
        };
        const difficultyA = difficultyOrder[a.recipeSkillLevel.toLowerCase()] || 0;
        const difficultyB = difficultyOrder[b.recipeSkillLevel.toLowerCase()] || 0;

        return difficultyB - difficultyA;
      })
      .slice(0, 5);

    setTopComplexRecipes(sortedComplexRecipes);
  }, [allRecipes]);

  return (
    <div>
      <h3>Top Complex Recipes</h3>
      <ul>
        {topComplexRecipes.map((recipe, index) => (
          <li key={index}>{recipe.name} - {recipe.recipeSkillLevel}</li>
        ))}
      </ul>
    </div>
  );
}

export default TopComplexRecipes;
