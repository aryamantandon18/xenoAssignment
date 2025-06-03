import { Link } from 'react-router-dom';
import SegmentCard from './SegmentCard';
import Card from '../common/Card';

const SegmentList = ({ segments }) => {
  if (segments.length === 0) {
    return (
      <Card>
        <p className="text-center text-gray-500 py-8">
          No segments found. Create your first segment to get started.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {segments?.map((segment) => (
        <Link to={`/segments/${segment._id}`} key={segment._id}>
          <SegmentCard segment={segment} />
        </Link>
      ))}
    </div>
  );
};

export default SegmentList;