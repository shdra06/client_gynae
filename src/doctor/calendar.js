// ================================================================
// DOCTOR PORTAL — Week Calendar View
// ================================================================
import { weekAppointments, doctors } from '../data/appointments.js';
import { doctorSidebar } from '../components/shared.js';

// Determine today's ISO day-of-week (1=Mon … 6=Sat, 0=Sun)
function getTodayDayNum() {
  const d = new Date().getDay(); // 0=Sun
  return d === 0 ? 7 : d; // shift Sunday to 7
}

function getMondayOfWeek(offsetWeeks = 0) {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diffToMon = day === 0 ? -6 : 1 - day;
  const mon = new Date(now);
  mon.setDate(now.getDate() + diffToMon + offsetWeeks * 7);
  mon.setHours(0, 0, 0, 0);
  return mon;
}

const STATUS_COLOR = {
  waiting:     { bg: '#FFFBEB', border: '#FCD34D', text: '#B45309', dot: '#F59E0B' },
  in_progress: { bg: '#EFF6FF', border: '#93C5FD', text: '#1D4ED8', dot: '#3B82F6' },
  completed:   { bg: '#F1F5F9', border: '#CBD5E1', text: '#64748B', dot: '#94A3B8' },
  scheduled:   { bg: '#F0F9FF', border: '#BAE6FD', text: '#0369A1', dot: '#7DD3FC' },
  checked_in:  { bg: '#FFF4F1', border: '#FDBA74', text: '#C2410C', dot: '#F97316' },
};

