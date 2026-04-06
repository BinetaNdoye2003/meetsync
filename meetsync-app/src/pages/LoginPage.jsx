import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('nbineta2003@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Identifiants invalides. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const inputContainerStyle = { position: 'relative', width: '100%' };

  const inputStyle = {
    width: '100%',
    padding: '14px 45px 14px 18px', // Espace à droite pour l'icône
    border: '1.5px solid var(--border)',
    borderRadius: '14px',
    fontSize: '15px',
    background: '#f8fafc',
    color: 'var(--ink)',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  };

  const eyeButtonStyle = {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--ink3)',
    display: 'flex',
    alignItems: 'center',
    padding: '5px'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: '#ffffff', padding: '40px', borderRadius: '32px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
        
        {/* Logo MeetSync */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #a78bfa, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800', color: '#fff' }}>MS</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '24px', background: 'linear-gradient(135deg, var(--v), var(--t))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px' }}>MeetSync.</span>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ink)', marginBottom: '8px' }}>Bon retour !</h2>
        <p style={{ fontSize: '14px', color: 'var(--ink3)', marginBottom: '32px', fontWeight: '500' }}>Connectez-vous pour gérer vos réunions.</p>

        {error && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '13px', fontWeight: '600' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--ink3)', marginBottom: '8px', textTransform: 'uppercase' }}>E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required onFocus={(e) => e.target.style.borderColor = 'var(--v)'} onBlur={(e) => e.target.style.borderColor = 'var(--border)'} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--ink3)', marginBottom: '8px', textTransform: 'uppercase' }}>Mot de passe</label>
            <div style={inputContainerStyle}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={inputStyle} 
                required 
                onFocus={(e) => e.target.style.borderColor = 'var(--v)'} 
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'} 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeButtonStyle}>
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: loading ? '#cbd5e1' : 'linear-gradient(135deg, var(--v), var(--t))', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 8px 20px -4px rgba(99, 102, 241, 0.4)' }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ marginTop: '32px', fontSize: '14px', color: 'var(--ink3)', fontWeight: '500' }}>
          Pas encore de compte ? <Link to="/register" style={{ color: 'var(--v)', fontWeight: '700' }}>S'inscrire</Link>
        </div>
      </div>
    </div>
  );
}