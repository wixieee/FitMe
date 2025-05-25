import React, { useState, useEffect } from "react";
import "../../assets/variables.css";
import "./calorieCalculator.css";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import "../../firebase"
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase"; 


const saveCaloriesToFirestore = async (userId, calories) => {
  try {
    await setDoc(
      doc(db, "users", userId),
      {
        calories: parseInt(calories),
        weightLoss: (parseInt(calories - calories*0.18)),
        weightGain: (parseInt(calories + calories*0.18))
      },
      { merge: true } // щоб не перезаписати інші поля
    );
    console.log("Калорії збережено в документ users/" + userId);
  } catch (error) {
    console.error("Помилка при збереженні калорій:", error);
  }
};

const CalorieCalculator = () => {
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User UID:", user.uid);
    }
    else{
      console.log("ne regae");
    }
  });

  return () => unsubscribe();
}, []);
  
  const [age, setAge] = useState();
  const [gender, setGender] = useState();
  const [height, setHeight] = useState();
  const [weight, setWeight] = useState();
  const [activity, setActivity] = useState("sedentary");
  const [showSettings, setShowSettings] = useState(false);
  const [unitSystem, setUnitSystem] = useState();
  const [calorieSystem, setCalorieSystem] = useState();
  const [calories, setCalories] = useState(0);
   
  const calculateCalories = () => {
  if (!age || !gender || !height || !weight || !activity) {
    alert("Будь ласка, заповніть усі поля.");
    return;
  }

  // Переводимо значення у числа
  const w = parseFloat(weight);
  const h = parseFloat(height);
  const a = parseFloat(age);

  // Обчислення базового метаболізму (BMR)
  let BMR;
  if (gender === "male") {
    BMR = 10 * w + 6.25 * h - 5 * a + 5;
  } else if (gender === "female") {
    BMR = 10 * w + 6.25 * h - 5 * a - 161;
  } else {
    alert("Будь ласка, виберіть стать.");
    return;
  }

  // Коефіцієнт активності
  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const activityFactor = activityFactors[activity];
  const totalCalories = BMR * activityFactor;

  // Показати результат в обраній одиниці
  let result;
  if (calorieSystem === "kjoule") {
    result = totalCalories * 4.184;
  } else {
    result = totalCalories;
  }
  setCalories(result);
    const user = auth.currentUser;
if (user) {
  saveCaloriesToFirestore(user.uid, result);
} else {
  console.log("Користувач не авторизований");
}
};

