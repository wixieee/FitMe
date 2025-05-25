import React, { useState, useEffect } from "react";
import "./profile.css";
import { getAuth } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import RecipeCard from "../components/recipe-components/RecipeCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const Profile = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [editMode, setEditMode] = useState(false);
  const [avatar, setAvatar] = useState(
    process.env.PUBLIC_URL + "/images/profile.jpg"
  );

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    weight: "",
    height: "",
    age: "",
    gender: "Чоловіча",
  });

  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData((prev) => ({
            ...prev,
            ...data,
          }));

          const favoriteIds = data?.favorites || [];

          if (favoriteIds.length > 0) {
            try {
              const response = await fetch("https://fitme-sever.onrender.com/recipes/all");
              const allRecipes = await response.json();

              const filtered = allRecipes.recipes.filter((r) =>
                favoriteIds.includes(r.id)
              );

              setFavoriteRecipes(filtered);
            } catch (error) {
              console.error("Помилка завантаження рецептів:", error);
            }
          } else {
            setFavoriteRecipes([]);
          }
        } else {
          setProfileData((prev) => ({
            ...prev,
            email: currentUser.email || "",
          }));
        }
      }
    };

    fetchData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  const handleSave = async () => {
    if (!currentUser || !currentUser.uid) {
      console.error("Користувач не авторизований");
      return;
    }

    try {
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, profileData);
      console.log("Дані збережено:", profileData);
      setEditMode(false);
    } catch (error) {
      console.error("Помилка збереження:", error);
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
                value={profileData.name}
                onChange={handleChange}
                placeholder="Ім'я"
              />
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <input
                type="number"
                name="weight"
                value={profileData.weight}
                onChange={handleChange}
                placeholder="Вага (кг)"
              />
              <input
                type="number"
                name="height"
                value={profileData.height}
                onChange={handleChange}
                placeholder="Ріст (см)"
              />
              <input
                type="number"
                name="age"
                value={profileData.age}
                onChange={handleChange}
                placeholder="Вік"
              />
              <select
                name="gender"
                value={profileData.gender}
                onChange={handleChange}
              >
                <option value="Чоловіча">Чоловіча</option>
                <option value="Жіноча">Жіноча</option>
                <option value="Інше">Інше</option>
              </select>
            </>
          ) : (
            <>
              <h2>{profileData.name || "Ім'я не вказано"}</h2>
              <p>Email: {profileData.email}</p>
              <p>Вага: {profileData.weight} кг</p>
              <p>Ріст: {profileData.height} см</p>
              <p>Вік: {profileData.age}</p>
              <p>Стать: {profileData.gender}</p>
            </>
          )}

          <button
            onClick={editMode ? handleSave : () => setEditMode(true)}
            className="edit-btn"
          >
            {editMode ? "Зберегти" : "Редагувати"}
          </button>
        </div>
      </div>

      <div className="profile-section">
        <h3>Збережені рецепти</h3>
        
        <div className="favorites-container">
{favoriteRecipes.length === 0 ? (
  <p>У вас поки немає збережених рецептів.</p>
) : (
  <Swiper
    modules={[Navigation]}
    navigation
    spaceBetween={20}
    slidesPerView={1}
    loop={true}
    breakpoints={{
      0: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1200: { slidesPerView: 3 },
      1600: { slidesPerView: 4 },
    }}
  >
    {favoriteRecipes.map((recipe, index) => (
      <SwiperSlide key={index}>
        <div className="recipe-card-slide">
          <RecipeCard
            {...recipe}
            recipeId={recipe.id}
          />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
)}

        </div>
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
