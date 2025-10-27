import React, { useState, useEffect } from 'react';
import '../styles/UsersTable.css';
import apiClient from '../utils/api';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/users');
      // Handle paginated response
      const usersData = response.data.data || response.data.users || response.data || [];
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await apiClient.delete(`/admin/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSaveRole = async (userId, newRole) => {
    try {
      const response = await apiClient.put(`/admin/users/${userId}`, { role: newRole });
      const updatedUser = response.data.user || response.data.data || response.data;
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to update user role:', error);
      alert('Failed to update user role: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="users-table-container">
      <div className="users-table-header">
        <h2>Manage Users</h2>
      </div>
      {error && <div className="error-message">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No users found</td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role?.name?.toLowerCase() || user.role?.toLowerCase()}`}>
                    {user.role?.name || user.role || 'N/A'}
                  </span>
                </td>
                <td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleUpdateRole(user)}>
                    Change Role
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {isModalOpen && (
        <RoleModal
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveRole}
        />
      )}
    </div>
  );
};

const RoleModal = ({ user, onClose, onSave }) => {
  const [selectedRole, setSelectedRole] = useState(
    user?.role?.name || user?.role || 'member'
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(user.id, selectedRole);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Update User Role</h2>
        <form onSubmit={handleSubmit}>
          <div className="user-info">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Current Role:</strong> {user.role?.name || user.role}</p>
          </div>
          <div className="form-group">
            <label>New Role *</label>
            <select 
              value={selectedRole} 
              onChange={(e) => setSelectedRole(e.target.value)} 
              required
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-save">Update Role</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsersTable;
