import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiUsers, FiMail, FiDollarSign, FiActivity } from 'react-icons/fi';
import api from "../../services/api"
import CampaignCard from '../../components/campaigns/CampaignCard';
import SegmentCard from '../../components/segments/SegmentCard';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [popularSegments, setPopularSegments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, campaignsRes, segmentsRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/campaigns?limit=3&sort=-createdAt'),
          api.get('/segments?limit=3&sort=-createdAt'),
        ]);
        
        setStats(statsRes.data);
        setRecentCampaigns(campaignsRes.data);
        setPopularSegments(segmentsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsCards = [
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: <FiUsers className="h-6 w-6 text-indigo-500" />,
      change: stats?.customerGrowth || 0,
    },
    {
      title: 'Active Campaigns',
      value: stats?.activeCampaigns || 0,
      icon: <FiMail className="h-6 w-6 text-blue-500" />,
      change: stats?.campaignGrowth || 0,
    },
    {
      title: 'Total Revenue',
      value: `$${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: <FiDollarSign className="h-6 w-6 text-green-500" />,
      change: stats?.revenueGrowth || 0,
    },
    {
      title: 'Engagement Rate',
      value: `${stats?.engagementRate || 0}%`,
      icon: <FiActivity className="h-6 w-6 text-purple-500" />,
      change: stats?.engagementChange || 0,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {card.title}
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {card.value}
                </p>
              </div>
              <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
                {card.icon}
              </div>
            </div>
            {card.change !== 0 && (
              <div
                className={`mt-2 text-sm ${
                  card.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {card.change > 0 ? '↑' : '↓'} {Math.abs(card.change)}% from last month
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Recent Campaigns
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentCampaigns.length > 0 ? (
              recentCampaigns.map((campaign) => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No recent campaigns
              </div>
            )}
          </div>
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-right">
            <a
              href="/campaigns"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              View all campaigns →
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Popular Segments
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {popularSegments.length > 0 ? (
              popularSegments.map((segment) => (
                <SegmentCard key={segment._id} segment={segment} />
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No segments created yet
              </div>
            )}
          </div>
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-right">
            <a
              href="/segments"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              View all segments →
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Campaign Performance
        </h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Performance chart will appear here
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;