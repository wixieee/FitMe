import React from "react";
import "../assets/variables.css";
import "./workoutCard.css";

const WorkoutCard = ({ image, label}) => {
  return (
    <div className="workout-card">
      <div
        className="card-image"
        style={{ backgroundImage: `url(${image})`}}
      >
        <div className="label">{label}</div>
      </div>
      <button className= "start-button">
        Розпочати
      </button>
    </div>
  );
};

export default WorkoutCard;