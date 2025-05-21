import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import WorkoutPageCard from "../components/workout-components/WorkoutPageCard";
import WorkoutSection from "../components/home-components/WorkoutSection";
import WorkoutSearch from "../components/general-components/Search";

import "../assets/variables.css";
import "./workouts.css";

const workoutSections = [
  {
    title: "Для початківців",
    description:
      "Прості тренування з низькою інтенсивністю для поступового входження у форму. Підходить для людей без досвіду.",
    workouts: [
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–40 хв",
        calories: "150–250 ккал",
        link: "/workout",
      },
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–40 хв",
        calories: "150–250 ккал",
        link: "/workout",
      },
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–40 хв",
        calories: "150–250 ккал",
        link: "/workout",
      },
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–40 хв",
        calories: "150–250 ккал",
        link: "/workout",
      },
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–40 хв",
        calories: "150–250 ккал",
        link: "/workout",
      },
    ],
  },
  {
    title: "Від середнього до просунутого",
    description:
      "Тренування середньої та високої інтенсивності для тих, хто вже має фізичну підготовку та хоче вдосконалювати форму.",
    workouts: [
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "25–35 хв",
        calories: "300–450 ккал",
        link: "/workouts/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–40 хв",
        calories: "150–250 ккал",
        link: "/workouts/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–40 хв",
        calories: "150–250 ккал",
        link: "/workouts/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–40 хв",
        calories: "150–250 ккал",
        link: "/workouts/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–40 хв",
        calories: "150–250 ккал",
        link: "/workouts/1",
      },
    ],
  },
  {
    title: "Схуднення",
    description:
      "Кардіо та функціональні тренування, спрямовані на активне спалення калорій та зменшення ваги.",
    workouts: [
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "20–30 хв",
        calories: "350–500 ккал",
        link: "/workouts/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–40 хв",
        calories: "150–250 ккал",
        link: "/workouts/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–40 хв",
        calories: "150–250 ккал",
        link: "/workouts/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–40 хв",
        calories: "150–250 ккал",
        link: "/workouts/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–40 хв",
        calories: "150–250 ккал",
        link: "/workouts/1",
      },
    ],
  },
  {
    title: "Без обладнання",
    description:
      "Ефективні тренування з вагою власного тіла, які не потребують додаткового обладнання. Підходять для занять вдома.",
    workouts: [
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "15–25 хв",
        calories: "200–350 ккал",
        link: "/workouts/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–40 хв",
        calories: "150–250 ккал",
        link: "/workouts/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–40 хв",
        calories: "150–250 ккал",
        link: "/workouts/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–40 хв",
        calories: "150–250 ккал",
        link: "/workouts/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–40 хв",
        calories: "150–250 ккал",
        link: "/workouts/1",
      },
    ],
  },
  {
    title: "Силові тренування",
    description:
      "Тренування з акцентом на розвиток м’язової сили та витривалості, з використанням ваги або обладнання.",
    workouts: [
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–45 хв",
        calories: "400–600 ккал",
        link: "/workouts/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–40 хв",
        calories: "150–250 ккал",
        link: "/workouts/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–40 хв",
        calories: "150–250 ккал",
        link: "/workouts/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–40 хв",
        calories: "150–250 ккал",
        link: "/workouts/1",
      },
      {
        image: process.env.PUBLIC_URL + "/images/workout1.png",
        time: "30–40 хв",
        calories: "150–250 ккал",
        link: "/workouts/1",
      },
    ],
  },
];

function WorkoutCategorySection({ title, description, workouts }) {
  return (
    <section className="workout-section">
      <h2>{title}</h2>
      <p>{description}</p>
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        breakpoints={{
          0: { slidesPerView: 1 },
          1000: { slidesPerView: 2 },
          1400: { slidesPerView: 3 },
          1800: { slidesPerView: 4 },
        }}
      >
        {workouts.map((workouts, index) => (
          <SwiperSlide key={index}>
            <div className="workout-card-slide">
              <WorkoutPageCard {...workouts} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

function Workouts() {
  const [isSlider, setIsSlider] = useState(window.innerWidth <= 1520);
  useEffect(() => {
    const handleResize = () => {
      setIsSlider(window.innerWidth <= 1520);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const workoutFilters = [
    { label: "Калорії", key: "calories", defaultRange: [0, 1000] },
    {
      label: "Час тренування",
      key: "workoutTime",
      defaultRange: [5, 120],
      unit: "хв",
    },
  ];
  return (
    <>
      <div className="workout-container">
        <WorkoutSection isSlider={isSlider} />
      </div>
      <WorkoutSearch
        filters={workoutFilters}
        typeOptions={["Легко", "Середньо", "Складно"]}
        onSearch={(data) => console.log("Workout search", data)}
      />
      {workoutSections.map((section, index) => (
        <WorkoutCategorySection
          key={index}
          title={section.title}
          description={section.description}
          workouts={section.workouts}
        />
      ))}
    </>
  );
}

export default Workouts;
