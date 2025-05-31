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
from fastapi.middleware.cors import CORSMiddleware

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Book Recommendation API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize recommender
recommender = None
executor = ThreadPoolExecutor(max_workers=1)

class RecommendationResponse(BaseModel):
    book_id: str
    bookname: str
    author: str
    categories: List[str]
    type: str
    pushlisher: Optional[str] = None
    image: str
    description: Optional[str] = None
    chapterIds: Optional[List[str]] = None
    ageLimit: int
    listUserFavorited: Optional[List[str]] = None
    listReading: Optional[List[str]] = None
    listReviews: Optional[List[str]] = None
    rating: float = 0
    avegradeRate: float = 0
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None

def initialize_recommender():
    """Initialize the recommender system with data from MongoDB"""
    global recommender
    try:
        logger.info("Starting recommender initialization...")
        
        # Get MongoDB collections
        reviews_collection, books_collection, users_collection, chapters_collection, history_reading_collection = get_collections()
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
        
        # Fetch reading history data
        reading_history_data = []
        try:
            for doc in history_reading_collection.find():
                try:
                    reading_history_data.append({
                        'userId': str(doc.get('userId', '')),
                        'bookId': str(doc.get('bookId', '')),
                        'rating': 1.0  # Use 1.0 to indicate reading history
                    })
                except Exception as e:
                    logger.error(f"Error processing reading history document: {str(e)}")
                    continue
        except Exception as e:
            logger.error(f"Error fetching reading history: {str(e)}")
            return
        
        # Combine ratings and reading history
        all_user_item_data = ratings_data + reading_history_data
        
        if not all_user_item_data:
            logger.warning("No user-item data found in MongoDB")
            return
        
        logger.info(f"Successfully fetched {len(ratings_data)} ratings and {len(reading_history_data)} reading history entries")
        
        # Convert to DataFrame
        user_item_df = pd.DataFrame(all_user_item_data)
        user_item_df = user_item_df.rename(columns={
            'userId': 'user_id',
            'bookId': 'item_id'
        })
        
        # Handle duplicate entries by taking the maximum rating
        user_item_df = user_item_df.groupby(['user_id', 'item_id'])['rating'].max().reset_index()
        logger.info(f"After handling duplicates: {len(user_item_df)} unique user-item entries")
        
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
                        'image': doc.get('image', ''),
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
            'image': 'image'
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
        recommender.fit(user_item_df, books_df, chapters_df)
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
async def get_recommendations(
    user_id: str, 
    n_recommendations: int = 60,
    bookname: Optional[str] = None
):
    """Get book recommendations for a user"""
    if not recommender:
        raise HTTPException(status_code=500, detail="Recommender system not initialized")
    
    try:
        # Get MongoDB collections
        reviews_collection, books_collection, users_collection, chapters_collection, history_reading_collection = get_collections()
        
        # Check if user exists in MongoDB
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")
        
        # Get recommendations
        recommended_items = recommender.recommend(user_id, n_recommendations)
        
        # Get book details for recommendations
        recommendations = []
        
        for item_id in recommended_items:
            try:
                book = books_collection.find_one({'_id': ObjectId(item_id)})
                if book:
                    # Chỉ lọc theo bookname nếu bookname không phải null
                    if bookname is not None and bookname.lower() not in book.get('bookname', '').lower():
                        continue
                        
                    recommendations.append(RecommendationResponse(
                        book_id=str(book['_id']),
                        bookname=book.get('bookname', ''),
                        author=book.get('author', ''),
                        categories=book.get('categories', []),
                        type=book.get('type', ''),
                        pushlisher=book.get('pushlisher', ''),
                        image=book.get('image', ''),
                        description=book.get('description', ''),
                        chapterIds=[str(cid) for cid in book.get('chapterIds', [])],
                        ageLimit=book.get('ageLimit', 0),
                        listUserFavorited=[str(uid) for uid in book.get('listUserFavorited', [])],
                        listReading=[str(rid) for rid in book.get('listReading', [])],
                        listReviews=[str(rid) for rid in book.get('listReviews', [])],
                        rating=book.get('rating', 0),
                        avegradeRate=book.get('avegradeRate', 0),
                        createdAt=str(book.get('createdAt', '')),
                        updatedAt=str(book.get('updatedAt', ''))
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