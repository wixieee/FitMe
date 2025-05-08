import React from "react";
import { Link } from "react-router-dom";
import "./recipeCard.css";

function RecipeCard({ image, time, calories, link}) {
  return (
    <Link to={link} className="recipe-card-link">
      <div className="recipe-card">
        <div
          className="recipe-image"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="info-block">
            <div className="info-badge">
              <span><i className="bx bxs-time"></i> {time}</span>
            </div>
            <div className="info-badge">
              <span><i className="bx bxs-hot"></i> {calories}</span>
            </div>
          </div>
        </div>
        <div className="view-button">
          Переглянути весь рецепт
          <i className="bx bxs-right-arrow-circle"></i>
        </div>
      </div>
    </Link>
  );
}

export default RecipeCard;
