import React from 'react';

function Recipes({ recipes, loading, currentPage, recipesPerPage, openModal, showAuthorRecipes, setIsFilterVisible, searchByName, setSearchByName, matchIngredients, searchByIngredients }) {
  if (loading) {
    return <p>Loading...</p>;
  }

  // Filter recipes based on search input values
  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchByName.toLowerCase()) &&
    matchIngredients(recipe.ingredients.toLowerCase(), searchByIngredients.toLowerCase())
  );

  // Pagination
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  return (
    <div>
      <h1>Recipe Table</h1>
      <table className="table mb-4">
        <thead>
          <tr>
            <th scope="col">Recipe Name</th>
            <th scope="col" onClick={() => setIsFilterVisible(false)}>Author</th>
            <th scope="col">Number of Ingredients</th>
            <th scope="col">Skill Level</th>
          </tr>
        </thead>
        <tbody>
          {currentRecipes.map((recipe, index) => (
            <tr key={index}>
              <td onClick={() => openModal(recipe)} style={{ cursor: 'pointer' }}>{recipe.name}</td>
              <td onClick={() => showAuthorRecipes(recipe.author)} style={{ cursor: 'pointer' }}>{recipe.author}</td>
              <td>{recipe.numIngredients}</td>
              <td>{recipe.recipeSkillLevel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Recipes;
