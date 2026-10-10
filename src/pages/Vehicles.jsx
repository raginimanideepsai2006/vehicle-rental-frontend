import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import BookingModal from '../components/BookingModal';
import {
  Search, Filter, Fuel, Gauge, Users, Star, RotateCcw,
  SlidersHorizontal, MapPin
} from 'lucide-react';

const Vehicles = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || 10000);
  const [sortBy, setSortBy] = useState('recommended');

  const [bookingVehicle, setBookingVehicle] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, [type, status, location, maxPrice]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = {};
      if (type) params.type = type;
      if (status) params.status = status;
      if (location) params.location = location;
      if (maxPrice) params.maxPrice = maxPrice;
      if (keyword) params.keyword = keyword;

      const response = await api.get('/vehicles', { params });
      if (response.data.success) {
        setVehicles(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchVehicles();
  };

  const handleResetFilters = () => {
    setKeyword('');
    setType('');
    setStatus('');
    setLocation('');
    setMaxPrice(10000);
    setSortBy('recommended');
    setSearchParams({});
  };

  // Client-side sorting
  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (sortBy === 'price-asc') return a.pricePerDay - b.pricePerDay;
    if (sortBy === 'price-desc') return b.pricePerDay - a.pricePerDay;
    if (sortBy === 'rating-desc') return (b.averageRating || 0) - (a.averageRating || 0);
    return 0;
  });

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Vehicle Fleet Catalog
          </h1>
          <p style={{ color: 'var(--gray-text)', fontSize: '15px' }}>
            Browse, filter, and inspect verified rental cars, SUVs, and bikes.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
          <form onSubmit={handleSearchSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '20px'
            }}>
              {/* Keyword Search */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Search Keyword</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search model, brand..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    style={{ paddingLeft: '38px' }}
                  />
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--gray-text)' }} />
                </div>
              </div>

              {/* Vehicle Type */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Vehicle Type</label>
                <select
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
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

              {/* Location */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Location / City</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Bangalore, Mumbai"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{ paddingLeft: '38px' }}
                  />
                  <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--gray-text)' }} />
                </div>
              </div>

              {/* Availability Status */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Availability</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="AVAILABLE">Available Now</option>
                  <option value="BOOKED">Booked</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Max Price / Day</label>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>
                    ₹{Number(maxPrice).toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="800"
                  max="12000"
                  step="200"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Search size={16} />
                  <span>Apply Search</span>
                </button>
                <button type="button" onClick={handleResetFilters} className="btn btn-outline btn-sm">
                  <RotateCcw size={16} />
                  <span>Reset</span>
                </button>
              </div>

              {/* Sort By */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--gray-text)' }}>Sort by:</span>
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
                >
                  <option value="recommended">Featured / Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--gray-text)' }}>
            Showing <strong>{sortedVehicles.length}</strong> available vehicles
          </span>
        </div>

        {/* Vehicle Cards Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div className="spinner"></div>
          </div>
        ) : sortedVehicles.length === 0 ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <SlidersHorizontal size={48} color="var(--gray-text)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
              No vehicles matched your criteria
            </h3>
            <p style={{ color: 'var(--gray-text)', fontSize: '14px', marginBottom: '20px' }}>
              Try broadening your filters, choosing a different location, or resetting filters.
            </p>
            <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {sortedVehicles.map((v) => (
              <div key={v.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Image */}
                <div style={{ position: 'relative', height: '210px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                  <img
                    src={v.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                    alt={v.vehicleName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
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

                {/* Body */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>
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

                  <p style={{ fontSize: '13px', color: 'var(--gray-text)', lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '14px' }}>
                    {v.description || 'Premium well-conditioned vehicle available for daily and weekly rentals.'}
                  </p>

                  {/* Specs */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                    padding: '10px 0',
                    borderTop: '1px solid var(--gray-border)',
                    borderBottom: '1px solid var(--gray-border)',
                    fontSize: '12px',
                    color: 'var(--gray-text)',
                    marginBottom: '16px'
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

                  {/* Pricing & Actions */}
                  <div style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--gray-text)', display: 'block' }}>Daily rate</span>
                      <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--dark)' }}>
                        ₹{v.pricePerDay?.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--gray-text)' }}>/day</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/vehicles/${v.id}`} className="btn btn-outline btn-sm">
                        View Details
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

      {/* Booking Modal */}
      <BookingModal
        vehicle={bookingVehicle}
        isOpen={!!bookingVehicle}
        onClose={() => setBookingVehicle(null)}
      />
    </div>
  );
};

export default Vehicles;
