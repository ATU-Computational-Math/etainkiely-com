import { useState } from 'react';
import './AgeSelector.css';

// Type definitions for the age groups
export type AgeGroup = 'young' | 'mid' | 'elder' | null;

// Interface for the component props
interface AgeSelectorProps {
  onSelectAgeGroup: (ageGroup: AgeGroup) => void;
  selectedAgeGroup?: AgeGroup;
}

// Age group information with titles, descriptions, and image paths
const ageGroups = [
  {
    id: 'young',
    title: 'Young Heroes',
    description: 'Ages 5-12: Join the adventure to protect our planet!',
    imagePath: '/images/young-hero.png',
  },
  {
    id: 'mid',
    title: 'Mid-Generation Protectors',
    description: 'Ages 13-30: Take action to preserve biodiversity!',
    imagePath: '/images/mid-protector.png',
  },
  {
    id: 'elder',
    title: 'Wisdom Keepers',
    description: 'Ages 31+: Share your knowledge and experience!',
    imagePath: '/images/wisdom-keeper.png',
  },
];

/**
 * AgeSelector component allows users to select their age group
 * for the quiz, which determines the question set they receive.
 */
const AgeSelector: React.FC<AgeSelectorProps> = ({ 
  onSelectAgeGroup, 
  selectedAgeGroup = null 
}) => {
  const [hoveredGroup, setHoveredGroup] = useState<AgeGroup>(null);

  const handleAgeGroupSelect = (ageGroup: AgeGroup) => {
    onSelectAgeGroup(ageGroup);
  };

  return (
    <div className="age-selector-container">
      <h2 className="age-selector-title">Choose Your Group</h2>
      <p className="age-selector-subtitle">
        Select your age group to start your biodiversity adventure!
      </p>
      
      <div className="age-groups-grid">
        {ageGroups.map((group) => (
          <div
            key={group.id}
            className={`age-group-card ${selectedAgeGroup === group.id ? 'selected' : ''} ${
              hoveredGroup === group.id ? 'hovered' : ''
            }`}
            onClick={() => handleAgeGroupSelect(group.id as AgeGroup)}
            onMouseEnter={() => setHoveredGroup(group.id as AgeGroup)}
            onMouseLeave={() => setHoveredGroup(null)}
          >
            <div className="age-group-image-container">
              <img
                src={group.imagePath}
                alt={group.title}
                className="age-group-image"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder.png';
                }}
              />
            </div>
            <div className="age-group-content">
              <h3 className="age-group-title">{group.title}</h3>
              <p className="age-group-description">{group.description}</p>
              <button 
                className="age-group-select-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAgeGroupSelect(group.id as AgeGroup);
                }}
              >
                {selectedAgeGroup === group.id ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {selectedAgeGroup && (
        <div className="age-group-selected-message">
          <p>You've selected: {ageGroups.find(g => g.id === selectedAgeGroup)?.title}</p>
          <button 
            className="continue-button"
            onClick={() => onSelectAgeGroup(selectedAgeGroup)}
          >
            Continue to Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default AgeSelector;

