import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/pinjamBuku.css";
import apiClient from "../utils/api.js";
import { getBookPlaceholder, handleImageError } from "../utils/imagePlaceholder.js";
import { Book, Calendar, Info, CheckCircle } from "lucide-react";

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
      newDueDate.setDate(newDueDate.getDate() + 7); 
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
        <Book className="header-icon" />
        <h1 className="page-title">Loan Book</h1>
        <p className="page-subtitle">Complete the form below to borrow a book</p>
      </div>

      {error && (
        <div className="error-message">
          <Info /> {error}
        </div>
      )}

      <div className="pinjam-content">
        {/* Book Info Card */}
        <div className="book-info-card">
          <img 
            src={book.cover_url || book.cover || getBookPlaceholder(200, 300, 'No Cover')} 
            alt={book.title} 
            className="book-cover"
            onError={(e) => handleImageError(e, 200, 300, 'No Cover')}
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
            <Calendar /> <h3>Loan Information</h3>
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
              <label>Tanggal Pengajuan <span className="required">*</span></label>
              <input 
                type="date" 
                value={loanDate} 
                onChange={handleLoanDateChange} 
                min={new Date().toISOString().split('T')[0]}
                required 
              />
            </div>

            <div className="form-group">
              <label>Deadline Pengembalian (7 Hari)</label>
              <input 
                type="date" 
                value={dueDate} 
                readOnly 
                className="readonly-input"
              />
            </div>
          </div>

          <div className="loan-info-box">
            <Info className="info-icon" />
            <div>
              <h3>Loan Policy</h3>
              <ul>
                <li><CheckCircle /> Lama pinjam: <strong>7 hari</strong></li>
                <li><CheckCircle /> Denda keterlambatan: <strong>Rp2.000 per hari</strong></li>
                <li><CheckCircle /> Harap kembalikan buku tepat waktu untuk menghindari denda</li>
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
