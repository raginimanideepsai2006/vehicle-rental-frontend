import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin, Shield, Clock, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--dark)', color: '#94a3b8', paddingTop: '60px', paddingBottom: '30px' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
                color: 'white',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Car size={20} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: '800', color: 'white' }}>
                Auto<span style={{ color: '#818cf8' }}>Rental</span>
              </span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', color: '#94a3b8' }}>
              Next-generation Vehicle Rental Management platform built with Spring Boot and React. Book seamless, verified rides with guaranteed transparency.
            </p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                <Shield size={16} color="#10b981" /> 100% Insured
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                <Clock size={16} color="#38bdf8" /> 24/7 Roadside
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '18px' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li><Link to="/" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>Home</Link></li>
              <li><Link to="/vehicles" style={{ color: '#94a3b8' }}>Explore Fleet</Link></li>
              <li><Link to="/about" style={{ color: '#94a3b8' }}>About System</Link></li>
              <li><Link to="/login" style={{ color: '#94a3b8' }}>Customer Portal</Link></li>
              <li><Link to="/login" style={{ color: '#94a3b8' }}>Administrator Login</Link></li>
            </ul>
          </div>

          {/* Vehicle Categories */}
          <div>
            <h4 style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '18px' }}>
              Vehicle Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li><Link to="/vehicles?type=SEDAN" style={{ color: '#94a3b8' }}>Executive Sedans</Link></li>
              <li><Link to="/vehicles?type=SUV" style={{ color: '#94a3b8' }}>Rugged & Urban SUVs</Link></li>
              <li><Link to="/vehicles?type=BIKE" style={{ color: '#94a3b8' }}>Cruiser & Sport Bikes</Link></li>
              <li><Link to="/vehicles?type=LUXURY" style={{ color: '#94a3b8' }}>Luxury & Premium Cars</Link></li>
              <li><Link to="/vehicles?type=VAN" style={{ color: '#94a3b8' }}>Family Vans & MPVs</Link></li>
            </ul>
          </div>

          {/* Contact / Project Info */}
          <div>
            <h4 style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '18px' }}>
              College Major Project
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={18} color="#f59e0b" />
                <span>3rd Year Computer Science Project</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="#818cf8" />
                <span>support@vehiclerental.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="#34d399" />
                <span>+91 98765 43210</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={18} color="#f87171" />
                <span>Bangalore, Karnataka, India</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '13px',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} AutoRental - Vehicle Rental Management System. All rights reserved.
          </div>
          <div>
            Developed with Java Spring Boot, MySQL & React.js
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
