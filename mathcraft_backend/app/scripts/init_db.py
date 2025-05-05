#!/usr/bin/env python
"""
Database initialization script for MathCraft AI Challenge System
Creates tables and populates them with sample data for testing
"""

import os
import sys
import logging
from datetime import datetime

# Add the parent directory to the path so we can import app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app import create_app, db
from app.models.challenge import Challenge
from app.models.progress import UserProgress, Achievement
from app.models.submission import Submission

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_tables():
    """Create all database tables"""
    logger.info("Creating database tables...")
    try:
        db.create_all()
        logger.info("Database tables created successfully!")
    except Exception as e:
        logger.error(f"Error creating tables: {str(e)}")
        raise

def add_sample_challenges():
    """Add sample challenge data to the database"""
    logger.info("Adding sample challenges...")
    
    # Check if we already have challenges to avoid duplicates
    if Challenge.query.count() > 0:
        logger.info("Challenges already exist, skipping sample data creation")
        return
    
    challenges = [
        {
            "title": "Geometric Shapes - Cubes and Pyramids",
            "description": "Create a structure that includes at least one cube and one pyramid. The cube should have equal sides and the pyramid should have a square base.",
            "difficulty": "easy",
            "criteria": {
                "size_requirements": {
                    "min_width": 5,
                    "min_height": 5,
                    "min_depth": 5
                },
                "required_blocks": [
                    {"id": "minecraft:stone", "min_count": 10},
                    {"id": "minecraft:glass", "min_count": 4}
                ],
                "structures": [
                    {"name": "cube", "required": True},
                    {"name": "pyramid", "required": True}
                ]
            },
            "hints": [
                "A cube has all sides equal in length",
                "A pyramid has a base and all sides meet at a point at the top",
                "Try using different block types for each shape to make them stand out"
            ],
            "image_url": "/static/images/challenges/geometric_shapes.jpg"
        },
        {
            "title": "Symmetry Challenge",
            "description": "Build a structure that demonstrates bilateral symmetry. Your creation should be identical on both sides of a central line or plane.",
            "difficulty": "medium",
            "criteria": {
                "size_requirements": {
                    "min_width": 8,
                    "min_height": 6,
                    "min_depth": 8
                },
                "required_blocks": [
                    {"id": "minecraft:oak_planks", "min_count": 20},
                    {"id": "minecraft:cobblestone", "min_count": 15}
                ],
                "symmetry": {
                    "type": "bilateral",
                    "axis": "x"
                }
            },
            "hints": [
                "Bilateral symmetry means if you draw a line down the middle, both sides are mirror images",
                "Start by building one half, then mirror it exactly on the other side",
                "Use an odd number of blocks for the central line to maintain perfect symmetry"
            ],
            "image_url": "/static/images/challenges/symmetry.jpg"
        },
        {
            "title": "Fraction Visualization - One Third",
            "description": "Create a 3D representation of the fraction 1/3 (one third). Your build should clearly demonstrate the concept of one part out of three equal parts.",
            "difficulty": "medium",
            "criteria": {
                "size_requirements": {
                    "min_width": 6,
                    "min_height": 3,
                    "min_depth": 6
                },
                "required_blocks": [
                    {"id": "minecraft:wool", "min_count": 10},
                    {"id": "minecraft:concrete", "min_count": 10}
                ],
                "fraction": {
                    "numerator": 1,
                    "denominator": 3,
                    "representation": "clear"
                }
            },
            "hints": [
                "Consider using different colored blocks to show the fraction parts",
                "Your build should have 3 equal sections with 1 section highlighted or different",
                "You can represent this horizontally, vertically, or in a 3D arrangement"
            ],
            "image_url": "/static/images/challenges/fraction_one_third.jpg"
        },
        {
            "title": "Area and Perimeter",
            "description": "Build a rectangular structure where the area is exactly twice the perimeter. Remember that area = length × width and perimeter = 2 × (length + width).",
            "difficulty": "hard",
            "criteria": {
                "size_requirements": {
                    "min_height": 1
                },
                "required_blocks": [
                    {"id": "minecraft:concrete", "min_count": 20}
                ],
                "math_relationship": {
                    "type": "area_perimeter",
                    "ratio": 2.0
                }
            },
            "hints": [
                "Try different combinations of length and width to find values where area = 2 × perimeter",
                "For a rectangle with length l and width w, you need l × w = 2 × (2(l + w))",
                "One possible solution is a 4×4 square, check if area (16) = 2 × perimeter (8)"
            ],
            "image_url": "/static/images/challenges/area_perimeter.jpg"
        }
    ]
    
    try:
        for challenge_data in challenges:
            challenge = Challenge(
                title=challenge_data["title"],
                description=challenge_data["description"],
                difficulty=challenge_data["difficulty"],
                criteria=challenge_data["criteria"],
                hints=challenge_data["hints"],
                image_url=challenge_data["image_url"]
            )
            db.session.add(challenge)
        
        db.session.commit()
        logger.info(f"Added {len(challenges)} sample challenges to the database")
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error adding sample challenges: {str(e)}")
        raise

