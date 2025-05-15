import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import RecipeCard from "../components/recipe-components/RecipeCard";
import RecipeSection from "../components/home-components/Home-RecipeSection";

import "../assets/variables.css";
import "./recipes.css";

const API_URL = "https://fitmesever-production.up.railway.app/recipes/by-category";

function RecipeCategorySection({ title, description, recipes }) {
  return (
    <section className="recipes-section">
      <h2>{title}</h2>
      <p>{description}</p>
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        breakpoints={{
          0: { slidesPerView: 1 },
          1000: { slidesPerView: 2 },
          1400: { slidesPerView: 3 },
          1800: { slidesPerView: 4 },
        }}
      >
        {recipes.map((recipe, index) => (
          <SwiperSlide key={index}>
            <div className="recipe-card-slide">
              <RecipeCard {...recipe} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

function Recipes() {
  const [highProteinRecipes, setHighProteinRecipes] = useState([]);
  const [dairyFreeRecipes, setDairyFreeRecipes] = useState([]);
  const [vegetarianRecipes, setVegetarianRecipes] = useState([]);

  useEffect(() => {
    async function fetchRecipes(category, setter) {
      try {
        const response = await fetch(`${API_URL}?category=${encodeURIComponent(category)}`);
        const data = await response.json();
        setter(data.recipes);
      } catch (error) {
        console.error(`Error fetching recipes for ${category}:`, error);
      }
    }

    fetchRecipes("Рецепти з високим вмістом білка", setHighProteinRecipes);
    fetchRecipes("Рецепти без молока", setDairyFreeRecipes);
    fetchRecipes("Вегетеріанські рецепти", setVegetarianRecipes);
  }, []);

  return (
    <>
      <div className="recipes-container">
        <h1 className="recipes-section-title">Відібрані рецепти</h1>
      </div>
      <RecipeSection />
      <RecipeCategorySection
        title="Рецепти з високим вмістом білка"
        description="Почніть свій день з білкових сніданків — ситно, корисно та смачно."
        recipes={highProteinRecipes}
      />
      <RecipeCategorySection
        title="Рецепти без молока"
        description="Ідеально для тих, хто уникає лактози або дотримується безмолочної дієти."
        recipes={dairyFreeRecipes}
      />
      <RecipeCategorySection
        title="Вегетаріанські рецепти"
        description="Смачні страви без м’яса — для здорового та збалансованого харчування."
        recipes={vegetarianRecipes}
      />
    </>
  );
}

export default Recipes;
