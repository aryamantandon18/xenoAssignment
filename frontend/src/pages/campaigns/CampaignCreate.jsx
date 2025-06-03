import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampaignForm from '../../components/campaigns/CampaignForm';
import { createCampaign } from '../../services/campaignService';
import Loader from '../../components/common/Loader';
import { toast } from 'react-hot-toast';

const CampaignCreate = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await createCampaign(formData);
      toast.success('Campaign created successfully');
      navigate('/campaigns');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create New Campaign</h1>
      <CampaignForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CampaignCreate;