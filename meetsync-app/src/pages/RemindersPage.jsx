/* RemindersPage.jsx */
import { useEffect, useState } from 'react';
import { meetingService } from '../services/meetingService';

export default function RemindersPage() {
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simMsg, setSimMsg] = useState('');

const load = () => {
  meetingService.getAll().then(({ data }) => {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const all = [...data.organized, ...data.invited];
    setUpcoming(all.filter(m => {
      const d = new Date(m.start_at);
      return d > now && d < in24h;
    }));
    setLoading(false);
  });
};

  useEffect(() => { load(); }, []);

  const simulateScheduler = () => {
    setSimMsg('⏳ Synchronisation en cours...');
    setTimeout(() => {
      setSimMsg('✅ Commande exécutée : php artisan schedule:run');
    }, 1500);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--ink)', fontFamily: 'Syne, sans-serif', marginBottom: 32 }}>
        Centre de Rappels
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#1e293b', borderRadius: '20px', padding: '20px 24px', marginBottom: 40, boxShadow: '0 8px 16px -2px rgba(0,0,0,0.1)' }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981', flexShrink: 0 }}></div>
        <span style={{ fontSize: 14, color: '#f8fafc', fontWeight: 600, letterSpacing: '0.02em' }}>
          Service actif — Synchronisation automatique des réunions imminentes
        </span>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
          Prochaines 24 heures
        </h2>
        
        {loading ? (
          <p style={{ color: 'var(--ink3)', fontWeight: 500 }}>Analyse des plannings...</p>
        ) : upcoming.length === 0 ? (
          <div style={{ background: '#ffffff', padding: '40px', borderRadius: '20px', border: '1px solid var(--border)', textAlign: 'center' }}>
             <p style={{ fontSize: 15, color: 'var(--ink3)', fontWeight: 500 }}>Aucune réunion prévue dans les prochaines 24h.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {upcoming.map(m => (
              <div key={m.id} style={{
                background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '20px 24px',
                display: 'flex', alignItems: 'center', gap: 20, boxShadow: 'var(--shadow-sm)'
              }}>
                {/* Icône de cloche jaune stylisée */}
                <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'var(--t-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                   <div style={{color: '#fbbf24'}}>🔔</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--ink)', marginBottom: 6 }}>{m.title}</div>
                  <div style={{ fontSize: 14, color: 'var(--ink3)', fontWeight: 500 }}>
                    Le {new Date(m.start_at).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' })} à {new Date(m.start_at).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})} ({m.duration_minutes} min)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
          Administration Système
        </h2>
        <div style={{ background: '#1e293b', borderRadius: '16px', padding: '20px', fontFamily: 'monospace', fontSize: 14, color: '#e2e8f0', marginBottom: 24, border: '1px solid rgba(255,255,255,0.1)' }}>
          $ * * * * * cd /var/www/html && php artisan schedule:run
        </div>
        <button onClick={simulateScheduler} style={{
          padding: '14px 28px', background: 'linear-gradient(135deg, var(--v), #4f46e5)', color: '#ffffff',
          border: 'none', borderRadius: '14px', fontSize: 15, fontWeight: 700,
          cursor: 'pointer', boxShadow: '0 6px 16px rgba(99, 102, 241, 0.3)'
        }}>
          Simuler la tâche planifiée
        </button>
        {simMsg && <div style={{ marginTop: 20, fontSize: 15, fontWeight: 600, color: '#10b981' }}>{simMsg}</div>}
      </div>
    </div>
  );
}