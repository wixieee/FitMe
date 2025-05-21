import React, { useState } from "react";
import "./profile.css";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({
    name: "Ім’я користувача",
    email: "example@email.com",
    weight: "70",
    height: "175",
    age: "25",
    gender: "Чоловіча",
  });

  const [avatar, setAvatar] = useState(
    process.env.PUBLIC_URL + "/images/profile.jpg"
  );

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="avatar-container">
          <img src={avatar} alt="Avatar" className="avatar" />
          {editMode && (
            <div className="custom-file-upload">
              <label htmlFor="avatarUpload">Завантажити фото</label>
              <input
                id="avatarUpload"
                type="file"
                onChange={handleAvatarChange}
                accept="image/*"
              />
            </div>
          )}
        </div>
        
        <div className="user-info">
          {editMode ? (
            <>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                placeholder="Ім'я"
              />
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <input
                type="number"
                name="weight"
                value={user.weight}
                onChange={handleChange}
                placeholder="Вага (кг)"
              />
              <input
                type="number"
                name="height"
                value={user.height}
                onChange={handleChange}
                placeholder="Ріст (см)"
              />
              <input
                type="number"
                name="age"
                value={user.age}
                onChange={handleChange}
                placeholder="Вік"
              />
              <select name="gender" value={user.gender} onChange={handleChange}>
                <option value="Чоловіча">Чоловіча</option>
                <option value="Жіноча">Жіноча</option>
                <option value="Інше">Інше</option>
              </select>
            </>
          ) : (
            <>
              <h2>{user.name}</h2>
              <p>Email: {user.email}</p>
              <p>Вага: {user.weight} кг</p>
              <p>Ріст: {user.height} см</p>
              <p>Вік: {user.age}</p>
              <p>Стать: {user.gender}</p>
            </>
          )}

          <button onClick={() => setEditMode(!editMode)} className="edit-btn">
            {editMode ? "Зберегти" : "Редагувати"}
          </button>
        </div>
      </div>

      <div className="profile-section">
        <h3>Збережені рецепти</h3>
      </div>

      <div className="profile-section">
        <h3>Збережені тренування</h3>
      </div>

      <div className="profile-section">
        <h3>Графік змін ваги</h3>
        <div className="weight-chart-placeholder">
          <p>Графік буде тут</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
