import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SegmentForm from '../../components/segments/SegmentForm';
import { createSegment } from '../../services/segmentService';
import Loader from '../../components/common/Loader';
import { toast } from 'react-hot-toast';

const SegmentCreate = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await createSegment(formData);
      toast.success('Segment created successfully');
      navigate('/segments');
    } catch (err) {
      console.error("Line 21 : ",err);
      toast.error(err.response?.data?.message || 'Failed to create segment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create New Segment</h1>
      <SegmentForm onSubmit={handleSubmit} />
    </div>
  );
};

export default SegmentCreate;