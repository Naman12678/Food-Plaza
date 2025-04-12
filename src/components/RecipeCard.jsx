import React, { useState } from "react";

const RecipeCard = ({ title, calories, image, ingredients }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Format calories to be more readable
  const formattedCalories = Math.round(calories).toLocaleString();
  
  return (
    <div 
      className="group relative rounded-xl overflow-hidden shadow-xl bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-red-400/20 h-full flex flex-col"
    >
      {/* Image container with zoom effect */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <img 
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" 
          src={image} 
          alt={title} 
        />
        
        {/* Calorie badge */}
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-white/80 backdrop-blur-sm text-red-600 px-3 py-1 rounded-full font-medium text-sm shadow-lg flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
            </svg>
            {formattedCalories} cal
          </div>
        </div>
        
        {/* Title overlay on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10 transform translate-y-0 opacity-100 transition-all duration-300 group-hover:translate-y-0">
          <h2 className="text-2xl font-bold text-white text-shadow line-clamp-2 tracking-tight">{title}</h2>
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h2 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">{title}</h2>
        
        {/* Expandable ingredients section */}
        <div className={`transition-all duration-500 overflow-hidden flex-grow ${showDetails ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <h3 className="font-bold text-gray-700 mb-3 flex items-center">
            <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Ingredients
          </h3>
          <ul className="space-y-2 mb-4 pl-10">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="text-sm text-gray-600 relative">
                <span className="absolute -left-5 top-1 w-3 h-3 bg-red-200 rounded-full"></span>
                <span className="font-medium text-gray-700">{ingredient.text.split(' ')[0]}</span> {ingredient.text.split(' ').slice(1).join(' ')}
              </li>
            ))}
          </ul>
        </div>
        
        <button
          className="mt-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium relative overflow-hidden group"
          onClick={() => setShowDetails(!showDetails)}
        >
          <span className="absolute inset-0 w-full h-full transition-all duration-300 group-hover:bg-red-600"></span>
          <span className="absolute inset-0 w-3/4 h-full bg-red-600 transition-all duration-500 group-hover:w-full"></span>
          <span className="relative text-white font-medium tracking-wide z-10">
            {showDetails ? 'HIDE INGREDIENTS' : 'VIEW INGREDIENTS'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;