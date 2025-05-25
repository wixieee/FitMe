import React, { useState, useEffect } from "react";
import "./loginModal.css";
import "../../assets/variables.css";
import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; 

const saveUserToFirestore = async (uid, email) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, { email, favorites: [] });
    console.log("Користувача створено в Firestore");
  } else {
    console.log("Користувач вже існує в Firestore");
  }
};

const LoginModal = ({ onClose, setUser }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    document.body.style.setProperty("overflow", "hidden", "important");
    document.documentElement.style.setProperty("overflow", "hidden", "important");
    return () => {
      document.body.style.setProperty("overflow", "auto", "important");
      document.documentElement.style.setProperty("overflow", "auto", "important");
    };
  }, []);

const handleLogin = async () => {
  try {
    const response = await fetch("https://fitme-sever.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      const fakeUID = btoa(email); // унікальний, на основі email
      await saveUserToFirestore(fakeUID, email); // збереження у Firestore
      setUser({ uid: fakeUID, email });
      onClose();
    } else {
      setErrorMessage(data.error || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    setErrorMessage("Server error");
  }
};


const handleRegister = async () => {
  try {
    const response = await fetch("https://fitme-sever.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      const fakeUID = btoa(email);
      await saveUserToFirestore(fakeUID, email);
      setUser({ uid: fakeUID, email });
      onClose();
    } else {
      setErrorMessage(data.error || "Registration failed");
    }
  } catch (error) {
    console.error("Registration error:", error);
    setErrorMessage("Server error");
  }
};


const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    const response = await axios.post("https://fitme-sever.onrender.com/google-login", { idToken });

    if (response.status === 200) {
      const { uid, email } = result.user;
      await saveUserToFirestore(uid, email); // додано
      setUser({ uid, email }); // тепер передаємо uid
      onClose();
    } else {
      setErrorMessage("Google login failed");
    }
  } catch (error) {
    console.error("Google login error:", error);
    setErrorMessage("Помилка при вході через Google");
  }
};


const handleForgotPassword = async () => {
  if (!email) {
    setErrorMessage("Введіть email для відновлення");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    setSuccessMessage("Інструкції для скидання пароля надіслано на пошту");
    setErrorMessage("");
  } catch (error) {
    console.error("Firebase forgot password error:", error);
    let message = "Помилка при відновленні пароля";
    if (error.code === "auth/user-not-found") {
      message = "Користувача з такою поштою не знайдено";
    } else if (error.code === "auth/invalid-email") {
      message = "Некоректний формат email";
    }
    setErrorMessage(message);
    setSuccessMessage("");
  }
};

  return (
    <div className="modal-overlay">
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-left">
          <h2>
            {isForgotPassword
              ? "Відновлення пароля"
              : isRegister
              ? "Реєстрація"
              : "Вхід"}
          </h2>
          <p className="login-subtitle">
            {isForgotPassword
              ? "Введіть пошту для відновлення доступу"
              : isRegister
              ? "Створіть акаунт для початку фітнес-подорожі"
              : "Розпочніть свою фітнес-подорож вже сьогодні"}
          </p>

          {!isForgotPassword && isRegister && (
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {!isForgotPassword && (
            <input
              className="login-input"
              type="password"
              placeholder="Введіть пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          {errorMessage && (
            <p className="error-text" style={{ color: "red" }}>{errorMessage}</p>
          )}
          {successMessage && (
            <p className="success-text" style={{ color: "green" }}>{successMessage}</p>
          )}

          {!isForgotPassword && (
            <div className="options">
              {!isRegister && (
                <>
                  <label className="custom-checkbox">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    Не виходити
                  </label>
                  <button className="forgot-password" onClick={() => {
                    setIsForgotPassword(true);
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}>
                    Забули пароль?
                  </button>
                </>
              )}
            </div>
          )}

          <button
            className="login-button"
            onClick={
              isForgotPassword
                ? handleForgotPassword
                : isRegister
                ? handleRegister
                : handleLogin
            }
          >
            {isForgotPassword
              ? "Відновити пароль"
              : isRegister
              ? "Зареєструватись"
              : "Увійти"}
          </button>

          {!isForgotPassword && (
            <>
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

              <button className="google-login" onClick={handleGoogleLogin}>
                <img
                  src={process.env.PUBLIC_URL + "/images/google.png"}
                  alt="Google"
                />
                {isRegister ? "Зареєструватись з Google" : "Увійти з Google"}
              </button>
            </>
          )}

          {isForgotPassword && (
            <div className="register-section">
              <button
                className="link-button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
              >
                Назад до входу
              </button>
            </div>
          )}
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
