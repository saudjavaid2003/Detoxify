import React, { useState } from 'react';

const InterestManager = () => {
  const [newInterest, setNewInterest] = useState('');
  const [interests, setInterests] = useState([]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Section Title */}
      <div className="text-xl font-bold border-b border-gray-600 pb-2">
        Manage Your Interests
      </div>

      {/* Add Interest */}
      <div className="bg-[#2a2a40] p-4 rounded-md">
        <h3 className="text-lg mb-2 font-semibold">➕ Add Interest</h3>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="Enter new interest"
            className="bg-[#1f1f2e] px-4 py-2 rounded-md w-full text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md">
            Add
          </button>
        </div>
      </div>

      {/* Update Interests */}
      <div className="bg-[#2a2a40] p-4 rounded-md">
        <h3 className="text-lg mb-2 font-semibold">✏️ Update Interests</h3>
        <textarea
          placeholder="Enter interests separated by commas"
          className="bg-[#1f1f2e] px-4 py-2 rounded-md w-full text-white border border-gray-600 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
        ></textarea>
        <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          Update
        </button>
      </div>

      {/* View Interests */}
      <div className="bg-[#2a2a40] p-4 rounded-md">
        <h3 className="text-lg mb-2 font-semibold">📄 Your Current Interests</h3>
        <div className="bg-[#1f1f2e] rounded-md p-3 border border-gray-600 text-sm text-gray-300 min-h-[50px]">
          {interests.length === 0 ? (
            <p>No interests yet.</p>
          ) : (
            <ul className="list-disc list-inside space-y-1">
              {interests.map((interest, index) => (
                <li key={index}>{interest}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Delete Interests */}
      <div className="bg-[#2a2a40] p-4 rounded-md">
        <h3 className="text-lg mb-2 font-semibold text-red-400">🗑️ Delete All Interests</h3>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
          Delete All
        </button>
      </div>
    </div>
  );
};

export default InterestManager;
