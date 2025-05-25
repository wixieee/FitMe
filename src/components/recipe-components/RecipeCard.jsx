import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase";
import "./recipeCard.css";

function RecipeCard({ recipeId, title, imageUrl, prepTime, calories, link, onFavoriteChange }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const checkFavorite = async () => {
      if (user && recipeId) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setIsFavorite(data.favorites?.includes(recipeId));
        }
      }
    };
    checkFavorite();
  }, [user, recipeId]);

  const toggleFavorite = async (e) => {
    e.preventDefault(); // блокує перехід за посиланням
    e.stopPropagation(); // зупиняє спливання

    if (!user) {
      alert("Увійдіть в систему, щоб додати до обраного");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userRef, {
        favorites: isFavorite
          ? arrayRemove(recipeId)
          : arrayUnion(recipeId),
      });
      const newFavoriteState = !isFavorite;
      setIsFavorite(newFavoriteState);
      
      // Викликаємо callback якщо він існує
      if (onFavoriteChange) {
        onFavoriteChange(recipeId, newFavoriteState);
      }
    } catch (error) {
      console.error("Помилка збереження обраного рецепта:", error);
    }
  };

  return (
    <Link to={link} className="recipe-card-link">
      <div className="recipe-card">
        <div
          className="recipe-image"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="star-icon" onClick={toggleFavorite}>
            <i className={`bx ${isFavorite ? "bxs-star active" : "bx-star"}`}></i>
          </div>
          <div className="info-block">
            <div className="info-badge">
              <span>
                <i className="bx bxs-time"></i> {prepTime}
              </span>
            </div>
            <div className="info-badge">
              <span>
                <i className="bx bxs-hot"></i> {calories}
              </span>
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
