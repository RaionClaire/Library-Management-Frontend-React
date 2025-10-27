import React, { useState, useEffect } from "react";
import "../styles/notifikasi.css";
import apiClient from "../utils/api.js";

function Notifikasi() {
  const [notifications, setNotifications] = useState([]);
  const [summary, setSummary] = useState({ total: 0, near_due: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load summary + lists on mount
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Run three requests in parallel using member endpoints (server should authorize by token)
      const [summaryResp, nearDueResp, overdueResp] = await Promise.all([
        apiClient.get('/notifications/summary'),
        apiClient.get('/notifications/near-due'),
        apiClient.get('/notifications/overdue'),
      ]);

      const summaryData = summaryResp.data || {};
      const nearDue = nearDueResp.data?.data || nearDueResp.data || [];
      const overdue = overdueResp.data?.data || overdueResp.data || [];

      // Mark type for each notification and combine
      const formattedNear = (Array.isArray(nearDue) ? nearDue : []).map(n => ({ ...n, type: 'reminder' }));
      const formattedOver = (Array.isArray(overdue) ? overdue : []).map(n => ({ ...n, type: 'warning' }));

      const combined = [...formattedNear, ...formattedOver];

      // Use only real API data (no mocking)
      setNotifications(Array.isArray(combined) ? combined : []);
      setSummary({
        total: summaryData.total ?? combined.length,
        near_due: summaryData.near_due ?? formattedNear.length,
        overdue: summaryData.overdue ?? formattedOver.length,
      });

      // Show popup only when there are real notifications
      if ((formattedNear.length + formattedOver.length) > 0) {
        setShowPopup(true);
      } else {
        setShowPopup(false);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load notifications from API:', err);
      // Do NOT fallback to mock — surface an error to the UI instead
      setNotifications([]);
      setSummary({ total: 0, near_due: 0, overdue: 0 });
      setShowPopup(false);
      setError('Failed to load notifications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const dismissPopup = () => setShowPopup(false);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✔';
      case 'reminder':
        return '!';
      case 'warning':
        return '✖';
      default:
        return '';
    }
  };

  return (
    <div className="notifikasi-container">
      <h2 className="notifikasi-title">Notifications</h2>

      <div className="summary-cards">
        <div className="summary-card">
          <h4>Total Notifications</h4>
          <p>{summary.total}</p>
        </div>
        <div className="summary-card">
          <h4>Near Due</h4>
          <p>{summary.near_due}</p>
        </div>
        <div className="summary-card">
          <h4>Overdue</h4>
          <p>{summary.overdue}</p>
        </div>
      </div>

      {loading ? (
        <p>Loading notifications...</p>
      ) : (
        notifications.map(notif => (
          <div className={`notifikasi-box ${notif.type}`} key={notif.id}>
            <div className="icon">{getIcon(notif.type)}</div>
            <div className="text">
              <h4>{notif.title || notif.subject || 'Notification'}</h4>
              <p>{notif.message || notif.body || notif.note || ''}</p>
            </div>
          </div>
        ))
      )}

      {/* Popup modal shown on page open when there are notifications */}
      {showPopup && (
        <div className="modal-overlay" onClick={dismissPopup}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>You have notifications</h2>
              <button className="close-btn" onClick={dismissPopup}>×</button>
            </div>
            <div style={{ padding: 20 }}>
              <p>There are {notifications.length} notifications — {summary.overdue} overdue, {summary.near_due} near due.</p>
              <div style={{ marginTop: 12 }}>
                <button className="btn-save" onClick={() => { dismissPopup(); }} style={{ marginRight: 8 }}>View</button>
                <button className="btn-cancel" onClick={dismissPopup}>Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifikasi;
