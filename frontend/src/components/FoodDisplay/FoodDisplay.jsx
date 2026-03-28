import React, { useContext } from "react";
import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";
import { StoreContext } from "../../Context/StoreContext";

const FoodDisplay = ({ category }) => {
  const { food_list, searchQuery } = useContext(StoreContext);

  const filteredFoods = food_list.filter((item) => {
    // Category filter
    const matchesCategory =
      category === "All" ||
      (typeof item.category === "object" && item.category !== null
        ? item.category.name?.toLowerCase() === category.toLowerCase()
        : typeof item.category === "string"
        ? item.category.toLowerCase() === category.toLowerCase()
        : false);

    // Search filter
    const matchesSearch =
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>

      <div className="food-display-list">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((item) => (
            <FoodItem
              key={item._id}
              image={item.image}
              name={item.name}
              desc={item.description}
              price={item.price}
              id={item._id}
            />
          ))
        ) : (
          <p style={{ marginTop: "20px" }}>
            No items match your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
