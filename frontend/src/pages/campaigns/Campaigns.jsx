import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CampaignList from '../../components/campaigns/CampaignList';
import Button from '../../components/common/Button';
import { getCampaigns } from '../../services/campaignService';
import Loader from '../../components/common/Loader';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await getCampaigns();
        setCampaigns(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <Button onClick={() => navigate('/campaigns/new')}>
          Create Campaign
        </Button>
      </div>
      <CampaignList campaigns={campaigns} />
    </div>
  );
};

export default Campaigns;