def add_sample_users_and_progress():
    """Add sample user progress data to the database"""
    logger.info("Adding sample user progress data...")
    
    # Check if we already have user progress to avoid duplicates
    if UserProgress.query.count() > 0:
        logger.info("User progress records already exist, skipping sample data creation")
        return
    
    # First get all challenges
    challenges = Challenge.query.all()
    if not challenges:
        logger.warning("No challenges found, can't add sample progress")
        return
    
    # Sample users
    users = [
        {"id": "user1", "name": "MathWizard"},
        {"id": "user2", "name": "BlockBuilder"},
        {"id": "user3", "name": "MinecraftMaster"}
    ]
    
    try:
        # Create progress records for each user and challenge
        for user in users:
            # Add different progress for each challenge
            for i, challenge in enumerate(challenges):
                # Set progress differently for each user to simulate different levels of completion
                is_completed = i < len(challenges) - 1  # All but the last challenge completed
                score = 100 if is_completed else 0
                
                if user["id"] == "user2":
                    # Second user has completed fewer challenges
                    is_completed = i < len(challenges) - 2
                    score = 85 if is_completed else 0
                elif user["id"] == "user3":
                    # Third user has completed even fewer challenges
                    is_completed = i < len(challenges) - 3
                    score = 70 if is_completed else 0
                
                # Create progress record
                progress = UserProgress(
                    user_id=user["id"],
                    challenge_id=challenge.id,
                    attempts=3 if is_completed else 1,
                    score=score,
                    is_completed=is_completed
                )
                db.session.add(progress)
        
        # Add some achievements for the first user
        achievements = [
            {
                "name": "MathCraft Beginner",
                "description": "Completed your first MathCraft challenge",
                "badge_url": "/static/images/badges/beginner.png",
            },
            {
                "name": "Geometry Genius",
                "description": "Successfully completed all geometry-related challenges",
                "badge_url": "/static/images/badges/geometry.png",
            }
        ]
        
        for achievement_data in achievements:
            achievement = Achievement(
                user_id="user1",
                name=achievement_data["name"],
                description=achievement_data["description"],
                badge_url=achievement_data["badge_url"]
            )
            db.session.add(achievement)
        
        db.session.commit()
        logger.info(f"Added sample progress data for {len(users)} users across {len(challenges)} challenges")
        logger.info(f"Added {len(achievements)} achievements for the first user")
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error adding sample progress data: {str(e)}")
        raise

def main():
    """Main entry point for the script"""
    try:
        # Create app with development configuration
        app = create_app('dev')
        
        # Push an application context to work with the database
        with app.app_context():
            create_tables()
            add_sample_challenges()
            add_sample_users_and_progress()
            
        logger.info("Database initialization completed successfully!")
        return 0
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())

