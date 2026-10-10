import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Calendar, CheckCircle, Clock, AlertTriangle, XCircle,
  Star, FileText, X, AlertCircle
} from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('ALL');

  // Cancel Modal state
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Review Modal state
  const [reviewBooking, setReviewBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Receipt Modal state
  const [receiptBooking, setReceiptBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/bookings/my');
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancellingBooking) return;
    setCancelLoading(true);
    try {
      const response = await api.put(`/bookings/${cancellingBooking.id}/cancel`);
      if (response.data.success) {
        setCancellingBooking(null);
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewBooking) return;

    setReviewSubmitting(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      const payload = {
        vehicleId: reviewBooking.vehicleId,
        rating: Number(rating),
        comment,
      };

      const response = await api.post('/reviews', payload);
      if (response.data.success) {
        setReviewSuccess('Thank you! Your review and rating have been posted.');
        setTimeout(() => {
          setReviewBooking(null);
          setComment('');
          setRating(5);
          setReviewSuccess('');
        }, 1500);
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === 'ALL') return true;
    if (filterTab === 'ACTIVE') return b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'PENDING';
    if (filterTab === 'COMPLETED') return b.bookingStatus === 'COMPLETED';
    if (filterTab === 'CANCELLED') return b.bookingStatus === 'CANCELLED' || b.bookingStatus === 'REJECTED';
    return true;
  });

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            My Booking History
          </h1>
          <p style={{ color: 'var(--gray-text)', fontSize: '15px' }}>
            View reservation details, invoices, cancellations, and leave reviews.
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--gray-border)', paddingBottom: '12px' }}>
          {['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className="btn btn-sm"
              style={{
                backgroundColor: filterTab === tab ? 'var(--primary)' : 'transparent',
                color: filterTab === tab ? 'white' : 'var(--dark-light)',
                fontWeight: '600'
              }}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Calendar size={48} color="var(--gray-text)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px' }}>
              No bookings found in this section
            </h3>
            <p style={{ color: 'var(--gray-text)', fontSize: '14px' }}>
              You don't have any reservations matching this status filter.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredBookings.map((b) => (
              <div key={b.id} className="card" style={{ padding: '24px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '16px',
                  borderBottom: '1px solid var(--gray-border)',
                  paddingBottom: '16px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--gray-text)', fontWeight: '700' }}>
                      BOOKING #{b.id} • RESERVED ON {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', marginTop: '2px' }}>
                      {b.vehicleName}
                    </h3>
                    <span style={{ fontSize: '13px', color: 'var(--gray-text)' }}>
                      Reg: {b.vehicleNumber} ({b.vehicleType})
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span className={`badge badge-${b.bookingStatus.toLowerCase()}`}>
                      {b.bookingStatus}
                    </span>
                    {b.paymentStatus && (
                      <span className={`badge badge-${b.paymentStatus.toLowerCase()}`}>
                        Payment: {b.paymentStatus}
                      </span>
                    )}
                  </div>
                </div>

                {/* Booking Body Details */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '20px',
                  fontSize: '14px'
                }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--gray-text)', display: 'block' }}>Pickup Date</span>
                    <strong>{b.pickupDate}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--gray-text)', display: 'block' }}>Return Date</span>
                    <strong>{b.returnDate}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--gray-text)', display: 'block' }}>Duration</span>
                    <strong>{b.numberOfDays} Days</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--gray-text)', display: 'block' }}>Total Paid / Amount</span>
                    <strong style={{ color: 'var(--primary)', fontSize: '16px' }}>₹{b.totalAmount?.toLocaleString()}</strong>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setReceiptBooking(b)}
                    className="btn btn-outline btn-sm"
                  >
                    <FileText size={14} />
                    <span>View Receipt</span>
                  </button>

                  {/* Cancel button if pending or confirmed */}
                  {(b.bookingStatus === 'PENDING' || b.bookingStatus === 'CONFIRMED') && (
                    <button
                      onClick={() => setCancellingBooking(b)}
                      className="btn btn-outline btn-sm"
                      style={{ color: 'var(--danger)', borderColor: '#fecaca' }}
                    >
                      <XCircle size={14} />
                      <span>Cancel Booking</span>
                    </button>
                  )}

                  {/* Review button only if completed */}
                  {b.bookingStatus === 'COMPLETED' && (
                    <button
                      onClick={() => setReviewBooking(b)}
                      className="btn btn-primary btn-sm"
                    >
                      <Star size={14} />
                      <span>Write Review</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        {cancellingBooking && (
          <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '440px' }}>
              <div className="modal-header">
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--danger)' }}>
                  Confirm Cancellation
                </h3>
                <button onClick={() => setCancellingBooking(null)} style={{ background: 'none', border: 'none' }}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <p style={{ fontSize: '14px', color: 'var(--dark-light)', lineHeight: '1.6' }}>
                  Are you sure you want to cancel your reservation for <strong>{cancellingBooking.vehicleName}</strong>?
                </p>
                {cancellingBooking.paymentStatus === 'SUCCESS' && (
                  <p style={{ fontSize: '13px', color: '#10b981', marginTop: '10px' }}>
                    Note: A full refund of ₹{cancellingBooking.totalAmount?.toLocaleString()} will be automatically processed.
                  </p>
                )}
              </div>
              <div className="modal-footer">
                <button onClick={() => setCancellingBooking(null)} className="btn btn-outline btn-sm">
                  Nevermind
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={cancelLoading}
                  className="btn btn-danger btn-sm"
                >
                  {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {reviewBooking && (
          <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '520px' }}>
              <div className="modal-header">
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Review Your Rental</h3>
                  <span style={{ fontSize: '13px', color: 'var(--gray-text)' }}>{reviewBooking.vehicleName}</span>
                </div>
                <button onClick={() => setReviewBooking(null)} style={{ background: 'none', border: 'none' }}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                {reviewSuccess && (
                  <div className="alert alert-success">
                    <CheckCircle size={16} />
                    <span>{reviewSuccess}</span>
                  </div>
                )}
                {reviewError && (
                  <div className="alert alert-error">
                    <AlertTriangle size={16} />
                    <span>{reviewError}</span>
                  </div>
                )}

                <form onSubmit={handleReviewSubmit}>
                  {/* Rating selector */}
                  <div className="form-group">
                    <label className="form-label">Your Rating (1 to 5 Stars)</label>
                    <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                        >
                          <Star
                            size={32}
                            color={star <= rating ? '#f59e0b' : '#cbd5e1'}
                            fill={star <= rating ? '#f59e0b' : 'transparent'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Review Comment</label>
                    <textarea
                      className="form-textarea"
                      rows="4"
                      placeholder="Share your driving experience, vehicle condition, comfort, and service..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" onClick={() => setReviewBooking(null)} className="btn btn-outline btn-sm">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="btn btn-primary btn-sm"
                    >
                      {reviewSubmitting ? 'Submitting...' : 'Post Verified Review'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Digital Receipt Modal */}
        {receiptBooking && (
          <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '580px' }}>
              <div className="modal-header">
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Official Rental Receipt</h3>
                  <span style={{ fontSize: '12px', color: 'var(--gray-text)' }}>Booking Reference #{receiptBooking.id}</span>
                </div>
                <button onClick={() => setReceiptBooking(null)} style={{ background: 'none', border: 'none' }}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body" style={{ fontSize: '14px' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--dark)' }}>
                    Auto<span style={{ color: 'var(--primary)' }}>Rental</span>
                  </h2>
                  <span style={{ fontSize: '12px', color: 'var(--gray-text)' }}>Vehicle Rental Management System</span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  backgroundColor: 'var(--gray-light)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px'
                }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--gray-text)' }}>Customer Name:</span>
                    <strong style={{ display: 'block' }}>{receiptBooking.userName}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--gray-text)' }}>Customer Email:</span>
                    <span style={{ display: 'block' }}>{receiptBooking.userEmail}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--gray-text)' }}>Vehicle:</span>
                    <strong style={{ display: 'block' }}>{receiptBooking.vehicleName}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--gray-text)' }}>Vehicle Number:</span>
                    <span style={{ display: 'block' }}>{receiptBooking.vehicleNumber}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--gray-text)' }}>Rental Period:</span>
                    <span style={{ display: 'block' }}>{receiptBooking.pickupDate} to {receiptBooking.returnDate}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--gray-text)' }}>Total Days:</span>
                    <strong style={{ display: 'block' }}>{receiptBooking.numberOfDays} days</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--gray-border)' }}>
                  <span>Daily Rental Charge:</span>
                  <span>₹{receiptBooking.pricePerDay?.toLocaleString()} × {receiptBooking.numberOfDays}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--gray-border)' }}>
                  <span>Taxes & Comprehensive Insurance:</span>
                  <span style={{ color: '#10b981' }}>Included (0.00)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', fontWeight: '800', fontSize: '18px' }}>
                  <span>Total Amount Paid:</span>
                  <span style={{ color: 'var(--primary)' }}>₹{receiptBooking.totalAmount?.toLocaleString()}</span>
                </div>

                <div style={{ marginTop: '14px', fontSize: '12px', color: 'var(--gray-text)', textAlign: 'center' }}>
                  Transaction ID: <code>{receiptBooking.transactionId || 'SIMULATED-TXN'}</code> • Method: {receiptBooking.paymentMethod || 'CARD'}
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={() => window.print()} className="btn btn-primary btn-sm">
                  Print Invoice
                </button>
                <button onClick={() => setReceiptBooking(null)} className="btn btn-outline btn-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
