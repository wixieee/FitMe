import React from "react";
import "../assets/variables.css";
import "./workoutCard.css";

export const workoutData = [
  {
    label: "Для початківців",
    image: process.env.PUBLIC_URL + "/images/beginner.png",
  },
  {
    label: "Від середнього до просунутого",
    image: process.env.PUBLIC_URL + "/images/advanced.png",
  },
  {
    label: "Схуднення",
    image: process.env.PUBLIC_URL + "/images/weight-loss.png",
  },
  {
    label: "Без обладнання",
    image: process.env.PUBLIC_URL + "/images/no-equipment.png",
  },
  {
    label: "Силові тренування",
    image: process.env.PUBLIC_URL + "/images/strenght.png",
  },
];

const WorkoutCard = ({ image, label }) => {
  return (
    <div className="workout-card">
      <div
        className="card-image"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="label">{label}</div>
      </div>
      <button className="start-button">
        Розпочати
      </button>
    </div>
  );
};

export default WorkoutCard;
