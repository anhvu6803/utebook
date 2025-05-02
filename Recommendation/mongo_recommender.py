from pymongo import MongoClient
from bson import ObjectId
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from dotenv import load_dotenv
import os
import logging
import random
from datetime import datetime
import requests
import re
from bs4 import BeautifulSoup
import io
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MongoBookRecommender:
    def __init__(self, mongo_uri):
        try:
            load_dotenv()
            self.client = MongoClient(mongo_uri)
            self.db = self.client[os.getenv('MONGO_DB_NAME', 'utebook')]
            self.books_collection = self.db.books
            self.reviews_collection = self.db.reviews
            self.chapters_collection = self.db.chapters  # Add chapters collection
            self.user_book_matrix = None
            self.tfidf_matrix = None
            self.book_similarity = None
            
            # Initialize Google Drive API
            self.drive_service = self._initialize_drive_service()
            
            # Test connection
            self.client.server_info()
            logger.info("Successfully connected to MongoDB")
            
            # Initialize matrices
            self._create_user_book_matrix()
            self._create_tfidf_matrix()
        except Exception as e:
            logger.error(f"Error initializing MongoBookRecommender: {str(e)}")
            raise

    def _initialize_drive_service(self):
        """Initialize Google Drive API service"""
        try:
            # Load credentials from environment variable or file
            credentials = service_account.Credentials.from_service_account_info(
                {
                    "type": "service_account",
                    "project_id": os.getenv('GOOGLE_PROJECT_ID'),
                    "private_key_id": os.getenv('GOOGLE_PRIVATE_KEY_ID'),
                    "private_key": os.getenv('GOOGLE_PRIVATE_KEY').replace('\\n', '\n'),
                    "client_email": os.getenv('GOOGLE_CLIENT_EMAIL'),
                    "client_id": os.getenv('GOOGLE_CLIENT_ID'),
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                    "client_x509_cert_url": os.getenv('GOOGLE_CLIENT_X509_CERT_URL')
                },
                scopes=['https://www.googleapis.com/auth/drive.readonly']
            )
            return build('drive', 'v3', credentials=credentials)
        except Exception as e:
            logger.error(f"Error initializing Google Drive service: {str(e)}")
            return None

    def _get_book_content(self, book_id):
        """Get book content from Google Drive for all chapters"""
        try:
            # Get book with chapterIds
            book = self.books_collection.find_one(
                {'_id': ObjectId(book_id)},
                {'chapterIds': 1, 'bookName': 1}
            )
            
            if not book or 'chapterIds' not in book:
                logger.warning(f"No chapters found for book {book_id}, using metadata only")
                return None
                
            logger.info(f"Processing content for book: {book.get('bookName', 'Unknown')} (ID: {book_id})")
            
            # Get all chapters for the book
            chapters = list(self.chapters_collection.find(
                {'_id': {'$in': book['chapterIds']}},
                {'chapterName': 1, 'viewlink': 1}
            ).sort('_id', 1))  # Sort by chapter order
            
            if not chapters:
                logger.warning(f"No valid chapters found for book {book_id}, using metadata only")
                return None
                
            logger.info(f"Found {len(chapters)} chapters for book {book_id}")
                
            # Combine content from all chapters
            full_content = []
            successful_chapters = 0
            
            for chapter in chapters:
                if 'viewlink' not in chapter:
                    logger.warning(f"Missing viewlink for chapter {chapter.get('_id')} in book {book_id}")
                    continue
                    
                # Extract file ID from view link
                file_id = self._extract_file_id(chapter['viewlink'])
                if not file_id:
                    logger.warning(f"Invalid view link for chapter {chapter.get('_id')} in book {book_id}")
                    continue
                    
                # Download chapter content
                chapter_content = self._download_chapter_content(file_id)
                if chapter_content:
                    # Add chapter name to content for better context
                    chapter_text = f"{chapter.get('chapterName', '')} {chapter_content}"
                    full_content.append(chapter_text)
                    successful_chapters += 1
                    logger.info(f"Successfully processed chapter {chapter.get('chapterName', 'Unknown')}")
                else:
                    logger.warning(f"Failed to process chapter {chapter.get('chapterName', 'Unknown')}")
            
            if not full_content:
                logger.warning(f"No valid chapter content found for book {book_id}, using metadata only")
                return None
                
            logger.info(f"Successfully processed {successful_chapters}/{len(chapters)} chapters for book {book_id}")
            
            # Combine all chapter contents
            return ' '.join(full_content)
            
        except Exception as e:
            logger.error(f"Error getting book content: {str(e)}, using metadata only")
            return None

    def _download_chapter_content(self, file_id):
        """Download and process content for a single chapter"""
        try:
            start_time = datetime.now()
            
            # Download file content
            request = self.drive_service.files().get_media(fileId=file_id)
            fh = io.BytesIO()
            downloader = MediaIoBaseDownload(fh, request)
            done = False
            while done is False:
                status, done = downloader.next_chunk()
            
            # Read and clean content
            content = fh.getvalue().decode('utf-8')
            cleaned_content = self._clean_content(content)
            
            processing_time = (datetime.now() - start_time).total_seconds()
            logger.info(f"Downloaded and processed chapter content in {processing_time:.2f} seconds")
            
            return cleaned_content
            
        except Exception as e:
            logger.error(f"Error downloading chapter content: {str(e)}")
            return None

    def _extract_file_id(self, drive_link):
        """Extract file ID from Google Drive link"""
        try:
            # Handle different types of Google Drive links
            if 'drive.google.com/file/d/' in drive_link:
                return drive_link.split('/file/d/')[1].split('/')[0]
            elif 'drive.google.com/open' in drive_link:
                return drive_link.split('id=')[1].split('&')[0]
            else:
                return None
        except Exception as e:
            logger.error(f"Error extracting file ID: {str(e)}")
            return None

    def _clean_content(self, content):
        """Clean and preprocess book content"""
        try:
            start_time = datetime.now()
            
            # Remove HTML tags
            soup = BeautifulSoup(content, 'html.parser')
            text = soup.get_text()
            
            # Remove extra whitespace
            text = re.sub(r'\s+', ' ', text)
            
            # Remove special characters but keep Vietnamese characters
            text = re.sub(r'[^\w\s\u00C0-\u1EF9]', ' ', text)
            
            # Convert to lowercase
            text = text.lower()
            
            # Remove numbers
            text = re.sub(r'\d+', '', text)
            
            # Remove very short words
            text = ' '.join([word for word in text.split() if len(word) > 2])
            
            processing_time = (datetime.now() - start_time).total_seconds()
            logger.info(f"Cleaned content in {processing_time:.2f} seconds")
            
            return text
        except Exception as e:
            logger.error(f"Error cleaning content: {str(e)}")
            return content

    def _create_user_book_matrix(self):
        """Create user-book rating matrix from MongoDB"""
        try:
            # Log số lượng sách và chapter
            total_books = self.books_collection.count_documents({})
            total_chapters = self.chapters_collection.count_documents({})
            logger.info(f"Total books in database: {total_books}")
            logger.info(f"Total chapters in database: {total_chapters}")

            # Log chi tiết về sách có chapter
            books_with_chapters = self.books_collection.count_documents({
                'chapterIds': {'$exists': True, '$ne': []}
            })
            logger.info(f"Books with chapters: {books_with_chapters}")

            # Get all reviews with ratings between 1 and 5
            reviews = list(self.reviews_collection.find(
                {'rating': {'$exists': True, '$gte': 1, '$lte': 5}},  # Rating validation
                {'userId': 1, 'bookId': 1, 'rating': 1, 'createdAt': 1}  # Added createdAt
            ).sort('createdAt', -1))  # Sort by most recent first
            
            total_reviews = len(reviews)
            logger.info(f"Total reviews in database: {total_reviews}")
            
            if not reviews:
                logger.warning("No reviews found in database, using content-based filtering only")
                self.user_book_matrix = np.zeros((0, 0))
                return
                
            # Create user-book matrix
            user_ids = set(str(review['userId']) for review in reviews)
            book_ids = set(str(review['bookId']) for review in reviews)
            
            logger.info(f"Unique users with reviews: {len(user_ids)}")
            logger.info(f"Unique books with reviews: {len(book_ids)}")
            
            # Initialize matrix with zeros
            self.user_book_matrix = np.zeros((len(user_ids), len(book_ids)))
            
            # Create mappings for user and book indices
            user_idx_map = {user_id: idx for idx, user_id in enumerate(user_ids)}
            book_idx_map = {book_id: idx for idx, book_id in enumerate(book_ids)}
            
            # Fill matrix with ratings
            for review in reviews:
                user_idx = user_idx_map[str(review['userId'])]
                book_idx = book_idx_map[str(review['bookId'])]
                self.user_book_matrix[user_idx, book_idx] = review['rating']
                
            logger.info(f"Created user-book matrix with {len(user_ids)} users and {len(book_ids)} books")
                
        except Exception as e:
            logger.error(f"Error creating user-book matrix: {str(e)}")
            raise
            
    def _create_tfidf_matrix(self):
        """Create TF-IDF matrix from book descriptions and content"""
        try:
            start_time = datetime.now()
            
            # Get all books
            books = list(self.books_collection.find(
                {},
                {'_id': 1, 'bookName': 1, 'description': 1}
            ))
            
            if not books:
                logger.warning("No books found in database")
                return
                
            logger.info(f"Processing {len(books)} books for TF-IDF matrix")
            
            # Prepare documents for TF-IDF
            documents = []
            book_ids = []
            
            for book in books:
                # Get book content from Google Drive
                content = self._get_book_content(str(book['_id']))
                
                # Combine book metadata and content
                doc = f"{book.get('bookName', '')} {book.get('description', '')}"
                if content:
                    doc += f" {content}"
                    
                documents.append(doc)
                book_ids.append(str(book['_id']))
            
            # Create TF-IDF matrix
            vectorizer = TfidfVectorizer(
                max_features=5000,
                min_df=2,
                max_df=0.95,
                stop_words=None  # Don't use default stop words to preserve Vietnamese text
            )
            
            self.tfidf_matrix = vectorizer.fit_transform(documents)
            self.book_similarity = cosine_similarity(self.tfidf_matrix)
            
            processing_time = (datetime.now() - start_time).total_seconds()
            logger.info(f"Created TF-IDF matrix in {processing_time:.2f} seconds")
            logger.info(f"Matrix shape: {self.tfidf_matrix.shape}")
            
        except Exception as e:
            logger.error(f"Error creating TF-IDF matrix: {str(e)}")
            raise
            
    def get_recommendations(self, user_id, n=10):
        """Get personalized book recommendations for a user"""
        try:
            start_time = datetime.now()
            logger.info(f"Generating recommendations for user {user_id}")
            
            # 1. Kiểm tra lịch sử đọc và đánh giá
            user_history = list(self.reviews_collection.find(
                {'userId': ObjectId(user_id)},
                {'bookId': 1, 'rating': 1}
            ))
            
            # Phân loại lịch sử
            rated_books = [review for review in user_history if 'rating' in review and review['rating'] > 0]
            unrated_books = [review for review in user_history if 'rating' not in review or review['rating'] == 0]
            
            logger.info(f"User {user_id} has {len(rated_books)} rated books and {len(unrated_books)} unrated books")
            
            # 2. Xử lý theo từng trường hợp
            if not user_history:
                # Trường hợp 1: Người dùng mới, chưa đọc sách nào
                logger.info("New user - Using random recommendations")
                return self._get_random_books(n)
                
            elif not rated_books and unrated_books:
                # Trường hợp 2: Đã đọc nhưng chưa đánh giá
                logger.info("User has read books but no ratings - Using content-based recommendations")
                return self._get_content_based_recommendations(user_id, n)
                
            else:
                # Trường hợp 3: Đã đọc và có đánh giá
                # Tính alpha dựa trên số lượng đánh giá
                alpha = self._calculate_alpha(len(rated_books))
                logger.info(f"User has ratings - Using hybrid recommendations with alpha={alpha:.2f}")
                
                # Lấy đề xuất từ cả hai phương pháp
                cf_recommendations = self._get_collaborative_recommendations(user_id, n)
                cb_recommendations = self._get_content_based_recommendations(user_id, n)
                
                # Kết hợp với trọng số alpha
                recommendations = self._combine_recommendations_with_alpha(
                    cf_recommendations,
                    cb_recommendations,
                    n,
                    alpha
                )
                
                processing_time = (datetime.now() - start_time).total_seconds()
                logger.info(f"Generated {len(recommendations)} recommendations in {processing_time:.2f} seconds")
                return recommendations
            
        except Exception as e:
            logger.error(f"Error in get_recommendations: {str(e)}")
            return self._get_random_books(n)

    def _calculate_alpha(self, num_ratings):
        """Calculate alpha parameter for hybrid recommendations"""
        # Alpha tăng dần theo số lượng đánh giá
        # Ít đánh giá -> alpha thấp (ưu tiên CBF)
        # Nhiều đánh giá -> alpha cao (ưu tiên CF)
        min_alpha = 0.2  # Ưu tiên CBF khi ít đánh giá
        max_alpha = 0.8  # Ưu tiên CF khi nhiều đánh giá
        max_ratings = 50  # Sau 50 đánh giá, alpha đạt max
        
        if num_ratings >= max_ratings:
            return max_alpha
            
        return min_alpha + (max_alpha - min_alpha) * (num_ratings / max_ratings)

    def _get_random_books(self, n):
        """Get random books as fallback recommendations"""
        try:
            # Get random books with complete metadata
            books = list(self.books_collection.aggregate([
                {'$match': {
                    'bookName': {'$exists': True},
                    'description': {'$exists': True}
                }},
                {'$sample': {'size': n}}
            ]))
            
            if not books:
                logger.warning("No books found for random recommendations")
                return []
                
            logger.info(f"Generated {len(books)} random recommendations")
            return books
            
        except Exception as e:
            logger.error(f"Error in _get_random_books: {str(e)}")
            return []

    def _get_content_based_recommendations(self, user_id, n):
        """Get content-based recommendations based on user's reading history"""
        try:
            if self.tfidf_matrix is None or self.book_similarity is None:
                logger.warning("TF-IDF matrix not initialized, using random recommendations")
                return self._get_random_books(n)
            
            # Lấy lịch sử đọc của người dùng (cả đã đánh giá và chưa đánh giá)
            user_history = list(self.reviews_collection.find(
                {'userId': ObjectId(user_id)},
                {'bookId': 1}
            ))
            
            if not user_history:
                return self._get_random_books(n)
            
            # Lấy danh sách sách đã đọc
            read_books = [str(review['bookId']) for review in user_history]
            
            # Tính độ tương tự trung bình
            avg_similarity = np.zeros(self.book_similarity.shape[0])
            for book_id in read_books:
                book_idx = self.book_idx_map.get(book_id)
                if book_idx is not None:
                    avg_similarity += self.book_similarity[book_idx]
            
            if len(read_books) > 0:
                avg_similarity /= len(read_books)
            
            # Loại bỏ những sách đã đọc
            for book_id in read_books:
                book_idx = self.book_idx_map.get(book_id)
                if book_idx is not None:
                    avg_similarity[book_idx] = -1  # Đánh dấu sách đã đọc
            
            # Lấy top N sách tương tự
            top_indices = np.argsort(avg_similarity)[-n:][::-1]
            
            # Lấy thông tin sách
            recommended_books = []
            for idx in top_indices:
                book_id = self.book_idx_map.get(idx)
                if book_id:
                    book = self.books_collection.find_one(
                        {'_id': ObjectId(book_id)},
                        {'_id': 1, 'bookName': 1, 'description': 1, 'author': 1, 'categories': 1}
                    )
                    if book:
                        recommended_books.append(book)
            
            logger.info(f"Generated {len(recommended_books)} content-based recommendations")
            return recommended_books
            
        except Exception as e:
            logger.error(f"Error in _get_content_based_recommendations: {str(e)}")
            return self._get_random_books(n)

    def _get_collaborative_recommendations(self, user_id, n):
        """Get collaborative filtering recommendations"""
        try:
            if self.user_book_matrix is None:
                logger.warning("User-book matrix not initialized, using content-based recommendations")
                return self._get_content_based_recommendations(user_id, n)
            
            # Get user index
            user_idx = None
            for idx, uid in enumerate(self.user_idx_map):
                if str(uid) == str(user_id):
                    user_idx = idx
                    break
            
            if user_idx is None:
                logger.warning(f"User {user_id} not found in user-book matrix")
                return self._get_content_based_recommendations(user_id, n)
            
            # Get user's ratings
            user_ratings = self.user_book_matrix[user_idx]
            
            # Calculate predicted ratings
            predicted_ratings = np.zeros(self.user_book_matrix.shape[1])
            for book_idx in range(self.user_book_matrix.shape[1]):
                # Get similar users who rated this book
                similar_users = np.where(self.user_book_matrix[:, book_idx] > 0)[0]
                if len(similar_users) > 0:
                    # Calculate weighted average rating
                    weights = np.array([self.user_similarity[user_idx, u] for u in similar_users])
                    ratings = self.user_book_matrix[similar_users, book_idx]
                    predicted_ratings[book_idx] = np.sum(weights * ratings) / np.sum(weights)
            
            # Get top N recommendations
            top_indices = np.argsort(predicted_ratings)[-n:][::-1]
            
            # Get recommended books
            recommended_books = []
            for idx in top_indices:
                book_id = self.book_idx_map[idx]
                book = self.books_collection.find_one(
                    {'_id': ObjectId(book_id)},
                    {'_id': 1, 'bookName': 1, 'description': 1}
                )
                if book:
                    recommended_books.append(book)
            
            logger.info(f"Generated {len(recommended_books)} collaborative filtering recommendations")
            return recommended_books
            
        except Exception as e:
            logger.error(f"Error in _get_collaborative_recommendations: {str(e)}")
            return self._get_content_based_recommendations(user_id, n)

    def _combine_recommendations_with_alpha(self, cf_recommendations, cb_recommendations, n, alpha):
        """Combine collaborative and content-based recommendations"""
        try:
            # Create sets of book IDs
            cf_book_ids = {str(book['_id']) for book in cf_recommendations}
            cb_book_ids = {str(book['_id']) for book in cb_recommendations}
            
            # Combine recommendations
            combined_recommendations = []
            
            # Add collaborative filtering recommendations first
            for book in cf_recommendations:
                if len(combined_recommendations) >= n:
                    break
                combined_recommendations.append(book)
            
            # Add content-based recommendations
            for book in cb_recommendations:
                if len(combined_recommendations) >= n:
                    break
                if str(book['_id']) not in cf_book_ids:
                    combined_recommendations.append(book)
            
            logger.info(f"Combined {len(combined_recommendations)} recommendations (alpha={alpha:.2f})")
            return combined_recommendations
            
        except Exception as e:
            logger.error(f"Error in _combine_recommendations_with_alpha: {str(e)}")
            return self._get_random_books(n)

    def _get_popular_books(self, n):
        """Get popular books based on ratings"""
        try:
            # Get books with highest average ratings
            books = list(self.books_collection.aggregate([
                {
                    '$lookup': {
                        'from': 'reviews',
                        'localField': '_id',
                        'foreignField': 'bookId',
                        'as': 'reviews'
                    }
                },
                {
                    '$addFields': {
                        'avgRating': {'$avg': '$reviews.rating'},
                        'reviewCount': {'$size': '$reviews'}
                    }
                },
                {
                    '$match': {
                        'reviewCount': {'$gt': 0}
                    }
                },
                {
                    '$sort': {
                        'avgRating': -1,
                        'reviewCount': -1
                    }
                },
                {
                    '$limit': n
                }
            ]))
            
            if not books:
                logger.warning("No popular books found")
                return self._get_random_books(n)
            
            logger.info(f"Generated {len(books)} popular book recommendations")
            return books
            
        except Exception as e:
            logger.error(f"Error in _get_popular_books: {str(e)}")
            return self._get_random_books(n)

    def get_similar_books(self, book_id, n=10):
        """Get similar books based on content"""
        try:
            # Convert string book_id to ObjectId
            try:
                book_id = ObjectId(book_id)
            except Exception as e:
                logger.error(f"Invalid book_id format: {str(e)}")
                return self._get_random_books(n)
            
            # Get book from MongoDB
            book = self.books_collection.find_one(
                {'_id': book_id, 'status': 'active'},  # Only get active books
                {
                    'bookname': 1,
                    'author': 1,
                    'categories': 1,
                    'description': 1,
                    'type': 1,
                    'pushlisher': 1
                }
            )
            
            if not book:
                logger.warning(f"Book {book_id} not found")
                return self._get_random_books(n)
                
            # Get all active books
            books = list(self.books_collection.find(
                {'status': 'active'},  # Only get active books
                {
                    'bookname': 1,
                    'author': 1,
                    'categories': 1,
                    'description': 1,
                    'type': 1,
                    'pushlisher': 1,
                    'image': 1,
                    'ageLimit': 1
                }
            ))
            book_indices = {str(book['_id']): idx for idx, book in enumerate(books)}
            
            # Get book index
            book_idx = book_indices[str(book_id)]
            
            # Get similar books
            similar_indices = self.book_similarity[book_idx].argsort()[-n-1:-1][::-1]
            similar_books = [books[idx] for idx in similar_indices]
            
            return similar_books
            
        except Exception as e:
            logger.error(f"Error in get_similar_books: {str(e)}")
            return self._get_random_books(n) 