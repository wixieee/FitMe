import React, { useEffect, useState, useRef } from "react";
import "./calculator.css";
import "../assets/variables.css";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import axios from "axios";

const Calculator = () => {
  const [selectedOption, setSelectedOption] = useState("calories");
  const searchContainerRef = useRef(null);
  const [baseCalories, setBaseCalories] = useState(2100); // з Firestore
  const [totalCalories, setTotalCalories] = useState(2100); // фактичне (з урахуванням опції)
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Додаємо стани для відстеження макронутрієнтів
  const [consumedProteins, setConsumedProteins] = useState(0);
  const [consumedFats, setConsumedFats] = useState(0);
  const [consumedCarbs, setConsumedCarbs] = useState(0);
  
  // Для пошуку тренувань
  const [workoutSearchTerm, setWorkoutSearchTerm] = useState("");
  const [workoutSearchResults, setWorkoutSearchResults] = useState([]);
  const [showWorkoutDropdown, setShowWorkoutDropdown] = useState(false);
  const workoutSearchContainerRef = useRef(null);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);

  const [foods, setFoods] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;

useEffect(() => {
  // Завантаження їжі з localStorage
  const savedFoods = localStorage.getItem("foods");
  if (savedFoods) {
    setFoods(JSON.parse(savedFoods));
  }
  
  // Завантаження тренувань з localStorage
  const savedWorkouts = localStorage.getItem("workouts");
  let workoutsArr = savedWorkouts ? JSON.parse(savedWorkouts) : [];

  // Додаємо завершені тренування з completedWorkouts (без дублікатів)
  const completed = localStorage.getItem("completedWorkouts");
  if (completed) {
    const completedArr = JSON.parse(completed);
    // Додаємо лише ті, яких ще немає у workouts
    completedArr.forEach(cw => {
      if (!workoutsArr.some(w => w.name === cw.name && w.burned === cw.burned)) {
        workoutsArr.push({ name: cw.name, burned: cw.burned, addedAt: cw.addedAt });
      }
    });
    // Оновлюємо localStorage, якщо щось додали
    localStorage.setItem("workouts", JSON.stringify(workoutsArr));
  }
  setWorkouts(workoutsArr);
}, []);

useEffect(() => {
  // 🔺 1. Спочатку зчитуємо з localStorage, щоб миттєво показати користувачу
  const savedBaseCalories = localStorage.getItem("baseCalories");
  if (savedBaseCalories) {
    setBaseCalories(Number(savedBaseCalories));
  }

  // 🔺 2. Підключаємо слухача Firestore
  if (!userId) {
    console.warn("userId не передано");
    return;
  }

  const docRef = doc(db, "users", userId);

  const unsubscribe = onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.calories !== undefined) {
          setBaseCalories(data.calories);
          localStorage.setItem("baseCalories", data.calories);
        } else {
          console.warn("Поле 'calories' не знайдено в документі.");
        }
      } else {
        console.warn("Документ не існує.");
      }
    },
    (error) => {
      console.error("Помилка при підписці на зміни документа:", error);
    }
  );

  // 🔺 3. Відписка при розмонтуванні компонента
  return () => unsubscribe();
}, [userId]);

let adjustedCalories = baseCalories;
// 🔁 Оновлюємо totalCalories при зміні selectedOption або baseCalories
useEffect(() => {

  if (selectedOption === "weightLose") {
    adjustedCalories = baseCalories - 429;
  } else if (selectedOption === "weightGain") {
    adjustedCalories = baseCalories + 497;
  }
  setTotalCalories(adjustedCalories);
}, [selectedOption, baseCalories]);

// 🔁 Оновлюємо процент кільця
useEffect(() => {
  if (totalCalories > 0 && typeof consumedCalories === "number" && !isNaN(consumedCalories)) {
    const target = (consumedCalories / totalCalories) * 100;
    const timeout = setTimeout(() => {
      setPercentage(Math.max(0, target)); // захист від від'ємних %
    }, 100);
    return () => clearTimeout(timeout);
  } else {
    setPercentage(0);
  }
}, [consumedCalories, totalCalories]);

useEffect(() => {
  if (
    typeof consumedCalories === "number" &&
    typeof totalCalories === "number" &&
    totalCalories > 0
  ) {
    const target = (consumedCalories / totalCalories) * 100;
    setPercentage(target);
  } else {
    setPercentage(0);
  }
}, [consumedCalories, totalCalories]);

