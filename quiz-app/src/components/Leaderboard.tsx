import { useState, useEffect } from 'react';
import './Leaderboard.css';

// Types for leaderboard data
export interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  ageGroup: string;
  date: Date;
  badges: string[];
  rank?: number; // Will be calculated based on sorting
  schoolCode?: string;
}

export type TimeFrame = 'weekly' | 'monthly' | 'all-time';
export type SortOption = 'score' | 'date' | 'badges';

interface LeaderboardProps {
  currentUserID?: string; // Optional ID to highlight current user
  ageGroup?: string; // Optional filter for specific age group
  schoolCode?: string; // Optional filter for specific school
}

// Mock data - would be replaced by Firebase/Supabase integration
const MOCK_LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    id: '1',
    username: 'EcoWarrior',
    score: 980,
    ageGroup: 'young',
    date: new Date(2025, 4, 3), // May 3, 2025
    badges: ['🏆', '⚡', '🌿']
  },
  {
    id: '2',
    username: 'NatureDefender',
    score: 850,
    ageGroup: 'mid',
    date: new Date(2025, 4, 2), // May 2, 2025
    badges: ['🏆', '🌿']
  },
  {
    id: '3',
    username: 'WildlifeGuardian',
    score: 920,
    ageGroup: 'elder',
    date: new Date(2025, 4, 1), // May 1, 2025
    badges: ['🏆', '✨', '⚡']
  },
  {
    id: '4',
    username: 'PlanetProtector',
    score: 760,
    ageGroup: 'young',
    date: new Date(2025, 3, 30), // April 30, 2025
    badges: ['🌿']
  },
  {
    id: '5',
    username: 'BioGenius',
    score: 1000,
    ageGroup: 'mid',
    date: new Date(2025, 3, 28), // April 28, 2025
    badges: ['🏆', '✨', '⚡', '🔥', '🌿']
  },
  {
    id: '6',
    username: 'EarthChampion',
    score: 890,
    ageGroup: 'elder',
    date: new Date(2025, 3, 25), // April 25, 2025
    badges: ['🏆', '🔥']
  },
  {
    id: '7',
    username: 'GreenHero',
    score: 830,
    ageGroup: 'young',
    date: new Date(2025, 3, 20), // April 20, 2025
    badges: ['⚡', '🌿']
  },
  {
    id: '8',
    username: 'ConservationKid',
    score: 720,
    ageGroup: 'young',
    date: new Date(2025, 3, 15), // April 15, 2025
    badges: ['🌿'],
    schoolCode: 'ECO123'
  },
  {
    id: '9',
    username: 'BioDiversity99',
    score: 950,
    ageGroup: 'mid',
    date: new Date(2025, 3, 10), // April 10, 2025
    badges: ['🏆', '✨', '🔥'],
    schoolCode: 'ECO123'
  },
  {
    id: '10',
    username: 'NatureWise',
    score: 880,
    ageGroup: 'elder',
    date: new Date(2025, 3, 5), // April 5, 2025
    badges: ['🏆', '🌿'],
    schoolCode: 'ECO123'
  }
];

// Badge descriptions for tooltips
const BADGE_DESCRIPTIONS: Record<string, string> = {
  '🏆': 'Ultimate Champion',
  '✨': 'Flawless Victory',
  '🔥': 'Streak Master',
  '⚡': 'Speed Demon',
  '🌿': 'Biodiversity Expert'
};

/**
 * Leaderboard component displays rankings and scores with filtering options
 */
