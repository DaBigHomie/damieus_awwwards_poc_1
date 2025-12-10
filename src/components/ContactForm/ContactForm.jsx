import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@shared/ui';
import './ContactForm.module.css';

/**
 * ContactForm Component
 * 
 * Multi-step contact form for lead generation.
 * Collects name, email, service interest, and message.
 * 
 * @component
 * @param {function} onSubmit - Callback when form is submitted
 * @returns {JSX.Element} Rendered contact form
 * 
 * @example
 * <ContactForm onSubmit={(data) => console.log(data)} />
 */
const ContactForm = ({ onSubmit = () => {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const services = [
    'Artificial Intelligence',
    'Web Development',
    'Cloud Solutions',
    'Cyber Security',
    'Data Analytics',
    'App Development',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    if (!formData.service) {
      setError('Please select a service');
      return false;
    }
    if (!formData.message.trim()) {
      setError('Message is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API endpoint
      // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) });
      
      onSubmit(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', service: '', message: '' });

      // Auto-dismiss success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.message || 'Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="contact-form__success">
        <h3>Thank you! 🎉</h3>
        <p>We&apos;ve received your inquiry and will get back to you soon.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2 className="contact-form__title">Get in Touch</h2>
      <p className="contact-form__subtitle">
        Tell us about your project. We&apos;ll respond within 24 hours.
      </p>

      {error && <div className="contact-form__error">{error}</div>}

      <div className="contact-form__group">
        <label htmlFor="name" className="contact-form__label">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          className="contact-form__input"
          required
        />
      </div>

      <div className="contact-form__group">
        <label htmlFor="email" className="contact-form__label">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          className="contact-form__input"
          required
        />
      </div>

      <div className="contact-form__group">
        <label htmlFor="service" className="contact-form__label">
          Service of Interest *
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          className="contact-form__select"
          required
        >
          <option value="">Select a service</option>
          {services.map((svc) => (
            <option key={svc} value={svc}>
              {svc}
            </option>
          ))}
        </select>
      </div>

      <div className="contact-form__group">
        <label htmlFor="message" className="contact-form__label">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your project..."
          rows="5"
          className="contact-form__textarea"
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={loading}
        className="contact-form__submit"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </Button>

      <p className="contact-form__note">
        * Required fields. We respect your privacy.
      </p>
    </form>
  );
};

ContactForm.propTypes = {
  onSubmit: PropTypes.func,
};

export default ContactForm;
