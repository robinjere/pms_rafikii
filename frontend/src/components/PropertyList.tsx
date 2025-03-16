import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Property } from '../types/types';
import debounce from 'lodash/debounce';
import ConfirmDialog from './ConfirmDialog';
import { deleteProperty } from '../utils/api';

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL;
console.log('REACT_APP_BACKEND_API_BASE_URL: ', process.env.REACT_APP_BACKEND_API_BASE_URL);
console.log('API_BASE_URL: ', API_BASE_URL);

const PropertiesList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'residential' | 'commercial'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; propertyId: string | null }>({
    isOpen: false,
    propertyId: null
  });
  const navigate = useNavigate();

  const fetchProperties = useCallback(async (search?: string, type?: string, page?: number) => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/properties/search?`;
      if (search) url += `term=${encodeURIComponent(search)}&`;
      if (type && type !== 'all') url += `type=${type}&`;
      url += `page=${page || pagination.page}&limit=${pagination.limit}`;
      url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      setProperties(data.items || []);
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, sortBy, sortOrder]);

  const debouncedSearch = useCallback(
    debounce((search: string, type: string) => {
      fetchProperties(search, type);
    }, 300),
    [fetchProperties]
  );

  // Initial load
  useEffect(() => {
    fetchProperties();
  }, []);

  // Search/filter effect
  useEffect(() => {
    fetchProperties(searchTerm, filter);
  }, [searchTerm, filter, sortBy, sortOrder, fetchProperties]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value, filter);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleSortOrderToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDelete = async (propertyId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setDeleteConfirm({ isOpen: true, propertyId });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.propertyId) return;
    
    try {
      await deleteProperty(deleteConfirm.propertyId);
      fetchProperties(searchTerm, filter, pagination.page);
    } catch (error) {
      console.error('Error deleting property:', error);
    } finally {
      setDeleteConfirm({ isOpen: false, propertyId: null });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
        <Link
          to="/properties/new"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Add New Property
        </Link>
      </div>

      <div className="mb-6 space-y-4">
        {/* Search Input */}
        <div className="flex">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter and Sorting controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <label className="mr-2 text-gray-700">Filter by type:</label>
            <select
              aria-label="Filter properties by type"
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'residential' | 'commercial')}
              className="border rounded-md px-4 py-2"
            >
              <option value="all">All Properties</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="mr-2 text-gray-700">Sort by:</label>
            <select
              aria-label="Sort properties"
              value={sortBy}
              onChange={handleSortChange}
              className="border rounded-md px-4 py-2"
            >
              <option value="name">Name</option>
              <option value="type">Type</option>
              <option value="address">Address</option>
            </select>
            <button
              onClick={handleSortOrderToggle}
              className="p-2 border rounded-md hover:bg-gray-100"
              aria-label={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading properties...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.length > 0 ? (
            properties.map((property) => (
              <div 
                key={property.id} 
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/properties/${property.id}`)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{property.name}</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/properties/edit/${property.id}`);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => handleDelete(property.id, e)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{property.address}</p>
                  <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                    property.type === 'residential' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {property.type}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">No properties found matching the selected filter.</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination controls */}
      <div className="mt-6 flex justify-center space-x-2">
        <button
          onClick={() => fetchProperties(searchTerm, filter, pagination.page - 1)}
          disabled={pagination.page <= 1}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          onClick={() => fetchProperties(searchTerm, filter, pagination.page + 1)}
          disabled={pagination.page >= pagination.totalPages}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Property"
        message="Are you sure you want to delete this property? This will also delete all associated utility bills."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, propertyId: null })}
      />
    </div>
  );
};

export default PropertiesList;