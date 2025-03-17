import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const AttachSolutionModal = ({ isOpen, onClose, contestInfo, isDarkMode=false }) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-full ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
        >
          <X size={20} />
        </button>
        
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Attach Solution for {contestInfo?.event}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="solutionUrl" className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Solution URL
            </label>
            <input
              type="url"
              id="solutionUrl"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://github.com/yourusername/solution"
              required
              className={`w-full p-2 border rounded-md ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 mr-2 rounded-md ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Solution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttachSolutionModal;