import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../assets/variables.css";
import "./header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Головна", path: "/" },
    { name: "Тренування", path: "/workouts" },
    { name: "Рецепти", path: "/recipes" },
    { name: "Калькулятор калорій", path: "/calories" },
    { name: "Про нас", path: "/about" },
    { name: "Увійти / Зареєструватися", path: "/authorization" },
  ];

  return (
    <header className="header">
      <div className="header-container">
        <img
          src={process.env.PUBLIC_URL + "/images/fitme.png"}
          alt="Logo"
          className="logo"
        />

        <button className="burger" onClick={() => setMenuOpen((prev) => !prev)}>
          <span className="burger-line" />
          <span className="burger-line" />
          <span className="burger-line" />
        </button>

        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          {navItems.map(({ name, path }) => (
            <Link
              key={name}
              to={path}
              className={`nav-link ${
                location.pathname === path ? "active" : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
