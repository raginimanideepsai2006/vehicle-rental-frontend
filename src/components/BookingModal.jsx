import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, CreditCard, QrCode, Banknote, CheckCircle, AlertTriangle, X, ShieldCheck } from 'lucide-react';

const BookingModal = ({ vehicle, isOpen, onClose }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const getTodayString = () => new Date().toISOString().split('T')[0];
  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [pickupDate, setPickupDate] = useState(getTodayString());
  const [returnDate, setReturnDate] = useState(getTomorrowString());
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [totalAmount, setTotalAmount] = useState(vehicle?.pricePerDay || 0);

  // Card details state
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8899');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');

  // UPI state
  const [upiId, setUpiId] = useState('customer@okaxis');

  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    if (!pickupDate || !returnDate || !vehicle) return;

    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const validDays = diffDays > 0 ? diffDays : 1;

    setNumberOfDays(validDays);
    setTotalAmount(validDays * vehicle.pricePerDay);

    // Live availability check
    checkDatesAvailability(pickupDate, returnDate);
  }, [pickupDate, returnDate, vehicle]);

  const checkDatesAvailability = async (start, end) => {
    if (!vehicle) return;
    setCheckingAvailability(true);
    setError('');
    try {
      const response = await api.get('/bookings/check-availability', {
        params: {
          vehicleId: vehicle.id,
          pickupDate: start,
          returnDate: end,
        },
      });
      setIsAvailable(response.data.data);
      setAvailabilityMessage(response.data.message);
    } catch (err) {
      setIsAvailable(false);
      setAvailabilityMessage('Could not verify availability.');
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isAvailable) {
      setError('Please choose dates where the vehicle is available.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        vehicleId: vehicle.id,
        pickupDate,
        returnDate,
        paymentMethod,
      };

      const response = await api.post('/bookings', payload);
      if (response.data.success) {
        setConfirmedBooking(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Booking creation failed. Please check date selections.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !vehicle) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>
              {confirmedBooking ? 'Booking Confirmed!' : `Reserve ${vehicle.vehicleName}`}
            </h3>
            <span style={{ fontSize: '13px', color: 'var(--gray-text)' }}>
              {vehicle.brand} {vehicle.model} • {vehicle.location}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--gray-text)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {confirmedBooking ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--success-bg)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <CheckCircle size={36} />
              </div>

              <h4 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>
                Rental Reserved Successfully!
              </h4>
              <p style={{ color: 'var(--gray-text)', fontSize: '14px', marginBottom: '24px' }}>
                Your booking request is confirmed. A copy of the digital receipt is saved in your account.
              </p>

              <div style={{
                backgroundColor: 'var(--gray-light)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                textAlign: 'left',
                marginBottom: '24px',
                fontSize: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray-text)' }}>Booking ID:</span>
                  <strong>#{confirmedBooking.id}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray-text)' }}>Vehicle:</span>
                  <strong>{confirmedBooking.vehicleName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray-text)' }}>Duration:</span>
                  <span>{confirmedBooking.pickupDate} to {confirmedBooking.returnDate} ({confirmedBooking.numberOfDays} days)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray-text)' }}>Total Paid:</span>
                  <strong style={{ color: 'var(--primary)', fontSize: '16px' }}>₹{confirmedBooking.totalAmount?.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray-text)' }}>Transaction ID:</span>
                  <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>
                    {confirmedBooking.transactionId || 'N/A'}
                  </code>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/my-bookings');
                  }}
                  className="btn btn-primary"
                >
                  View in My Bookings
                </button>
                <button onClick={onClose} className="btn btn-outline">
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-error">
                  <AlertTriangle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* Date Selection */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Pickup Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={pickupDate}
                    min={getTodayString()}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Return Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={returnDate}
                    min={pickupDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Live Availability Notice */}
              <div style={{
                marginBottom: '20px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isAvailable ? 'var(--success-bg)' : 'var(--danger-bg)',
                color: isAvailable ? '#065f46' : '#991b1b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '13px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isAvailable ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
                  <span>{checkingAvailability ? 'Verifying vehicle schedule...' : availabilityMessage}</span>
                </div>
                <span style={{ fontWeight: '700' }}>
                  {numberOfDays} Day{numberOfDays > 1 ? 's' : ''}
                </span>
              </div>

              {/* Cost Breakdown */}
              <div style={{
                backgroundColor: 'var(--gray-light)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                marginBottom: '22px',
                fontSize: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>Daily Rate:</span>
                  <span>₹{vehicle.pricePerDay?.toLocaleString()} / day</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>Rental Duration:</span>
                  <span>{numberOfDays} days</span>
                </div>
                <div style={{
                  borderTop: '1px solid var(--gray-border)',
                  paddingTop: '8px',
                  marginTop: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: '800',
                  fontSize: '16px'
                }}>
                  <span>Estimated Total:</span>
                  <span style={{ color: 'var(--primary)' }}>₹{totalAmount?.toLocaleString()}</span>
                </div>
              </div>

              {/* Simulated Payment Gateway Selection */}
              <div style={{ marginBottom: '22px' }}>
                <label className="form-label" style={{ marginBottom: '10px' }}>
                  Simulated Payment Method
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'CARD' ? '2px solid var(--primary)' : '1px solid var(--gray-border)',
                      backgroundColor: paymentMethod === 'CARD' ? 'var(--primary-light)' : 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    <CreditCard size={20} color={paymentMethod === 'CARD' ? 'var(--primary)' : 'var(--gray-text)'} />
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'UPI' ? '2px solid var(--primary)' : '1px solid var(--gray-border)',
                      backgroundColor: paymentMethod === 'UPI' ? 'var(--primary-light)' : 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    <QrCode size={20} color={paymentMethod === 'UPI' ? 'var(--primary)' : 'var(--gray-text)'} />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CASH')}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'CASH' ? '2px solid var(--primary)' : '1px solid var(--gray-border)',
                      backgroundColor: paymentMethod === 'CASH' ? 'var(--primary-light)' : 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    <Banknote size={20} color={paymentMethod === 'CASH' ? 'var(--primary)' : 'var(--gray-text)'} />
                    <span>Pay at Pickup</span>
                  </button>
                </div>

                {/* Simulated Payment Sub-form */}
                {paymentMethod === 'CARD' && (
                  <div style={{
                    backgroundColor: '#fafafa',
                    border: '1px solid var(--gray-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    fontSize: '13px'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--gray-text)', fontWeight: '600' }}>CARD NUMBER</span>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '6px 10px', fontSize: '13px' }}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                        />
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--gray-text)', fontWeight: '600' }}>EXPIRY</span>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '6px 10px', fontSize: '13px' }}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                        />
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--gray-text)', fontWeight: '600' }}>CVV</span>
                        <input
                          type="password"
                          className="form-input"
                          style={{ padding: '6px 10px', fontSize: '13px' }}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'UPI' && (
                  <div style={{
                    backgroundColor: '#fafafa',
                    border: '1px solid var(--gray-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: 'white',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <QrCode size={40} color="#0f172a" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '11px', color: 'var(--gray-text)', fontWeight: '600' }}>VPA / UPI ID</span>
                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: '6px 10px', fontSize: '13px' }}
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'CASH' && (
                  <div style={{
                    backgroundColor: '#fafafa',
                    border: '1px solid var(--gray-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    fontSize: '13px',
                    color: 'var(--gray-text)'
                  }}>
                    Pay in cash or credit card at our local fleet hub during vehicle handover.
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={onClose} className="btn btn-outline">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isAvailable || submitting}
                  className="btn btn-primary"
                  style={{ minWidth: '160px' }}
                >
                  {submitting ? 'Confirming...' : `Pay ₹${totalAmount?.toLocaleString()} & Book`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
