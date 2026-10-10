import React from 'react';
import { Award, Server, Database, Globe, Shield, CalendarCheck, FileCheck } from 'lucide-react';

const About = () => {
  return (
    <div style={{ padding: '60px 0 100px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '780px', margin: '0 auto 60px', textAlign: 'center' }}>
          <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            ACADEMIC MAJOR PROJECT
          </span>
          <h1 style={{ fontSize: '40px', fontWeight: '800', letterSpacing: '-1px', margin: '12px 0 16px' }}>
            Vehicle Rental Management System
          </h1>
          <p style={{ color: 'var(--gray-text)', fontSize: '17px', lineHeight: '1.6' }}>
            A full-stack enterprise web application developed as a 3rd-Year Computer Science & Engineering major project, demonstrating robust REST architectural standards, relational database integrity, and modern frontend design.
          </p>
        </div>

        {/* Tech Stack Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '60px'
        }}>
          <div className="card" style={{ padding: '28px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#e0e7ff',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Server size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Spring Boot Backend</h3>
            <p style={{ color: 'var(--gray-text)', fontSize: '14px', lineHeight: '1.6', marginBottom: '14px' }}>
              Built with Spring Web, Spring Data JPA, Hibernate, and Spring Security. Implements stateless JWT authentication, Bean Validation, and clean service-layer design.
            </p>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary)' }}>Java 23 • Spring Boot 3.3 / 4.1</span>
          </div>

          <div className="card" style={{ padding: '28px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Database size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>MySQL Database</h3>
            <p style={{ color: 'var(--gray-text)', fontSize: '14px', lineHeight: '1.6', marginBottom: '14px' }}>
              Normalized relational schema with foreign key constraints, one-to-many, many-to-one, and one-to-one JPA mappings. Prevents conflicting overlapping reservations.
            </p>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#0284c7' }}>MySQL 8.0 • InnoDB Engine</span>
          </div>

          <div className="card" style={{ padding: '28px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Globe size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>React Frontend</h3>
            <p style={{ color: 'var(--gray-text)', fontSize: '14px', lineHeight: '1.6', marginBottom: '14px' }}>
              Single-page application powered by Vite, React Router, Axios, and modern CSS. Features dynamic date picking, cost calculation, live search, and role-based views.
            </p>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#d97706' }}>React 18 • Vite SPA</span>
          </div>
        </div>

        {/* Core Project Highlights */}
        <div className="card" style={{ padding: '36px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>
            Key Business Logic Implemented
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '14px' }}>
              <CalendarCheck size={22} color="var(--primary)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>Date-Overlap Prevention</h4>
                <p style={{ fontSize: '13px', color: 'var(--gray-text)', lineHeight: '1.6' }}>
                  The service layer queries active reservations and strictly blocks overlapping bookings for the same vehicle using interval comparison logic.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px' }}>
              <Shield size={22} color="#10b981" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>JWT & Role-Based Security</h4>
                <p style={{ fontSize: '13px', color: 'var(--gray-text)', lineHeight: '1.6' }}>
                  Authentication uses BCrypt hashed passwords and HMAC-SHA256 signed JWT tokens. Admin routes are guarded on both client and server sides.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px' }}>
              <FileCheck size={22} color="#f59e0b" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>Verified Reviews & Ratings</h4>
                <p style={{ fontSize: '13px', color: 'var(--gray-text)', lineHeight: '1.6' }}>
                  Only customers with completed rentals for a vehicle can submit reviews and 1-to-5 star ratings, ensuring genuine rating data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
