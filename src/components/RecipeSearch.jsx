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
  const [cache] = useState(new Map()); // Caching responses

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
      setRecipes(cache.get(query)); // Use cached data
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
      cache.set(query, data.hits); // Cache the response
      setRecipes(data.hits);
    } catch (err) {
      console.error('Failed to fetch recipes:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Debounced version of fetchRecipes
  const debouncedGetRecipes = useCallback(debounce(fetchRecipes, 600), []);

  const handleNewSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?query=${searchInput}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Elegant header with scroll hiding */}
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
        {/* Results header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-thin text-gray-800 mb-2">
            <span className="text-red-600 font-bold">{query}</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-red-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-gray-600">
            {recipes.length ? `${recipes.length} delicious recipes found` : 'Searching for recipes...'}
          </p>
        </div>

        {/* Loading state with elegant spinner */}
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

        {/* Error state */}
        {error && (
          <div className="text-center bg-red-50 border border-red-200 p-8 rounded-2xl max-w-md mx-auto shadow-lg">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-lg font-medium text-gray-800 mb-4">We encountered a problem</p>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-400/20"
              onClick={fetchRecipes}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results grid with animation */}
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
      
      {/* Elegant footer */}
      <footer className="mt-16 bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            <span className="font-medium text-red-400">Food Plaza</span> - Discover delicious recipes for every taste
          </p>
        </div>
      </footer>
      
      {/* Style for animation */}
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
