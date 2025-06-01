import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "../../assets/variables.css";
import "./workoutSection.css";

const workoutData = [
  {
    label: "Для початківців",
    image: process.env.PUBLIC_URL + "/images/beginner.png",
    sectionId: "beginners",
    order: 1,
    categoryLetter: "A"
  },
  {
    label: "Схуднення",
    image: process.env.PUBLIC_URL + "/images/weight-loss.png",
    sectionId: "weight-loss",
    order: 2,
    categoryLetter: "B"
  },
  {
    label: "Без обладнання",
    image: process.env.PUBLIC_URL + "/images/no-equipment.png",
    sectionId: "no-equipment",
    order: 3,
    categoryLetter: "C"
  },
  {
    label: "Силові тренування",
    image: process.env.PUBLIC_URL + "/images/strenght.png",
    sectionId: "strength",
    order: 4,
    categoryLetter: "D"
  },
  {
    label: "Від середнього до просунутого",
    image: process.env.PUBLIC_URL + "/images/advanced.png",
    sectionId: "advanced",
    order: 5,
    categoryLetter: "E"
  }
];

// Функція для отримання випадкового тренування за категорією
const getRandomWorkoutForCategory = (trainings, categoryLetter) => {
  if (!trainings || trainings.length === 0) return null;
  
  // Фільтруємо тренування за категорією
  const categoryTrainings = trainings.filter(training => 
    training.workoutNumber && 
    training.workoutNumber.length >= 3 && 
    training.workoutNumber.charAt(2) === categoryLetter
  );
  
  if (categoryTrainings.length === 0) return null;
  
  // Вибираємо випадкове тренування з відфільтрованих
  const randomIndex = Math.floor(Math.random() * categoryTrainings.length);
  return categoryTrainings[randomIndex];
};

const WorkoutCard = ({ image, label, sectionId, categoryLetter }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [randomWorkout, setRandomWorkout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allTrainings, setAllTrainings] = useState([]);

  // Функція для отримання тренувань
  const fetchTrainings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://fitme-sever.onrender.com/trainings/all');
      const trainings = response.data.trainings;
      setAllTrainings(trainings);
      
      const workout = getRandomWorkoutForCategory(trainings, categoryLetter);
      setRandomWorkout(workout);
      
      setLoading(false);
    } catch (err) {
      console.error('Помилка при отриманні тренувань:', err);
      setLoading(false);
    }
  }, [categoryLetter]);

  // Завантажуємо тренування при монтуванні компонента
  useEffect(() => {
    fetchTrainings();
  }, [fetchTrainings]);

  // Функція для отримання нового випадкового тренування
  const getNewRandomWorkout = () => {
    const workout = getRandomWorkoutForCategory(allTrainings, categoryLetter);
    setRandomWorkout(workout);
  };

  const handleImageClick = () => {
    if (location.pathname !== '/workouts') {
      // Якщо ми не на сторінці тренувань, переходимо туди і додаємо хеш для скролу
      navigate(`/workouts#${sectionId}`);
    } else {
      // Якщо ми вже на сторінці тренувань, просто скролимо до потрібної секції
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleStartButtonClick = () => {
    if (randomWorkout) {
      navigate(`/workout/${randomWorkout.workoutNumber}`);
    } else if (loading) {
      // Якщо тренування завантажуються, нічого не робимо
      return;
    } else {
      // Якщо тренування не знайдено, спробуємо отримати нове
      getNewRandomWorkout();
      // Якщо все ще немає тренування, переходимо до секції
      if (!randomWorkout) {
        handleImageClick();
      }
    }
  };

  return (
    <div className="workout-card">
      <div 
        className="card-image" 
        style={{ backgroundImage: `url(${image})` }}
        onClick={handleImageClick}
      >
        <div className="label">{label}</div>
      </div>
      <button 
        className="start-button" 
        onClick={handleStartButtonClick}
        disabled={loading}
      >
        {loading ? "Завантаження..." : "Розпочати"}
      </button>
    </div>
  );
};

const WorkoutPrograms = ({ isSlider }) => {
  // Сортуємо картки за порядковим номером
  const sortedWorkoutData = [...workoutData].sort((a, b) => a.order - b.order);

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
          {sortedWorkoutData.map((card, index) => (
            <SwiperSlide key={index}>
              <WorkoutCard {...card} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="workout-grid">
          {sortedWorkoutData.map((card, index) => (
            <WorkoutCard key={index} {...card} />
          ))}
        </div>
      )}
    </section>
  );
};

export default WorkoutPrograms;
