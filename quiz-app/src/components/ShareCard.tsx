import React, { useState, useRef } from 'react';
import './ShareCard.css';

export interface ShareCardProps {
  username: string;
  score: number;
  totalPossible: number;
  ageGroup: string;
  badges: string[];
  quizTheme?: string;
  dateCompleted?: Date;
}

/**
 * ShareCard component for creating shareable cards with quiz results
 * for social media platforms
 */
const ShareCard: React.FC<ShareCardProps> = ({
  username,
  score,
  totalPossible,
  ageGroup,
  badges,
  quizTheme = 'Biodiversity Quiz',
  dateCompleted = new Date(),
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [cardImage, setCardImage] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Get background colors based on age group
  const getCardStyle = () => {
    switch (ageGroup) {
      case 'young':
        return {
          background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
          icon: '🦋',
        };
      case 'mid':
        return {
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          icon: '🌿',
        };
      case 'elder':
        return {
          background: 'linear-gradient(135deg, #ff9a9e, #fad0c4)',
          icon: '🦉',
        };
      default:
        return {
          background: 'linear-gradient(135deg, #3498db, #2ecc71)',
          icon: '🌍',
        };
    }
  };

  const getAgeGroupName = () => {
    switch (ageGroup) {
      case 'young':
        return 'Young Hero';
      case 'mid':
        return 'Mid-Generation Protector';
      case 'elder':
        return 'Wisdom Keeper';
      default:
        return 'Biodiversity Protector';
    }
  };

  // Calculate score percentage
  const scorePercentage = Math.round((score / totalPossible) * 100);

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Generate share card image
  const generateShareCard = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    
    try {
      // This would typically use html2canvas or similar library in a real implementation
      // For the purpose of this demo, we'll simulate image generation
      setTimeout(() => {
        setCardImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');
        setShowShareOptions(true);
        setIsGenerating(false);
      }, 1500);
      
      // In a real implementation, you would use something like:
      // import html2canvas from 'html2canvas';
      // const canvas = await html2canvas(cardRef.current);
      // const image = canvas.toDataURL('image/png');
      // setCardImage(image);
    } catch (error) {
      console.error('Error generating share card:', error);
      setIsGenerating(false);
    }
  };

  // Share to social platforms
  const shareToFacebook = () => {
    if (!cardImage) return;
    
    // In a real implementation, you would use the Facebook SDK
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareToInstagram = () => {
    // Instagram sharing typically requires the mobile app
    alert('To share on Instagram, please save the image and upload it via the Instagram app.');
  };

  const downloadImage = () => {
    if (!cardImage) return;
    
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = cardImage;
    link.download = `biodiversity-quiz-${formatDate(dateCompleted).replace(/ /g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cardStyle = getCardStyle();

  return (
    <div className="share-card-container">
      <h2 className="share-card-title">Share Your Achievement</h2>
      
      {/* The actual card to be captured for sharing */}
      <div 
        ref={cardRef} 
        className="share-card" 
        style={{ background: cardStyle.background }}
      >
        <div className="share-card-header">
          <div className="share-card-logo">
            <span>{cardStyle.icon}</span> WARP Quiz
          </div>
          <div className="share-card-date">
            {formatDate(dateCompleted)}
          </div>
        </div>
        
        <div className="share-card-content">
          <h3 className="share-card-theme">{quizTheme}</h3>
          
          <div className="share-card-username">
          <div className="share-card-username">
            {username}
          </div>
          
          <div className="share-card-role">
            {getAgeGroupName()}
          </div>
          
          <div className="share-card-score">
            <div className="score-circle">
              <div className="score-percentage">{scorePercentage}%</div>
              <div className="score-numbers">{score}/{totalPossible}</div>
            </div>
          </div>
          
          {badges.length > 0 && (
            <div className="share-card-badges">
              {badges.map((badge, index) => (
                <span key={index} className="share-badge">{badge}</span>
              ))}
            </div>
          )}
        </div>
        
        <div className="share-card-footer">
          <div className="share-card-message">
            Join the Biodiversity Challenge!
          </div>
          <div className="share-card-website">
            www.biodiversityquiz.org
          </div>
        </div>
      </div>
      
      {/* Generate and share buttons */}
      <div className="share-actions">
        {!cardImage ? (
          <button 
            className={`generate-button ${isGenerating ? 'loading' : ''}`}
            onClick={generateShareCard}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="loading-spinner"></span>
                Generating Card...
              </>
            ) : (
              'Generate Share Card'
            )}
          </button>
        ) : (
          <div className="share-options">
            <h3>Share on:</h3>
            <div className="share-buttons">
              <button className="share-button facebook" onClick={shareToFacebook}>
                <span className="button-icon">📱</span> Facebook
              </button>
              <button className="share-button instagram" onClick={shareToInstagram}>
                <span className="button-icon">📷</span> Instagram
              </button>
              <button className="share-button download" onClick={downloadImage}>
                <span className="button-icon">💾</span> Download
              </button>
            </div>
            <button 
              className="create-new-button"
              onClick={() => {
                setCardImage(null);
                setShowShareOptions(false);
              }}
            >
              Create New Card
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareCard;
