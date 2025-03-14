import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Property, ChartDataItem, UtilityBill } from '../types/types';

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL;

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [utilities, setUtilities] = useState<UtilityBill[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchUtilities = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/utilities/${id}?page=${pagination.page}&limit=${pagination.limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      if (!response.ok) throw new Error('Failed to fetch utilities');
      const data = await response.json();
      setUtilities(data.items);
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages
      });
    } catch (error) {
      console.error('Error fetching utilities:', error);
    }
  };

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/properties/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch property details');
        }
        const data = await response.json();
        setProperty(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property details:', error);
        setError('Failed to load property details. Please try again later.');
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  useEffect(() => {
    if (id) fetchUtilities();
  }, [id, pagination.page, sortBy, sortOrder]);

  // Prepare chart data
  const getChartData = (): ChartDataItem[] => {
    if (!property || !property.utilities) return [];
    
    // Group utilities by month and utility type
    const utilityByMonth: Record<string, ChartDataItem> = {};
    
    property.utilities.forEach((utility: UtilityBill) => {
      const date = new Date(utility.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!utilityByMonth[monthYear]) {
        utilityByMonth[monthYear] = {
          name: monthYear,
          electricity: 0,
          water: 0,
          gas: 0
        };
      }
      
      utilityByMonth[monthYear][utility.type] += parseFloat(utility.amount.toString());
    });
    
    return Object.values(utilityByMonth);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Loading property details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600">{error}</p>
        <Link to="/properties" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Properties List
        </Link>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Property not found</p>
        <Link to="/properties" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Properties List
        </Link>
      </div>
    );
  }

  const chartData = getChartData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/properties" className="text-blue-600 hover:underline">
          &larr; Back to Properties
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{property.name}</h1>
        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-semibold">Address:</span> {property.address}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Type:</span>{' '}
            <span className={`inline-block px-3 py-1 text-sm rounded-full ${
              property.type === 'residential'
                ? 'bg-green-100 text-green-800'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {property.type}
            </span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Utility Bills</h2>
          <Link
            to={`/utilities/new?propertyId=${property.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Add New Utility Bill
          </Link>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <select
              aria-label="Sort utility bills"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-md px-4 py-2"
            >
              <option value="date">Sort by Date</option>
              <option value="type">Sort by Type</option>
              <option value="amount">Sort by Amount</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border rounded-md"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {utilities && utilities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left text-gray-600">Type</th>
                  <th className="py-2 px-4 text-left text-gray-600">Amount</th>
                  <th className="py-2 px-4 text-left text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {utilities.map((utility) => (
                  <tr key={utility.id} className="border-b">
                    <td className="py-2 px-4">
                      <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                        utility.type === 'electricity'
                          ? 'bg-yellow-100 text-yellow-800'
                          : utility.type === 'water'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {utility.type}
                      </span>
                    </td>
                    <td className="py-2 px-4">${utility.amount.toFixed(2)}</td>
                    <td className="py-2 px-4">
                      {new Date(utility.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 py-4">No utility bills recorded for this property yet.</p>
        )}

        <div className="mt-4 flex justify-center space-x-2">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page <= 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page >= pagination.totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Utility Consumption History</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${typeof value === 'number' ? value.toFixed(2) : value}`, 'Amount']} />
              <Legend />
              <Bar dataKey="electricity" name="Electricity" fill="#F59E0B" />
              <Bar dataKey="water" name="Water" fill="#3B82F6" />
              <Bar dataKey="gas" name="Gas" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;