// Example component showing how to use the API
import React from 'react';
import { useApiData, useApiRequest } from '../utils/hooks';
import { apiHelpers, api } from '../utils/api';

const ApiExample = () => {
  // Example 1: Fetch data automatically
  const { data: plants, loading: plantsLoading, error: plantsError } = useApiData(
    apiHelpers.getPlants,
    [] // dependencies - empty means fetch once on mount
  );

  // Example 2: Manual API calls
  const { loading: actionLoading, error: actionError, execute } = useApiRequest();

  const handleCreatePlant = async () => {
    try {
      const newPlant = {
        name: 'New Hydrogen Plant',
        capacity: 100,
        location: { lat: 40.7128, lng: -74.0060 }
      };
      
      const result = await execute(() => 
        api.post('/api/plants', newPlant)
      );
      
      console.log('Plant created:', result);
    } catch (error) {
      console.error('Failed to create plant:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">API Connection Example</h2>
      
      {/* Display fetched data */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Production Plants</h3>
        {plantsLoading && <div>Loading plants...</div>}
        {plantsError && <div className="text-red-500">Error: {plantsError}</div>}
        {plants && (
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify(plants, null, 2)}
          </pre>
        )}
      </div>
      
      {/* Manual action */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Create New Plant</h3>
        <button
          onClick={handleCreatePlant}
          disabled={actionLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {actionLoading ? 'Creating...' : 'Create Plant'}
        </button>
        {actionError && <div className="text-red-500 mt-2">Error: {actionError}</div>}
      </div>
      
      {/* API Status */}
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="text-lg font-semibold mb-2">Connection Status</h3>
        <p><strong>API URL:</strong> {import.meta.env.VITE_API_URL || 'http://localhost:3000'}</p>
        <p><strong>Python API URL:</strong> {import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000'}</p>
      </div>
    </div>
  );
};

export default ApiExample;
