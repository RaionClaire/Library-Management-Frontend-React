import React, { useState, useEffect } from 'react';
import '../styles/FinesTable.css';
import apiClient from '../utils/api';
import { Search, X, DollarSign, Edit, Trash2, Plus, Info, CheckCircle, TriangleAlert } from 'lucide-react';

const FinesTable = () => {
  const [fines, setFines] = useState([]);
  const [filteredFines, setFilteredFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFines();
  }, []);

  useEffect(() => {
    filterFines();
  }, [searchQuery, fines]);

  const fetchFines = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/fines');
      console.log('Fines response:', response.data);
      // Handle nested paginated response: response.data.fines.data
      const finesData = response.data.fines?.data || response.data.data || response.data.fines || response.data || [];
      setFines(finesData);
      setFilteredFines(finesData);
      setError('');
    } catch (error) {
      console.error('Failed to fetch fines:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      setError(error.response?.data?.message || 'Failed to load fines');
    } finally {
      setLoading(false);
    }
  };

  const filterFines = () => {
    if (!searchQuery.trim()) {
      setFilteredFines(fines);
    } else {
      const filtered = fines.filter(fine =>
        (fine.user?.name && fine.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (fine.member_name && fine.member_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (fine.reason && fine.reason.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (fine.loan_id && fine.loan_id.toString().includes(searchQuery))
      );
      setFilteredFines(filtered);
    }
  };

  const handleAdd = () => {
    setSelectedFine(null);
    setIsModalOpen(true);
  };

  const handleEdit = (fine) => {
    setSelectedFine(fine);
    setIsModalOpen(true);
  };

  const handleDelete = async (fineId) => {
    if (!window.confirm('Are you sure you want to delete this fine?')) return;
    
    try {
      await apiClient.delete(`/admin/fines/${fineId}`);
      setFines(fines.filter(fine => fine.id !== fineId));
    } catch (error) {
      console.error('Failed to delete fine:', error);
      alert('Failed to delete fine: ' + (error.response?.data?.message || error.message));
    }
  };

  const handlePay = async (fineId) => {
    try {
      const response = await apiClient.post(`/admin/fines/${fineId}/pay`);
      const updatedFine = response.data.fine || response.data.data || response.data;
      setFines(fines.map(fine => fine.id === fineId ? updatedFine : fine));
    } catch (error) {
      console.error('Failed to mark fine as paid:', error);
      alert('Failed to mark fine as paid: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSave = async (fine) => {
    try {
      if (fine.id) {
        const response = await apiClient.put(`/admin/fines/${fine.id}`, fine);
        const updatedFine = response.data.fine || response.data.data || response.data;
        setFines(fines.map(f => f.id === fine.id ? updatedFine : f));
      } else {
        const response = await apiClient.post('/admin/fines', fine);
        const newFine = response.data.fine || response.data.data || response.data;
        setFines([...fines, newFine]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save fine:', error);
      alert('Failed to save fine: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="loading">Loading fines...</div>;

  return (
    <div className="fines-table-container">
      <div className="fines-table-header">
        <h2><DollarSign /> Manage Fines</h2>
        <div className="header-actions">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search fines by member name, reason, or loan ID..."
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
            <Plus /> Add Fine
          </button>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      
      {searchQuery && (
        <div className="search-results-info">
          Found {filteredFines.length} fine{filteredFines.length !== 1 ? 's' : ''}
        </div>
      )}
      
      <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Member</th>
            <th>Loan ID</th>
            <th>Amount</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFines.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data">
                <Info /> {searchQuery ? 'No fines found matching your search' : 'No fines found'}
              </td>
            </tr>
          ) : (
            filteredFines.map(fine => (
              <tr key={fine.id}>
                <td>{fine.id}</td>
                <td className="member-name-cell">
                  <strong>{fine.user?.name || fine.user.name || 'N/A'}</strong>
                </td>
                <td>#{fine.loan_id || 'N/A'}</td>
                <td className="amount-cell">
                  <strong>${fine.amount ? parseFloat(fine.amount).toFixed(2) : '0.00'}</strong>
                </td>
                <td className="reason-cell">{fine.reason || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${fine.status?.toLowerCase()}`}>
                    {fine.status === 'Paid' || fine.status === 'paid' ? <CheckCircle /> : <TriangleAlert />}
                    {fine.status || 'Unpaid'}
                  </span>
                </td>
                <td className="actions-cell">
                  {fine.status !== 'Paid' && fine.status !== 'paid' && (
                    <button className="btn-action btn-pay" onClick={() => handlePay(fine.id)}>
                      <CheckCircle /> Mark Paid
                    </button>
                  )}
                  <button className="btn-edit" onClick={() => handleEdit(fine)}>
                    <Edit /> Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(fine.id)}>
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
        <FineModal
          fine={selectedFine}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const FineModal = ({ fine, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    fine || { loan_id: '', amount: '', reason: '' }
  );
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await apiClient.get('/admin/loans');
      // Handle paginated response
      const loansData = response.data.data || response.data.loans || response.data || [];
      setLoans(loansData);
    } catch (error) {
      console.error('Failed to fetch loans:', error);
    }
  };

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
          <h2>{fine ? 'Edit Fine' : 'Add New Fine'}</h2>
          <button className="close-btn" onClick={onClose}><X /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Loan *</label>
            <select name="loan_id" value={formData.loan_id} onChange={handleChange} required>
              <option value="">Select Loan</option>
              {loans.map(loan => (
                <option key={loan.id} value={loan.id}>
                  Loan #{loan.id} - {loan.book?.title || 'N/A'} ({loan.user?.name || 'N/A'})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Amount *</label>
            <input 
              type="number" 
              name="amount" 
              value={formData.amount} 
              onChange={handleChange} 
              required 
              step="0.01"
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Reason</label>
            <textarea name="reason" value={formData.reason || ''} onChange={handleChange} rows="3"></textarea>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">Save Fine</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinesTable;
