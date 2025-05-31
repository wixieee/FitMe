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
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Пошук і фільтрація
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedType, setSelectedType] = useState("");

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

        // Отримання даних про вправи для кожного тренування
        const workoutsWithExercises = await Promise.all(
          trainings.map(async (training) => {
            // Базова інформація про тренування
            const workoutData = {
              image: training.imageUrl || process.env.PUBLIC_URL + "/images/workout1.png",
              time: `${training.durationMinutes || 30} хв`,
              calories: `${training.caloriesBurned || 200} ккал`,
              link: `/workout/${training.workoutNumber}`,
              title: training.title,
              workoutNumber: training.workoutNumber,
              durationMinutes: training.durationMinutes || 30,
              caloriesBurned: training.caloriesBurned || 200,
              exercises: training.exercises || [],
              exerciseNames: [], // Буде заповнено назвами вправ
              categoryLetter: training.workoutNumber && training.workoutNumber.length >= 3 ? 
                training.workoutNumber.charAt(2) : ''
            };

            // Якщо є вправи, отримуємо їх назви
            if (training.exercises && training.exercises.length > 0) {
              try {
                const exerciseNames = await Promise.all(
                  training.exercises.map(async (exerciseId) => {
                    try {
                      const exerciseResponse = await axios.get(
                        `https://fitme-sever.onrender.com/exercise?exerciseNumber=${exerciseId}`
                      );
                      const exerciseData = exerciseResponse.data.exercise;
                      return exerciseData ? (exerciseData.title || exerciseData.name || `Вправа ${exerciseId}`) : '';
                    } catch (error) {
                      console.error(`Помилка при отриманні вправи ${exerciseId}:`, error);
                      return '';
                    }
                  })
                );
                workoutData.exerciseNames = exerciseNames.filter(name => name !== '');
              } catch (error) {
                console.error(`Помилка при отриманні вправ для тренування ${training.workoutNumber}:`, error);
              }
            }

            return workoutData;
          })
        );

        setAllWorkouts(workoutsWithExercises);

        // Групування тренувань за третьою буквою в workoutNumber
        const categorizedTrainings = {};
        
        workoutsWithExercises.forEach(workout => {
          if (workout.categoryLetter) {
            if (!categorizedTrainings[workout.categoryLetter]) {
              categorizedTrainings[workout.categoryLetter] = [];
            }
            
            categorizedTrainings[workout.categoryLetter].push(workout);
          }
        });

        // Створення секцій на основі категорій
        const sections = [];
        
        Object.keys(categorizedTrainings).forEach(categoryLetter => {
          if (sectionDefinitions[categoryLetter]) {
            sections.push({
              categoryLetter,
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
  
  // Функція для парсингу числових значень з текстових полів
  const parseValue = (value) => {
    if (typeof value === 'string') {
      const match = value.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    }
    return value || 0;
  };
  
  // Функція для фільтрації тренувань
  const filterWorkouts = (workouts) => {
    if (!workouts || !Array.isArray(workouts)) return [];
    
    return workouts.filter(workout => {
      // Фільтрація за пошуковим терміном (шукаємо в назвах вправ та назві тренування)
      if (searchTerm) {
        const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(word => word.length > 0);
        
        // Перевіряємо чи є збіг у назві тренування
        const title = workout.title?.toLowerCase() || '';
        const titleMatch = searchWords.every(word => title.includes(word));
        
        // Перевіряємо чи є збіг у назвах вправ
        let exerciseMatch = false;
        if (workout.exerciseNames && workout.exerciseNames.length > 0) {
          const exerciseNamesLower = workout.exerciseNames.map(name => name.toLowerCase());
          const exerciseNamesText = exerciseNamesLower.join(' ');
          
          exerciseMatch = searchWords.every(word => {
            return exerciseNamesText.includes(word) || 
                  exerciseNamesLower.some(name => name.includes(word));
          });
        }
        
        // Якщо немає збігу ні в назві тренування, ні в назвах вправ - відфільтровуємо
        if (!titleMatch && !exerciseMatch) return false;
      }
      
      // Фільтрація за діапазоном калорій
      if (filters.calories) {
        const calories = parseValue(workout.calories);
        if (calories < filters.calories[0] || calories > filters.calories[1]) {
          return false;
        }
      }
      
      // Фільтрація за часом тренування
      if (filters.workoutTime) {
        const time = parseValue(workout.time);
        if (time < filters.workoutTime[0] || time > filters.workoutTime[1]) {
          return false;
        }
      }
      
      return true;
    });
  };
  
  // Функція для отримання тренувань за категорією
  const getWorkoutsByCategory = (categoryLetter) => {
    const section = workoutSections.find(section => section.categoryLetter === categoryLetter);
    return section ? section.workouts : [];
  };
  
  // Обробник пошуку
  const handleSearch = ({ searchTerm, selectedType, range }) => {
    setSearchTerm(searchTerm);
    setSelectedType(selectedType);
    setFilters(range);
  };

  if (loading) {
    return <div className="loading">Завантаження тренувань...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Створюємо масив опцій для фільтра типу (назви секцій)
  const typeOptions = workoutSections.map(section => section.title);
  
  // Підготовка відфільтрованих секцій
  const filteredSections = () => {
    if (selectedType) {
      // Знаходимо секцію за вибраним типом
      const selectedSection = workoutSections.find(section => section.title === selectedType);
      if (selectedSection) {
        const filteredWorkouts = filterWorkouts(selectedSection.workouts);
        if (filteredWorkouts.length > 0) {
          return [{
            ...selectedSection,
            workouts: filteredWorkouts
          }];
        }
      }
      return [];
    } else {
      // Фільтруємо всі секції
      return workoutSections
        .map(section => ({
          ...section,
          workouts: filterWorkouts(section.workouts)
        }))
        .filter(section => section.workouts.length > 0);
    }
  };

  return (
    <>
      <div className="workout-container">
        <WorkoutSection isSlider={isSlider} />
      </div>
      <WorkoutSearch
        filters={workoutFilters}
        typeOptions={typeOptions}
        onSearch={handleSearch}
        placeholder="Пошук тренувань..."
      />
      {filteredSections().length > 0 ? (
        filteredSections().map((section, index) => (
          <WorkoutCategorySection
            key={index}
            title={section.title}
            description={section.description}
            workouts={section.workouts}
          />
        ))
      ) : (
        <div style={{ color: '#888', textAlign: 'center', padding: '3rem', fontSize: '1.2rem', background: 'transparent' }}>
          Тренування не знайдено
        </div>
      )}
    </>
  );
}

export default Workouts;
