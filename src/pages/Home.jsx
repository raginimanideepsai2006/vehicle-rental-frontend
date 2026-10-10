import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import BookingModal from '../components/BookingModal';
import {
  Search, Shield, Clock, Star, Car, Fuel, Gauge, Users,
  ChevronRight, CheckCircle2, Award, ArrowRight
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [bookingVehicle, setBookingVehicle] = useState(null);

  useEffect(() => {
    fetchFeaturedVehicles();
  }, []);

  const fetchFeaturedVehicles = async () => {
    try {
      const response = await api.get('/vehicles');
      if (response.data.success) {
        setVehicles(response.data.data.slice(0, 6));
      }
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchLocation) queryParams.set('location', searchLocation);
    if (selectedType) queryParams.set('type', selectedType);
    navigate(`/vehicles?${queryParams.toString()}`);
  };

  const categories = [
    { type: 'SEDAN', label: 'Sedans', icon: '🚗', desc: 'Sleek & comfortable' },
    { type: 'SUV', label: 'SUVs', icon: '🚙', desc: 'Spacious & rugged' },
    { type: 'BIKE', label: 'Bikes', icon: '🏍️', desc: 'Cruisers & sports' },
    { type: 'LUXURY', label: 'Luxury', icon: '✨', desc: 'Premium prestige' },
    { type: 'VAN', label: 'Vans / MPVs', icon: '🚐', desc: 'Family & group trips' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        color: 'white',
        padding: '80px 0 100px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '24px',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <Award size={16} color="#38bdf8" />
              <span>Premium Fleet • Instant Confirmation • Zero Hidden Fees</span>
            </div>

            <h1 style={{
              fontSize: '48px',
              fontWeight: '800',
              letterSpacing: '-1.5px',
              lineHeight: '1.15',
              marginBottom: '20px'
            }}>
              Rent the Perfect Vehicle for <span style={{
                background: 'linear-gradient(to right, #818cf8, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Every Journey</span>
            </h1>

            <p style={{
              fontSize: '18px',
              color: '#cbd5e1',
              marginBottom: '36px',
              lineHeight: '1.6',
              maxWidth: '620px',
              margin: '0 auto 36px'
            }}>
              Choose from hundreds of certified cars, bikes, and luxury vehicles. Book with flexible dates, guaranteed availability, and simulated instant checkout.
            </p>

            {/* Hero Quick Search Box */}
            <form onSubmit={handleHeroSearch} style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '12px',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
              textAlign: 'left'
            }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--gray-text)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  City / Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bangalore, Delhi, Goa..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: 'var(--dark)'
                  }}
                />
              </div>

              <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--gray-border)' }} />

              <div style={{ flex: '1 1 180px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--gray-text)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Category
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: 'var(--dark)',
                    backgroundColor: 'transparent'
                  }}
                >
                  <option value="">All Categories</option>
                  <option value="CAR">Car</option>
                  <option value="SUV">SUV</option>
                  <option value="SEDAN">Sedan</option>
                  <option value="BIKE">Bike</option>
                  <option value="LUXURY">Luxury</option>
                  <option value="VAN">Van</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ flex: '0 0 auto', padding: '14px 30px' }}
              >
                <Search size={18} />
                <span>Search Fleet</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Category Chips Bar */}
      <section style={{ padding: '40px 0', backgroundColor: 'white', borderBottom: '1px solid var(--gray-border)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px'
          }}>
            {categories.map((cat) => (
              <Link
                key={cat.type}
                to={`/vehicles?type=${cat.type}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--gray-light)',
                  border: '1px solid var(--gray-border)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'var(--gray-border)';
                  e.currentTarget.style.backgroundColor = 'var(--gray-light)';
                }}
              >
                <span style={{ fontSize: '28px' }}>{cat.icon}</span>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--dark)' }}>{cat.label}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--gray-text)' }}>{cat.desc}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section style={{ padding: '70px 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '36px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                TOP PICKS
              </span>
              <h2 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Featured Rental Fleet
              </h2>
            </div>
            <Link to="/vehicles" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>View All Vehicles</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <div className="spinner"></div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {vehicles.map((v) => (
                <div key={v.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Image container */}
                  <div style={{ position: 'relative', height: '200px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                    <img
                      src={v.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                      alt={v.vehicleName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px'
                    }}>
                      <span className={`badge badge-${v.availabilityStatus.toLowerCase()}`}>
                        {v.availabilityStatus}
                      </span>
                    </div>
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(4px)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Star size={14} color="#f59e0b" fill="#f59e0b" />
                      <span>{v.averageRating > 0 ? v.averageRating : '5.0'}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>
                          {v.brand} • {v.vehicleType}
                        </span>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--dark)' }}>
                          {v.vehicleName}
                        </h3>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--gray-text)', backgroundColor: 'var(--gray-light)', padding: '2px 8px', borderRadius: '4px' }}>
                        {v.location}
                      </span>
                    </div>

                    {/* Specs Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                      margin: '14px 0',
                      padding: '10px 0',
                      borderTop: '1px solid var(--gray-border)',
                      borderBottom: '1px solid var(--gray-border)',
                      fontSize: '12px',
                      color: 'var(--gray-text)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Fuel size={14} />
                        <span>{v.fuelType}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Gauge size={14} />
                        <span>{v.transmission}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={14} />
                        <span>{v.seatingCapacity} Seats</span>
                      </div>
                    </div>

                    <div style={{
                      marginTop: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '6px'
                    }}>
                      <div>
                        <span style={{ fontSize: '12px', color: 'var(--gray-text)', display: 'block' }}>Daily rate</span>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--dark)' }}>
                          ₹{v.pricePerDay?.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--gray-text)' }}>/day</span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link to={`/vehicles/${v.id}`} className="btn btn-outline btn-sm">
                          Details
                        </Link>
                        <button
                          onClick={() => setBookingVehicle(v)}
                          disabled={v.availabilityStatus !== 'AVAILABLE'}
                          className="btn btn-primary btn-sm"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ backgroundColor: 'white', padding: '80px 0', borderTop: '1px solid var(--gray-border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            HOW IT WORKS
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '48px', letterSpacing: '-0.5px' }}>
            Rent in 4 Simple Steps
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '30px'
          }}>
            {[
              { step: '01', title: 'Choose Vehicle', desc: 'Browse our expansive fleet of cars, bikes, and luxury SUVs tailored to your style.' },
              { step: '02', title: 'Select Dates', desc: 'Pick your pickup and return dates with automatic real-time availability checks.' },
              { step: '03', title: 'Simulated Payment', desc: 'Pay securely using mock UPI QR code, Card, or choose Cash on Pickup.' },
              { step: '04', title: 'Enjoy Your Journey', desc: 'Pick up your sanitized keys at your designated city hub and hit the highway!' },
            ].map((s, idx) => (
              <div key={idx} style={{
                backgroundColor: 'var(--gray-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '30px 24px',
                textAlign: 'left',
                position: 'relative'
              }}>
                <span style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: 'var(--primary)',
                  display: 'block',
                  marginBottom: '12px'
                }}>
                  {s.step}
                </span>
                <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: 'var(--dark)' }}>
                  {s.title}
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--gray-text)', lineHeight: '1.6' }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: '80px 0', backgroundColor: '#0f172a', color: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
            <span style={{ color: '#38bdf8', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              OUR PROMISE
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px', marginTop: '6px' }}>
              Why Drivers Prefer AutoRental
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px'
          }}>
            {[
              { icon: <Shield size={28} color="#38bdf8" />, title: '100% Insured Fleet', desc: 'All rides include comprehensive collision damage protection and road liability coverage.' },
              { icon: <Clock size={28} color="#818cf8" />, title: '24/7 Roadside Assist', desc: 'Towing, flat tyre fixes, and jump-starts anywhere across national highways.' },
              { icon: <CheckCircle2 size={28} color="#34d399" />, title: 'No Hidden Charges', desc: 'Transparent upfront daily pricing without nasty surprise deductions at return.' },
              { icon: <Award size={28} color="#fbbf24" />, title: 'Impeccable Maintenance', desc: 'Rigorous 40-point safety inspection conducted prior to every single client checkout.' },
            ].map((f, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                textAlign: 'left'
              }}>
                <div style={{ marginBottom: '16px' }}>{f.icon}</div>
                <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{f.title}</h4>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal instance */}
      <BookingModal
        vehicle={bookingVehicle}
        isOpen={!!bookingVehicle}
        onClose={() => setBookingVehicle(null)}
      />
    </div>
  );
};

export default Home;
