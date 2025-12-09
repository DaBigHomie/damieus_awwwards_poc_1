import React from 'react';
import PropTypes from 'prop-types';
import './Button.module.css';

/**
 * Button Component
 * 
 * A reusable button component with multiple variants and sizes.
 * 
 * @component
 * @param {string} children - Button text or content
 * @param {string} variant - Style variant: 'primary', 'secondary', 'ghost' (default: 'primary')
 * @param {string} size - Button size: 'sm', 'md', 'lg' (default: 'md')
 * @param {boolean} disabled - Whether button is disabled
 * @param {function} onClick - Click handler
 * @param {string} className - Additional CSS classes
 * @returns {JSX.Element} Rendered button element
 * 
 * @example
 * <Button variant="primary" onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {
  const buttonClass = `btn btn-${variant} btn-${size} ${className}`.trim();

  return (
    <button
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}
      aria-label={typeof children === 'string' ? children : 'button'}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;
