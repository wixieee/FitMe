import React, { useState } from "react";
import "./aboutUs.css";
import LoginModal from "../components/general-components/LoginModal";

const AboutUs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleOpenModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="about-hero">
        <div className="overlay">
          <div className="contents">
            <h1>
              отримайте більше від своєї <span>Фітнес-подорожі</span>
            </h1>
            <p className="subtitle">
              Приєднуйтесь до спільноти, щоб відстежувати свій прогрес
            </p>
            <p className="description">
              Ми допомагаємо людям досягати своїх цілей — з програмами
              тренувань, раціоном і підтримкою. FitMe — це ваш фітнес-гід 24/7.
            </p>
            <button onClick={handleOpenModal} className="join-button">
              Створити акаунт
            </button>
          </div>
        </div>
      </section>

      <div className="about-content">
        <section>
          <h2>Наша місія</h2>
          <p>
            FitMe створено для того, щоб допомогти кожному знайти свій шлях до
            здорового способу життя — без зайвого стресу, складних підрахунків і
            заплутаних програм.
          </p>
        </section>

        <section>
          <h2>Що ми пропонуємо?</h2>
          <ul>
            <li>Персональні тренувальні програми</li>
            <li>Індивідуальні раціони</li>
            <li>База вправ з відео</li>
            <li>Корисні рецепти з калоріями</li>
            <li>Цілодобова підтримка</li>
            <li>Особистий кабінет з прогресом</li>
          </ul>
        </section>

        <section>
          <h2>Наші цінності</h2>
          <div className="grid">
            <div>
              <img
                src={process.env.PUBLIC_URL + "/images/gear.svg"}
                alt="Value 1"
              />
              <h3>Персоналізація</h3>
              <p>Підлаштовуємось саме під вас.</p>
            </div>
            <div>
              <img
                src={process.env.PUBLIC_URL + "/images/bulb.svg"}
                alt="Value 1"
              />
              <h3>Простота</h3>
              <p>Жодних складностей — усе інтуїтивно.</p>
            </div>
            <div>
              <img
                src={process.env.PUBLIC_URL + "/images/science.svg"}
                alt="Value 1"
              />
              <h3>Науковий підхід</h3>
              <p>Актуальні методики та досвід.</p>
            </div>
            <div>
              <img
                src={process.env.PUBLIC_URL + "/images/support.svg"}
                alt="Value 1"
              />
              <h3>Підтримка</h3>
              <p>Ми завжди на зв'язку.</p>
            </div>
          </div>
        </section>
      </div>

      {isModalOpen && (
        <LoginModal 
          onClose={() => setIsModalOpen(false)} 
          setUser={setUser} 
        />
      )}
    </>
  );
};

export default AboutUs;
