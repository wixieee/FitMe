import React, { useState, useEffect } from "react";
import "./recipePage.css";
import "../assets/variables.css";

import { useSearchParams } from "react-router-dom";

const Recipe = () => {
  const [recipe, setRecipe] = useState(null);
  const [loadVideo, setLoadVideo] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [addedToCalculator, setAddedToCalculator] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(window.navigator.userAgent));

    const title = searchParams.get("title");
    if (title) {
      fetch(
        `https://fitme-sever.onrender.com/recipe?title=${encodeURIComponent(
          title
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.recipe) {
            setRecipe(data.recipe);
          } else {
            setError(data.message || "Рецепт не знайдено");
          }
        })
        .catch((err) => setError("Помилка завантаження рецепту"));
    } else {
      setError("Назва рецепту не вказана");
    }
  }, [searchParams]);

  const addToCalculator = () => {
    if (!recipe) return;

    // Отримуємо поточний список їжі з localStorage
    const savedFoods = localStorage.getItem("foods");
    const foods = savedFoods ? JSON.parse(savedFoods) : [];

    // Парсимо значення макронутрієнтів
    const proteins = parseInt(nutrients?.білки?.replace(/[^\d]/g, ""), 10) || 0;
    const fats = parseInt(nutrients?.жири?.replace(/[^\d]/g, ""), 10) || 0;
    const carbs = parseInt(nutrients?.вуглеводи?.replace(/[^\d]/g, ""), 10) || 0;

    // Додаємо новий рецепт до списку з макронутрієнтами
    const caloriesValue = parseInt(recipe.calories, 10) || 0;
    const newFood = {
      name: recipe.title,
      calories: caloriesValue,
      proteins: proteins,
      fats: fats,
      carbs: carbs,
      addedAt: new Date().toISOString()
    };
    
    foods.push(newFood);
    
    // Зберігаємо оновлений список у localStorage
    localStorage.setItem("foods", JSON.stringify(foods));
    
    // Показуємо ефект додавання
    setAddedToCalculator(true);
    setTimeout(() => {
      setAddedToCalculator(false);
    }, 1000);
  };

  if (error) {
    return (
      <div className="container">
        <p>{error}</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container">
        <p>Завантаження...</p>
      </div>
    );
  }

  const {
    title,
    description,
    imageUrl,
    ingredients,
    instructions,
    nutrients,
    prepTime,
    calories,
    youtubeUrl,
    servings,
  } = recipe;

  const youtubeId = new URL(youtubeUrl).searchParams.get("v");

  return (
    <>
      <div className="container">
        <div className="header-image">
          <img src={imageUrl} alt={title} />

          <div className="recipe-page-star">
            <div className="page-star-icon">
              <i className="bx bxs-star"></i>
            </div>
          </div>
          <div className="recipe-page-add">
            <div className={`page-add-icon ${addedToCalculator ? 'added' : ''}`} onClick={addToCalculator}>
              <i className={`bx ${addedToCalculator ? 'bx-check' : 'bx-plus'}`}></i>
            </div>
          </div>

          <div className="prep-time">
            <span>
              {nutrients["білки"]}
              <br />
              Білки
            </span>
            <span>
              {nutrients["жири"]}
              <br />
              Жири
            </span>
            <span>
              {nutrients["вуглеводи"]}
              <br />
              Вуглеводи
            </span>
          </div>
        </div>

        <div className="content">
          <div className="description-video">
            <div className="text">
              <h2>{title}</h2>
              <p>{description}</p>
            </div>

            <div className="video-section">
              {!loadVideo ? (
                <div
                  className="video-thumbnail"
                  onClick={() => setLoadVideo(true)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                    alt="Watch video"
                  />
                  <div className="play-button">
                    <i className="bx bx-play"></i>
                  </div>
                </div>
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=1&modestbranding=1&rel=0${
                    isIOS ? "&mute=1" : ""
                  }`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>

          <div className="ingredients-info">
            <div className="ingredients">
              <h3>Інгредієнти ({servings} порції)</h3>
              <ul>
                {ingredients.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="additional-info">
              <h3>Час приготування - {prepTime}</h3>
              <h3>Калорійність - {calories}</h3>
              <ul>
                <li>Білки - {nutrients["білки"]}</li>
                <li>Жири - {nutrients["жири"]}</li>
                <li>Вуглеводи - {nutrients["вуглеводи"]}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="instructions">
          <h3>Як приготувати {title}</h3>
          <p>{instructions}</p>
        </div>
      </div>
    </>
  );
};

export default Recipe;
