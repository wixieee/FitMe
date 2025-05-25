import React, { useEffect, useState, useRef } from "react";
import "./calculator.css";
import "../assets/variables.css";
import { doc, getDoc, setDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";

// Перевірка ініціалізації Firebase
console.log('Firebase initialized:', !!db);

const Calculator = () => {
  const [selectedOption, setSelectedOption] = useState("calories");
  const [baseCalories, setBaseCalories] = useState(2100);
  const [totalCalories, setTotalCalories] = useState(2100);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [foods, setFoods] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const auth = getAuth();

    const loadUserData = async (user) => {
      if (!user) {
        console.log('Неможливо завантажити дані: користувач не авторизований');
        setFoods([]);
        setConsumedCalories(0);
        return;
      }

      try {
        // Завантаження збережених страв
        const caloriesRef = doc(db, "calories", user.uid);
        const unsubscribeCalories = onSnapshot(caloriesRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            if (data.foods && Array.isArray(data.foods)) {
              setFoods(data.foods);
              const totalCals = data.foods.reduce((sum, food) => sum + (food.calories || 0), 0);
              setConsumedCalories(totalCals);
            }
          }
        });

        // Завантаження базових калорій
        const userRef = doc(db, "users", user.uid);
        const unsubscribeUser = onSnapshot(userRef, (doc) => {
          if (doc.exists() && doc.data().calories !== undefined) {
            setBaseCalories(doc.data().calories);
            localStorage.setItem("baseCalories", doc.data().calories);
          } else {
            console.warn("Поле 'calories' не знайдено або документ не існує.");
          }
        });

        return () => {
          unsubscribeCalories();
          unsubscribeUser();
        };
      } catch (error) {
        console.error("Помилка при завантаженні даних:", error);
        setFoods([]);
        setConsumedCalories(0);
      }
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      console.log('Зміна стану авторизації:', !!user);
      if (user) {
        loadUserData(user);
      } else {
        setFoods([]);
        setConsumedCalories(0);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    // Швидке встановлення з localStorage
    const savedBaseCalories = localStorage.getItem("baseCalories");
    if (savedBaseCalories) {
      setBaseCalories(Number(savedBaseCalories));
    }

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

    return () => unsubscribe();
  }, [userId]);
  // Оновлюємо totalCalories при зміні selectedOption або baseCalories
  useEffect(() => {
    let adjustedCalories = baseCalories;
    if (selectedOption === "weightLose") {
      adjustedCalories = baseCalories - 400;
    } else if (selectedOption === "weightGain") {
      adjustedCalories = baseCalories + 400;
    }
    setTotalCalories(adjustedCalories);
  }, [selectedOption, baseCalories]);

  // Оновлення відсотка кільця
  useEffect(() => {
    if (totalCalories > 0) {
      const target = (consumedCalories / totalCalories) * 100;
      const timeout = setTimeout(() => {
        setPercentage(target);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [consumedCalories, totalCalories]);

  // Додаємо обробник кліку поза межами випадаючого списку
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowDropdown(false);
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

  const handleFoodSelect = (recipe) => {
    
    const newFood = {
      name: recipe.title,
      calories: recipe.calories || 0,
      addedAt: new Date().toISOString()
    };

    console.log('Додаємо нову страву:', newFood);
    setFoods(prevFoods => {
      const updatedFoods = [...prevFoods, newFood];
      return updatedFoods;
    });

    setSearchTerm("");
    setShowDropdown(false);
  };

  // Окремий useEffect для збереження даних
  useEffect(() => {
    const saveUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        console.log('Неможливо зберегти дані: користувач не авторизований');
        return;
      }

      try {
        console.log('Починаємо збереження даних. Foods:', foods);
        const totalCals = foods.reduce((sum, food) => sum + (food.calories || 0), 0);

        // Зберігаємо в колекцію calories
        const caloriesRef = doc(db, "calories", user.uid);
        await setDoc(caloriesRef, {
          foods: foods,
          totalCalories: totalCals,
          updatedAt: new Date().toISOString()
        });

        console.log('Дані успішно збережені в Firebase');
        setConsumedCalories(totalCals);
      } catch (error) {
        console.error("Помилка при збереженні даних:", error);
      }
    };

    // Зберігаємо дані тільки якщо є що зберігати
    if (foods && foods.length > 0) {
      console.log('Запускаємо збереження даних...');
      saveUserData();
    }
  }, [foods]);

  const handleDeleteFood = async (index) => {
    console.log('Видаляємо страву з індексом:', index);
    
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.log('Неможливо видалити: користувач не авторизований');
      return;
    }

    try {
      // Оновлюємо локальний стан
      const updatedFoods = foods.filter((_, i) => i !== index);
      setFoods(updatedFoods);
      
      // Оновлюємо дані в Firebase
      const caloriesRef = doc(db, "calories", user.uid);
      const totalCals = updatedFoods.reduce((sum, food) => sum + (food.calories || 0), 0);
      
      await setDoc(caloriesRef, {
        foods: updatedFoods,
        totalCalories: totalCals,
        updatedAt: new Date().toISOString()
      });

      setConsumedCalories(totalCals);
      console.log('Страву успішно видалено з бази даних');
    } catch (error) {
      console.error("Помилка при видаленні страви:", error);
    }
  };

  const handleDeleteWorkout = (index) => {
    setWorkouts(prev => prev.filter((_, i) => i !== index));
  };

  // Додавання тренування
  const handleAddWorkout = (name, burned) => {
    setWorkouts(prev => [...prev, {
      name,
      burned: parseInt(burned) || 0,
      addedAt: new Date().toISOString()
    }]);
  };

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
              <span className="macro-value">10/110 г</span>
            </div>
            <div className="macro">
              <span className="macro-label">Жири</span>
              <span className="macro-value">10/70 г</span>
            </div>
            <div className="macro">
              <span className="macro-label">Вуглеводи</span>
              <span className="macro-value">10/220 г</span>
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
                className="food-search"
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
            <ul className="food-list">
              {foods.map((food, index) => (
                <li key={index} className="food-item">
                  <span>{food.name}</span>
                  <div className="item-right">
                    <span className="calories">{food.calories} </span>
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
          </div>

          {/* Тренування */}
          <div className="workouts-section">
            <h2>Тренування</h2>
            <input
              type="text"
              className="workout-search"
              placeholder="Назва тренування..."
            />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;