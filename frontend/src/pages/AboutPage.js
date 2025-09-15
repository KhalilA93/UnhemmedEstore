import React from 'react';

const AboutPage = () => {
  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            About Unhemmed
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#6b7280', 
            maxWidth: '48rem', 
            margin: '0 auto' 
          }}>
            We're passionate about delivering premium fashion that combines style, 
            comfort, and quality craftsmanship.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-8" style={{ marginBottom: '3rem' }}>
          <div>
            <img 
              src="/images/homepage/about-section.jpg" 
              alt="About Unhemmed" 
              style={{ 
                width: '100%', 
                height: '400px', 
                objectFit: 'cover', 
                borderRadius: '0.5rem' 
              }}
              onError={(e) => {
                e.target.src = '/images/placeholder.svg';
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Our Story
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem', lineHeight: '1.6' }}>
              Founded with a vision to make premium fashion accessible, Unhemmed has been 
              curating exceptional clothing for fashion-forward individuals who value both 
              style and substance.
            </p>
            <p style={{ color: '#4b5563', marginBottom: '1rem', lineHeight: '1.6' }}>
              Every piece in our collection is carefully selected for its quality, design, 
              and versatility. We believe that great fashion should enhance your confidence 
              and express your unique personality.
            </p>
            <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
              From timeless classics to contemporary trends, we're here to help you build 
              a wardrobe that's uniquely yours.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div style={{ 
          backgroundColor: '#f9fafb', 
          padding: '3rem 2rem', 
          borderRadius: '0.5rem' 
        }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: '2rem' 
          }}>
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '1rem' 
              }}>
                ✨
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem' 
              }}>
                Quality
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                We source only the finest materials and work with trusted manufacturers 
                to ensure every piece meets our high standards.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '1rem' 
              }}>
                🌱
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem' 
              }}>
                Sustainability
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                We're committed to responsible fashion practices and supporting 
                brands that prioritize environmental consciousness.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '1rem' 
              }}>
                💝
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem' 
              }}>
                Customer Care
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Your satisfaction is our priority. We're here to help you find 
                the perfect pieces for your wardrobe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
