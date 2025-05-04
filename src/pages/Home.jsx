import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import Header from "../components/Header";
import WorkoutCard from "../components/WorkoutCard";
import RecipeSection from "../components/Home-RecepieSection";
import ContactSection from "../components/ContactSection";
import CalorieCalculator from "../components/CalorieCalculator";
import Footer from "../components/Footer";

import "../assets/variables.css";
import "./home.css";

const workoutData = [
  {
    label: "Для початківців",
    image: process.env.PUBLIC_URL + "/images/beginner.png",
  },
  {
    label: "Від середнього до просунутого",
    image: process.env.PUBLIC_URL + "/images/advanced.png",
  },
  {
    label: "Схуднення",
    image: process.env.PUBLIC_URL + "/images/weight-loss.png",
  },
  {
    label: "Без обладнання",
    image: process.env.PUBLIC_URL + "/images/no-equipment.png",
  },
  {
    label: "Силові тренування",
    image: process.env.PUBLIC_URL + "/images/strenght.png",
  },
];

function Home() {
  const [isSlider, setIsSlider] = useState(window.innerWidth <= 1520);

  useEffect(() => {
    const handleResize = () => {
      setIsSlider(window.innerWidth <= 1520);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Header />
      <section className="hero">
        <div className="hero-text">
          <h1>
            Зробіть тіло <br />
            <span>СВОЄЇ МРІЇ</span>
          </h1>
          <p>
            Фізична активність покращує ваше здоров’я, допомагає контролювати
            вагу, зменшує ризик захворювань, зміцнює кістки та м’язи та покращує
            вашу здатність займатися повсякденною діяльністю.
          </p>
          <button className="cta-button">Розпочати</button>
        </div>
        <div className="hero-image">
          <img src={process.env.PUBLIC_URL + "/images/gym.png"} alt="Gym" />
        </div>
      </section>

      <section className="programs-section">
        <h2>Програми тренуваннь</h2>

        {isSlider ? (
          <Swiper
            modules={[Navigation]}
            slidesPerView={1}
            navigation
            loop={true}
            breakpoints={{
              0: { slidesPerView: 2 },
              1000: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
              1400: { slidesPerView: 4 },
            }}
          >
            {workoutData.map((card, index) => (
              <SwiperSlide key={index}>
                <WorkoutCard {...card} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="workout-grid">
            {workoutData.map((card, index) => (
              <WorkoutCard key={index} {...card} />
            ))}
          </div>
        )}
      </section>

      <RecipeSection />
      <CalorieCalculator/>
      <ContactSection />
      <Footer />
    </>
  );
}

export default Home;
