import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, BookOpen, Package, PieChart, Users, UserCheck, AlertCircle, DollarSign, FileText } from 'lucide-react';
import apiClient from '../utils/api.js';
import '../styles/Reports.css';

const Reports = () => {
  const [loading, setLoading] = useState({});
  const [reportData, setReportData] = useState({});
  const [error, setError] = useState({});

  const reports = [
    {
      id: 'loan-statistics',
      title: 'Loan Statistics',
      description: 'Comprehensive statistics about book loans',
      icon: BarChart3,
      endpoint: '/admin/reports/loans/statistics',
      color: '#667eea'
    },
    {
      id: 'loan-trend',
      title: 'Loan Trend',
      description: 'Analyze borrowing trends over time',
      icon: TrendingUp,
      endpoint: '/admin/reports/loans/trend',
      color: '#10b981'
    },
    {
      id: 'most-borrowed',
      title: 'Most Borrowed Books',
      description: 'See which books are the most popular',
      icon: BookOpen,
      endpoint: '/admin/reports/books/most-borrowed',
      color: '#f59e0b'
    },
    {
      id: 'book-inventory',
      title: 'Book Inventory',
      description: 'Current stock and availability status',
      icon: Package,
      endpoint: '/admin/reports/books/inventory',
      color: '#3b82f6'
    },
    {
      id: 'books-by-category',
      title: 'Books by Category',
      description: 'Distribution of books across categories',
      icon: PieChart,
      endpoint: '/admin/reports/books/by-category',
      color: '#8b5cf6'
    },
    {
      id: 'most-active-members',
      title: 'Most Active Members',
      description: 'Identify the most active library members',
      icon: UserCheck,
      endpoint: '/admin/reports/members/most-active',
      color: '#ec4899'
    },
    {
      id: 'member-statistics',
      title: 'Member Statistics',
      description: 'Overview of member registration and activity',
      icon: Users,
      endpoint: '/admin/reports/members/statistics',
      color: '#06b6d4'
    },
    {
      id: 'overdue-loans',
      title: 'Overdue Loans',
      description: 'Track overdue book returns',
      icon: AlertCircle,
      endpoint: '/admin/reports/loans/overdue',
      color: '#ef4444'
    },
    {
      id: 'fine-report',
      title: 'Fine Report',
      description: 'Generate a report of all fines',
      icon: DollarSign,
      endpoint: '/admin/reports/fines',
      color: '#f97316'
    },
    {
      id: 'comprehensive',
      title: 'Comprehensive Report',
      description: 'Complete overview of library operations',
      icon: FileText,
      endpoint: '/admin/reports/comprehensive',
      color: '#6366f1'
    }
  ];

  const fetchReport = async (report) => {
    setLoading(prev => ({ ...prev, [report.id]: true }));
    setError(prev => ({ ...prev, [report.id]: null }));

    try {
      const response = await apiClient.get(report.endpoint);
      setReportData(prev => ({ 
        ...prev, 
        [report.id]: response.data.data || response.data 
      }));
    } catch (err) {
      console.error(`Failed to fetch ${report.title}:`, err);
      setError(prev => ({ 
        ...prev, 
        [report.id]: err.response?.data?.message || 'Failed to load report' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [report.id]: false }));
    }
  };

  const renderReportPreview = (report) => {
    const data = reportData[report.id];
    const isLoading = loading[report.id];
    const errorMsg = error[report.id];

    if (isLoading) {
      return <p className="report-preview loading-text">Loading...</p>;
    }

    if (errorMsg) {
      return <p className="report-preview error-text">{errorMsg}</p>;
    }

    if (!data) {
      return null;
    }

    // Render preview based on report type
    return (
      <div className="report-preview">
        {renderDataPreview(report.id, data)}
      </div>
    );
  };

  const renderDataPreview = (reportId, data) => {
    switch (reportId) {
      case 'loan-statistics':
        return (
          <div className="stats-preview">
            <div className="stat-item">
              <span className="stat-label">Total Loans:</span>
              <span className="stat-value">{data.total_loans || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active:</span>
              <span className="stat-value">{data.active_loans || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Returned:</span>
              <span className="stat-value">{data.returned_loans || 0}</span>
            </div>
          </div>
        );

      case 'most-borrowed':
        return (
          <div className="list-preview">
            {data.slice && data.slice(0, 3).map((book, idx) => (
              <div key={idx} className="preview-item">
                <span className="preview-rank">#{idx + 1}</span>
                <span className="preview-title">{book.title || book.book_title}</span>
                <span className="preview-count">{book.borrow_count || book.count} loans</span>
              </div>
            ))}
          </div>
        );

      case 'most-active-members':
        return (
          <div className="list-preview">
            {data.slice && data.slice(0, 3).map((member, idx) => (
              <div key={idx} className="preview-item">
                <span className="preview-rank">#{idx + 1}</span>
                <span className="preview-title">{member.name}</span>
                <span className="preview-count">{member.loan_count || member.count} loans</span>
              </div>
            ))}
          </div>
        );

      case 'overdue-loans':
        return (
          <div className="stats-preview">
            <div className="stat-item">
              <span className="stat-label">Total Overdue:</span>
              <span className="stat-value danger">{data.length || data.total_overdue || 0}</span>
            </div>
          </div>
        );

      case 'fine-report':
        return (
          <div className="stats-preview">
            <div className="stat-item">
              <span className="stat-label">Total Fines:</span>
              <span className="stat-value">Rp {(data.total_amount || 0).toLocaleString('id-ID')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Unpaid:</span>
              <span className="stat-value danger">Rp {(data.unpaid_amount || 0).toLocaleString('id-ID')}</span>
            </div>
          </div>
        );

      case 'member-statistics':
        return (
          <div className="stats-preview">
            <div className="stat-item">
              <span className="stat-label">Total Members:</span>
              <span className="stat-value">{data.total_members || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active:</span>
              <span className="stat-value">{data.active_members || 0}</span>
            </div>
          </div>
        );

      case 'book-inventory':
        return (
          <div className="stats-preview">
            <div className="stat-item">
              <span className="stat-label">Total Books:</span>
              <span className="stat-value">{data.total_books || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Available:</span>
              <span className="stat-value">{data.available_books || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Borrowed:</span>
              <span className="stat-value">{data.borrowed_books || 0}</span>
            </div>
          </div>
        );

      default:
        return <p className="report-preview-default">Click "View Report" to see details</p>;
    }
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Library Reports</h1>
        <p className="reports-subtitle">Comprehensive analytics and insights</p>
      </div>

      <div className="reports-grid">
        {reports.map(report => {
          const Icon = report.icon;
          return (
            <div 
              key={report.id} 
              className="report-card"
              style={{ borderLeftColor: report.color }}
            >
              <div className="report-card-header">
                <div 
                  className="report-icon" 
                  style={{ backgroundColor: `${report.color}15`, color: report.color }}
                >
                  <Icon size={24} />
                </div>
                <h3>{report.title}</h3>
              </div>
              
              <p className="report-description">{report.description}</p>

              {renderReportPreview(report)}

              <button
                className="view-report-btn"
                style={{ backgroundColor: report.color }}
                onClick={() => fetchReport(report)}
                disabled={loading[report.id]}
              >
                {loading[report.id] ? 'Loading...' : reportData[report.id] ? 'Refresh' : 'View Report'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reports;
