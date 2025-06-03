import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CampaignStats from '../../components/campaigns/CampaignStats';
import { getCampaign } from '../../services/campaignService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';

const CampaignDetail = () => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await getCampaign(id);
        console.log("Line 19 : ",response.data)
        setCampaign(response?.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch campaign');
        navigate('/campaigns');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id, navigate]);

  if (loading || !campaign) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{campaign.title}</h1>
        <Button onClick={() => navigate('/campaigns')}>
          Back to Campaigns
        </Button>
      </div>
      <CampaignStats campaign={campaign} />
    </div>
  );
};

export default CampaignDetail;