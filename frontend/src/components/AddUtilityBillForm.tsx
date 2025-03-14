import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Property, UtilityBillFormData, FormErrors } from '../types/types';

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL;

const AddUtilityBillForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const propertyId = queryParams.get('propertyId');
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<UtilityBillFormData>({
    propertyId: propertyId || '',
    type: 'electricity',
    amount: '',
    date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/properties`);
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data);
        
        // If no propertyId was provided in URL and we have properties, select the first one
        if (!propertyId && data.length > 0) {
          setFormData(prev => ({
            ...prev,
            propertyId: data[0].id
          }));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setErrors(prev => ({
          ...prev,
          form: 'Failed to load properties. Please try again later.'
        }));
        setLoading(false);
      }
    };

    fetchProperties();
  }, [propertyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.propertyId) {
      newErrors.propertyId = 'Property is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Utility type is required';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/utilities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create utility bill');
      }
      
      // Redirect to the property details page
      navigate(`/properties/${formData.propertyId}`);
    } catch (error) {
      console.error('Error creating utility bill:', error);
      setErrors((prev) => ({
        ...prev,
        form: error instanceof Error ? error.message : 'An error occurred while creating the utility bill'
      }));
    } finally {
      setIsSubmitting(false);
    }
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
        <Link to={propertyId ? `/properties/${propertyId}` : '/properties'} className="text-blue-600 hover:underline">
          &larr; Back
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Utility Bill</h1>
        
        {errors.form && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.form}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="propertyId" className="block text-gray-700 font-medium mb-2">
              Property
            </label>
            <select
              id="propertyId"
              name="propertyId"
              value={formData.propertyId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.propertyId ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={!!propertyId} // Disable if propertyId is provided in URL
            >
              <option value="">Select a property</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name} ({property.address})
                </option>
              ))}
            </select>
            {errors.propertyId && (
              <p className="text-red-500 text-sm mt-1">{errors.propertyId}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
              Utility Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
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
              value={formData.amount}
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
              value={formData.date}
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
              onClick={() => navigate(propertyId ? `/properties/${propertyId}` : '/properties')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md mr-4 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Add Utility Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUtilityBillForm;