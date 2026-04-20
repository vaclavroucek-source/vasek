import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface NavbarProps {
  title?: string;
  backTo?: string;
  actions?: React.ReactNode;
}

export function Navbar({ title, backTo, actions }: NavbarProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header
      className="sticky top-0 z-40 flex items-center gap-3 px-4 h-14"
      style={{ background: 'rgba(250,248,243,0.92)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #E8DDD4' }}
    >
      {backTo ? (
        <Link
          to={backTo}
          className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
          style={{ color: '#6B5744' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#F5EFE6')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <ArrowLeft size={18} />
        </Link>
      ) : !isHome ? (
        <Link
          to="/"
          className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
          style={{ color: '#6B5744' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#F5EFE6')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <ArrowLeft size={18} />
        </Link>
      ) : null}

      <div className="flex-1 min-w-0">
        {title ? (
          <h1
            className="text-base font-semibold truncate"
            style={{ color: '#2D1B0E', margin: 0, fontSize: '1rem', letterSpacing: '-0.01em' }}
          >
            {title}
          </h1>
        ) : (
          <Link
            to="/"
            className="flex items-center gap-2 no-underline"
            style={{ textDecoration: 'none' }}
          >
            <span
              className="text-lg font-bold"
              style={{ color: '#C17F4E', fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}
            >
              Lifeline
            </span>
          </Link>
        )}
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
