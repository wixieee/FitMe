import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase";
import "./workoutPageCard.css";
import "../../assets/variables.css";

function WorkoutPageCard({ image, time, calories, link, title, workoutNumber, onFavoriteChange }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const checkFavorite = async () => {
      if (user && workoutNumber) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setIsFavorite(data.favoriteWorkouts?.includes(workoutNumber));
        }
      }
    };
    checkFavorite();
  }, [user, workoutNumber]);

  const toggleFavorite = async (e) => {
    e.preventDefault(); // блокує перехід за посиланням
    e.stopPropagation(); // зупиняє спливання

    if (!user) {
      alert("Увійдіть в систему, щоб додати до обраного");
      return;
    }

    if (!workoutNumber) {
      console.error("Відсутній ідентифікатор тренування");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userRef, {
        favoriteWorkouts: isFavorite
          ? arrayRemove(workoutNumber)
          : arrayUnion(workoutNumber),
      });
      const newFavoriteState = !isFavorite;
      setIsFavorite(newFavoriteState);
      
      // Викликаємо callback якщо він існує
      if (onFavoriteChange) {
        onFavoriteChange(workoutNumber, newFavoriteState);
      }
    } catch (error) {
      console.error("Помилка збереження обраного тренування:", error);
    }
  };

  return (
    <Link to={link} className="workout-card-link">
      <div className="workoutPage-card">
        <div
          className="workout-image"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="star-icon" onClick={toggleFavorite}>
            <i className={`bx ${isFavorite ? "bxs-star active" : "bx-star"}`}></i>
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
          {title || "Перейти до тренування"}
          <i className="bx bxs-right-arrow-circle"></i>
        </div>
      </div>
    </Link>
  );
}

export default WorkoutPageCard;
