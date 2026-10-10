import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CreditCard, QrCode, Banknote, Search, CheckCircle, RefreshCw } from 'lucide-react';

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/payments');
      if (response.data.success) {
        setPayments(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    return search === '' ||
      p.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
      p.bookingId?.toString() === search;
  });

  const getMethodIcon = (method) => {
    switch (method) {
      case 'UPI': return <QrCode size={16} color="var(--primary)" />;
      case 'CARD': return <CreditCard size={16} color="#0284c7" />;
      case 'CASH': return <Banknote size={16} color="#10b981" />;
      default: return <CreditCard size={16} />;
    }
  };

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
              Payment Transactions
            </h1>
            <p style={{ color: 'var(--gray-text)', fontSize: '15px' }}>
              Audit log of all simulated gateway transactions, refunds, and cash receipts.
            </p>
          </div>

          <button onClick={fetchPayments} className="btn btn-outline btn-sm">
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="card" style={{ padding: '18px 24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: '1 1 280px', position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by transaction ID or booking ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--gray-text)' }} />
            </div>

            <span style={{ fontSize: '13px', color: 'var(--gray-text)', marginLeft: 'auto' }}>
              Total: <strong>{filteredPayments.length}</strong> transactions
            </span>
          </div>
        </div>

        {/* Payments Table */}
        <div className="card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Transaction ID</th>
                  <th>Booking ID</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Payment Status</th>
                  <th>Processed On</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                      <div className="spinner" style={{ margin: '0 auto' }}></div>
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-text)' }}>
                      No payment transactions found.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => (
                    <tr key={p.id}>
                      <td><strong>#{p.id}</strong></td>
                      <td>
                        <code style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '13px', fontWeight: '700' }}>
                          {p.transactionId}
                        </code>
                      </td>
                      <td>
                        <strong>Booking #{p.bookingId}</strong>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--primary)', fontSize: '15px' }}>
                          ₹{p.amount?.toLocaleString()}
                        </strong>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {getMethodIcon(p.paymentMethod)}
                          <span style={{ fontSize: '13px', fontWeight: '600' }}>{p.paymentMethod}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${p.paymentStatus.toLowerCase()}`}>
                          {p.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px', color: 'var(--gray-text)' }}>
                          {p.paymentDate ? new Date(p.paymentDate).toLocaleString() : 'N/A'}
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

export default ManagePayments;
