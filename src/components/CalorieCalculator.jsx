import React, { useState } from "react";
import "../assets/variables.css";
import "./calorieCalculator.css";

const CalorieCalculator = () => {
  const [age, setAge] = useState();
  const [gender, setGender] = useState();
  const [height, setHeight] = useState();
  const [weight, setWeight] = useState();
  const [activity, setActivity] = useState();
  const [showSettings, setShowSettings] = useState(false);
  const [unitSystem, setUnitSystem] = useState("metric");

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
              <span className="input-annotation">15 - 80 років</span>
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
              <span className="input-annotation">см</span>
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
              <span className="input-annotation">кг</span>
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
                    name="unit"
                    value="calorie"
                    checked={unitSystem === "calorie"}
                    onChange={() => setUnitSystem("calorie")}
                  />
                  <span className="unit-span">Калорії</span>
                </label>
                <label className="unit-label">
                  <input
                    type="radio"
                    name="unit"
                    value="kjoule"
                    checked={unitSystem === "kjoule"}
                    onChange={() => setUnitSystem("kjoule")}
                  />
                  <span className="unit-span">Кілоджоулі</span>
                </label>
              </div>
              <div className="label-container">
                <label className="unit-label">
                  <input
                    type="radio"
                    name="unit"
                    value="metric"
                    checked={unitSystem === "metric"}
                    onChange={() => setUnitSystem("metric")}
                  />
                  <span className="unit-span">Метрична (кг, см)</span>
                </label>
                <label className="unit-label">
                  <input
                    type="radio"
                    name="unit"
                    value="imperial"
                    checked={unitSystem === "imperial"}
                    onChange={() => setUnitSystem("imperial")}
                  />
                  <span className="unit-span">Американська (lbs, inches)</span>
                </label>
              </div>
            </div>
          )}

          <div className="buttons">
            <button className="calculate">Розрахувати</button>
            <button className="clear">Очистити</button>
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
                2,425 <span className="result-unit">Калорій/день</span>
              </p>
            </div>
            <div className="result-item">
              <p className="result-label small">
                Схуднення
                <br />
                <span className="subtext">0.5 кг/тиждень</span>
              </p>
              <p className="result-value">
                1,925 <span className="result-unit">Калорій/день</span>
              </p>
            </div>
            <div className="result-item">
              <p className="result-label small">
                Збільшення ваги
                <br />
                <span className="subtext">0.5 кг/тиждень</span>
              </p>
              <p className="result-value">
                1,925 <span className="result-unit">Калорій/день</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalorieCalculator;
