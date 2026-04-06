import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    padding: '7px 12px',
    borderRadius: 8,
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 500,
    color: isActive(path) ? '#6c47ff' : '#6b6583',
    background: isActive(path) ? 'rgba(108,71,255,.08)' : 'transparent',
    transition: 'all .15s',
    whiteSpace: 'nowrap',
  });

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      background: '#fff',
      borderBottom: '1px solid rgba(110,99,200,.13)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 12px rgba(108,71,255,.06)',
      gap: 12,
    }}>

      {/* Logo */}
      <Link to="/dashboard" style={{
        fontFamily: 'Syne, sans-serif',
        fontWeight: 800, fontSize: 18,
        textDecoration: 'none',
        background: 'linear-gradient(135deg,#6c47ff,#00c6ae)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-.3px',
        flexShrink: 0,
      }}>
        MeetSync
      </Link>

      {/* Liens navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Link to="/dashboard"       style={linkStyle('/dashboard')}>Dashboard</Link>
        <Link to="/meetings/create" style={linkStyle('/meetings/create')}>+ Réunion</Link>
        <Link to="/invitations"     style={linkStyle('/invitations')}>Invitations</Link>
        <Link to="/reminders"       style={linkStyle('/reminders')}>🔔 Rappels</Link>
        <Link to="/calendar"        style={linkStyle('/calendar')}>📅 Calendrier</Link>
      </div>

      {/* User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <Link to="/profile" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          textDecoration: 'none',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg,#6c47ff,#00c6ae)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Syne, sans-serif', fontSize: 11,
            fontWeight: 800, color: '#fff', flexShrink: 0,
          }}>
            {initials}
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#0e0c1a' }}>
            {user?.name}
          </span>
        </Link>
        <button onClick={handleLogout} style={{
          padding: '6px 14px',
          border: '1px solid rgba(110,99,200,.22)',
          borderRadius: 8, background: 'transparent',
          cursor: 'pointer', fontSize: 12, color: '#6b6583',
          fontFamily: 'DM Sans, sans-serif',
          transition: 'all .15s',
        }}>
          Déconnexion
        </button>
      </div>
    </nav>
  );
}