import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/categoryDetail.css";
import { FaArrowLeft, FaBook } from "react-icons/fa";
import apiClient from "../utils/api.js";

// Category icon/color mapping
const categoryStyles = {
  "Fantasy": { icon: "🧙‍♂️", color: "#667eea" },
  "Romance": { icon: "💖", color: "#ec4899" },
  "Classic": { icon: "📚", color: "#8b5cf6" },
  "Science Fiction": { icon: "🚀", color: "#3b82f6" },
  "Mystery": { icon: "🔍", color: "#f59e0b" },
  "Biography": { icon: "👤", color: "#10b981" },
  "History": { icon: "🏛️", color: "#ef4444" },
  "Self-Help": { icon: "💡", color: "#f97316" },
  "default": { icon: "📖", color: "#6b7280" }
};

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategoryDetails();
    fetchCategoryBooks();
  }, [id]);

  const fetchCategoryDetails = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/categories/${id}`);
      const categoryData = response.data;
      const style = categoryStyles[categoryData.name] || categoryStyles.default;
      setCategory({
        ...categoryData,
        icon: style.icon,
        color: style.color
      });
    } catch (error) {
      console.error("Failed to fetch category details:", error);
      setCategory(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryBooks = async () => {
    try {
      const response = await apiClient.get(`/categories/${id}/books`);
      // API might return { category: {...}, books: [...] } or just books array
      setBooks(response.data.books || response.data || []);
    } catch (error) {
      console.error("Failed to fetch category books:", error);
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
      <div className="category-detail-container">
        <p className="loading">Loading category details...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="category-detail-container">
        <p className="error">Category not found</p>
      </div>
    );
  }

  return (
    <div className="category-detail-container">
      <button type="button" className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      {/* Category Header */}
      <div className="category-header" style={{ background: `linear-gradient(135deg, ${category.color}15 0%, ${category.color}05 100%)` }}>
        <div className="category-icon-large" style={{ background: `${category.color}25` }}>
          <span className="icon-emoji-large">{category.icon}</span>
        </div>
        <div className="category-info-detail">
          <h1 className="category-name-large" style={{ color: category.color }}>{category.name}</h1>
          <p className="category-description-detail">{category.description || "Explore books in this category"}</p>
          <div className="category-stats-detail">
            <div className="stat-item" style={{ background: `${category.color}15`, color: category.color }}>
              <FaBook className="stat-icon" />
              <span>{category.books_count || category.booksCount || books.length} Books Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Books in Category */}
      <div className="category-books-section">
        <h2 className="section-title">Books in {category.name}</h2>
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
                  <p className="book-author">by {book.author?.name || book.author || "Unknown"}</p>
                  <p className="book-stock">Stock: <strong>{book.stock}</strong></p>
                  <button
                    type="button"
                    className="borrow-btn"
                    onClick={() => handleBorrowClick(book)}
                    style={{ background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)` }}
                    disabled={book.stock === 0}
                  >
                    {book.stock === 0 ? "Out of Stock" : "Borrow Book"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-books">No books available in this category</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
