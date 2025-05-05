from datetime import datetime
from app import db
from sqlalchemy.dialects.sqlite import JSON

class UserProgress(db.Model):
    """Model for tracking user progress on challenges"""
    __tablename__ = 'user_progress'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=False)  # Can be email, username, or UUID
    challenge_id = db.Column(db.Integer, db.ForeignKey('challenges.id'), nullable=False)
    attempts = db.Column(db.Integer, default=0)
    score = db.Column(db.Integer, default=0)
    is_completed = db.Column(db.Boolean, default=False)
    last_attempt_date = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Composite unique constraint to ensure one progress record per user per challenge
    __table_args__ = (
        db.UniqueConstraint('user_id', 'challenge_id', name='unique_user_challenge'),
    )
    
    def __init__(self, user_id, challenge_id, attempts=0, score=0, is_completed=False):
        self.user_id = user_id
        self.challenge_id = challenge_id
        self.attempts = attempts
        self.score = score
        self.is_completed = is_completed
        self.last_attempt_date = datetime.utcnow()
    
    def __repr__(self):
        return f'<UserProgress: User {self.user_id} on Challenge {self.challenge_id}>'
    
    def to_dict(self):
        """Convert progress to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'challenge_id': self.challenge_id,
            'attempts': self.attempts,
            'score': self.score,
            'is_completed': self.is_completed,
            'last_attempt_date': self.last_attempt_date.isoformat() if self.last_attempt_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Achievement(db.Model):
    """Model for user achievements"""
    __tablename__ = 'achievements'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    badge_url = db.Column(db.String(255))
    criteria = db.Column(JSON)  # Store achievement criteria as JSON
    date_earned = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Composite unique constraint to ensure a user doesn't get the same achievement twice
    __table_args__ = (
        db.UniqueConstraint('user_id', 'name', name='unique_user_achievement'),
    )
    
    def __init__(self, user_id, name, description, badge_url=None, criteria=None):
        self.user_id = user_id
        self.name = name
        self.description = description
        self.badge_url = badge_url
        self.criteria = criteria or {}
        self.date_earned = datetime.utcnow()
    
    def __repr__(self):
        return f'<Achievement: {self.name} for User {self.user_id}>'
    
    def to_dict(self):
        """Convert achievement to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'description': self.description,
            'badge_url': self.badge_url,
            'criteria': self.criteria,
            'date_earned': self.date_earned.isoformat() if self.date_earned else None
        }

