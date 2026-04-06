
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { meetingService } from '../services/meetingService';
import useAuthStore from '../store/authStore';

export default function MeetingDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    meetingService.getOne(id)
      .then(({ data }) => setMeeting(data))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id]);

  const fmt = (d) => new Date(d).toLocaleString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const statusColor = (s) =>
    s === 'accepted' ? '#169a52' :
    s === 'refused'  ? '#ff4d6d' : '#c97c00';

  const statusBg = (s) =>
    s === 'accepted' ? 'rgba(34,212,114,.1)' :
    s === 'refused'  ? 'rgba(255,77,109,.08)' : 'rgba(255,184,48,.1)';

  const statusLabel = (s) =>
    s === 'accepted' ? '✓ Accepté' :
    s === 'refused'  ? '✗ Refusé'  : '⏳ En attente';

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center',
                  alignItems: 'center', height: 200 }}>
      <p style={{ color: '#6b6583' }}>Chargement...</p>
    </div>
  );

  if (!meeting) return null;

  const isOrganizer = meeting.organizer?.id === user?.id;
  const acceptedCount = meeting.invitations?.filter(i => i.status === 'accepted').length || 0;
  const totalInvited = meeting.invitations?.length || 0;

  return (
    <div style={{ maxWidth: 680 }}>

      <Link to="/dashboard" style={{
        fontSize: 13, color: '#6b6583',
        marginBottom: 20, display: 'inline-block',
      }}>
        ← Retour au dashboard
      </Link>

      {/* Carte principale */}
      <div style={{
        background: '#fff', borderRadius: 16,
        padding: 24, border: '1px solid #e8e4f8', marginBottom: 16,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Barre couleur gauche */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: 4, background: 'linear-gradient(180deg,#6c47ff,#00c6ae)',
        }}></div>

        <div style={{ paddingLeft: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
                        alignItems: 'flex-start', marginBottom: 12 }}>
            <h1 style={{
              fontFamily: 'Syne, sans-serif', fontSize: 22,
              fontWeight: 800, color: '#0e0c1a',
            }}>
              {meeting.title}
            </h1>
            {isOrganizer && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '4px 12px',
                borderRadius: 99, background: 'rgba(108,71,255,.1)', color: '#6c47ff',
              }}>
                👑 Organisateur
              </span>
            )}
          </div>

          {meeting.description && (
            <p style={{ fontSize: 13, color: '#6b6583', marginBottom: 16, lineHeight: 1.6 }}>
              {meeting.description}
            </p>
          )}

          {/* Infos grille */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              ['📅 Date & heure', fmt(meeting.start_at)],
              ['⏱ Durée', meeting.duration_minutes + ' minutes'],
              ['📍 Lieu', meeting.location || 'Non précisé'],
              ['👤 Organisateur', meeting.organizer?.name],
              ['🔔 Rappel', meeting.reminder_minutes + ' min avant'],
              ['👥 Participants', `${acceptedCount} / ${totalInvited} ont accepté`],
            ].map(([label, val]) => (
              <div key={label} style={{
                background: '#f5f3ff', borderRadius: 10, padding: '12px 14px',
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 600, color: '#6b6583',
                  marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.04em',
                }}>
                  {label}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0e0c1a' }}>
                  {val}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Participants */}
      <div style={{
        background: '#fff', borderRadius: 16,
        padding: 22, border: '1px solid #e8e4f8',
      }}>
        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700,
          color: '#6b6583', textTransform: 'uppercase', letterSpacing: '.07em',
          marginBottom: 14,
        }}>
          Participants ({totalInvited})
        </h2>

        {totalInvited === 0 ? (
          <p style={{ fontSize: 13, color: '#6b6583' }}>
            Aucun participant invité.
          </p>
        ) : (
          meeting.invitations?.map(inv => (
            <div key={inv.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', border: '1px solid #e8e4f8',
              borderRadius: 12, marginBottom: 8,
            }}>
              {/* Avatar initiales */}
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg,#6c47ff,#a259ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Syne, sans-serif', fontSize: 12,
                fontWeight: 800, color: '#fff',
              }}>
                {inv.user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#0e0c1a', marginBottom: 2 }}>
                  {inv.user?.name}
                </div>
                <div style={{ fontSize: 11, color: '#6b6583' }}>
                  {inv.user?.email}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '3px 10px',
                  borderRadius: 99, background: statusBg(inv.status),
                  color: statusColor(inv.status),
                }}>
                  {statusLabel(inv.status)}
                </span>
                {inv.responded_at && (
                  <span style={{ fontSize: 10, color: '#6b6583' }}>
                    {new Date(inv.responded_at).toLocaleDateString('fr-FR')}
                  </span>
                )}
              </div>
            </div>
          ))
        )}

        {/* Résumé */}
        {totalInvited > 0 && (
          <div style={{
            display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap',
          }}>
            {[
              { label: 'Accepté', count: meeting.invitations?.filter(i => i.status === 'accepted').length, color: '#169a52', bg: 'rgba(34,212,114,.1)' },
              { label: 'Refusé',  count: meeting.invitations?.filter(i => i.status === 'refused').length,  color: '#ff4d6d', bg: 'rgba(255,77,109,.08)' },
              { label: 'En attente', count: meeting.invitations?.filter(i => i.status === 'pending').length, color: '#c97c00', bg: 'rgba(255,184,48,.1)' },
            ].map(s => (
              <span key={s.label} style={{
                fontSize: 12, fontWeight: 600, padding: '4px 12px',
                borderRadius: 99, background: s.bg, color: s.color,
              }}>
                {s.label} : {s.count}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}