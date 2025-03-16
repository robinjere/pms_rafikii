import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FormErrors } from '../types/types';

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL;

const EditUtilityBillForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [utilityBill, setUtilityBill] = useState({
    type: '',
    amount: '',
    date: '',
    propertyId: ''
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUtilityBill = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/utilities/bill/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch utility bill');
        }
        const data = await response.json();
        setUtilityBill(data);
        setLoading(false);
      } catch (error) {
        setErrors({ form: 'Failed to fetch utility bill' });
        setLoading(false);
      }
    };

    fetchUtilityBill();
  }, [id]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!utilityBill.type) {
      newErrors.type = 'Utility type is required';
    }
    
    if (!utilityBill.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(utilityBill.amount)) || parseFloat(utilityBill.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!utilityBill.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/utilities/bill/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(utilityBill)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update utility bill');
      }
      
      navigate(`/properties/${utilityBill.propertyId}`);
    } catch (error) {
      setErrors({ form: 'Failed to update utility bill' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUtilityBill({
      ...utilityBill,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to={`/properties/${utilityBill.propertyId}`} className="text-blue-600 hover:underline">
          &larr; Back
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Utility Bill</h1>
        
        {errors.form && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.form}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
              Utility Type
            </label>
            <select
              id="type"
              name="type"
              value={utilityBill.type}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="electricity">Electricity</option>
              <option value="water">Water</option>
              <option value="gas">Gas</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">
              Amount (TZS)
            </label>
            <input
              type="number"
              step="0.01"
              id="amount"
              name="amount"
              value={utilityBill.amount}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter amount"
              min="0"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={utilityBill.date}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate(`/properties/${utilityBill.propertyId}`)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md mr-4 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating...' : 'Update Utility Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUtilityBillForm;
