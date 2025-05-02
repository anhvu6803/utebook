import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import csr_matrix
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

class BookRecommender:
    def __init__(self):
        # Load data
        self.books_df = pd.read_csv('data/books.csv')
        self.ratings_df = pd.read_csv('data/ratings.csv')
        
        # Prepare data for collaborative filtering
        self.user_book_matrix = self._create_user_book_matrix()
        
        # Prepare data for content-based filtering
        self.tfidf_matrix = self._create_tfidf_matrix()
        
    def _create_user_book_matrix(self):
        """Create user-book rating matrix for collaborative filtering"""
        # Create pivot table
        user_book_matrix = self.ratings_df.pivot(
            index='user_id',
            columns='book_id',
            values='rating'
        ).fillna(0)
        
        # Convert to sparse matrix
        return csr_matrix(user_book_matrix.values)
    
    def _create_tfidf_matrix(self):
        """Create TF-IDF matrix for content-based filtering"""
        # Combine book features
        self.books_df['content'] = self.books_df['title'] + ' ' + self.books_df['author'] + ' ' + self.books_df['description']
        
        # Create TF-IDF matrix
        tfidf = TfidfVectorizer(stop_words='english')
        return tfidf.fit_transform(self.books_df['content'])
    
    def get_recommendations(self, user_id, n=10):
        """Get book recommendations for a user using collaborative filtering"""
        try:
            # Get user's ratings
            user_ratings = self.ratings_df[self.ratings_df['user_id'] == user_id]
            
            if user_ratings.empty:
                # If user has no ratings, return popular books
                return self._get_popular_books(n)
            
            # Calculate user similarity
            user_similarity = cosine_similarity(self.user_book_matrix)
            
            # Get similar users
            user_idx = self.ratings_df['user_id'].unique().tolist().index(user_id)
            similar_users = user_similarity[user_idx]
            
            # Get top similar users
            similar_users_idx = np.argsort(similar_users)[-n-1:-1]
            
            # Get books rated by similar users
            similar_users_books = self.ratings_df[
                self.ratings_df['user_id'].isin(similar_users_idx)
            ]
            
            # Get top rated books
            top_books = similar_users_books.groupby('book_id')['rating'].mean().sort_values(ascending=False)
            
            # Filter out books user has already rated
            user_rated_books = user_ratings['book_id'].tolist()
            top_books = top_books[~top_books.index.isin(user_rated_books)]
            
            # Get book details
            recommendations = self.books_df[
                self.books_df['book_id'].isin(top_books.index[:n])
            ].to_dict('records')
            
            return recommendations
            
        except Exception as e:
            print(f"Error in get_recommendations: {str(e)}")
            return self._get_popular_books(n)
    
    def get_similar_books(self, book_id, n=10):
        """Get similar books using content-based filtering"""
        try:
            # Get book index
            book_idx = self.books_df[self.books_df['book_id'] == book_id].index[0]
            
            # Calculate cosine similarity
            cosine_sim = linear_kernel(self.tfidf_matrix[book_idx:book_idx+1], self.tfidf_matrix).flatten()
            
            # Get similar books
            similar_books_idx = np.argsort(cosine_sim)[-n-1:-1]
            
            # Get book details
            similar_books = self.books_df.iloc[similar_books_idx].to_dict('records')
            
            return similar_books
            
        except Exception as e:
            print(f"Error in get_similar_books: {str(e)}")
            return self._get_popular_books(n)
    
    def _get_popular_books(self, n=10):
        """Get popular books based on average rating and number of ratings"""
        # Calculate book popularity
        book_popularity = self.ratings_df.groupby('book_id').agg({
            'rating': ['mean', 'count']
        }).reset_index()
        
        book_popularity.columns = ['book_id', 'avg_rating', 'rating_count']
        
        # Sort by rating count and average rating
        popular_books = book_popularity.sort_values(
            ['rating_count', 'avg_rating'],
            ascending=[False, False]
        )
        
        # Get book details
        recommendations = self.books_df[
            self.books_df['book_id'].isin(popular_books['book_id'][:n])
        ].to_dict('records')
        
        return recommendations 