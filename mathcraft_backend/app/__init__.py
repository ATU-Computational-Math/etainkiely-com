from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .config import config_by_name

# Initialize SQLAlchemy instance
db = SQLAlchemy()

def create_app(config_name='dev'):
    """
    Factory function to create and configure the Flask application
    
    Args:
        config_name (str): Name of the configuration to use (dev, test, prod)
        
    Returns:
        Flask: The configured Flask application instance
    """
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])
    
    # Initialize extensions
    db.init_app(app)
    
    # Register blueprints
    from app.controllers.challenge_controller import challenge_bp
    from app.controllers.upload_controller import upload_bp
    from app.controllers.progress_controller import progress_bp
    
    app.register_blueprint(challenge_bp, url_prefix='/api/challenges')
    app.register_blueprint(upload_bp, url_prefix='/api/uploads')
    app.register_blueprint(progress_bp, url_prefix='/api/progress')
    
    # Create a simple route for testing
    @app.route('/health')
    def health_check():
        return {'status': 'ok', 'message': 'MathCraft API is running'}, 200
    
    return app

