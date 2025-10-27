import React from 'react';
import '../styles/Reports.css';

const Reports = () => {
  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>Reports</h2>
      </div>
      <div className="reports-grid">
        <div className="report-card">
          <h3>Loan Statistics</h3>
          <p>View statistics about book loans.</p>
        </div>
        <div className="report-card">
          <h3>Most Borrowed Books</h3>
          <p>See which books are the most popular.</p>
        </div>
        <div className="report-card">
          <h3>Most Active Members</h3>
          <p>Identify the most active library members.</p>
        </div>
        <div className="report-card">
          <h3>Fine Report</h3>
          <p>Generate a report of all fines.</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
