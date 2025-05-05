from flask import Blueprint, request, jsonify, current_app
from app.models.challenge import Challenge
from app import db

# Create a Blueprint for challenge-related routes
challenge_bp = Blueprint('challenge', __name__)

@challenge_bp.route('/', methods=['GET'])
def get_all_challenges():
    """
    Get all available challenges
    """
    try:
        challenges = Challenge.query.all()
        return jsonify([challenge.to_dict() for challenge in challenges]), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching challenges: {str(e)}")
        return jsonify({"error": "Failed to fetch challenges"}), 500

@challenge_bp.route('/<int:challenge_id>', methods=['GET'])
def get_challenge(challenge_id):
    """
    Get a specific challenge by ID
    """
    try:
        challenge = Challenge.query.get(challenge_id)
        if not challenge:
            return jsonify({"error": "Challenge not found"}), 404
        
        return jsonify(challenge.to_dict()), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching challenge {challenge_id}: {str(e)}")
        return jsonify({"error": "Failed to fetch challenge"}), 500

@challenge_bp.route('/', methods=['POST'])
def create_challenge():
    """
    Create a new challenge
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'difficulty', 'criteria']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        new_challenge = Challenge(
            title=data['title'],
            description=data['description'],
            difficulty=data['difficulty'],
            criteria=data['criteria'],
            hints=data.get('hints', []),
            image_url=data.get('image_url')
        )
        
        db.session.add(new_challenge)
        db.session.commit()
        
        return jsonify(new_challenge.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating challenge: {str(e)}")
        return jsonify({"error": "Failed to create challenge"}), 500

@challenge_bp.route('/<int:challenge_id>', methods=['PUT'])
def update_challenge(challenge_id):
    """
    Update an existing challenge
    """
    try:
        challenge = Challenge.query.get(challenge_id)
        if not challenge:
            return jsonify({"error": "Challenge not found"}), 404
        
        data = request.get_json()
        
        # Update fields if provided
        if 'title' in data:
            challenge.title = data['title']
        if 'description' in data:
            challenge.description = data['description']
        if 'difficulty' in data:
            challenge.difficulty = data['difficulty']
        if 'criteria' in data:
            challenge.criteria = data['criteria']
        if 'hints' in data:
            challenge.hints = data['hints']
        if 'image_url' in data:
            challenge.image_url = data['image_url']
        
        db.session.commit()
        
        return jsonify(challenge.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating challenge {challenge_id}: {str(e)}")
        return jsonify({"error": "Failed to update challenge"}), 500

@challenge_bp.route('/<int:challenge_id>', methods=['DELETE'])
def delete_challenge(challenge_id):
    """
    Delete a challenge
    """
    try:
        challenge = Challenge.query.get(challenge_id)
        if not challenge:
            return jsonify({"error": "Challenge not found"}), 404
        
        db.session.delete(challenge)
        db.session.commit()
        
        return jsonify({"message": "Challenge deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting challenge {challenge_id}: {str(e)}")
        return jsonify({"error": "Failed to delete challenge"}), 500

