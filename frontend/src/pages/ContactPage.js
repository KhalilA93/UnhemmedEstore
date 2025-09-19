import React from 'react';

const ContactPage = () => {
  return (
    <div style={{ 
      backgroundColor: 'white',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        width: '100%'
      }}>
        {/* Header Section */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '4rem',
          color: '#1f2937'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: '800',
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            Get In Touch
          </h1>
          <div style={{
            width: '80px',
            height: '4px',
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            margin: '0 auto 2rem',
            borderRadius: '2px'
          }}></div>
          <p style={{ 
            fontSize: '1.25rem',
            lineHeight: '1.7',
            maxWidth: '600px',
            margin: '0 auto',
            color: '#6b7280',
            fontWeight: '300'
          }}>
            Ready to bring your vision to life? I'd love to hear about your project and discuss how we can work together to create something amazing.
          </p>
        </div>

        {/* Contact Cards Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          marginBottom: '3rem',
          flexWrap: 'wrap'
        }}>
          {/* Email Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1.5rem',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            flex: '1',
            maxWidth: '280px',
            minWidth: '250px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              backgroundColor: '#667eea',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2rem'
            }}>📧</div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '0.75rem'
            }}>Email</h3>
            <a 
              href="mailto:khalilatkins420@gmail.com"
              style={{
                color: '#667eea',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'color 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.color = '#5a67d8'}
              onMouseOut={(e) => e.target.style.color = '#667eea'}
            >
              khalilatkins420@gmail.com
            </a>
          </div>

          {/* Phone Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1.5rem',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            flex: '1',
            maxWidth: '280px',
            minWidth: '250px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              backgroundColor: '#48bb78',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2rem'
            }}>📱</div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '0.75rem'
            }}>Phone</h3>
            <a 
              href="tel:2676311415"
              style={{
                color: '#48bb78',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'color 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.color = '#38a169'}
              onMouseOut={(e) => e.target.style.color = '#48bb78'}
            >
              267-631-1415
            </a>
          </div>

          {/* Location Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1.5rem',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            flex: '1',
            maxWidth: '280px',
            minWidth: '250px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              backgroundColor: '#ed8936',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2rem'
            }}>📍</div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '0.75rem'
            }}>Location</h3>
            <div style={{
              color: '#6b7280',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              Philadelphia, PA
            </div>
          </div>
        </div>

        {/* LinkedIn CTA Section */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '2rem',
          padding: '3rem 2rem',
          textAlign: 'center',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#0077b5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2.5rem'
          }}>💼</div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>Let's Connect Professionally</h3>
          <p style={{
            color: '#6b7280',
            fontSize: '1.1rem',
            marginBottom: '2rem',
            maxWidth: '500px',
            margin: '0 auto 2rem'
          }}>
            Connect with me on LinkedIn to stay updated on my latest projects and professional journey.
          </p>
          <a 
            href="https://www.linkedin.com/in/khalilatkins" 
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'linear-gradient(135deg, #0077b5, #005582)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '50px',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(0, 119, 181, 0.3)',
              border: '2px solid transparent'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.05)';
              e.target.style.boxShadow = '0 15px 35px rgba(0, 119, 181, 0.4)';
              e.target.style.borderColor = 'rgba(0, 119, 181, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 8px 25px rgba(0, 119, 181, 0.3)';
              e.target.style.borderColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '1.3rem' }}>💼</span>
            Connect on LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
