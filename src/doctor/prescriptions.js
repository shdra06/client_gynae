// ================================================================
// DOCTOR PORTAL — Prescriptions List
// ================================================================
import { todayAppointments } from '../data/appointments.js';
import { doctorSidebar, statusChip, formatDate } from '../components/shared.js';

export function renderDoctorPrescriptions(container) {
  const prescriptions = [
    { patient: 'Rekha Iyer', age: '47F', date: '2026-06-14', status: 'approved', medicines: 3, complaint: 'Hot flashes, mood changes' },
    { patient: 'Meena Kulkarni', age: '28F', date: '2026-06-14', status: 'draft', medicines: 3, complaint: 'Missed period, pregnancy test positive' },
    { patient: 'Priya Sharma', age: '34F', date: '2026-03-10', status: 'approved', medicines: 3, complaint: 'Lower abdominal pain' },
    { patient: 'Asha Reddy', age: '35F', date: '2026-05-20', status: 'approved', medicines: 2, complaint: 'Pelvic pain, heavy bleeding' },
    { patient: 'Fatima Ansari', age: '37F', date: '2026-04-22', status: 'approved', medicines: 1, complaint: 'IUD follow-up' },
    { patient: 'Noor Khan', age: '30F', date: '2026-05-10', status: 'approved', medicines: 1, complaint: 'IUD insertion care' },
  ];

  container.innerHTML = `
    <div class="app-shell portal-doctor">
      ${doctorSidebar('/doctor/prescriptions')}
      <main class="main-content">
        <div class="page-header">
          <div class="page-header-top">
            <div>
              <h1>Prescriptions</h1>
              <p class="page-subtitle">Recent prescriptions written by you</p>
            </div>
            <select class="form-select" style="width: 150px; padding: 7px 10px; font-size: 0.78rem;">
              <option>All statuses</option>
              <option>Draft</option>
              <option>Approved</option>
              <option>Printed</option>
            </select>
          </div>
        </div>

        <div class="page-body">
          <div class="card">
            <table class="data-table">
              <thead>
                <tr><th>Patient</th><th>Date</th><th>Complaint</th><th>Medicines</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody class="stagger-children">
                ${prescriptions.map(rx => `
                  <tr>
                    <td>
                      <div style="font-weight: 600;">${rx.patient}</div>
                      <div style="font-size: 0.7rem; color: var(--text-muted);">${rx.age}</div>
                    </td>
                    <td style="font-size: 0.82rem;">${formatDate(rx.date)}</td>
                    <td style="font-size: 0.82rem; max-width: 200px;">${rx.complaint}</td>
                    <td><span class="gpalm-badge">${rx.medicines}</span></td>
                    <td>${statusChip(rx.status)}</td>
                    <td>
                      <div style="display: flex; gap: 6px;">
                        <button class="btn btn-teal-outline btn-sm">View</button>
                        ${rx.status === 'approved' ? '<button class="btn btn-ghost btn-sm">🖨</button>' : ''}
                        ${rx.status === 'draft' ? '<button class="btn btn-teal btn-sm">Continue →</button>' : ''}
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
}
