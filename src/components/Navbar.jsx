import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, User, LogOut, LayoutDashboard, Calendar, ShieldCheck, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isCustomer, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      backgroundColor: 'white',
      borderBottom: '1px solid var(--gray-border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
            color: 'white',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
          }}>
            <Car size={24} />
          </div>
          <div>
            <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px', color: 'var(--dark)' }}>
              Auto<span style={{ color: 'var(--primary)' }}>Rental</span>
            </span>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--gray-text)', marginTop: '-3px' }}>
              DRIVE YOUR WAY
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-nav">
          <Link
            to="/"
            style={{
              fontWeight: '600',
              fontSize: '15px',
              color: isActive('/') ? 'var(--primary)' : 'var(--dark-light)',
              borderBottom: isActive('/') ? '2px solid var(--primary)' : 'none',
              paddingBottom: '4px'
            }}
          >
            Home
          </Link>
          <Link
            to="/vehicles"
            style={{
              fontWeight: '600',
              fontSize: '15px',
              color: isActive('/vehicles') ? 'var(--primary)' : 'var(--dark-light)',
              borderBottom: isActive('/vehicles') ? '2px solid var(--primary)' : 'none',
              paddingBottom: '4px'
            }}
          >
            Browse Vehicles
          </Link>
          <Link
            to="/about"
            style={{
              fontWeight: '600',
              fontSize: '15px',
              color: isActive('/about') ? 'var(--primary)' : 'var(--dark-light)',
              borderBottom: isActive('/about') ? '2px solid var(--primary)' : 'none',
              paddingBottom: '4px'
            }}
          >
            About
          </Link>

          {isAuthenticated && isCustomer && (
            <Link
              to="/my-bookings"
              style={{
                fontWeight: '600',
                fontSize: '15px',
                color: isActive('/my-bookings') ? 'var(--primary)' : 'var(--dark-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Calendar size={18} />
              My Bookings
            </Link>
          )}

          {isAuthenticated && isAdmin && (
            <Link
              to="/admin/dashboard"
              style={{
                fontWeight: '600',
                fontSize: '15px',
                color: isActive('/admin/dashboard') ? 'var(--primary)' : 'var(--dark-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ShieldCheck size={18} />
              Admin Portal
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link
                to={isAdmin ? '/admin/dashboard' : '/customer/dashboard'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--gray-light)',
                  border: '1px solid var(--gray-border)'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: isAdmin ? '#f59e0b' : 'var(--primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: '700'
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', display: 'block', lineHeight: '1.2' }}>
                    {user.name ? user.name.split(' ')[0] : 'User'}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--gray-text)', textTransform: 'uppercase', fontWeight: '700' }}>
                    {user.role}
                  </span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                title="Log out"
                style={{ padding: '8px', color: 'var(--danger)', borderColor: '#fecaca' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
