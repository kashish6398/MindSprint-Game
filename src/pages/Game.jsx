import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// Sounds
let clickSound, winSound, loseSound;

if (typeof window !== "undefined") {
  clickSound = new Audio("/sounds/click.mp3");
  winSound = new Audio("/sounds/win.mp3");
  loseSound = new Audio("/sounds/lose.mp3");
}

// Sound handler
const playSound = (sound, duration = 500) => {
  if (!sound) return;

  sound.pause();
  sound.currentTime = 0;
  sound.play().catch(() => {});

  setTimeout(() => {
    sound.pause();
    sound.currentTime = 0;
  }, duration);
};

function Game() {
  const [pattern, setPattern] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isShowing, setIsShowing] = useState(false);
  const [level, setLevel] = useState(1);
  const [status, setStatus] = useState("idle");

  const [score, setScore] = useState(
    () => Number(localStorage.getItem("score")) || 0
  );
  const [timeLeft, setTimeLeft] = useState(5);

  const cards = [1, 2, 3, 4, 5, 6];

  // Pattern
  const generatePattern = (lvl) => {
    const newPattern = Array.from({ length: lvl + 2 }, () =>
      Math.floor(Math.random() * 6) + 1
    );

    setPattern(newPattern);
    setUserInput([]);
    setStatus("playing");
    setTimeLeft(5);
    showPattern(newPattern);
  };

  // Show pattern
  const showPattern = async (patternArr) => {
    setIsShowing(true);

    for (let i = 0; i < patternArr.length; i++) {
      setActiveIndex(patternArr[i]);
      await new Promise((res) => setTimeout(res, 500));
      setActiveIndex(null);
      await new Promise((res) => setTimeout(res, 250));
    }

    setIsShowing(false);
  };

  // Timer
  useEffect(() => {
    if (status === "playing" && !isShowing) {
      const timer = setInterval(() => {
        setTimeLeft((t) => {
          if (t === 1) {
            setStatus("lose");
            playSound(loseSound, 800);
            return 5;
          }
          return t - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, isShowing]);

  // Confetti
  const fireConfetti = () => {
    const end = Date.now() + 800;

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
      });

      confetti({
        particleCount: 6,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  // Click
  const handleClick = (num) => {
    if (isShowing || status !== "playing") return;

    playSound(clickSound, 150);

    const newInput = [...userInput, num];
    setUserInput(newInput);
    setTimeLeft(5);

    if (pattern[newInput.length - 1] !== num) {
      setStatus("lose");
      playSound(loseSound, 800);
      return;
    }

    if (newInput.length === pattern.length) {
      setStatus("win");

      fireConfetti();
      playSound(winSound, 600);

      setScore((prev) => {
        const newScore = prev + level * 10;
        localStorage.setItem("score", newScore);
        return newScore;
      });

      setTimeout(() => {
        setLevel((prev) => prev + 1);
        setStatus("idle");
      }, 1200);
    }
  };

  // Restart
  const restartGame = () => {
    setLevel(1);
    setScore(0);
    localStorage.setItem("score", 0);
    setStatus("idle");
    setUserInput([]);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background Image */}
      <img
        src="/bg.jpg"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* CONTENT ON BOARD */}
      <div className="absolute top-[27%] left-1/2 -translate-x-1/2 w-[80%] max-w-[400px] flex flex-col items-center">

        {/* BOARD */}
        <div className="w-full px-6 py-2 rounded-2xl flex flex-col items-center">

          {/* Character */}
          <motion.img
            src="/character.png"
            className="w-16 sm:w-20 md:w-24 drop-shadow-lg"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />

          {/* Title */}
          <h1 className="mb-2 sm:mb-1 text-xl font-bold text-gray-800">
            Level {level}
          </h1>

          <p className="text-gray-600 text-s mb-4 sm:mb-1">
            {isShowing ? "👀 Watch" : " Your Turn"}
          </p>

          {/* Score */}
          <div className="flex gap-5 mb-4 px-2 py-1 rounded-lg border border-gray-300 bg-white text-lg">
            <div>
              <p className="text-sm">Score</p>
              <p className="font-bold">{score}</p>
            </div>
            <div>
              <p className="text-sm">Time</p>
              <p className="font-bold text-yellow-600">{timeLeft}s</p>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-2 ">
            {cards.map((num) => (
              <motion.div
                key={num}
                onClick={() => handleClick(num)}
                animate={{
                  scale: activeIndex === num ? 1.25 : 1,
                  rotate: activeIndex === num ? 6 : 0,
                  backgroundColor:
                    activeIndex === num ? "#fde68a" : "#ffffff",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.85 }}
                className="w-16 sm:w-16 h-14 sm:h-18 flex items-center justify-center rounded-lg bg-white border-2 border-gray-400 shadow font-bold cursor-pointer"
              >
                {num}
              </motion.div>
            ))}
          </div>

          {/* Win */}
          <AnimatePresence>
            {status === "win" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                className="mt-3 text-green-600 font-bold text-sm"
              >
                🎉 Level Complete!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lose */}
          {status === "lose" && (
            <div className="mt-2 text-center">
              <p className="text-red-500 font-bold text-sm">💀 Game Over</p>

              <button
                onClick={restartGame}
                className="mt-1 px-4 py-1 bg-red-400 text-white rounded-lg text-sm"
              >
                Restart
              </button>
            </div>
          )}
        </div>

        {/* START BUTTON (OUTSIDE BOARD) */}
        {status === "idle" && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => generatePattern(level)}
            className="mt-2 px-6 py-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold shadow-lg"
          >
            Start Game
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default Game;