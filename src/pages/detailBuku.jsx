import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../styles/detailBuku.css";
import apiClient from "../utils/api.js";
import { getBookPlaceholder, handleImageError } from "../utils/imagePlaceholder.js";

const DetailBuku = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookDetail();
  }, [id, location.state]);

  const fetchBookDetail = async () => {
    setLoading(true);
    setError("");

    try {
      // Get book ID from URL params or location state
      const bookId = id || location.state?.bookId;
      
      if (!bookId) {
        setError("Book ID not found");
        setLoading(false);
        return;
      }

      const response = await apiClient.get(`/books/${bookId}`);
      const bookData = response.data.book || response.data.data || response.data;
      setBook(bookData);
    } catch (error) {
      console.error("Failed to fetch book details:", error);
      setError("Failed to load book details.");
    } finally {
      setLoading(false);
    }
  };

  const handlePinjamClick = () => {
    navigate(`/pinjamBuku/${book.id}`, { state: { book } });
  };

  if (loading) {
    return <div className="loading">Loading book details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!book) {
    return <div className="error-message">Book not found</div>;
  }

  return (
    <div className="detailbuku-container">
      <div className="detailbuku-header">
        <p className="back-text" onClick={() => navigate(-1)}>&larr; Back</p>
        <h2>Detail Buku</h2>
      </div>

      <div className="detailbuku-content">
        <img 
          src={book.cover_url || getBookPlaceholder(200, 300, 'No Cover')} 
          alt={book.title} 
          className="cover-buku"
          onError={(e) => handleImageError(e, 200, 300, 'No Cover')}
        />
        <h3 className="judul-buku">{book.title}</h3>
        <p className="penulis">{book.author?.name || book.author_name || 'Unknown Author'}</p>

        <div className="detail-card">
          <p>
            <strong>Judul Buku dan Penulis</strong>
            <br />
            {book.title} – {book.author?.name || book.author_name || 'Unknown Author'}
          </p>
          <p>
            <strong>Penerbit</strong>
            <br />
            {book.publisher || 'N/A'}
          </p>
          <p>
            <strong>Kategori</strong>
            <br />
            {book.category?.name || book.category_name || 'N/A'}
          </p>
          <p>
            <strong>Tahun Terbit</strong>
            <br />
            {book.year || 'N/A'}
          </p>
          <p>
            <strong>ISBN</strong>
            <br />
            {book.isbn || 'N/A'}
          </p>
          <p>
            <strong>Stok Buku</strong>
            <br />
            <span className="stok tersedia">Tersedia: {book.stock || 0}</span>
          </p>
        </div>

        <button 
          className="btn-pinjam" 
          onClick={handlePinjamClick}
          disabled={!book.stock || book.stock === 0}
        >
          {book.stock > 0 ? 'Pinjam Buku' : 'Stok Habis'}
        </button>
      </div>
    </div>
  );
};

export default DetailBuku;
