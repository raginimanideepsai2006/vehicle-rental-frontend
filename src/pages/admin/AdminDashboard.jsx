import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Users, Car, Calendar, DollarSign, CheckCircle, Clock,
  ArrowRight, ShieldCheck, CreditCard, Star, RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/dashboard');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
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
        fetchDashboardStats();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Admin Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <ShieldCheck size={24} color="#f59e0b" />
              <h1 style={{ fontSize: '30px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Administrator Command Center
              </h1>
            </div>
            <p style={{ color: 'var(--gray-text)', fontSize: '15px' }}>
              System metrics, revenue reports, fleet management, and real-time booking control.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={fetchDashboardStats} className="btn btn-outline btn-sm">
              <RefreshCw size={14} />
              <span>Refresh Stats</span>
            </button>
            <Link to="/admin/vehicles" className="btn btn-primary btn-sm">
              <Car size={16} />
              <span>Manage Fleet</span>
            </Link>
          </div>
        </div>

        {/* 6 Core KPI Metrics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '18px',
          marginBottom: '36px'
        }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--gray-text)', textTransform: 'uppercase' }}>Total Users</span>
              <Users size={20} color="var(--primary)" />
            </div>
            <span style={{ fontSize: '30px', fontWeight: '800' }}>{stats?.totalUsers || 0}</span>
            <span style={{ fontSize: '12px', color: 'var(--gray-text)', display: 'block', marginTop: '2px' }}>
              {stats?.totalCustomers || 0} Customers
            </span>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--gray-text)', textTransform: 'uppercase' }}>Fleet Size</span>
              <Car size={20} color="#0284c7" />
            </div>
            <span style={{ fontSize: '30px', fontWeight: '800', color: '#0284c7' }}>{stats?.totalVehicles || 0}</span>
            <span style={{ fontSize: '12px', color: 'var(--gray-text)', display: 'block', marginTop: '2px' }}>
              Vehicles registered
            </span>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--gray-text)', textTransform: 'uppercase' }}>Available Now</span>
              <CheckCircle size={20} color="#10b981" />
            </div>
            <span style={{ fontSize: '30px', fontWeight: '800', color: '#10b981' }}>{stats?.availableVehicles || 0}</span>
            <span style={{ fontSize: '12px', color: 'var(--gray-text)', display: 'block', marginTop: '2px' }}>
              Ready for immediate rent
            </span>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--gray-text)', textTransform: 'uppercase' }}>Active Bookings</span>
              <Clock size={20} color="#f59e0b" />
            </div>
            <span style={{ fontSize: '30px', fontWeight: '800', color: '#f59e0b' }}>{stats?.activeBookings || 0}</span>
            <span style={{ fontSize: '12px', color: 'var(--gray-text)', display: 'block', marginTop: '2px' }}>
              Pending / Confirmed
            </span>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--gray-text)', textTransform: 'uppercase' }}>Completed</span>
              <Calendar size={20} color="#8b5cf6" />
            </div>
            <span style={{ fontSize: '30px', fontWeight: '800', color: '#8b5cf6' }}>{stats?.completedRentals || 0}</span>
            <span style={{ fontSize: '12px', color: 'var(--gray-text)', display: 'block', marginTop: '2px' }}>
              Trips fulfilled
            </span>
          </div>

          <div className="card" style={{ padding: '20px', backgroundColor: 'var(--dark)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Total Revenue</span>
              <DollarSign size={20} color="#34d399" />
            </div>
            <span style={{ fontSize: '30px', fontWeight: '800', color: '#34d399' }}>
              ₹{stats?.totalRevenue?.toLocaleString()}
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
              Simulated earnings
            </span>
          </div>
        </div>

        {/* Quick Admin Navigation Pills */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
          <Link to="/admin/vehicles" className="btn btn-outline btn-sm">
            <Car size={16} /> Manage Vehicles
          </Link>
          <Link to="/admin/bookings" className="btn btn-outline btn-sm">
            <Calendar size={16} /> Manage Bookings
          </Link>
          <Link to="/admin/users" className="btn btn-outline btn-sm">
            <Users size={16} /> Manage Users
          </Link>
          <Link to="/admin/payments" className="btn btn-outline btn-sm">
            <CreditCard size={16} /> Payment Transactions
          </Link>
          <Link to="/admin/reviews" className="btn btn-outline btn-sm">
            <Star size={16} /> Customer Reviews
          </Link>
        </div>

        {/* Recent Bookings Table */}
        <div className="card" style={{ padding: '24px', marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Recent Customer Bookings</h3>
            <Link to="/admin/bookings" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>
              View All Bookings →
            </Link>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Rental Dates</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentBookings?.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--gray-text)' }}>
                      No bookings recorded yet.
                    </td>
                  </tr>
                ) : (
                  stats?.recentBookings?.map((b) => (
                    <tr key={b.id}>
                      <td><strong>#{b.id}</strong></td>
                      <td>
                        <strong>{b.userName}</strong>
                        <span style={{ display: 'block', fontSize: '12px', color: 'var(--gray-text)' }}>{b.userEmail}</span>
                      </td>
                      <td>
                        <strong>{b.vehicleName}</strong>
                        <span style={{ display: 'block', fontSize: '12px', color: 'var(--gray-text)' }}>{b.vehicleNumber}</span>
                      </td>
                      <td>
                        {b.pickupDate} to {b.returnDate}
                        <span style={{ display: 'block', fontSize: '12px', color: 'var(--gray-text)' }}>({b.numberOfDays} days)</span>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--primary)' }}>₹{b.totalAmount?.toLocaleString()}</strong>
                      </td>
                      <td>
                        <span className={`badge badge-${b.bookingStatus.toLowerCase()}`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select"
                          style={{ padding: '4px 8px', fontSize: '12px', width: 'auto' }}
                          value={b.bookingStatus}
                          onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
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

export default AdminDashboard;
