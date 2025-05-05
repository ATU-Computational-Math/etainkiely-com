import os
import logging
from app import create_app, db
from flask import url_for

# Configure logging
logging.basicConfig(level=logging.DEBUG, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create Flask application instance using environment variable or default to development
app = create_app(os.getenv('FLASK_ENV', 'dev'))

# Create database tables if they don't exist during application startup
with app.app_context():
    db.create_all()
    logger.info("Database tables initialized")
    
    # Print all registered routes for debugging purposes
    logger.debug("Registered Routes:")
    for rule in app.url_map.iter_rules():
        logger.debug(f"{rule} ({', '.join(rule.methods)})")
    
    logger.debug("Registered Blueprints:")
    for blueprint in app.blueprints:
        logger.debug(f"- {blueprint}")

if __name__ == '__main__':
    # Get port from environment variable or use default 5000
    port = int(os.environ.get('PORT', 5000))
    logger.info(f"Starting Flask server on localhost:{port}")
    app.run(host='localhost', port=port, debug=True)
