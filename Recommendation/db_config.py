import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables
load_dotenv()

# MongoDB connection settings
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
DB_NAME = os.getenv('DB_NAME', 'utebook')

def get_collections():
    """Get MongoDB collections"""
    try:
        # Create MongoDB client
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        
        # Get collections
        reviews_collection = db.reviews
        books_collection = db.books
        users_collection = db.users
        chapters_collection = db.chapters
        
        return reviews_collection, books_collection, users_collection, chapters_collection
    except Exception as e:
        print(f"Error connecting to MongoDB: {str(e)}")
        raise 