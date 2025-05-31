import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useMatch, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import "../../assets/variables.css";
import "./header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const location = useLocation();
  const navigate = useNavigate();
  const isRecipePage = useMatch("/recipe");

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

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setProfileMenuOpen(false);
    navigate('/');
  };

  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-container">
          <img
            src={process.env.PUBLIC_URL + "/images/fitme.png"}
            alt="Logo"
            className="logo"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
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
                className={`nav-link ${
                  location.pathname === path ||
                  (path === "/recipes" && isRecipePage)
                    ? "active"
                    : ""
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {name}
              </Link>
            ))}

            {user ? (
              <div className="profile-menu-container" ref={profileMenuRef}>
                <div className="profile-wrapper">
                  <div className="profile-toggle">
                    <Link
                      to="/profile"
                      className="nav-link profile-link"
                      onClick={() => setMenuOpen(false)}
                    >
                      Мій профіль
                    </Link>
                    <button
                      className="arrow-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // щоб не закривалося через обробник outside-click
                        setProfileMenuOpen((prev) => !prev);
                      }}
                    >
                      <span
                        className={`arrow ${profileMenuOpen ? "up" : "down"}`}
                      />
                    </button>
                  </div>
                  {profileMenuOpen && (
                    <div className="dropdown-menu">
                      <div className="dropdown-item">{user.email}</div>
                      <Link
                        to="/profile?edit=true"
                        className="dropdown-item settings-btn"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Налаштування
                      </Link>
                      <button className="dropdown-item logout-btn" onClick={handleLogout}>
                        Вийти
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                className="nav-link login-btn"
                onClick={handleModalToggle}
              >
                Увійти / Зареєструватися
              </button>
            )}
          </nav>
        </div>
      </header>

      {isModalOpen && (
        <LoginModal onClose={() => setIsModalOpen(false)} setUser={setUser} />
      )}
    </>
  );
};

export default Header;
