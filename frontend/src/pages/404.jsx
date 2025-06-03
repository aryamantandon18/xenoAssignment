import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFound = () => {
return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full"
      >
        <motion.h1
          className="text-6xl font-bold text-indigo-600"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          404
        </motion.h1>
        <p className="mt-4 text-gray-700 text-lg">
          Oops! The page you're looking for doesn't exist.
        </p>
        <motion.img
          src="https://illustrations.popsy.co/gray/web-error.svg"
          alt="Page Not Found"
          className="w-64 mx-auto mt-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        />
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition duration-300"
        >
          Go Home
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound
