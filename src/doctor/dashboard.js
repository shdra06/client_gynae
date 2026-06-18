// ================================================================
// DOCTOR PORTAL — Dashboard (Zero-scroll, everything one screen)
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
  const done     = appts.filter(a => a.status === 'completed').length;
  const nextPt   = appts.find(a => a.status === 'waiting' || a.status === 'checked_in');

  const now      = new Date();
  const dateStr  = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const enriched = appts.map(a => {
    const pt  = patients.find(p => p.id === a.patient_id);
    const g   = pt?.gynec;
    let sub   = a.patient_age;
    if (g) sub += ' · G' + g.gravida + 'P' + g.para;
    if (a.weeks_pregnant) sub += ' · ' + a.weeks_pregnant + 'wks';
    return { ...a, sub, hasAllergy: !!pt?.allergies };
  });

  container.innerHTML = `
    <div style="display:flex; height:100vh; overflow:hidden; font-family:'Inter',sans-serif; background:#E5EBF0;">
      ${doctorSidebar('/doctor')}

      <div style="flex:1; margin-left:48px; display:flex; flex-direction:column; height:100vh; overflow:hidden;">

        <!-- ══ HEADER — contains everything including today's overview ══ -->
        <header style="flex-shrink:0; background:#fff; border-bottom:1.5px solid #D9E2EC; padding:0 20px; display:flex; align-items:center; gap:16px; height:56px;">
          <!-- Brand -->
          <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
            <div style="width:28px; height:28px; background:#1B2B45; border-radius:7px; display:flex; align-items:center; justify-content:center;">
              <span style="color:#fff; font-weight:800; font-size:0.72rem;">OB</span>
            </div>
            <div>
              <div style="font-size:0.78rem; font-weight:800; color:#1B2B45;">OB/GYN Clinic</div>
              <div style="font-size:0.55rem; color:#94A3B8; margin-top:-1px;">Management Portal</div>
            </div>
          </div>

          <div style="width:1px; height:28px; background:#E2E8F0;"></div>
          <span style="font-size:0.85rem; font-weight:700; color:#1B2B45; flex-shrink:0;">ClinicFlow OB/GYN</span>

          <!-- Search -->
          <div style="flex:1; max-width:260px;">
            <div style="display:flex; align-items:center; gap:8px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:7px; padding:5px 11px;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input placeholder="Search patients..." style="border:none; background:transparent; outline:none; font-size:0.75rem; color:#475569; width:100%; font-family:inherit;">
            </div>
          </div>

          <div style="flex:1;"></div>

          <!-- Today's Overview — IN HEADER -->
          <div style="flex-shrink:0; text-align:right;">
            <div style="font-size:0.95rem; font-weight:800; color:#1B2B45; letter-spacing:-0.3px;">Today's Overview</div>
            <div style="font-size:0.68rem; color:#94A3B8;">Dr. Anita Mehta &nbsp;·&nbsp; ${dateStr}</div>
          </div>

          <!-- Consult Next Patient button — IN HEADER -->
          ${nextPt ? `
            <button onclick="navigate('/doctor/consult/${nextPt.id}')"
              style="display:flex; align-items:center; gap:7px; padding:8px 16px; background:#1B2B45; color:#fff; border:none; border-radius:7px; font-size:0.76rem; font-weight:700; cursor:pointer; white-space:nowrap; flex-shrink:0; transition:background 0.15s;"
              onmouseover="this.style.background='#2D4A7A'" onmouseout="this.style.background='#1B2B45'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.26h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.01-.85a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Consult Next
            </button>` : `
            <span style="padding:7px 14px; background:#F0FDF4; color:#16A34A; border-radius:7px; font-size:0.74rem; font-weight:700; border:1px solid #BBF7D0; flex-shrink:0;">✓ All Done</span>`}

          <!-- Bell + Avatar -->
          <button style="background:none; border:none; cursor:pointer; padding:6px; color:#64748B; position:relative; flex-shrink:0;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span style="position:absolute;top:4px;right:4px;width:7px;height:7px;background:#EF4444;border-radius:50%;border:1.5px solid #fff;"></span>
          </button>
          <div style="width:32px; height:32px; border-radius:50%; background:#E0E7FF; display:flex; align-items:center; justify-content:center; font-size:0.68rem; font-weight:800; color:#4338CA; cursor:pointer; flex-shrink:0;" title="Dr. Anita Mehta">AM</div>
        </header>

        <!-- ══ STAT PILLS ROW — compact, no wasted space ══ -->
        <div style="flex-shrink:0; background:#FAFBFD; border-bottom:1.5px solid #D9E2EC; padding:8px 20px; display:flex; gap:12px;">
          ${[
            { label:'Total Patients', val: appts.length, color:'#1D4ED8', bg:'#EFF6FF', svg:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
            { label:'Waiting',        val: waiting,      color:'#D97706', bg:'#FFFBEB', svg:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' },
            { label:'In Progress',    val: appts.filter(a=>a.status==='in_progress').length, color:'#7C3AED', bg:'#F5F3FF', svg:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
            { label:'Done Today',     val: done,         color:'#16A34A', bg:'#F0FDF4', svg:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' },
            { label:'Follow-ups',     val: followUps.length, color:'#DC2626', bg:'#FFF1F2', svg:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>' },
          ].map(s => `
            <div style="display:flex; align-items:center; gap:8px; background:${s.bg}; border-radius:8px; padding:7px 14px; flex:1;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${s.color}" stroke-width="2">${s.svg}</svg>
              <div>
                <div style="font-size:1.2rem; font-weight:800; color:#1B2B45; line-height:1;">${s.val}</div>
                <div style="font-size:0.58rem; font-weight:600; color:${s.color}; text-transform:uppercase; letter-spacing:0.4px; margin-top:1px;">${s.label}</div>
              </div>
            </div>`).join('')}
        </div>

        <!-- ══ MAIN AREA: Queue + Follow-ups — fills remaining height ══ -->
        <div style="flex:1; display:grid; grid-template-columns:1fr 264px; gap:0; overflow:hidden; min-height:0;">

          <!-- Today's Queue -->
          <div style="display:flex; flex-direction:column; overflow:hidden; border-right:1px solid #D9E2EC;">
            <!-- Table header -->
            <div style="flex-shrink:0; padding:10px 20px 8px; background:#FAFBFD; border-bottom:1px solid #D9E2EC; display:flex; align-items:center; justify-content:space-between;">
              <span style="font-size:0.82rem; font-weight:700; color:#1B2B45;">Today's Queue</span>
              <span style="display:flex; align-items:center; gap:5px; font-size:0.62rem; font-weight:600; color:#16A34A; background:#F0FDF4; padding:3px 9px; border-radius:99px; border:1px solid #BBF7D0;">
                <span style="width:6px; height:6px; border-radius:50%; background:#16A34A; animation:pulse 2s infinite; display:inline-block;"></span>
                Live Updates
              </span>
            </div>

            <!-- Column headers -->
            <div style="flex-shrink:0; display:grid; grid-template-columns:100px 1fr 1fr 140px; padding:6px 20px; background:#EEF2F6; border-bottom:1px solid #D9E2EC;">
              ${['TOKEN / TIME','PATIENT','CHIEF COMPLAINT','ACTION'].map(h =>
                '<div style="font-size:0.59rem; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:#94A3B8;">' + h + '</div>'
              ).join('')}
            </div>

            <!-- Scrollable rows -->
            <div style="flex:1; overflow-y:auto;">
              ${enriched.sort((a,b) => a.token_number - b.token_number).map(a => {
                const isActive  = a.status === 'in_progress';
                const isWaiting = a.status === 'waiting' || a.status === 'checked_in';
                const isDone    = a.status === 'completed';
                const bg        = isActive ? '#F0F9FF' : '#fff';
                const borderL   = isActive ? '3px solid #1D4ED8' : isDone ? '3px solid #16A34A' : '3px solid #CBD5E1';

                let actionBtn;
                if (isActive) {
                  actionBtn = '<button onclick="navigate(\'/doctor/consult/' + a.id + '\')" style="padding:4px 12px; background:#1D4ED8; color:#fff; border:none; border-radius:5px; font-size:0.65rem; font-weight:700; cursor:pointer; white-space:nowrap; transition:all 0.12s;" onmouseover="this.style.background=\'#1e40af\'" onmouseout="this.style.background=\'#1D4ED8\'">Resume</button>';
                } else if (isWaiting) {
                  actionBtn = '<div style="display:flex; gap:5px; align-items:center;">'
                    + '<button class="call-btn" data-name="' + a.patient_name + '" data-id="' + a.id + '" style="padding:4px 8px; background:#fff; color:#1B2B45; border:1.5px solid #E2E8F0; border-radius:5px; font-size:0.65rem; font-weight:700; cursor:pointer; white-space:nowrap; transition:all 0.12s;" onmouseover="this.style.background=\'#F1F5F9\'" onmouseout="this.style.background=\'#fff\'">Call</button>'
                    + '<button onclick="navigate(\'/doctor/consult/' + a.id + '\')" style="padding:4px 8px; background:#1B2B45; color:#fff; border:none; border-radius:5px; font-size:0.65rem; font-weight:700; cursor:pointer; white-space:nowrap; transition:all 0.12s;" onmouseover="this.style.background=\'#2D4A7A\'" onmouseout="this.style.background=\'#1B2B45\'">Consult</button>'
                    + '</div>';
                } else if (isDone) {
                  actionBtn = '<button onclick="navigate(\'/doctor/consult/' + a.id + '\')" style="padding:4px 12px; background:#F8FAFC; color:#64748B; border:1px solid #E2E8F0; border-radius:5px; font-size:0.65rem; font-weight:700; cursor:pointer; white-space:nowrap; transition:all 0.12s;" onmouseover="this.style.background=\'#F1F5F9\'" onmouseout="this.style.background=\'#F8FAFC\'">View</button>';
                } else {
                  actionBtn = '<span style="font-size:0.68rem; color:#94A3B8; font-style:italic;">At Reception</span>';
                }

                return '<div style="display:grid; grid-template-columns:100px 1fr 1fr 140px; align-items:center; padding:11px 20px; border-bottom:1px solid #F8FAFC; background:' + bg + '; border-left:' + borderL + ';">'
                  + '<div>'
                  + '<div style="display:inline-flex; align-items:center; justify-content:center; padding:2px 8px; background:' + (isActive ? '#1D4ED8' : isDone ? '#94A3B8' : '#1B2B45') + '; color:#fff; border-radius:5px; font-size:0.66rem; font-weight:800; font-family:monospace; margin-bottom:3px;">#' + a.token_number + '</div>'
                  + '<div style="font-size:0.63rem; color:#94A3B8;">' + a.scheduled_time + '</div>'
                  + '</div>'
                  + '<div>'
                  + '<div style="display:flex; align-items:center; gap:5px;">'
                  + '<span style="font-weight:700; font-size:0.8rem; color:' + (isDone ? '#94A3B8' : '#1B2B45') + '; cursor:pointer;" onclick="navigate(\'/doctor/consult/' + a.id + '\')">' + a.patient_name + '</span>'
                  + (a.hasAllergy ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' : '')
                  + '</div>'
                  + '<div style="font-size:0.62rem; color:#94A3B8;">' + a.sub + '</div>'
                  + '</div>'
                  + '<div style="font-size:0.72rem; color:' + (isDone ? '#94A3B8' : '#475569') + '; padding-right:10px; line-height:1.4;">'
                  + (a.chief_complaint.length > 48 ? a.chief_complaint.substring(0,48) + '…' : a.chief_complaint)
                  + '</div>'
                  + '<div>' + actionBtn + '</div>'
                  + '</div>';
              }).join('')}
            </div>
          </div>

          <!-- Follow-ups Due Today -->
          <div style="display:flex; flex-direction:column; overflow:hidden; background:#F4F7FA; border-left:1px solid #D9E2EC;">
            <div style="flex-shrink:0; padding:10px 16px 8px; border-bottom:1px solid #D9E2EC; background:#FAFBFD;">
              <div style="font-size:0.82rem; font-weight:700; color:#1B2B45;">Follow-ups Due Today</div>
            </div>
            <div style="flex:1; overflow-y:auto; padding-bottom:12px;">
              ${followUps.map(f => {
                const isToday = f.due === 'Today';
                const isTomorrow = f.due === 'Tomorrow';
                const tagColor = isToday ? '#DC2626' : isTomorrow ? '#D97706' : '#64748B';
                const tagBg    = isToday ? '#FEF2F2' : isTomorrow ? '#FFFBEB' : '#F8FAFC';
                return '<div style="margin:8px 12px 0; padding:10px 12px; background:#fff; border:1px solid #E2E8F0; border-left:3px solid ' + tagColor + '; border-radius:6px; cursor:pointer; box-shadow:0 1px 3px rgba(15,23,42,0.04); transition:all 0.12s;" onmouseover="this.style.background=\'#FAFBFD\'; this.style.borderColor=\'#C7D2FE\'" onmouseout="this.style.background=\'#fff\'; this.style.borderColor=\'#E2E8F0\'">'
                  + '<div style="font-weight:700; font-size:0.8rem; color:#1B2B45; margin-bottom:3px;">' + f.patient_name + '</div>'
                  + '<div style="font-size:0.68rem; color:#64748B; margin-bottom:5px; line-height:1.4;">' + f.reason + '</div>'
                  + '<span style="font-size:0.62rem; font-weight:700; padding:2px 8px; background:' + tagBg + '; color:' + tagColor + '; border-radius:4px; display:inline-flex; align-items:center; gap:3px;">'
                  + '<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
                  + (isToday ? '⚠ Due Today' : f.due)
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
