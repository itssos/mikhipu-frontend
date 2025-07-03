import React, { useState, useEffect, useRef } from "react";
import useRol from "../hooks/useRol";

// --------- Variables para ajustar posición y tamaño ----------
const BOOK_SIZE = 100; // Tamaño del libro en px
const BOOK_BOTTOM = 38; // px desde abajo
const BOOK_RIGHT = 250;  // px desde la derecha
// Puedes probar cambiando BOOK_BOTTOM, BOOK_RIGHT, BOOK_SIZE para posicionar/mejorar

const bookImageUrl = "/libro-1.png"; // Cambia aquí tu PNG

const studentPhrases = [
  "¡Nunca dejes de aprender, tu futuro depende de ello!",
  "Cada esfuerzo te acerca más a tu meta.",
  "¡Ánimo! Los errores también enseñan.",
  "Estudiar hoy, triunfar mañana.",
  "Eres capaz de más de lo que crees.",
  "Cada día es una nueva oportunidad.",
  "Confía en tu proceso, vas por buen camino.",
  "Lo difícil se vuelve fácil con práctica.",
  "El éxito es la suma de pequeños logros diarios.",
  "No te compares, avanza a tu ritmo.",
  "La constancia vence al talento.",
  "Aprender es tu superpoder.",
  "Tu dedicación abrirá puertas.",
  "Sé curioso, pregunta siempre.",
  "El conocimiento es libertad.",
  "Hoy siembras, mañana cosechas.",
  "Nunca te rindas ante el primer obstáculo.",
  "Un examen no define tu valor.",
  "Atrévete a ir más allá.",
  "La disciplina construye tu destino.",
  "Haz de cada día tu mejor clase.",
  "El miedo es solo el inicio del aprendizaje.",
  "Cree en ti, todo empieza en tu mente.",
  "Aprender cambia vidas, ¡incluida la tuya!",
  "Tu actitud determina tu altitud.",
  "Las grandes metas empiezan con pequeños pasos.",
  "Sueña en grande, estudia en serio.",
  "Tu esfuerzo será recompensado.",
  "Hoy parece difícil, mañana será tu orgullo.",
  "El futuro pertenece a quienes se preparan hoy."
];

const teacherPhrases = [
  "Enseñar es dejar huella en la vida de una persona.",
  "Tu dedicación inspira a los estudiantes.",
  "Cada día formas el futuro.",
  "Gracias por ser guía y ejemplo.",
  "Educar es un acto de esperanza.",
  "Tu paciencia transforma vidas.",
  "Un buen maestro nunca se olvida.",
  "La pasión por enseñar es contagiosa.",
  "Formar mentes es un arte.",
  "Tu vocación cambia el mundo.",
  "La enseñanza es un regalo diario.",
  "Sembrar conocimiento es cosechar progreso.",
  "Eres el faro en el camino de tus alumnos.",
  "Cada explicación deja huella.",
  "Tu entrega es admirada y valorada.",
  "Motivar es tu superpoder.",
  "Las palabras de un maestro llegan lejos.",
  "El ejemplo enseña más que las palabras.",
  "Gracias por tu dedicación incansable.",
  "Tu trabajo nunca es en vano.",
  "La educación es la mejor herencia.",
  "Siempre siembras semillas de éxito.",
  "La paciencia es tu mejor herramienta.",
  "Inspirar es tu mayor logro.",
  "Formar personas, más que estudiantes.",
  "Un buen maestro también aprende cada día.",
  "La vocación docente transforma sociedades.",
  "Gracias por creer en cada estudiante.",
  "Tu enseñanza deja raíces profundas.",
  "Tu impacto va más allá del aula."
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const AnimatedBookPhrase = () => {
  const isStudent = useRol(["ESTUDIANTE"]);
  const isTeacher = useRol(["DOCENTE"]);

  const [show, setShow] = useState(false);
  const [phrase, setPhrase] = useState("");
  const timeoutRef = useRef(null);

  // Aparición aleatoria (en ms)
  const minDelay = 25000;
  const maxDelay = 45000;
  const visibleTime = 7000;

  const showRandomPhrase = () => {
    let selectedPhrase = "";
    if (isStudent) {
      selectedPhrase = getRandomItem(studentPhrases);
    } else if (isTeacher) {
      selectedPhrase = getRandomItem(teacherPhrases);
    } else {
      selectedPhrase = "¡Sigue adelante y da lo mejor de ti!";
    }
    setPhrase(selectedPhrase);
    setShow(true);
    setTimeout(() => setShow(false), visibleTime);
  };

  useEffect(() => {
    function scheduleNext() {
      const delay = Math.floor(Math.random() * (maxDelay - minDelay) + minDelay);
      timeoutRef.current = setTimeout(() => {
        showRandomPhrase();
        scheduleNext();
      }, delay);
    }
    scheduleNext();
    return () => clearTimeout(timeoutRef.current);
  }, [isStudent, isTeacher]);

  return (
    <div
      className={`fixed z-50 transition-all duration-700 ${
        show
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      style={{
        bottom: BOOK_BOTTOM,
        right: BOOK_RIGHT,
        minWidth: BOOK_SIZE,
        maxWidth: BOOK_SIZE + 170,
      }}
    >
      <div className="relative flex items-end">
        {/* Imagen del libro */}
        <img
          src={bookImageUrl}
          alt="Libro animado"
          className="object-contain animate-bounce-slow"
          style={{
            width: BOOK_SIZE,
            height: BOOK_SIZE,
            filter: "drop-shadow(0 2px 6px rgba(140,60,250,0.23))",
            zIndex: 2,
          }}
          draggable={false}
        />

        {/* Viñeta tipo chat */}
        <div
          className={`
            absolute
            left-[85%]  // ajusta aquí el anclaje horizontal respecto a la boca del libro
            bottom-[45%] // ajusta aquí la altura desde la base del libro
            w-[250px] max-w-[260px]
            bg-white bg-opacity-95 rounded-2xl shadow-xl border-2 border-fuchsia-200
            px-5 py-3
            animate-fade-in-out
            flex items-center
          `}
          style={{
            minHeight: "54px",
            // Puedes probar con left/bottom aquí si quieres mover la viñeta exactamente donde “sale la boca”
          }}
        >
          <span className="text-base font-semibold text-purple-700 drop-shadow-md text-shadow-cool">
            {phrase}
          </span>
          {/* Triángulo tipo "punta de viñeta" */}
          <span
            className="absolute"
            style={{
              left: "-22px",
              bottom: "14px",
              width: 0,
              height: 0,
              borderTop: "14px solid transparent",
              borderBottom: "14px solid transparent",
              borderRight: "22px solid #faf5ff",
              filter: "drop-shadow(-1px 2px 1px #f3e8ff)",
              zIndex: 1,
            }}
          />
          {/* Borde del triángulo */}
          <span
            className="absolute"
            style={{
              left: "-25px",
              bottom: "14px",
              width: 0,
              height: 0,
              borderTop: "15px solid transparent",
              borderBottom: "15px solid transparent",
              borderRight: "25px solid #e9d5ff",
              zIndex: 0,
            }}
          />
        </div>
      </div>
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-13px);}
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.2s infinite;
        }
        .animate-fade-in-out {
          animation: fade-in-out 0.8s;
        }
        @keyframes fade-in-out {
          from { opacity: 0; transform: translateY(30px);}
          to   { opacity: 1; transform: translateY(0);}
        }
        .text-shadow-cool {
          text-shadow: 0 1px 2px #e9d5ff, 0 2px 6px #e0e7ff;
        }
      `}</style>
    </div>
  );
};

export default AnimatedBookPhrase;
