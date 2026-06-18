// ================================================================
// RECEPTIONIST PORTAL — Dashboard (Overhauled)
// ================================================================
import { todayAppointments, doctors } from '../data/appointments.js';
import { receptionistSidebar, statusChip, tokenBadge } from '../components/shared.js';

// Mutable status state (for inline updates)
const statusState = {};

export function renderReceptionistDashboard(container) {
  // Init status from data
  todayAppointments.forEach(a => { if (!statusState[a.id]) statusState[a.id] = a.status; });
  renderDashboard(container);
}

function renderDashboard(container) {
  const appts = todayAppointments.map(a => ({ ...a, status: statusState[a.id] || a.status }));
  const waiting = appts.filter(a => a.status === 'waiting').length;
  const inProgress = appts.filter(a => a.status === 'in_progress').length;
  const completed = appts.filter(a => a.status === 'completed').length;
  const checkedIn = appts.filter(a => a.status === 'checked_in').length;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Doctor availability strips
  const docSlots = doctors.map(doc => {
    const docAppts = appts.filter(a => a.doctor_id === doc.id);
    const done = docAppts.filter(a => a.status === 'completed').length;
    const remaining = docAppts.length - done;
    return { doc, total: docAppts.length, done, remaining };
  });

  container.innerHTML = `
    <div class="app-shell portal-receptionist">
      ${receptionistSidebar('/receptionist')}
      <main class="main-content" style="margin-left:48px;">
        <!-- Header -->
        <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 24px; border-bottom:1px solid var(--border-light); background:var(--bg-surface); flex-wrap:wrap; gap:8px;">
          <div>
            <div style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">${dateStr}</div>
            <div style="font-size:1rem; font-weight:700; margin-top:1px;">Reception Dashboard</div>
          </div>
          <div style="display:flex; align-items:center; gap:12px; font-size:0.78rem;">
            <span style="color:var(--text-muted);">${appts.length} total</span>
            <span style="color:var(--status-warning); font-weight:600;">${waiting} waiting</span>
            <span style="color:var(--accent-teal); font-weight:600;">${inProgress} consulting</span>
            <span style="color:var(--status-success); font-weight:600;">${completed} done</span>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="navigate('/')">← Portal</button>
        </div>

        <div class="page-body" style="padding-top:16px;">

          <!-- Quick Actions (Big Cards) -->
          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:20px;">
            <div onclick="navigate('/receptionist/patients/new')"
              style="background:linear-gradient(135deg,#1B3A6B,#153060); border-radius:12px; padding:18px 20px; cursor:pointer; transition:transform 0.15s,box-shadow 0.15s; display:flex; align-items:center; gap:14px;"
              onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(27,58,107,0.3)'"
              onmouseout="this.style.transform='';this.style.boxShadow=''">
              <div style="width:42px; height:42px; border-radius:10px; background:rgba(255,255,255,0.18); display:flex; align-items:center; justify-content:center; font-size:1.3rem; flex-shrink:0;">➕</div>
              <div>
                <div style="font-size:0.88rem; font-weight:700; color:#fff;">New Patient</div>
                <div style="font-size:0.68rem; color:rgba(255,255,255,0.7);">Register &amp; assign token</div>
              </div>
            </div>

            <div onclick="navigate('/receptionist/appointments/new')"
              style="background:linear-gradient(135deg,#DC6B3A,#C25830); border-radius:12px; padding:18px 20px; cursor:pointer; transition:transform 0.15s,box-shadow 0.15s; display:flex; align-items:center; gap:14px;"
              onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(220,107,58,0.3)'"
              onmouseout="this.style.transform='';this.style.boxShadow=''">
              <div style="width:42px; height:42px; border-radius:10px; background:rgba(255,255,255,0.18); display:flex; align-items:center; justify-content:center; font-size:1.3rem; flex-shrink:0;">📅</div>
              <div>
                <div style="font-size:0.88rem; font-weight:700; color:#fff;">Book Appointment</div>
                <div style="font-size:0.68rem; color:rgba(255,255,255,0.7);">Pick time slot &amp; doctor</div>
              </div>
            </div>

            <div onclick="navigate('/receptionist/patients')"
              style="background:var(--bg-surface); border:1.5px solid var(--border); border-radius:12px; padding:18px 20px; cursor:pointer; transition:transform 0.15s,box-shadow 0.15s; display:flex; align-items:center; gap:14px;"
              onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'"
              onmouseout="this.style.transform='';this.style.boxShadow=''">
              <div style="width:42px; height:42px; border-radius:10px; background:var(--bg-subtle); display:flex; align-items:center; justify-content:center; font-size:1.3rem; flex-shrink:0;">🔍</div>
              <div>
                <div style="font-size:0.88rem; font-weight:700; color:var(--text-primary);">Find Patient</div>
                <div style="font-size:0.68rem; color:var(--text-muted);">Search by name or phone</div>
              </div>
            </div>
          </div>

          <!-- Doctor Availability Strips -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px;">
            ${docSlots.map(({ doc, total, done, remaining }) => {
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return `
              <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:10px; padding:12px 16px;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                  <div>
                    <div style="font-size:0.82rem; font-weight:700; color:var(--text-primary);">${doc.name}</div>
                    <div style="font-size:0.65rem; color:var(--text-muted);">${doc.specialty}</div>
                  </div>
                  <div style="text-align:right;">
                    <div style="font-size:1.1rem; font-weight:800; color:${remaining > 0 ? '#1D4ED8' : '#16A34A'};">${remaining}</div>
                    <div style="font-size:0.6rem; color:var(--text-muted);">remaining</div>
                  </div>
                </div>
                <div style="background:var(--border-light); border-radius:99px; height:5px; overflow:hidden;">
                  <div style="height:100%; border-radius:99px; background:${pct === 100 ? '#16A34A' : '#1D4ED8'}; width:${pct}%; transition:width 0.4s;"></div>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:4px; font-size:0.6rem; color:var(--text-muted);">
                  <span>${done} done</span><span>${total} total</span>
                </div>
              </div>`;
            }).join('')}
          </div>

          <!-- Queue Table -->
          <div class="card">
            <div class="card-header">
              <div class="card-title">📋 Today's Queue</div>
              <div style="display:flex; gap:8px; align-items:center;">
                <select class="form-select" style="width:170px; padding:7px 10px; font-size:0.78rem;" id="doctorFilter">
                  <option value="all">All doctors</option>
                  ${doctors.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                </select>
                <select class="form-select" style="width:140px; padding:7px 10px; font-size:0.78rem;" id="statusFilter">
                  <option value="all">All statuses</option>
                  <option value="waiting">Waiting</option>
                  <option value="in_progress">In Progress</option>
                  <option value="checked_in">Checked-in</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <table class="data-table" id="queueTable">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Chief Complaint</th>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Update Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody class="stagger-children">
                ${appts.sort((a, b) => a.token_number - b.token_number).map(a => `
                  <tr data-doctor="${a.doctor_id}" data-status="${a.status}" data-appt-id="${a.id}" style="${a.status === 'completed' ? 'opacity:0.5;' : ''}">
                    <td>${tokenBadge(a.token_number, a.status)}</td>
                    <td>
                      <a href="#/receptionist/patients/${a.patient_id}" style="font-weight:600; color:#DC6B3A; text-decoration:none;">${a.patient_name}</a>
                      <div style="font-size:0.7rem; color:var(--text-muted);">${a.patient_age}</div>
                    </td>
                    <td style="font-size:0.82rem;">${a.doctor_name}</td>
                    <td style="font-size:0.82rem; max-width:180px;">${a.chief_complaint}</td>
                    <td style="font-size:0.82rem; color:var(--text-muted);">${a.scheduled_time}</td>
                    <td>
                      ${a.is_returning
                        ? '<span class="returning-badge">Return</span>'
                        : '<span class="new-badge">New</span>'}
                    </td>
                    <td>${statusChip(a.status)}</td>
                    <td>
                      <select class="form-select status-updater" data-id="${a.id}" style="font-size:0.72rem; padding:4px 6px; min-width:130px;">
                        <option value="">-- Change status --</option>
                        ${['waiting','checked_in','in_progress','completed','scheduled'].filter(s => s !== a.status).map(s =>
                          `<option value="${s}">${s.replace('_',' ')}</option>`
                        ).join('')}
                      </select>
                    </td>
                    <td>
                      <button class="btn btn-coral-outline btn-sm" style="font-size:0.7rem;" onclick="navigate('/receptionist/patients/${a.patient_id}')">View</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  `;

  // Filters
  const doctorFilter = container.querySelector('#doctorFilter');
  const statusFilter = container.querySelector('#statusFilter');
  const filterRows = () => {
    const dv = doctorFilter.value;
    const sv = statusFilter.value;
    container.querySelectorAll('#queueTable tbody tr').forEach(row => {
      const showDoctor = dv === 'all' || row.dataset.doctor === dv;
      const showStatus = sv === 'all' || row.dataset.status === sv;
      row.style.display = showDoctor && showStatus ? '' : 'none';
    });
  };
  doctorFilter.addEventListener('change', filterRows);
  statusFilter.addEventListener('change', filterRows);

  // Inline status updates
  container.querySelectorAll('.status-updater').forEach(sel => {
    sel.addEventListener('change', () => {
      const id = sel.dataset.id;
      const newStatus = sel.value;
      if (!newStatus) return;
      statusState[id] = newStatus;
      // Show toast
      const appt = todayAppointments.find(a => a.id === id);
      const existing = document.querySelector('.toast');
      if (existing) existing.remove();
      const toast = document.createElement('div');
      toast.className = 'toast success';
      toast.innerHTML = `<span>✓</span><span><strong>${appt?.patient_name}</strong> → ${newStatus.replace('_',' ')}</span>`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
      // Re-render to reflect change
      setTimeout(() => renderDashboard(container), 400);
    });
  });
}
