import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { meetingService } from '../services/meetingService';
import { invitationService } from '../services/invitationService';
import StatsChart from '../components/StatsChart';

export default function DashboardPage() {
  const [organized, setOrganized] = useState([]);
  const [invited,   setInvited]   = useState([]);
  const [upcoming,  setUpcoming]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState('all');
  const navigate = useNavigate();

  useEffect(() => { loadMeetings(); }, []);

  const loadMeetings = async () => {
    try {
      const [mRes, uRes] = await Promise.all([
        meetingService.getAll(),
        meetingService.getUpcoming(),
      ]);
      setOrganized(mRes.data.organized);
      setInvited(mRes.data.invited);
      setUpcoming([...uRes.data.organized, ...uRes.data.invited]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Supprimer cette réunion ?')) return;
    await meetingService.remove(id);
    loadMeetings();
  };

  const handleRespond = async (invId, status) => {
    await invitationService.respond(invId, status);
    loadMeetings();
  };

  // Filtrage des réunions
  const filteredOrganized = organized.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all'      ? true :
      filter === 'upcoming' ? new Date(m.start_at) > new Date() :
      filter === 'past'     ? new Date(m.start_at) < new Date() : true;
    return matchSearch && matchFilter;
  });

  const statusColor = (s) =>
    s === 'accepted' ? '#22d472' :
    s === 'refused'  ? '#ff4d6d' : '#ffb830';

  const statusLabel = (s) =>
    s === 'accepted' ? '✓ Accepté' :
    s === 'refused'  ? '✗ Refusé'  : '⏳ En attente';

  const fmt = (d) => new Date(d).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const cardStyle = {
    background: '#fff',
    border: '1px solid #e8e4f8',
    borderRadius: 14,
    padding: '14px 16px',
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all .18s',
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center',
                  alignItems: 'center', height: 300 }}>
      <p style={{ color: '#6b6583' }}>Chargement...</p>
    </div>
  );

  return (
    <div>

      {/* Bannières rappels */}
      {upcoming.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          {upcoming.map(m => (
            <div key={m.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(255,184,48,.07)',
              border: '1px solid rgba(255,184,48,.22)',
              borderRadius: 12, padding: '12px 16px', marginBottom: 8,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%',
                            background: '#ffb830', flexShrink: 0 }}></div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0e0c1a' }}>
                  {m.title}
                </span>
                <span style={{ fontSize: 12, color: '#6b6583', marginLeft: 8 }}>
                  — {fmt(m.start_at)}
                </span>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '3px 10px',
                borderRadius: 99, background: 'rgba(255,184,48,.15)',
                color: '#c97c00',
              }}>
                Bientôt
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
                    gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Réunions organisées', value: organized.length, color: '#6c47ff', bg: 'rgba(108,71,255,.08)' },
          { label: 'Invitations reçues',  value: invited.length,   color: '#00c6ae', bg: 'rgba(0,198,174,.08)' },
          { label: 'Total', value: organized.length + invited.length, color: '#ffb830', bg: 'rgba(255,184,48,.08)' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#fff', borderRadius: 14,
            padding: '18px 20px', border: '1px solid #e8e4f8',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -16, right: -16,
              width: 60, height: 60, borderRadius: '50%', background: s.bg,
            }}></div>
            <div style={{
              fontFamily: 'Syne, sans-serif', fontSize: 30,
              fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 5,
            }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: '#6b6583' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <StatsChart organized={organized} invited={invited} />

      {/* Mes réunions */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 700,
            color: '#6b6583', textTransform: 'uppercase', letterSpacing: '.07em',
          }}>
            Mes réunions ({filteredOrganized.length})
          </h2>
          <Link to="/meetings/create" style={{
            fontSize: 12, fontWeight: 600, color: '#6c47ff',
            padding: '5px 12px', borderRadius: 8,
            background: 'rgba(108,71,255,.08)',
          }}>
            + Nouvelle
          </Link>
        </div>

        {/* Barre recherche + filtres */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Rechercher une réunion..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, minWidth: 200, padding: '9px 14px',
              border: '1px solid rgba(110,99,200,.22)',
              borderRadius: 10, fontSize: 13,
              fontFamily: 'DM Sans, sans-serif',
              outline: 'none', background: '#fff',
            }}
          />
          {[
            { val: 'all',      label: 'Toutes' },
            { val: 'upcoming', label: '📅 À venir' },
            { val: 'past',     label: '⏮ Passées' },
          ].map(f => (
            <button key={f.val} onClick={() => setFilter(f.val)} style={{
              padding: '9px 14px', borderRadius: 10, fontSize: 12,
              fontWeight: 600, border: '1px solid rgba(110,99,200,.22)',
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              background: filter === f.val ? '#6c47ff' : 'transparent',
              color:      filter === f.val ? '#fff'     : '#6b6583',
              transition: 'all .15s',
            }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Liste réunions organisées */}
        {filteredOrganized.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '32px 16px',
            background: '#fff', border: '1px dashed rgba(110,99,200,.22)',
            borderRadius: 14,
          }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
            <div style={{
              fontFamily: 'Syne, sans-serif', fontSize: 14,
              fontWeight: 700, color: '#0e0c1a', marginBottom: 6,
            }}>
              {search ? `Aucun résultat pour "${search}"` : 'Aucune réunion pour l\'instant'}
            </div>
            {!search && (
              <Link to="/meetings/create" style={{
                display: 'inline-block', padding: '9px 20px',
                background: 'linear-gradient(135deg,#6c47ff,#00c6ae)',
                color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 600,
              }}>
                + Créer une réunion
              </Link>
            )}
          </div>
        ) : (
          filteredOrganized.map(m => (
            <div
              key={m.id}
              style={cardStyle}
              onClick={() => navigate(`/meetings/${m.id}`)}
            >
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: 3, borderRadius: '3px 0 0 3px',
                background: 'linear-gradient(180deg,#6c47ff,#a259ff)',
              }}></div>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: 'rgba(108,71,255,.08)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 18, flexShrink: 0,
              }}>📅</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 700,
                  fontSize: 14, color: '#0e0c1a', marginBottom: 5,
                }}>
                  {m.title}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <span style={{ fontSize: 12, color: '#6b6583' }}>📅 {fmt(m.start_at)}</span>
                  <span style={{ fontSize: 12, color: '#6b6583' }}>⏱ {m.duration_minutes} min</span>
                  {m.location && <span style={{ fontSize: 12, color: '#6b6583' }}>📍 {m.location}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '3px 10px',
                  borderRadius: 99, background: 'rgba(108,71,255,.1)', color: '#6c47ff',
                }}>
                  👑 Organisateur
                </span>
                <button
                  onClick={(e) => handleDelete(e, m.id)}
                  style={{
                    padding: '5px 12px', background: 'rgba(255,77,109,.08)',
                    color: '#ff4d6d', border: '1px solid rgba(255,77,109,.2)',
                    borderRadius: 8, cursor: 'pointer', fontSize: 12,
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Invitations reçues */}
      <div>
        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 700,
          color: '#6b6583', textTransform: 'uppercase', letterSpacing: '.07em',
          marginBottom: 12,
        }}>
          Invitations reçues ({invited.length})
        </h2>
        {invited.length === 0 ? (
          <p style={{ color: '#6b6583', fontSize: 13, padding: '16px 0' }}>
            Aucune invitation reçue.
          </p>
        ) : (
          invited.map(m => {
            const inv = m.invitations[0];
            return (
              <div key={m.id} style={cardStyle}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: 3, borderRadius: '3px 0 0 3px',
                  background: inv?.status === 'accepted'
                    ? 'linear-gradient(180deg,#22d472,#6ee7a0)'
                    : inv?.status === 'refused'
                    ? 'linear-gradient(180deg,#ff4d6d,#ff8fa3)'
                    : 'linear-gradient(180deg,#ffb830,#ffd166)',
                }}></div>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: 'rgba(0,198,174,.08)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 18, flexShrink: 0,
                }}>✉️</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 700,
                    fontSize: 14, color: '#0e0c1a', marginBottom: 5,
                  }}>
                    {m.title}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    <span style={{ fontSize: 12, color: '#6b6583' }}>📅 {fmt(m.start_at)}</span>
                    <span style={{ fontSize: 12, color: '#6b6583' }}>👤 {m.organizer?.name}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '3px 10px',
                    borderRadius: 99, background: 'rgba(0,0,0,.05)',
                    color: statusColor(inv?.status),
                  }}>
                    {statusLabel(inv?.status)}
                  </span>
                  {inv?.status === 'pending' && (
                    <>
                      <button onClick={() => handleRespond(inv.id, 'accepted')} style={{
                        padding: '5px 12px', background: 'rgba(34,212,114,.1)',
                        color: '#169a52', border: '1px solid rgba(34,212,114,.25)',
                        borderRadius: 8, cursor: 'pointer', fontSize: 12,
                        fontFamily: 'DM Sans, sans-serif',
                      }}>✓ Accepter</button>
                      <button onClick={() => handleRespond(inv.id, 'refused')} style={{
                        padding: '5px 12px', background: 'rgba(255,77,109,.08)',
                        color: '#ff4d6d', border: '1px solid rgba(255,77,109,.2)',
                        borderRadius: 8, cursor: 'pointer', fontSize: 12,
                        fontFamily: 'DM Sans, sans-serif',
                      }}>✗ Refuser</button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}