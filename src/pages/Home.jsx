import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background */}
      <img
        src="/bg.jpg"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-[92%] max-w-[420px] min-h-[50vh] sm:min-h-[55vh] 
                   flex flex-col justify-between
                    px-5 pt-8 pb-6 sm:px-6 sm:pt-14 sm:pb-7 text-center z-10"
      >

        {/* Top Section */}
        <div className="flex flex-col items-center mt-3 sm:mt-5">

          {/* Character */}
          <motion.img
            src="/character.png"
            className="w-16 sm:w-20 md:w-24 "
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />

          {/* Title */}
          <h1 className="text-3xl sm:text-3xl font-bold text-gray-800 mb-2">
            MindSprint
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-sm sm:text-base mb-4">
            Train your memory and reaction speed 🚀
          </p>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap justify-center mb-6 text-xs sm:text-sm">
            <span className="px-3 py-1 rounded-lg bg-gray-200">Memory</span>
            <span className="px-3 py-1 rounded-lg bg-gray-200">Speed</span>
            <span className="px-3 py-1 rounded-lg bg-gray-200">Levels</span>
          </div>
        </div>

        {/*  Middle Section (NEW - fills gap nicely) */}
        <div className="text-gray-700 text-sm sm:text-base space-y-2">
          <p> Improve focus & memory</p>
          <p> Test your reaction speed</p>
          <p> Beat your high score</p>
        </div>

        {/*  Bottom Section */}
        <div className="flex flex-col items-center">

          {/* Start Button */}
          <motion.button
            onClick={() => navigate("/game")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="mt-4 px-6 py-3 sm:px-8 sm:py-3 
                       rounded-xl bg-gradient-to-r 
                       from-green-400 to-emerald-500 
                       text-white font-semibold shadow-lg"
          >
            Start Game
          </motion.button>

          {/* Footer */}
          <p className="mt-2 text-xs text-gray-500">
            Built with React + Motion
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;