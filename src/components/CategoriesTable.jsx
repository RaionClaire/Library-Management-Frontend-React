import React, { useState, useEffect } from 'react';
import '../styles/CategoriesTable.css';
import apiClient from '../utils/api';
import { getBookPlaceholder, handleImageError } from '../utils/imagePlaceholder';
import { Search, X, Tags, Edit, Trash2, Plus, Info, Book } from 'lucide-react';

const CategoriesTable = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [searchQuery, categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/categories');
      setCategories(response.data.categories || response.data || []);
      setFilteredCategories(response.data.categories || response.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredCategories(filtered);
    }
  };

  const handleRowClick = (category) => {
    setSelectedCategory(category);
    setIsDetailOpen(true);
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await apiClient.delete(`/admin/categories/${categoryId}`);
      setCategories(categories.filter(category => category.id !== categoryId));
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSave = async (category) => {
    try {
      if (category.id) {
        await apiClient.put(`/admin/categories/${category.id}`, category);
      } else {
        await apiClient.post('/admin/categories', category);
      }
      setIsModalOpen(false);
      // Refresh data from server to get updated information
      await fetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="loading">Loading categories...</div>;

  return (
    <div className="categories-table-container">
      <div className="categories-table-header">
        <h2><Tags /> Manage Categories</h2>
        <div className="header-actions">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search categories by name or description..."
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
            <Plus /> Add Category
          </button>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      
      {searchQuery && (
        <div className="search-results-info">
          Found {filteredCategories.length} categor{filteredCategories.length !== 1 ? 'ies' : 'y'}
        </div>
      )}
      
      <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Books Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">
                <Info /> {searchQuery ? 'No categories found matching your search' : 'No categories found'}
              </td>
            </tr>
          ) : (
            filteredCategories.map(category => (
              <tr key={category.id} onClick={() => handleRowClick(category)} className="clickable-row">
                <td>{category.id}</td>
                <td className="category-name-cell">
                  <strong>{category.name}</strong>
                </td>
                <td className="description-cell">
                  {category.description ? category.description.substring(0, 80) + '...' : 'No description available'}
                </td>
                <td>
                  <span className="books-count-badge">{category.books_count || 0}</span>
                </td>
                <td className="actions-cell">
                  <button className="btn-edit" onClick={(e) => { e.stopPropagation(); handleEdit(category); }}>
                    <Edit /> Edit
                  </button>
                  <button className="btn-delete" onClick={(e) => { e.stopPropagation(); handleDelete(category.id); }}>
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
        <CategoryModal
          category={selectedCategory}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
      
      {isDetailOpen && selectedCategory && (
        <CategoryDetailModal
          category={selectedCategory}
          onClose={() => setIsDetailOpen(false)}
          onEdit={(category) => {
            setIsDetailOpen(false);
            handleEdit(category);
          }}
        />
      )}
    </div>
  );
};

const CategoryModal = ({ category, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    category || { name: '', description: '' }
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
          <h2>{category ? 'Edit Category' : 'Add New Category'}</h2>
          <button className="close-btn" onClick={onClose}><X /></button>
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
              maxLength={50}
              placeholder="Enter category name"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description" 
              value={formData.description || ''} 
              onChange={handleChange} 
              rows="5"
              placeholder="Enter category description..."
            ></textarea>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">Save Category</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CategoryDetailModal = ({ category, onClose, onEdit }) => {
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  useEffect(() => {
    fetchCategoryBooks();
  }, []);

  const fetchCategoryBooks = async () => {
    try {
      const response = await apiClient.get(`/categories/${category.id}/books`);
      setBooks(response.data.books || response.data || []);
    } catch (error) {
      console.error('Failed to fetch category books:', error);
    } finally {
      setLoadingBooks(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><Info /> Category Details</h2>
          <button className="close-btn" onClick={onClose}><X /></button>
        </div>
        
        <div className="detail-content">
          <div className="detail-section">
            <div className="detail-row">
              <span className="detail-label">ID:</span>
              <span className="detail-value">#{category.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value category-name">{category.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Description:</span>
              <span className="detail-value description-text">
                {category.description || 'No description available'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total Books:</span>
              <span className="detail-value">
                <span className="books-count-badge large">{category.books_count || 0}</span>
              </span>
            </div>
          </div>

          {books.length > 0 && (
            <div className="detail-section">
              <h3><Book /> Books in this Category</h3>
              <div className="books-list">
                {loadingBooks ? (
                  <p>Loading books...</p>
                ) : (
                  books.map(book => (
                    <div key={book.id} className="book-item">
                      <img 
                        src={book.cover_url || getBookPlaceholder(60, 90)} 
                        alt={book.title}
                        className="book-thumbnail"
                        onError={(e) => handleImageError(e, 60, 90)}
                      />
                      <div className="book-item-info">
                        <strong>{book.title}</strong>
                        <span className="book-meta">
                          by {book.author?.name || 'Unknown'} • Stock: {book.stock}
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
          <button type="button" className="btn-edit" onClick={() => onEdit(category)}>
            <Edit /> Edit Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriesTable;
