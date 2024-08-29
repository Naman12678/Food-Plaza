import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "./bg.jpg"; // Import the image

const Home = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

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
      className="flex flex-col justify-center items-center min-h-screen bg-no-repeat bg-cover bg-fixed"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover", // Fits the image to cover the background nicely
        backgroundPosition: "center", // Centers the image
      }}
    >
      {/* Welcome Text */}
      <div className="text-center mb-8 bg-white bg-opacity-50 p-6 rounded-lg shadow-lg max-w-xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Food Plaza!
        </h1>
        <p className="text-lg text-gray-700">
          Discover a world of delicious recipes. Search for your favorite dishes
          and explore our specialties, including vegan options, gluten-free meals,
          and easy-to-follow recipes for all skill levels. We are here to help you
          create mouth-watering meals in the comfort of your home!
        </p>
      </div>

      {/* Search Form */}
      <form className="flex w-full max-w-lg" onSubmit={handleSearch}>
        <input
          className="flex-grow p-4 rounded-l-lg text-gray-800 focus:outline-none"
          type="text"
          placeholder="Search for a dish..."
          value={search}
          onChange={updateSearch}
        />
        <button
          className="bg-red-500 p-4 rounded-r-lg hover:bg-red-600 text-white"
          type="submit"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default Home;
