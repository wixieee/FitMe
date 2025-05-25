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

const API_URL = "https://fitme-sever.onrender.com/recipes/by-category";

function RecipeCategorySection({ title, description, recipes }) {
  if (!recipes.length) return null;

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
  const location = useLocation();

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

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 10,
            behavior: 'smooth'
          });
        }
      }, 500);
    }
  }, [location.hash]);

  function parseValue(value) {
    if (!value || value === "—") return undefined;
    const match = value.toString().match(/[\d,.]+/);
    if (!match) return undefined;
    const numStr = match[0].replace(',', '.');
    return Number(numStr);
  }

  const categoryToApiMapping = {
    "Рецепти з високим вмістом білка": "Рецепти з високим вмістом білка",
    "Рецепти без молока": "Рецепти без молока",
    "Вегетеріанські рецепти": "Вегетеріанські рецепти",
    "Рецепти з високим вмістом вуглеводів": "Рецепти з високим вмістом вуглеводів"
  };

  function filterRecipes(recipes) {
    return recipes.filter((recipe) => {
      if (!recipe || !recipe.title) return false;

      const normalizedTitle = recipe.title.toLowerCase();
      const searchWords = searchTerm.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0);
      
      const titleMatch = searchWords.length === 0 || searchWords.every(word => 
        normalizedTitle.includes(word)
      );

      let categoryMatch = true;
      if (selectedType) {
        if (selectedType === "Рецепти з високим вмістом білка") {
          categoryMatch = highProteinRecipes.some(r => r.id === recipe.id);
        } else if (selectedType === "Рецепти без молока") {
          categoryMatch = dairyFreeRecipes.some(r => r.id === recipe.id);
        } else if (selectedType === "Вегетеріанські рецепти") {
          categoryMatch = vegetarianRecipes.some(r => r.id === recipe.id);
        } else if (selectedType === "Рецепти з високим вмістом вуглеводів") {
          categoryMatch = highCarbRecipes.some(r => r.id === recipe.id);
        }
      }
    
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

      return titleMatch && categoryMatch && Object.values(inRange).every(Boolean);
    });
  }

  const handleSearch = ({ searchTerm, selectedType, range }) => {
    setSearchTerm(searchTerm);
    setSelectedType(selectedType);
    setFilters(range);
  };

  const getRecipesByCategory = (category) => {
    switch(category) {
      case "Рецепти з високим вмістом білка":
        return highProteinRecipes;
      case "Рецепти без молока":
        return dairyFreeRecipes;
      case "Вегетеріанські рецепти":
        return vegetarianRecipes;
      case "Рецепти з високим вмістом вуглеводів":
        return highCarbRecipes;
      default:
        return [...highProteinRecipes, ...dairyFreeRecipes, ...vegetarianRecipes, ...highCarbRecipes];
    }
  };

  return (
    <>
      <div className="recipes-container">
        <h1 className="recipes-section-title">Відібрані рецепти</h1>
      </div>

      <RecipeSection />

      <RecipeSearch
        filters={recipeFilters}
        typeOptions={[
          "Рецепти з високим вмістом білка",
          "Рецепти без молока",
          "Вегетеріанські рецепти",
          "Рецепти з високим вмістом вуглеводів"
        ]}
        onSearch={handleSearch}
      />

      {selectedType ? (
        <RecipeCategorySection
          title={selectedType}
          description="Обрані рецепти за категорією"
          recipes={filterRecipes(getRecipesByCategory(selectedType))}
        />
      ) : (
        <>
          {filterRecipes(highProteinRecipes).length > 0 && (
            <section id="high-protein">
              <RecipeCategorySection
                title="Рецепти з високим вмістом білка"
                description="Почніть свій день з білкових сніданків — ситно, корисно та смачно."
                recipes={filterRecipes(highProteinRecipes)}
              />
            </section>
          )}

          {filterRecipes(dairyFreeRecipes).length > 0 && (
            <section id="dairy-free">
              <RecipeCategorySection
                title="Рецепти без молока"
                description="Ідеально для тих, хто уникає лактози або дотримується безмолочної дієти."
                recipes={filterRecipes(dairyFreeRecipes)}
              />
            </section>
          )}

          {filterRecipes(vegetarianRecipes).length > 0 && (
            <section id="vegetarian">
              <RecipeCategorySection
                title="Вегетаріанські рецепти"
                description="Смачні страви без м'яса — для здорового та збалансованого харчування."
                recipes={filterRecipes(vegetarianRecipes)}
              />
            </section>
          )}

          {filterRecipes(highCarbRecipes).length > 0 && (
            <section id="high-carb">
              <RecipeCategorySection
                title="Рецепти з високим вмістом вуглеводів"
                description="Енергійні страви для спортсменів і тих, хто потребує додаткової енергії."
                recipes={filterRecipes(highCarbRecipes)}
              />
            </section>
          )}
        </>
      )}
    </>
  );
}

export default Recipes;
