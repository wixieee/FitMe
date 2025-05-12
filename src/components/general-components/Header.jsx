import React, { useState,useEffect } from "react";
import { Link, useLocation, useMatch } from "react-router-dom";
import LoginModal from "./LoginModal";
import "../../assets/variables.css";
import "./header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const location = useLocation();
  const isRecipePage = useMatch("/recipes/:id");
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);
  const navItems = [
    { name: "Головна", path: "/" },
    { name: "Тренування", path: "/workouts" },
    { name: "Рецепти", path: "/recipes" },
    { name: "Калькулятор калорій", path: "/calories" },
    { name: "Про нас", path: "/about" },
  ];

  const handleModalToggle = () => {
    setIsModalOpen(true);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <img
            src={process.env.PUBLIC_URL + "/images/fitme.png"}
            alt="Logo"
            className="logo"
          />

          <button
            className={`burger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="burger-line" />
            <span className="burger-line" />
            <span className="burger-line" />
          </button>

          <nav className={`nav ${menuOpen ? "open" : ""}`}>
            {navItems.map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                className={`nav-link ${location.pathname === path || (path === "/recipes" && isRecipePage) ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {name}
              </Link>
            ))}

            {user ? (
              <Link
                to="/profile"
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Мій профіль
              </Link>
            ) : (
              <button className="nav-link login-btn" onClick={handleModalToggle}>
                Увійти / Зареєструватися
              </button>
            )}
          </nav>
        </div>
      </header>

      {isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} setUser={setUser} />}
    </>
  );
};

export default Header;
