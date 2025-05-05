from datetime import datetime
from app import db
from sqlalchemy.dialects.sqlite import JSON

class Submission(db.Model):
    """Model for tracking user file submissions"""
    __tablename__ = 'submissions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=False)  # Can be email, username, or UUID
    challenge_id = db.Column(db.Integer, db.ForeignKey('challenges.id'), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)  # Path to the stored file
    original_filename = db.Column(db.String(255), nullable=False)  # Original file name
    validation_result = db.Column(JSON, nullable=True)  # Store validation results as JSON
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __init__(self, user_id, challenge_id, file_path, original_filename, validation_result=None):
        self.user_id = user_id
        self.challenge_id = challenge_id
        self.file_path = file_path
        self.original_filename = original_filename
        self.validation_result = validation_result or {}
        self.submitted_at = datetime.utcnow()
    
    def __repr__(self):
        return f'<Submission: User {self.user_id} for Challenge {self.challenge_id} at {self.submitted_at}>'
    
    def to_dict(self):
        """Convert submission to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'challenge_id': self.challenge_id,
            'file_path': self.file_path,
            'original_filename': self.original_filename,
            'validation_result': self.validation_result,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
            'is_successful': self.is_successful()
        }
    
    def is_successful(self):
        """
        Check if the submission passed validation
        A successful validation should have a 'success' key with a True value in the validation_result
        """
        if not self.validation_result:
            return False
        
        return self.validation_result.get('success', False)

