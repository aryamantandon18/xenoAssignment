// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import { FiMail, FiUsers, FiBarChart2 } from 'react-icons/fi';

// const CampaignCard = ({ campaign }) => {
//   const deliveryRate = campaign.stats.total > 0 
//     ? Math.round((campaign.stats.delivered / campaign.stats.total) * 100) 
//     : 0;

//   return (
//     <motion.div 
//       whileHover={{ scale: 1.02 }}
//       className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//     >
//       <div className="flex items-start justify-between">
//         <div className="flex-1 min-w-0">
//           <Link to={`/campaigns/${campaign._id}`} className="block">
//             <h4 className="text-md font-medium text-gray-900 dark:text-white truncate">
//               {campaign.title}
//             </h4>
//             <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
//               {campaign.message.substring(0, 60)}...
//             </p>
//           </Link>
//         </div>
//         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//           campaign.status === 'SENT'
//             ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
//             : campaign.status === 'FAILED'
//             ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
//             : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
//         }`}>
//           {campaign.status}
//         </span>
//       </div>

//       <div className="mt-3 grid grid-cols-3 gap-2">
//         <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
//           <FiMail className="flex-shrink-0 mr-1.5 h-4 w-4" />
//           <span>{campaign.stats.total} sent</span>
//         </div>
//         <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
//           <FiUsers className="flex-shrink-0 mr-1.5 h-4 w-4" />
//           <span>{campaign.stats.opened} opened</span>
//         </div>
//         <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
//           <FiBarChart2 className="flex-shrink-0 mr-1.5 h-4 w-4" />
//           <span>{deliveryRate}% delivered</span>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default CampaignCard;

import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';

const CampaignCard = ({ campaign }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{campaign.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {campaign.status}
          </p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {campaign.stats.total} recipients
        </span>
      </div>
      <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
        <FiSend className="mr-2" />
        <span>
          {new Date(campaign.createdAt).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
};

export default CampaignCard;