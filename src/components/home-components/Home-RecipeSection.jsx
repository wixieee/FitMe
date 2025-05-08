import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../assets/variables.css";
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
      link: "/recipes/high-protein",
    },
    {
      img: "/images/recipe2.png",
      title: "Рецепти з низьким вмістом вуглеводів",
      link: "/recipes/low-carb",
    },
    {
      img: "/images/recipe3.png",
      title: "Рецепти без молока",
      link: "/recipes/dairy-free",
    },
    {
      img: "/images/recipe4.png",
      title: "Вегетаріанські рецепти",
      link: "/recipes/vegetarian",
    },
  ];

  return (
    <>
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
              кіноа. Доповнюється корисним і смачним соусом сатай та подрібненим
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
                0: { slidesPerView: 1 },
                700: { slidesPerView: 2 },
                900: { slidesPerView: 3 },
              }}
            >
              {recipes.map((r, index) => (
                <SwiperSlide key={index}>
                  <Link to={r.link} className="small-recipe">
                    <img
                      className="small-recipe-img"
                      src={process.env.PUBLIC_URL + r.img}
                      alt={r.title}
                    />
                    <p className="small-recipe-title">{r.title}</p>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <ul>
              {recipes.map((r, index) => (
                <li key={index}>
                  <Link to={r.link} className="small-recipe">
                    <img
                      className="small-recipe-img"
                      src={process.env.PUBLIC_URL + r.img}
                      alt={r.title}
                    />
                    <p className="small-recipe-title">{r.title}</p>
                  </Link>
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
