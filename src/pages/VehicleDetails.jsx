import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import BookingModal from '../components/BookingModal';
import {
  Car, Fuel, Gauge, Users, MapPin, Star, Shield,
  CheckCircle, ArrowLeft, Calendar, MessageSquare, AlertCircle
} from 'lucide-react';

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Quick estimator state
  const getTodayString = () => new Date().toISOString().split('T')[0];
  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [pickupDate, setPickupDate] = useState(getTodayString());
  const [returnDate, setReturnDate] = useState(getTomorrowString());
  const [estimatedDays, setEstimatedDays] = useState(1);

  useEffect(() => {
    fetchVehicleData();
  }, [id]);

  useEffect(() => {
    if (pickupDate && returnDate) {
      const start = new Date(pickupDate);
      const end = new Date(returnDate);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setEstimatedDays(diff > 0 ? diff : 1);
    }
  }, [pickupDate, returnDate]);

  const fetchVehicleData = async () => {
    setLoading(true);
    try {
      const [vRes, rRes] = await Promise.all([
        api.get(`/vehicles/${id}`),
        api.get(`/reviews/vehicle/${id}`),
      ]);

      if (vRes.data.success) setVehicle(vRes.data.data);
      if (rRes.data.success) setReviews(rRes.data.data);
    } catch (err) {
      setError('Failed to load vehicle details. Please check if the vehicle exists.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="alert alert-error" style={{ maxWidth: '500px', margin: '0 auto 20px' }}>
          <AlertCircle size={20} />
          <span>{error || 'Vehicle not found.'}</span>
        </div>
        <Link to="/vehicles" className="btn btn-primary">
          Back to Fleet Catalog
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ marginBottom: '24px' }}>
          <Link to="/vehicles" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: '600', fontSize: '14px' }}>
            <ArrowLeft size={16} />
            <span>Back to All Vehicles</span>
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Left Column: Image, Specs & Reviews */}
          <div>
            {/* Main Image */}
            <div style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              backgroundColor: '#e2e8f0',
              height: '420px',
              position: 'relative',
              marginBottom: '28px',
              boxShadow: 'var(--shadow-md)'
            }}>
              <img
                src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                alt={vehicle.vehicleName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                <span className={`badge badge-${vehicle.availabilityStatus.toLowerCase()}`} style={{ padding: '6px 14px', fontSize: '13px' }}>
                  {vehicle.availabilityStatus}
                </span>
              </div>
            </div>

            {/* Vehicle Header */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>
                  {vehicle.brand} • {vehicle.vehicleType}
                </span>
                <span style={{ color: 'var(--gray-border)' }}>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--gray-text)' }}>
                  <MapPin size={14} /> {vehicle.location}
                </span>
              </div>
              <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '8px' }}>
                {vehicle.vehicleName}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: '700', fontSize: '15px' }}>
                  <Star size={18} fill="#f59e0b" />
                  <span>{vehicle.averageRating > 0 ? vehicle.averageRating : '5.0'}</span>
                </div>
                <span style={{ fontSize: '14px', color: 'var(--gray-text)' }}>
                  ({vehicle.totalReviews || reviews.length} verified customer reviews)
                </span>
              </div>
            </div>

            {/* Technical Specifications Grid */}
            <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
                Vehicle Specifications
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--gray-light)', borderRadius: 'var(--radius-md)' }}>
                  <Fuel size={22} color="var(--primary)" />
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--gray-text)', textTransform: 'uppercase', display: 'block' }}>Fuel Type</span>
                    <strong style={{ fontSize: '14px' }}>{vehicle.fuelType}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--gray-light)', borderRadius: 'var(--radius-md)' }}>
                  <Gauge size={22} color="var(--primary)" />
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--gray-text)', textTransform: 'uppercase', display: 'block' }}>Transmission</span>
                    <strong style={{ fontSize: '14px' }}>{vehicle.transmission}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--gray-light)', borderRadius: 'var(--radius-md)' }}>
                  <Users size={22} color="var(--primary)" />
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--gray-text)', textTransform: 'uppercase', display: 'block' }}>Capacity</span>
                    <strong style={{ fontSize: '14px' }}>{vehicle.seatingCapacity} Passengers</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--gray-light)', borderRadius: 'var(--radius-md)' }}>
                  <Car size={22} color="var(--primary)" />
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--gray-text)', textTransform: 'uppercase', display: 'block' }}>Reg. Number</span>
                    <strong style={{ fontSize: '14px' }}>{vehicle.vehicleNumber}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>
                About this Vehicle
              </h3>
              <p style={{ color: 'var(--dark-light)', fontSize: '15px', lineHeight: '1.7' }}>
                {vehicle.description || 'This premium rental vehicle comes thoroughly sanitised and fully serviced with manufacturer warranty. Equipped with climate control, Bluetooth infotainment, advanced airbags, and standard roadside coverage.'}
              </p>
            </div>

            {/* Customer Reviews Section */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={20} color="var(--primary)" />
                  <span>Customer Reviews & Ratings</span>
                </h3>
                <span className="badge badge-info">{reviews.length} Reviews</span>
              </div>

              {reviews.length === 0 ? (
                <p style={{ color: 'var(--gray-text)', fontSize: '14px', fontStyle: 'italic' }}>
                  No customer reviews yet. Customers who complete a rental with this vehicle can leave reviews.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {reviews.map((rev) => (
                    <div key={rev.id} style={{
                      padding: '16px',
                      backgroundColor: 'var(--gray-light)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--gray-border)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div>
                          <strong style={{ fontSize: '14px', display: 'block' }}>{rev.userName || 'Verified Customer'}</strong>
                          <span style={{ fontSize: '11px', color: 'var(--gray-text)' }}>
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              color={i < rev.rating ? '#f59e0b' : '#cbd5e1'}
                              fill={i < rev.rating ? '#f59e0b' : 'transparent'}
                            />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--dark)', lineHeight: '1.5' }}>
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Booking / Price Calculator Box */}
          <div style={{ position: 'sticky', top: '94px' }}>
            <div className="card" style={{ padding: '28px', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--gray-text)', textTransform: 'uppercase', fontWeight: '700' }}>
                    Rental Rate
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '32px', fontWeight: '800', color: 'var(--dark)' }}>
                      ₹{vehicle.pricePerDay?.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '14px', color: 'var(--gray-text)' }}>/ day</span>
                  </div>
                </div>
                <span className={`badge badge-${vehicle.availabilityStatus.toLowerCase()}`}>
                  {vehicle.availabilityStatus}
                </span>
              </div>

              {/* Instant Calculator Fields */}
              <div style={{ marginBottom: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Pickup Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={pickupDate}
                    min={getTodayString()}
                    onChange={(e) => setPickupDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Return Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={returnDate}
                    min={pickupDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div style={{
                backgroundColor: 'var(--gray-light)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '24px',
                fontSize: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Duration:</span>
                  <strong>{estimatedDays} Day{estimatedDays > 1 ? 's' : ''}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>₹{vehicle.pricePerDay?.toLocaleString()} × {estimatedDays} days:</span>
                  <span>₹{(estimatedDays * vehicle.pricePerDay)?.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#10b981' }}>
                  <span>Insurance & Sanitization:</span>
                  <span>FREE</span>
                </div>
                <div style={{
                  borderTop: '1px solid var(--gray-border)',
                  paddingTop: '10px',
                  marginTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: '800',
                  fontSize: '18px'
                }}>
                  <span>Total Amount:</span>
                  <span style={{ color: 'var(--primary)' }}>
                    ₹{(estimatedDays * vehicle.pricePerDay)?.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setBookingModalOpen(true)}
                disabled={vehicle.availabilityStatus !== 'AVAILABLE'}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginBottom: '16px' }}
              >
                {vehicle.availabilityStatus === 'AVAILABLE' ? 'Book This Vehicle' : 'Currently Unavailable'}
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--gray-text)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={14} color="#10b981" /> Instant digital reservation & invoice
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={14} color="#10b981" /> Free cancellation before trip pickup
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={14} color="#10b981" /> 24/7 breakdown helpline assistance
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        vehicle={vehicle}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </div>
  );
};

export default VehicleDetails;
