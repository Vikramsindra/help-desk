import { Link } from 'react-router';

/**
 * FooterLink - Reusable link component for footer navigation.
 * Supports both internal (React Router Link) and external (<a>) links.
 *
 * Props:
 *   to       - internal route path (uses React Router Link)
 *   href     - external URL (uses <a target="_blank" rel="noopener noreferrer">)
 *   children - link content
 *   className - additional CSS classes
 */
export default function FooterLink({ to, href, children, className = '' }) {
  const base =
    'text-[#9db8b2] hover:text-white transition-colors duration-200 text-sm leading-relaxed';

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={`${base} ${className}`}>
      {children}
    </Link>
  );
}
