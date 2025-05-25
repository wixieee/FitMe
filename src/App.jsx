import React, { useEffect,useState } from "react";
import { getAuth } from "firebase/auth";

import {
  HashRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipePage from "./pages/RecipePage";
import Workouts from "./pages/Workouts";
import Header from "./components/general-components/Header";
import Footer from "./components/general-components/Footer";
import ContactSection from "./components/general-components/ContactSection";
import Calculator from "./pages/Calculator";
import Policy from "./pages/Policy";
import AboutUs from "./pages/AboutUs";
import Profile from "./pages/Profile";
import Workout from "./pages/Workout";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
const auth = getAuth();
const user = auth.currentUser;

function App() {
  const [user, setUser] = useState(null); // 🔸 Зберігаємо логіненого користувача

  return (
    <Router>
      <>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipe" element={<RecipePage />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/calories" element={<Calculator />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/profile" element={<Profile user={user} />} /> {/* ✅ передаємо user */}
        </Routes>
        <ContactSection />
        <Footer />
      </>
    </Router>
  );
}

export default App;