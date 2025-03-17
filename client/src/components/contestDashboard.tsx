import { useEffect, useState } from 'react';
import { Filter, Calendar, Bookmark, BookmarkCheck, Sun, Moon } from 'lucide-react';
import { getAllPastContest, getAllUpcomingContest } from '../api/contest';
import { convertToISTFormatted, secondsToHoursMinutes } from '../services/DateAndTime';
import AttachSolutionModal from './attachLinkModal';

interface Contest {
  id: number; 
  duration: number;
  end: string;
  start: string;
  event: string;
  host: string;
  url?: string;
}

const ContestDashboard = () => {
  const initialHost = {host1:'leetcode', host2:'codeforces', host3:'codechef'};
  const [contests, setContests] = useState<Contest[]>([]);
  const [isUpcoming, setIsUpcoming] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState<Contest>();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookmarkedContests, setBookmarkedContests] = useState<number[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [host, setHost] = useState<{host1:string, host2:string, host3:string}>(initialHost);

  // Initialize dark mode and bookmarks from localStorage on component mount
  useEffect(() => {
    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem('isDarkMode');
    if (savedDarkMode) {
      const isDark = JSON.parse(savedDarkMode);
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Use system preference if no saved preference
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Load bookmarked contests
    const savedBookmarks = localStorage.getItem('bookmarkedContests');
    if (savedBookmarks) {
      setBookmarkedContests(JSON.parse(savedBookmarks));
    }
  }, []);

  // Update dark mode in localStorage and document
  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Update bookmarks in localStorage
  useEffect(() => {
    localStorage.setItem('bookmarkedContests', JSON.stringify(bookmarkedContests));
  }, [bookmarkedContests]);

  const openModal = (contest: Contest) => {
    setSelectedContest(contest);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  async function fetchContest() {
    setIsLoading(true);
    try {
      const response = isUpcoming ? await getAllUpcomingContest(host) : await getAllPastContest(host);
      console.log("response is ", response);
      if (response && response.data) {
        setContests(response.data);
      }
    } catch (error) {
      console.error("Error fetching contests:", error);
    } finally {
      setIsLoading(false);
    }
  } 

  useEffect(() => {
    fetchContest();
  }, [host, isUpcoming]);

  const platforms = ['Leetcode', "Codeforces", "CodeChef"];
  
  // Create platform combination filters
  const createPlatformCombinations = (platforms: string[]) => {
    const result = [];
    
    // Add individual platforms
    platforms.forEach(platform => {
      result.push({
        name: platform,
        platforms: [platform]
      });
    });
    
    // Add combinations of platforms (pairs)
    for (let i = 0; i < platforms.length; i++) {
      for (let j = i + 1; j < platforms.length; j++) {
        result.push({
          name: `${platforms[i]} + ${platforms[j]}`,
          platforms: [platforms[i], platforms[j]]
        });
      }
    }
    
    // Add "All Platforms" option
    result.push({
      name: "All Platforms",
      platforms: [...platforms]
    });
    
    return result;
  };
  
  const platformFilters = createPlatformCombinations(platforms);

  // State for filters
  const [activeTimeFilter, setActiveTimeFilter] = useState('upcoming');
  const [activePlatformFilter, setActivePlatformFilter] = useState(
    platformFilters.find(f => f.name === "All Platforms")
  );

  const toggleBookmark = (contestId: number) => {
    setBookmarkedContests(prev => {
      if (prev.includes(contestId)) {
        return prev.filter(id => id !== contestId);
      } else {
        return [...prev, contestId];
      }
    });
  };

  const handleActivePlatformFilter = (filter: { name: string; platforms: string[] }) => {
    const platforms = filter.platforms;
  
    setHost({
      host1: platforms.includes("Leetcode") ? "leetcode" : "",
      host2: platforms.includes("Codeforces") ? "codeforces" : "",
      host3: platforms.includes("CodeChef") ? "codechef" : "",
    });
    console.log(host, platforms);
    setActivePlatformFilter(filter);
  };

  // Filter contests based on bookmarks if showBookmarksOnly is true
  const displayedContests = showBookmarksOnly 
    ? contests.filter(contest => bookmarkedContests.includes(contest.id))
    : contests;

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Coding Contests</h1>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
        
        {/* Filter Section */}
        <div className={`rounded-lg shadow-md p-6 mb-6 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
          {/* First layer - Time Filter */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={18} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>Contest Timing</h2>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setActiveTimeFilter('upcoming');
                  setIsUpcoming(true);
                }}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTimeFilter === 'upcoming'
                    ? 'bg-blue-600 text-white'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => {
                  setActiveTimeFilter('past');
                  setIsUpcoming(false);
                }}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTimeFilter === 'past'
                    ? 'bg-blue-600 text-white'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Past
              </button>
            </div>
          </div>
          
          {/* Second layer - Platform Filter */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter size={18} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>Platforms</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {platformFilters.map((filter) => (
                <button
                  key={filter.name}
                  onClick={() => handleActivePlatformFilter(filter)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activePlatformFilter?.name === filter.name
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>

          {/* Third layer - Bookmarks Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookmarkCheck size={18} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>Bookmarks</h2>
            </div>
            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`px-4 py-2 rounded-md transition-colors ${
                showBookmarksOnly
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showBookmarksOnly ? 'Show All Contests' : 'Show Bookmarks Only'}
            </button>
          </div>
        </div>
        
        {/* Contest Cards */}
        <div className="space-y-4">
          {isLoading ? (
            <div className={`flex justify-center items-center p-12 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : displayedContests.length > 0 ? (
            displayedContests.map(contest => (
              <div 
                key={contest.id} 
                className={`rounded-lg shadow-md p-6 transition-colors duration-300 border-l-4 border-blue-500 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {contest.event}
                      </h3>
                      <button 
                        onClick={() => toggleBookmark(contest.id)}
                        className={`p-1 rounded-full transition-colors ${
                          bookmarkedContests.includes(contest.id)
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                        }`}
                        aria-label={bookmarkedContests.includes(contest.id) ? "Remove bookmark" : "Add bookmark"}
                      >
                        {bookmarkedContests.includes(contest.id) ? 
                          <BookmarkCheck size={20} /> : 
                          <Bookmark size={20} />
                        }
                      </button>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {contest.host.split(".")[0]}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {convertToISTFormatted(contest.start)}
                    </div>
                    <div className={isDarkMode ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>
                      Duration: {secondsToHoursMinutes(contest.duration)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  {activeTimeFilter === 'past' ? (
                    contest.url ? (
                      <a 
                        href={contest.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        View Solution
                      </a>
                    ) : (
                      <button 
                        onClick={() => openModal(contest)} 
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        Attach Solution
                      </button>
                    )
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleBookmark(contest.id)} 
                        className={`flex items-center gap-1 ${
                          bookmarkedContests.includes(contest.id)
                            ? 'bg-yellow-600 hover:bg-yellow-700'
                            : 'bg-gray-600 hover:bg-gray-700'
                        } text-white px-4 py-2 rounded-md transition-colors`}
                      >
                        {bookmarkedContests.includes(contest.id) ? (
                          <>
                            <BookmarkCheck size={16} className="mr-1" />
                            Bookmarked
                          </>
                        ) : (
                          <>
                            <Bookmark size={16} className="mr-1" />
                            Bookmark
                          </>
                        )}
                      </button>
                      <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M10 2h4"></path>
                          <path d="M12 14v-4"></path>
                          <circle cx="12" cy="14" r="8"></circle>
                        </svg>
                        Set Reminder
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className={`rounded-lg shadow-md p-8 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <p className={isDarkMode ? 'text-gray-300 text-lg' : 'text-gray-600 text-lg'}>
                {showBookmarksOnly ? 'No bookmarked contests found' : 'No contests found matching your filters'}
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Modal needs to be adjusted for dark mode */}
      <AttachSolutionModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        contestInfo={selectedContest}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default ContestDashboard;