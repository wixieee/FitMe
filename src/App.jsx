import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipePage from "./pages/RecipePage";
import Workouts from "./pages/Workouts";
import Header from "./components/general-components/Header";
import Footer from "./components/general-components/Footer";
import ContactSection from "./components/general-components/ContactSection";

function App() {
  return (
    <Router>
      <>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:1" element={<RecipePage />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
        <ContactSection />
        <Footer />
      </>
    </Router>
  );
}

export default App;
