import React, { useState } from "react";
import emailjs from "emailjs-com";
import "../../assets/variables.css";
import "./contactSection.css";

function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .send(
        "service_435vrag", // свій service ID
        "template_oy58c42", // свій template ID
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_email: "fitmepersonalhelper@gmail.com",
        },
        "z1eNjPLveRksQTKMW" // свій user ID (public key)
      )
      .then(
        () => {
          setForm({ name: "", email: "", message: "" });
        },
        () => {
          setStatus("Помилка при надсиланні. Спробуйте ще раз.");
        }
      );
  };

  return (
    <section className="contact-section">
      <div className="contact-left">
        <h2 className="contact-title">/// Зв’язок з нами</h2>
        <p className="contact-subtitle">
          Маєш питання? Ми завжди раді допомогти тобі на шляху до здорового та
          активного життя! Зв’яжися з нашою командою тренерів та консультантів — 
          разом ми досягнемо твоєї мети.
        </p>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Введіть ваше ім’я"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="xyz@gmail.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          <textarea
            className="message-input"
            name="message"
            placeholder="Введіть ваше повідомлення..."
            rows="4"
            value={form.message}
            onChange={handleChange}
            required
          />
          <button type="submit" className="contact-button">
            Надіслати
          </button>
          {status && <p>{status}</p>}
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