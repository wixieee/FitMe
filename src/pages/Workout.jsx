import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./workout.css";

const Workout = () => {
  const { workoutNumber } = useParams();
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [timer, setTimer] = useState(0);
  const [exercises, setExercises] = useState([]);
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Отримуємо дані тренування з сервера
  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        setLoading(true);
        // Отримуємо дані тренування за workoutNumber
        const workoutResponse = await axios.get(`https://fitme-sever.onrender.com/training?workoutNumber=${workoutNumber}`);
        const workoutData = workoutResponse.data.training;
        setWorkout(workoutData);
        
        // Отримуємо детальну інформацію про кожну вправу
        if (workoutData && workoutData.exercises && workoutData.exercises.length > 0) {
          const exercisesData = [];
          
          for (const exerciseId of workoutData.exercises) {
            const exerciseResponse = await axios.get(`https://fitme-sever.onrender.com/exercise?exerciseNumber=${exerciseId}`);
            const exerciseData = exerciseResponse.data.exercise;
            
            if (exerciseData) {
              exercisesData.push({
                name: exerciseData.title || exerciseData.name || `Вправа ${exerciseId}`,
                sets: exerciseData.sets || 3,
                reps: exerciseData.reps || 10,
                youtube: exerciseData.videoUrl || "",
                description: exerciseData.description || "",
                imageUrl: exerciseData.imageUrl || ""
              });
            }
          }
          
          setExercises(exercisesData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Помилка при отриманні даних тренування:', err);
        setError('Не вдалося завантажити дані тренування. Спробуйте пізніше.');
        setLoading(false);
      }
    };
    
    if (workoutNumber) {
      fetchWorkoutData();
    }
  }, [workoutNumber]);
  
  // Таймер для тренування
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

  if (loading) {
    return (
      <div className="workout-page loading">
        <div className="loading-message">Завантаження тренування...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="workout-page error">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="workout-page error">
        <div className="error-message">Тренування не знайдено</div>
      </div>
    );
  }

  return (
    <div className="workout-page">
      <div className="workout-left">
        <div className="image-container">
          <img
            src={workout.imageUrl || process.env.PUBLIC_URL + "/images/workout1.png"}
            alt={workout.title}
            className="workout-Img"
          />
          <div className="workout-star-icon">
            <i className="bx bxs-star"></i>
          </div>
        </div>
        {started && <p className="timer">Час: {formatTime(timer)}</p>}
        
        <div className="workout-info">
          <p><strong>Тривалість:</strong> {workout.durationMinutes} хвилин</p>
          <p><strong>Калорії:</strong> {workout.caloriesBurned} ккал</p>
        </div>
      </div>

      <div className="workout-right">
        <h1 className="workout-title">{workout.title}</h1>
        <h2>Програма тренування</h2>

        {exercises.map((ex, exIndex) => (
          <div key={exIndex} className="exercise-block">
            <div className="exercise-name-highlight">
              {ex.name}
            </div>
            <p>
              {ex.sets} підходів по {ex.reps} повторів
            </p>
            {ex.description && <p className="exercise-description">{ex.description}</p>}
            
            {ex.youtube && (
              <a
                href={ex.youtube}
                target="_blank"
                rel="noreferrer"
                className="yt-link"
              >
                Відео інструкція
              </a>
            )}

            {started && (
              <>
                <div className="exercise-name-highlight">
                  {ex.name}
                </div>
                {ex.logs && ex.logs.map((set, setIndex) => (
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
              </>
            )}
            {started && (
              <button onClick={() => addSet(exIndex)} className="add-set-btn">
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
