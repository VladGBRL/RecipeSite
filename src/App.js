import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './App.css';
import RecipeModal from './RecipeModal';
import Recipes from './Recipes';
import TopIngredients from './TopIngredients';
import TopAuthors from './TopAuthors';
import TopComplexRecipes from './TopComplexRecipes';

function App() {
  const [allRecipes, setAllRecipes] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchByName, setSearchByName] = useState('');
  const [recipesPerPage] = useState(20);
  const [searchByIngredients, setSearchByIngredients] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [showingAuthorRecipes, setShowingAuthorRecipes] = useState(false);
  const [sortValue, setSortValue] = useState('');
  const [loading, setLoading] = useState(true);

  const sortOptions = ["numIngredients", "recipeSkillLevel"];

  const matchIngredients = (recipeIngredients, searchIngredients) => {
    const searchArray = searchIngredients.split(',').map(ingredient => ingredient.trim());
    const recipeArray = recipeIngredients.split(',').map(ingredient => ingredient.trim());
    return searchArray.every(searchItem => recipeArray.some(recipeItem => recipeItem.includes(searchItem)));
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = () => {
    axios.get("http://localhost:5000/recipes")
      .then(response => {
        setAllRecipes(response.data.recipes);
        setRecipes(response.data.recipes);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching recipes:', error));
  };

  useEffect(() => {
    if (sortValue) {
      const sortedRecipes = [...allRecipes].sort((a, b) => {
        if (sortValue === 'numIngredients') {
          return a.numIngredients - b.numIngredients;
        } else if (sortValue === 'recipeSkillLevel') {
          const difficultyOrder = {
            "easy": 0,
            "more effort": 1,
            "a challenge": 2
          };

          const difficultyA = difficultyOrder[a.recipeSkillLevel.toLowerCase()] || 0;
          const difficultyB = difficultyOrder[b.recipeSkillLevel.toLowerCase()] || 0;

          return difficultyA - difficultyB;
        }

        return 0;
      });
      setRecipes(sortedRecipes);
    } else {
      setRecipes(allRecipes);
    }
  }, [sortValue, allRecipes]);

  const showAllRecipes = () => {
    setShowingAuthorRecipes(false);
    setRecipes(allRecipes);
  };

  const showAuthorRecipes = (author) => {
    const authorRecipes = allRecipes.filter(recipe => recipe.author === author);
    setRecipes(authorRecipes);
    setShowingAuthorRecipes(true);
  };


  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
  };

  const handleSort = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "Please Select Value") {
      setRecipes([]);
      setSortValue('');
    } else {
      setSortValue(selectedValue);
    }
  };

  return (
    <div className="App">
      <div className="search-container">
        <img src="/cooking.png" alt="Cooking Icon" className="icon" />
        <input
          type="text"
          placeholder="Search by recipe name..."
          value={searchByName}
          onChange={(e) => setSearchByName(e.target.value)}
        />
        {!isFilterVisible && (
          <button onClick={() => setIsFilterVisible(true)}>Show Filters</button>
        )}
        {isFilterVisible && (
          <div className="filter-container">
            <div className="filter-elements">
              <input
                type="text"
                placeholder="Search ingredients (comma-separated)..."
                value={searchByIngredients}
                onChange={(e) => setSearchByIngredients(e.target.value)}
              />
              <div className="select-reset-container">
                <select
                  className="custom-select"
                  onChange={handleSort}
                  value={sortValue}
                >
                  <option>Please Select Value</option>
                  {sortOptions.map((item, index) => (
                    <option value={item} key={index}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button onClick={() => setIsFilterVisible(false)}>Hide Filters</button>
          </div>
        )}
      </div>

      <Recipes
        recipes={recipes}
        loading={loading}
        currentPage={currentPage}
        recipesPerPage={recipesPerPage}
        openModal={openModal}
        showAuthorRecipes={showAuthorRecipes}
        setIsFilterVisible={setIsFilterVisible}
        searchByName={searchByName}
        setSearchByName={setSearchByName}
        searchByIngredients={searchByIngredients}
        matchIngredients={matchIngredients}
      />
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button onClick={nextPage} disabled={recipes.length <= recipesPerPage * currentPage}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
        {showingAuthorRecipes && (
          <button onClick={showAllRecipes}>Back to All Recipes</button>
        )}
      </div>
      <div className="top-sections">
        <div className="top-section">
          <TopIngredients allRecipes={allRecipes} />
        </div>
        <div className="top-section">
          <TopAuthors allRecipes={allRecipes} />
        </div>
        <div className="top-section">
          <TopComplexRecipes allRecipes={allRecipes} />
        </div>
      </div>
      {showingAuthorRecipes && (
        <button onClick={showAllRecipes}>Back to All Recipes</button>
      )}
      {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={closeModal} allRecipes={allRecipes} />}
    </div>
  );
}

export default App;
