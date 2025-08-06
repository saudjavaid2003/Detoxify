import React, { useState, useEffect } from 'react';
import axios from 'axios';

const YouTubeTrackingDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [videoLogs, setVideoLogs] = useState([]);
  const [learningProgress, setLearningProgress] = useState([]);
  const [activeTab, setActiveTab] = useState('summary');

  // Get auth token
  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        
        const [summaryRes, logsRes, progressRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/tracking/summary/${userId}`, getAuthHeader()),
          axios.get(`http://localhost:5000/api/tracking/logs/${userId}`, getAuthHeader()),
          axios.get(`http://localhost:5000/api/tracking/progress/${userId}`, getAuthHeader())
        ]);

        setStats(summaryRes.data);
        setVideoLogs(logsRes.data.logs);
        setLearningProgress(progressRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format time (minutes to HH:MM:SS)
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes * 60) % 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
          YouTube Tracking Dashboard
        </h1>

        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="text-red-300 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 font-medium ${activeTab === 'summary' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 font-medium ${activeTab === 'logs' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            Video Logs
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 font-medium ${activeTab === 'progress' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            Learning Progress
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Summary Tab */}
            {activeTab === 'summary' && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-2">Total Watch Time</h3>
                  <p className="text-2xl font-bold text-blue-400">
                    {formatTime(stats.totalWatchTime)}
                  </p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-2">Videos Watched</h3>
                  <p className="text-2xl font-bold text-green-400">
                    {stats.totalVideos}
                  </p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-2">Avg. Time/Video</h3>
                  <p className="text-2xl font-bold text-purple-400">
                    {formatTime(stats.averageTimePerVideo)}
                  </p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-2">Last Watched</h3>
                  <p className="text-xl text-yellow-400">
                    {formatDate(stats.lastWatched)}
                  </p>
                </div>

                {/* Top Videos */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 col-span-1 md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Most Watched Videos</h3>
                  <div className="space-y-3">
                    {stats.topTitles.map((video, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="truncate flex-1">{video.title}</span>
                        <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                          {video.count} views
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Video Logs Tab */}
            {activeTab === 'logs' && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Video Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time Spent</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Watched At</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {videoLogs.map((log) => (
                        <tr key={log._id} className="hover:bg-gray-700/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-600 rounded flex items-center justify-center">
                                <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M10 16.5l6-4.5-6-4.5v9z" />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">{log.videoTitle}</div>
                                <div className="text-sm text-gray-400">{log.videoUrl}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400">
                            {formatTime(log.timeSpent)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {formatDate(log.clickedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Learning Progress Tab */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                {learningProgress.map((item, index) => (
                  <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">{item.interest}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.completed ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                      }`}>
                        {item.completed ? 'Completed' : 'Not Started'}
                      </span>
                    </div>
                    
                    {item.relatedVideos.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-400">Related Videos:</h4>
                        {item.relatedVideos.map((video, vidIndex) => (
                          <div key={vidIndex} className="bg-gray-700/50 p-3 rounded-lg">
                            <div className="flex justify-between">
                              <span className="text-white">{video.videoTitle}</span>
                              <span className="text-blue-400">{formatTime(video.timeSpent)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No videos watched for this interest yet</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default YouTubeTrackingDashboard;