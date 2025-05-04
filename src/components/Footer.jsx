import React from "react";
import "../assets/variables.css";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img
            src={process.env.PUBLIC_URL + "/images/fitme.png"}
            alt="Logo"
            className="logo"
          />
          <p>Ваш особистий гід у світі здорового способу життя.</p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Навігація</h4>
            <ul>
              <li>
                <a href="/workout">Тренування</a>
              </li>
              <li>
                <a href="/recipies">Рецепти</a>
              </li>
              <li>
                <a href="/calculator">Калькулятор калорій</a>
              </li>
              <li>
                <a href="/about">Про нас</a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Ресурси</h4>
            <ul>
              <li>
                <a href="/privacy">Політика конфіденційності</a>
              </li>
              <li>
                <a href="/terms">Умови використання</a>
              </li>
            </ul>
          </div>
          <div className="footer-social">
            <h4>Ми у соцмережах</h4>
            <div className="social-icons">
              <a href="#">
                <i className="bx bxl-instagram-alt"></i>
              </a>
              <a href="#">
                <i className="bx bxl-facebook-square"></i>
              </a>
              <a href="#">
                <i className="bx bxl-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} FitMe. Усі права захищено.</p>
      </div>
    </footer>
  );
};

export default Footer;
