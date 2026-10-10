import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, AlertTriangle, ShieldCheck, User } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const authUser = await login(email, password);
      if (authUser.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate(from === '/login' ? '/customer/dashboard' : from);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div style={{ padding: '60px 0 100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '440px', width: '100%', margin: '0 20px' }}>
        <div className="card" style={{ padding: '36px', boxShadow: 'var(--shadow-xl)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '6px' }}>
              Welcome Back
            </h2>
            <p style={{ color: 'var(--gray-text)', fontSize: '14px' }}>
              Log in to manage your rentals, payments, and fleet.
            </p>
          </div>

          {/* Quick Demo Fill Buttons (Crucial for presentation & examiners) */}
          <div style={{
            backgroundColor: 'var(--gray-light)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            marginBottom: '24px',
            border: '1px solid var(--gray-border)'
          }}>
            <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--gray-text)', display: 'block', marginBottom: '8px', textAlign: 'center' }}>
              College Demo Credentials (1-Click Fill)
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleFillDemo('admin@vehiclerental.com', 'Admin@123')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '12px', padding: '6px 8px' }}
              >
                <ShieldCheck size={14} color="#f59e0b" />
                <span>Admin Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('customer@vehiclerental.com', 'Customer@123')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '12px', padding: '6px 8px' }}
              >
                <User size={14} color="var(--primary)" />
                <span>Customer Demo</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                  required
                />
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--gray-text)' }} />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                  required
                />
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--gray-text)' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '8px' }}
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--gray-text)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
