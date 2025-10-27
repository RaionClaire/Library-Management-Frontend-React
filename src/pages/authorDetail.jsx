import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/authorDetail.css";
import { ArrowLeft, Book } from "lucide-react";
import apiClient from "../utils/api.js";

const AuthorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAuthorDetails();
    fetchAuthorBooks();
  }, [id]);

  const fetchAuthorDetails = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/authors/${id}`);
      setAuthor(response.data);
    } catch (error) {
      console.error("Failed to fetch author details:", error);
      setAuthor(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthorBooks = async () => {
    try {
      const response = await apiClient.get(`/authors/${id}/books`);
      // API returns { author: {...}, books: [...] }
      setBooks(response.data.books || []);
    } catch (error) {
      console.error("Failed to fetch author books:", error);
      setBooks([]);
    }
  };

  const handleBookClick = (bookId) => {
    navigate(`/detailBuku`, { state: { bookId } });
  };

  const handleBorrowClick = (book) => {
    navigate(`/pinjamBuku/${book.id}`, { state: { book } });
  };

  if (loading) {
    return (
      <div className="author-detail-container">
        <p className="loading">Loading author details...</p>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="author-detail-container">
        <p className="error">Author not found</p>
      </div>
    );
  }

  return (
    <div className="author-detail-container">
      <button type="button" className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft /> Back
      </button>

      {/* Author Header */}
      <div className="author-header">
        <div className="author-avatar-large">
          <img 
            src={author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&size=200&background=4CAF50&color=fff`} 
            alt={author.name}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&size=200&background=4CAF50&color=fff`;
            }}
          />
        </div>
        <div className="author-info-detail">
          <h1 className="author-name-large">{author.name}</h1>
          <p className="author-bio-detail">{author.biography || author.bio || "No biography available"}</p>
          <div className="author-stats-detail">
            <div className="stat-item">
              <Book className="stat-icon" />
              <span>{author.books_count || author.booksCount || books.length} Books Published</span>
            </div>
          </div>
        </div>
      </div>

      {/* Books by Author */}
      <div className="author-books-section">
        <h2 className="section-title">Books by {author.name}</h2>
        <div className="books-grid">
          {books && books.length > 0 ? (
            books.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-cover-wrapper" onClick={() => handleBookClick(book.id)}>
                  <img 
                    src={book.cover_url || book.cover || "https://via.placeholder.com/150x200?text=No+Cover"} 
                    alt={book.title} 
                    className="book-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150x200?text=No+Cover";
                    }}
                  />
                  <div className="book-overlay">
                    <span>View Details</span>
                  </div>
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-category">{book.category?.name || book.category || "Uncategorized"}</p>
                  <p className="book-stock">Stock: <strong>{book.stock}</strong></p>
                  <button
                    type="button"
                    className="borrow-btn"
                    onClick={() => handleBorrowClick(book)}
                    disabled={book.stock === 0}
                  >
                    {book.stock === 0 ? "Out of Stock" : "Borrow Book"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-books">No books available for this author</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorDetail;
