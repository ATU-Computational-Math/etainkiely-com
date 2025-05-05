from flask import Blueprint, request, jsonify, current_app
from app.models.progress import UserProgress, Achievement
from app import db

# Create a Blueprint for progress tracking routes
progress_bp = Blueprint('progress', __name__)

@progress_bp.route('/user/<user_id>', methods=['GET'])
def get_user_progress(user_id):
    """
    Get a user's progress across all challenges
    """
    try:
        progress = UserProgress.query.filter_by(user_id=user_id).all()
        
        # Format results
        results = {
            "user_id": user_id,
            "challenges_completed": len([p for p in progress if p.is_completed]),
            "total_score": sum(p.score for p in progress if p.score),
            "challenges": [p.to_dict() for p in progress]
        }
        
        return jsonify(results), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching progress for user {user_id}: {str(e)}")
        return jsonify({"error": "Failed to fetch user progress"}), 500

@progress_bp.route('/user/<user_id>/challenge/<int:challenge_id>', methods=['GET'])
def get_challenge_progress(user_id, challenge_id):
    """
    Get a user's progress for a specific challenge
    """
    try:
        progress = UserProgress.query.filter_by(
            user_id=user_id, 
            challenge_id=challenge_id
        ).first()
        
        if not progress:
            return jsonify({"error": "No progress record found"}), 404
        
        return jsonify(progress.to_dict()), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching progress for user {user_id} on challenge {challenge_id}: {str(e)}")
        return jsonify({"error": "Failed to fetch challenge progress"}), 500

@progress_bp.route('/user/<user_id>/challenge/<int:challenge_id>', methods=['POST', 'PUT'])
def update_challenge_progress(user_id, challenge_id):
    """
    Update a user's progress for a specific challenge
    """
    try:
        data = request.get_json()
        
        # Check if a progress record already exists
        progress = UserProgress.query.filter_by(
            user_id=user_id, 
            challenge_id=challenge_id
        ).first()
        
        if progress and request.method == 'POST':
            return jsonify({"error": "Progress record already exists. Use PUT to update."}), 400
        
        if not progress and request.method == 'PUT':
            return jsonify({"error": "No progress record found to update"}), 404
        
        # Create new progress record if it doesn't exist
        if not progress:
            progress = UserProgress(
                user_id=user_id,
                challenge_id=challenge_id
            )
            db.session.add(progress)
        
        # Update fields if provided
        if 'attempts' in data:
            progress.attempts = data['attempts']
        if 'score' in data:
            progress.score = data['score']
        if 'is_completed' in data:
            progress.is_completed = data['is_completed']
        if 'last_attempt_date' in data:
            progress.last_attempt_date = data['last_attempt_date']
        
        db.session.commit()
        
        # Check for achievements that might be unlocked with this progress update
        if progress.is_completed:
            # This could trigger achievement unlock logic
            # For now, we'll leave it as a placeholder
            pass
        
        return jsonify(progress.to_dict()), 200 if request.method == 'PUT' else 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating progress for user {user_id} on challenge {challenge_id}: {str(e)}")
        return jsonify({"error": "Failed to update challenge progress"}), 500

@progress_bp.route('/achievements/<user_id>', methods=['GET'])
def get_user_achievements(user_id):
    """
    Get all achievements for a user
    """
    try:
        achievements = Achievement.query.filter_by(user_id=user_id).all()
        return jsonify([achievement.to_dict() for achievement in achievements]), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching achievements for user {user_id}: {str(e)}")
        return jsonify({"error": "Failed to fetch achievements"}), 500

@progress_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    """
    Get a leaderboard of users based on their progress
    """
    try:
        # This would typically be a more complex query that aggregates user progress
        # For simplicity, we'll use a placeholder that returns mock data
        
        # In a real implementation, you'd query the database for this information
        leaderboard = [
            {"user_id": "user1", "username": "MathWizard", "total_score": 850, "challenges_completed": 8, "rank": 1},
            {"user_id": "user2", "username": "BlockBuilder", "total_score": 720, "challenges_completed": 7, "rank": 2},
            {"user_id": "user3", "username": "MinecraftMaster", "total_score": 650, "challenges_completed": 6, "rank": 3},
            # More entries would be here
        ]
        
        return jsonify(leaderboard), 200
    except Exception as e:
        current_app.logger.error(f"Error generating leaderboard: {str(e)}")
        return jsonify({"error": "Failed to generate leaderboard"}), 500

