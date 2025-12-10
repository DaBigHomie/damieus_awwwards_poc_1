import PropTypes from 'prop-types';
import './Card.module.css';

/**
 * Card Component
 * 
 * A reusable card component for displaying content in a contained box.
 * Supports title, description, and action content.
 * 
 * @component
 * @param {string} title - Card title
 * @param {string} description - Card description
 * @param {React.ReactNode} children - Card body content
 * @param {React.ReactNode} action - Action button or element
 * @param {string} className - Additional CSS classes
 * @returns {JSX.Element} Rendered card element
 * 
 * @example
 * <Card title="Service" description="AI Solutions">
 *   <p>Details here</p>
 * </Card>
 */
const Card = ({
  title,
  description,
  children,
  action,
  className = '',
}) => {
  return (
    <div className={`card ${className}`.trim()}>
      {title && <h3 className="card-title">{title}</h3>}
      {description && <p className="card-description">{description}</p>}
      {children && <div className="card-body">{children}</div>}
      {action && <div className="card-action">{action}</div>}
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
  action: PropTypes.node,
  className: PropTypes.string,
};

export default Card;
