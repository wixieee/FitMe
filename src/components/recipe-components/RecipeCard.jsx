import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import "./recipeCard.css";

function RecipeCard({ recipeId, title, image, time, calories, link }) {
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

  console.log("Recipe ID:", recipeId); // ← Ось тут ми виводимо ID

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
    setIsFavorite(!isFavorite);
  } catch (error) {
    console.error("Помилка збереження обраного рецепта:", error);
  }
};


  return (
    <Link to={link} className="recipe-card-link">
      <div className="recipe-card">
        <div
          className="recipe-image"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="star-icon" onClick={toggleFavorite}>
            <i className={isFavorite ? "bx bxs-star active" : "bx bx-star"}></i>
          </div>
          <div className="info-block">
            <div className="info-badge">
              <span>
                <i className="bx bxs-time"></i> {time}
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
