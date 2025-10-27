import React, { useEffect, useState } from "react";
import "../styles/peminjamanAktif.css";
import apiClient from "../utils/api";
import { Book, Calendar, Search, X, Clock, CheckCircle, TriangleAlert } from "lucide-react";

export default function PeminjamanAktif() {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActiveLoans();
  }, []);

  useEffect(() => {
    filterLoans();
  }, [searchQuery, loans]);

  const fetchActiveLoans = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/member/loans');
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

  const filterLoans = () => {
    if (!searchQuery.trim()) {
      setFilteredLoans(loans);
    } else {
      const filtered = loans.filter(loan =>
        loan.book?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.book_title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLoans(filtered);
    }
  };

  const getStatusInfo = (loan) => {
    const dueDate = new Date(loan.due_at);
    const today = new Date();
    const isOverdue = dueDate < today && loan.status !== 'Returned';
    
    if (loan.status === 'Returned') {
      return { label: 'Returned', class: 'returned', icon: <CheckCircle /> };
    } else if (isOverdue) {
      return { label: 'Overdue', class: 'overdue', icon: <TriangleAlert /> };
    } else {
      return { label: 'Active', class: 'active', icon: <Clock /> };
    }
  };

  if (loading) {
    return <div className="loading">Loading your active loans...</div>;
  }

  return (
    <div className="peminjaman-container">
      <div className="page-header">
        <div>
          <h2 className="judul-halaman"><Book /> Active Loans</h2>
          <p className="page-subtitle">Manage your borrowed books</p>
        </div>
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search by book title..."
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
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="info-section">
        {filteredLoans.length > 0 ? (
          <p>You have <strong>{filteredLoans.length}</strong> loan{filteredLoans.length !== 1 ? 's' : ''} {searchQuery && 'matching your search'}.</p>
        ) : (
          <p>{searchQuery ? 'No loans found matching your search' : 'You have no active loans.'}</p>
        )}
      </div>

      <div className="daftar-buku">
        {filteredLoans.map((loan) => {
          const statusInfo = getStatusInfo(loan);
          return (
            <div className="buku-card" key={loan.id}>
              <img 
                src={loan.book?.cover_url || loan.cover || 'https://via.placeholder.com/150x200?text=Book+Cover'} 
                alt={loan.book?.title || loan.bookTitle} 
                className="buku-cover"
                onError={(e) => e.target.src = 'https://via.placeholder.com/150x200?text=Book+Cover'}
              />
              <div className="buku-info">
                <h3 className="buku-judul">{loan.book?.title || loan.bookTitle}</h3>
                <p className="buku-author">by {loan.book?.author?.name || 'Unknown'}</p>
                
                <div className="buku-dates">
                  <div className="date-item">
                    <Calendar className="date-icon" />
                    <div>
                      <span className="date-label">Loan Date:</span>
                      <span className="date-value">{new Date(loan.loaned_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="date-item">
                    <Calendar className="date-icon" />
                    <div>
                      <span className="date-label">Due Date:</span>
                      <span className="date-value">{new Date(loan.due_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {loan.returned_at && (
                    <div className="date-item">
                      <CheckCircle className="date-icon" />
                      <div>
                        <span className="date-label">Returned:</span>
                        <span className="date-value">{new Date(loan.returned_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className={`buku-status ${statusInfo.class}`}>
                  {statusInfo.icon}
                  <span>{statusInfo.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
