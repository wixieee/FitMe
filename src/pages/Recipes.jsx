import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import RecipeCard from "../components/recipe-components/RecipeCard";
import RecipeSection from "../components/home-components/Home-RecipeSection";
import RecipeSearch from "../components/general-components/Search";

import "../assets/variables.css";
import "./recipes.css";

const API_URL = "https://fitme-sever.onrender.com/recipes/by-category";

function RecipeCategorySection({ title, description, recipes }) {
  if (!recipes.length) {
    return (
      <section className="recipes-section">
        <h2>{title}</h2>
        <p>{description}</p>
        <p style={{ fontStyle: "italic", color: "#666" }}>Рецептів не знайдено.</p>
      </section>
    );
  }

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
              <RecipeCard {...recipe} recipeId={recipe.id} />
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

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedType, setSelectedType] = useState("");
  const [isSearchApplied, setIsSearchApplied] = useState(false);

  const recipeFilters = [
    { label: "Калорії", key: "calories", defaultRange: [0, 1000] },
    { label: "Білки", key: "protein", defaultRange: [0, 100] },
    { label: "Жири", key: "fats", defaultRange: [0, 100] },
    { label: "Вуглеводи", key: "carbs", defaultRange: [0, 100] },
    { label: "Час приготування", key: "prepTime", defaultRange: [5, 120], unit: "хв" },
  ];

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
    fetchRecipes("Рецепти з високим вмістом вуглеводів", setHighCarbRecipes);
  }, []);

function parseValue(value) {
  if (!value || value === "—") return undefined;  // Порожнє, дефолт

  // Знайти першу послідовність цифр, можливо з крапкою або комою
  const match = value.toString().match(/[\d,.]+/);
  if (!match) return undefined;

  // Замінимо кому на крапку для правильного парсингу float (якщо треба)
  const numStr = match[0].replace(',', '.');

  return Number(numStr);
}


function filterRecipes(recipes) {
  return recipes.filter((recipe) => {
    if (!recipe || !recipe.title) return false;

    const titleMatch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());

    const cal = parseValue(recipe.calories);
    const protein = parseValue(recipe.nutrients?.["білки"]);
    const fats = parseValue(recipe.nutrients?.["жири"]);
    const carbs = parseValue(recipe.nutrients?.["вуглеводи"]);
    const prepTime = parseValue(recipe.prepTime);

    const inRange = {
      calories: cal >= (filters.calories?.[0] ?? 0) && cal <= (filters.calories?.[1] ?? 1000),
      protein: protein >= (filters.protein?.[0] ?? 0) && protein <= (filters.protein?.[1] ?? 100),
      fats: fats >= (filters.fats?.[0] ?? 0) && fats <= (filters.fats?.[1] ?? 100),
      carbs: carbs >= (filters.carbs?.[0] ?? 0) && carbs <= (filters.carbs?.[1] ?? 100),
      prepTime: prepTime >= (filters.prepTime?.[0] ?? 5) && prepTime <= (filters.prepTime?.[1] ?? 120),
    };

    if (!isSearchApplied) return true;

    return titleMatch && Object.values(inRange).every(Boolean);
  });
}


  const handleSearch = ({ searchTerm, selectedType, range }) => {
    setSearchTerm(searchTerm);
    setSelectedType(selectedType);
    setFilters(range);
    setIsSearchApplied(true); // Активуємо фільтрацію
  };

  return (
    <>
      <div className="recipes-container">
        <h1 className="recipes-section-title">Відібрані рецепти</h1>
      </div>

      <RecipeSection />

      <RecipeSearch
        filters={recipeFilters}
        typeOptions={["Сніданок", "Обід", "Вечеря", "Перекус", "Десерт"]}
        onSearch={handleSearch}
      />

      <RecipeCategorySection
        title="Рецепти з високим вмістом білка"
        description="Почніть свій день з білкових сніданків — ситно, корисно та смачно."
        recipes={filterRecipes(highProteinRecipes)}
      />
      <RecipeCategorySection
        title="Рецепти без молока"
        description="Ідеально для тих, хто уникає лактози або дотримується безмолочної дієти."
        recipes={filterRecipes(dairyFreeRecipes)}
      />
      <RecipeCategorySection
        title="Вегетаріанські рецепти"
        description="Смачні страви без м’яса — для здорового та збалансованого харчування."
        recipes={filterRecipes(vegetarianRecipes)}
      />
      <RecipeCategorySection
        title="Рецепти з високим вмістом вуглеводів"
        description="Енергійні страви для спортсменів і тих, хто потребує додаткової енергії."
        recipes={filterRecipes(highCarbRecipes)}
      />
    </>
  );
}

export default Recipes;
