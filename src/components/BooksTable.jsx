import React, { useState, useEffect } from 'react';
import '../styles/BooksTable.css';
import apiClient from '../utils/api';
import { getBookPlaceholder, handleImageError } from '../utils/imagePlaceholder';
import { Search, X, Book, Edit, Trash2, Plus, Info } from 'lucide-react';

const BooksTable = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchQuery, books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/books');
      // Handle paginated response: response.data.data is the array
      const booksData = response.data.data || response.data.books || response.data || [];
      setBooks(Array.isArray(booksData) ? booksData : []);
      setFilteredBooks(Array.isArray(booksData) ? booksData : []);
    } catch (error) {
      console.error('Failed to fetch books:', error);
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    if (!searchQuery.trim()) {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.author_name && book.author_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (book.author?.name && book.author.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (book.category_name && book.category_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (book.category?.name && book.category.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (book.isbn && book.isbn.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredBooks(filtered);
    }
  };

  const handleRowClick = (book) => {
    setSelectedBook(book);
    setIsDetailOpen(true);
  };

  const handleAdd = () => {
    setSelectedBook(null);
    setIsModalOpen(true);
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    
    try {
      await apiClient.delete(`/admin/books/${bookId}`);
      setBooks(books.filter(book => book.id !== bookId));
    } catch (error) {
      console.error('Failed to delete book:', error);
      alert('Failed to delete book: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSave = async (bookData, coverFile) => {
    try {
      const formData = new FormData();
      
      // Append all book data (include empty strings for text fields, but exclude null/undefined)
      Object.keys(bookData).forEach(key => {
        if (bookData[key] !== null && bookData[key] !== undefined) {
          // Skip certain fields that shouldn't be sent
          if (key !== 'author' && key !== 'category' && key !== 'author_name' && key !== 'category_name') {
            formData.append(key, bookData[key]);
          }
        }
      });

      // Append cover file if provided (this will override cover_url)
      if (coverFile) {
        formData.append('cover_url', coverFile);
      }

      if (bookData.id) {
        // Update existing book - use POST with _method for Laravel
        formData.append('_method', 'PUT');
        await apiClient.post(`/admin/books/${bookData.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Create new book
        await apiClient.post('/admin/books', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      setIsModalOpen(false);
      // Refresh data from server to get updated information
      await fetchBooks();
    } catch (error) {
      console.error('Failed to save book:', error);
      let errorMessage = error.message;
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors).flat().join(', ');
      }
      
      alert('Failed to save book: ' + errorMessage);
    }
  };

  if (loading) return <div className="loading">Loading books...</div>;

  return (
    <div className="books-table-container">
      <div className="books-table-header">
        <h2><Book /> Manage Books</h2>
        <div className="header-actions">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search books by title, author, category, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <X 
                className="clear-icon" 
                onClick={() => setSearchQuery('')}
              />
            )}
          </div>
          <button className="btn-add" onClick={handleAdd}>
            <Plus /> Add Book
          </button>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      
      {searchQuery && (
        <div className="search-results-info">
          Found {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''}
        </div>
      )}
      
      <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cover</th>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>ISBN</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.length === 0 ? (
            <tr>
              <td colSpan="8" className="no-data">
                <Info /> {searchQuery ? 'No books found matching your search' : 'No books found'}
              </td>
            </tr>
          ) : (
            filteredBooks.map(book => (
              <tr key={book.id} onClick={() => handleRowClick(book)} className="clickable-row">
                <td>{book.id}</td>
                <td>
                  <img 
                    src={book.cover_url || getBookPlaceholder(40, 60)} 
                    alt={book.title}
                    className="book-cover-thumbnail"
                    onError={(e) => handleImageError(e, 40, 60)}
                  />
                </td>
                <td className="book-title-cell">
                  <strong>{book.title}</strong>
                </td>
                <td>{book.author_name || book.author?.name || 'N/A'}</td>
                <td>{book.category_name || book.category?.name || 'N/A'}</td>
                <td className="isbn-cell">{book.isbn || 'N/A'}</td>
                <td>
                  <span className={`stock-badge ${book.stock === 0 ? 'out-of-stock' : book.stock < 5 ? 'low-stock' : 'in-stock'}`}>
                    {book.stock}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="btn-edit" onClick={(e) => { e.stopPropagation(); handleEdit(book); }}>
                    <Edit /> Edit
                  </button>
                  <button className="btn-delete" onClick={(e) => { e.stopPropagation(); handleDelete(book.id); }}>
                    <Trash2 /> Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
      {isModalOpen && (
        <BookModal
          book={selectedBook}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
      
      {isDetailOpen && selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setIsDetailOpen(false)}
          onEdit={(book) => {
            setIsDetailOpen(false);
            handleEdit(book);
          }}
        />
      )}
    </div>
  );
};

const BookDetailModal = ({ book, onClose, onEdit }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><Info /> Book Details</h2>
          <button className="close-btn" onClick={onClose}><X /></button>
        </div>
        
        <div className="detail-content">
          <div className="book-detail-header">
            <img 
              src={book.cover_url || getBookPlaceholder(150, 225)} 
              alt={book.title}
              className="book-cover-large"
              onError={(e) => handleImageError(e, 150, 225)}
            />
            <div className="book-detail-info">
              <h3>{book.title}</h3>
              <p className="book-meta">
                <strong>Author:</strong> {book.author_name || book.author?.name || 'N/A'}
              </p>
              <p className="book-meta">
                <strong>Category:</strong> {book.category_name || book.category?.name || 'N/A'}
              </p>
              <p className="book-meta">
                <strong>Stock:</strong> <span className={`stock-badge ${book.stock === 0 ? 'out-of-stock' : book.stock < 5 ? 'low-stock' : 'in-stock'}`}>{book.stock}</span>
              </p>
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-row">
              <span className="detail-label">ID:</span>
              <span className="detail-value">#{book.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">ISBN:</span>
              <span className="detail-value">{book.isbn || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Publisher:</span>
              <span className="detail-value">{book.publisher || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Year:</span>
              <span className="detail-value">{book.year || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>Close</button>
          <button type="button" className="btn-edit" onClick={() => onEdit(book)}>
            <Edit /> Edit Book
          </button>
        </div>
      </div>
    </div>
  );
};

const BookModal = ({ book, onClose, onSave }) => {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState(
    book ? {
      ...book,
      author_id: book.author_id || book.author?.id || '',
      category_id: book.category_id || book.category?.id || '',
      year: book.year || '',
      stock: book.stock || 0,
      cover_url: book.cover_url || ''
    } : { 
      title: '', 
      author_id: '', 
      category_id: '', 
      isbn: '', 
      publisher: '', 
      year: '', 
      stock: 0,
      cover_url: ''
    }
  );
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(book?.cover_url || '');
  const [useUrl, setUseUrl] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchAuthorsAndCategories();
  }, []);

  const fetchAuthorsAndCategories = async () => {
    try {
      const [authorsRes, categoriesRes] = await Promise.all([
        apiClient.get('/admin/authors'),
        apiClient.get('/admin/categories')
      ]);
      setAuthors(authorsRes.data.data || authorsRes.data.authors || authorsRes.data || []);
      setCategories(categoriesRes.data.data || categoriesRes.data.categories || categoriesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch authors/categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      setFormData({ ...formData, cover_url: '' }); // Clear URL if file is selected
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, cover_url: url });
    setCoverPreview(url);
    setCoverFile(null); // Clear file if URL is entered
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || formData.title.length > 255) {
      alert('Title is required and must be less than 255 characters');
      return;
    }
    if (!formData.isbn || formData.isbn.length > 13) {
      alert('ISBN is required and must be less than 13 characters');
      return;
    }
    if (!formData.publisher || formData.publisher.length > 255) {
      alert('Publisher is required and must be less than 255 characters');
      return;
    }
    if (!formData.year || formData.year < 1000 || formData.year > currentYear) {
      alert(`Year is required and must be between 1000 and ${currentYear}`);
      return;
    }
    if (formData.stock < 0) {
      alert('Stock must be 0 or greater');
      return;
    }

    onSave(formData, coverFile);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content scrollable" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{book ? 'Edit Book' : 'Add New Book'}</h2>
          <button className="close-btn" onClick={onClose}><X /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              maxLength="255"
            />
          </div>
          
          <div className="form-group">
            <label>Author *</label>
            <select name="author_id" value={formData.author_id} onChange={handleChange} required>
              <option value="">Select Author</option>
              {authors.map(author => (
                <option key={author.id} value={author.id}>{author.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Category *</label>
            <select name="category_id" value={formData.category_id} onChange={handleChange} required>
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>ISBN *</label>
            <input 
              type="text" 
              name="isbn" 
              value={formData.isbn} 
              onChange={handleChange} 
              required 
              maxLength="13"
            />
          </div>
          
          <div className="form-group">
            <label>Publisher *</label>
            <input 
              type="text" 
              name="publisher" 
              value={formData.publisher} 
              onChange={handleChange} 
              required 
              maxLength="255"
            />
          </div>
          
          <div className="form-group">
            <label>Year *</label>
            <input 
              type="number" 
              name="year" 
              value={formData.year} 
              onChange={handleChange} 
              required 
              min="1000"
              max={currentYear}
            />
          </div>
          
          <div className="form-group">
            <label>Stock * (min 0)</label>
            <input 
              type="number" 
              name="stock" 
              value={formData.stock} 
              onChange={handleChange} 
              required 
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Cover Image</label>
            <div className="cover-input-toggle">
              <label>
                <input 
                  type="radio" 
                  checked={!useUrl} 
                  onChange={() => setUseUrl(false)}
                />
                Upload File
              </label>
              <label>
                <input 
                  type="radio" 
                  checked={useUrl} 
                  onChange={() => setUseUrl(true)}
                />
                Enter URL
              </label>
            </div>

            {!useUrl ? (
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
              />
            ) : (
              <input 
                type="url" 
                name="cover_url"
                placeholder="https://example.com/image.jpg"
                value={formData.cover_url || ''} 
                onChange={handleUrlChange}
              />
            )}

            {coverPreview && (
              <div className="cover-preview">
                <img src={coverPreview} alt="Cover preview" />
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">Save Book</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BooksTable;
