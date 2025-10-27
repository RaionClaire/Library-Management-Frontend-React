import React, { useState, useEffect } from 'react';
import '../styles/FinesTable.css';
import apiClient from '../utils/api.js';
import { Search, X, DollarSign, Edit, Trash2, Plus, Info, CheckCircle, TriangleAlert } from 'lucide-react';

const FinesTable = () => {
  const [fines, setFines] = useState([]);
  const [filteredFines, setFilteredFines] = useState([]);
  const [summary, setSummary] = useState({ total_amount: 0, paid_amount: 0, unpaid_amount: 0 });
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
      // Handle nested/paginated response and summary
      // fines may be under response.data.fines.data or response.data.data or response.data.fines
      const finesData = response.data.fines?.data || response.data.data || response.data.fines || response.data || [];
      const summaryData = response.data.summary || response.data.meta || {};
      setFines(finesData);
      setFilteredFines(finesData);
      setSummary(summaryData);
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
        (fine.note && fine.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
      // refetch to update list and summary (API enforces only delete if paid)
      await fetchFines();
    } catch (error) {
      console.error('Failed to delete fine:', error);
      alert('Failed to delete fine: ' + (error.response?.data?.message || error.message));
    }
  };

  const handlePay = async (fineId) => {
    try {
      const response = await apiClient.post(`/admin/fines/${fineId}/pay`);
      // After payment, refetch to get updated status and updated summary
      await fetchFines();
    } catch (error) {
      console.error('Failed to mark fine as paid:', error);
      alert('Failed to mark fine as paid: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSave = async (fine) => {
    try {
      if (fine.id) {
        await apiClient.put(`/admin/fines/${fine.id}`, fine);
        // refetch to get latest list and summary
        await fetchFines();
      } else {
        await apiClient.post('/admin/fines', fine);
        // refetch to include new fine and updated summary
        await fetchFines();
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
        <div className="fines-summary-cards">
          <div className="summary-card total">
            <div className="summary-content">
              <h3>Total Fines</h3>
              <p className="summary-amount">Rp{Number(summary.total_amount || 0).toFixed(2)}</p>
            </div>
          </div>
          <div className="summary-card amount">
            <div className="summary-content">
              <h3>Paid</h3>
              <p className="summary-number">Rp{Number(summary.paid_amount || 0).toFixed(2)}</p>
            </div>
          </div>
          <div className="summary-card unpaid">
            <div className="summary-content">
              <h3>Unpaid</h3>
              <p className="summary-number">Rp{Number(summary.unpaid_amount || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
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
            <th>Book Title</th>
            <th>Amount</th>
            <th>Note</th>
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
                  <strong>{fine.loan?.member?.user?.name || 'N/A'}</strong>
                </td>
                <td>{fine.loan.book.title || 'N/A'}</td>
                <td className="amount-cell">
                  <strong>Rp{fine.amount ? parseFloat(fine.amount).toFixed(2) : '0.00'}</strong>
                </td>
                <td className="note-cell">{fine.note || 'N/A'}</td>
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
    fine || { loan_id: '', amount: '', note: '' }
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
    const newForm = { ...formData, [name]: value };
    setFormData(newForm);

    // If loan selection changes, try to preview fine calculation
    if (name === 'loan_id' && value) {
      previewCalculation(value, newForm);
    }
  };

  const previewCalculation = async (loanId, currentForm) => {
    try {
      const resp = await apiClient.get(`/admin/fines/calculate/${loanId}`);
      // the API should return an amount preview, e.g. { amount: 12.5 }
      const amount = resp.data.amount || resp.data.data?.amount || resp.data?.fine?.amount;
      if (amount !== undefined && (!currentForm.amount || currentForm.amount === '')) {
        setFormData(prev => ({ ...prev, amount }));
      }
    } catch (err) {
      // silent fail: preview is optional
      console.debug('Failed to preview fine calculation:', err?.message || err);
    }
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
            <label>Note</label>
            <textarea name="note" value={formData.note || ''} onChange={handleChange} rows="3"></textarea>
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
