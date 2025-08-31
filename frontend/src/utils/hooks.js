import React, { useState, useCallback, useEffect } from 'react';

// Custom hook for API requests with loading and error states
export const useApiRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute, setError };
};

// Hook for fetching data with caching
export const useApiData = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const { loading, error, execute } = useApiRequest();

  const fetchData = useCallback(async () => {
    try {
      const result = await execute(apiCall);
      setData(result);
      return result;
    } catch (err) {
      console.error('Failed to fetch data:', err);
      return null;
    }
  }, [apiCall, execute]);

  // Auto-fetch on mount and dependency changes
  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};
