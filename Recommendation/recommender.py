import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse import csr_matrix
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import gensim
from gensim import corpora, models
import random
import requests
from bs4 import BeautifulSoup
import re
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import io
import pickle
import json
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor, as_completed
from functools import lru_cache
import time
import underthesea  # Thư viện xử lý tiếng Việt

# Load environment variables
load_dotenv()

class HybridRecommender:
    def __init__(self, min_ratings_threshold=5, max_workers=10):
        """
        Initialize the hybrid recommender system
        min_ratings_threshold: minimum number of ratings a user needs to be considered for CF
        max_workers: maximum number of threads for parallel file downloading
        """
        self.min_ratings_threshold = min_ratings_threshold
        self.max_workers = max_workers
        self.user_item_matrix = None
        self.item_features = None
        self.user_features = None
        self.item_similarity_matrix = None
        self.user_similarity_matrix = None
        self.items_df = None  # Initialize items_df attribute
        # Sử dụng TfidfVectorizer với tokenizer tiếng Việt
        self.tfidf_vectorizer = TfidfVectorizer(
            tokenizer=self.vietnamese_tokenize,
            stop_words=self.get_vietnamese_stopwords()
        )
        self.all_items = None
        self.chapter_contents = {}
        self.drive_service = None
        
        # Download required NLTK data
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt')
        try:
            nltk.data.find('corpora/stopwords')
        except LookupError:
            nltk.download('stopwords')

    def get_drive_service(self):
        """Initialize Google Drive API service using service account"""
        try:
            # Get service account credentials from environment variables
            credentials_dict = {
                "type": "service_account",
                "project_id": os.getenv('GOOGLE_PROJECT_ID'),
                "private_key": os.getenv('GOOGLE_PRIVATE_KEY').replace('\\n', '\n'),
                "client_email": os.getenv('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{os.getenv('GOOGLE_SERVICE_ACCOUNT_EMAIL')}",
                "universe_domain": "googleapis.com"
            }
            
            # Create credentials from service account info
            credentials = service_account.Credentials.from_service_account_info(
                credentials_dict,
                scopes=['https://www.googleapis.com/auth/drive.readonly']
            )
            
            # Build and return the Drive service
            return build('drive', 'v3', credentials=credentials)
        except Exception as e:
            print(f"Error initializing Drive service: {str(e)}")
            return None

    @lru_cache(maxsize=1000)
    def extract_file_id(self, viewlink):
        """Extract file ID from Google Drive viewlink with caching"""
        try:
            # Try to extract from standard view link
            pattern = r'/d/([a-zA-Z0-9_-]+)'
            match = re.search(pattern, viewlink)
            if match:
                return match.group(1)
            
            # Try to extract from direct link
            pattern = r'id=([a-zA-Z0-9_-]+)'
            match = re.search(pattern, viewlink)
            if match:
                return match.group(1)
            
            return None
        except Exception as e:
            print(f"Error extracting file ID: {str(e)}")
            return None

    def get_vietnamese_stopwords(self):
        """Get Vietnamese stopwords"""
        # Danh sách stopwords tiếng Việt cơ bản
        stopwords = {
            'và', 'là', 'của', 'trong', 'để', 'với', 'có', 'không', 'tôi', 'bạn',
            'này', 'đó', 'đây', 'kia', 'nọ', 'mà', 'thì', 'là', 'một', 'những',
            'các', 'đã', 'đang', 'sẽ', 'được', 'cho', 'từ', 'về', 'nên', 'vì',
            'nếu', 'khi', 'nhưng', 'hoặc', 'và', 'cũng', 'rất', 'quá', 'đều',
            'chỉ', 'còn', 'đến', 'nhiều', 'ít', 'mỗi', 'mọi', 'mấy', 'vài',
            'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười'
        }
        return stopwords

    def vietnamese_tokenize(self, text):
        """Tokenize Vietnamese text using underthesea"""
        if not isinstance(text, str):
            return []
        # Sử dụng underthesea để tách từ tiếng Việt
        words = underthesea.word_tokenize(text, format="text").split()
        # Lọc stopwords
        stop_words = self.get_vietnamese_stopwords()
        return [word.lower() for word in words if word.lower() not in stop_words]

    def preprocess_text(self, text):
        """Preprocess Vietnamese text data for content-based filtering"""
        if not isinstance(text, str):
            return ""
        # Tokenize và loại bỏ stopwords tiếng Việt
        tokens = self.vietnamese_tokenize(text)
        return ' '.join(tokens)

    def fetch_single_chapter(self, viewlink):
        """Fetch content from a single chapter"""
        try:
            file_id = self.extract_file_id(viewlink)
            if not file_id:
                print(f"Could not extract file ID from link: {viewlink}")
                return viewlink, ""

            # Convert to direct download link
            download_link = f"https://drive.google.com/uc?export=download&id={file_id}"
            
            # Download content with timeout
            response = requests.get(download_link, timeout=10)
            if response.status_code == 200:
                # Decode với UTF-8 để hỗ trợ tiếng Việt
                content = response.content.decode('utf-8')
                print(f"Successfully downloaded content from file ID: {file_id}")
                return viewlink, content
            else:
                print(f"Failed to download content. Status code: {response.status_code}")
                return viewlink, ""
                
        except Exception as e:
            print(f"Error fetching chapter content: {str(e)}")
            return viewlink, ""

    def fetch_chapter_content(self, viewlink):
        """Fetch and process chapter content from public Google Drive link with caching"""
        # Check cache first
        if viewlink in self.chapter_contents:
            return self.chapter_contents[viewlink]
        
        # Fetch content if not in cache
        _, content = self.fetch_single_chapter(viewlink)
        self.chapter_contents[viewlink] = content
        return content

    def fetch_multiple_chapters(self, viewlinks):
        """Fetch multiple chapters in parallel"""
        start_time = time.time()
        results = {}
        
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # Submit all tasks
            future_to_link = {
                executor.submit(self.fetch_single_chapter, link): link 
                for link in viewlinks
            }
            
            # Process completed tasks
            for future in as_completed(future_to_link):
                link, content = future.result()
                results[link] = content
                # Update cache
                self.chapter_contents[link] = content
        
        end_time = time.time()
        print(f"Downloaded {len(results)} chapters in {end_time - start_time:.2f} seconds")
        return results

    def fit(self, ratings_df, items_df, chapters_df=None):
        """
        Fit the recommender system with user ratings and item data
        ratings_df: DataFrame with columns [user_id, item_id, rating]
        items_df: DataFrame with item features (title, description, etc.)
        chapters_df: DataFrame with chapter information
        """
        # Store all items for random recommendations
        self.all_items = items_df['item_id'].tolist()
        
        # Store items_df for later use
        self.items_df = items_df.copy()  # Make a copy to avoid modifying the original
        
        # Create user-item matrix for collaborative filtering
        self.user_item_matrix = ratings_df.pivot(
            index='user_id', 
            columns='item_id', 
            values='rating'
        ).fillna(0)
        
        # Calculate user and item similarity matrices
        self.item_similarity_matrix = cosine_similarity(self.user_item_matrix.T)
        self.user_similarity_matrix = cosine_similarity(self.user_item_matrix)
        
        # Prepare content-based features
        if 'description' in items_df.columns:
            # Combine description with chapter content if available
            if chapters_df is not None:
                # Group chapters by book ID
                book_chapters = chapters_df.groupby('bookId')['viewlink'].agg(list).to_dict()
                
                # Fetch all chapter contents in parallel
                all_viewlinks = [link for links in book_chapters.values() for link in links]
                chapter_contents = self.fetch_multiple_chapters(all_viewlinks)
                
                # Combine content for each book
                for _, row in items_df.iterrows():
                    item_id = row['item_id']
                    if item_id in book_chapters:
                        chapter_links = book_chapters[item_id]
                        chapter_texts = [chapter_contents.get(link, "") for link in chapter_links]
                        combined_content = " ".join([row['description']] + chapter_texts)
                        self.items_df.loc[self.items_df['item_id'] == item_id, 'description'] = combined_content
            
            processed_descriptions = self.items_df['description'].apply(self.preprocess_text)
            self.item_features = self.tfidf_vectorizer.fit_transform(processed_descriptions)
        
        # Store item metadata
        self.items_df = items_df

    def get_user_rating_count(self, user_id):
        """Get the number of ratings for a user"""
        if user_id in self.user_item_matrix.index:
            return (self.user_item_matrix.loc[user_id] > 0).sum()
        return 0

    def get_random_recommendations(self, n_recommendations=5):
        """Get random recommendations for new users"""
        return random.sample(self.all_items, min(n_recommendations, len(self.all_items)))

    def calculate_hybrid_weights(self, user_id):
        """Calculate weights for hybrid recommendation based on user history"""
        rating_count = self.get_user_rating_count(user_id)
        
        if rating_count == 0:
            return 0.0, 1.0  # Full weight to CBF for new users
        
        # Adjust weights based on rating count
        cf_weight = min(rating_count / self.min_ratings_threshold, 1.0)
        cbf_weight = 1.0 - cf_weight
        
        return cf_weight, cbf_weight

    def collaborative_filtering_recommendations(self, user_id, n_recommendations=5):
        """Get recommendations using collaborative filtering"""
        if user_id not in self.user_item_matrix.index:
            return []
        
        user_idx = self.user_item_matrix.index.get_loc(user_id)
        user_ratings = self.user_item_matrix.iloc[user_idx]
        
        # Get items the user hasn't rated
        unrated_items = user_ratings[user_ratings == 0].index
        
        # Calculate predicted ratings
        user_similarities = self.user_similarity_matrix[user_idx]
        predicted_ratings = []
        
        for item_id in unrated_items:
            item_idx = self.user_item_matrix.columns.get_loc(item_id)
            # Get ratings for this item from similar users
            item_ratings = self.user_item_matrix.iloc[:, item_idx]
            # Calculate weighted average rating
            valid_ratings = item_ratings[item_ratings > 0]
            if len(valid_ratings) > 0:
                weighted_sum = np.sum(user_similarities * item_ratings)
                similarity_sum = np.sum(np.abs(user_similarities[item_ratings > 0]))
                if similarity_sum > 0:
                    predicted_rating = weighted_sum / similarity_sum
                    predicted_ratings.append((item_id, predicted_rating))
        
        # Sort by predicted rating and return top N
        predicted_ratings.sort(key=lambda x: x[1], reverse=True)
        return [item_id for item_id, _ in predicted_ratings[:n_recommendations]]

    def content_based_recommendations(self, user_id, n_recommendations=5):
        """Get content-based recommendations for a user"""
        if self.item_features is None:
            return self.get_random_recommendations(n_recommendations)
        
        # Get items the user has rated highly
        user_ratings = self.user_item_matrix.loc[user_id]
        liked_items = user_ratings[user_ratings > 0].index.tolist()
        
        if not liked_items:
            return self.get_random_recommendations(n_recommendations)
        
        # Get content features for liked items
        liked_item_indices = self.items_df[self.items_df['item_id'].isin(liked_items)].index
        if len(liked_item_indices) == 0:
            return self.get_random_recommendations(n_recommendations)
            
        liked_features = self.item_features[liked_item_indices]
        
        # Get items the user hasn't rated
        unrated_items = self.user_item_matrix.columns[self.user_item_matrix.loc[user_id] == 0].tolist()
        unrated_indices = self.items_df[self.items_df['item_id'].isin(unrated_items)].index
        
        if len(unrated_indices) == 0:
            return self.get_random_recommendations(n_recommendations)
        
        # Calculate similarity between liked items and unrated items
        unrated_features = self.item_features[unrated_indices]
        similarities = cosine_similarity(liked_features.mean(axis=0).reshape(1, -1), unrated_features)
        
        # Get top recommendations
        top_indices = similarities.argsort()[0][-n_recommendations:][::-1]
        return self.items_df.iloc[unrated_indices[top_indices]]['item_id'].tolist()

    def recommend(self, user_id, n_recommendations=5):
        """
        Get hybrid recommendations for a user
        Uses CF for users with many ratings, CBF for new users
        """
        # Check if user exists in the system
        if user_id not in self.user_item_matrix.index:
            return self.get_random_recommendations(n_recommendations)
        
        # Calculate hybrid weights
        cf_weight, cbf_weight = self.calculate_hybrid_weights(user_id)
        
        if cf_weight == 0:
            # New user or no ratings - use CBF
            return self.content_based_recommendations(user_id, n_recommendations)
        
        # Get recommendations from both methods
        cf_recommendations = self.collaborative_filtering_recommendations(user_id, n_recommendations)
        cbf_recommendations = self.content_based_recommendations(user_id, n_recommendations)
        
        # Combine recommendations based on weights
        combined_recommendations = []
        cf_count = int(n_recommendations * cf_weight)
        cbf_count = n_recommendations - cf_count
        
        # Add CF recommendations
        combined_recommendations.extend(cf_recommendations[:cf_count])
        
        # Add CBF recommendations
        for rec in cbf_recommendations:
            if rec not in combined_recommendations and len(combined_recommendations) < n_recommendations:
                combined_recommendations.append(rec)
        
        return combined_recommendations 