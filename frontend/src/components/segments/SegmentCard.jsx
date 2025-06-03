// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import { FiFilter, FiUsers } from 'react-icons/fi';

// const SegmentCard = ({ segment }) => {
//   return (
//     <motion.div 
//       whileHover={{ scale: 1.02 }}
//       className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//     >
//       <div className="flex items-start justify-between">
//         <div className="flex-1 min-w-0">
//           <Link to={`/segments/${segment._id}`} className="block">
//             <h4 className="text-md font-medium text-gray-900 dark:text-white truncate">
//               {segment.name}
//             </h4>
//             <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//               {segment.rules.length} rules • {segment.logicOperator} logic
//             </p>
//           </Link>
//         </div>
//         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
//           {segment.estimatedSize} customers
//         </span>
//       </div>

//       <div className="mt-3">
//         <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
//           <FiFilter className="flex-shrink-0 mr-1.5 h-4 w-4" />
//           <span className="truncate">
//             {segment.rules[0]?.field} {segment.rules[0]?.operator} {segment.rules[0]?.value}
//             {segment.rules.length > 1 ? ` +${segment.rules.length - 1} more` : ''}
//           </span>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default SegmentCard;

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { FiFilter, FiUsers } from 'react-icons/fi';

const SegmentCard = ({ segment }) => {

  useEffect(()=>{
    if(!segment){
      return;
    }
  },[segment])
  
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="text-md font-medium text-gray-900 dark:text-white truncate">
            {segment.name}
          </h4>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {segment.rules.length} rules • {segment.logicOperator} logic
          </p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {segment.estimatedSize} customers
        </span>
      </div>

      <div className="mt-3">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <FiFilter className="flex-shrink-0 mr-1.5 h-4 w-4" />
          <span className="truncate">
            {segment.rules[0]?.field} {segment.rules[0]?.operator} {segment.rules[0]?.value}
            {segment.rules.length > 1 ? ` +${segment.rules.length - 1} more` : ''}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SegmentCard;