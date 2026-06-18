// ================================================================
// RECEPTIONIST PORTAL — Patient Search
// ================================================================
import { patients, searchPatients } from '../data/patients.js';
import { receptionistSidebar, formatDate } from '../components/shared.js';

export function renderReceptionistPatients(container) {
  container.innerHTML = `
    <div class="app-shell portal-receptionist">
      ${receptionistSidebar('/receptionist/patients')}
      <main class="main-content">
        <div class="page-header">
          <div class="page-header-top">
            <div>
              <h1>Patients</h1>
              <p class="page-subtitle">Search and manage clinic patients</p>
            </div>
            <button class="btn btn-coral" onclick="navigate('/receptionist/patients/new')">➕ Register New Patient</button>
          </div>
        </div>

        <div class="page-body">
          <!-- Search -->
          <div style="margin-bottom: var(--space-xl);">
            <div class="search-bar" style="max-width: 100%;">
              <span>🔍</span>
              <input type="text" placeholder="Search by phone number or patient name..." id="patientSearch" autofocus>
              <button class="search-btn">Search</button>
            </div>
          </div>

          <!-- Results -->
          <div id="searchResults">
            ${renderPatientList(patients)}
          </div>
        </div>
      </main>
    </div>
  `;

  const searchInput = container.querySelector('#patientSearch');
  const resultsDiv = container.querySelector('#searchResults');

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    if (q.length === 0) {
      resultsDiv.innerHTML = renderPatientList(patients);
      return;
    }
    const results = searchPatients(q);
    if (results.length === 0) {
      resultsDiv.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <div class="empty-state-text">No patient found matching "${q}"</div>
          <button class="btn btn-coral" onclick="navigate('/receptionist/patients/new')">➕ Register new patient</button>
        </div>
      `;
    } else {
      resultsDiv.innerHTML = renderPatientList(results);
    }
  });
}

function renderPatientList(list) {
  return `
    <div class="card">
      <div style="display: flex; flex-direction: column; gap: 0;">
        ${list.map(p => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--border-light); transition: background 0.15s;" onmouseover="this.style.background='var(--bg-surface-hover)'" onmouseout="this.style.background=''">
            <div style="display: flex; align-items: center; gap: var(--space-lg);">
              <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--accent-coral-muted); color: var(--accent-coral); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; flex-shrink: 0;">
                ${p.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div style="font-weight: 600; font-size: 0.95rem;">${p.name}</div>
                <div style="font-size: 0.8rem; color: var(--text-secondary);">
                  ${p.phone} · ${p.age}${p.gender} · ${p.doctor_name}
                  ${p.token_number ? ` · Token #${p.token_number}` : ''}
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Registered ${formatDate(p.registered_at)}</div>
              </div>
            </div>
            <div style="display: flex; gap: var(--space-sm);">
              <button class="btn btn-coral-outline btn-sm" onclick="navigate('/receptionist/patients/${p.id}')">View</button>
              <button class="btn btn-coral btn-sm" onclick="navigate('/receptionist/appointments/new')">Book</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
