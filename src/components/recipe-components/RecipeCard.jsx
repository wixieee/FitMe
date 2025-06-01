import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase";
import "./recipeCard.css";

function RecipeCard({ recipeId, title, imageUrl, prepTime, calories, link, onFavoriteChange }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCalculator, setAddedToCalculator] = useState(false);
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

  const addToCalculator = async (e) => {
    e.preventDefault(); // блокує перехід за посиланням
    e.stopPropagation(); // зупиняє спливання

    try {
      // Отримуємо детальну інформацію про рецепт з API
      const response = await fetch(`https://fitme-sever.onrender.com/recipe?title=${encodeURIComponent(title)}`);
      const data = await response.json();
      
      let proteins = 0;
      let fats = 0;
      let carbs = 0;
      
      if (data.recipe && data.recipe.nutrients) {
        const nutrients = data.recipe.nutrients;
        // Парсимо значення макронутрієнтів (видаляємо 'г' і конвертуємо в число)
        proteins = parseInt(nutrients.білки?.replace(/[^\d]/g, ""), 10) || 0;
        fats = parseInt(nutrients.жири?.replace(/[^\d]/g, ""), 10) || 0;
        carbs = parseInt(nutrients.вуглеводи?.replace(/[^\d]/g, ""), 10) || 0;
      }

      // Отримуємо поточний список їжі з localStorage
      const savedFoods = localStorage.getItem("foods");
      const foods = savedFoods ? JSON.parse(savedFoods) : [];

      // Додаємо новий рецепт до списку з макронутрієнтами
      const caloriesValue = parseInt(calories, 10) || 0;
      const newFood = {
        name: title,
        calories: caloriesValue,
        proteins: proteins,
        fats: fats,
        carbs: carbs,
        addedAt: new Date().toISOString()
      };
      
      foods.push(newFood);
      
      // Зберігаємо оновлений список у localStorage
      localStorage.setItem("foods", JSON.stringify(foods));
      
    } catch (error) {
      console.error("Помилка при додаванні рецепту до калькулятора:", error);
      
      // У випадку помилки додаємо рецепт тільки з калоріями
      const savedFoods = localStorage.getItem("foods");
      const foods = savedFoods ? JSON.parse(savedFoods) : [];
      
      const caloriesValue = parseInt(calories, 10) || 0;
      const newFood = {
        name: title,
        calories: caloriesValue,
        proteins: 0,
        fats: 0,
        carbs: 0,
        addedAt: new Date().toISOString()
      };
      
      foods.push(newFood);
      localStorage.setItem("foods", JSON.stringify(foods));
    }
    
    // Показуємо ефект додавання
    setAddedToCalculator(true);
    setTimeout(() => {
      setAddedToCalculator(false);
    }, 1000);
  };

  return (
    <Link to={link} className="recipe-card-link">
      <div className="recipe-card">
        <div
          className="recipe-image"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="recipe-actions">
            <div className="star-icon" onClick={toggleFavorite}>
              <i className={`bx ${isFavorite ? "bxs-star active" : "bx-star"}`}></i>
            </div>
          </div>
          <div className="add-icon-container">
            <div className={`add-icon ${addedToCalculator ? 'added' : ''}`} onClick={addToCalculator}>
              <i className={`bx ${addedToCalculator ? 'bx-check' : 'bx-plus'}`}></i>
            </div>
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
