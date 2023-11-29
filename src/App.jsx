import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [mealData, setMealData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("biryani"); // Initialize searchTerm with a default value
  const [searchType, setSearchType] = useState("s"); // Initialize searchType with "s" for search by name

  useEffect(() => {
    fetchMealData(searchTerm, searchType);
  }, [searchTerm, searchType]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const items = ["Country", "Area", "First Letter"]; // Replace with your own list of items

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsOpen(false);

    // Set the search type based on the selected item
    switch (item) {
      case "Country":
        setSearchType("a");
        break;
      case "Area":
        setSearchType("b");
        break;
      case "First Letter":
        setSearchType("f");
        break;
      default:
        setSearchType("o");
    }
  };

  const handleSearchClick = () => {
    // Fetch data when the user clicks the search button
    fetchMealData(searchTerm, searchType);
  };

  const fetchMealData = async (searchTerm, searchType) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?${searchType}=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMealData(data.meals || []);
    } catch (error) {
      console.error("Error fetching meal data:", error);
      setMealData([]); // Clear the data in case of an error
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="App flex flex-col items-center justify-center">
      <h1 className="text-4xl font-semibold text-black text-center">
        Meal Information 21
      </h1>
      <div className="w-full flex items-center justify-evenly px-5 space-x-6 py-8">
        <div id="search" className="w-1/4 h-14 flex items-center justify-center">
          <input
            type="text"
            placeholder="Search"
            className="bg-green-200 font-semibold text-black outline-none h-full w-full px-2"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            className="fa-solid fa-magnifying-glass px-3 py-3.5 text-xl bg-green-200"
            id="search-button"
            onClick={handleSearchClick} // Add click event handler
          ></button>
        </div>
        <div id="catagery" className="w-1/4 h-14">
          <button
            className="bg-gray-200 text-gray-700 px-4 py-4 outline-none rounded shadow font-semibold"
            onClick={toggleDropdown}
          >
            {selectedItem || "Categories"}
          </button>

          {isOpen && (
            <div className="absolute mt-2 py-2 w-48 bg-white border rounded shadow-lg z-10">
              {items.map((item, index) => (
                <button
                  key={index}
                  className="block px-4 py-2 text-gray-800 hover-bg-gray-300 w-full text-left font-semibold"
                  onClick={() => handleItemClick(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div> 
      </div>
      {mealData.length > 0 ? (
        mealData.map((meal, index) => (
          <div key={index} className="w-1/2 my-4 h-[500px] rounded-md border flex flex-col items-center justify-center">
            <h2 className="text-3xl font-medium py-4 -mt-6">{meal.strMeal}</h2>
            <img src={meal.strMealThumb} alt={meal.strMeal} className="w-80 rounded h-48" />
            <div className="flex items-center justify-center space-x-6">
              <p className="leading-relaxed font-semibold text-xl py-1">{meal.strCategory}</p>
              <p className="text-lg py-1 font-medium">{meal.strArea}</p>
            </div>
            <p className="w-[90%] text-center text-sm font-normal" id="description">
              {meal.strInstructions.length > 400
                ? meal.strInstructions.substring(0, 400) + "..."
                : meal.strInstructions}
            </p>
          </div>
        ))
      ) : (
        <p>Meals not found</p>
      )}
    </div>
  );
}

export default App;

