import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import axios from "axios";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../assets/variables.css";
import "./Home-RecipeSection.css";

function RecipeSection() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 950);
  const [recipeOfTheDay, setRecipeOfTheDay] = useState(null);
  const [categoryRecipes, setCategoryRecipes] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 950);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Отримання рецепту дня
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch("https://fitmesever-production.up.railway.app/recipe/of-the-day");
        const data = await response.json();
        setRecipeOfTheDay(data.recipe);
      } catch (error) {
        console.error("Не вдалося завантажити рецепт дня", error);
      }
    };
    fetchRecipe();
  }, []);

  // Отримання категорій
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://fitmesever-production.up.railway.app/recipe/categories-preview");
        const categoriesWithIds = response.data.categories.map(category => {
          const idMap = {
            "Рецепти з високим вмістом білка": "high-protein",
            "Рецепти без молока": "dairy-free",
            "Вегетеріанські рецепти": "vegetarian",
            "Рецепти з високим вмістом вуглеводів": "high-carb"
          };
          return {
            ...category,
            id: idMap[category.title]
          };
        });
        setCategoryRecipes(categoriesWithIds || []);
      } catch (error) {
        console.error("Не вдалося завантажити категорії рецептів", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="recipe-section">
      {/* Рецепт дня */}
      <div className="recipe-main">
        <img
          src={recipeOfTheDay?.imageUrl || process.env.PUBLIC_URL + "/images/recipe-main.png"}
          alt={recipeOfTheDay?.title || "Recipe Image"}
          className="recipe-img"
        />
        <div className="recipe-text">
          <h3>{recipeOfTheDay?.title || "Завантаження рецепту..."}</h3>
          <p>{recipeOfTheDay?.description || "Будь ласка, зачекайте..."}</p>
          {recipeOfTheDay && (
            <Link to={`/recipe?title=${encodeURIComponent(recipeOfTheDay.title)}`} className="view-full-btn">
              Переглянути рецепт<i className="bx bxs-right-arrow-circle"></i>
            </Link>
          )}
        </div>
      </div>

      {/* Категорії рецептів */}
      <div className="recipe-categories">
        {isMobile ? (
          <Swiper
            modules={[Navigation]}
            slidesPerView={1}
            navigation
            loop={true}
            breakpoints={{
              0: { slidesPerView: 1 },
              700: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
            }}
          >
            {categoryRecipes.map((r, index) => (
              <SwiperSlide key={index}>
                <Link to={`/recipes#${r.title === "Рецепти з високим вмістом вуглеводів" ? "high-carb" : 
                           r.title === "Рецепти з високим вмістом білка" ? "high-protein" :
                           r.title === "Рецепти без молока" ? "dairy-free" :
                           r.title === "Вегетеріанські рецепти" ? "vegetarian" : ""}`} 
                     className="small-recipe">
                  <img className="small-recipe-img" src={r.img} alt={r.title} />
                  <p className="small-recipe-title">{r.title}</p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <ul>
            {categoryRecipes.map((r, index) => (
              <li key={index}>
                <Link to={`/recipes#${r.title === "Рецепти з високим вмістом вуглеводів" ? "high-carb" : 
                           r.title === "Рецепти з високим вмістом білка" ? "high-protein" :
                           r.title === "Рецепти без молока" ? "dairy-free" :
                           r.title === "Вегетеріанські рецепти" ? "vegetarian" : ""}`} 
                     className="small-recipe">
                  <img className="small-recipe-img" src={r.img} alt={r.title} />
                  <p className="small-recipe-title">{r.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default RecipeSection;