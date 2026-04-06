/* InvitationsPage.jsx */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { meetingService } from '../services/meetingService';
import { invitationService } from '../services/invitationService';

export default function InvitationsPage() {
  const [invited, setInvited] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await meetingService.getAll();
    setInvited(data.invited);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const respond = async (invitationId, status) => {
    await invitationService.respond(invitationId, status);
    load();
  };

  const statusColor = (s) => s === 'accepted' ? '#10b981' : s === 'refused' ? '#ef4444' : '#f59e0b';
  const statusBg = (s) => s === 'accepted' ? 'rgba(16,185,129,0.1)' : s === 'refused' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)';
  const statusLabel = (s) => s === 'accepted' ? '✓ Accepté' : s === 'refused' ? '✗ Refusé' : '⏳ En attente';

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--ink)', fontFamily: 'Syne, sans-serif' }}>
          Mes Invitations
        </h1>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--ink3)', fontWeight: 600 }}>Chargement de vos invitations...</div>
      ) : invited.length === 0 ? (
        <div style={{ background: '#ffffff', padding: '60px', borderRadius: '24px', textAlign: 'center', border: '1px dashed var(--border)' }}>
          <p style={{ color: 'var(--ink3)', fontSize: 16, fontWeight: 500 }}>Vous n'avez aucune invitation en attente pour le moment.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {invited.map(m => {
            const inv = m.invitations[0];
            return (
              <div key={m.id} style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: '24px', padding: '28px',
                boxShadow: 'var(--shadow-sm)', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                    <h3 style={{ fontWeight: 800, fontSize: 19, color: 'var(--ink)', margin: 0 }}>{m.title}</h3>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: '20px', background: statusBg(inv?.status), color: statusColor(inv?.status) }}>
                      {statusLabel(inv?.status)}
                    </span>
                  </div>
                  <div style={{ fontSize: 15, color: 'var(--ink3)', display: 'flex', gap: '20px', fontWeight: 500 }}>
                    <span>📅 {new Date(m.start_at).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                    <span>👤 <span style={{fontWeight: 600, color: 'var(--ink)'}}>{m.organizer?.name}</span></span>
                  </div>
                </div>

                {inv?.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 14 }}>
                    <button onClick={() => respond(inv.id, 'accepted')} style={{
                      padding: '12px 24px', background: '#10b981', color: '#ffffff',
                      border: 'none', borderRadius: '14px', cursor: 'pointer',
                      fontSize: 14, fontWeight: 700, boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                    }}>Accepter</button>
                    <button onClick={() => respond(inv.id, 'refused')} style={{
                      padding: '12px 24px', background: '#ffffff', color: '#ef4444',
                      border: '1.5px solid #fee2e2', borderRadius: '14px', cursor: 'pointer',
                      fontSize: 14, fontWeight: 700
                    }}>Décliner</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}