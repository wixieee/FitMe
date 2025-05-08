import React from "react";
import "../../assets/variables.css";
import "./contactSection.css";

function ContactSection() {
  return (
    <section className="contact-section">
      <div className="contact-left">
        <h2 className="contact-title">/// Зв’язок з нами</h2>
        <p className="contact-subtitle">
          Маєш питання? Ми завжди раді допомогти тобі на шляху до здорового та
          активного життя! Зв’яжися з нашою командою тренерів та консультантів —
          разом ми досягнемо твоєї мети.
        </p>
        <form className="contact-form">
          <input type="text" placeholder="Введіть ваше ім’я" />
          <input type="email" placeholder="xyz@gmail.com" />
          <textarea
            className="message-input"
            placeholder="Введіть ваше повідомлення..."
            rows="4"
          />
          <button type="submit" className="contact-button">
            Надіслати
          </button>
        </form>
      </div>
      <div className="contact-right">
        <img
          src={process.env.PUBLIC_URL + "/images/contact-image.png"}
          alt="Contact"
        />
      </div>
    </section>
  );
}

export default ContactSection;
