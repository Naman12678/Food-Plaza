import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import RecipeCard from './RecipeCard';

const RecipeSearch = () => {
  const APP_ID = import.meta.env.VITE_APP_ID;
  const APP_KEY = import.meta.env.VITE_APP_KEY;
  const [recipes, setRecipes] = useState([]);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    if (query) {
      getRecipes();
    }
  }, [query]);

  const getRecipes = async () => {
    const response = await fetch(
      `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`
    );
    const data = await response.json();
    setRecipes(data.hits);
  };

  return (
    <div className="recipe-search-page p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">{query}</h2>
      <div className="recipes grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.recipe.label}
            title={recipe.recipe.label}
            calories={recipe.recipe.calories}
            image={recipe.recipe.image}
            ingredients={recipe.recipe.ingredients}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeSearch;
