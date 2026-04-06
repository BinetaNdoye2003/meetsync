import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

export default function StatsChart({ organized, invited }) {
  const allInvitations = organized.flatMap(m => m.invitations || []);
  const accepted = allInvitations.filter(i => i.status === 'accepted').length;
  const refused  = allInvitations.filter(i => i.status === 'refused').length;
  const pending  = allInvitations.filter(i => i.status === 'pending').length;

  const data = [
    { name: 'Acceptées', value: accepted, color: '#22d472' },
    { name: 'Refusées',  value: refused,  color: '#ff4d6d' },
    { name: 'En attente', value: pending, color: '#ffb830' },
  ];

  if (allInvitations.length === 0) return null;

  return (
    <div style={{
      background: '#fff', borderRadius: 14,
      padding: '18px 20px', border: '1px solid #e8e4f8', marginBottom: 24,
    }}>
      <h2 style={{
        fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 700,
        color: '#6b6583', textTransform: 'uppercase',
        letterSpacing: '.07em', marginBottom: 16,
      }}>
        📊 Statut des invitations envoyées
      </h2>

      {/* Chiffres résumés */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        {data.map(d => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: d.color, flexShrink: 0,
            }}></div>
            <span style={{ fontSize: 12, color: '#6b6583' }}>
              {d.name} : <strong style={{ color: '#0e0c1a' }}>{d.value}</strong>
            </span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barSize={48} barGap={8}>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b6583', fontFamily: 'DM Sans, sans-serif' }}
          />
          <YAxis hide />
          <Tooltip
            formatter={(val, name) => [val + ' invitation(s)', name]}
            contentStyle={{
              borderRadius: 10,
              border: '1px solid #e8e4f8',
              fontSize: 12,
              fontFamily: 'DM Sans, sans-serif',
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
