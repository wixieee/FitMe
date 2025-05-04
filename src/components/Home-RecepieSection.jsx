import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../assets/variables.css";
import "./Home-RecipeSection.css";

function RecipeSection() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 950);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 950);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const recipes = [
    {
      img: "/images/recipe1.png",
      title: "Рецепти з високим вмістом білка",
    },
    {
      img: "/images/recipe2.png",
      title: "Рецепти з низьким вмістом вуглеводів",
    },
    {
      img: "/images/recipe3.png",
      title: "Рецепти без молока",
    },
    {
      img: "/images/recipe4.png",
      title: "Вегетаріанські рецепти",
    },
  ];

  return (
    <>
      <div className="recipe-container">
        <h2 className="recipe-section-title">/// Рецепти</h2>
        <button className="view-more-btn">Переглянути більше рецептів</button>
      </div>

      <section className="recipe-section">
        <div className="recipe-main">
          <img
            src={process.env.PUBLIC_URL + "/images/recipe-main.png"}
            alt="Protein Bowl"
            className="recipe-img"
          />
          <div className="recipe-text">
            <h3>Низькокалорійна страва, наповнена протеїном</h3>
            <p>
              Барвиста страва, насичена протеїном, наповнена ароматним м’ясним
              ситним тофу на грилі та набором яскравих овочів на ложі з пухкої
              кіноа.Доповнюється корисним і смачним соусом сатай та подрібненим
              смаженим арахісом. Дуже смачно!
            </p>
            <button className="view-full-btn">
              Переглянути рецепт<i className="bx bxs-right-arrow-circle"></i>
            </button>
          </div>
        </div>

        <div className="recipe-categories">
          {isMobile ? (
            <Swiper
              modules={[Navigation]}
              slidesPerView={1}
              navigation
              loop={true}
              breakpoints={{
                0: { slidesPerView: 2 },
                950: { slidesPerView: 3 },
              }}
            >
              {recipes.map((r, index) => (
                <SwiperSlide key={index}>
                  <div className="small-recipe-slide">
                    <img
                      className="small-recipe-img"
                      src={process.env.PUBLIC_URL + r.img}
                      alt=""
                    />
                    <p className="small-recipe-title">{r.title}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <ul>
              {recipes.map((r, index) => (
                <li key={index}>
                  <img
                    className="small-recipe-img"
                    src={process.env.PUBLIC_URL + r.img}
                    alt=""
                  />
                  {r.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}

export default RecipeSection;
