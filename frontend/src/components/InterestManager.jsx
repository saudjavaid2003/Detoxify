import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InterestManager = () => {
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState('');
  const [bulkInterests, setBulkInterests] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get token from localStorage
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  // Fetch interests
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:5000/api/user/interests', getAuthHeader());
        setInterests(data.interests || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch interests');
      } finally {
        setLoading(false);
      }
    };
    fetchInterests();
  }, []);

  // Add single interest
  const handleAddInterest = async (e) => {
    e.preventDefault();
    if (!newInterest.trim()) return;
    
    try {
      setLoading(true);
      const { data } = await axios.post(
        'http://localhost:5000/api/user/interests',
        { interests: [...interests, newInterest.trim()] },
        getAuthHeader()
      );
      setInterests(data.interests);
      setNewInterest('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add interest');
    } finally {
      setLoading(false);
    }
  };

  // Bulk update
  const handleBulkUpdate = async (e) => {
    e.preventDefault();
    const interestsArray = bulkInterests.split(',')
      .map(item => item.trim())
      .filter(item => item);

    if (!interestsArray.length) return;

    try {
      setLoading(true);
      const { data } = await axios.put(
        'http://localhost:5000/api/user/interests',
        { interests: interestsArray },
        getAuthHeader()
      );
      setInterests(data.interests);
      setBulkInterests('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update interests');
    } finally {
      setLoading(false);
    }
  };

  // Delete all
  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete all interests?')) return;
    
    try {
      setLoading(true);
      await axios.delete('http://localhost:5000/api/user/interests', getAuthHeader());
      setInterests([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete interests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="border-b border-gray-700 pb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Interests Manager
          </h1>
          <p className="text-gray-400 mt-2">Organize your professional interests</p>
        </header>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="text-red-300 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Add Interest Card */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Add New Interest
          </h2>
          <form onSubmit={handleAddInterest} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Enter an interest..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                disabled={loading}
              />
              <div className="absolute right-3 top-3 text-gray-400">
                {loading ? '⌛' : '✨'}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !newInterest.trim()}
              className="px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <span className="animate-pulse">Adding...</span>
              ) : (
                'Add'
              )}
            </button>
          </form>
        </div>

        {/* Bulk Update Card */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Bulk Update Interests
          </h2>
          <form onSubmit={handleBulkUpdate}>
            <div className="relative">
              <textarea
                value={bulkInterests}
                onChange={(e) => setBulkInterests(e.target.value)}
                placeholder="Enter multiple interests separated by commas..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 min-h-[120px]"
                disabled={loading}
              />
              <div className="absolute right-3 top-3 text-gray-400">
                {loading ? '⌛' : '📝'}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !bulkInterests.trim()}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Update All Interests'}
            </button>
          </form>
        </div>

        {/* Current Interests Card */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Your Current Interests
            <span className="ml-auto text-sm bg-gray-700 px-3 py-1 rounded-full">
              {interests.length} items
            </span>
          </h2>
          
          {loading && !interests.length ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : interests.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No interests added yet</p>
              <p className="text-sm mt-2">Start by adding some above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {interests.map((interest, index) => (
                <div 
                  key={index}
                  className="bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 transition-all duration-200 flex items-center"
                >
                  <span className="truncate flex-1">{interest}</span>
                  <span className="text-xs bg-gray-600 px-2 py-1 rounded ml-2">
                    #{index + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Danger Zone Card */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-red-900/50">
          <h2 className="text-xl font-semibold mb-4 text-red-400 flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Danger Zone
          </h2>
          <p className="text-gray-400 mb-4">Permanently delete all your interests</p>
          <button
            onClick={handleDeleteAll}
            disabled={loading || interests.length === 0}
            className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Delete All Interests
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterestManager;