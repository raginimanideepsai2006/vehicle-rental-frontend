import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Car, Plus, Edit, Trash2, Search, X, CheckCircle,
  AlertTriangle, Filter, MapPin
} from 'lucide-react';

const ManageVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Add / Edit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Delete Modal state
  const [deletingVehicle, setDeletingVehicle] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const initialForm = {
    vehicleName: '',
    vehicleNumber: '',
    vehicleType: 'SEDAN',
    brand: '',
    model: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 5,
    pricePerDay: 2000,
    location: 'Bangalore',
    description: '',
    imageUrl: '',
    availabilityStatus: 'AVAILABLE',
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await api.get('/vehicles');
      if (response.data.success) {
        setVehicles(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setModalError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (v) => {
    setEditingId(v.id);
    setFormData({
      vehicleName: v.vehicleName,
      vehicleNumber: v.vehicleNumber,
      vehicleType: v.vehicleType,
      brand: v.brand,
      model: v.model,
      fuelType: v.fuelType,
      transmission: v.transmission,
      seatingCapacity: v.seatingCapacity,
      pricePerDay: v.pricePerDay,
      location: v.location,
      description: v.description || '',
      imageUrl: v.imageUrl || '',
      availabilityStatus: v.availabilityStatus,
    });
    setModalError('');
    setModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');

    try {
      if (editingId) {
        const response = await api.put(`/vehicles/${editingId}`, formData);
        if (response.data.success) {
          setModalOpen(false);
          fetchVehicles();
        }
      } else {
        const response = await api.post('/vehicles', formData);
        if (response.data.success) {
          setModalOpen(false);
          fetchVehicles();
        }
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to save vehicle details');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingVehicle) return;
    setDeleteLoading(true);
    try {
      const response = await api.delete(`/vehicles/${deletingVehicle.id}`);
      if (response.data.success) {
        setDeletingVehicle(null);
        fetchVehicles();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete vehicle');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleStatus = async (vehicle) => {
    const newStatus = vehicle.availabilityStatus === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE';
    try {
      await api.patch(`/vehicles/${vehicle.id}/availability?status=${newStatus}`);
      fetchVehicles();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = search === '' ||
      v.vehicleName.toLowerCase().includes(search.toLowerCase()) ||
      v.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.brand.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === '' || v.vehicleType === typeFilter;
    return matchesSearch && matchesType;
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
              Fleet Management
            </h1>
            <p style={{ color: 'var(--gray-text)', fontSize: '15px' }}>
              Add, update, retire, or toggle maintenance status of vehicles.
            </p>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={18} />
            <span>Add New Vehicle</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="card" style={{ padding: '18px 24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: '1 1 240px', position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by name, reg number, or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--gray-text)' }} />
            </div>

            <div style={{ width: '180px' }}>
              <select
                className="form-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="CAR">Car</option>
                <option value="SUV">SUV</option>
                <option value="SEDAN">Sedan</option>
                <option value="BIKE">Bike</option>
                <option value="LUXURY">Luxury</option>
                <option value="VAN">Van</option>
              </select>
            </div>

            <span style={{ fontSize: '13px', color: 'var(--gray-text)', marginLeft: 'auto' }}>
              Total: <strong>{filteredVehicles.length}</strong> vehicles
            </span>
          </div>
        </div>

        {/* Vehicles Table */}
        <div className="card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Reg Number</th>
                  <th>Type & Specs</th>
                  <th>Location</th>
                  <th>Price / Day</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                      <div className="spinner" style={{ margin: '0 auto' }}></div>
                    </td>
                  </tr>
                ) : filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-text)' }}>
                      No vehicles found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((v) => (
                    <tr key={v.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={v.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=120&q=80'}
                            alt={v.vehicleName}
                            style={{ width: '56px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <div>
                            <strong style={{ fontSize: '14px', display: 'block' }}>{v.vehicleName}</strong>
                            <span style={{ fontSize: '12px', color: 'var(--gray-text)' }}>{v.brand} {v.model}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code style={{ background: '#f1f5f9', padding: '3px 6px', borderRadius: '4px', fontSize: '12px' }}>
                          {v.vehicleNumber}
                        </code>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px', fontWeight: '600', display: 'block' }}>{v.vehicleType}</span>
                        <span style={{ fontSize: '12px', color: 'var(--gray-text)' }}>
                          {v.fuelType} • {v.transmission} • {v.seatingCapacity} seats
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px' }}>{v.location}</span>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--primary)', fontSize: '15px' }}>
                          ₹{v.pricePerDay?.toLocaleString()}
                        </strong>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleStatus(v)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                          title="Click to toggle Available / Maintenance"
                        >
                          <span className={`badge badge-${v.availabilityStatus.toLowerCase()}`}>
                            {v.availabilityStatus}
                          </span>
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenEdit(v)}
                            className="btn btn-outline btn-sm"
                            title="Edit Vehicle"
                            style={{ padding: '6px' }}
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => setDeletingVehicle(v)}
                            className="btn btn-outline btn-sm"
                            title="Delete Vehicle"
                            style={{ padding: '6px', color: 'var(--danger)', borderColor: '#fecaca' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / Edit Modal */}
        {modalOpen && (
          <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '680px' }}>
              <div className="modal-header">
                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>
                  {editingId ? 'Edit Vehicle Details' : 'Add New Vehicle to Fleet'}
                </h3>
                <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none' }}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                {modalError && (
                  <div className="alert alert-error">
                    <AlertTriangle size={16} />
                    <span>{modalError}</span>
                  </div>
                )}

                <form onSubmit={handleModalSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Vehicle Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Honda City 5th Gen"
                        value={formData.vehicleName}
                        onChange={(e) => setFormData({ ...formData, vehicleName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Registration Number</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. KA-01-AB-1234"
                        value={formData.vehicleNumber}
                        onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Vehicle Type / Category</label>
                      <select
                        className="form-select"
                        value={formData.vehicleType}
                        onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                      >
                        <option value="CAR">Car</option>
                        <option value="SUV">SUV</option>
                        <option value="SEDAN">Sedan</option>
                        <option value="BIKE">Bike</option>
                        <option value="LUXURY">Luxury</option>
                        <option value="VAN">Van</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Brand</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Honda, Toyota"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Model</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. ZX CVT"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Fuel Type</label>
                      <select
                        className="form-select"
                        value={formData.fuelType}
                        onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Transmission</label>
                      <select
                        className="form-select"
                        value={formData.transmission}
                        onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                      >
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Seating Capacity</label>
                      <input
                        type="number"
                        className="form-input"
                        min="1"
                        max="20"
                        value={formData.seatingCapacity}
                        onChange={(e) => setFormData({ ...formData, seatingCapacity: Number(e.target.value) })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Price Per Day (₹)</label>
                      <input
                        type="number"
                        className="form-input"
                        min="1"
                        value={formData.pricePerDay}
                        onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Location / City</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Bangalore"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Availability Status</label>
                      <select
                        className="form-select"
                        value={formData.availabilityStatus}
                        onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="BOOKED">BOOKED</option>
                        <option value="MAINTENANCE">MAINTENANCE</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Image URL</label>
                      <input
                        type="url"
                        className="form-input"
                        placeholder="https://images.unsplash.com/..."
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      rows="3"
                      placeholder="Vehicle features, condition, amenities..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={modalLoading}
                      className="btn btn-primary"
                    >
                      {modalLoading ? 'Saving...' : editingId ? 'Update Vehicle' : 'Add Vehicle'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingVehicle && (
          <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '440px' }}>
              <div className="modal-header">
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--danger)' }}>
                  Confirm Vehicle Deletion
                </h3>
                <button onClick={() => setDeletingVehicle(null)} style={{ background: 'none', border: 'none' }}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  Are you sure you want to delete <strong>{deletingVehicle.vehicleName}</strong> ({deletingVehicle.vehicleNumber})?
                  This action removes the vehicle permanently.
                </p>
              </div>
              <div className="modal-footer">
                <button onClick={() => setDeletingVehicle(null)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="btn btn-danger btn-sm"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Vehicle'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageVehicles;
