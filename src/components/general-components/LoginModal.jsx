import React, { useState, useEffect } from "react";
import "./loginModal.css";
import "../../assets/variables.css";

const LoginModal = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    document.body.style.setProperty("overflow", "hidden", "important");
    document.documentElement.style.setProperty(
      "overflow",
      "hidden",
      "important"
    );

    return () => {
      document.body.style.setProperty("overflow", "auto", "important");
      document.documentElement.style.setProperty(
        "overflow",
        "auto",
        "important"
      );
    };
  }, []);

  return (
    <div className="modal-overlay">
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-left">
          <h2>{isRegister ? "Реєстрація" : "Вхід"}</h2>
          <p className="login-subtitle">
            {isRegister
              ? "Створіть акаунт для початку фітнес-подорожі"
              : "Розпочніть свою фітнес-подорож вже сьогодні"}
          </p>

          {isRegister && (
            <input
              className="login-input"
              type="text"
              placeholder="Введіть ваше ім'я"
            />
          )}
          <input
            className="login-input"
            type="email"
            placeholder="Введіть пошту"
          />
          <input
            className="login-input"
            type="password"
            placeholder="Введіть пароль"
          />

          <div className="options">
            {!isRegister && (
              <>
                <label className="custom-checkbox">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Не виходити
                </label>
                <a href="#">Забули пароль?</a>
              </>
            )}
          </div>

          <button className="login-button">
            {isRegister ? "Зареєструватись" : "Увійти"}
          </button>

          <div className="register-section">
            <p className="register-title">
              {isRegister ? "Вже є акаунт?" : "Немає аккаунта?"}
            </p>
            <button
              className="link-button"
              onClick={() => setIsRegister((prev) => !prev)}
            >
              {isRegister ? "Увійти" : "Зареєструватись"}
            </button>
          </div>

          <div className="divider">або</div>

          <button className="google-login">
            <img
              src={process.env.PUBLIC_URL + "/images/google.png"}
              alt="Google"
            />
            {isRegister ? "Зареєструватись з Google" : "Увійти з Google"}
          </button>
        </div>

        <div className="login-right">
          <img
            src={process.env.PUBLIC_URL + "/images/contact-image.png"}
            alt="Fitness"
          />
        </div>

        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
