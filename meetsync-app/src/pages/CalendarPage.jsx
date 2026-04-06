import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { meetingService } from '../services/meetingService';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { 'fr': fr },
});

const messages = {
  allDay:     'Toute la journée',
  previous:   '← Précédent',
  next:       'Suivant →',
  today:      "Aujourd'hui",
  month:      'Mois',
  week:       'Semaine',
  day:        'Jour',
  agenda:     'Agenda',
  date:       'Date',
  time:       'Heure',
  event:      'Réunion',
  noEventsInRange: 'Aucune réunion sur cette période.',
};

export default function CalendarPage() {
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    meetingService.getAll().then(({ data }) => {
      const all = [...data.organized, ...data.invited];
      setEvents(all.map(m => ({
        id:       m.id,
        title:    m.title,
        start:    new Date(m.start_at),
        end:      new Date(new Date(m.start_at).getTime() + m.duration_minutes * 60000),
        resource: m,
        isOrg:    data.organized.some(o => o.id === m.id),
      })));
    }).finally(() => setLoading(false));
  }, []);

  const fmt = (d) => new Date(d).toLocaleString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div>
      <h1 style={{
        fontFamily: 'Syne, sans-serif', fontSize: 22,
        fontWeight: 800, marginBottom: 20, color: '#0e0c1a',
      }}>
        📅 Calendrier des réunions
      </h1>

      {/* Légende */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3,
                        background: 'linear-gradient(135deg,#6c47ff,#a259ff)' }}></div>
          <span style={{ fontSize: 12, color: '#6b6583' }}>Mes réunions</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3,
                        background: 'linear-gradient(135deg,#00c6ae,#00e8cd)' }}></div>
          <span style={{ fontSize: 12, color: '#6b6583' }}>Invitations</span>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#6b6583' }}>Chargement...</p>
      ) : (
        <div style={{
          background: '#fff', borderRadius: 16, padding: 20,
          border: '1px solid #e8e4f8', height: 600,
        }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            culture="fr"
            messages={messages}
            onSelectEvent={event => setSelected(event)}
            eventPropGetter={(event) => ({
              style: {
                background: event.isOrg
                  ? 'linear-gradient(135deg,#6c47ff,#a259ff)'
                  : 'linear-gradient(135deg,#00c6ae,#00e8cd)',
                border: 'none',
                borderRadius: 6,
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'DM Sans, sans-serif',
                padding: '2px 6px',
              }
            })}
            style={{ height: '100%', fontFamily: 'DM Sans, sans-serif' }}
          />
        </div>
      )}

      {/* Popup détail */}
      {selected && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(14,12,26,.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setSelected(null)}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: 24,
            maxWidth: 420, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,.2)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
                          alignItems: 'flex-start', marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18,
                           fontWeight: 800, color: '#0e0c1a' }}>
                {selected.title}
              </h2>
              <button onClick={() => setSelected(null)} style={{
                background: 'none', border: 'none', fontSize: 18,
                cursor: 'pointer', color: '#6b6583',
              }}>✕</button>
            </div>
            {[
              ['📅 Date', fmt(selected.start)],
              ['⏱ Durée', selected.resource.duration_minutes + ' min'],
              ['📍 Lieu', selected.resource.location || 'Non précisé'],
              ['👤 Organisateur', selected.resource.organizer?.name],
            ].map(([label, val]) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#6b6583',
                               textTransform: 'uppercase' }}>{label}</span>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#0e0c1a',
                              marginTop: 3 }}>{val}</div>
              </div>
            ))}
            <button onClick={() => setSelected(null)} style={{
              width: '100%', padding: 10, marginTop: 8,
              background: 'linear-gradient(135deg,#6c47ff,#00c6ae)',
              color: '#fff', border: 'none', borderRadius: 10,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
