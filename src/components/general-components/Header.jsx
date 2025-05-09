import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LoginModal from ".//LoginModal";
import "../../assets/variables.css";
import "./header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

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
                className={`nav-link ${location.pathname === path ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {name}
              </Link>
            ))}

            <button
              className="nav-link login-btn"
              onClick={handleModalToggle}
            >
              Увійти / Зареєструватися
            </button>
          </nav>
        </div>
      </header>

      {isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Header;
