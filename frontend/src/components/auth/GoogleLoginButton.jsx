import { useAuth } from '../../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';

const GoogleLoginButton = () => {
  const { googleSignIn, loading } = useAuth();

  return (
    <motion.button
      onClick={googleSignIn}
      type="button"
      disabled={loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <FcGoogle className="h-5 w-5 mr-2" />
      {loading ? 'Signing in...' : 'Continue with Google'}
    </motion.button>
  );
};

export default GoogleLoginButton;