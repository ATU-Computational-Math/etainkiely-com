from datetime import datetime
from app import db
from sqlalchemy.dialects.sqlite import JSON

class Challenge(db.Model):
    """Model for math challenge cards"""
    __tablename__ = 'challenges'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.String(20), nullable=False)  # e.g., 'easy', 'medium', 'hard'
    criteria = db.Column(JSON, nullable=False)  # Store validation criteria as JSON
    hints = db.Column(JSON, default=list)  # List of hints as JSON
    image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    submissions = db.relationship('Submission', backref='challenge', lazy=True)
    user_progress = db.relationship('UserProgress', backref='challenge', lazy=True)
    
    def __init__(self, title, description, difficulty, criteria, hints=None, image_url=None):
        self.title = title
        self.description = description
        self.difficulty = difficulty
        self.criteria = criteria
        self.hints = hints or []
        self.image_url = image_url
    
    def __repr__(self):
        return f'<Challenge {self.id}: {self.title}>'
    
    def to_dict(self):
        """Convert challenge to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'difficulty': self.difficulty,
            'criteria': self.criteria,
            'hints': self.hints,
            'image_url': self.image_url,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