const handleUnitSystemChange = (newUnit) => {
  if (newUnit === "imperial" && unitSystem !== "imperial") {
    setWeight((prev) => (prev ? (parseFloat(prev) * 2.20462).toFixed(1) : ""));
    setHeight((prev) => (prev ? (parseFloat(prev) / 2.54).toFixed(1) : ""));
  } else if (newUnit === "metric" && unitSystem !== "metric") {
    setWeight((prev) => (prev ? (parseFloat(prev) / 2.20462).toFixed(1) : ""));
    setHeight((prev) => (prev ? (parseFloat(prev) * 2.54).toFixed(1) : ""));
  }
  setUnitSystem(newUnit);
};

  const clearForm = () => {
    setAge("");
    setGender("");
    setHeight("");
    setWeight("");
    setActivity("");
    setShowSettings(false);
    setUnitSystem("metric");
    setCalorieSystem("calorie");
  };
  
  return (
    <section className="calculator-section">
      <div className="calculator-header">
        <h2 className="calculator-title">/// Калькулятор калорій</h2>
      </div>
      <div className="calculator-wrapper">
        <div className="calculator-container">
          <div className="age-section form-row">
            <label htmlFor="age" className="form-label">
              Вік
            </label>
            <div className="form-input-wrapper">
              <input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <span className="input-annotation"> років</span>
            </div>
          </div>

          <div className="form-row gender-section">
            <p className="form-label">Стать</p>
            <div className="gender-options">
              <label className="gender-label">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
                />
                <span className="custom-radio" />
                <span className="gender-span">Чоловік</span>
              </label>
              <label className="gender-label">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                />
                <span className="custom-radio" />
                <span className="gender-span">Жінка</span>
              </label>
            </div>
          </div>

          <div className="form-row height-section">
            <label htmlFor="height" className="form-label">
              Зріст
            </label>
            <div className="form-input-wrapper">
              <input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <span className="input-annotation">{unitSystem === "imperial" ? "inches" : "см"}</span>
            </div>
          </div>

          <div className="form-row weight-section">
            <label htmlFor="weight" className="form-label">
              Вага
            </label>
            <div className="form-input-wrapper">
              <input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <span className="input-annotation">{unitSystem === "imperial" ? "lbs" : "кг"}</span>
            </div>
          </div>

          <div className="activity-section">
            <label className="activity-label">
              Рівень активності
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
              >
                <option value="sedentary">
                  Сидячий спосіб життя: мало або зовсім немає фізичних вправ
                </option>
                <option value="light">
                  Легкий: тренування 1-3 рази на тиждень
                </option>
                <option value="moderate">
                  Помірний: тренування 4-5 разів на тиждень
                </option>
                <option value="active">
                  Активний: щоденні фізичні вправи або інтенсивні вправи 3-4
                  рази на тиждень
                </option>
                <option value="very_active">
                  Дуже активний: інтенсивні фізичні вправи 6-7 разів на тиждень
                </option>
              </select>
            </label>
          </div>

          <button
            className="settings-link"
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? "− Приховати налаштування" : "+ Налаштування"}
          </button>

          {showSettings && (
            <div className="settings-panel">
              <p className="unit-title">Одиниці виміру:</p>
              <div className="label-container">
                <label className="unit-label">
                  <input
                    type="radio"
                    name="calorieUnit"
                    value="calorie"
                    checked={calorieSystem === "calorie"}
                    onChange={() => setCalorieSystem("calorie")}
                  />
                  <span className="custom-radio" />
                  <span className="unit-span">Калорії</span>
                </label>
                <label className="unit-label">
                  <input
                    type="radio"
                    name="calorieUnit"
                    value="kjoule"
                    checked={calorieSystem === "kjoule"}
                    onChange={() => setCalorieSystem("kjoule")}
                  />
                  <span className="custom-radio" />
                  <span className="unit-span">Кілоджоулі</span>
                </label>
              </div>
              <div className="label-container">
                <label className="unit-label">
                  <input
                    type="radio"
                    name="lengthUnit"
                    value="metric"
                    checked={unitSystem === "metric"}
                    onChange={() => handleUnitSystemChange("metric")}
                  />
                  <span className="custom-radio" />
                  <span className="unit-span">Метрична (кг, см)</span>
                </label>
                <label className="unit-label">
                  <input
                    type="radio"
                    name="lengthUnit"
                    value="imperial"
                    checked={unitSystem === "imperial"}
                    onChange={() => handleUnitSystemChange("imperial")}
                  />
                  <span className="custom-radio" />
                  <span className="unit-span">Американська (lbs, inches)</span>
                </label>
              </div>
            </div>
          )}

          <div className="buttons">
            <button className="calculate" onClick={calculateCalories}>Розрахувати</button>
            <button className="clear" onClick={clearForm}>Очистити</button>
          </div>
        </div>

        <div className="results-container">
          <div className="results-header">Результат</div>
          
          <p className="results-description">
            Результати показують низку щоденних оцінок калорій, які можна
            використовувати як орієнтир, скільки калорій потрібно споживати
            щодня, щоб підтримувати, втрачати або набирати вагу.
          </p>

          <div className="result-box">
            <div className="result-item">
              <p className="result-label">Підтримувати вагу</p>
              <p className="result-value">
                {parseInt(calories)} <span className="result-unit">{calorieSystem === "kjoule" ? "Кілоджоулів/день" : "Калорій/день"}</span>
              </p>
            </div>
            <div className="result-item">
              <p className="result-label small">
                Схуднення
                <br />
                <span className="subtext">{unitSystem === "imperial" ? "1 lbs" : " 0,5 кг"}/тиждень</span>
              </p>
              <p className="result-value">
                {parseInt(calories - calories* 0.18)}   <span className="result-unit">{calorieSystem === "kjoule" ? "Кілоджоулів/день" : "Калорій/день"}</span>
              </p>
            </div>
            <div className="result-item">
              <p className="result-label small">
                Збільшення ваги
                <br />
                <span className="subtext">{unitSystem === "imperial" ? "1 lbs" : " 0,5 кг"}/тиждень</span>
              </p>
              <p className="result-value">
                {parseInt(calories+ calories* 0.18)} <span className="result-unit">{calorieSystem === "kjoule" ? "Кілоджоулів/день" : "Калорій/день"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalorieCalculator;
