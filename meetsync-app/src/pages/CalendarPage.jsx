import { useEffect, useState, useCallback } from 'react';
import { meetingService } from '../services/meetingService';

const DAYS = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];

const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin',
                'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  let d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

export default function CalendarPage() {
  const [meetings,  setMeetings]  = useState([]);
  const [organized, setOrganized] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [current,   setCurrent]   = useState(() => new Date());
  const [selected,  setSelected]  = useState(null);
  const [view,      setView]      = useState('month');

  useEffect(() => {
    meetingService.getAll().then(({ data }) => {
      setOrganized(data.organized.map(m => m.id));
      setMeetings([...data.organized, ...data.invited]);
    }).finally(() => setLoading(false));
  }, []);

  // Ces valeurs sont recalculées à chaque render
  const year  = current.getFullYear();
  const month = current.getMonth();

  // Navigation mois
  const prevMonth = () => {
    setCurrent(prev => {
      const d = new Date(prev);
      d.setDate(1);
      d.setMonth(d.getMonth() - 1);
      return new Date(d);
    });
  };

  const nextMonth = () => {
    setCurrent(prev => {
      const d = new Date(prev);
      d.setDate(1);
      d.setMonth(d.getMonth() + 1);
      return new Date(d);
    });
  };

  const goToday = () => {
    setCurrent(new Date());
  };

  // Navigation semaine
  const prevWeek = () => {
    setCurrent(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return new Date(d);
    });
  };

  const nextWeek = () => {
    setCurrent(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return new Date(d);
    });
  };

  const getMeetingsForDay = useCallback((day) => {
    return meetings.filter(m => {
      const d = new Date(m.start_at);
      return d.getFullYear() === year &&
             d.getMonth()    === month &&
             d.getDate()     === day;
    });
  }, [meetings, year, month]);

  const isOrganizer = (m) => organized.includes(m.id);

  const fmt = (d) => new Date(d).toLocaleString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const isToday = (day) => {
    const t = new Date();
    return t.getFullYear() === year &&
           t.getMonth()    === month &&
           t.getDate()     === day;
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstDayOfMonth(year, month);
  const totalCells  = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  // Couleurs selon le rôle
  const eventColor = (m) => isOrganizer(m)
    ? { bg: 'linear-gradient(135deg,#6c47ff,#a259ff)', dot: '#6c47ff' }
    : { bg: 'linear-gradient(135deg,#00c6ae,#00e8cd)', dot: '#00c6ae' };

  const btnStyle = (active) => ({
    padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
    border: '1px solid rgba(110,99,200,.22)', cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif', transition: 'all .15s',
    background: active ? '#6c47ff' : '#fff',
    color:      active ? '#fff'    : '#6b6583',
  });

  const upcomingMeetings = [...meetings]
    .filter(m => new Date(m.start_at) >= new Date())
    .sort((a, b) => new Date(a.start_at) - new Date(b.start_at));

  // Début de semaine (lundi)
  const getWeekStart = (date) => {
    const d = new Date(date);
    const dow = d.getDay();
    const diff = dow === 0 ? -6 : 1 - dow;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(getWeekStart(current));
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div>
      <h1 style={{
        fontFamily: 'Syne, sans-serif', fontSize: 22,
        fontWeight: 800, marginBottom: 20, color: '#0e0c1a',
      }}>
        📅 Calendrier
      </h1>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16, flexWrap: 'wrap', gap: 10,
        background: '#fff', borderRadius: 14,
        padding: '12px 16px', border: '1px solid rgba(110,99,200,.13)',
      }}>

        {/* Navigation + titre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={goToday} style={btnStyle(false)}>
            Aujourd'hui
          </button>
          <button
            onClick={view === 'week' ? prevWeek : prevMonth}
            style={{ ...btnStyle(false), padding: '7px 12px' }}
          >
            ←
          </button>
          <button
            onClick={view === 'week' ? nextWeek : nextMonth}
            style={{ ...btnStyle(false), padding: '7px 12px' }}
          >
            →
          </button>
          <span style={{
            fontFamily: 'Syne, sans-serif', fontSize: 16,
            fontWeight: 700, color: '#0e0c1a', minWidth: 160,
          }}>
            {view === 'week'
              ? `${weekDays[0].getDate()} – ${weekDays[6].getDate()} ${MONTHS[weekDays[6].getMonth()]} ${weekDays[6].getFullYear()}`
              : `${MONTHS[month]} ${year}`
            }
          </span>
        </div>

        {/* Vues */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { key: 'month', label: 'Mois' },
            { key: 'week',  label: 'Semaine' },
            { key: 'list',  label: 'Liste' },
          ].map(v => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              style={btnStyle(view === v.key)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Légende */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3,
                        background: 'linear-gradient(135deg,#6c47ff,#a259ff)' }}></div>
          <span style={{ fontSize: 12, color: '#6b6583' }}>
            Mes réunions (organisateur)
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3,
                        background: 'linear-gradient(135deg,#00c6ae,#00e8cd)' }}></div>
          <span style={{ fontSize: 12, color: '#6b6583' }}>
            Invitations reçues
          </span>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#6b6583' }}>Chargement...</p>
      ) : (
        <>

          {/* ── VUE MOIS ── */}
          {view === 'month' && (
            <div style={{
              background: '#fff', borderRadius: 16,
              border: '1px solid rgba(110,99,200,.13)', overflow: 'hidden',
            }}>
              {/* En-têtes */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
                {DAYS.map(d => (
                  <div key={d} style={{
                    padding: '10px 8px', textAlign: 'center',
                    fontSize: 11, fontWeight: 700, color: '#6b6583',
                    textTransform: 'uppercase', letterSpacing: '.05em',
                    borderBottom: '1px solid rgba(110,99,200,.1)',
                    background: '#f5f3ff',
                  }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Cellules */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
                {Array.from({ length: totalCells }).map((_, idx) => {
                  const day = idx - firstDay + 1;
                  const valid = day >= 1 && day <= daysInMonth;
                  const dayMeetings = valid ? getMeetingsForDay(day) : [];
                  const today = valid && isToday(day);

                  return (
                    <div key={idx} style={{
                      minHeight: 90, padding: 6,
                      borderRight: (idx + 1) % 7 !== 0
                        ? '1px solid rgba(110,99,200,.08)' : 'none',
                      borderBottom: idx < totalCells - 7
                        ? '1px solid rgba(110,99,200,.08)' : 'none',
                      background: today
                        ? 'rgba(108,71,255,.04)'
                        : valid ? '#fff' : '#fafafa',
                    }}>
                      {valid && (
                        <>
                          {/* Numéro du jour */}
                          <div style={{
                            width: 26, height: 26, borderRadius: '50%',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', marginBottom: 4,
                            background: today ? '#6c47ff' : 'transparent',
                            color: today ? '#fff' : '#0e0c1a',
                            fontSize: 13,
                            fontWeight: today ? 800 : 400,
                          }}>
                            {day}
                          </div>

                          {/* Événements */}
                          {dayMeetings.slice(0, 2).map(m => (
                            <div
                              key={m.id}
                              onClick={() => setSelected(m)}
                              style={{
                                background: eventColor(m).bg,
                                color: '#fff', borderRadius: 4,
                                padding: '2px 6px', fontSize: 10,
                                fontWeight: 600, marginBottom: 2,
                                cursor: 'pointer', overflow: 'hidden',
                                whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                              }}
                            >
                              {new Date(m.start_at).toLocaleTimeString('fr-FR', {
                                hour: '2-digit', minute: '2-digit',
                              })} {m.title}
                            </div>
                          ))}

                          {dayMeetings.length > 2 && (
                            <div style={{
                              fontSize: 10, color: '#6c47ff', fontWeight: 600,
                            }}>
                              +{dayMeetings.length - 2} autres
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── VUE SEMAINE ── */}
          {view === 'week' && (
            <div style={{
              background: '#fff', borderRadius: 16,
              border: '1px solid rgba(110,99,200,.13)', overflow: 'hidden',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
                {weekDays.map((d, i) => {
                  const dayMeetings = meetings.filter(m => {
                    const md = new Date(m.start_at);
                    return md.toDateString() === d.toDateString();
                  });
                  const isT = d.toDateString() === new Date().toDateString();

                  return (
                    <div key={i} style={{
                      borderRight: i < 6
                        ? '1px solid rgba(110,99,200,.08)' : 'none',
                      minHeight: 220,
                    }}>
                      {/* En-tête colonne */}
                      <div style={{
                        padding: '10px 8px', textAlign: 'center',
                        borderBottom: '1px solid rgba(110,99,200,.1)',
                        background: isT ? 'rgba(108,71,255,.06)' : '#f5f3ff',
                      }}>
                        <div style={{
                          fontSize: 11, fontWeight: 700, color: '#6b6583',
                          textTransform: 'uppercase',
                        }}>
                          {DAYS[i]}
                        </div>
                        <div style={{
                          fontSize: 20, fontWeight: 800,
                          color: isT ? '#6c47ff' : '#0e0c1a',
                        }}>
                          {d.getDate()}
                        </div>
                      </div>

                      {/* Réunions */}
                      <div style={{ padding: 6 }}>
                        {dayMeetings.map(m => (
                          <div
                            key={m.id}
                            onClick={() => setSelected(m)}
                            style={{
                              background: eventColor(m).bg,
                              color: '#fff', borderRadius: 6,
                              padding: '5px 8px', fontSize: 11,
                              fontWeight: 600, marginBottom: 4,
                              cursor: 'pointer',
                            }}
                          >
                            <div>{new Date(m.start_at).toLocaleTimeString('fr-FR', {
                              hour: '2-digit', minute: '2-digit',
                            })}</div>
                            <div style={{ fontSize: 10, opacity: .85, marginTop: 2 }}>
                              {m.title}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── VUE LISTE ── */}
          {view === 'list' && (
            <div>
              {upcomingMeetings.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '40px 20px',
                  background: '#fff', borderRadius: 16,
                  border: '1px dashed rgba(110,99,200,.22)',
                }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
                  <p style={{ color: '#6b6583', fontSize: 13 }}>
                    Aucune réunion à venir.
                  </p>
                </div>
              ) : (
                upcomingMeetings.map(m => {
                  const color = eventColor(m);
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelected(m)}
                      style={{
                        background: '#fff',
                        border: '1px solid rgba(110,99,200,.13)',
                        borderRadius: 14, padding: '14px 16px',
                        marginBottom: 8, display: 'flex',
                        alignItems: 'center', gap: 14,
                        cursor: 'pointer', transition: 'all .15s',
                        position: 'relative', overflow: 'hidden',
                      }}
                    >
                      {/* Barre couleur gauche */}
                      <div style={{
                        position: 'absolute', left: 0, top: 0, bottom: 0,
                        width: 4, background: color.bg,
                      }}></div>

                      {/* Date badge */}
                      <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        flexShrink: 0,
                        background: isOrganizer(m)
                          ? 'rgba(108,71,255,.08)'
                          : 'rgba(0,198,174,.08)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <div style={{
                          fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                          color: color.dot,
                        }}>
                          {MONTHS[new Date(m.start_at).getMonth()].slice(0, 3)}
                        </div>
                        <div style={{
                          fontSize: 18, fontWeight: 800,
                          color: color.dot, lineHeight: 1,
                        }}>
                          {new Date(m.start_at).getDate()}
                        </div>
                      </div>

                      <div style={{ flex: 1, paddingLeft: 4 }}>
                        <div style={{
                          fontFamily: 'Syne, sans-serif', fontWeight: 700,
                          fontSize: 14, color: '#0e0c1a', marginBottom: 4,
                        }}>
                          {m.title}
                        </div>
                        <div style={{ fontSize: 12, color: '#6b6583' }}>
                          🕐 {new Date(m.start_at).toLocaleTimeString('fr-FR', {
                            hour: '2-digit', minute: '2-digit',
                          })}
                          &nbsp;·&nbsp;⏱ {m.duration_minutes} min
                          {m.location && <> &nbsp;·&nbsp; 📍 {m.location}</>}
                        </div>
                      </div>

                      {/* Badge rôle */}
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '3px 10px',
                        borderRadius: 99, flexShrink: 0,
                        background: isOrganizer(m)
                          ? 'rgba(108,71,255,.1)' : 'rgba(0,198,174,.1)',
                        color: isOrganizer(m) ? '#6c47ff' : '#00c6ae',
                      }}>
                        {isOrganizer(m) ? '👑 Organisateur' : '✉️ Invité'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </>
      )}

      {/* ── POPUP DÉTAIL ── */}
      {selected && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(14,12,26,.55)', zIndex: 1000,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: 20,
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              background: '#fff', borderRadius: 16, padding: 24,
              maxWidth: 420, width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,.2)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* En-tête popup */}
            <div style={{ display: 'flex', justifyContent: 'space-between',
                          alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h2 style={{
                  fontFamily: 'Syne, sans-serif', fontSize: 18,
                  fontWeight: 800, color: '#0e0c1a', marginBottom: 6,
                }}>
                  {selected.title}
                </h2>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '3px 10px',
                  borderRadius: 99,
                  background: isOrganizer(selected)
                    ? 'rgba(108,71,255,.1)' : 'rgba(0,198,174,.1)',
                  color: isOrganizer(selected) ? '#6c47ff' : '#00c6ae',
                }}>
                  {isOrganizer(selected) ? '👑 Organisateur' : '✉️ Invité'}
                </span>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: 'none', border: 'none',
                  fontSize: 20, cursor: 'pointer', color: '#6b6583',
                }}
              >
                ✕
              </button>
            </div>

            {/* Détails */}
            {[
              ['📅 Date', fmt(selected.start_at)],
              ['⏱ Durée', selected.duration_minutes + ' minutes'],
              ['📍 Lieu', selected.location || 'Non précisé'],
              ['👤 Organisateur', selected.organizer?.name],
            ].map(([label, val]) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid rgba(110,99,200,.1)',
              }}>
                <span style={{ fontSize: 12, color: '#6b6583', fontWeight: 600 }}>
                  {label}
                </span>
                <span style={{ fontSize: 12, color: '#0e0c1a', fontWeight: 500 }}>
                  {val}
                </span>
              </div>
            ))}

            <button
              onClick={() => setSelected(null)}
              style={{
                width: '100%', padding: 11, marginTop: 16,
                background: 'linear-gradient(135deg,#6c47ff,#00c6ae)',
                color: '#fff', border: 'none', borderRadius: 10,
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}