// Розрахунок спожитих калорій та макронутрієнтів на основі доданих страв
useEffect(() => {
  const totalFoodCalories = Array.isArray(foods)
    ? foods.reduce((sum, food) => sum + (Number(food.calories) || 0), 0)
    : 0;

  const totalWorkoutCalories = Array.isArray(workouts)
    ? workouts.reduce((sum, workout) => sum + (Number(workout.burned) || 0), 0)
    : 0;

  const result = totalFoodCalories - totalWorkoutCalories;

  setConsumedCalories(result >= 0 ? result : 0);
  
  // Розрахунок макронутрієнтів з доданих страв
  if (Array.isArray(foods)) {
    const totalProteins = foods.reduce((sum, food) => sum + (Number(food.proteins) || 0), 0);
    const totalFats = foods.reduce((sum, food) => sum + (Number(food.fats) || 0), 0);
    const totalCarbs = foods.reduce((sum, food) => sum + (Number(food.carbs) || 0), 0);
    
    setConsumedProteins(totalProteins);
    setConsumedFats(totalFats);
    setConsumedCarbs(totalCarbs);
  } else {
    setConsumedProteins(0);
    setConsumedFats(0);
    setConsumedCarbs(0);
  }
}, [foods, workouts]);

  // Додаємо обробник кліку поза межами випадаючого списку
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      
      if (workoutSearchContainerRef.current && !workoutSearchContainerRef.current.contains(event.target)) {
        setShowWorkoutDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Функція для пошуку страв
  const searchFood = async (query) => {
    try {
      const response = await fetch(`https://fitme-sever.onrender.com/recipes/all`);
      const data = await response.json();
      
      if (data.recipes && Array.isArray(data.recipes)) {
        const filteredRecipes = data.recipes.filter(recipe => {
          if (!recipe || !recipe.title) return false;

          const searchWords = query.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0);
          if (searchWords.length === 0) return false;

          // Пошук по заголовку (часткові збіги)
          const titleWords = recipe.title.toLowerCase().split(/\s+/);
          const titleMatch = searchWords.every(searchWord => 
            titleWords.some(titleWord => titleWord.includes(searchWord))
          );

          // Пошук по інгредієнтах
          const ingredients = Array.isArray(recipe.ingredients) 
            ? recipe.ingredients.join(' ').toLowerCase()
            : '';
          const ingredientMatch = searchWords.every(searchWord =>
            ingredients.includes(searchWord)
          );

          return titleMatch || ingredientMatch;
        });

        setSearchResults(filteredRecipes.slice(0, 5));
        setShowDropdown(filteredRecipes.length > 0);
      }
    } catch (error) {
      console.error('Помилка при пошуку страв:', error);
      setShowDropdown(false);
    }
  };
  
  // Функція для пошуку тренувань
  const searchWorkout = async (query) => {
    try {
      // Отримуємо всі тренування
      const response = await axios.get('https://fitme-sever.onrender.com/trainings/all');
      const trainings = response.data.trainings;
      
      if (!trainings || !Array.isArray(trainings)) {
        setWorkoutSearchResults([]);
        setShowWorkoutDropdown(false);
        return;
      }
      
      // Фільтруємо тренування з вправами
      const workoutsWithExercises = await Promise.all(
        trainings
          .filter(training => training.exercises && training.exercises.length > 0)
          .map(async (training) => {
            try {
              // Отримуємо назви вправ для кожного тренування
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
              
              return {
                title: training.title,
                workoutNumber: training.workoutNumber,
                caloriesBurned: training.caloriesBurned || 200,
                exerciseNames: exerciseNames.filter(name => name !== ''),
                exerciseNamesText: exerciseNames.filter(name => name !== '').join(' ')
              };
            } catch (error) {
              console.error(`Помилка при отриманні вправ для тренування:`, error);
              return null;
            }
          })
      );
      
      // Фільтруємо за пошуковим запитом
      const searchWords = query.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0);
      if (searchWords.length === 0) {
        setWorkoutSearchResults([]);
        setShowWorkoutDropdown(false);
        return;
      }
      
      const filteredWorkouts = workoutsWithExercises
        .filter(workout => {
          if (!workout) return false;
          
          // Пошук у назвах вправ
          const exerciseNamesText = workout.exerciseNamesText.toLowerCase();
          const exerciseMatch = searchWords.every(searchWord => 
            exerciseNamesText.includes(searchWord)
          );
          
          // Пошук у назві тренування
          const titleMatch = searchWords.every(searchWord => 
            workout.title.toLowerCase().includes(searchWord)
          );
          
          return exerciseMatch || titleMatch;
        })
        .slice(0, 5); // Обмежуємо кількість результатів
      
      setWorkoutSearchResults(filteredWorkouts);
      setShowWorkoutDropdown(filteredWorkouts.length > 0);
      
    } catch (error) {
      console.error('Помилка при пошуку тренувань:', error);
      setWorkoutSearchResults([]);
      setShowWorkoutDropdown(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim()) {
      searchFood(value);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };
  
  // Обробник зміни поля пошуку тренувань
  const handleWorkoutSearchChange = (e) => {
    const value = e.target.value;
    setWorkoutSearchTerm(value);
    if (value.trim()) {
      searchWorkout(value);
    } else {
      setWorkoutSearchResults([]);
      setShowWorkoutDropdown(false);
    }
  };

  const handleFoodSelect = (recipe) => {
    // Отримуємо дані про рецепт з API, щоб отримати макронутрієнти
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(`https://fitme-sever.onrender.com/recipe?title=${encodeURIComponent(recipe.title)}`);
        const data = await response.json();
        
        if (data.recipe) {
          const nutrients = data.recipe.nutrients || {};
          
          // Парсимо значення макронутрієнтів (видаляємо 'г' і конвертуємо в число)
          const proteins = parseInt(nutrients.білки?.replace(/[^\d]/g, ""), 10) || 0;
          const fats = parseInt(nutrients.жири?.replace(/[^\d]/g, ""), 10) || 0;
          const carbs = parseInt(nutrients.вуглеводи?.replace(/[^\d]/g, ""), 10) || 0;
          
          const newFood = { 
            name: recipe.title, 
            calories: parseInt(recipe.calories?.toString().replace(/[^\d]/g, ""), 10) || 0,
            proteins: proteins,
            fats: fats,
            carbs: carbs
          };

          const updatedFoods = [...foods, newFood];
          setFoods(updatedFoods);
          
          // 💾 Зберегти в localStorage
          localStorage.setItem("foods", JSON.stringify(updatedFoods));
        } else {
          // Якщо деталі рецепту недоступні, додаємо лише основну інформацію
          const newFood = { 
            name: recipe.title, 
            calories: parseInt(recipe.calories?.toString().replace(/[^\d]/g, ""), 10) || 0,
            proteins: 0,
            fats: 0,
            carbs: 0
          };

          const updatedFoods = [...foods, newFood];
          setFoods(updatedFoods);
          
          // 💾 Зберегти в localStorage
          localStorage.setItem("foods", JSON.stringify(updatedFoods));
        }
      } catch (error) {
        console.error('Помилка при отриманні деталей рецепту:', error);
        // У випадку помилки додаємо рецепт без макронутрієнтів
        const newFood = { 
          name: recipe.title, 
          calories: parseInt(recipe.calories?.toString().replace(/[^\d]/g, ""), 10) || 0,
          proteins: 0,
          fats: 0,
          carbs: 0
        };

        const updatedFoods = [...foods, newFood];
        setFoods(updatedFoods);
        
        // 💾 Зберегти в localStorage
        localStorage.setItem("foods", JSON.stringify(updatedFoods));
      }
      
      setSearchTerm("");
      setShowDropdown(false);
    };
    
    fetchRecipeDetails();
  };

  // Окремий useEffect для збереження даних в Firebase (не використовується в цій версії)
  // Зараз дані зберігаються в localStorage

  const handleDeleteFood = (index) => {
  const updatedFoods = foods.filter((_, i) => i !== index);
  setFoods(updatedFoods);

  // 💾 Оновити в localStorage
  localStorage.setItem("foods", JSON.stringify(updatedFoods));
};

  const handleDeleteWorkout = (index) => {
    const updatedWorkouts = workouts.filter((_, i) => i !== index);
    setWorkouts(updatedWorkouts);

    // Зберігаємо в localStorage
    localStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
  };

  // Додавання тренування
  const handleAddWorkout = (name, burned) => {
    const updatedWorkouts = [...workouts, {
      name,
      burned: parseInt(burned) || 0,
      addedAt: new Date().toISOString()
    }];
    
    setWorkouts(updatedWorkouts);
    
    // Зберігаємо в localStorage
    localStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
  };

  // Додавання тренування з пошуку
  const handleWorkoutSelect = (workout) => {
    const newWorkout = { 
      name: workout.title, 
      burned: parseInt(workout.caloriesBurned) || 0,
      addedAt: new Date().toISOString()
    };

    const updatedWorkouts = [...workouts, newWorkout];
    setWorkouts(updatedWorkouts);
    setWorkoutSearchTerm("");
    setShowWorkoutDropdown(false);

    // Зберігаємо в localStorage
    localStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
  };

  useEffect(() => {
    const completedWorkouts = localStorage.getItem("completedWorkouts");
    if (completedWorkouts) {
      setCompletedWorkouts(JSON.parse(completedWorkouts));
    }
  }, []);

  return (
    <div className="calorie-container">
      <div className="calculator-description">
        <h1>Калькулятор калорій</h1>
        <p>
          Відстежуйте спожиті калорії та спалені під час тренувань. Користуйтеся
          цим калькулятором, щоб залишатися в межах своєї щоденної норми.
        </p>
      </div>
      <div className="calorie-content">
        <div className="left-panel">
          <div className="calculator-container">
      {/* Custom Radio Buttons */}
      <div className="goal-options">
        <label className={`custom-radio1 ${selectedOption === "calories" ? "selected" : ""}`}>
          <input
            type="radio"
            name="goal"
            value="calories"
            checked={selectedOption === "calories"}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
          Підтримка ваги
        </label>

        <label className={`custom-radio1 ${selectedOption === "weightLose" ? "selected" : ""}`}>
          <input
            type="radio"
            name="goal"
            value="weightLose"
            checked={selectedOption === "weightLose"}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
          Схуднення
        </label>

        <label className={`custom-radio1 ${selectedOption === "weightGain" ? "selected" : ""}`}>
          <input
            type="radio"
            name="goal"
            value="weightGain"
            checked={selectedOption === "weightGain"}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
          Набір ваги
        </label>
        </div>
      </div>
          <div className="circle">
            <div
              className="progress"
              style={{
                background: `conic-gradient(
                  ${percentage > 100 ? `#FF7F00 0% ${percentage - 100}%,` : ''}
                  var(--yellow) ${percentage > 100 ? `${percentage - 100}%` : '0%'} ${percentage > 100 ? '100%' : `${percentage}%`},
                  #1a1a1a ${percentage > 100 ? '100%' : `${percentage}%`} 100%
                )`
              }}
            >
              <div className="inner-ring"></div>
              <div className="center-text">
                <span>{Math.round(percentage)}%</span>
                <small>
                  {consumedCalories}/{totalCalories} ккал
                </small>
              </div>
            </div>
          </div>

          {/* Окремо макро, вже за межами кола */}
          <div className="macros-summary">
            <div className="macro">
              <span className="macro-label">Білки</span>
              <span className="macro-value">{consumedProteins} г</span>
            </div>
            <div className="macro">
              <span className="macro-label">Жири</span>
              <span className="macro-value">{consumedFats} г</span>
            </div>
            <div className="macro">
              <span className="macro-label">Вуглеводи</span>
              <span className="macro-value">{consumedCarbs} г</span>
            </div>
          </div>
        </div>

        {/* Права панель */}
        <div className="side-panel">
          {/* Їжа */}
          <div className="food-section">
            <h2>Список їжі</h2>
            <div className="search-container" ref={searchContainerRef}>
              <input
                type="text"
                className="workout-search"
                placeholder="Пошук за назвою або інгредієнтами..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {showDropdown && searchResults.length > 0 && (
                <div className="search-dropdown">
                  {searchResults.map((recipe, index) => (
                    <div 
                      key={index} 
                      className="search-item"
                      onClick={() => handleFoodSelect(recipe)}
                    >
                      <span className="search-item-title">{recipe.title}</span>
                      <span className="search-item-calories">{recipe.calories || 0}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {foods.length > 0 ? (
              <ul className="food-list">
                {foods.map((food, index) => (
                  <li key={index} className="food-item">
                    <span>{food.name}</span>
                    <div className="item-right">
                      <span className="calories">{food.calories} ккал</span>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteFood(index)}
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ color: '#888', textAlign: 'center', padding: '1rem', fontSize: '1.1rem', background: 'transparent' }}>
                Рецептів не знайдено
              </div>
            )}
          </div>

          {/* Тренування */}
          <div className="workouts-section">
            <h2>Тренування</h2>
            <div className="search-container" ref={workoutSearchContainerRef}>
              <input
                type="text"
                className="workout-search"
                placeholder="Пошук за назвою тренування або вправ..."
                value={workoutSearchTerm}
                onChange={handleWorkoutSearchChange}
              />
              {showWorkoutDropdown && workoutSearchResults.length > 0 && (
                <div className="search-dropdown">
                  {workoutSearchResults.map((workout, index) => (
                    <div 
                      key={index} 
                      className="search-item"
                      onClick={() => handleWorkoutSelect(workout)}
                    >
                      <span className="search-item-title">{workout.title}</span>
                      <span className="search-item-calories">{workout.caloriesBurned} ккал</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {workouts.length > 0 ? (
              <ul className="workout-list">
                {workouts.map((workout, index) => (
                  <li key={index} className="workout-item">
                    <span>{workout.name}</span>
                    <div className="item-right">
                      <span className="burned">{workout.burned} ккал</span>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteWorkout(index)}
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ color: '#888', textAlign: 'center', padding: '1rem', fontSize: '1.1rem', background: 'transparent' }}>
                Тренування не знайдено
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;