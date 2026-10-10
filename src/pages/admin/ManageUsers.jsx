import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Mail, Phone, MapPin, Search, Calendar, ShieldCheck } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = search === '' ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search));
    const matchesRole = roleFilter === '' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            User Management
          </h1>
          <p style={{ color: 'var(--gray-text)', fontSize: '15px' }}>
            List of all registered customers and administrators in the system.
          </p>
        </div>

        {/* Filters */}
        <div className="card" style={{ padding: '18px 24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: '1 1 240px', position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--gray-text)' }} />
            </div>

            <div style={{ width: '180px' }}>
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="CUSTOMER">Customer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <span style={{ fontSize: '13px', color: 'var(--gray-text)', marginLeft: 'auto' }}>
              Total: <strong>{filteredUsers.length}</strong> registered users
            </span>
          </div>
        </div>

        {/* Users Table */}
        <div className="card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Customer Profile</th>
                  <th>Contact Details</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th>Bookings Made</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                      <div className="spinner" style={{ margin: '0 auto' }}></div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-text)' }}>
                      No users match the search filter.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td><strong>#{u.id}</strong></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: u.role === 'ADMIN' ? '#f59e0b' : 'var(--primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '14px'
                          }}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong style={{ fontSize: '14px', display: 'block' }}>{u.name}</strong>
                            <span style={{ fontSize: '12px', color: 'var(--gray-text)' }}>{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px', color: 'var(--dark)' }}>{u.phone || 'N/A'}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px', color: 'var(--gray-text)' }}>{u.address || 'N/A'}</span>
                      </td>
                      <td>
                        <span className={`badge badge-${u.role === 'ADMIN' ? 'warning' : 'info'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '14px' }}>
                          {u.totalBookings || 0}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px', color: 'var(--gray-text)' }}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
