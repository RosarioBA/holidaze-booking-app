// src/components/TestApi.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Adjust import path as needed
import { getBookingById } from '../api/bookingService';

interface TestApiProps {
  bookingId?: string;
}

const TestApi: React.FC<TestApiProps> = ({ bookingId = '3c80886a-06af-4c9c-8b15-d06a47b21807' }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const testApi = async () => {
      if (!token) {
        setError('No auth token available. Please log in first.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Test fetching a booking
        const booking = await getBookingById(bookingId, token);
        setData(booking);
        console.log('API test successful:', booking);
      } catch (err) {
        console.error('API test failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, [bookingId, token]);

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-bold mb-4">API Test</h2>
      
      {loading && (
        <div className="text-blue-500">Loading...</div>
      )}
      
      {error && (
        <div className="text-red-500 p-2 bg-red-50 rounded border border-red-200 mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {data && (
        <div className="mt-4">
          <h3 className="font-bold">Result:</h3>
          <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-60 text-sm mt-2">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <p>This component tests fetching a booking with ID: {bookingId}</p>
        <p>Check the console for more detailed logs.</p>
      </div>
    </div>
  );
};

export default TestApi;