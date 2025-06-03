import { useState, useEffect } from 'react';
import { previewSegment } from '../../services/segmentService';
import Loader from '../common/Loader';
import Table from '../common/Table';

const SegmentPreview = ({ segment }) => {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPreview = async () => {
      setLoading(true);
      try {
        const response = await previewSegment({ rules: segment.rules, logicOperator: segment.logicOperator })
        setPreviewData(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPreview();
  }, [segment]);

  if (loading) return <Loader />;

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Total Spent', accessor: 'totalSpent' },
    { header: 'Last Order', accessor: 'lastOrderAt' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="font-medium mb-2">Segment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{segment.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Estimated Size</p>
            <p className="font-medium">{segment.estimatedSize} customers</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Matching Logic</p>
            <p className="font-medium">
              {segment.logicOperator === 'AND' ? 'All conditions' : 'Any condition'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="font-medium mb-2">Rules</h3>
        <div className="space-y-2">
          {segment.rules.map((rule, index) => (
            <div key={index} className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="font-mono">
                {rule.field} {rule.operator} {rule.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {previewData && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Sample Customers ({previewData.count} total)</h3>
          </div>
          <Table
            columns={columns}
            data={previewData.customers.map(customer => ({
              ...customer,
              lastOrderAt: customer.lastOrderAt 
                ? new Date(customer.lastOrderAt).toLocaleDateString() 
                : 'Never'
            }))}
          />
        </div>
      )}
    </div>
  );
};

export default SegmentPreview;