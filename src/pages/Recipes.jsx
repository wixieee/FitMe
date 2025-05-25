import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useLocation } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";

import RecipeCard from "../components/recipe-components/RecipeCard";
import RecipeSection from "../components/home-components/Home-RecipeSection";
import RecipeSearch from "../components/general-components/Search";

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
  const [highCarbRecipes, setHighCarbRecipes] = useState([]);
  const location = useLocation();

  const recipeFilters = [
    { label: "Калорії", key: "calories", defaultRange: [0, 1000] },
    { label: "Білки", key: "protein", defaultRange: [0, 100] },
    { label: "Жири", key: "fats", defaultRange: [0, 100] },
    { label: "Вуглеводи", key: "carbs", defaultRange: [0, 100] },
    {
      label: "Час приготування",
      key: "prepTime",
      defaultRange: [5, 120],
      unit: "хв",
    },
  ];

  useEffect(() => {
    async function fetchRecipes(category, setter) {
      try {
        const response = await fetch(
          `${API_URL}?category=${encodeURIComponent(category)}`
        );
        const data = await response.json();
        setter(data.recipes);
      } catch (error) {
        console.error(`Error fetching recipes for ${category}:`, error);
      }
    }

    fetchRecipes("Рецепти з високим вмістом білка", setHighProteinRecipes);
    fetchRecipes("Рецепти без молока", setDairyFreeRecipes);
    fetchRecipes("Вегетеріанські рецепти", setVegetarianRecipes);
    fetchRecipes("Рецепти з високим вмістом вуглеводів", setHighCarbRecipes);
  }, []);

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          window.scrollTo({
            top: element.offsetTop -10,
            behavior: 'smooth'
          });
        }
      }, 500);
    }
  }, [location.hash]);

  return (
    <>
      <div className="recipes-container">
        <h1 className="recipes-section-title">Відібрані рецепти</h1>
      </div>
      <RecipeSection />
      <div id="recipe-search">
        <RecipeSearch
          filters={recipeFilters}
          typeOptions={["Сніданок", "Обід", "Вечеря", "Перекус", "Десерт"]}
          onSearch={(data) => console.log("Recipe search", data)}
        />
      </div>
      <section id="high-protein" className="recipes-section">
        <RecipeCategorySection
          title="Рецепти з високим вмістом білка"
          description="Почніть свій день з білкових сніданків — ситно, корисно та смачно."
          recipes={highProteinRecipes}
        />
      </section>
      <section id="dairy-free" className="recipes-section">
        <RecipeCategorySection
          title="Рецепти без молока"
          description="Ідеально для тих, хто уникає лактози або дотримується безмолочної дієти."
          recipes={dairyFreeRecipes}
        />
      </section>
      <section id="vegetarian" className="recipes-section">
        <RecipeCategorySection
          title="Вегетаріанські рецепти"
          description="Смачні страви без м'яса — для здорового та збалансованого харчування."
          recipes={vegetarianRecipes}
        />
      </section>
      <section id="high-carb" className="recipes-section">
        <RecipeCategorySection
          title="Рецепти з високим вмістом вуглеводів"
          description="Енергійні страви для спортсменів і тих, хто потребує додаткової енергії."
          recipes={highCarbRecipes}
        />
      </section>
    </>
  );
}

export default Recipes;