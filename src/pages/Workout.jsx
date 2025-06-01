import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./workout.css";

const Workout = () => {
  const { workoutNumber } = useParams();
  const navigate = useNavigate();
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
        
        if (!workoutData) {
          setError('Тренування не знайдено');
          setLoading(false);
          return;
        }
        
        setWorkout(workoutData);
        
        // Отримуємо детальну інформацію про кожну вправу
        if (workoutData && workoutData.exercises && workoutData.exercises.length > 0) {
          const exercisesData = [];
          
          for (const exerciseId of workoutData.exercises) {
            try {
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
              } else {
                // Якщо вправу не знайдено, додаємо заглушку
                exercisesData.push({
                  name: `Вправа ${exerciseId}`,
                  sets: 3,
                  reps: 10,
                  youtube: "",
                  description: "Опис відсутній",
                  imageUrl: ""
                });
                console.warn(`Вправу з ідентифікатором ${exerciseId} не знайдено`);
              }
            } catch (exerciseError) {
              console.warn(`Помилка при отриманні вправи ${exerciseId}:`, exerciseError);
              // Додаємо заглушку для вправи, яку не вдалося отримати
              exercisesData.push({
                name: `Вправа ${exerciseId}`,
                sets: 3,
                reps: 10,
                youtube: "",
                description: "Опис відсутній",
                imageUrl: ""
              });
            }
          }
          
          setExercises(exercisesData);
        } else {
          setExercises([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Помилка при отриманні даних тренування:', err);
        
        // Перевіряємо, чи помилка 404
        if (err.response && err.response.status === 404) {
          setError('Тренування не знайдено. Можливо, воно було видалено або переміщено.');
        } else {
          setError('Не вдалося завантажити дані тренування. Спробуйте пізніше.');
        }
        
        setLoading(false);
      }
    };
    
    if (workoutNumber) {
      fetchWorkoutData();
    } else {
      setError('Не вказано номер тренування');
      setLoading(false);
    }
  }, [workoutNumber, navigate]);
  
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
    if (exercises.length === 0) {
      alert('Неможливо почати тренування без вправ');
      return;
    }
    
    const filled = exercises.map((ex) => ({
      ...ex,
      logs: Array(ex.sets).fill().map(() => ({ weight: "", reps: ex.reps, completed: false })),
    }));
    setExercises(filled);
    setStarted(true);
    setEnded(false);
    setTimer(0);
  };

  const endWorkout = () => {
    setEnded(true);
    setStarted(false);

    // Створюємо об'єкт завершеного тренування
    const completedWorkout = {
      name: workout?.title || `Тренування #${workoutNumber}`,
      burned: workout.caloriesBurned,
      addedAt: new Date().toISOString(),
      exercises: exercises.map(ex => ex.name)
    };

    // Зберігаємо для Calculator
    localStorage.setItem('searchFromWorkout', JSON.stringify({
      name: completedWorkout.name,
      burned: completedWorkout.burned,
      addedAt: completedWorkout.addedAt
    }));

    // (опціонально) Зберігаємо історію завершених тренувань
    const previous = JSON.parse(localStorage.getItem('completedWorkouts') || '[]');
    localStorage.setItem('completedWorkouts', JSON.stringify([...previous, completedWorkout]));

    console.log("Workout completed:", exercises);
  };

  const handleChange = (exIndex, setIndex, field, value) => {
    const updated = [...exercises];
    updated[exIndex].logs[setIndex][field] = value;
    setExercises(updated);
  };

  const toggleCompleted = (exIndex, setIndex) => {
    const updated = [...exercises];
    updated[exIndex].logs[setIndex].completed = !updated[exIndex].logs[setIndex].completed;
    console.log(`Toggled set ${setIndex} of exercise ${exIndex} to ${updated[exIndex].logs[setIndex].completed}`);
    console.log('Updated exercises:', JSON.stringify(updated.map(ex => ex.logs.map(log => log.completed))));
    setExercises(updated);
  };

  const addSet = (exIndex) => {
    const updated = [...exercises];
    updated[exIndex].logs.push({ weight: "", reps: "", completed: false });
    setExercises(updated);
  };

  const removeSet = (exIndex, setIndex) => {
    const updated = [...exercises];
    updated[exIndex].logs.splice(setIndex, 1);
    setExercises(updated);
  };

  const goBack = () => {
    navigate('/workouts');
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
        <button onClick={goBack} className="back-btn">Повернутися до тренувань</button>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="workout-page error">
        <div className="error-message">Тренування не знайдено</div>
        <button onClick={goBack} className="back-btn">Повернутися до тренувань</button>
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
          <div className="info-block">
            <div className="info-badge">
              <span>
                <i className="bx bxs-time"></i> {workout.durationMinutes || 30} хв
              </span>
            </div>
            <div className="info-badge">
              <span>
                <i className="bx bxs-hot"></i> {workout.caloriesBurned || 200} ккал
              </span>
            </div>
          </div>
        </div>
        {started && <p className="timer">Час: {formatTime(timer)}</p>}
      </div>

      <div className="workout-right">
        <h1 className="workout-title">{workout.title}</h1>
        <div className="top-buttons">
          <button onClick={goBack} className="back-btn">
            <i className="bx bx-arrow-back"></i> До всіх тренувань
          </button>
          
          {!started && !ended && exercises.length > 0 && (
            <button onClick={startWorkout} className="start-btn top-start-btn">
              Почати тренування
            </button>
          )}
        </div>
        
        <h2>Програма тренування</h2>

        {exercises.length > 0 ? (
          exercises.map((ex, exIndex) => (
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
                        className={`complete-btn ${set.completed ? "completed" : ""}`}
                        onClick={() => toggleCompleted(exIndex, setIndex)}
                        title={set.completed ? "Позначити як невиконане" : "Позначити як виконане"}
                      >
                        <i className={`bx ${set.completed ? "bx-check" : "bx-checkbox"}`}></i>
                      </button>
                      <button
                        onClick={() => removeSet(exIndex, setIndex)}
                        className="remove-btn"
                        title="Видалити підхід"
                      >
                        <i className="bx bx-trash"></i>
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
          ))
        ) : (
          <div className="no-exercises">
            <p>Для цього тренування не знайдено вправ</p>
          </div>
        )}

        {!started && !ended && exercises.length > 0 && (
          <button onClick={startWorkout} className="start-btn bottom-start-btn">
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