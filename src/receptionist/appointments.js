// ================================================================
// RECEPTIONIST PORTAL — Appointments Queue (Dedicated)
// ================================================================
import { todayAppointments, doctors } from '../data/appointments.js';
import { receptionistSidebar, statusChip, tokenBadge } from '../components/shared.js';

export function renderAppointmentsQueue(container) {
  const appts = todayAppointments;

  container.innerHTML = `
    <div class="app-shell portal-receptionist">
      ${receptionistSidebar('/receptionist/appointments')}
      <main class="main-content">
        <div class="page-header">
          <div class="page-header-top">
            <div>
              <h1>Appointments</h1>
              <p class="page-subtitle">Manage today's appointment queue</p>
            </div>
            <button class="btn btn-coral" onclick="navigate('/receptionist/appointments/new')">📅 New Appointment</button>
          </div>
        </div>

        <div class="page-body">
          <!-- Filters -->
          <div style="display: flex; gap: var(--space-md); align-items: center; margin-bottom: var(--space-xl); flex-wrap: wrap;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="margin-bottom: 4px;">Date</label>
              <input type="date" class="form-input" id="dateFilter" value="${new Date().toISOString().split('T')[0]}" style="width: 180px; padding: 8px 12px;">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="margin-bottom: 4px;">Doctor</label>
              <select class="form-select" id="doctorFilter" style="width: 200px; padding: 8px 12px;">
                <option value="all">All doctors</option>
                ${doctors.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="margin-bottom: 4px;">Status</label>
              <select class="form-select" id="statusFilter" style="width: 170px; padding: 8px 12px;">
                <option value="all">All statuses</option>
                <option value="waiting">Waiting</option>
                <option value="in_progress">In Progress</option>
                <option value="checked_in">Checked-in</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <!-- Summary chips -->
          <div style="display: flex; gap: var(--space-md); margin-bottom: var(--space-lg); flex-wrap: wrap;">
            <div style="padding: 8px 16px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-full); font-size: 0.8rem;">
              Total: <strong>${appts.length}</strong>
            </div>
            <div style="padding: 8px 16px; background: var(--status-warning-bg); border: 1px solid var(--status-warning-border); border-radius: var(--radius-full); font-size: 0.8rem; color: var(--status-warning);">
              Waiting: <strong>${appts.filter(a => a.status === 'waiting').length}</strong>
            </div>
            <div style="padding: 8px 16px; background: var(--status-info-bg); border: 1px solid var(--status-info-border); border-radius: var(--radius-full); font-size: 0.8rem; color: var(--status-info);">
              In Progress: <strong>${appts.filter(a => a.status === 'in_progress').length}</strong>
            </div>
            <div style="padding: 8px 16px; background: var(--status-success-bg); border: 1px solid var(--status-success-border); border-radius: var(--radius-full); font-size: 0.8rem; color: var(--status-success);">
              Completed: <strong>${appts.filter(a => a.status === 'completed').length}</strong>
            </div>
          </div>

          <!-- Queue Table -->
          <div class="card">
            <table class="data-table" id="queueTable">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Chief Complaint</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Rx</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody class="stagger-children">
                ${appts.sort((a, b) => a.token_number - b.token_number).map(a => `
                  <tr data-doctor="${a.doctor_id}" data-status="${a.status}" style="${a.status === 'completed' ? 'opacity: 0.6;' : ''}">
                    <td>${tokenBadge(a.token_number, a.status)}</td>
                    <td style="font-size: 0.9rem; color: var(--text-muted); font-weight: 500;">${a.scheduled_time}</td>
                    <td>
                      <a href="#/receptionist/patients/${a.patient_id}" style="font-weight: 600; color: var(--accent-coral); text-decoration: none;">${a.patient_name}</a>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">${a.patient_age}</div>
                    </td>
                    <td style="font-size: 0.85rem;">${a.doctor_name}</td>
                    <td style="font-size: 0.85rem; max-width: 180px;">${a.chief_complaint}</td>
                    <td>
                      ${a.is_returning
                        ? '<span style="font-size: 0.7rem; padding: 2px 8px; border-radius: var(--radius-full); background: var(--accent-teal-light); color: var(--accent-teal); font-weight: 600;">Returning</span>'
                        : '<span style="font-size: 0.7rem; padding: 2px 8px; border-radius: var(--radius-full); background: var(--ai-violet-light); color: var(--ai-violet); font-weight: 600;">New</span>'}
                    </td>
                    <td>${statusChip(a.status)}</td>
                    <td>${a.prescription_status ? statusChip(a.prescription_status) : '<span style="color: var(--text-muted); font-size: 0.75rem;">—</span>'}</td>
                    <td>
                      <div style="display: flex; gap: 6px;">
                        ${a.status !== 'completed' && a.status !== 'cancelled' ? `
                          <button class="btn btn-ghost btn-sm" style="color: var(--status-danger); font-size: 0.75rem;">Cancel</button>
                        ` : ''}
                        <button class="btn btn-coral-outline btn-sm" style="font-size: 0.75rem;" onclick="navigate('/receptionist/patients/${a.patient_id}')">Profile</button>
                      </div>
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
}
