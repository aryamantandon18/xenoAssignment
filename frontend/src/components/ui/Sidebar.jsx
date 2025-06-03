import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiFilter, FiMail, FiSettings } from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <FiHome className="h-5 w-5" /> },
    { name: 'Customers', path: '/customers', icon: <FiUsers className="h-5 w-5" /> },
    { name: 'Segments', path: '/segments', icon: <FiFilter className="h-5 w-5" /> },
    { name: 'Campaigns', path: '/campaigns', icon: <FiMail className="h-5 w-5" /> },
    { name: 'Settings', path: '/settings', icon: <FiSettings className="h-5 w-5" /> },
  ];

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="hidden md:flex md:flex-shrink-0"
    >
      <div className="flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
              >
                <span className="mr-3 text-gray-500 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300">
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Xeno CRM
              </p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                v1.0.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;