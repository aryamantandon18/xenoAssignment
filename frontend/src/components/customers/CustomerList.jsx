import CustomerCard from './CustomerCard';
import Table from '../common/Table';

const CustomerList = ({ customers }) => {
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Total Spent', accessor: 'totalSpent' },
    { header: 'Last Order', accessor: 'lastOrderAt' },
  ];

  const data = customers.map(customer => ({
    ...customer,
    lastOrderAt: customer.lastOrderAt 
      ? new Date(customer.lastOrderAt).toLocaleDateString() 
      : 'Never',
    totalSpent: `$${customer.totalSpent.toFixed(2)}`
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <Table columns={columns} data={data} />
    </div>
  );
};

export default CustomerList;