const TIME_SLOTS = [];
for (let h = 8; h <= 16; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2,'0')}:00`);
  if (h < 16) TIME_SLOTS.push(`${String(h).padStart(2,'0')}:30`);
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

let weekOffset = 0;

export function renderDoctorCalendar(container) {
  weekOffset = 0;
  renderCalendar(container);
}

function renderCalendar(container) {
  const monday = getMondayOfWeek(weekOffset);
  const todayDayNum = getTodayDayNum();

  const days = DAY_NAMES.map((name, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return {
      name,
      dayNum: i + 1,
      date,
      label: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      isToday: weekOffset === 0 && (i + 1) === todayDayNum
    };
  });

  const weekLabel = `${days[0].label} – ${days[5].label}, ${monday.getFullYear()}`;

  // Build appointment lookup: dayNum → appts
  const apptMap = {};
  weekAppointments.forEach(a => {
    if (!apptMap[a.day]) apptMap[a.day] = [];
    apptMap[a.day].push(a);
  });

  container.innerHTML = `
    <div class="app-shell portal-doctor">
      ${doctorSidebar('/doctor/calendar')}
      <main class="main-content" style="overflow:hidden; display:flex; flex-direction:column; margin-left:48px;">

        <!-- Calendar Header -->
        <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 24px; border-bottom:1px solid var(--border-light); background:#fff; flex-shrink:0; gap:16px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <button id="calPrev" style="background:none; border:1px solid var(--border); border-radius:8px; padding:5px 10px; cursor:pointer; font-size:0.85rem; transition:all 0.15s; color:var(--text-primary);" onmouseover="this.style.background='var(--bg-subtle)'" onmouseout="this.style.background='none'">‹</button>
            <div style="font-size:0.95rem; font-weight:700; min-width:200px; text-align:center;">${weekLabel}</div>
            <button id="calNext" style="background:none; border:1px solid var(--border); border-radius:8px; padding:5px 10px; cursor:pointer; font-size:0.85rem; transition:all 0.15s; color:var(--text-primary);" onmouseover="this.style.background='var(--bg-subtle)'" onmouseout="this.style.background='none'">›</button>
            <button id="calToday" style="margin-left:4px; background:#1B3A6B; color:#fff; border:none; border-radius:8px; padding:5px 14px; cursor:pointer; font-size:0.78rem; font-weight:600; transition:opacity 0.15s; ${weekOffset === 0 ? 'opacity:0.4;pointer-events:none;' : ''}" onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">Today</button>
          </div>
          <div style="display:flex; align-items:center; gap:16px; font-size:0.72rem; color:var(--text-muted);">
            ${Object.entries({ waiting:'Waiting', in_progress:'Consulting', completed:'Done', scheduled:'Scheduled', checked_in:'Arrived' }).map(([k, lbl]) => `
              <span style="display:flex; align-items:center; gap:4px;">
                <span style="width:8px; height:8px; border-radius:50%; background:${STATUS_COLOR[k]?.dot || '#ccc'};"></span>
                ${lbl}
              </span>`).join('')}
          </div>
          <div style="font-size:0.78rem; color:var(--text-muted);">Dr. Anita Mehta &amp; Dr. Sunita Hale</div>
        </div>

        <!-- Calendar Grid -->
        <div style="flex:1; overflow:auto; position:relative;">
          <table style="width:100%; border-collapse:collapse; min-width:900px;">
            <!-- Day Headers -->
            <thead style="position:sticky; top:0; z-index:10; background:var(--bg-surface);">
              <tr>
                <th style="width:70px; padding:10px 8px; border-bottom:2px solid var(--border); border-right:1px solid var(--border-light); font-size:0.65rem; color:var(--text-muted); font-weight:600; text-align:center;">TIME</th>
                ${days.map(d => `
                  <th style="padding:10px 12px; border-bottom:2px solid var(--border); border-right:1px solid var(--border-light); text-align:center; background:${d.isToday ? 'rgba(29,78,216,0.05)' : 'var(--bg-surface)'};">
                    <div style="font-size:0.72rem; color:${d.isToday ? '#1D4ED8' : '#94A3B8'}; font-weight:600; text-transform:uppercase;">${d.name}</div>
                    <div style="font-size:1rem; font-weight:700; color:${d.isToday ? '#1D4ED8' : '#1B2B45'}; margin-top:2px; ${d.isToday ? 'background:#1D4ED8; color:#fff; width:28px; height:28px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center;' : ''}">${d.date.getDate()}</div>
                    <div style="font-size:0.6rem; color:var(--text-muted); margin-top:2px;">${(apptMap[d.dayNum] || []).length} appts</div>
                  </th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${TIME_SLOTS.map(slot => `
                <tr style="height:52px;">
                  <td style="padding:4px 8px; border-bottom:1px solid var(--border-light); border-right:1px solid var(--border-light); text-align:right; font-size:0.65rem; color:var(--text-muted); vertical-align:top; padding-top:6px; white-space:nowrap; background:#F0F4F8;">${slot}</td>
                  ${days.map(d => {
                    const appt = (apptMap[d.dayNum] || []).find(a => a.time === slot);
                    const sc = STATUS_COLOR[appt?.status] || STATUS_COLOR.scheduled;
                    return `<td style="padding:3px 4px; border-bottom:1px solid var(--border-light); border-right:1px solid var(--border-light); vertical-align:top; background:${d.isToday ? 'rgba(29,78,216,0.02)' : 'var(--bg-canvas)'}; position:relative;">
                      ${appt ? `
                        <div class="cal-appt-block"
                          data-id="${appt.id}"
                          data-appt-id="${appt.appt_id || ''}"
                          style="background:${sc.bg}; border:1.5px solid ${sc.border}; border-radius:6px; padding:4px 6px; cursor:pointer; transition:all 0.15s; position:relative; overflow:hidden;"
                          onmouseover="this.querySelector('.cal-popover')?.style && (this.querySelector('.cal-popover').style.display='block'); this.style.boxShadow='0 4px 12px rgba(0,0,0,0.12)'; this.style.zIndex='20';"
                          onmouseout="this.querySelector('.cal-popover')?.style && (this.querySelector('.cal-popover').style.display='none'); this.style.boxShadow=''; this.style.zIndex='';"
                          onclick="handleCalApptClick('${appt.appt_id || ''}', '${d.isToday}')">
                          ${appt.status === 'in_progress' ? '<span style="position:absolute;top:4px;right:4px;width:6px;height:6px;border-radius:50%;background:#0F8B8D;animation:calPulse 1.5s infinite;"></span>' : ''}
                          <div style="font-size:0.68rem; font-weight:700; color:${sc.text}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${appt.patient_name}</div>
                          <div style="font-size:0.58rem; color:${sc.text}; opacity:0.75; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${appt.chief_complaint}</div>
                          <!-- Popover -->
                          <div class="cal-popover" style="display:none; position:absolute; top:calc(100% + 4px); left:0; z-index:30; width:220px; background:var(--bg-surface); border:1px solid var(--border); border-radius:10px; box-shadow:0 8px 24px rgba(0,0,0,0.14); padding:10px 12px;">
                            <div style="font-size:0.75rem; font-weight:700; color:var(--text-primary); margin-bottom:4px;">${appt.patient_name} <span style="font-weight:400; color:var(--text-muted);">${appt.patient_age}</span></div>
                            <div style="font-size:0.68rem; color:var(--text-secondary); margin-bottom:6px;">${appt.chief_complaint}</div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                              <span style="font-size:0.62rem; color:var(--text-muted);">${appt.doctor_name.replace('Dr. ', '')}</span>
                              <span style="font-size:0.6rem; padding:2px 6px; border-radius:4px; background:${sc.bg}; color:${sc.text}; border:1px solid ${sc.border}; font-weight:600;">${appt.status.replace('_',' ')}</span>
                            </div>
                            ${d.isToday && appt.appt_id ? '<div style="margin-top:6px; font-size:0.62rem; color:#1D4ED8; font-weight:600;">Click to open consultation →</div>' : ''}
                          </div>
                        </div>` : ''}
                    </td>`;
                  }).join('')}
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </main>
    </div>

    <style>
      @keyframes calPulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(1.3); }
      }
    </style>
  `;

  // Navigation
  container.querySelector('#calPrev').addEventListener('click', () => { weekOffset--; renderCalendar(container); });
  container.querySelector('#calNext').addEventListener('click', () => { weekOffset++; renderCalendar(container); });
  container.querySelector('#calToday').addEventListener('click', () => { weekOffset = 0; renderCalendar(container); });

  // Global click handler for appointment blocks
  window.handleCalApptClick = (apptId, isToday) => {
    if (isToday === 'true' && apptId) {
      navigate(`/doctor/consult/${apptId}`);
    }
  };
}
