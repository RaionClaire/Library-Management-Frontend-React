import React, { useState, useEffect } from "react";
import "../styles/notifikasi.css";

const mockNotifications = [
  { id: 1, type: 'success', title: 'Success', message: 'Book loan was successful.' },
  { id: 2, type: 'reminder', title: 'Reminder', message: 'Your book loan is due soon.' },
  { id: 3, type: 'warning', title: 'Warning', message: 'Your book loan is overdue.' },
];

function Notifikasi() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simulate fetching notifications
    setNotifications(mockNotifications);
  }, []);

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

      {notifications.map(notif => (
        <div className={`notifikasi-box ${notif.type}`} key={notif.id}>
          <div className="icon">{getIcon(notif.type)}</div>
          <div className="text">
            <h4>{notif.title}</h4>
            <p>{notif.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Notifikasi;
