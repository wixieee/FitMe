import React, { useEffect, useState } from "react";
import "./calculator.css";
import "../assets/variables.css";
import { doc,  onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";  

const Calculator = () => {
  const [selectedOption, setSelectedOption] = useState("calories");
  const [baseCalories, setBaseCalories] = useState(2100);
  const [totalCalories, setTotalCalories] = useState(2100);
  const [consumedCalories, setConsumedCalories] = useState(4000);
  const [percentage, setPercentage] = useState(0);

  const [foods, setFoods] = useState([
    { name: "Куряча грудка", calories: 165 },
    { name: "Салат з тунцем", calories: 210 },
  ]);

  const [workouts, setWorkouts] = useState([
    { name: "Біг", burned: 300 },
    { name: "Cилові вправи", burned: 180 },
  ]);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;

useEffect(() => {
  // 🔹 1. Спочатку зчитуємо з localStorage, щоб миттєво показати користувачу
  const savedBaseCalories = localStorage.getItem("baseCalories");
  if (savedBaseCalories) {
    setBaseCalories(Number(savedBaseCalories));
  }

  // 🔹 2. Підключаємо слухача Firestore
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

  // 🔹 3. Відписка при розмонтуванні компонента
  return () => unsubscribe();
}, [userId]);

  // 🔁 Оновлюємо totalCalories при зміні selectedOption або baseCalories
  useEffect(() => {
    let adjustedCalories = baseCalories;
    if (selectedOption === "weightLose") {
      adjustedCalories = baseCalories - 400;
    } else if (selectedOption === "weightGain") {
      adjustedCalories = baseCalories + 400;
    }
    setTotalCalories(adjustedCalories);
  }, [selectedOption, baseCalories]);

  // 🔁 Оновлюємо процент кільця
  useEffect(() => {
    if (totalCalories > 0) {
      const target = (consumedCalories / totalCalories) * 100;
      const timeout = setTimeout(() => {
        setPercentage(target);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [consumedCalories, totalCalories]);

  const handleDeleteFood = (index) => {
    setFoods((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteWorkout = (index) => {
    setWorkouts((prev) => prev.filter((_, i) => i !== index));
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
            <input
              type="text"
              className="food-search"
              placeholder="Пошук страви..."
            />
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