const Leaderboard: React.FC<LeaderboardProps> = ({
  currentUserID,
  ageGroup,
  schoolCode
}) => {
  // State for the selected time frame tab
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('weekly');
  
  // State for the selected age group filter (null means all)
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(
    ageGroup || null
  );
  
  // State for the selected school filter (null means all)
  const [selectedSchool, setSelectedSchool] = useState<string | null>(
    schoolCode || null
  );
  
  // State for sort option
  const [sortOption, setSortOption] = useState<SortOption>('score');
  
  // State for the actual leaderboard data
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  
  // State for loading
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch and filter leaderboard data based on selected filters
  useEffect(() => {
    // This would be replaced by actual Firebase/Supabase query
    const fetchLeaderboardData = () => {
      setIsLoading(true);
      
      // Simulate async data fetch
      setTimeout(() => {
        // Filter by date range for the selected time frame
        const now = new Date();
        let earliestDate = new Date();
        
        if (selectedTimeFrame === 'weekly') {
          earliestDate.setDate(now.getDate() - 7);
        } else if (selectedTimeFrame === 'monthly') {
          earliestDate.setMonth(now.getMonth() - 1);
        } else {
          // All-time - set to a past date
          earliestDate = new Date(2020, 0, 1);
        }
        
        // Filter and sort the data
        let filteredData = [...MOCK_LEADERBOARD_DATA].filter(
          entry => entry.date >= earliestDate
        );
        
        // Apply age group filter if selected
        if (selectedAgeGroup) {
          filteredData = filteredData.filter(
            entry => entry.ageGroup === selectedAgeGroup
          );
        }
        
        // Apply school filter if selected
        if (selectedSchool) {
          filteredData = filteredData.filter(
            entry => entry.schoolCode === selectedSchool
          );
        }
        
        // Sort the data
        if (sortOption === 'score') {
          filteredData.sort((a, b) => b.score - a.score);
        } else if (sortOption === 'date') {
          filteredData.sort((a, b) => b.date.getTime() - a.date.getTime());
        } else if (sortOption === 'badges') {
          filteredData.sort((a, b) => b.badges.length - a.badges.length);
        }
        
        // Assign ranks based on score
        filteredData.forEach((entry, index) => {
          entry.rank = index + 1;
        });
        
        setLeaderboardData(filteredData);
        setIsLoading(false);
      }, 800); // Simulate network delay
    };
    
    fetchLeaderboardData();
  }, [selectedTimeFrame, selectedAgeGroup, selectedSchool, sortOption]);

  // Handle time frame tab change
  const handleTimeFrameChange = (timeFrame: TimeFrame) => {
    setSelectedTimeFrame(timeFrame);
  };
  
  // Handle age group filter change
  const handleAgeGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedAgeGroup(value === 'all' ? null : value);
  };
  
  // Handle school filter change
  const handleSchoolChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setSelectedSchool(value === '' ? null : value);
  };
  
  // Handle sort option change
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value as SortOption);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Get age group display name
  const getAgeGroupName = (ageGroup: string) => {
    switch(ageGroup) {
      case 'young': return 'Young Heroes';
      case 'mid': return 'Mid-Generation Protectors';
      case 'elder': return 'Wisdom Keepers';
      default: return ageGroup;
    }
  };

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Biodiversity Quiz Leaderboard</h2>
      
      {/* Time frame tabs */}
      <div className="leaderboard-tabs">
        <button 
          className={`tab-button ${selectedTimeFrame === 'weekly' ? 'active' : ''}`}
          onClick={() => handleTimeFrameChange('weekly')}
        >
          Weekly
        </button>
        <button 
          className={`tab-button ${selectedTimeFrame === 'monthly' ? 'active' : ''}`}
          onClick={() => handleTimeFrameChange('monthly')}
        >
          Monthly
        </button>
        <button 
          className={`tab-button ${selectedTimeFrame === 'all-time' ? 'active' : ''}`}
          onClick={() => handleTimeFrameChange('all-time')}
        >
          All-Time
        </button>
      </div>
      
      {/* Filters */}
      <div className="leaderboard-filters">
        <div className="filter-group">
          <label htmlFor="ageGroupFilter">Age Group:</label>
          <select 
            id="ageGroupFilter" 
            value={selectedAgeGroup || 'all'} 
            onChange={handleAgeGroupChange}
          >
            <option value="all">All Groups</option>
            <option value="young">Young Heroes</option>
            <option value="mid">Mid-Generation Protectors</option>
            <option value="elder">Wisdom Keepers</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="schoolFilter">School Code:</label>
          <input 
            type="text" 
            id="schoolFilter" 
            placeholder="Enter school code" 
            value={selectedSchool || ''} 
            onChange={handleSchoolChange}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="sortOption">Sort By:</label>
          <select 
            id="sortOption" 
            value={sortOption} 
            onChange={handleSortChange}
          >
            <option value="score">Highest Score</option>
            <option value="date">Most Recent</option>
            <option value="badges">Most Badges</option>
          </select>
        </div>
      </div>
      
      {/* Loading indicator */}
      {isLoading ? (
        <div className="leaderboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading leaderboard data...</p>
        </div>
      ) : (
        <>
          {/* No results message */}
          {leaderboardData.length === 0 ? (
            <div className="no-results">
              <p>No results found for the selected filters.</p>
            </div>
          ) : (
            /* Leaderboard table */
            <div className="leaderboard-table-container">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th className="rank-column">Rank</th>
                    <th className="player-column">Player</th>
                    <th className="age-group-column">Age Group</th>
                    <th className="score-column">Score</th>
                    <th className="badges-column">Badges</th>
                    <th className="date-column">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry) => (
                    <tr 
                      key={entry.id} 
                      className={`leaderboard-row ${entry.id === currentUserID ? 'current-user' : ''}`}
                    >
                      <td className="rank-column">
                        <div className={`rank-badge rank-${entry.rank && entry.rank <= 3 ? entry.rank : 'other'}`}>
                          {entry.rank}
                        </div>
                      </td>
                      <td className="player-column">
                        <div className="player-name">
                          {entry.username}
                          {entry.id === currentUserID && <span className="current-user-indicator"> (You)</span>}
                        </div>
                        {entry.schoolCode && (
                          <div className="school-code">School: {entry.schoolCode}</div>
                        )}
                      </td>
                      <td className="age-group-column">{getAgeGroupName(entry.ageGroup)}</td>
                      <td className="score-column">{entry.score}</td>
                      <td className="badges-column">
                        <div className="badge-container">
                          {entry.badges.map((badge, index) => (
                            <div 
                              key={index} 
                              className="badge-icon" 
                              title={BADGE_DESCRIPTIONS[badge] || badge}
                            >
                              {badge}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="date-column">{formatDate(entry.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      
      {/* Legend for badges */}
      <div className="badge-legend">
        <h3>Badge Legend</h3>
        <div className="badge-legend-grid">
          {Object.entries(BADGE_DESCRIPTIONS).map(([badge, description]) => (
            <div key={badge} className="badge-legend-item">
              <div className="badge-legend-icon">{badge}</div>
              <div className="badge-legend-description">{description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

