import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import apiClient from "../utils/api.js";
import { getBookPlaceholder, handleImageError } from "../utils/imagePlaceholder.js";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [keyword, category]);

  const fetchBooks = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get("/books");
      const booksData = response.data.data || response.data.books || response.data || [];
      setBooks(booksData);
      setAllBooks(booksData);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      setError("Failed to fetch books.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get("/categories");
      const categoriesData = response.data.data || response.data.categories || response.data || [];
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const filterBooks = () => {
    let filteredBooks = [...allBooks];
    
    if (keyword) {
      filteredBooks = filteredBooks.filter(book =>
        book.title?.toLowerCase().includes(keyword.toLowerCase()) ||
        book.author?.name?.toLowerCase().includes(keyword.toLowerCase()) ||
        book.author_name?.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    
    if (category) {
      filteredBooks = filteredBooks.filter(book => 
        book.category_id === parseInt(category) ||
        book.category?.id === parseInt(category)
      );
    }

    setBooks(filteredBooks);
  };

  const handleBookClick = (bookId) => {
    navigate(`/detailBuku`, { state: { bookId } });
  };

  const handleBorrowClick = (book) => {
    navigate(`/pinjamBuku/${book.id}`, { state: { book } });
  };

  return (
    <div className="home-container">
      <h1 className="page-title">Browse Books</h1>

      <div className="search-filter-row">
        <input
          type="text"
          placeholder="Search books by title or author..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="search-input"
        />

        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <button
          type="button"
          className="clear-filters-btn"
          onClick={() => {
            setKeyword("");
            setCategory("");
          }}
        >
          Clear Filters
        </button>
      </div>

      <div className="books-container">
        {loading ? (
          <p className="loading">Loading books...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : books.length === 0 ? (
          <p className="no-data">No books found</p>
        ) : (
          books.map((book) => (
            <div className="book-card" key={book.id}>
              <div className="book-cover" onClick={() => handleBookClick(book.id)}>
                <img 
                  src={book.cover_url || getBookPlaceholder(150, 200, 'No Cover')} 
                  alt={book.title}
                  onError={(e) => handleImageError(e, 150, 200, 'No Cover')}
                />
              </div>
              <div className="book-card-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author?.name || book.author_name || 'Unknown'}</p>
                <p className="book-category">{book.category?.name || book.category_name || 'N/A'}</p>
                <p className="book-stock">Stock: <strong>{book.stock || 0}</strong></p>
                <button
                  type="button"
                  className="borrow-btn-card"
                  onClick={() => handleBorrowClick(book)}
                  disabled={!book.stock || book.stock === 0}
                >
                  {book.stock > 0 ? 'Borrow' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}