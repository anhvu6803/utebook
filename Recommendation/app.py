from flask import Flask, request, jsonify
from flask_cors import CORS
from mongo_recommender import MongoBookRecommender
from dotenv import load_dotenv
import os
import logging
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('recommendation.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://localhost:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Initialize recommender with MongoDB URI
try:
    recommender = MongoBookRecommender(os.getenv('MONGO_URI'))
    logger.info("Successfully initialized recommender")
except Exception as e:
    logger.error(f"Failed to initialize recommender: {str(e)}")
    raise

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Check MongoDB connection
        recommender.client.server_info()
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'version': '1.0.0'
        })
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 500

@app.route('/api/recommend', methods=['GET'])
def get_recommendations():
    try:
        # Get and validate user_id
        user_id = request.args.get('user_id')
        if not user_id:
            logger.warning("Missing user_id parameter")
            return jsonify({
                'success': False,
                'error': 'user_id is required'
            }), 400
            
        # Validate user_id format
        try:
            ObjectId(user_id)
        except InvalidId:
            logger.warning(f"Invalid user_id format: {user_id}")
            return jsonify({
                'success': False,
                'error': 'Invalid user_id format'
            }), 400
            
        # Get and validate n parameter
        try:
            n = int(request.args.get('n', 10))
            if n <= 0:
                raise ValueError("n must be positive")
            if n > 50:  # Limit maximum recommendations
                n = 50
        except ValueError as e:
            logger.warning(f"Invalid n parameter: {str(e)}")
            return jsonify({
                'success': False,
                'error': str(e)
            }), 400
            
        # Log database stats
        total_books = recommender.books_collection.count_documents({})
        total_reviews = recommender.reviews_collection.count_documents({})
        logger.info(f"Database stats - Total books: {total_books}, Total reviews: {total_reviews}")
        
        # Check if user exists
        user_reviews = list(recommender.reviews_collection.find(
            {'userId': ObjectId(user_id)},
            {'bookId': 1, 'rating': 1}
        ))
        logger.info(f"Found {len(user_reviews)} reviews for user {user_id}")
        
        # Get recommendations
        recommendations = recommender.get_recommendations(user_id, n)
        logger.info(f"Generated {len(recommendations)} recommendations")
        
        # Convert ObjectId to string for JSON serialization
        for book in recommendations:
            book['_id'] = str(book['_id'])
            if 'chapterIds' in book:
                book['chapterIds'] = [str(chapter_id) for chapter_id in book['chapterIds']]
        
        logger.info(f"Successfully generated {len(recommendations)} recommendations for user {user_id}")
        return jsonify({
            'success': True,
            'data': {
                'recommendations': recommendations,
                'total': len(recommendations),
                'timestamp': datetime.now().isoformat()
            }
        })
        
    except Exception as e:
        logger.error(f"Error in get_recommendations: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/similar', methods=['GET'])
def get_similar_books():
    try:
        # Get and validate book_id
        book_id = request.args.get('book_id')
        if not book_id:
            logger.warning("Missing book_id parameter")
            return jsonify({
                'success': False,
                'error': 'book_id is required'
            }), 400
            
        # Validate book_id format
        try:
            ObjectId(book_id)
        except InvalidId:
            logger.warning(f"Invalid book_id format: {book_id}")
            return jsonify({
                'success': False,
                'error': 'Invalid book_id format'
            }), 400
            
        # Get and validate n parameter
        try:
            n = int(request.args.get('n', 10))
            if n <= 0:
                raise ValueError("n must be positive")
            if n > 50:  # Limit maximum recommendations
                n = 50
        except ValueError as e:
            logger.warning(f"Invalid n parameter: {str(e)}")
            return jsonify({
                'success': False,
                'error': str(e)
            }), 400
            
        # Get similar books
        similar_books = recommender.get_similar_books(book_id, n)
        
        # Convert ObjectId to string for JSON serialization
        for book in similar_books:
            book['_id'] = str(book['_id'])
            if 'chapterIds' in book:
                book['chapterIds'] = [str(chapter_id) for chapter_id in book['chapterIds']]
        
        logger.info(f"Successfully found {len(similar_books)} similar books for book {book_id}")
        return jsonify({
            'success': True,
            'data': {
                'similar_books': similar_books,
                'total': len(similar_books),
                'timestamp': datetime.now().isoformat()
            }
        })
        
    except Exception as e:
        logger.error(f"Error in get_similar_books: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get recommendation system statistics"""
    try:
        stats = recommender.get_stats()
        return jsonify({
            'success': True,
            'data': {
                'stats': stats,
                'timestamp': datetime.now().isoformat()
            }
        })
    except Exception as e:
        logger.error(f"Error in get_stats: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3000))
    logger.info(f"Starting server on port {port}")
    app.run(host='0.0.0.0', port=port) 