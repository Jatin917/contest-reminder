import { useEffect, useState } from 'react';
import { Filter, Calendar } from 'lucide-react';
import { functionTypes, getAllUpcomingContest } from '../api/contest';

interface contest {
  id:number, 
  duration:number,
  end:string,
  start:string,
  event:string,
  host:string
}

const ContestDashboard = () => {
  const [upcomingContest, setUpcomingContest] = useState<contest[]>();
  const[leetcodeHost, setLeetcodeHost] = useState<functionTypes>();
  const[codeForcesHost, setcodeForcesHost] = useState<functionTypes>();
  const[codeChefHost, setcodeChefHost] = useState<functionTypes>();

  async function fetchContest(){
    if(!leetcodeHost || !codeChefHost || !codeForcesHost) return;
    const response = await getAllUpcomingContest(leetcodeHost, codeChefHost, codeForcesHost);
    if(!response || !response.data) return;
    setUpcomingContest(response.data);
  } 

  useEffect(()=>{
    fetchContest();
  }, [leetcodeHost, codeChefHost, codeForcesHost]);
  // Sample contest data
  // const contestData = [
  //   { id: 1, name: "Weekly Contest 387", platform: "Leetcode", date: "2025-03-22", time: "10:30 AM", duration: "1.5 hours", difficulty: "Medium" },
  //   { id: 2, name: "Codeforces Round #912", platform: "Codeforces", date: "2025-03-20", time: "7:00 PM", duration: "2 hours", difficulty: "Hard" },
  //   { id: 3, name: "Biweekly Contest 124", platform: "Leetcode", date: "2025-03-29", time: "10:30 AM", duration: "1.5 hours", difficulty: "Medium" },
  //   { id: 4, name: "Educational Codeforces Round #169", platform: "Codeforces", date: "2025-03-25", time: "6:30 PM", duration: "2 hours", difficulty: "Medium" },
  //   { id: 5, name: "CodeChef Starters 122", platform: "CodeChef", date: "2025-03-27", time: "8:00 PM", duration: "3 hours", difficulty: "Medium" },
  //   { id: 6, name: "Weekly Contest 386", platform: "Leetcode", date: "2025-03-15", time: "10:30 AM", duration: "1.5 hours", difficulty: "Medium" },
  //   { id: 7, name: "Codeforces Round #911", platform: "Codeforces", date: "2025-03-12", time: "7:00 PM", duration: "2 hours", difficulty: "Hard" },
  //   { id: 8, name: "Biweekly Contest 123", platform: "Leetcode", date: "2025-03-01", time: "10:30 AM", duration: "1.5 hours", difficulty: "Medium" },
  //   { id: 9, name: "CodeChef Starters 121", platform: "CodeChef", date: "2025-03-06", time: "8:00 PM", duration: "3 hours", difficulty: "Hard" }
  // ];

  const platforms = ['Leetcode', "Codeforces", "CodeChef"];
  
  // Create platform combination filters
  const createPlatformCombinations = (platforms: unknown[]) => {
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
  const [activePlatformFilter, setActivePlatformFilter] = useState(platformFilters.find(f => f.name === "All Platforms"));

  // Filter contests based on user selection
  const filteredContests = upcomingContest && upcomingContest.filter(contest => {
    const today = new Date();
    const contestDate = new Date(contest.start);
    const isUpcoming = contestDate >= today;
    
    return (
      // Time filter (upcoming or past)
      ((activeTimeFilter === 'upcoming' && isUpcoming) || 
       (activeTimeFilter === 'past' && !isUpcoming)) && 
      // Platform filter
      activePlatformFilter?.platforms.includes((contest.host).split(".")[0])
    );
  });

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Coding Contests</h1>
        
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* First layer - Time Filter */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={18} />
              <h2 className="text-lg font-semibold text-gray-700">Contest Timing</h2>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTimeFilter('upcoming')}
                className={`px-4 py-2 rounded-md ${
                  activeTimeFilter === 'upcoming'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTimeFilter('past')}
                className={`px-4 py-2 rounded-md ${
                  activeTimeFilter === 'past'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Past
              </button>
            </div>
          </div>
          
          {/* Second layer - Platform Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Filter size={18} />
              <h2 className="text-lg font-semibold text-gray-700">Platforms</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {platformFilters.map(filter => (
                <button
                  key={filter.name}
                  onClick={() => setActivePlatformFilter(filter)}
                  className={`px-4 py-2 rounded-md ${
                    activePlatformFilter?.name === filter.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Contest Cards */}
        <div className="space-y-4">
          {filteredContests && filteredContests.length > 0 ? (
            filteredContests.map(contest => (
              <div key={contest.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{contest.event}</h3>
                    <div className="flex items-center mt-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {contest.host.split(".")[0]}
                      </span>
                      <span className="mx-2 text-gray-400">•</span>
                      {/* <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {contest.difficulty}
                      </span> */}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-700">{contest.start} at {contest.duration}</div>
                    <div className="text-gray-500 text-sm">Duration: {contest.duration}</div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  {activeTimeFilter === 'past' ? (
                    <button className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                      Attach Solution
                    </button>
                  ) : (
                    <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M10 2h4"></path>
                        <path d="M12 14v-4"></path>
                        <circle cx="12" cy="14" r="8"></circle>
                      </svg>
                      Set Reminder
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 text-lg">No contests found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestDashboard;