import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const AttachSolutionModal = ({ isOpen, onClose, contestInfo }) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function sendUrl() {
    try {
      const res = await axios.post('http://localhost:3000/api/attachSolution', {
        url: youtubeUrl,
        id: contestInfo.id,
        host: contestInfo.host.split('.')[0], // Fixed syntax
      });
  
      if (res.status !== 200) {
        console.log("Error in setting URL:", res.data);
      } else {
        console.log("URL successfully set:", res.data);
      }
    } catch (error) {
      console.error("Error in API call:", error);
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
  
    // Basic YouTube URL validation
    if (!youtubeUrl.trim()) {
      setError('YouTube URL is required');
      return;
    }
  
    if (!youtubeUrl.includes('youtube.com/') && !youtubeUrl.includes('youtu.be/')) {
      setError('Please enter a valid YouTube URL');
      return;
    }
  
    setIsSubmitting(true);
  
    // Call sendUrl immediately
    sendUrl()
      .then(() => {
        setTimeout(() => {
          setIsSubmitting(false);
          console.log('Solution submitted:', {
            contestId: contestInfo.id,
            contestName: contestInfo.name,
            youtubeUrl,
          });
          onClose();
        }, 800);
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.error("Submission failed:", error);
      });
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Attach Solution</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {contestInfo && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <p className="font-medium text-blue-700">{contestInfo.name}</p>
            <div className="flex items-center mt-1 text-sm text-blue-600">
              <span className="bg-blue-100 px-2 py-1 rounded">{contestInfo.platform}</span>
              <span className="ml-2">{contestInfo.date}</span>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-1">
              YouTube Solution URL*
            </label>
            <input
              id="youtube-url"
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
          
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md text-white ${
                isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Solution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AttachSolutionModal;