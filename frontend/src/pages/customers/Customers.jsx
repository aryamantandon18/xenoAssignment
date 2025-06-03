import { useState, useEffect } from 'react';
import CustomerList from '../../components/customers/CustomerList';
import { getCustomers } from '../../services/customerService';
import Loader from '../../components/common/Loader';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomers();
        setCustomers(response?.data?.data?.customers);
      } catch (err) {
        console.error(err.response?.data?.message || "Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customers</h1>
      <CustomerList customers={customers} />
    </div>
  );
};

export default Customers;