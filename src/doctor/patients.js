// ================================================================
// DOCTOR PORTAL — Patients List
// ================================================================
import { patients } from '../data/patients.js';
import { doctorSidebar, gpalmBadge, statusChip, formatDate } from '../components/shared.js';

export function renderDoctorPatients(container) {
  const doctorPatients = patients.filter(p => p.doctor_id === 'D001');

  container.innerHTML = `
    <div class="app-shell portal-doctor">
      ${doctorSidebar('/doctor/patients')}
      <main class="main-content">
        <div class="page-header">
          <div class="page-header-top">
            <div>
              <h1>My Patients</h1>
              <p class="page-subtitle">${doctorPatients.length} patients assigned to you</p>
            </div>
            <div class="search-bar" style="max-width: 360px;">
              <span>🔍</span>
              <input type="text" placeholder="Search patients..." id="patientSearch">
              <button class="search-btn">Search</button>
            </div>
          </div>
        </div>

        <div class="page-body">
          <div class="card">
            <table class="data-table" id="patientsTable">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Age</th>
                  <th>Blood Group</th>
                  <th>GPALM</th>
                  <th>Last Visit</th>
                  <th>Allergies</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody class="stagger-children">
                ${doctorPatients.map(p => `
                  <tr>
                    <td>
                      <div style="font-weight: 600;">${p.name}</div>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">${p.phone}</div>
                    </td>
                    <td>${p.age}${p.gender}</td>
                    <td>${p.blood_group ? `<span class="gpalm-badge">${p.blood_group}</span>` : '—'}</td>
                    <td>${p.gynec ? gpalmBadge(p.gynec.gravida, p.gynec.para, p.gynec.abortions, p.gynec.living) : '—'}</td>
                    <td style="color: ${p.last_visit ? 'var(--text-primary)' : 'var(--text-muted)'};">${p.last_visit ? formatDate(p.last_visit) : 'Never'}</td>
                    <td>${p.allergies ? `<span style="color: var(--status-danger); font-weight: 600; font-size: 0.8rem;">⚠️ ${p.allergies}</span>` : '<span style="color: var(--text-muted);">None</span>'}</td>
                    <td>
                      <button class="btn btn-teal-outline btn-sm" onclick="navigate('/doctor/consult/A00${p.token_number}')">View</button>
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

  // Search functionality
  const searchInput = container.querySelector('#patientSearch');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      const rows = container.querySelectorAll('#patientsTable tbody tr');
      rows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }
}
