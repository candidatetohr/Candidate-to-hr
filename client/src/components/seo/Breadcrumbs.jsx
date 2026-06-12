import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import './Breadcrumbs.css';

export default function Breadcrumbs({ customCrumbs }) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // If custom crumbs are provided, use them, otherwise auto-generate from URL
  const crumbs = customCrumbs || pathnames.map((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
    // Format the slug (e.g., 'software-engineer' -> 'Software Engineer')
    const label = value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return { label, to };
  });

  return (
    <nav aria-label="breadcrumb" className="seo-breadcrumbs">
      <ol>
        <li>
          <Link to="/" title="Home"><Home size={14} /></Link>
        </li>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.to} aria-current={isLast ? 'page' : undefined}>
              <ChevronRight size={14} className="crumb-separator" />
              {isLast ? (
                <span>{crumb.label}</span>
              ) : (
                <Link to={crumb.to}>{crumb.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
