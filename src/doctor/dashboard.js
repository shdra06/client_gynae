// ================================================================
// DOCTOR PORTAL — Dashboard (Clean clinical design)
// ================================================================
import { todayAppointments, followUps } from '../data/appointments.js';
import { patients } from '../data/patients.js';
import { doctorSidebar } from '../components/shared.js';

const statusState = {};

export function renderDoctorDashboard(container) {
  todayAppointments.forEach(a => { if (!statusState[a.id]) statusState[a.id] = a.status; });
  _render(container);
}

function _render(container) {
  const appts    = todayAppointments.map(a => ({ ...a, status: statusState[a.id] || a.status }));
  const waiting  = appts.filter(a => a.status === 'waiting' || a.status === 'checked_in').length;
  const inProg   = appts.filter(a => a.status === 'in_progress').length;
  const done     = appts.filter(a => a.status === 'completed').length;
  const nextPt   = appts.find(a => a.status === 'waiting' || a.status === 'checked_in');

  const now      = new Date();
  const dateStr  = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const enriched = appts.map(a => {
    const pt  = patients.find(p => p.id === a.patient_id);
    const g   = pt?.gynec;
    let sub   = a.patient_age;
    if (g) sub += ' · G' + g.gravida + 'P' + g.para;
    return { ...a, sub, hasAllergy: !!pt?.allergies };
  });

  container.innerHTML = `
    <div style="display:flex; height:100vh; overflow:hidden; font-family:'Inter',sans-serif; background:#F3F5F9;">
      ${doctorSidebar('/doctor')}

      <div style="flex:1; margin-left:48px; display:flex; flex-direction:column; height:100vh; overflow:hidden;">

        <!-- ══ HEADER ══ -->
        <header style="flex-shrink:0; background:#fff; border-bottom:1px solid #E2E8F0; padding:16px 24px; display:flex; align-items:center; gap:16px;">
          <div style="flex:1;">
            <h1 style="margin:0; font-size:1.35rem; font-weight:800; color:#1B2B45; letter-spacing:-0.5px; line-height:1.2;">Today's Overview</h1>
            <div style="font-size:0.72rem; color:#94A3B8; margin-top:2px;">Dr. Anita Mehta &nbsp;·&nbsp; ${dateStr}</div>
          </div>
          ${nextPt ? `
            <button onclick="navigate('/doctor/consult/${nextPt.id}')"
              style="display:flex; align-items:center; gap:7px; padding:9px 20px; background:#0F766E; color:#fff; border:none; border-radius:8px; font-size:0.78rem; font-weight:700; cursor:pointer; white-space:nowrap; flex-shrink:0; transition:background 0.15s; letter-spacing:-0.2px;"
              onmouseover="this.style.background='#115E59'" onmouseout="this.style.background='#0F766E'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.26h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.01-.85a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Consult Next Patient
            </button>` : `
            <span style="padding:8px 16px; background:#F0FDF4; color:#16A34A; border-radius:8px; font-size:0.76rem; font-weight:700; border:1px solid #BBF7D0; flex-shrink:0;">✓ All Done</span>`}
        </header>

        <!-- ══ STAT CARDS ══ -->
        <div style="flex-shrink:0; padding:12px 24px; display:flex; gap:10px; background:#fff; border-bottom:1px solid #E2E8F0;">
          ${[
            { label:'TOTAL PATIENTS', val: appts.length, icon: '👥' },
            { label:'WAITING',        val: waiting,      icon: '⏳' },
            { label:'IN PROGRESS',    val: inProg,       icon: '🔵' },
            { label:'DONE',           val: done,         icon: '✅' },
            { label:'FOLLOW-UPS',     val: followUps.length, icon: '📋' },
          ].map(s => `
            <div style="flex:1; border:1px solid #E2E8F0; border-radius:8px; padding:10px 14px; display:flex; align-items:center; gap:10px; background:#FAFBFD;">
              <span style="font-size:1.1rem;">${s.icon}</span>
              <div>
                <div style="font-size:1.3rem; font-weight:800; color:#1B2B45; line-height:1;">${s.val}</div>
                <div style="font-size:0.55rem; font-weight:700; color:#94A3B8; text-transform:uppercase; letter-spacing:0.5px; margin-top:1px;">${s.label}</div>
              </div>
            </div>`).join('')}
        </div>

        <!-- ══ MAIN: Queue + Follow-ups ══ -->
        <div style="flex:1; display:grid; grid-template-columns:1fr 280px; overflow:hidden; min-height:0;">

          <!-- Today's Queue -->
          <div style="display:flex; flex-direction:column; overflow:hidden; background:#fff;">
            <!-- Queue header -->
            <div style="flex-shrink:0; padding:12px 24px 10px; border-bottom:1px solid #E2E8F0; display:flex; align-items:center; justify-content:space-between;">
              <span style="font-size:0.88rem; font-weight:700; color:#1B2B45;">Today's Queue</span>
              <span style="display:flex; align-items:center; gap:5px; font-size:0.6rem; font-weight:600; color:#16A34A;">
                <span style="width:6px; height:6px; border-radius:50%; background:#16A34A; animation:pulse 2s infinite; display:inline-block;"></span>
                Live Updates
              </span>
            </div>

            <!-- Column headers -->
            <div style="flex-shrink:0; display:grid; grid-template-columns:90px 1fr 1fr 150px; padding:8px 24px; background:#F8FAFC; border-bottom:1px solid #E2E8F0;">
              ${['TOKEN / TIME','PATIENT','CHIEF COMPLAINT','ACTION'].map(h =>
                '<div style="font-size:0.57rem; font-weight:700; text-transform:uppercase; letter-spacing:0.7px; color:#94A3B8;">' + h + '</div>'
              ).join('')}
            </div>

            <!-- Scrollable rows -->
            <div style="flex:1; overflow-y:auto;">
              ${enriched.sort((a,b) => a.token_number - b.token_number).map(a => {
                const isActive  = a.status === 'in_progress';
                const isWaiting = a.status === 'waiting' || a.status === 'checked_in';
                const isDone    = a.status === 'completed';

                let actionBtn;
                if (isActive) {
                  actionBtn = '<button onclick="navigate(\'/doctor/consult/' + a.id + '\')" style="padding:5px 14px; background:#1D4ED8; color:#fff; border:none; border-radius:6px; font-size:0.66rem; font-weight:700; cursor:pointer; white-space:nowrap; transition:all 0.12s;" onmouseover="this.style.background=\'#1e40af\'" onmouseout="this.style.background=\'#1D4ED8\'">Resume</button>';
                } else if (isWaiting) {
                  actionBtn = '<div style="display:flex; gap:5px; align-items:center;">'
                    + '<button class="call-btn" data-name="' + a.patient_name + '" data-id="' + a.id + '" style="padding:5px 10px; background:#fff; color:#1B2B45; border:1.5px solid #E2E8F0; border-radius:6px; font-size:0.66rem; font-weight:700; cursor:pointer; white-space:nowrap; transition:all 0.12s;" onmouseover="this.style.background=\'#F1F5F9\'" onmouseout="this.style.background=\'#fff\'">Call</button>'
                    + '<button onclick="navigate(\'/doctor/consult/' + a.id + '\')" style="padding:5px 10px; background:#1B2B45; color:#fff; border:none; border-radius:6px; font-size:0.66rem; font-weight:700; cursor:pointer; white-space:nowrap; transition:all 0.12s;" onmouseover="this.style.background=\'#2D4A7A\'" onmouseout="this.style.background=\'#1B2B45\'">Consult</button>'
                    + '</div>';
                } else if (isDone) {
                  actionBtn = '<button onclick="navigate(\'/doctor/consult/' + a.id + '\')" style="padding:5px 12px; background:#F8FAFC; color:#64748B; border:1px solid #E2E8F0; border-radius:6px; font-size:0.66rem; font-weight:700; cursor:pointer; white-space:nowrap;" onmouseover="this.style.background=\'#F1F5F9\'" onmouseout="this.style.background=\'#F8FAFC\'">View</button>';
                } else {
                  actionBtn = '<span style="font-size:0.66rem; color:#94A3B8; font-style:italic;">At Reception</span>';
                }

                return '<div style="display:grid; grid-template-columns:90px 1fr 1fr 150px; align-items:center; padding:13px 24px; border-bottom:1px solid #E8ECF0; background:' + (isActive ? '#F0F9FF' : '#fff') + '; border-left:3px solid ' + (isActive ? '#1D4ED8' : isDone ? '#D1D5DB' : isWaiting ? '#1B2B45' : '#E2E8F0') + '; transition:background 0.1s;" onmouseover="this.style.background=\'' + (isActive ? '#EFF6FF' : '#F8FAFC') + '\'" onmouseout="this.style.background=\'' + (isActive ? '#F0F9FF' : '#fff') + '\'">'
                  + '<div>'
                  + '<div style="display:inline-flex; align-items:center; justify-content:center; padding:2px 8px; background:' + (isActive ? '#1D4ED8' : isDone ? '#E2E8F0' : '#1B2B45') + '; color:' + (isDone ? '#64748B' : '#fff') + '; border-radius:5px; font-size:0.66rem; font-weight:800; font-family:monospace; margin-bottom:2px;">#' + a.token_number + '</div>'
                  + '<div style="font-size:0.6rem; color:#94A3B8;">' + a.scheduled_time + '</div>'
                  + '</div>'
                  + '<div>'
                  + '<div style="display:flex; align-items:center; gap:5px;">'
                  + '<span style="font-weight:700; font-size:0.8rem; color:' + (isDone ? '#94A3B8' : '#1B2B45') + '; cursor:pointer;" onclick="navigate(\'/doctor/consult/' + a.id + '\')">' + a.patient_name + '</span>'
                  + (a.hasAllergy ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' : '')
                  + '</div>'
                  + '<div style="font-size:0.6rem; color:#94A3B8;">' + a.sub + '</div>'
                  + '</div>'
                  + '<div style="font-size:0.72rem; color:' + (isDone ? '#CBD5E1' : '#475569') + '; padding-right:10px; line-height:1.4;">'
                  + a.chief_complaint
                  + '</div>'
                  + '<div>' + actionBtn + '</div>'
                  + '</div>';
              }).join('')}
            </div>
          </div>

          <!-- Follow-ups Due Today -->
          <div style="display:flex; flex-direction:column; overflow:hidden; background:#FAFBFD; border-left:1px solid #E2E8F0;">
            <div style="flex-shrink:0; padding:12px 16px 10px; border-bottom:1px solid #E2E8F0;">
              <div style="font-size:0.88rem; font-weight:700; color:#1B2B45;">Follow-ups Due Today</div>
            </div>
            <div style="flex:1; overflow-y:auto; padding:4px 0;">
              ${followUps.map(f => {
                const isToday = f.due === 'Today';
                const tagColor = isToday ? '#DC2626' : '#D97706';
                const tagBg    = isToday ? '#FEF2F2' : '#FFFBEB';
                const typeIcon = f.type === 'call' ? '📞' : f.type === 'labs' ? '🔬' : '🏥';
                return '<div style="margin:6px 12px; padding:12px 14px; background:#fff; border:1px solid #E2E8F0; border-left:3px solid ' + tagColor + '; border-radius:6px; cursor:pointer; transition:all 0.12s;" onmouseover="this.style.borderColor=\'#C7D2FE\'" onmouseout="this.style.borderColor=\'#E2E8F0\'">'
                  + '<div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">'
                  + '<span style="font-weight:700; font-size:0.8rem; color:#1B2B45;">' + f.patient_name + '</span>'
                  + '<span style="font-size:0.85rem;">' + typeIcon + '</span>'
                  + '</div>'
                  + '<div style="font-size:0.66rem; color:#64748B; margin-bottom:6px; line-height:1.4;">' + f.reason + '</div>'
                  + '<span style="font-size:0.58rem; font-weight:700; padding:2px 8px; background:' + tagBg + '; color:' + tagColor + '; border-radius:4px; display:inline-flex; align-items:center; gap:3px;">'
                  + (isToday ? '⚠ Due Today' : '📅 ' + f.due)
                  + '</span>'
                  + '</div>';
              }).join('')}
              ${followUps.length === 0 ? '<div style="padding:24px; text-align:center; font-size:0.78rem; color:#94A3B8; font-style:italic;">No follow-ups due today</div>' : ''}
            </div>
          </div>

        </div><!-- end main area -->
      </div><!-- end right column -->
    </div><!-- end root -->

    <style>
      @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
    </style>
  `;

  // Call buttons
  container.querySelectorAll('.call-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const name = btn.dataset.name;
      btn.textContent = '📢 Calling…';
      btn.style.background = '#1D4ED8'; btn.style.color = '#fff'; btn.disabled = true;
      const t = document.createElement('div');
      t.className = 'toast success';
      t.innerHTML = '<span>📢</span><span>Calling <strong>' + name + '</strong> to consultation room</span>';
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 4000);
      setTimeout(() => { btn.textContent = 'Call'; btn.style.background='#fff'; btn.style.color='#1B2B45'; btn.disabled=false; }, 3000);
    });
  });
}
