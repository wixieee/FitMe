import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import RecipeSection from "../components/home-components/Home-RecipeSection";
import WorkoutSection from "../components/home-components/WorkoutSection";
import LoginModal from "../components/general-components/LoginModal";
import CalorieCalculator from "../components/home-components/CalorieCalculator";

import "../assets/variables.css";
import "./home.css";

function Home() {
  const [isSlider, setIsSlider] = useState(window.innerWidth <= 1520);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsSlider(window.innerWidth <= 1520);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStartClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h1>
            Зробіть тіло <br />
            <span>СВОЄЇ МРІЇ</span>
          </h1>
          <p>
            Фізична активність покращує ваше здоров'я, допомагає контролювати
            вагу, зменшує ризик захворювань, зміцнює кістки та м'язи та покращує
            вашу здатність займатися повсякденною діяльністю.
          </p>
          <button className="cta-button" onClick={handleStartClick}>
            Розпочати
          </button>
        </div>
        <div className="hero-image">
          <img src={process.env.PUBLIC_URL + "/images/gym.png"} alt="Gym" />
        </div>
      </section>

      <WorkoutSection isSlider={isSlider} />

      <div className="recipe-container">
        <h2 className="recipe-section-title">/// Рецепти</h2>
        <button onClick={() => navigate('/recipes#recipe-search')} className="view-more-btn">Переглянути більше рецептів</button>
      </div>
      <RecipeSection />
      <CalorieCalculator />

      {isModalOpen && (
        <LoginModal 
          onClose={() => setIsModalOpen(false)}
          setUser={(user) => {
            // Тут можна додати логіку для збереження користувача
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
}

export default Home;
