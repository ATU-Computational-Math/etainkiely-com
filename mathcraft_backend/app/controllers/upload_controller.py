import os
import uuid
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
from app.services.validation_service import validate_minecraft_build
from app.models.submission import Submission
from app import db

# Create a Blueprint for file upload routes
upload_bp = Blueprint('upload', __name__)

def allowed_file(filename):
    """
    Check if the uploaded file has an allowed extension
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@upload_bp.route('/', methods=['POST'])
def upload_file():
    """
    Handle file uploads for Minecraft NBT files
    """
    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']
    
    # If user doesn't select a file, browser may send an empty file
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed. Only .nbt files are accepted"}), 400
    
    try:
        # Secure the filename and generate a unique name to prevent overwrites
        original_filename = secure_filename(file.filename)
        file_extension = original_filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
        
        # Get challenge ID from form data
        challenge_id = request.form.get('challenge_id')
        if not challenge_id:
            return jsonify({"error": "Challenge ID is required"}), 400
        
        # Get user ID from form data (or use a placeholder for now)
        user_id = request.form.get('user_id', 'anonymous')
        
        # Save the file to the upload folder
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)
        
        # Validate the Minecraft build against the challenge requirements
        validation_result = validate_minecraft_build(filepath, challenge_id)
        
        # Save submission to database
        submission = Submission(
            file_path=unique_filename,
            original_filename=original_filename,
            challenge_id=challenge_id,
            user_id=user_id,
            validation_result=validation_result
        )
        
        db.session.add(submission)
        db.session.commit()
        
        # Return validation results
        return jsonify({
            "message": "File successfully uploaded and validated",
            "filename": unique_filename,
            "validation_result": validation_result
        }), 201
        
    except Exception as e:
        current_app.logger.error(f"Error uploading file: {str(e)}")
        return jsonify({"error": "Failed to upload and process file"}), 500

@upload_bp.route('/<filename>', methods=['GET'])
def get_uploaded_file(filename):
    """
    Retrieve an uploaded file
    """
    try:
        return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        current_app.logger.error(f"Error retrieving file {filename}: {str(e)}")
        return jsonify({"error": "File not found"}), 404

@upload_bp.route('/submissions', methods=['GET'])
def get_submissions():
    """
    Get all submissions, possibly filtered by user or challenge
    """
    try:
        user_id = request.args.get('user_id')
        challenge_id = request.args.get('challenge_id')
        
        query = Submission.query
        
        if user_id:
            query = query.filter_by(user_id=user_id)
        
        if challenge_id:
            query = query.filter_by(challenge_id=challenge_id)
        
        submissions = query.all()
        
        return jsonify([submission.to_dict() for submission in submissions]), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching submissions: {str(e)}")
        return jsonify({"error": "Failed to fetch submissions"}), 500

