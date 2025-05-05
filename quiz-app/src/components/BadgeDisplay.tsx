import { useState, useEffect } from 'react';
import './BadgeDisplay.css';

// Badge types and interfaces
export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'achievement' | 'streak' | 'mastery' | 'special';
  unlocked: boolean;
  dateUnlocked?: Date;
  isNew?: boolean; // For highlighting newly earned badges
  progress?: {
    current: number;
    target: number;
  };
}

export interface BadgeCategory {
  id: string;
  name: string;
  description: string;
  badges: Badge[];
}

interface BadgeDisplayProps {
  badges: Badge[];
  onBadgeClick?: (badge: Badge) => void;
  showLocked?: boolean; // Whether to show locked badges
  highlightNew?: boolean; // Whether to highlight newly earned badges
}

/**
 * Component for displaying user badges and achievements
 */
const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  badges,
  onBadgeClick,
  showLocked = true,
  highlightNew = true,
}) => {
  // State for tracking which badge is being viewed in detail
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  
  // State for tracking badges that have been acknowledged (no longer "new")
  const [acknowledgedBadges, setAcknowledgedBadges] = useState<string[]>([]);

  // Group badges by category
  const badgeCategories: BadgeCategory[] = [
    {
      id: 'achievement',
      name: 'Achievements',
      description: 'Special accomplishments you\'ve earned through the quiz',
      badges: badges.filter(badge => badge.category === 'achievement'),
    },
    {
      id: 'streak',
      name: 'Streaks',
      description: 'Badges earned by maintaining answer streaks',
      badges: badges.filter(badge => badge.category === 'streak'),
    },
    {
      id: 'mastery',
      name: 'Mastery',
      description: 'Recognition of your biodiversity knowledge mastery',
      badges: badges.filter(badge => badge.category === 'mastery'),
    },
    {
      id: 'special',
      name: 'Special',
      description: 'Rare and unique accomplishments',
      badges: badges.filter(badge => badge.category === 'special'),
    },
  ];

  // Filter out empty categories
  const filteredCategories = badgeCategories.filter(
    category => category.badges.length > 0
  );

  // Handle badge click
  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    
    // If the badge is new, mark it as acknowledged
    if (badge.isNew && !acknowledgedBadges.includes(badge.id)) {
      setAcknowledgedBadges([...acknowledgedBadges, badge.id]);
    }
    
    // Call the optional onBadgeClick callback
    if (onBadgeClick) {
      onBadgeClick(badge);
    }
  };

  // Close the badge detail modal
  const closeBadgeDetail = () => {
    setSelectedBadge(null);
  };

  // Calculate the total progress percentage across all badges
  const calculateTotalProgress = () => {
    const totalBadges = badges.length;
    const unlockedBadges = badges.filter(badge => badge.unlocked).length;
    return totalBadges > 0 ? (unlockedBadges / totalBadges) * 100 : 0;
  };

  // Format date for display
  const formatDate = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="badge-display-container">
      <h2 className="badge-display-title">Your Badges</h2>
      
      {/* Overall progress bar */}
      <div className="overall-progress">
        <div className="progress-label">
          <span>Overall Progress</span>
          <span>
            {badges.filter(badge => badge.unlocked).length} / {badges.length} Badges
          </span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${calculateTotalProgress()}%` }}
          ></div>
        </div>
      </div>
      
      {/* Badge categories */}
      {filteredCategories.map(category => (
        <div key={category.id} className="badge-category">
          <h3 className="category-title">{category.name}</h3>
          <p className="category-description">{category.description}</p>
          
          <div className="badges-grid">
            {category.badges
              .filter(badge => showLocked || badge.unlocked)
              .map(badge => (
                <div
                  key={badge.id}
                  className={`badge-item ${badge.unlocked ? 'unlocked' : 'locked'} ${
                    badge.isNew && !acknowledgedBadges.includes(badge.id) && highlightNew
                      ? 'new-badge'
                      : ''
                  }`}
                  onClick={() => handleBadgeClick(badge)}
                >
                  <div className="badge-icon-container">
                    <div className="badge-icon">
                      {badge.icon}
                    </div>
                    {badge.isNew && !acknowledgedBadges.includes(badge.id) && highlightNew && (
                      <div className="new-badge-indicator">NEW</div>
                    )}
                  </div>
                  <div className="badge-info">
                    <h4 className="badge-title">{badge.title}</h4>
                    {badge.unlocked ? (
                      <div className="badge-unlock-date">
                        Unlocked: {formatDate(badge.dateUnlocked)}
                      </div>
                    ) : badge.progress ? (
                      <div className="badge-progress">
                        <div className="progress-bar-container">
                          <div 
                            className="progress-bar" 
                            style={{ 
                              width: `${(badge.progress.current / badge.progress.target) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <div className="progress-text">
                          {badge.progress.current} / {badge.progress.target}
                        </div>
                      </div>
                    ) : (
                      <div className="badge-locked-message">Locked</div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
      
      {/* Badge detail modal */}
      {selectedBadge && (
        <div className="badge-detail-overlay" onClick={closeBadgeDetail}>
          <div className="badge-detail-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal-button" onClick={closeBadgeDetail}>
              &times;
            </button>
            
            <div className="badge-detail-content">
              <div className={`badge-detail-icon ${selectedBadge.unlocked ? 'unlocked' : 'locked'}`}>
                {selectedBadge.icon}
              </div>
              
              <h3 className="badge-detail-title">{selectedBadge.title}</h3>
              
              <p className="badge-detail-description">{selectedBadge.description}</p>
              
              {selectedBadge.unlocked ? (
                <div className="badge-detail-unlocked">
                  <span className="unlock-label">Unlocked:</span> {formatDate(selectedBadge.dateUnlocked)}
                </div>
              ) : selectedBadge.progress ? (
                <div className="badge-detail-progress">
                  <div className="progress-label">Progress: {selectedBadge.progress.current} / {selectedBadge.progress.target}</div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar" 
                      style={{ 
                        width: `${(selectedBadge.progress.current / selectedBadge.progress.target) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <p className="progress-hint">
                    Keep going! You're making progress towards this badge.
                  </p>
                </div>
              ) : (
                <div className="badge-detail-locked">
                  <p>Complete the related challenges to unlock this badge!</p>
                </div>
              )}
              
              <div className="badge-detail-category">
                Category: {badgeCategories.find(cat => cat.id === selectedBadge.category)?.name || selectedBadge.category}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* No badges message */}
      {badges.length === 0 && (
        <div className="no-badges-message">
          <p>You haven't earned any badges yet. Complete quizzes to earn badges!</p>
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;

