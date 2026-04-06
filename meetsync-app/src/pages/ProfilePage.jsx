import { useState } from 'react';
import useAuthStore from '../store/authStore';
import api from '../services/api';

export default function ProfilePage() {
  const { user, fetchMe } = useAuthStore();
  const [name,     setName]     = useState(user?.name || '');
  const [email,    setEmail]    = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [passConf, setPassConf] = useState('');
  const [success,  setSuccess]  = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.put('/profile', {
        name,
        email,
        password:              password || undefined,
        password_confirmation: passConf  || undefined,
      });
      await fetchMe();
      setSuccess('Profil mis à jour avec succès !');
      setPassword('');
      setPassConf('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name
    ?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const inp = {
    width: '100%', padding: '10px 14px',
    border: '1px solid rgba(110,99,200,.22)',
    borderRadius: 10, fontSize: 13,
    fontFamily: 'DM Sans, sans-serif',
    background: '#fff', outline: 'none',
    color: '#0e0c1a',
  };

  const lbl = {
    display: 'block', fontSize: 11, fontWeight: 700,
    color: '#6b6583', textTransform: 'uppercase',
    letterSpacing: '.05em', marginBottom: 6,
  };

  return (
    <div style={{ maxWidth: 520 }}>
      <h1 style={{
        fontFamily: 'Syne, sans-serif', fontSize: 22,
        fontWeight: 800, marginBottom: 24, color: '#0e0c1a',
      }}>
        Mon profil
      </h1>

      {/* Avatar card */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24,
        background: '#fff', borderRadius: 14, padding: '16px 20px',
        border: '1px solid #e8e4f8',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18, flexShrink: 0,
          background: 'linear-gradient(135deg,#6c47ff,#00c6ae)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Syne, sans-serif', fontSize: 22,
          fontWeight: 800, color: '#fff',
        }}>
          {initials}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18, color: '#0e0c1a', marginBottom: 3 }}>
            {user?.name}
          </div>
          <div style={{ fontSize: 13, color: '#6b6583' }}>{user?.email}</div>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div style={{
          background: 'rgba(34,212,114,.1)', color: '#169a52',
          padding: '10px 14px', borderRadius: 10, marginBottom: 14, fontSize: 13,
        }}>
          ✓ {success}
        </div>
      )}
      {error && (
        <div style={{
          background: 'rgba(255,77,109,.08)', color: '#ff4d6d',
          padding: '10px 14px', borderRadius: 10, marginBottom: 14, fontSize: 13,
        }}>
          ⚠ {error}
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} style={{
        background: '#fff', borderRadius: 14,
        padding: '20px 22px', border: '1px solid #e8e4f8',
      }}>

        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Nom complet</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={inp}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Adresse email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={inp}
          />
        </div>

        <div style={{
          height: 1, background: '#e8e4f8', margin: '20px 0',
        }}></div>

        <p style={{ fontSize: 12, color: '#6b6583', marginBottom: 14 }}>
          Laisse vide pour ne pas modifier ton mot de passe.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div>
            <label style={lbl}>Nouveau mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inp}
            />
          </div>
          <div>
            <label style={lbl}>Confirmer</label>
            <input
              type="password"
              value={passConf}
              onChange={e => setPassConf(e.target.value)}
              placeholder="••••••••"
              style={inp}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: 12,
            background: loading
              ? '#ccc'
              : 'linear-gradient(135deg,#6c47ff,#00c6ae)',
            color: '#fff', border: 'none', borderRadius: 10,
            fontSize: 14, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {loading ? 'Sauvegarde...' : '💾 Sauvegarder les modifications'}
        </button>
      </form>
    </div>
  );
}
