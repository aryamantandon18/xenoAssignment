import { motion } from 'framer-motion';
import { FiDollarSign, FiShoppingBag, FiCalendar } from 'react-icons/fi';

const CustomerCard = ({ customer }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <span className="text-indigo-600 dark:text-indigo-300 font-medium">
              {customer.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-md font-medium text-gray-900 dark:text-white truncate">
            {customer.name}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {customer.email}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FiDollarSign className="mr-1" />
              <span>${customer.totalSpent.toFixed(2)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FiShoppingBag className="mr-1" />
              <span>{customer.visitCount} visits</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FiCalendar className="mr-1" />
              <span>
                {customer.lastOrderAt 
                  ? new Date(customer.lastOrderAt).toLocaleDateString() 
                  : 'No orders'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerCard;