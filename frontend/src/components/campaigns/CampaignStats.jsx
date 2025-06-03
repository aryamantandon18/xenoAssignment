import { FiSend, FiCheck, FiX, FiEye, FiMousePointer } from 'react-icons/fi';

const CampaignStats = ({ campaign }) => {
  const stats = [
    {
      name: 'Total Sent',
      value: campaign.stats.total,
      icon: FiSend,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Delivered',
      value: campaign.stats.delivered || 0,
      icon: FiCheck,
      color: 'bg-green-100 text-green-800'
    },
    {
      name: 'Failed',
      value: campaign.stats.failed || 0,
      icon: FiX,
      color: 'bg-red-100 text-red-800'
    },
    {
      name: 'Opened',
      value: campaign.stats.opened || 0,
      icon: FiEye,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      name: 'Clicked',
      value: campaign.stats.clicked || 0,
      icon: FiMousePointer,
      color: 'bg-yellow-100 text-yellow-800'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-semibold">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="font-medium mb-2">Message Content</h3>
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
          <p className="whitespace-pre-line">{campaign.message}</p>
        </div>
      </div>
    </div>
  );
};

export default CampaignStats;