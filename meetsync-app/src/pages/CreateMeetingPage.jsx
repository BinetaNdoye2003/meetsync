/* CreateMeetingPage.jsx */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { meetingService } from '../services/meetingService';
import useAuthStore from '../store/authStore';

export default function CreateMeetingPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [location, setLocation] = useState('');
  const [reminder] = useState(15);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success] = useState('');

 const { user } = useAuthStore();

useEffect(() => {
  meetingService.getUsers().then(({ data }) => {
    setUsers(data.filter(u => u.id !== user?.id));
  });
}, [user]);

  const toggleUser = (id) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});
  setLoading(true);
  try {
    await meetingService.create({
      title,
      description,
      start_at:         `${startDate} ${startTime}:00`,
      duration_minutes: Number(duration),
      location,
      reminder_minutes: Number(reminder),
      participant_ids:  selectedUsers,
    });
    // Redirection immédiate sans setTimeout
    navigate('/dashboard');
  } catch (err) {
    if (err.response?.status === 422) {
      const data = err.response.data;
      setErrors(data.errors || { general: data.message });
    }
  } finally {
    setLoading(false);
  }
};

  const inputStyle = {
    width: '100%', padding: '14px 18px', border: '1.5px solid var(--border)',
    borderRadius: '14px', fontSize: 15, fontFamily: 'inherit',
    background: '#f8fafc', color: 'var(--ink)', outline: 'none',
    transition: 'all 0.2s ease', boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink3)',
    marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', animation: 'fadeIn 0.4s ease' }}>
      <div style={{
        background: 'var(--card)', borderRadius: '32px', padding: '48px',
        width: '100%', maxWidth: 600, border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-md)',
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--ink)', margin: 0, fontFamily: 'Syne, sans-serif' }}>
            Planifier une réunion
          </h1>
          <Link to="/dashboard" style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink3)', padding: '10px 20px', background: '#f1f5f9', borderRadius: '12px' }}>
            ← Retour
          </Link>
        </div>

        {success && <div style={{ background: 'var(--t-light)', color: '#0d9488', padding: '16px 24px', borderRadius: '14px', marginBottom: 28, fontSize: 15, fontWeight: 600 }}>✓ {success}</div>}
        {errors.general && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '16px 24px', borderRadius: '14px', marginBottom: 28, fontSize: 15, fontWeight: 600 }}>⚠ {errors.general}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Titre de la réunion *</label>
            <input type="text" placeholder="Ex: Sprint Review, Démo client..." value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} 
              onFocus={(e) => { e.target.style.borderColor = 'var(--v)'; e.target.style.background = '#ffffff'; e.target.style.boxShadow = '0 0 0 5px var(--v-light)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Ordre du jour / Objectifs</label>
            <textarea placeholder="Décrivez le contenu de la réunion..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} style={{ ...inputStyle, resize: 'none' }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--v)'; e.target.style.background = '#ffffff'; e.target.style.boxShadow = '0 0 0 5px var(--v-light)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>Date *</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Heure *</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>Durée (min) *</label>
              <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} min={15} step={15} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Lieu / Visio</label>
              <input type="text" placeholder="Lien Meet, Salle A..." value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={labelStyle}>Inviter des collaborateurs</label>
            <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '6px' }}>
              {users.map(u => (
                <div key={u.id} onClick={() => toggleUser(u.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', marginBottom: 10,
                  border: selectedUsers.includes(u.id) ? '2.5px solid var(--v)' : '1.5px solid var(--border)',
                  borderRadius: '16px', cursor: 'pointer',
                  background: selectedUsers.includes(u.id) ? 'var(--v-light)' : '#ffffff',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedUsers.includes(u.id) ? '0 4px 12px rgba(99, 102, 241, 0.15)' : 'none',
                }}
                onMouseOver={(e) => { if(!selectedUsers.includes(u.id)) e.currentTarget.style.borderColor = '#cbd5e1'; }}
                onMouseOut={(e) => { if(!selectedUsers.includes(u.id)) e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <div style={{ width: 22, height: 22, borderRadius: '7px', border: '2.5px solid', borderColor: selectedUsers.includes(u.id) ? 'var(--v)' : '#cbd5e1', background: selectedUsers.includes(u.id) ? 'var(--v)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedUsers.includes(u.id) && <svg width="14" height="14" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>}
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: '12px', background: selectedUsers.includes(u.id) ? 'var(--v)' : '#f1f5f9', color: selectedUsers.includes(u.id) ? '#ffffff' : 'var(--ink3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                    {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink3)', fontWeight: 500 }}>{u.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '18px', background: loading ? '#cbd5e1' : 'linear-gradient(135deg, var(--v), var(--t))',
            color: '#ffffff', border: 'none', borderRadius: '16px', fontSize: 16, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
            transition: 'all 0.2s ease',
            marginTop: 8,
          }}
          onMouseOver={(e) => { if(!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(99, 102, 241, 0.5)'; } }}
          onMouseOut={(e) => { if(!loading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(99, 102, 241, 0.4)'; } }}
          >
            {loading ? 'Planification en cours...' : 'Planifier la réunion ✦'}
          </button>
        </form>
      </div>
    </div>
  );
}