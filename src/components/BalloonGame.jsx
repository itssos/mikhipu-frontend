// BalloonGame.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BALLOON_COLORS = [
  "bg-red-400",
  "bg-yellow-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-pink-400",
  "bg-purple-400",
  "bg-orange-400"
];

// Fondo SVG pattern (puedes cambiarlo por otro SVG si prefieres)
const BG_PATTERN = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='40' height='40' fill='%23f5f7fa'/%3E%3Ccircle cx='10' cy='10' r='4' fill='%23bae6fd'/%3E%3Ccircle cx='30' cy='30' r='4' fill='%23a7f3d0'/%3E%3C/svg%3E")`;

// Pinchos SVG
const Spikes = () => (
  <svg
    width="100%"
    height="50"
    viewBox="0 0 1000 50"
    preserveAspectRatio="none"
    className="absolute top-0 left-0 z-30"
    style={{ minWidth: "100vw", pointerEvents: "none" }}
  >
    <motion.path
      d="M0,50 Q25,0 50,50 Q75,0 100,50 Q125,0 150,50 Q175,0 200,50 Q225,0 250,50 Q275,0 300,50 Q325,0 350,50 Q375,0 400,50 Q425,0 450,50 Q475,0 500,50 Q525,0 550,50 Q575,0 600,50 Q625,0 650,50 Q675,0 700,50 Q725,0 750,50 Q775,0 800,50 Q825,0 850,50 Q875,0 900,50 Q925,0 950,50 Q975,0 1000,50"
      fill="none"
      stroke="#334155"
      strokeWidth="4"
      initial={{ pathLength: 0.6 }}
      animate={{ pathLength: [0.6, 1, 0.8, 1] }}
      transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
    />
    <motion.path
      d="M0,50 Q25,0 50,50 Q75,0 100,50 Q125,0 150,50 Q175,0 200,50 Q225,0 250,50 Q275,0 300,50 Q325,0 350,50 Q375,0 400,50 Q425,0 450,50 Q475,0 500,50 Q525,0 550,50 Q575,0 600,50 Q625,0 650,50 Q675,0 700,50 Q725,0 750,50 Q775,0 800,50 Q825,0 850,50 Q875,0 900,50 Q925,0 950,50 Q975,0 1000,50"
      fill="#60a5fa"
      opacity="0.12"
    />
  </svg>
);

// Moneda SVG (react component)
const CoinIcon = ({ className = "w-6 h-6" }) => (
  <motion.svg
    className={className}
    viewBox="0 0 32 32"
    fill="none"
    initial={{ rotate: 0 }}
    animate={{ rotate: [0, 22, -15, 0] }}
    transition={{ repeat: Infinity, duration: 2 }}
  >
    <circle cx="16" cy="16" r="15" fill="#fde047" stroke="#fbbf24" strokeWidth="2" />
    <circle cx="16" cy="16" r="9" fill="#fbbf24" opacity="0.3" />
    <text x="16" y="21" textAnchor="middle" fontSize="16" fill="#f59e42" fontWeight="bold">₲</text>
  </motion.svg>
);

const getRandom = (min, max) => Math.random() * (max - min) + min;

const Balloon = ({
  id,
  left,
  delay,
  duration,
  color,
  onSlice,
  onFinish,
  size,
  balloonSkin = null
}) => {
  const [sliced, setSliced] = useState(false);

  return (
    <motion.div
      initial={{ y: "100vh", scale: 0.85, opacity: 0.78 }}
      animate={
        sliced
          ? { rotate: 24, y: "-10vh", scale: 1.1, opacity: 0, transition: { duration: 0.35 } }
          : { y: "-10vh", scale: 1, opacity: 1, transition: { duration, delay, ease: "linear" } }
      }
      exit={{ scale: 0.3, opacity: 0, transition: { duration: 0.15 } }}
      style={{
        left: `${left}%`,
        width: size,
        height: size,
        position: "absolute",
        pointerEvents: sliced ? "none" : "auto"
      }}
      className={`flex items-center justify-center z-20 ${color} rounded-full shadow-lg select-none`}
      onMouseEnter={() => {
        setSliced(true);
        setTimeout(() => onSlice(id), 120);
      }}
      onAnimationComplete={() => {
        if (!sliced) onFinish(id);
      }}
    >
      {balloonSkin ? (
        balloonSkin
      ) : (
        <span className="text-white font-bold text-2xl drop-shadow pointer-events-none">🎈</span>
      )}
      {sliced && (
        <motion.div
          initial={{ scale: 0.7, rotate: -12, opacity: 0.7 }}
          animate={{ scale: 1.15, rotate: 24, opacity: 0.15, y: -10 }}
          className="absolute w-full h-1 left-0 top-1/2 bg-white rounded-full shadow"
        />
      )}
    </motion.div>
  );
};

