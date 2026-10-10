import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Car, CheckCircle, Clock, ArrowRight, User, MapPin, Phone, Mail } from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const response = await api.get('/bookings/my');
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching customer bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeBookings = bookings.filter(b => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'PENDING');
  const completedBookings = bookings.filter(b => b.bookingStatus === 'COMPLETED');
  const totalSpent = bookings
    .filter(b => b.bookingStatus === 'COMPLETED' || b.bookingStatus === 'CONFIRMED')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Welcome Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: '800', letterSpacing: '-0.5px' }}>
              Welcome back, {user?.name || 'Customer'}!
            </h1>
            <p style={{ color: 'var(--gray-text)', fontSize: '15px' }}>
              Here is an overview of your vehicle reservations and rental activity.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/vehicles" className="btn btn-primary btn-sm">
              <Car size={16} />
              <span>Book a Vehicle</span>
            </Link>
            <Link to="/my-bookings" className="btn btn-outline btn-sm">
              <Calendar size={16} />
              <span>All Bookings</span>
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '36px'
        }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--gray-text)', textTransform: 'uppercase' }}>Total Bookings</span>
              <Calendar size={20} color="var(--primary)" />
            </div>
            <span style={{ fontSize: '32px', fontWeight: '800' }}>{bookings.length}</span>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--gray-text)', textTransform: 'uppercase' }}>Active / Pending</span>
              <Clock size={20} color="#f59e0b" />
            </div>
            <span style={{ fontSize: '32px', fontWeight: '800', color: '#f59e0b' }}>{activeBookings.length}</span>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--gray-text)', textTransform: 'uppercase' }}>Completed Trips</span>
              <CheckCircle size={20} color="#10b981" />
            </div>
            <span style={{ fontSize: '32px', fontWeight: '800', color: '#10b981' }}>{completedBookings.length}</span>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--gray-text)', textTransform: 'uppercase' }}>Total Spent</span>
              <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>₹</span>
            </div>
            <span style={{ fontSize: '32px', fontWeight: '800' }}>₹{totalSpent.toLocaleString()}</span>
          </div>
        </div>

        {/* Dashboard 2-column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Recent / Active Bookings */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Active & Upcoming Trips</h3>
              <Link to="/my-bookings" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>
                View All
              </Link>
            </div>

            {loading ? (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
              </div>
            ) : activeBookings.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--gray-text)' }}>
                <Car size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <p style={{ fontSize: '14px', marginBottom: '16px' }}>You have no active trips currently scheduled.</p>
                <Link to="/vehicles" className="btn btn-outline btn-sm">
                  Find a Car to Rent
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {activeBookings.map((b) => (
                  <div key={b.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--gray-border)',
                    backgroundColor: 'var(--gray-light)'
                  }}>
                    <img
                      src={b.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80'}
                      alt={b.vehicleName}
                      style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '15px', fontWeight: '700' }}>{b.vehicleName}</h4>
                      <span style={{ fontSize: '12px', color: 'var(--gray-text)', display: 'block' }}>
                        {b.pickupDate} → {b.returnDate} ({b.numberOfDays} days)
                      </span>
                      <strong style={{ fontSize: '14px', color: 'var(--primary)' }}>
                        ₹{b.totalAmount?.toLocaleString()}
                      </strong>
                    </div>
                    <span className={`badge badge-${b.bookingStatus.toLowerCase()}`}>
                      {b.bookingStatus}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Card */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>
              My Profile
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--gray-border)',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: '800'
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '700' }}>{user?.name}</h4>
                <span className="badge badge-info" style={{ fontSize: '11px' }}>{user?.role}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--gray-text)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} />
                <span>{user?.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} />
                <span>{user?.phone || 'Not provided'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} />
                <span>{user?.address || 'Not provided'}</span>
              </div>
            </div>

            <Link to="/customer/profile" className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: '20px' }}>
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
