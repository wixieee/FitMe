import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./profile.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import RecipeCard from "../components/recipe-components/RecipeCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const Profile = () => {
  const [searchParams] = useSearchParams();
  const shouldEdit = searchParams.get('edit') === 'true';
  
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [editMode, setEditMode] = useState(shouldEdit);
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
    avatarUrl: "",
  });

  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData((prev) => ({
            ...prev,
            ...data,
          }));

          // If there's an avatar URL in Firestore, try to get a fresh download URL
          if (data.avatarUrl) {
            try {
              const avatarRef = ref(storage, `avatars/${currentUser.uid}/profile-image`);
              const freshUrl = await getDownloadURL(avatarRef);
              setAvatar(freshUrl);
            } catch (error) {
              console.error("Error refreshing avatar URL:", error);
              // If we can't get a fresh URL, use the stored one
              setAvatar(data.avatarUrl);
            }
          }

          const favoriteIds = data?.favorites || [];
          if (favoriteIds.length > 0) {
            try {
              const response = await fetch("https://fitme-sever.onrender.com/recipes/all");
              const allRecipes = await response.json();

              const filtered = allRecipes.recipes.filter((r) =>
                favoriteIds.includes(r.id)
              ).map(recipe => ({
                ...recipe,
                imageUrl: recipe.imageUrl || recipe.image
              }));

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
      } catch (error) {
        console.error("Помилка завантаження даних профілю:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  useEffect(() => {
    setEditMode(shouldEdit);
  }, [shouldEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);

      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, `avatars/${currentUser.uid}/profile-image`);
      
      // Add metadata with CORS headers
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS, POST',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      };

      // Upload the file with metadata
      await uploadBytes(storageRef, file, metadata);
      
      // Get the download URL immediately after upload
      const url = await getDownloadURL(storageRef);

      // Update Firestore with the new avatar URL
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, {
        ...profileData,
        avatarUrl: url
      }, { merge: true });

      // Update local state
      setAvatar(url);
      setProfileData(prev => ({
        ...prev,
        avatarUrl: url
      }));

    } catch (error) {
      console.error("Avatar upload error:", error);
      alert("Помилка завантаження аватару. Спробуйте ще раз.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser || !currentUser.uid) {
      console.error("Користувач не авторизований");
      return;
    }

    try {
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, profileData, { merge: true });
      setEditMode(false);
    } catch (error) {
      console.error("Помилка збереження:", error);
    }
  };

  const handleFavoriteChange = (recipeId, isFavorite) => {
    if (!isFavorite) {
      // Видаляємо рецепт зі списку збережених
      setFavoriteRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Завантаження...</div>;
  }

  if (!currentUser) {
    return (
      <div className="not-authenticated">
        <p>Будь ласка, увійдіть в систему для перегляду профілю</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="avatar-container">
          <img src={avatar} alt="Avatar" className="avatar" />
          {editMode && (
            <div className="custom-file-upload">
              <label htmlFor="avatarUpload" className={uploadingAvatar ? "disabled" : ""}>
                {uploadingAvatar ? "Завантаження..." : "Завантажити фото"}
              </label>
              <input
                id="avatarUpload"
                type="file"
                onChange={handleAvatarChange}
                accept="image/*"
                disabled={uploadingAvatar}
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
              loop={favoriteRecipes.length > 1}
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
                      onFavoriteChange={handleFavoriteChange}
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
