import { Helmet } from 'react-helmet-async';
import { ContactForm } from '../components';
import '../styles/contact.css';

/**
 * Contact Page
 * 
 * Full-page contact form with additional information.
 * Handles lead capture and form submission.
 */
export const Contact = () => {
  const handleContactSubmit = (formData) => {
    console.log('Contact form submitted:', formData);
    
    // TODO: Send to backend API
    // fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // });
  };

  return (
    <div className="page contact-page">
      <Helmet>
        <title>Contact Us | Get in Touch with Damieus Technology Solutions</title>
        <meta name="description" content="Ready to transform your business? Contact Damieus for premium technology solutions. 24/7 support, expert team, certified company." />
        <meta property="og:title" content="Contact Damieus | Let's Build Something Great" />
        <meta property="og:description" content="Get in touch with our expert team. 25+ years of experience delivering premium technology solutions." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://damieus.com/contact" />
      </Helmet>
      <section className="contact-hero">
        <div className="container">
          <h1>Get in Touch</h1>
          <p className="lead">
            Ready to transform your business? Let&apos;s talk about your next project.
          </p>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2>Contact Information</h2>
              <div className="info-item">
                <h3>Address</h3>
                <p>One World Center<br />New York, NY 10048<br />United States</p>
              </div>
              <div className="info-item">
                <h3>Phone</h3>
                <p><a href="tel:+1-646-926-0213">+1 (646) 926-0213</a></p>
              </div>
              <div className="info-item">
                <h3>Email</h3>
                <p><a href="mailto:hello@damieus.com">hello@damieus.com</a></p>
              </div>
              <div className="info-item">
                <h3>Response Time</h3>
                <p>We typically respond within 24 hours<br />Monday - Friday, 9 AM - 6 PM EST</p>
              </div>
            </div>

            <ContactForm onSubmit={handleContactSubmit} />
          </div>
        </div>
      </section>

      <section className="contact-faq">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How quickly do you respond?</h3>
              <p>We aim to respond to all inquiries within 24 business hours. For urgent matters, please call our office.</p>
            </div>
            <div className="faq-item">
              <h3>What&apos;s your typical project timeline?</h3>
              <p>Project timelines vary based on scope and complexity. We&apos;ll provide a detailed timeline after our initial consultation.</p>
            </div>
            <div className="faq-item">
              <h3>Do you work with startups?</h3>
              <p>Yes! We work with companies of all sizes, from ambitious startups to established enterprises.</p>
            </div>
            <div className="faq-item">
              <h3>What&apos;s your process?</h3>
              <p>We follow a structured approach: Discovery → Design → Development → Testing → Launch → Support.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
