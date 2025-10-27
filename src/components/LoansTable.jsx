import React, { useState, useEffect } from 'react';
import '../styles/LoansTable.css';
import apiClient from '../utils/api';
import { Search, X, Book, Edit, Trash2, Plus, Info, Check, Ban, Clock, CheckCircle, XCircle } from 'lucide-react';

const LoansTable = () => {
  const [loans, setLoans] = useState([]);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'pending'
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLoans();
    fetchPendingLoans();
  }, []);

  useEffect(() => {
    filterLoans();
  }, [searchQuery, loans, activeTab]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/loans');
      // Handle paginated response
      const loansData = response.data.data || response.data.loans || response.data || [];
      setLoans(loansData);
      setFilteredLoans(loansData);
    } catch (error) {
      console.error('Failed to fetch loans:', error);
      setError('Failed to load loans');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingLoans = async () => {
    try {
      const response = await apiClient.get('/admin/loans/pending/all');
      const pendingData = response.data.pending_loans || [];
      setPendingLoans(pendingData);
    } catch (error) {
      console.error('Failed to fetch pending loans:', error);
    }
  };

  const filterLoans = () => {
    const dataToFilter = activeTab === 'pending' ? pendingLoans : loans;
    
    if (!searchQuery.trim()) {
      setFilteredLoans(dataToFilter);
    } else {
      const filtered = dataToFilter.filter(loan =>
        loan.book?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.book_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.member_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLoans(filtered);
    }
  };

  const handleAdd = () => {
    setSelectedLoan(null);
    setIsModalOpen(true);
  };

  const handleEdit = (loan) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  const handleDelete = async (loanId) => {
    if (!window.confirm('Are you sure you want to delete this loan?')) return;
    
    try {
      await apiClient.delete(`/admin/loans/${loanId}`);
      setLoans(loans.filter(loan => loan.id !== loanId));
    } catch (error) {
      console.error('Failed to delete loan:', error);
      alert('Failed to delete loan: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleReturn = async (loanId) => {
    try {
      const response = await apiClient.post(`/admin/loans/${loanId}/return`);
      const updatedLoan = response.data.loan || response.data.data || response.data;
      setLoans(loans.map(loan => loan.id === loanId ? updatedLoan : loan));
    } catch (error) {
      console.error('Failed to return book:', error);
      alert('Failed to return book: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleExtend = async (loanId) => {
    const days = prompt('Extend by how many days?', '7');
    if (!days) return;
    
    try {
      const response = await apiClient.post(`/admin/loans/${loanId}/extend`, { days: parseInt(days) });
      const updatedLoan = response.data.loan || response.data.data || response.data;
      setLoans(loans.map(loan => loan.id === loanId ? updatedLoan : loan));
      fetchLoans(); // Refresh the list
    } catch (error) {
      console.error('Failed to extend loan:', error);
      alert('Failed to extend loan: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleApprove = async (loanId) => {
    if (!window.confirm('Are you sure you want to approve this loan request?')) return;
    
    try {
      const response = await apiClient.post(`/admin/loans/${loanId}/approve`);
      const approvedLoan = response.data.loan || response.data.data || response.data;
      
      // Remove from pending and add to loans
      setPendingLoans(pendingLoans.filter(loan => loan.id !== loanId));
      setLoans([approvedLoan, ...loans]);
      
      alert('Loan approved successfully!');
      fetchLoans();
      fetchPendingLoans();
    } catch (error) {
      console.error('Failed to approve loan:', error);
      alert('Failed to approve loan: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleReject = async (loanId) => {
    const reason = prompt('Enter rejection reason (optional):');
    if (reason === null) return; // User cancelled
    
    try {
      const response = await apiClient.post(`/admin/loans/${loanId}/reject`, { 
        reason: reason || 'No reason provided' 
      });
      
      // Remove from pending loans
      setPendingLoans(pendingLoans.filter(loan => loan.id !== loanId));
      
      alert('Loan rejected successfully!');
      fetchPendingLoans();
    } catch (error) {
      console.error('Failed to reject loan:', error);
      alert('Failed to reject loan: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSave = async (loan) => {
    try {
      if (loan.id) {
        const response = await apiClient.put(`/admin/loans/${loan.id}`, loan);
        const updatedLoan = response.data.loan || response.data.data || response.data;
        setLoans(loans.map(l => l.id === loan.id ? updatedLoan : l));
      } else {
        const response = await apiClient.post('/admin/loans', loan);
        const newLoan = response.data.loan || response.data.data || response.data;
        setLoans([...loans, newLoan]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save loan:', error);
      alert('Failed to save loan: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="loading">Loading loans...</div>;

  return (
    <div className="loans-table-container">
      <div className="loans-table-header">
        <h2><Book /> Manage Loans</h2>
        <div className="header-actions">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search by book title or member name..."
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
            <Plus /> Add Loan
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button 
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <Book /> All Loans ({loans.length})
        </button>
        <button 
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <Clock /> Pending Requests ({pendingLoans.length})
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {searchQuery && (
        <div className="search-results-info">
          Found {filteredLoans.length} loan{filteredLoans.length !== 1 ? 's' : ''}
        </div>
      )}
      
      <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Book Title</th>
            <th>Member</th>
            <th>Loan Date</th>
            <th>Due Date</th>
            <th>Return Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLoans.length === 0 ? (
            <tr>
              <td colSpan="8" className="no-data">
                <Info /> {searchQuery ? 'No loans found matching your search' : activeTab === 'pending' ? 'No pending loan requests' : 'No loans found'}
              </td>
            </tr>
          ) : (
            filteredLoans.map(loan => (
              <tr key={loan.id}>
                <td>{loan.id}</td>
                <td className="book-title-cell">
                  <strong>{loan.book?.title || loan.book_title || 'N/A'}</strong>
                </td>
                <td>{loan.user?.name || loan.member.user.name || 'N/A'}</td>
                <td>{loan.loaned_at ? new Date(loan.loaned_at).toLocaleDateString() : '-'}</td>
                <td>{loan.due_at ? new Date(loan.due_at).toLocaleDateString() : '-'}</td>
                <td>{loan.returned_at ? new Date(loan.returned_at).toLocaleDateString() : '-'}</td>
                <td>
                  <span className={`status-badge ${loan.status?.toLowerCase()}`}>
                    {loan.status === 'pending' && <Clock />}
                    {loan.status === 'borrowed' && <CheckCircle />}
                    {loan.status === 'returned' && <Check />}
                    {loan.status === 'rejected' && <XCircle />}
                    {loan.status || 'Active'}
                  </span>
                </td>
                <td className="actions-cell">
                  {loan.status === 'pending' ? (
                    <>
                      <button 
                        className="btn-approve" 
                        onClick={() => handleApprove(loan.id)}
                        title="Approve loan request"
                      >
                        <Check /> Approve
                      </button>
                      <button 
                        className="btn-reject" 
                        onClick={() => handleReject(loan.id)}
                        title="Reject loan request"
                      >
                        <Ban /> Reject
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDelete(loan.id)}
                      >
                        <Trash2 />
                      </button>
                    </>
                  ) : (
                    <>
                      {loan.status !== 'Returned' && loan.status !== 'returned' && (
                        <>
                          <button 
                            className="btn-action" 
                            onClick={() => handleReturn(loan.id)}
                          >
                            Return
                          </button>
                          <button 
                            className="btn-action" 
                            onClick={() => handleExtend(loan.id)}
                          >
                            Extend
                          </button>
                        </>
                      )}
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEdit(loan)}
                      >
                        <Edit />
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDelete(loan.id)}
                      >
                        <Trash2 />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
      {isModalOpen && (
        <LoanModal
          loan={selectedLoan}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const LoanModal = ({ loan, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    loan || { user_id: '', book_id: '', loaned_at: '', due_at: '' }
  );
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchUsersAndBooks();
  }, []);

  const fetchUsersAndBooks = async () => {
    try {
      const [usersRes, booksRes] = await Promise.all([
        apiClient.get('/admin/users'),
        apiClient.get('/admin/books')
      ]);
      // Handle both paginated and non-paginated responses
      setUsers(usersRes.data.data || usersRes.data.users || usersRes.data || []);
      setBooks(booksRes.data.data || booksRes.data.books || booksRes.data || []);
    } catch (error) {
      console.error('Failed to fetch users/books:', error);
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
          <h2>{loan ? 'Edit Loan' : 'Add New Loan'}</h2>
          <button className="close-btn" onClick={onClose}><X /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Member *</label>
            <select name="user_id" value={formData.user_id} onChange={handleChange} required>
              <option value="">Select Member</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Book *</label>
            <select name="book_id" value={formData.book_id} onChange={handleChange} required>
              <option value="">Select Book</option>
              {books.map(book => (
                <option key={book.id} value={book.id}>{book.title}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Loan Date *</label>
            <input type="date" name="loaned_at" value={formData.loaned_at} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Due Date *</label>
            <input type="date" name="due_at" value={formData.due_at} onChange={handleChange} required />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">Save Loan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoansTable;
