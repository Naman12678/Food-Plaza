import React from "react";

const RecipeCard = ({ title, calories, image, ingredients }) => {
  return (
    <div className="recipe-card max-w-sm rounded overflow-hidden shadow-lg p-6 bg-white hover:shadow-xl transition-shadow duration-300">
      <img className="w-full h-48 object-cover rounded-md mb-4" src={image} alt={title} />
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <ol className="list-disc list-inside mb-4">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="text-sm text-gray-700">
            {ingredient.text}
          </li>
        ))}
      </ol>
      <p className="text-sm text-gray-600">Calories: {calories}</p>
    </div>
  );
};

export default RecipeCard;
