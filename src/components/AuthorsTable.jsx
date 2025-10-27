import React, { useState, useEffect } from 'react';
import '../styles/AuthorsTable.css';
import apiClient from '../utils/api';
import { FaSearch, FaTimes, FaBook, FaEdit, FaTrash, FaPlus, FaInfoCircle } from 'react-icons/fa';

const AuthorsTable = () => {
  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAuthors();
  }, []);

  useEffect(() => {
    filterAuthors();
  }, [searchQuery, authors]);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/authors');
      setAuthors(response.data.authors || response.data || []);
      setFilteredAuthors(response.data.authors || response.data || []);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
      setError('Failed to load authors');
    } finally {
      setLoading(false);
    }
  };

  const filterAuthors = () => {
    if (!searchQuery.trim()) {
      setFilteredAuthors(authors);
    } else {
      const filtered = authors.filter(author =>
        author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (author.biography && author.biography.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredAuthors(filtered);
    }
  };

  const handleRowClick = (author) => {
    setSelectedAuthor(author);
    setIsDetailOpen(true);
  };

  const handleAdd = () => {
    setSelectedAuthor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (author) => {
    setSelectedAuthor(author);
    setIsModalOpen(true);
  };

  const handleDelete = async (authorId) => {
    if (!window.confirm('Are you sure you want to delete this author?')) return;
    
    try {
      await apiClient.delete(`/admin/authors/${authorId}`);
      setAuthors(authors.filter(author => author.id !== authorId));
    } catch (error) {
      console.error('Failed to delete author:', error);
      alert('Failed to delete author: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSave = async (author) => {
    try {
      if (author.id) {
        const response = await apiClient.put(`/admin/authors/${author.id}`, author);
        setAuthors(authors.map(a => a.id === author.id ? (response.data.author || response.data) : a));
      } else {
        const response = await apiClient.post('/admin/authors', author);
        setAuthors([...authors, response.data.author || response.data]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save author:', error);
      alert('Failed to save author: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="loading">Loading authors...</div>;

  return (
    <div className="authors-table-container">
      <div className="authors-table-header">
        <h2><FaBook /> Manage Authors</h2>
        <div className="header-actions">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search authors by name or biography..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <FaTimes 
                className="clear-icon" 
                onClick={() => setSearchQuery('')}
              />
            )}
          </div>
          <button className="btn-add" onClick={handleAdd}>
            <FaPlus /> Add Author
          </button>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      
      {searchQuery && (
        <div className="search-results-info">
          Found {filteredAuthors.length} author{filteredAuthors.length !== 1 ? 's' : ''}
        </div>
      )}
      
      <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Biography</th>
            <th>Books Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAuthors.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">
                <FaInfoCircle /> {searchQuery ? 'No authors found matching your search' : 'No authors found'}
              </td>
            </tr>
          ) : (
            filteredAuthors.map(author => (
              <tr key={author.id} onClick={() => handleRowClick(author)} className="clickable-row">
                <td>{author.id}</td>
                <td className="author-name-cell">
                  <strong>{author.name}</strong>
                </td>
                <td className="biography-cell">
                  {author.biography ? author.biography.substring(0, 80) + '...' : 'No biography available'}
                </td>
                <td>
                  <span className="books-count-badge">{author.books_count || 0}</span>
                </td>
                <td className="actions-cell">
                  <button className="btn-edit" onClick={(e) => { e.stopPropagation(); handleEdit(author); }}>
                    <FaEdit /> Edit
                  </button>
                  <button className="btn-delete" onClick={(e) => { e.stopPropagation(); handleDelete(author.id); }}>
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
      {isModalOpen && (
        <AuthorModal
          author={selectedAuthor}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
      
      {isDetailOpen && selectedAuthor && (
        <AuthorDetailModal
          author={selectedAuthor}
          onClose={() => setIsDetailOpen(false)}
          onEdit={(author) => {
            setIsDetailOpen(false);
            handleEdit(author);
          }}
        />
      )}
    </div>
  );
};

const AuthorModal = ({ author, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    author || { name: '', biography: '' }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{author ? 'Edit Author' : 'Add New Author'}</h2>
          <button className="close-btn" onClick={onClose}><FaTimes /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              maxLength={100}
              placeholder="Enter author name"
            />
          </div>
          <div className="form-group">
            <label>Biography</label>
            <textarea 
              name="biography" 
              value={formData.biography || ''} 
              onChange={handleChange} 
              rows="5"
              placeholder="Enter author biography..."
            ></textarea>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">Save Author</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AuthorDetailModal = ({ author, onClose, onEdit }) => {
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  useEffect(() => {
    fetchAuthorBooks();
  }, []);

  const fetchAuthorBooks = async () => {
    try {
      const response = await apiClient.get(`/authors/${author.id}/books`);
      setBooks(response.data.books || []);
    } catch (error) {
      console.error('Failed to fetch author books:', error);
    } finally {
      setLoadingBooks(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><FaInfoCircle /> Author Details</h2>
          <button className="close-btn" onClick={onClose}><FaTimes /></button>
        </div>
        
        <div className="detail-content">
          <div className="detail-section">
            <div className="detail-row">
              <span className="detail-label">ID:</span>
              <span className="detail-value">#{author.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value author-name">{author.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Biography:</span>
              <span className="detail-value biography-text">
                {author.biography || 'No biography available'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total Books:</span>
              <span className="detail-value">
                <span className="books-count-badge large">{author.books_count || 0}</span>
              </span>
            </div>
          </div>

          {books.length > 0 && (
            <div className="detail-section">
              <h3><FaBook /> Books by this Author</h3>
              <div className="books-list">
                {loadingBooks ? (
                  <p>Loading books...</p>
                ) : (
                  books.map(book => (
                    <div key={book.id} className="book-item">
                      <img 
                        src={book.cover_url || 'https://via.placeholder.com/60x90?text=Book'} 
                        alt={book.title}
                        className="book-thumbnail"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/60x90?text=Book'}
                      />
                      <div className="book-item-info">
                        <strong>{book.title}</strong>
                        <span className="book-meta">
                          {book.category?.name || 'Uncategorized'} • Stock: {book.stock}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>Close</button>
          <button type="button" className="btn-edit" onClick={() => onEdit(author)}>
            <FaEdit /> Edit Author
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthorsTable;
