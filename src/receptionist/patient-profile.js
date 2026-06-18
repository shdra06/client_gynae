// ================================================================
// RECEPTIONIST PORTAL — Patient Profile
// ================================================================
import { patients } from '../data/patients.js';
import { labReports, todayAppointments } from '../data/appointments.js';
import { receptionistSidebar, gpalmBadge, allergyBanner, statusChip, formatDate } from '../components/shared.js';

export function renderPatientProfile(container, patientId) {
  const patient = patients.find(p => p.id === patientId);
  if (!patient) {
    container.innerHTML = '<div class="empty-state"><h2>Patient not found</h2></div>';
    return;
  }

  const g = patient.gynec;
  const reports = labReports.filter(r => r.patient_id === patientId);
  const lmpWeeks = g?.lmp ? Math.floor((new Date() - new Date(g.lmp)) / (7 * 24 * 60 * 60 * 1000)) : null;

  container.innerHTML = `
    <div class="app-shell portal-receptionist">
      ${receptionistSidebar('/receptionist/patients')}
      <main class="main-content">
        <!-- Patient Header -->
        <div class="page-header" style="border-bottom: 2px solid var(--accent-coral-muted);">
          <div class="page-header-top">
            <div style="display: flex; align-items: center; gap: var(--space-lg);">
              <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--accent-coral-muted); color: var(--accent-coral); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; flex-shrink: 0;">
                ${patient.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 style="font-size: 1.5rem;">${patient.name}</h1>
                <p class="page-subtitle">
                  ${patient.phone} · Token #${patient.token_number} · ${patient.doctor_name}
                  <br>Registered: ${formatDate(patient.registered_at)}
                </p>
              </div>
            </div>
            <div style="display: flex; gap: var(--space-sm);">
              <button class="btn btn-coral-outline">✏️ Edit</button>
              <button class="btn btn-coral" onclick="navigate('/receptionist/appointments/new')">📅 Book appointment</button>
              <button class="btn btn-coral-outline">📎 Upload lab report</button>
            </div>
          </div>
          ${patient.allergies ? `<div style="margin-top: var(--space-md);">${allergyBanner(patient.allergies)}</div>` : ''}
        </div>

        <div class="page-body">
          <!-- Tabs -->
          <div class="card">
            <div class="tab-bar" id="profileTabs">
              <button class="tab-item active" data-tab="clinical">Clinical</button>
              <button class="tab-item" data-tab="gynec">Gynec History</button>
              <button class="tab-item" data-tab="appointments">Appointments</button>
              <button class="tab-item" data-tab="labreports">Lab Reports</button>
            </div>

            <!-- Tab: Clinical -->
            <div class="tab-content" id="tab-clinical">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-xl);">
                <div>
                  ${infoBlock('Full Name', patient.name)}
                  ${infoBlock('Phone', patient.phone)}
                  ${infoBlock('Email', patient.email || '—')}
                  ${infoBlock('Date of Birth', patient.dob ? `${patient.dob} (${patient.age} years)` : '—')}
                </div>
                <div>
                  ${infoBlock('Blood Group', patient.blood_group ? `<span class="gpalm-badge">${patient.blood_group}</span>` : '—')}
                  ${infoBlock('Allergies', patient.allergies ? `<span style="color: var(--status-danger); font-weight: 600;">${patient.allergies}</span>` : 'None known')}
                  ${infoBlock('Address', patient.address || '—')}
                  ${infoBlock('Assigned Doctor', patient.doctor_name)}
                </div>
              </div>
            </div>

            <!-- Tab: Gynec History -->
            <div class="tab-content" id="tab-gynec" style="display: none;">
              ${g ? `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-xl);">
                  <!-- Menstrual -->
                  <div>
                    <h4 style="margin-bottom: var(--space-md); color: var(--accent-coral);">Menstrual History</h4>
                    ${infoBlock('Last Menstrual Period', `${formatDate(g.lmp)} <span style="color: var(--text-muted); font-size: 0.75rem;">(${lmpWeeks}w ago)</span>`)}
                    ${infoBlock('Cycle Length', `${g.cycle_length} days`)}
                    ${infoBlock('Cycle Duration', `${g.cycle_duration} days`)}
                    ${infoBlock('Regularity', g.regularity)}
                    ${infoBlock('Dysmenorrhoea', g.dysmenorrhoea)}
                  </div>
                  <!-- Obstetric -->
                  <div>
                    <h4 style="margin-bottom: var(--space-md); color: var(--accent-coral);">Obstetric History</h4>
                    <div style="padding: var(--space-md); background: var(--bg-subtle); border-radius: var(--radius-md); text-align: center; margin-bottom: var(--space-md);">
                      <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">GPALM</div>
                      <div style="font-size: 1.2rem;">${gpalmBadge(g.gravida, g.para, g.abortions, g.living)}</div>
                    </div>
                    ${infoBlock('Contraception', g.contraception.replace('_', ' '))}
                    ${g.surgical_history.length > 0 ? `
                      <div style="margin-top: var(--space-md);">
                        <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-bottom: var(--space-sm);">Surgical History</div>
                        ${g.surgical_history.map(s => `
                          <div style="padding: 6px 0; font-size: 0.85rem; border-bottom: 1px solid var(--border-light);">
                            • ${s.procedure} (${s.year}) — ${s.notes}
                          </div>
                        `).join('')}
                      </div>
                    ` : ''}
                  </div>
                </div>

                <!-- Pregnancy Timeline -->
                ${g.pregnancies.length > 0 ? `
                  <div style="margin-top: var(--space-xl);">
                    <h4 style="margin-bottom: var(--space-md); color: var(--accent-coral);">Pregnancy Timeline</h4>
                    <table class="data-table">
                      <thead>
                        <tr><th>Year</th><th>Type</th><th>Outcome</th><th>Gestation</th><th>Mode</th><th>Complications</th></tr>
                      </thead>
                      <tbody>
                        ${g.pregnancies.map(p => `
                          <tr>
                            <td>${p.year}</td>
                            <td>${p.type}</td>
                            <td>${p.outcome.replace('_', ' ')}</td>
                            <td>${p.gestation}</td>
                            <td>${p.mode}</td>
                            <td>${p.complications}</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                ` : ''}
              ` : '<p style="color: var(--text-muted); padding: var(--space-lg);">No gynecological history recorded.</p>'}
            </div>

            <!-- Tab: Appointments -->
            <div class="tab-content" id="tab-appointments" style="display: none;">
              ${patient.recent_appointments?.length > 0 ? `
                <table class="data-table">
                  <thead><tr><th>Date</th><th>Chief Complaint</th><th>Diagnosis</th><th>Status</th></tr></thead>
                  <tbody>
                    ${patient.recent_appointments.map(a => `
                      <tr>
                        <td>${formatDate(a.date)}</td>
                        <td>${a.complaint}</td>
                        <td>${a.diagnosis}</td>
                        <td>${statusChip(a.status)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              ` : '<p style="color: var(--text-muted); padding: var(--space-lg);">No appointments on record.</p>'}
            </div>

            <!-- Tab: Lab Reports -->
            <div class="tab-content" id="tab-labreports" style="display: none;">
              ${reports.length > 0 ? `
                <table class="data-table">
                  <thead><tr><th>File</th><th>Type</th><th>Uploaded By</th><th>Date</th><th>Notes</th></tr></thead>
                  <tbody>
                    ${reports.map(r => `
                      <tr>
                        <td style="color: var(--text-muted);">${r.file_name}</td>
                        <td>${r.type.replace('_', ' ')}</td>
                        <td>${r.uploaded_by}</td>
                        <td>${formatDate(r.uploaded_at)}</td>
                        <td style="font-size: 0.8rem;">${r.notes || '—'}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              ` : `
                <div class="empty-state">
                  <div class="empty-state-icon">📄</div>
                  <div class="empty-state-text">No lab reports uploaded for this patient.</div>
                  <button class="btn btn-coral">📎 Upload report</button>
                </div>
              `}
            </div>
          </div>
        </div>
      </main>
    </div>
  `;

  // Tab switching
  const tabs = container.querySelectorAll('.tab-item');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      container.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
      const target = container.querySelector(`#tab-${tab.dataset.tab}`);
      if (target) target.style.display = 'block';
    });
  });
}

function infoBlock(label, value) {
  return `
    <div style="padding: 10px 0; border-bottom: 1px solid var(--border-light);">
      <div style="font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 2px;">${label}</div>
      <div style="font-size: 0.9rem;">${value}</div>
    </div>
  `;
}
