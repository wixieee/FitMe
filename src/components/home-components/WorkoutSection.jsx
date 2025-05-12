
import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../../assets/variables.css";
import "./workoutSection.css";

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

const WorkoutCard = ({ image, label }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/workouts/${encodeURIComponent(label)}`);
  };

  return (
    <div className="workout-card" onClick={handleClick}>
      <div className="card-image" style={{ backgroundImage: `url(${image})` }}>
        <div className="label">{label}</div>
      </div>
      <button className="start-button">Розпочати</button>
    </div>
  );
};

const WorkoutPrograms = ({ isSlider }) => {
  return (
    <section className="programs-section">
      <h2>Програми тренуваннь</h2>

      {isSlider ? (
        <Swiper
          modules={[Navigation]}
          slidesPerView={1}
          navigation
          loop={true}
          breakpoints={{
            0: { slidesPerView: 1 },
            800: { slidesPerView: 2 },
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
  );
};

export default WorkoutPrograms;
