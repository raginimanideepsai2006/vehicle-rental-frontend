import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Calendar, Check, X, Clock, AlertTriangle, Search,
  Filter, CheckCircle, RefreshCw
} from 'lucide-react';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/bookings');
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const response = await api.put(`/admin/bookings/${bookingId}/status`, null, {
        params: { status: newStatus }
      });
      if (response.data.success) {
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.bookingStatus === statusFilter;
    const matchesSearch = search === '' ||
      b.userName?.toLowerCase().includes(search.toLowerCase()) ||
      b.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      b.vehicleName?.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toString() === search;
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: '800', letterSpacing: '-0.5px' }}>
              Booking Operations
            </h1>
            <p style={{ color: 'var(--gray-text)', fontSize: '15px' }}>
              Review customer bookings, approve/reject requests, and mark rentals completed.
            </p>
          </div>

          <button onClick={fetchBookings} className="btn btn-outline btn-sm">
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="card" style={{ padding: '18px 24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: '1 1 240px', position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by customer name, email, vehicle, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--gray-text)' }} />
            </div>

            <div style={{ width: '200px' }}>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>

            <span style={{ fontSize: '13px', color: 'var(--gray-text)', marginLeft: 'auto' }}>
              Showing <strong>{filteredBookings.length}</strong> bookings
            </span>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer Info</th>
                  <th>Vehicle Details</th>
                  <th>Rental Schedule</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                  <th>Current Status</th>
                  <th style={{ textAlign: 'right' }}>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                      <div className="spinner" style={{ margin: '0 auto' }}></div>
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-text)' }}>
                      No bookings found for the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id}>
                      <td><strong>#{b.id}</strong></td>
                      <td>
                        <strong>{b.userName}</strong>
                        <span style={{ display: 'block', fontSize: '12px', color: 'var(--gray-text)' }}>{b.userEmail}</span>
                        {b.userPhone && (
                          <span style={{ display: 'block', fontSize: '11px', color: 'var(--gray-text)' }}>{b.userPhone}</span>
                        )}
                      </td>
                      <td>
                        <strong>{b.vehicleName}</strong>
                        <span style={{ display: 'block', fontSize: '12px', color: 'var(--gray-text)' }}>{b.vehicleNumber}</span>
                      </td>
                      <td>
                        <span>{b.pickupDate} to {b.returnDate}</span>
                        <span style={{ display: 'block', fontSize: '12px', color: 'var(--gray-text)' }}>{b.numberOfDays} days</span>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--primary)', fontSize: '15px' }}>
                          ₹{b.totalAmount?.toLocaleString()}
                        </strong>
                      </td>
                      <td>
                        <span className={`badge badge-${(b.paymentStatus || 'pending').toLowerCase()}`}>
                          {b.paymentStatus || 'PENDING'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${b.bookingStatus.toLowerCase()}`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          {b.bookingStatus === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                                className="btn btn-success btn-sm"
                                title="Approve Booking"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(b.id, 'REJECTED')}
                                className="btn btn-danger btn-sm"
                                title="Reject Booking"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {b.bookingStatus === 'CONFIRMED' && (
                            <button
                              onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                              className="btn btn-primary btn-sm"
                              title="Mark Trip as Completed"
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                            >
                              Complete Trip
                            </button>
                          )}

                          {(b.bookingStatus === 'PENDING' || b.bookingStatus === 'CONFIRMED') && (
                            <button
                              onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                              className="btn btn-outline btn-sm"
                              title="Cancel Booking"
                              style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--danger)', borderColor: '#fecaca' }}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
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

export default ManageBookings;
