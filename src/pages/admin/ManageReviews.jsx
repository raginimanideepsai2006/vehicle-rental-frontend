import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Star, Trash2, Search, RefreshCw, MessageSquare } from 'lucide-react';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await api.get('/reviews');
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer review?')) return;
    try {
      const response = await api.delete(`/reviews/${id}`);
      if (response.data.success) {
        fetchReviews();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete review');
    }
  };

  const filteredReviews = reviews.filter((r) => {
    return search === '' ||
      r.vehicleName?.toLowerCase().includes(search.toLowerCase()) ||
      r.userName?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase());
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
              Customer Reviews Moderation
            </h1>
            <p style={{ color: 'var(--gray-text)', fontSize: '15px' }}>
              Monitor feedback and ratings posted by verified rental customers.
            </p>
          </div>

          <button onClick={fetchReviews} className="btn btn-outline btn-sm">
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
                placeholder="Search reviews by customer, vehicle, or comments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--gray-text)' }} />
            </div>

            <span style={{ fontSize: '13px', color: 'var(--gray-text)', marginLeft: 'auto' }}>
              Total: <strong>{filteredReviews.length}</strong> reviews
            </span>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Review ID</th>
                  <th>Vehicle</th>
                  <th>Customer</th>
                  <th>Rating</th>
                  <th>Customer Feedback</th>
                  <th>Submitted Date</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                      <div className="spinner" style={{ margin: '0 auto' }}></div>
                    </td>
                  </tr>
                ) : filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-text)' }}>
                      No reviews found.
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((r) => (
                    <tr key={r.id}>
                      <td><strong>#{r.id}</strong></td>
                      <td>
                        <strong>{r.vehicleName}</strong>
                      </td>
                      <td>
                        <span>{r.userName}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              color={i < r.rating ? '#f59e0b' : '#cbd5e1'}
                              fill={i < r.rating ? '#f59e0b' : 'transparent'}
                            />
                          ))}
                        </div>
                      </td>
                      <td style={{ maxWidth: '320px' }}>
                        <p style={{ fontSize: '13px', color: 'var(--dark-light)', margin: 0 }}>
                          "{r.comment}"
                        </p>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', color: 'var(--gray-text)' }}>
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="btn btn-outline btn-sm"
                          title="Delete Review"
                          style={{ padding: '6px', color: 'var(--danger)', borderColor: '#fecaca' }}
                        >
                          <Trash2 size={15} />
                        </button>
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

export default ManageReviews;
