from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from bson import ObjectId
import pandas as pd
from recommender import HybridRecommender
from db_config import get_collections
import logging
import asyncio
from concurrent.futures import ThreadPoolExecutor
import traceback

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Book Recommendation API")

# Initialize recommender
recommender = None
executor = ThreadPoolExecutor(max_workers=1)

class RecommendationResponse(BaseModel):
    book_id: str
    bookname: str
    author: str
    description: str
    cover_image: Optional[str] = None
    rating: Optional[float] = None

def initialize_recommender():
    """Initialize the recommender system with data from MongoDB"""
    global recommender
    try:
        logger.info("Starting recommender initialization...")
        
        # Get MongoDB collections
        reviews_collection, books_collection, users_collection, chapters_collection = get_collections()
        logger.info("Successfully connected to MongoDB collections")
        
        # Fetch ratings data
        ratings_data = []
        try:
            for doc in reviews_collection.find():
                try:
                    ratings_data.append({
                        'userId': str(doc.get('userId', '')),
                        'bookId': str(doc.get('bookId', '')),
                        'rating': float(doc.get('rating', 0))
                    })
                except Exception as e:
                    logger.error(f"Error processing rating document: {str(e)}")
                    continue
        except Exception as e:
            logger.error(f"Error fetching ratings: {str(e)}")
            return
        
        if not ratings_data:
            logger.warning("No ratings data found in MongoDB")
            return
        
        logger.info(f"Successfully fetched {len(ratings_data)} ratings")
        
        # Convert to DataFrame
        ratings_df = pd.DataFrame(ratings_data)
        ratings_df = ratings_df.rename(columns={
            'userId': 'user_id',
            'bookId': 'item_id'
        })
        
        # Fetch books data
        books_data = []
        try:
            for doc in books_collection.find():
                try:
                    books_data.append({
                        '_id': str(doc.get('_id', '')),
                        'bookname': doc.get('bookname', ''),
                        'author': doc.get('author', ''),
                        'description': doc.get('description', ''),
                        'coverImage': doc.get('coverImage', ''),
                        'rating': float(doc.get('rating', 0))
                    })
                except Exception as e:
                    logger.error(f"Error processing book document: {str(e)}")
                    continue
        except Exception as e:
            logger.error(f"Error fetching books: {str(e)}")
            return
        
        if not books_data:
            logger.warning("No books data found in MongoDB")
            return
        
        logger.info(f"Successfully fetched {len(books_data)} books")
        
        # Convert to DataFrame
        books_df = pd.DataFrame(books_data)
        books_df = books_df.rename(columns={
            '_id': 'item_id',
            'coverImage': 'cover_image'
        })
        
        # Fetch chapters data if available
        chapters_df = None
        try:
            chapters_data = []
            for doc in chapters_collection.find():
                try:
                    chapters_data.append({
                        'bookId': str(doc.get('bookId', '')),
                        'viewlink': doc.get('viewlink', '')
                    })
                except Exception as e:
                    logger.error(f"Error processing chapter document: {str(e)}")
                    continue
            
            if chapters_data:
                chapters_df = pd.DataFrame(chapters_data)
                logger.info(f"Successfully fetched {len(chapters_data)} chapters")
        except Exception as e:
            logger.warning(f"Error fetching chapters: {str(e)}")
            chapters_df = None
        
        # Initialize recommender
        logger.info("Initializing HybridRecommender...")
        recommender = HybridRecommender()
        recommender.fit(ratings_df, books_df, chapters_df)
        logger.info("Recommender system initialized successfully")
        
    except Exception as e:
        logger.error(f"Error initializing recommender: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise

@app.on_event("startup")
async def startup_event():
    """Initialize recommender on startup"""
    try:
        logger.info("Starting application...")
        # Run initialization in a separate thread
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(executor, initialize_recommender)
        logger.info("Application startup completed")
    except Exception as e:
        logger.error(f"Failed to initialize recommender: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")

@app.get("/recommendations/{user_id}", response_model=List[RecommendationResponse])
async def get_recommendations(user_id: str, n_recommendations: int = 5):
    """Get book recommendations for a user"""
    if not recommender:
        raise HTTPException(status_code=500, detail="Recommender system not initialized")
    
    try:
        # Get recommendations
        recommended_items = recommender.recommend(user_id, n_recommendations)
        
        # Get book details for recommendations
        recommendations = []
        reviews_collection, books_collection, users_collection, chapters_collection = get_collections()
        
        for item_id in recommended_items:
            try:
                book = books_collection.find_one({'_id': ObjectId(item_id)})
                if book:
                    recommendations.append(RecommendationResponse(
                        book_id=str(book['_id']),
                        bookname=book.get('bookname', ''),
                        author=book.get('author', ''),
                        description=book.get('description', ''),
                        cover_image=book.get('coverImage'),
                        rating=book.get('rating')
                    ))
            except Exception as e:
                logger.error(f"Error processing book {item_id}: {str(e)}")
                continue
        
        return recommendations
        
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "recommender_initialized": recommender is not None
    } 