import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SegmentPreview from '../../components/segments/SegmentPreview';
import { getSegment } from '../../services/segmentService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';

const SegmentDetail = () => {
  const [segment, setSegment] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

useEffect(() => {
  const fetchSegment = async () => {
    try {
      const response = await getSegment(id);
      const segment = response.data?.data?.segment;
      if (!segment) {
        throw new Error('Segment data not found');
      }
      setSegment(segment);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to fetch segment');
      navigate('/segments');
    } finally {
      setLoading(false);
    }
  };

  fetchSegment();
}, [id, navigate]);

  if (loading || !segment) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{segment.name}</h1>
        <Button onClick={() => navigate('/segments')}>
          Back to Segments
        </Button>
      </div>
      <SegmentPreview segment={segment} />
    </div>
  );
};

export default SegmentDetail;