import { Link } from 'react-router-dom';
import CampaignCard from './CampaignCard';
import Card from '../common/Card';

const CampaignList = ({ campaigns }) => {
  if (campaigns.length === 0) {
    return (
      <Card>
        <p className="text-center text-gray-500 py-8">
          No campaigns found. Create your first campaign to get started.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {campaigns.map((campaign) => (
        <Link to={`/campaigns/${campaign._id}`} key={campaign._id}>
          <CampaignCard campaign={campaign} />
        </Link>
      ))}
    </div>
  );
};

export default CampaignList;