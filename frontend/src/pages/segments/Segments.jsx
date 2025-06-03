import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SegmentList from '../../components/segments/SegmentList';
import Button from '../../components/common/Button';
import { getSegments } from '../../services/segmentService';
import Loader from '../../components/common/Loader';

const Segments = () => {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const response = await getSegments();
        setSegments(response?.data?.data?.segments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSegments();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Audience Segments</h1>
        <Button onClick={() => navigate('/segments/new')}>
          Create Segment
        </Button>
      </div>
      <SegmentList segments={segments} />
    </div>
  );
};

export default Segments;