const BalloonGame = () => {
  const [gameActive, setGameActive] = useState(false);
  const [balloons, setBalloons] = useState([]);
  const [coins, setCoins] = useState(0);
  const [missed, setMissed] = useState(false);
  const [balloonId, setBalloonId] = useState(0);
  const spawnInterval = useRef(null);

  // --- MUSIC ---
  const [music, setMusic] = useState(null);
  const [musicOn, setMusicOn] = useState(true);

  // Load and control music
  useEffect(() => {
    if (!music) {
      const m = new Audio("/game-music.mp3");
      m.loop = true;
      m.volume = 0.25;
      setMusic(m);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!music) return;
    if (musicOn && gameActive) {
      music.currentTime = 0;
      music.play();
    } else {
      music.pause();
    }
    // eslint-disable-next-line
  }, [musicOn, gameActive, music]);

  // Balloon spawn logic
  const spawnBalloon = useCallback(() => {
    if (!gameActive) return;
    const left = getRandom(5, 90);
    const color = BALLOON_COLORS[Math.floor(getRandom(0, BALLOON_COLORS.length))];
    const duration = getRandom(2.2 - Math.min(coins * 0.02, 1.2), 3.6 - Math.min(coins * 0.03, 2));
    const size = `${getRandom(50, 85)}px`;

    setBalloons((prev) => [
      ...prev,
      {
        id: balloonId,
        left,
        duration,
        color,
        size
      }
    ]);
    setBalloonId((id) => id + 1);
  }, [gameActive, coins, balloonId]);

  // Spawn interval
  useEffect(() => {
    if (gameActive && !missed) {
      const interval = Math.max(380 - coins * 6, 80);
      spawnInterval.current = setInterval(spawnBalloon, interval);
      return () => clearInterval(spawnInterval.current);
    } else {
      clearInterval(spawnInterval.current);
    }
  }, [gameActive, missed, coins, spawnBalloon]);

  // End game if a balloon reaches top
  const handleBalloonFinish = (id) => {
    if (gameActive) {
      setMissed(true);
      setGameActive(false);
      if (music) music.pause();
      const gameOverAudio = new Audio("/game-over.mp3");
      gameOverAudio.volume = 0.55; // Puedes ajustar el volumen
      gameOverAudio.play();
    }
    setBalloons((prev) => prev.filter((b) => b.id !== id));
  };

  // Slice balloon (mouse over)
  const handleBalloonSlice = (id) => {
    const popAudio = new Audio("/pop.mp3");
    popAudio.volume = 0.55; // Puedes ajustar el volumen
    popAudio.play();
    setCoins((s) => s + 1);
    setBalloons((prev) => prev.filter((b) => b.id !== id));
  };

  // Start or restart the game
  const startGame = () => {
    setCoins(0);
    setMissed(false);
    setBalloons([]);
    setBalloonId(0);
    setGameActive(true);
    if (music && musicOn) {
      music.currentTime = 0;
      music.play();
    }
  };

  // --- UI ---
  if (!gameActive && !missed) {
    return (

      <button
        className="px-4 py-2 bg-gradient-to-br from-pink-500 to-yellow-400 text-white text-2xl font-extrabold rounded-2xl shadow-lg hover:scale-105 transition"
        onClick={startGame}
      >
        🎈 Iniciar Balloon Game
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none"
      style={{
        backgroundImage: BG_PATTERN,
        backgroundRepeat: "repeat"
      }}
    >
      {/* Pinchos arriba */}
      <div className="absolute top-0 left-0 w-full z-30" style={{ height: "56px" }}>
        <Spikes />
      </div>
      {/* Topbar */}
      <div className="w-full flex justify-between items-center px-8 pt-6 z-40 relative">
        {/* Monedas */}
        <span className="flex items-center gap-2 text-2xl font-bold text-yellow-600 drop-shadow">
          <CoinIcon className="w-8 h-8" />
          <motion.span
            key={coins}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="font-extrabold"
          >
            {coins}
          </motion.span>
        </span>
        {/* Música */}
        <button
          className={`ml-6 p-2 rounded-full shadow-lg border-2 ${musicOn ? "border-yellow-300 bg-yellow-100" : "border-slate-300 bg-white"
            } hover:scale-110 transition`}
          onClick={() => setMusicOn((on) => !on)}
          aria-label="toggle music"
        >
          {musicOn ? (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <path d="M9 18V6l12-2v12" stroke="#ca8a04" strokeWidth="2" />
              <circle cx="9" cy="18" r="3" fill="#fde047" stroke="#fbbf24" strokeWidth="1.5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <path d="M9 18V6l12-2v12M3 3l18 18" stroke="#64748b" strokeWidth="2" />
              <circle cx="9" cy="18" r="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
            </svg>
          )}
        </button>
        {/* Quit */}
        <button
          onClick={() => setGameActive(false)}
          className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-red-600 transition ml-6"
        >
          Quit
        </button>
      </div>
      {/* Balloons */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <AnimatePresence>
          {balloons.map((b) => (
            <Balloon
              key={b.id}
              {...b}
              onSlice={handleBalloonSlice}
              onFinish={handleBalloonFinish}
              delay={0}
            // Puedes añadir skins aquí con prop balloonSkin
            />
          ))}
        </AnimatePresence>
      </div>
      {/* Game Over */}
      {missed && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl px-12 py-8 shadow-2xl flex flex-col items-center"
          >
            <div className="text-4xl font-extrabold text-pink-600 mb-4 animate-bounce">
              🎈 Game Over!
            </div>
            <div className="flex items-center gap-2 text-black text-2xl font-bold mb-2">
              <CoinIcon className="w-8 h-8" />
              {coins} <span className="ml-1 text-yellow-600">coins</span>
            </div>
            <button
              onClick={startGame}
              className="mt-4 px-8 py-3 bg-gradient-to-br from-sky-400 to-pink-400 text-white text-xl rounded-2xl font-bold shadow hover:scale-105 transition"
            >
              Play Again
            </button>
          </motion.div>
        </div>
      )}
      {/* Tienda de skins: aquí podrías poner el botón/menú más adelante */}
    </div>
  );
};

export default BalloonGame;
