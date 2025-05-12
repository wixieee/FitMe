import { React, useState, useEffect } from "react";
import "./recipePage.css";
import "../assets/variables.css";
import Header from "../components/general-components/Header";
import Footer from "../components/general-components/Footer";
import ContactSection from "../components/general-components/ContactSection";

const Recipe = () => {
  const [loadVideo, setLoadVideo] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const html = document.documentElement;

    const hadSmooth = getComputedStyle(html).scrollBehavior === "smooth";

    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);

    setTimeout(() => {
      if (hadSmooth) {
        html.style.scrollBehavior = "smooth";
      } else {
        html.style.scrollBehavior = "";
      }
    }, 100);

    // Перевірка на iOS
    const userAgent = window.navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(userAgent);
    setIsIOS(iOS);
  }, []);
  return (
    <>
      <Header />
      <div className="container">
        <div className="header-image">
          <img
            src={process.env.PUBLIC_URL + "/images/recipe-page.png"}
            alt="French Toast"
          />
          <div className="prep-time">
            <span>
              7.3г
              <br />
              Білки
            </span>
            <span>
              11г
              <br />
              Жири
            </span>
            <span>
              23г
              <br />
              Вуглеводи
            </span>
          </div>
        </div>

        <div className="content">
          <div className="text">
            <h2>Французькі тости</h2>
            <p>
              Веселий твіст на класику! Усі знайомі й улюблені смаки французьких
              тостів — теплі, солодкуваті, з нотками ванілі та кориці — тепер у
              несподіваному, але напрочуд смачному форматі вафель. Вони ідеально
              хрусткі зовні й ніжні всередині, без потреби смаження у фритюрі,
              що робить їх не лише смачними, а й легшими для травлення. Подача —
              окреме задоволення. Свіжий салат з огірків і соковитих помідорів
              додає яскравої хрусткості та освіжаючої кислинки, а йогуртовий
              соус із кінзою дарує пряний, трохи пікантний акцент, що ідеально
              врівноважує солодку основу страви. Це ідеальний варіант для
              пізнього сніданку чи бранчу, коли хочеться чогось домашнього, але
              водночас оригінального. Ваша родина або гості точно оцінять таку
              незвичну, але надзвичайно смачну інтерпретацію улюбленої класики.
            </p>
          </div>

          <div className="ingredients">
            <h3>Інгредієнти (6 порцій)</h3>
            <ul>
              <li>Білий хліб - 250г</li>
              <li>Вершкове масло - 1 ч. л.</li>
              <li>Яйця - 50г</li>
              <li>Ваніль і кориця - 50г</li>
              <li>Молоко - 250г</li>
              <li>Сіль - 1 ч. л.</li>
            </ul>
          </div>
        </div>

        <div className="video-section">
          {!loadVideo ? (
            <div className="video-thumbnail" onClick={() => setLoadVideo(true)}>
              <img
                src="https://img.youtube.com/vi/r1ZLSbQ0r0I/hqdefault.jpg"
                alt="Watch video"
              />
              <div className="play-button">
                <i className="bx bx-play"></i>
              </div>
            </div>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/r1ZLSbQ0r0I?autoplay=1&controls=1&modestbranding=1&rel=0${
                isIOS ? "&mute=1" : ""
              }`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}

          <div className="additional-info">
            <h3>Час приготування - 15хв</h3>
            <h3>Калорійність - 219ккал</h3>
            <ul>
              <li>Білки - 13%(7.3г)</li>
              <li>Жири - 42%(11г)</li>
              <li>Вуглеводи - 45%(23г)</li>
            </ul>
          </div>
        </div>

        <div className="instructions">
          <h3>Як приготувати французькі тости</h3>
          <p>
            Кожен домашній кухар має свій власний спосіб приготування базових
            французьких тостів, але більшість варіацій містять наступні
            інгредієнти: Білий хліб: Товсто нарізаний хліб є основою для всіх
            французьких тостів. Міцний, щільний, злегка черстві скибочки краще
            вбирають заварну яєчну суміш, ніж тонкі, повітряні. Яйця: Коли
            справа доходить до французьких тостів, яйця просто необхідні. При
            нагріванні білки застигають, що зв'язує тісто разом і забезпечує
            насичену текстуру. Жир, тим часом, додає додаткової вершковості.
            Молоко: технічно для приготування французьких тостів можна
            використовувати будь-яку рідину тост, але найпопулярнішим є молоко.
            Молоко не тільки додає необхідну вологу, але й жир надає тісту
            додаткової насиченості. У цьому рецепті ми використовуємо незбиране
            молоко, оскільки воно створює ідеальну текстуру. Ви можете легко
            замінити його напівжирним, вершками або улюбленим альтернативним
            молоком - з жирними сортами вийде найкремовішу консистенцію. Ваніль
            і кориця: найкращі французькі тости теплий, затишний, ароматний і
            солодкий. Кориця та ваніль у цьому рецепті не є обов'язковими, але
            ми обов'язково рекомендуємо використовувати їх для найсмачнішого
            досвіду. Ви навіть можете додати трохи мускатного горіха або цукру,
            якщо вам так хочеться. Сіль: Не пропустіть сіль! Лише щіпка не
            вплине на смак. Сіль допомагає розбити яйця, включити їх у тісто їх
            у тісто і запобігає утворенню яєчних шматочків у готовому продукті.
            Вершкове масло: Як і багато інших найбільш декадентських продуктів,
            найкращі французькі тости готуються з вершковим маслом. Якщо ваші
            французькі тости мають схильні до підгоряння, спробуйте підсмажити
            хліб, просочений кляром, у поєднанні вершкового масла та олії.
          </p>
        </div>
      </div>
      <ContactSection />
      <Footer />
    </>
  );
};

export default Recipe;
