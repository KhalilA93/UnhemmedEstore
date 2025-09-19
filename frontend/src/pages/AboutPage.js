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
            Unhemmed is a mock e-commerce site crafted from the ground up by me, 
            Khalil Atkins. This project showcases modern web development practices, featuring a complete 
            MERN stack implementation and responsive design across all devices.
          </p>
        </div>

        {/* Content Section */}
        <div style={{ 
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 1.5rem',
          marginBottom: '4rem'
        }}>
          {/* Our Story Section */}
          <div style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '2.5rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{ 
              fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
              fontWeight: '700',
              marginBottom: '1.5rem',
              color: '#1f2937',
              lineHeight: '1.2',
              textAlign: 'center'
            }}>
              Our Story
            </h2>
            <div style={{
              width: '60px',
              height: '4px',
              backgroundColor: '#3b82f6',
              margin: '0 auto 2rem auto',
              borderRadius: '2px'
            }}></div>
            <p style={{ 
              color: '#374151',
              marginBottom: '1.5rem',
              lineHeight: '1.7',
              fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
              textAlign: 'justify'
            }}>
              I am a self-taught freelance full-stack software engineer who began coding in 2023, 
              but my passion for technology goes back to childhood. At 10 years old, I was already 
              fascinated by how software shapes the world, and that curiosity has fueled my drive 
              ever since.
            </p>
            <p style={{ 
              color: '#374151',
              marginBottom: '1.5rem',
              lineHeight: '1.7',
              fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
              textAlign: 'justify'
            }}>
              Over the past few years, I've built and deployed multiple full-stack applications 
              from the ground up using the MERN stack, gaining hands-on experience with modern 
              frameworks, APIs, and responsive design.
            </p>
            <p style={{ 
              color: '#374151',
              lineHeight: '1.7',
              fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
              textAlign: 'justify'
            }}>
              My journey reflects persistence, adaptability, and a deep love for solving problems 
              through code—qualities I bring to every project I take on.
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
                📱
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem' 
              }}>
                Responsive Design
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Every interface is crafted to provide seamless experiences across all devices, 
                from mobile phones to desktop computers, ensuring accessibility for everyone.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '1rem' 
              }}>
                ⚡
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem' 
              }}>
                Performance
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Fast loading times and optimized code deliver smooth user interactions, 
                minimizing wait times and maximizing user engagement.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '1rem' 
              }}>
                🎨
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem' 
              }}>
                User Experience
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Intuitive navigation and clean, modern interfaces prioritize usability, 
                making complex functionality feel simple and natural.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
