
# Food Plaza - Recipe Search Application

Food Plaza is a modern React-based web application that allows users to search for recipes using the [Edamam API](https://developer.edamam.com/). It features a responsive, animated UI with recipe cards, a dynamic search interface, and performance optimizations like caching and debouncing.

## Table of Contents

-   [Features](https://grok.com/chat/874180dd-ca51-4169-8eb8-2965b14a5073#features)
-   [Installation](https://grok.com/chat/874180dd-ca51-4169-8eb8-2965b14a5073#installation)
-   [Usage](https://grok.com/chat/874180dd-ca51-4169-8eb8-2965b14a5073#usage)
-   [Code Snippets](https://grok.com/chat/874180dd-ca51-4169-8eb8-2965b14a5073#code-snippets)
    -   [App Component](https://grok.com/chat/874180dd-ca51-4169-8eb8-2965b14a5073#app-component)
    -   [RecipeSearch Component](https://grok.com/chat/874180dd-ca51-4169-8eb8-2965b14a5073#recipesearch-component)
    -   [RecipeCard Component](https://grok.com/chat/874180dd-ca51-4169-8eb8-2965b14a5073#recipecard-component)
-   [Technologies Used](https://grok.com/chat/874180dd-ca51-4169-8eb8-2965b14a5073#technologies-used)
-   [API Integration](https://grok.com/chat/874180dd-ca51-4169-8eb8-2965b14a5073#api-integration)
-   [Project Structure](https://grok.com/chat/874180dd-ca51-4169-8eb8-2965b14a5073#project-structure)
-   [Contributing](https://grok.com/chat/874180dd-ca51-4169-8eb8-2965b14a5073#contributing)
-   [License](https://grok.com/chat/874180dd-ca51-4169-8eb8-2965b14a5073#license)

## Features

-   **Recipe Search**: Search recipes by keyword using the Edamam API.
-   **Dynamic Routing**: Navigate between home (`/`) and search (`/search?query=...`) pages with React Router.
-   **Recipe Cards**: Display recipes with titles, images, calorie counts, and toggleable ingredient lists.
-   **Responsive Design**: Built with Tailwind CSS for mobile and desktop compatibility.
-   **Performance**: Caches API responses and debounces searches for efficiency.
-   **Dynamic Header**: Hides on scroll-down and shows on scroll-up.
-   **Error Handling**: Manages API errors (e.g., rate limits) and displays loading/empty states.

## Installation

### Prerequisites

-   **Node.js**: Version 14 or higher
-   **Edamam API Credentials**: Obtain `APP_ID` and `APP_KEY` from [Edamam](https://developer.edamam.com/)

### Steps

1.  **Clone the Repository**:
    
    ```bash
    git clone https://github.com/your-username/food-plaza.git
    cd food-plaza
    
    ```
    
2.  **Install Dependencies**:
    
    ```bash
    npm install
    
    ```
    
3.  **Set Up Environment Variables**:  
    Create a `.env` file in the project root:
    
    ```env
    VITE_APP_ID=your-app-id
    VITE_APP_KEY=your-app-key
    
    ```
    
4.  **Run the Development Server**:
    
    ```bash
    npm run dev
    
    ```
    
    Open `http://localhost:5173` in your browser.
    
5.  **Build for Production**:
    
    ```bash
    npm run build
    
    ```
    

## Usage

1.  Visit `http://localhost:5173` to access the home page.
2.  Use the search bar on the search page (`/search`) to enter a keyword (e.g., "pasta").
3.  View recipe cards with titles, images, calories, and ingredients.
4.  Click "VIEW INGREDIENTS" on a card to toggle the ingredient list.
5.  Scroll to hide/show the header dynamically.
6.  Handle errors (e.g., rate limits) with the "Try Again" button or return to home if no results are found.

## Code Snippets

### App Component

Sets up routing for the home and search pages using `react-router-dom`.

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RecipeSearch from './components/RecipeSearch';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<RecipeSearch />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

```

### RecipeSearch Component

Handles recipe fetching, search input, and rendering of recipe cards with caching and debouncing.

```jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import { debounce } from 'lodash';

const RecipeSearch = () => {
  const APP_ID = import.meta.env.VITE_APP_ID;
  const APP_KEY = import.meta.env.VITE_APP_KEY;

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [cache] = useState(new Map());

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    if (query) {
      debouncedGetRecipes(query);
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [query, lastScrollY]);

  const fetchRecipes = async (query) => {
    const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`;

    if (cache.has(query)) {
      setRecipes(cache.get(query));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url);
      if (response.status === 429) {
        setError('Rate limit exceeded. Please try again later.');
        return;
      }
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      cache.set(query, data.hits);
      setRecipes(data.hits);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const debouncedGetRecipes = useCallback(debounce(fetchRecipes, 600), []);

  const handleNewSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?query=${searchInput}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`fixed w-full transition-transform duration-300 ease-in-out z-50 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-4 shadow-xl">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <h1 
                className="text-3xl font-bold mb-4 md:mb-0 cursor-pointer flex items-center" 
                onClick={() => navigate('/')}
              >
                <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Food Plaza
              </h1>
              <form className="w-full md:w-1/2 flex relative group" onSubmit={handleNewSearch}>
                <input
                  className="w-full p-3 pl-5 pr-12 rounded-full text-gray-800 focus:outline-none shadow-lg bg-white/90 backdrop-blur-sm"
                  type="text"
                  placeholder="Find more recipes..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button
                  className="absolute right-1 top-1 bottom-1 px-4 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 text-white transition-all duration-300 hover:from-gray-900 hover:to-black"
                  type="submit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-thin text-gray-800 mb-2">
            <span className="text-red-600 font-bold">{query}</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-red-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-gray-600">
            {recipes.length ? `${recipes.length} delicious recipes found` : 'Searching for recipes...'}
          </p>
        </div>

        {loading && (
          <div className="flex justify-center my-12">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-red-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3.5a6.5 6.5 0 106.5 6.5.75.75 0 011.5 0c0 4.56-3.69 8.25-8.25 8.25S1.5 14.56 1.5 10 5.19 1.75 10 1.75c2.34 0 4.47.95 6 2.5a.75.75 0 11-1.06 1.06A6.47 6.47 0 0010 3.5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center bg-red-50 border border-red-200 p-8 rounded-2xl max-w-md mx-auto shadow-lg">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-lg font-medium text-gray-800 mb-4">We encountered a problem</p>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-400/20"
              onClick={() => fetchRecipes(query)}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {recipes.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-2xl text-gray-400 font-light">No recipes found.</p>
                <p className="text-gray-500 mt-2">Try a different search term or explore our categories.</p>
                <button 
                  className="mt-6 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300"
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recipes.map((recipe, index) => (
                  <div 
                    className="opacity-0 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                    key={`${recipe.recipe.label}-${index}`}
                  >
                    <RecipeCard
                      title={recipe.recipe.label ?? "Unknown"}
                      calories={recipe.recipe.calories ?? 0}
                      image={recipe.recipe.image}
                      ingredients={recipe.recipe.ingredients ?? []}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <footer className="mt-16 bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            <span className="font-medium text-red-400">Food Plaza</span> - Discover delicious recipes for every taste
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
};

export default RecipeSearch;

```

### RecipeCard Component

Displays individual recipes with hover effects, calorie badges, and a toggleable ingredients list.

```jsx
import React, { useState } from "react";

const RecipeCard = ({ title, calories, image, ingredients }) => {
  const [showDetails, setShowDetails] = useState(false);
  const formattedCalories = Math.round(calories).toLocaleString();

  return (
    <div 
      className="group relative rounded-xl overflow-hidden shadow-xl bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-red-400/20 h-full flex flex-col"
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <img 
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" 
          src={image} 
          alt={title} 
        />
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-white/80 backdrop-blur-sm text-red-600 px-3 py-1 rounded-full font-medium text-sm shadow-lg flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
            </svg>
            {formattedCalories} cal
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10 transform translate-y-0 opacity-100 transition-all duration-300 group-hover:translate-y-0">
          <h2 className="text-2xl font-bold text-white text-shadow line-clamp-2 tracking-tight">{title}</h2>
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h2 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">{title}</h2>
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

```

## Technologies Used

-   **React**: Frontend framework
-   **React Router DOM**: Client-side routing
-   **Tailwind CSS**: Styling and responsive design
-   **Lodash**: Debouncing for search optimization
-   **Edamam API**: Recipe data source
-   **Vite**: Build tool

## API Integration

### Edamam Recipe API

-   **Base URL**: `https://api.edamam.com/api/recipes/v2`
-   **Parameters**:
    -   `type=public`: Public API access
    -   `q`: Search query (e.g., "pasta")
    -   `app_id`: Your Edamam application ID
    -   `app_key`: Your Edamam application key
-   **Example Request**:
    
    ```http
    GET https://api.edamam.com/api/recipes/v2?type=public&q=pasta&app_id=your-app-id&app_key=your-app-key
    
    ```
    
-   **Response**: Returns a `hits` array with recipe objects containing `label`, `calories`, `image`, and `ingredients`.
-   **Optimizations**: Caches responses in a `Map` and debounces searches (600ms delay).

## Project Structure

```
src/
├── components/
│   ├── RecipeCard.jsx
│   └── RecipeSearch.jsx
├── pages/
│   └── Home.jsx
├── App.jsx
├── main.jsx
├── styles.css
└── .env

```

## Contributing

1.  Fork the repository.
2.  Create a feature branch: `git checkout -b feature/your-feature`
3.  Commit changes: `git commit -m "Add your feature"`
4.  Push to the branch: `git push origin feature/your-feature`
5.  Open a pull request.

## License

This project is licensed under the MIT License.