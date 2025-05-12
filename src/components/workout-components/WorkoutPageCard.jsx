import React from "react";
import { Link } from "react-router-dom";
import "./workoutPageCard.css";
import "../../assets/variables.css";

function WorkoutPageCard({ image, time, calories, link}) {
  return (
    <Link to={link} className="workout-card-link">
      <div className="workoutPage-card">
        <div
          className="workout-image"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="info-block">
            <div className="info-badge">
              <span><i className="bx bxs-time"></i> {time}</span>
            </div>
            <div className="info-badge">
              <span><i className="bx bxs-hot"></i> {calories}</span>
            </div>
          </div>
        </div>
        <div className="view-button">
          Перейти до тренування
          <i className="bx bxs-right-arrow-circle"></i>
        </div>
      </div>
    </Link>
  );
}

export default WorkoutPageCard;
