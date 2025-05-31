import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";

import WorkoutPageCard from "../components/workout-components/WorkoutPageCard";
import WorkoutSection from "../components/home-components/WorkoutSection";
import WorkoutSearch from "../components/general-components/Search";

import "../assets/variables.css";
import "./workouts.css";

// Визначення секцій тренувань з описами
const sectionDefinitions = {
  A: {
    title: "Для початківців",
    description: "Прості тренування з низькою інтенсивністю для поступового входження у форму. Підходить для людей без досвіду.",
  },
  B: {
    title: "Схуднення",
    description: "Кардіо та функціональні тренування, спрямовані на активне спалення калорій та зменшення ваги.",
  },
  C: {
    title: "Без обладнання",
    description: "Тренування, які можна виконувати вдома без спеціального обладнання, використовуючи лише вагу власного тіла.",
  },
  D: {
    title: "Силові тренування",
    description: "Тренування з акцентом на розвиток м'язової сили та витривалості, з використанням ваги або обладнання.",
  },
  E: {
    title: "Від середнього до просунутого",
    description: "Тренування середньої та високої інтенсивності для тих, хто вже має фізичну підготовку та хоче вдосконалювати форму.",
  },
};

function WorkoutCategorySection({ title, description, workouts }) {
  return (
    <section className="workout-section">
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
        {workouts.map((workouts, index) => (
          <SwiperSlide key={index}>
            <div className="workout-card-slide">
              <WorkoutPageCard {...workouts} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

function Workouts() {
  const [isSlider, setIsSlider] = useState(window.innerWidth <= 1520);
  const [workoutSections, setWorkoutSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsSlider(window.innerWidth <= 1520);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Отримання тренувань з сервера
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://fitme-sever.onrender.com/trainings/all');
        const trainings = response.data.trainings;

        // Групування тренувань за третьою буквою в workoutNumber
        const categorizedTrainings = {};
        
        trainings.forEach(training => {
          if (training.workoutNumber && training.workoutNumber.length >= 3) {
            const categoryLetter = training.workoutNumber.charAt(2);
            
            if (!categorizedTrainings[categoryLetter]) {
              categorizedTrainings[categoryLetter] = [];
            }
            
            categorizedTrainings[categoryLetter].push({
              image: training.imageUrl || process.env.PUBLIC_URL + "/images/workout1.png",
              time: `${training.durationMinutes || 30} хв`,
              calories: `${training.caloriesBurned || 200} ккал`,
              link: `/workout/${training.workoutNumber}`,
              title: training.title,
              workoutNumber: training.workoutNumber
            });
          }
        });

        // Створення секцій на основі категорій
        const sections = [];
        
        Object.keys(categorizedTrainings).forEach(categoryLetter => {
          if (sectionDefinitions[categoryLetter]) {
            sections.push({
              title: sectionDefinitions[categoryLetter].title,
              description: sectionDefinitions[categoryLetter].description,
              workouts: categorizedTrainings[categoryLetter]
            });
          }
        });
        
        setWorkoutSections(sections);
        setLoading(false);
      } catch (err) {
        console.error('Помилка при отриманні тренувань:', err);
        setError('Не вдалося завантажити тренування. Спробуйте пізніше.');
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  const workoutFilters = [
    { label: "Калорії", key: "calories", defaultRange: [0, 1000] },
    {
      label: "Час тренування",
      key: "workoutTime",
      defaultRange: [5, 120],
      unit: "хв",
    },
  ];

  if (loading) {
    return <div className="loading">Завантаження тренувань...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <>
      <div className="workout-container">
        <WorkoutSection isSlider={isSlider} />
      </div>
      <WorkoutSearch
        filters={workoutFilters}
        typeOptions={["Легко", "Середньо", "Складно"]}
        onSearch={(data) => console.log("Workout search", data)}
      />
      {workoutSections.length > 0 ? (
        workoutSections.map((section, index) => (
          <WorkoutCategorySection
            key={index}
            title={section.title}
            description={section.description}
            workouts={section.workouts}
          />
        ))
      ) : (
        <div className="no-workouts">Тренування не знайдено</div>
      )}
    </>
  );
}

export default Workouts;
