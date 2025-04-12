import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "./bg.jpg";

const Home = () => {
  const [search, setSearch] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const updateSearch = (e) => {
    setSearch(e.target.value);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?query=${search}`);
    }
  };
  
  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen bg-no-repeat bg-cover bg-fixed relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Elegant dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      
      {/* Content Container with animation */}
      <div className={`relative z-10 w-full max-w-6xl px-4 py-16 transition-all duration-1000 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        {/* Welcome Text */}
        <div className="text-center mb-16 p-10 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 max-w-3xl mx-auto shadow-2xl">
          <h1 className="text-6xl font-light text-white mb-8 tracking-tight">
            <span className="font-bold text-red-400">Food</span> Plaza
          </h1>
          <p className="text-xl text-gray-100 leading-relaxed font-light">
            Discover a world of <span className="italic">delicious</span> recipes. Search for your favorite dishes
            and explore our specialties, including vegan options, gluten-free meals,
            and easy-to-follow recipes for all skill levels.
          </p>
        </div>
        
        {/* Search Form */}
        <div className="flex justify-center mb-16">
          <form 
            className="flex w-full max-w-2xl relative group" 
            onSubmit={handleSearch}
            autoComplete="off"
          >
            <input
              className="w-full p-6 pl-8 rounded-full text-gray-800 focus:outline-none shadow-xl text-lg bg-white/90 backdrop-blur-sm transition-all duration-300 group-hover:shadow-red-400/20"
              type="text"
              placeholder="What would you like to cook today?"
              value={search}
              onChange={updateSearch}
            />
            <button
              className="absolute right-2 top-2 bottom-2 px-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white transition-all duration-300 font-medium text-lg hover:shadow-lg hover:shadow-red-500/50 hover:from-red-600 hover:to-red-700"
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
        
        {/* Quick Categories */}
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { name: "Italian", emoji: "🍝" },
            { name: "Mexican", emoji: "🌮" },
            { name: "Asian", emoji: "🍜" },
            { name: "Desserts", emoji: "🍰" },
            { name: "Vegan", emoji: "🥑" },
            { name: "Quick Meals", emoji: "⏱️" }
          ].map((category) => (
            <button
              key={category.name}
              className="group bg-white/10 backdrop-blur-sm px-6 py-4 rounded-full text-white hover:bg-white/20 transition-all duration-300 font-light border border-white/10 hover:border-white/30 shadow-lg hover:shadow-red-500/10"
              onClick={() => {
                setSearch(category.name);
                navigate(`/search?query=${category.name}`);
              }}
            >
              <span className="mr-2 transition-transform duration-300 inline-block group-hover:scale-125">{category.emoji}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;