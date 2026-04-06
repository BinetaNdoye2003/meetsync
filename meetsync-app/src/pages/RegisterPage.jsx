import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await register(name, email, password, passwordConf);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 45px 14px 18px', border: '1.5px solid var(--border)',
    borderRadius: '14px', fontSize: '15px', background: '#f8fafc', color: 'var(--ink)',
    outline: 'none', transition: 'all 0.2s ease', boxSizing: 'border-box',
  };

  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--ink3)', marginBottom: '8px', textTransform: 'uppercase' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: '450px', background: '#ffffff', padding: '40px', borderRadius: '32px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #a78bfa, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800', color: '#fff' }}>MS</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '24px', background: 'linear-gradient(135deg, var(--v), var(--t))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px' }}>MeetSync.</span>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ink)', marginBottom: '8px' }}>Créer un compte</h2>
        <p style={{ fontSize: '14px', color: 'var(--ink3)', marginBottom: '32px', fontWeight: '500' }}>Rejoignez la plateforme et commencez à synchroniser.</p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Nom complet</label>
            <input type="text" placeholder="Bineta Ndoye" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required onFocus={(e) => e.target.style.borderColor = 'var(--v)'} onBlur={(e) => e.target.style.borderColor = 'var(--border)'} />
            {errors.name && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.name[0]}</span>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>E-mail</label>
            <input type="email" placeholder="exemple@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required onFocus={(e) => e.target.style.borderColor = 'var(--v)'} onBlur={(e) => e.target.style.borderColor = 'var(--border)'} />
            {errors.email && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.email[0]}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '24px' }}>
            <div style={{ position: 'relative' }}>
              <label style={labelStyle}>Mot de passe</label>
              <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '10px', top: '35px', background: 'none', border: 'none', cursor: 'pointer' }}>
                {showPass ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <label style={labelStyle}>Confirmation</label>
              <input type={showPass ? "text" : "password"} value={passwordConf} onChange={(e) => setPasswordConf(e.target.value)} style={inputStyle} required />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: loading ? '#cbd5e1' : 'linear-gradient(135deg, var(--v), var(--t))', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 8px 20px -4px rgba(99, 102, 241, 0.4)' }}>
            {loading ? 'Création...' : 'S\'inscrire maintenant'}
          </button>
        </form>

        <div style={{ marginTop: '32px', fontSize: '14px', color: 'var(--ink3)', fontWeight: '500' }}>
          Déjà un compte ? <Link to="/login" style={{ color: 'var(--v)', fontWeight: '700' }}>Se connecter</Link>
        </div>
      </div>
    </div>
  );
}