import React, { useState, useEffect } from "react";
import "./workout.css";

const initialExercises = [
  {
    name: "Присідання",
    sets: 3,
    reps: 10,
    youtube: "https://www.youtube.com/watch?v=aclHkVaku9U",
  },
  {
    name: "Жим лежачи",
    sets: 4,
    reps: 8,
    youtube: "https://www.youtube.com/watch?v=gRVjAtPip0Y",
  },
];

const Workout = () => {
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [timer, setTimer] = useState(0);
  const [exercises, setExercises] = useState(initialExercises);
  const [workoutName] = useState("Ноги і груди");

  useEffect(() => {
    let interval;
    if (started && !ended) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [started, ended]);

  const formatTime = (t) => {
    const mins = Math.floor(t / 60);
    const secs = t % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startWorkout = () => {
    const filled = exercises.map((ex) => ({
      ...ex,
      logs: Array(ex.sets).fill({ weight: "", reps: ex.reps }),
    }));
    setExercises(filled);
    setStarted(true);
    setEnded(false);
    setTimer(0);
  };

  const endWorkout = () => {
    setEnded(true);
    setStarted(false);
    // Optional: send results to server here
    console.log("Workout completed:", exercises);
  };

  const handleChange = (exIndex, setIndex, field, value) => {
    const updated = [...exercises];
    updated[exIndex].logs[setIndex][field] = value;
    setExercises(updated);
  };

  const addSet = (exIndex) => {
    const updated = [...exercises];
    updated[exIndex].logs.push({ weight: "", reps: "" });
    setExercises(updated);
  };

  const removeSet = (exIndex, setIndex) => {
    const updated = [...exercises];
    updated[exIndex].logs.splice(setIndex, 1);
    setExercises(updated);
  };

  return (
    <div className="workout-page">
      <div className="workout-left">
        <img
          src={process.env.PUBLIC_URL + "/images/workout1.png"}
          alt="Workout preview"
          className="workout-Img"
        />
        {started && <p className="timer">Час: {formatTime(timer)}</p>}
      </div>

      <div className="workout-right">
        <h1 className="workout-title">{workoutName}</h1>
        <h2>Програма тренування</h2>

        {exercises.map((ex, exIndex) => (
          <div key={ex.name} className="exercise-block">
            <h3>{ex.name}</h3>
            <p>
              {ex.sets} підходів по {ex.reps} повторів
            </p>
            <a
              href={ex.youtube}
              target="_blank"
              rel="noreferrer"
              className="yt-link"
            >
              Відео інструкція
            </a>

            {started &&
              ex.logs.map((set, setIndex) => (
                <div key={setIndex} className="set-inputs">
                  <input
                    type="number"
                    placeholder="Вага (кг)"
                    value={set.weight}
                    onChange={(e) =>
                      handleChange(exIndex, setIndex, "weight", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Повтори"
                    value={set.reps}
                    onChange={(e) =>
                      handleChange(exIndex, setIndex, "reps", e.target.value)
                    }
                  />
                  <button
                    onClick={() => removeSet(exIndex, setIndex)}
                    className="remove-btn"
                  >
                    -
                  </button>
                </div>
              ))}
            {started && (
              <button
                onClick={() => addSet(exIndex)}
                className="add-set-btn"
              >
                + Додати підхід
              </button>
            )}
          </div>
        ))}

        {!started && !ended && (
          <button onClick={startWorkout} className="start-btn">
            Почати тренування
          </button>
        )}

        {started && (
          <button onClick={endWorkout} className="end-btn">
            Закінчити тренування
          </button>
        )}

        {ended && (
          <div className="end-summary">
            <h3>Тренування завершено</h3>
            <p>Тривалість: {formatTime(timer)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workout;
