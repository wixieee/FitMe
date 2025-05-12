import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import Header from "../components/general-components/Header";
import ContactSection from "../components/general-components/ContactSection";
import Footer from "../components/general-components/Footer";
import RecipeCard from "../components/recipe-components/RecipeCard";
import RecipeSection from "../components/home-components/Home-RecipeSection";

import "../assets/variables.css";
import "./recipes.css";

const recipeSections = [
  {
    title: "Рецепти з високим вмістом білка",
    description:
      "Почніть свій день з білкових сніданків — ситно, корисно та смачно.",
    recipes: [
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
    ],
  },
  {
    title: "Рецепти з низьким вмістом вуглеводів",
    description: "Збалансоване харчування без надлишку вуглеводів.",
    recipes: [
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "25 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
    ],
  },
  {
    title: "Рецепти без молока",
    description: "Смачні страви для тих, хто уникає лактози.",
    recipes: [
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "20 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
    ],
  },
  {
    title: "Вегетаріанські рецепти",
    description: "Здорові, яскраві страви без м'яса.",
    recipes: [
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "15 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/recipe5.png",
        time: "30–40 хв",
        calories: "2048 ккал",
        link: "/recipes/1",
      },
    ],
  },
];

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
  return (
    <>
      <div className="recipes-container">
        <h1 className="recipes-section-title">Відібрані рецепти</h1>
      </div>
      <RecipeSection />
      {recipeSections.map((section, index) => (
        <RecipeCategorySection
          key={index}
          title={section.title}
          description={section.description}
          recipes={section.recipes}
        />
      ))}
    </>
  );
}

export default Recipes;
