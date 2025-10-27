import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/pinjamBuku.css";
import apiClient from "../utils/api.js";
import { FaBook, FaCalendar, FaInfoCircle, FaCheckCircle } from "react-icons/fa";

const mockBook = {
  id: 1,
  title: 'Hujan',
  author: 'Tere Liye',
  cover: 'https://via.placeholder.com/200x300?text=Hujan',
  stock: 5,
};

export default function PinjamBuku() {
  const [book, setBook] = useState(null);
  const [loanDate, setLoanDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      // Use book from navigation state or fetch from API
      const bookFromState = location.state?.book;
      
      if (bookFromState) {
        setBook(bookFromState);
      } else if (id) {
        const response = await apiClient.get(`/books/${id}`);
        setBook(response.data);
      }
      
      // Set default loan date to today
      const today = new Date().toISOString().split('T')[0];
      setLoanDate(today);
      handleLoanDateChange({ target: { value: today } });
    } catch (error) {
      console.error("Failed to fetch book details:", error);
      setError("Failed to load book details");
    }
  };

  const handleLoanDateChange = (e) => {
    const date = e.target.value;
    setLoanDate(date);
    if (date) {
      const newDueDate = new Date(date);
      newDueDate.setDate(newDueDate.getDate() + 14); // 2 weeks loan period
      setDueDate(newDueDate.toISOString().split('T')[0]);
    } else {
      setDueDate("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // API call to create loan
      const response = await apiClient.post("/member/loans", {
        book_id: book.id,
        loaned_at: loanDate,
        due_at: dueDate,
      });
      
      alert(`Book "${book.title}" loaned successfully!\nDue date: ${dueDate}`);
      navigate("/peminjaman");
    } catch (error) {
      console.error("Failed to create loan:", error);
      setError(error.response?.data?.message || "Failed to create loan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!book) {
    return <div className="pinjam-container"><p className="loading">Loading...</p></div>;
  }

  return (
    <div className="pinjam-container">
      <div className="page-header">
        <FaBook className="header-icon" />
        <h1 className="page-title">Loan Book</h1>
        <p className="page-subtitle">Complete the form below to borrow a book</p>
      </div>

      {error && (
        <div className="error-message">
          <FaInfoCircle /> {error}
        </div>
      )}

      <div className="pinjam-content">
        {/* Book Info Card */}
        <div className="book-info-card">
          <img 
            src={book.cover_url || book.cover || 'https://via.placeholder.com/200x300?text=No+Cover'} 
            alt={book.title} 
            className="book-cover"
            onError={(e) => e.target.src = 'https://via.placeholder.com/200x300?text=No+Cover'}
          />
          <div className="book-details">
            <h2>{book.title}</h2>
            <p className="book-author">by {book.author?.name || book.author || 'Unknown'}</p>
            <div className="book-meta">
              <span className="meta-item">
                <strong>Category:</strong> {book.category?.name || book.category || 'N/A'}
              </span>
              <span className="meta-item">
                <strong>Publisher:</strong> {book.publisher || 'N/A'}
              </span>
              <span className="meta-item">
                <strong>ISBN:</strong> {book.isbn || 'N/A'}
              </span>
            </div>
            <p className="book-stock">
              Available Stock: <strong className={book.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                {book.stock || 'N/A'}
              </strong>
            </p>
          </div>
        </div>

        {/* Loan Form */}
        <form className="pinjam-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <FaCalendar /> <h3>Loan Information</h3>
          </div>
          
          <div className="form-group">
            <label>Book Title <span className="required">*</span></label>
            <input 
              type="text" 
              value={`${book.title} by ${book.author?.name || book.author || 'Unknown'}`} 
              readOnly 
              className="readonly-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Loan Date <span className="required">*</span></label>
              <input 
                type="date" 
                value={loanDate} 
                onChange={handleLoanDateChange} 
                min={new Date().toISOString().split('T')[0]}
                required 
              />
            </div>

            <div className="form-group">
              <label>Due Date (14 days)</label>
              <input 
                type="date" 
                value={dueDate} 
                readOnly 
                className="readonly-input"
              />
            </div>
          </div>

          <div className="loan-info-box">
            <FaInfoCircle className="info-icon" />
            <div>
              <h3>Loan Policy</h3>
              <ul>
                <li><FaCheckCircle /> Loan period: <strong>14 days</strong></li>
                <li><FaCheckCircle /> Late return fine: <strong>Rp 1,000 per day</strong></li>
                <li><FaCheckCircle /> Maximum extensions: <strong>1 time (7 days)</strong></li>
                <li><FaCheckCircle /> Please return the book on time to avoid fines</li>
              </ul>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading || !loanDate || !book.stock || book.stock === 0}
            >
              {loading ? "Processing..." : "Confirm Loan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
