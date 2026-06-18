// ================================================================
// DOCTOR PORTAL — Consultation View (ClinicFlow OB/GYN)
// Left: Symptoms + Vitals + History Timeline
// Center: Prescription Builder
// Right: Diagnostics (chips + notes) + Clinical Remarks
// ================================================================
import {
  todayAppointments, soapData, aiPrescriptionSuggestions, medicines,
  labReports, previousPrescriptions, medicationTemplates, testPanels, commonTests
} from '../data/appointments.js';
import { patients } from '../data/patients.js';
import { doctorSidebar, formatDate, formatDateShort, showToast } from '../components/shared.js';

let rxState   = { medicines: [], tests: [], diagnosis: '', remarks: '', followUpDate: '' };
let activeTab = 'history';

// Suggested diagnoses per specialty
const SUGGESTED_DX = [
  'UTI', 'PCOS', 'Pregnancy', 'Cystitis', 'Endometriosis',
  'Fibroids', 'Ovarian Cyst', 'Anemia', 'Hypothyroidism', 'Menorrhagia'
];

// History timeline (simulated per patient)
const HISTORY_TIMELINE = {
  P001: [
    { date: '2026-03-10', dx: 'Recurrent UTI',      note: 'Treated with Ciprofloxacin' },
    { date: '2025-11-05', dx: 'Routine Checkup',     note: 'Pap smear negative' },
    { date: '2025-06-14', dx: 'PCOS Consultation',   note: 'Prescribed Metformin' },
  ],
  P002: [
    { date: '2025-09-20', dx: 'Routine Checkup',     note: 'All parameters normal' },
    { date: '2025-04-10', dx: 'Dysmenorrhea',         note: 'Mefenamic acid prescribed' },
  ],
  P003: [
    { date: '2026-05-20', dx: 'Heavy Periods',        note: 'Iron supplementation started' },
    { date: '2025-12-01', dx: 'Endometriosis Eval',   note: 'USG ordered' },
    { date: '2025-06-10', dx: 'Routine Checkup',      note: 'Pelvic exam normal' },
  ],
  P004: [
    { date: '2026-04-18', dx: 'Annual Well-woman',    note: 'Mammogram scheduled' },
    { date: '2025-10-15', dx: 'Perimenopause',         note: 'HRT discussed' },
  ],
  default: [
    { date: '2025-10-12', dx: 'Recurrent UTI',       note: 'Treated with Ciprofloxacin' },
    { date: '2025-06-05', dx: 'Routine Checkup',     note: 'Pap smear negative' },
    { date: '2024-02-14', dx: 'PCOS Consultation',   note: 'Prescribed Metformin' },
  ]
};

export function renderConsultation(container, apptId) {
  rxState   = { medicines: [], tests: [], diagnosis: '', remarks: '', followUpDate: '' };
  activeTab = 'history';
  _render(container, apptId);
}

function _render(container, apptId) {
  const appt = todayAppointments.find(a => a.id === apptId);
  if (!appt) {
    container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:1rem;color:#94A3B8;">Appointment not found</div>';
    return;
  }

  const patient   = patients.find(p => p.id === appt.patient_id);
  const prevRx    = previousPrescriptions[appt.patient_id];
  const reports   = labReports.filter(r => r.patient_id === appt.patient_id);
  const g         = patient?.gynec;
  const lmpWeeks  = g?.lmp ? Math.floor((new Date() - new Date(g.lmp)) / (7*24*60*60*1000)) : null;
  const aiSug     = aiPrescriptionSuggestions[apptId];
  if (aiSug && !rxState.medicines.length) rxState.medicines = aiSug.medicines.map(m => ({ ...m }));

  const initials  = (appt.patient_name).split(' ').map(n => n[0]).join('').substring(0,2);
  const timeline  = HISTORY_TIMELINE[appt.patient_id] || HISTORY_TIMELINE.default;

  container.innerHTML = `
    <div style="display:flex; flex-direction:column; height:100vh; overflow:hidden; font-family:'Inter',sans-serif; background:#E8EDF3;">

      <!-- ══ BODY: Slim Sidebar + Content ══ -->
      <div style="flex:1; display:flex; overflow:hidden; min-height:0;">

        <!-- Slim sidebar -->
        ${doctorSidebar('/doctor/consult', appt.id, 'light')}

        <!-- Main content area -->
        <div style="flex:1; display:flex; flex-direction:column; overflow:hidden; min-height:0;">

          <!-- ══ PATIENT HEADER ══ -->
          <div style="flex-shrink:0; background:linear-gradient(180deg,#FAFBFF 0%,#F4F6FC 100%); border-bottom:1.5px solid #D9E2EC; padding:8px 18px; display:flex; align-items:center; justify-content:space-between; gap:14px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <!-- Avatar -->
              <div style="width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,#6366F1,#8B5CF6);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.85rem;color:#fff;flex-shrink:0;">
                ${initials}
              </div>
              <div>
                <div style="display:flex;align-items:center;gap:7px;margin-bottom:2px;">
                  <span style="font-weight:700;font-size:0.95rem;color:#1B2B45;">${appt.patient_name}</span>
                  ${appt.is_returning
                    ? '<span style="font-size:0.6rem;font-weight:700;padding:2px 7px;background:#DCFCE7;color:#15803D;border-radius:4px;text-transform:uppercase;">Return</span>'
                    : '<span style="font-size:0.6rem;font-weight:700;padding:2px 7px;background:#EFF6FF;color:#1D4ED8;border-radius:4px;text-transform:uppercase;">New</span>'}
                </div>
                <div style="font-size:0.72rem;color:#64748B;margin-bottom:2px;">
                  ${appt.patient_age} &nbsp;·&nbsp; Token: <strong style="color:#1B2B45;">#${appt.token_number}</strong> &nbsp;·&nbsp; ${appt.doctor_name}
                </div>

              </div>
              ${appt.vitals ? `
                <div style="display:flex;align-items:center;gap:2px;margin-left:8px;background:#F0F4FF;border:1px solid #DDE3F0;border-radius:8px;padding:5px 10px;flex-shrink:0;">
                  ${[
                    ['BP', appt.vitals.bp, '#6366F1'],
                    ['P', appt.vitals.pulse, '#0EA5E9'],
                    ['W', appt.vitals.weight, '#10B981'],
                    ['T', appt.vitals.temp, '#F59E0B'],
                  ].map(([label, value, color], i, arr) => `
                    <div style="text-align:center;padding:0 6px;${i < arr.length - 1 ? 'border-right:1px solid #DDE3F0;' : ''}">
                      <div style="font-size:0.48rem;font-weight:700;text-transform:uppercase;color:${color};line-height:1;margin-bottom:1px;">${label}</div>
                      <div style="font-size:0.68rem;font-weight:800;color:#1B2B45;white-space:nowrap;line-height:1.1;">${String(value).replace(/\s?(mmHg|kg|°?F|bpm)/i,'')}</div>
                    </div>`).join('')}
                </div>
              ` : ''}
            </div>
            <div style="display:flex; align-items:center; gap:10px; flex-shrink:0;">
              ${g ? `
                <div style="display:flex; align-items:center; gap:8px; background:#EEF2FF; border:1px solid #C7D2FE; border-radius:8px; padding:6px 12px; flex-shrink:0;">
                  <!-- GPALM stats -->
                  <div style="display:flex; gap:8px; border-right:1px solid #C7D2FE; padding-right:8px; margin-right:4px;">
                    ${[['G',g.gravida],['P',g.para],['A',g.abortions],['L',g.living]].map(([label, val]) => `
                      <div style="text-align:center; min-width:14px;">
                        <div style="font-size:0.52rem; font-weight:700; color:#6366F1; text-transform:uppercase; line-height:1;">${label}</div>
                        <div style="font-size:0.85rem; font-weight:800; color:#1B2B45; line-height:1.2;">${val}</div>
                      </div>
                    `).join('')}
                  </div>
                  <!-- Period & Pregnancy details -->
                  <div style="display:flex; flex-direction:column; justify-content:center; gap:1px;">
                    <div style="font-size:0.7rem; font-weight:700; color:#1B2B45; display:flex; align-items:center; gap:4px; white-space:nowrap;">
                      ${lmpWeeks !== null && lmpWeeks >= 0 && lmpWeeks < 42 
                        ? `<span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#22C55E;"></span>Pregnant (${lmpWeeks}w)` 
                        : `<span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#94A3B8;"></span>Not Pregnant`}
                    </div>
                    <div style="font-size:0.62rem; color:#64748B; white-space:nowrap;">
                      Cycle: ${g.cycle_length || 28}d · Flow: ${g.cycle_duration || 5}d
                    </div>
                  </div>
                </div>
              ` : ''}
              ${patient?.allergies ? `
                <div style="display:flex;align-items:center;gap:8px;background:#FFF1F2;border:1.5px solid #FDA4AF;border-radius:8px;padding:6px 12px;flex-shrink:0;">
                  <div style="width:20px;height:20px;background:#EF4444;border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <div>
                    <div style="font-size:0.55rem;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:#DC2626;">Severe Allergy</div>
                    <div style="font-size:0.78rem;font-weight:700;color:#DC2626;">${patient.allergies}</div>
                  </div>
                </div>` : ''}
            </div>
          </div>

          <!-- ══ TABS ══ -->
          <div style="flex-shrink:0;background:#E8ECF4;border-bottom:1.5px solid #D9E2EC;padding:0 18px;display:flex;align-items:flex-end;gap:0;">
            ${[
              { id:'history',       label:'Clinical History'   },
              { id:'reports',       label:'Lab Reports'        },
              { id:'prescriptions', label:'Past Prescriptions' },
              { id:'obstetric',     label:'Obstetric History'  },
            ].map(tab => `
              <button class="cf-tab ${activeTab === tab.id ? 'active' : ''}" data-tab="${tab.id}"
                style="padding:10px 18px;font-size:0.78rem;font-weight:${activeTab === tab.id ? '700' : '500'};color:${activeTab === tab.id ? '#6366F1' : '#64748B'};background:${activeTab === tab.id ? '#fff' : 'transparent'};border:1px solid ${activeTab === tab.id ? '#D9E2EC' : 'transparent'};border-bottom:none;border-top-left-radius:6px;border-top-right-radius:6px;cursor:pointer;white-space:nowrap;transition:all 0.12s;margin-bottom:-1.5px;position:relative;z-index:${activeTab === tab.id ? '2' : '1'};"
                onmouseover="if(!this.classList.contains('active'))this.style.color='#1B2B45'"
                onmouseout="if(!this.classList.contains('active'))this.style.color='#64748B'">
                ${tab.label}
              </button>`).join('')}
          </div>

          <!-- ══ 3-COLUMN BODY ══ -->
          <div style="flex:1;display:grid;grid-template-columns:240px 1fr 272px;gap:8px;overflow:hidden;min-height:0;background:#E8EDF3;padding:8px;">

            <!-- ── LEFT PANEL ── -->
            <div id="leftPanel" style="overflow-y:auto;background:#E8ECF4;border-radius:10px;padding:10px;display:flex;flex-direction:column;gap:10px;">
              ${renderLeftPanel(appt, patient, g, lmpWeeks, reports, prevRx, timeline)}
            </div>

            <!-- ── CENTER: Prescription Builder ── -->
            <div style="overflow-y:auto;background:#FEFEFF;border-radius:10px;display:flex;flex-direction:column;min-height:0;box-shadow:0 1px 4px rgba(15,23,42,0.07);border:1px solid #E6EAF1;">

              <!-- Header -->
              <div style="flex-shrink:0;padding:10px 16px;border-bottom:1px solid #EAECF4;display:flex;align-items:center;justify-content:space-between;gap:8px;background:linear-gradient(135deg,#F8F9FF 0%,#F0F2FC 100%);border-radius:10px 10px 0 0;">
                <div style="display:flex;align-items:center;gap:8px;">
                  <div style="width:28px;height:28px;background:linear-gradient(135deg,#E0E7FF,#EEF2FF);border-radius:6px;display:flex;align-items:center;justify-content:center;border:1px solid #C7D2FE;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                  </div>
                  <span style="font-size:0.82rem;font-weight:700;color:#1B2B45;">Prescription Builder</span>
                </div>
              </div>

              <!-- 60-40 split container -->
              <div style="flex:1; display:flex; overflow:hidden; min-height:0;">

                <!-- Medicines Column (60%) -->
                <div style="width:60%; display:flex; flex-direction:column; border-right:1px solid #E2E8F0; min-height:0; overflow:hidden;">
                  <!-- Medicines sub-header with template/protocol buttons -->
                  <div style="flex-shrink:0; padding:8px 16px; border-bottom:1px solid #EAECF4; display:flex; align-items:center; justify-content:space-between; background:#F6F8FE;">
                    <span style="font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:#475569;">Medicines</span>
                    
                    <!-- Protocol buttons moved here! -->
                    <div style="display:flex;gap:5px;align-items:center;flex-shrink:0;position:relative;">
                      ${medicationTemplates.slice(0,2).map(t => `
                        <button class="proto-btn template-quick" data-template-id="${t.id}"
                          style="padding:3px 8px;font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;border:1.5px solid #C7D2FE;background:#EEF2FF;color:#4338CA;border-radius:5px;cursor:pointer;white-space:nowrap;transition:all 0.12s;"
                          onmouseover="this.style.background='#C7D2FE'" onmouseout="this.style.background='#EEF2FF'">
                          ${t.name.replace(/ Protocol| Management/gi,'').substring(0,10).toUpperCase()}
                        </button>`).join('')}
                      <div style="position:relative;">
                        <button id="templateDropdownBtn"
                          style="padding:3px 7px;font-size:0.64rem;border:1px solid #E2E8F0;background:#fff;color:#64748B;border-radius:5px;cursor:pointer;"
                          onmouseover="this.style.background='#F1F5F9'" onmouseout="this.style.background='#fff'">▾</button>
                        <div id="templateDropdown" style="display:none;position:fixed;z-index:100;width:220px;background:#fff;border:1px solid #E2E8F0;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.12);overflow:hidden;">
                          <div id="templateClearAll" style="padding:9px 12px;cursor:pointer;font-size:0.72rem;font-weight:600;color:#DC2626;border-bottom:1px solid #FEE2E2;"
                            onmouseover="this.style.background='#FEF2F2'" onmouseout="this.style.background=''">✕ Clear All</div>
                          ${medicationTemplates.map(t => `
                            <div class="template-card" data-template-id="${t.id}"
                              style="padding:9px 12px;cursor:pointer;border-bottom:1px solid #F1F5F9;display:flex;align-items:center;gap:8px;"
                              onmouseover="this.style.background='#F8FAFC'" onmouseout="this.style.background=''">
                              <span style="font-size:1rem;">${t.icon}</span>
                              <div style="text-align:left;">
                                <div style="font-size:0.74rem;font-weight:600;color:#1B2B45;">${t.name}</div>
                                <div style="font-size:0.6rem;color:#94A3B8;">${t.medicines.length} medicines</div>
                              </div>
                            </div>`).join('')}
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Medicine search -->
                  <div style="flex-shrink:0;padding:8px 16px;border-bottom:1px solid #EAECF4;position:relative;background:#F4F6FC;">
                    <div style="display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #E2E8F0;border-radius:7px;padding:6px 11px;"
                      onfocusin="this.style.borderColor='#6366F1';this.style.background='#fff'"
                      onfocusout="this.style.borderColor='#E2E8F0';this.style.background='#fff'">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      <input type="text" id="medSearch" placeholder="Search medicine (e.g., Amoxicillin)..." autocomplete="off"
                        style="border:none;background:transparent;outline:none;font-size:0.77rem;color:#1B2B45;width:100%;font-family:inherit;">
                    </div>
                    <div id="medResults" style="position:absolute;top:calc(100% - 4px);left:16px;right:16px;z-index:30;display:none;"></div>
                  </div>

                  <!-- Rx Table -->
                  <div style="flex:1;overflow-y:auto;min-height:80px;background:#fff;">
                    <table style="width:100%;border-collapse:collapse;" id="rxTable">
                      <thead>
                        <tr style="background:#F0F2FA;border-bottom:1px solid #E2E8F0;">
                          <th style="text-align:left;padding:7px 16px;font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;">Medicine</th>
                          <th style="text-align:center;padding:7px 8px;font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;width:78px;">Dosage</th>
                          <th style="text-align:left;padding:7px 8px;font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;width:90px;">Duration</th>
                          <th style="text-align:center;padding:7px 8px;font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;width:55px;">Action</th>
                        </tr>
                      </thead>
                      <tbody id="rxBody">
                        ${rxState.medicines.length
                          ? rxState.medicines.map((m, i) => rxRow(m, i)).join('')
                          : '<tr class="rx-empty"><td colspan="4" style="padding:22px 16px;text-align:center;font-size:0.75rem;color:#94A3B8;font-style:italic;">Search or apply a protocol to add medicines</td></tr>'}
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Lab Reports / Tests Column (40%) -->
                <div style="width:40%; display:flex; flex-direction:column; min-height:0; background:#F4F6FC; padding:12px; box-sizing:border-box; border-left:1px solid #EAECF4;">
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                    <div style="display:flex;align-items:center;gap:6px;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                      <span style="font-size:0.74rem;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#475569;">Lab Tests</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:5px;">
                      ${rxState.tests.length ? '<span id="labTestCountBadge" style="font-size:0.62rem;font-weight:700;padding:2px 8px;background:#EEF2FF;color:#4338CA;border-radius:99px;">' + rxState.tests.length + ' Selected</span>' : ''}
                      <div style="position:relative;">
                        <button id="testPanelBtn" style="width:24px;height:24px;border-radius:6px;border:1.5px solid #C7D2FE;background:#EEF2FF;color:#4338CA;font-size:0.85rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.12s;" title="Test Panel Templates"
                          onmouseover="this.style.background='#C7D2FE'" onmouseout="this.style.background='#EEF2FF'">+</button>
                        <div id="testPanelDropdown" style="display:none;position:fixed;z-index:100;width:240px;background:#fff;border:1px solid #E2E8F0;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.12);overflow:hidden;">
                          <div style="padding:8px 12px;border-bottom:1px solid #F1F5F9;font-size:0.62rem;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;">Test Panel Templates</div>
                          ${testPanels.map(p => `
                            <div class="test-panel-option" data-panel-id="${p.id}"
                              style="padding:8px 12px;cursor:pointer;border-bottom:1px solid #F8FAFC;display:flex;align-items:center;gap:8px;transition:background 0.1s;"
                              onmouseover="this.style.background='#F8FAFF'" onmouseout="this.style.background=''">
                              <span style="font-size:1rem;">${p.icon}</span>
                              <div>
                                <div style="font-size:0.74rem;font-weight:600;color:#1B2B45;">${p.name}</div>
                                <div style="font-size:0.58rem;color:#94A3B8;">${p.tests.length} tests</div>
                              </div>
                            </div>`).join('')}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div style="position:relative; margin-bottom:10px;">
                    <div style="display:flex;align-items:center;gap:7px;background:#fff;border:1px solid #E2E8F0;border-radius:6px;padding:6px 10px;"
                      onfocusin="this.style.borderColor='#6366F1';this.style.background='#fff'" onfocusout="this.style.borderColor='#E2E8F0';this.style.background='#fff'">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      <input type="text" id="testSearch" placeholder="Search &amp; add tests (e.g. CBC, USG)..." autocomplete="off"
                        style="border:none;background:transparent;outline:none;font-size:0.74rem;color:#1B2B45;flex:1;font-family:inherit;">
                    </div>
                    <div id="testResults" style="position:absolute;top:calc(100%+4px);left:0;right:0;z-index:30;display:none;background:#fff;border:1px solid #E2E8F0;border-radius:8px;box-shadow:0 8px 20px rgba(0,0,0,0.1);overflow:hidden;max-height:180px;overflow-y:auto;"></div>
                  </div>

                  <div id="selectedTestTags" style="display:flex;flex-wrap:wrap;gap:5px;align-content:flex-start;flex:1;overflow-y:auto;">
                    ${rxState.tests.map(t => testTag(t)).join('')}
                  </div>
                </div>

              </div>
            </div>

            <!-- ── RIGHT PANEL: Diagnostics + Clinical Remarks ── -->
            <div style="overflow-y:auto;background:#FEFEFF;border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:12px;min-height:0;box-shadow:0 1px 4px rgba(15,23,42,0.07);border:1px solid #E6EAF1;">

              <!-- DIAGNOSTICS -->
              <div style="background:#F8F9FF;border:1px solid #E8ECF6;border-radius:8px;padding:12px;">
                <div style="display:flex;align-items:center;gap:7px;margin-bottom:12px;">
                  <div style="width:24px;height:24px;background:linear-gradient(135deg,#E0E7FF,#EEF2FF);border-radius:5px;display:flex;align-items:center;justify-content:center;border:1px solid #C7D2FE;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                  </div>
                  <span style="font-size:0.85rem;font-weight:700;color:#1B2B45;">Diagnostics</span>
                </div>

                <!-- Suggested diagnoses searchable dropdown -->
                <div style="font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;color:#94A3B8;margin-bottom:6px;">Suggested Diagnoses</div>
                <div style="position:relative; width:100%; margin-bottom:10px;">
                  <div id="dxSelectTrigger" style="display:flex; align-items:center; justify-content:space-between; width:100%; padding:7px 10px; border:1px solid #E2E8F0; border-radius:7px; font-size:0.76rem; color:#475569; background:#ffffff; cursor:pointer; box-sizing:border-box; transition:all 0.15s;"
                    onmouseover="this.style.borderColor='#6366F1'" onmouseout="this.style.borderColor='#E2E8F0'">
                    <span id="dxSelectLabel" style="flex:1;">+ Search or select diagnosis...</span>
                    <span style="font-size:0.55rem; color:#94A3B8; margin-left:4px;">▼</span>
                  </div>
                  <div id="dxSelectDropdown" style="display:none; position:absolute; top:calc(100% + 4px); left:0; right:0; background:#fff; border:1px solid #E2E8F0; border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,0.12); z-index:100; padding:6px; box-sizing:border-box;">
                    <input type="text" id="dxSelectSearch" placeholder="Search diagnosis..." style="width:100%; padding:6px 8px; border:1px solid #E2E8F0; border-radius:6px; font-size:0.74rem; outline:none; font-family:inherit; margin-bottom:6px; box-sizing:border-box;" autocomplete="off" />
                    <div id="dxOptionsList" style="max-height:160px; overflow-y:auto; display:flex; flex-direction:column; gap:2px;">
                      <!-- Javascript will fill this -->
                    </div>
                  </div>
                </div>

                <!-- Clinical findings textarea -->
                <textarea id="diagnosisText" placeholder="Record clinical findings, symptoms, and diagnosis..."
                  style="width:100%;min-height:110px;padding:10px 12px;border:1px solid #DDE1EE;border-radius:8px;font-size:0.76rem;font-family:inherit;color:#1B2B45;resize:none;line-height:1.6;background:#FEFEFF;box-sizing:border-box;transition:border-color 0.15s;"
                  onfocus="this.style.borderColor='#6366F1';this.style.background='#fff'" onblur="this.style.borderColor='#DDE1EE';this.style.background='#FEFEFF'">${rxState.diagnosis}</textarea>
              </div>

              <!-- CLINICAL REMARKS -->
              <div style="background:#FDFCFF;border:1px solid #EDE8F6;border-radius:8px;padding:12px;flex:1;display:flex;flex-direction:column;min-height:0;">
                <div style="display:flex;align-items:center;gap:7px;margin-bottom:10px;flex-shrink:0;">
                  <div style="width:24px;height:24px;background:linear-gradient(135deg,#EDE9FE,#F5F3FF);border-radius:5px;display:flex;align-items:center;justify-content:center;border:1px solid #DDD6FE;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <span style="font-size:0.85rem;font-weight:700;color:#1B2B45;">Clinical Remarks</span>
                </div>
                <textarea id="remarksText" placeholder="Patient instructions and advice..."
                  style="flex:1;width:100%;min-height:80px;padding:10px 12px;border:1px solid #E4DFF0;border-radius:8px;font-size:0.76rem;font-family:inherit;color:#1B2B45;resize:none;line-height:1.6;background:#FEFEFF;box-sizing:border-box;transition:border-color 0.15s;"
                  onfocus="this.style.borderColor='#7C3AED';this.style.background='#fff'" onblur="this.style.borderColor='#E4DFF0';this.style.background='#FEFEFF'">${rxState.remarks}</textarea>
              </div>

              <!-- Previous Rx quick re-prescribe -->
              ${prevRx ? `
                <div style="border-top:1px solid #F1F5F9;padding-top:10px;">
                  <div style="font-size:0.58rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#94A3B8;margin-bottom:6px;">
                    💊 Last Rx — <span style="font-weight:400;text-transform:none;font-style:italic;color:#CBD5E1;">${prevRx.diagnosis}</span>
                  </div>
                  ${prevRx.medicines.slice(0,3).map((m, i) => `
                    <label style="display:flex;align-items:center;gap:7px;padding:4px 0;border-bottom:1px solid #F8FAFC;cursor:pointer;">
                      <input type="checkbox" class="represcribe-check" data-idx="${i}" style="accent-color:#6366F1;flex-shrink:0;">
                      <div style="min-width:0;flex:1;">
                        <div style="font-weight:600;font-size:0.71rem;color:#1B2B45;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${m.name}</div>
                        <div style="font-size:0.61rem;color:#94A3B8;font-family:monospace;">${m.dosage} · ${m.duration}</div>
                      </div>
                    </label>`).join('')}
                  <div style="display:flex;gap:5px;margin-top:7px;">
                    <button id="represcribeAllBtn" style="flex:1;padding:5px;border:1px solid #E2E8F0;border-radius:5px;font-size:0.65rem;font-weight:600;cursor:pointer;color:#475569;background:#fff;transition:all 0.12s;"
                      onmouseover="this.style.background='#F1F5F9'" onmouseout="this.style.background='#fff'">🔄 Re-prescribe All</button>
                    <button id="represcribeSelectedBtn" style="flex:1;padding:5px;border:1px solid #E2E8F0;border-radius:5px;font-size:0.65rem;font-weight:600;cursor:pointer;color:#475569;background:#fff;opacity:0.5;transition:all 0.12s;"
                      onmouseover="this.style.background='#F1F5F9'" onmouseout="this.style.background='#fff'">Selected</button>
                  </div>
                </div>` : ''}

            </div>
          </div><!-- end 3-col -->

          <!-- ══ BOTTOM BAR ══ -->
          <div style="flex-shrink:0;background:linear-gradient(180deg,#F8FAFF 0%,#FAFBFF 100%);border-top:1.5px solid #D9E2EC;padding:8px 18px;display:flex;align-items:center;gap:10px;">
            <div style="display:flex;align-items:center;gap:7px;flex-shrink:0;">
              <span style="font-size:0.72rem;font-weight:600;color:#64748B;white-space:nowrap;">Follow-up:</span>
              <input type="date" id="followUpDate"
                style="padding:5px 8px;border:1px solid #E2E8F0;border-radius:6px;font-size:0.72rem;font-family:inherit;color:#1B2B45;background:#FAFBFD;outline:none;"
                onfocus="this.style.borderColor='#6366F1'" onblur="this.style.borderColor='#E2E8F0'">
            </div>
            <div style="display:flex;gap:4px;">
              ${[['1W',7],['2W',14],['1M',30]].map(([label,days]) => `
                <button class="followup-quick" data-days="${days}"
                  style="padding:5px 9px;border:1px solid #E2E8F0;border-radius:5px;font-size:0.68rem;font-weight:600;color:#64748B;background:#fff;cursor:pointer;transition:all 0.12s;"
                  onmouseover="this.style.background='#F1F5F9'" onmouseout="this.style.background='#fff'">+${label}</button>`).join('')}
            </div>
            <div style="flex:1;"></div>
            <button style="padding:7px 16px;border:1px solid #E2E8F0;border-radius:7px;font-size:0.75rem;font-weight:600;color:#475569;background:#fff;cursor:pointer;transition:all 0.12s;"
              onmouseover="this.style.background='#F1F5F9'" onmouseout="this.style.background='#fff'">Save Draft</button>
            <button id="approveBtn"
              style="padding:7px 18px;border:none;border-radius:7px;font-size:0.75rem;font-weight:700;color:#fff;background:#1B2B45;cursor:pointer;display:flex;align-items:center;gap:6px;transition:all 0.12s;"
              onmouseover="this.style.background='#2D4A7A'" onmouseout="this.style.background='#1B2B45'">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              Approve &amp; Print
            </button>
          </div>

        </div><!-- end main content -->
      </div><!-- end body -->
    </div><!-- end root -->
  `;

  setupTabs(container, apptId, appt, patient, g, lmpWeeks, reports, prevRx, timeline);
  setupMedicineSearch(container);
  setupTemplates(container);
  setupTestSearch(container);
  setupTestPanelDropdown(container);
  setupFollowUp(container);
  setupReprescribe(container, prevRx);
  setupApproval(container, appt);
  setupDiagnosisDropdown(container);
}

// ── LEFT PANEL RENDERER ──
function renderLeftPanel(appt, patient, g, lmpWeeks, reports, prevRx, timeline) {
  if (activeTab === 'history') {
    return `
      <!-- TODAY'S COMPLAINT -->
      <div style="background:#fff;border:1px solid #E2E8F0;border-left:3px solid #6366F1;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(15,23,42,0.06);">
        <div style="padding:7px 12px;background:linear-gradient(135deg,#F8F9FF 0%,#F1F3FC 100%);border-bottom:1px solid #E8ECF4;display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:0.57rem;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#94A3B8;">Today's Complaint</span>
          ${appt.vitals ? `<span style="font-size:0.6rem;color:#94A3B8;">10:15 AM</span>` : ''}
        </div>
        <div style="padding:10px 12px;display:flex;flex-direction:column;gap:8px;">
          <div>
            <div style="font-size:0.65rem;color:#94A3B8;margin-bottom:2px;font-weight:500;">Chief Complaint:</div>
            <div style="font-size:0.78rem;color:#1B2B45;line-height:1.4;font-weight:600;">${appt.chief_complaint}</div>
          ${appt.todays_symptoms ? `
              <div style="margin-top:4px;font-size:0.7rem;color:#64748B;line-height:1.4;">${appt.todays_symptoms}</div>` : ''}
          </div>
        </div>
      </div>

      <!-- HISTORY SUMMARY — Timeline -->
      <div style="background:#fff;border:1px solid #E2E8F0;border-left:3px solid #818CF8;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(15,23,42,0.06);">
        <div style="padding:7px 12px;background:linear-gradient(135deg,#FAFBFF 0%,#F4F5FA 100%);border-bottom:1px solid #E8ECF4;display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:0.57rem;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#94A3B8;">History Summary</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>
        </div>
        <div style="padding:8px 0;">
          ${timeline.map((entry, i) => `
            <div class="history-entry" data-idx="${i}" style="padding:9px 12px;border-bottom:1px solid #F8FAFC;cursor:pointer;transition:background 0.12s;"
              onmouseover="this.style.background='#F8FAFC'" onmouseout="this.style.background=''">
              <div style="display:flex;align-items:flex-start;gap:8px;">
                <div style="width:6px;height:6px;border-radius:50%;background:#6366F1;flex-shrink:0;margin-top:5px;"></div>
                <div style="flex:1;min-width:0;">
                  <div style="font-size:0.6rem;color:#94A3B8;margin-bottom:2px;font-weight:500;">${formatDateShort(entry.date)}</div>
                  <div style="font-weight:700;font-size:0.77rem;color:#1B2B45;">${entry.dx}</div>
                  <div style="font-size:0.66rem;color:#94A3B8;margin-top:1px;">${entry.note}</div>
                </div>
              </div>
            </div>`).join('')}
        </div>
      </div>


    `;
  }

  if (activeTab === 'reports') {
    if (!reports.length) return '<div style="padding:24px;text-align:center;font-size:0.78rem;color:#94A3B8;font-style:italic;">No lab reports on file</div>';
    return reports.map(r => `
      <div style="background:#fff;border:1px solid #E2E8F0;border-left:3px solid ${r.flag==='abnormal'?'#DC2626':r.flag==='attention'?'#D97706':'#16A34A'};border-radius:8px;padding:10px 12px;margin-bottom:6px;box-shadow:0 1px 3px rgba(15,23,42,0.05);">
        <div style="font-weight:600;font-size:0.76rem;color:#1B2B45;">${r.file_name?.replace(/_/g,' ')}</div>
        <div style="font-size:0.65rem;color:#64748B;margin-top:3px;">${r.type} · ${formatDate(r.uploaded_at)}</div>
        <div style="margin-top:4px;font-size:0.62rem;font-weight:600;color:${r.flag==='abnormal'?'#DC2626':r.flag==='attention'?'#D97706':'#16A34A'};">
          ${r.flag==='abnormal'?'⚠ Abnormal':r.flag==='attention'?'⚡ Review':'✓ Normal'}
        </div>
        ${r.ai_summary?`<div style="margin-top:5px;padding:5px 8px;background:#F5F3FF;border-radius:5px;font-size:0.63rem;color:#5B21B6;line-height:1.4;">✨ ${r.ai_summary}</div>`:''}
      </div>`).join('');
  }

  if (activeTab === 'prescriptions') {
    if (!prevRx) return '<div style="padding:24px;text-align:center;font-size:0.78rem;color:#94A3B8;font-style:italic;">No previous prescriptions</div>';
    return `
      <div style="font-size:0.57rem;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#94A3B8;margin-bottom:8px;">
        Last Prescription · <span style="font-weight:400;text-transform:none;font-style:italic;">${formatDate(prevRx.date)}</span>
      </div>
      <div style="font-size:0.72rem;color:#6366F1;font-weight:600;margin-bottom:8px;">${prevRx.diagnosis}</div>
      ${prevRx.medicines.map(m => `
        <div style="padding:8px 10px;background:#fff;border:1px solid #E2E8F0;border-left:3px solid #10B981;border-radius:7px;margin-bottom:5px;box-shadow:0 1px 3px rgba(15,23,42,0.05);">
          <div style="font-weight:600;font-size:0.76rem;color:#1B2B45;">${m.name}</div>
          <div style="font-size:0.63rem;color:#64748B;font-family:monospace;margin-top:2px;">${m.dosage} · ${m.duration}</div>
          ${m.instructions?`<div style="font-size:0.62rem;color:#94A3B8;margin-top:1px;">${m.instructions}</div>`:''}
        </div>`).join('')}`;
  }

  if (activeTab === 'obstetric') {
    if (!g) return '<div style="padding:24px;text-align:center;font-size:0.78rem;color:#94A3B8;font-style:italic;">No obstetric history recorded</div>';
    return `
      <div style="background:#fff;border:1px solid #E2E8F0;border-left:3px solid #6366F1;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,0.05);">
        <div style="padding:7px 12px;background:#FAFBFD;border-bottom:1px solid #E2E8F0;">
          <span style="font-size:0.57rem;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#94A3B8;">Obstetric History</span>
        </div>
        <div style="padding:10px 12px;display:flex;gap:0;justify-content:space-around;">
          ${[['G',g.gravida,'Gravida'],['P',g.para,'Para'],['A',g.abortions,'Abortion'],['L',g.living,'Living'],['M',g.dysmenorrhoea==='none'?0:1,'Dysmenorrhoea']].map(([l,v,name])=>`
            <div style="text-align:center;padding:0 6px;">
              <div style="font-size:0.58rem;font-weight:700;color:#94A3B8;text-transform:uppercase;">${l}</div>
              <div style="font-size:1.5rem;font-weight:800;color:#1B2B45;line-height:1.2;">${v}</div>
              <div style="font-size:0.55rem;color:#CBD5E1;">${name}</div>
            </div>`).join('')}
        </div>
      </div>
      ${g.lmp?`<div style="padding:8px 10px;background:#EFF6FF;border:1px solid #BFDBFE;border-left:3px solid #3B82F6;border-radius:7px;font-size:0.72rem;color:#1D4ED8;margin-top:6px;box-shadow:0 1px 3px rgba(15,23,42,0.05);">LMP: <strong>${formatDate(g.lmp)}</strong> (${lmpWeeks}w ago)</div>`:''}
      ${g.cycle_length?`<div style="padding:8px 10px;background:#fff;border:1px solid #E2E8F0;border-left:3px solid #CBD5E1;border-radius:7px;margin-top:6px;font-size:0.72rem;color:#64748B;box-shadow:0 1px 3px rgba(15,23,42,0.05);">
        Cycle: <strong>${g.cycle_length}d</strong> · Flow: <strong>${g.cycle_duration}d</strong> · <strong>${g.contraception?.replace(/_/g,' ')}</strong>
      </div>`:''}`;
  }
  return '';
}

// ── RX ROW ──
function rxRow(m, idx) {
  const val = m.dosage || m.default_dosage || '1-0-1';
  const dur = m.duration || '5 Days';
  return `
    <tr data-rx-idx="${idx}" style="border-bottom:1px solid #F8FAFC;">
      <td style="padding:9px 16px;">
        <div style="font-weight:600;font-size:0.8rem;color:#1B2B45;">${m.name}${m.strength?' '+m.strength:''}</div>
        <div style="font-size:0.63rem;color:#94A3B8;margin-top:1px;">${m.form||'Tablet'} — ${m.instructions||'After food'}</div>
      </td>
      <td style="padding:9px 6px;text-align:center;">
        <input value="${val}"
          style="width:54px;padding:4px 5px;text-align:center;border:1.5px solid #C7D2FE;border-radius:5px;font-size:0.72rem;font-weight:700;font-family:monospace;color:#4338CA;background:#EEF2FF;outline:none;"
          onfocus="this.style.borderColor='#6366F1'" onblur="this.style.borderColor='#C7D2FE'">
      </td>
      <td style="padding:9px 6px;">
        <select style="border:1px solid #E2E8F0;border-radius:5px;font-size:0.72rem;padding:4px 5px;color:#1B2B45;background:#fff;font-family:inherit;outline:none;cursor:pointer;min-width:76px;">
          ${['3 Days','5 Days','7 Days','10 Days','14 Days','1 Month','3 Months'].map(d=>`<option ${dur===d?'selected':''}>${d}</option>`).join('')}
        </select>
      </td>
      <td style="padding:9px 8px;text-align:center;">
        <button onclick="this.closest('tr').remove()"
          style="background:none;border:none;cursor:pointer;color:#CBD5E1;padding:4px;border-radius:4px;line-height:1;"
          onmouseover="this.style.color='#DC2626'" onmouseout="this.style.color='#CBD5E1'">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
      </td>
    </tr>`;
}

function testTag(t) {
  return '<span style="display:inline-flex;align-items:center;gap:4px;font-size:0.68rem;font-weight:600;padding:3px 9px;background:#EEF2FF;color:#4338CA;border:1px solid #C7D2FE;border-radius:99px;">'
    + t + ' <span class="remove-test-tag" data-test="' + t + '" style="cursor:pointer;opacity:0.6;font-size:0.8rem;line-height:1;margin-left:1px;">×</span></span>';
}

function addMedicineToRx(container, med) {
  const tbody = container.querySelector('#rxBody');
  const empty = tbody.querySelector('.rx-empty');
  if (empty) empty.remove();
  const tr = document.createElement('tr');
  tr.style.borderBottom = '1px solid #F8FAFC';
  const dur = med.duration || '5 Days';
  tr.innerHTML = `
    <td style="padding:9px 16px;">
      <div style="font-weight:600;font-size:0.8rem;color:#1B2B45;">${med.name}${med.strength?' '+med.strength:''}</div>
      <div style="font-size:0.63rem;color:#94A3B8;margin-top:1px;">${med.form||'Tablet'} — ${med.instructions||med.default_instructions||'After food'}</div>
    </td>
    <td style="padding:9px 6px;text-align:center;">
      <input value="${med.dosage||med.default_dosage||'1-0-1'}"
        style="width:54px;padding:4px 5px;text-align:center;border:1.5px solid #C7D2FE;border-radius:5px;font-size:0.72rem;font-weight:700;font-family:monospace;color:#4338CA;background:#EEF2FF;outline:none;"
        onfocus="this.style.borderColor='#6366F1'" onblur="this.style.borderColor='#C7D2FE'">
    </td>
    <td style="padding:9px 6px;">
      <select style="border:1px solid #E2E8F0;border-radius:5px;font-size:0.72rem;padding:4px 5px;color:#1B2B45;background:#fff;font-family:inherit;outline:none;cursor:pointer;min-width:76px;">
        ${['3 Days','5 Days','7 Days','10 Days','14 Days','1 Month','3 Months'].map(d=>`<option ${dur===d?'selected':''}>${d}</option>`).join('')}
      </select>
    </td>
    <td style="padding:9px 8px;text-align:center;">
      <button onclick="this.closest('tr').remove()"
        style="background:none;border:none;cursor:pointer;color:#CBD5E1;padding:4px;border-radius:4px;line-height:1;"
        onmouseover="this.style.color='#DC2626'" onmouseout="this.style.color='#CBD5E1'">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
      </button>
    </td>`;
  tbody.appendChild(tr);
  tr.animate([{opacity:0,transform:'translateY(-4px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'ease-out'});
}

// ── SETUPS ──
function setupTabs(container, apptId, appt, patient, g, lmpWeeks, reports, prevRx, timeline) {
  container.querySelectorAll('.cf-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      container.querySelectorAll('.cf-tab').forEach(b => {
        const on = b.dataset.tab === activeTab;
        b.style.fontWeight   = on ? '700' : '500';
        b.style.color        = on ? '#6366F1' : '#64748B';
        b.style.borderBottom = on ? '2.5px solid #6366F1' : '2.5px solid transparent';
        b.classList.toggle('active', on);
      });
      const lp = container.querySelector('#leftPanel');
      if (lp) lp.innerHTML = renderLeftPanel(appt, patient, g, lmpWeeks, reports, prevRx, timeline);
    });
  });
}

function setupMedicineSearch(container) {
  const input = container.querySelector('#medSearch');
  const results = container.querySelector('#medResults');
  if (!input || !results) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    if (q.length < 2) { results.style.display = 'none'; return; }
    const hits = medicines.filter(m => m.name.toLowerCase().includes(q) || m.generic.toLowerCase().includes(q)).slice(0,7);
    if (!hits.length) { results.style.display = 'none'; return; }
    results.style.display = 'block';
    results.innerHTML = '<div style="background:#fff;border:1px solid #E2E8F0;border-radius:8px;box-shadow:0 8px 20px rgba(0,0,0,0.10);overflow:hidden;">'
      + hits.map(m => `<div class="med-result" data-med-id="${m.id}"
          style="padding:8px 14px;cursor:pointer;border-bottom:1px solid #F1F5F9;"
          onmouseover="this.style.background='#F8FAFC'" onmouseout="this.style.background=''">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-weight:600;font-size:0.8rem;color:#1B2B45;">${m.name} <span style="color:#94A3B8;font-weight:400;">${m.strength}</span></span>
            <span style="font-size:0.6rem;padding:1px 7px;border-radius:99px;background:#F1F5F9;color:#64748B;">${m.form}</span>
          </div>
          <div style="font-size:0.65rem;color:#94A3B8;margin-top:1px;">${m.generic} · <span style="font-family:monospace;">${m.default_dosage}</span></div>
        </div>`).join('') + '</div>';
    results.querySelectorAll('.med-result').forEach(el => {
      el.addEventListener('click', () => {
        const med = medicines.find(m => m.id === el.dataset.medId);
        if (med) { addMedicineToRx(container, med); showToast('Added ' + med.name); }
        input.value = ''; results.style.display = 'none';
      });
    });
  });
  document.addEventListener('click', e => { if (!results.contains(e.target) && e.target !== input) results.style.display = 'none'; });
}

function setupTemplates(container) {
  const btn      = container.querySelector('#templateDropdownBtn');
  const dropdown = container.querySelector('#templateDropdown');
  const clearBtn = container.querySelector('#templateClearAll');
  if (btn && dropdown) {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const rect = btn.getBoundingClientRect();
      dropdown.style.top   = (rect.bottom + 4) + 'px';
      dropdown.style.right = (window.innerWidth - rect.right) + 'px';
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', e => { if (!dropdown.contains(e.target) && e.target !== btn) dropdown.style.display = 'none'; });
  }
  container.querySelectorAll('.template-quick').forEach(qBtn => {
    qBtn.addEventListener('click', () => {
      const t = medicationTemplates.find(t => t.id === qBtn.dataset.templateId);
      if (!t) return;
      const rxBody = container.querySelector('#rxBody');
      if (rxBody) rxBody.innerHTML = '';
      t.medicines.forEach(m => addMedicineToRx(container, m));
      showToast('Applied "' + t.name + '"');
    });
  });
  if (clearBtn) clearBtn.addEventListener('click', () => {
    const rxBody = container.querySelector('#rxBody');
    if (rxBody) rxBody.innerHTML = '<tr class="rx-empty"><td colspan="4" style="padding:22px 16px;text-align:center;font-size:0.75rem;color:#94A3B8;font-style:italic;">Search or apply a protocol to add medicines</td></tr>';
    if (dropdown) dropdown.style.display = 'none';
    showToast('Prescription cleared');
  });
  container.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => {
      const t = medicationTemplates.find(t => t.id === card.dataset.templateId);
      if (!t) return;
      const rxBody = container.querySelector('#rxBody');
      if (rxBody) rxBody.innerHTML = '';
      t.medicines.forEach(m => addMedicineToRx(container, m));
      if (dropdown) dropdown.style.display = 'none';
      showToast('Applied "' + t.name + '"');
    });
  });
}

function setupTestSearch(container) {
  const input  = container.querySelector('#testSearch');
  const results = container.querySelector('#testResults');
  const tagsEl = container.querySelector('#selectedTestTags');
  if (!input || !results || !tagsEl) return;
  const allItems = [
    ...testPanels.map(p => ({ label: p.icon + ' ' + p.name, sub: 'Panel · ' + p.tests.length + ' tests', value: p.name, isPanel: true, panel: p })),
    ...commonTests.map(t => ({ label: t, sub: 'Individual test', value: t, isPanel: false }))
  ];
  function renderTags() {
    tagsEl.innerHTML = rxState.tests.map(t => testTag(t)).join('');
    tagsEl.querySelectorAll('.remove-test-tag').forEach(btn => {
      btn.addEventListener('click', () => { rxState.tests = rxState.tests.filter(t => t !== btn.dataset.test); renderTags(); });
    });
    const badge = container.querySelector('#labTestCountBadge');
    if (badge) {
      if (rxState.tests.length) {
        badge.style.display = 'inline-block';
        badge.textContent = rxState.tests.length + ' Selected';
      } else {
        badge.style.display = 'none';
      }
    }
  }
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    const filtered = q.length === 0 ? allItems.slice(0,10) : allItems.filter(i => i.label.toLowerCase().includes(q) || i.value.toLowerCase().includes(q)).slice(0,10);
    if (!filtered.length) { results.style.display = 'none'; return; }
    results.style.display = 'block';
    results.innerHTML = filtered.map(item => `<div class="test-search-item" data-value="${item.value}" data-is-panel="${item.isPanel}"
      style="padding:8px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #F1F5F9;"
      onmouseover="this.style.background='#F8FAFC'" onmouseout="this.style.background=''">
      <div>
        <div style="font-size:0.78rem;font-weight:600;color:#1B2B45;">${item.label}</div>
        <div style="font-size:0.62rem;color:#94A3B8;">${item.sub}</div>
      </div>
      ${item.isPanel ? '<span style="font-size:0.6rem;padding:1px 7px;background:#EEF2FF;color:#4338CA;border-radius:99px;font-weight:700;flex-shrink:0;">Panel</span>' : ''}
    </div>`).join('');
    results.querySelectorAll('.test-search-item').forEach(el => {
      el.addEventListener('click', () => {
        if (el.dataset.isPanel === 'true') {
          const panel = testPanels.find(p => p.name === el.dataset.value);
          if (panel) { panel.tests.forEach(t => { if (!rxState.tests.includes(t)) rxState.tests.push(t); }); showToast('Added panel: ' + panel.name); }
        } else {
          const test = el.dataset.value;
          if (!rxState.tests.includes(test)) { rxState.tests.push(test); showToast('Added: ' + test); }
        }
        renderTags(); input.value = ''; results.style.display = 'none';
      });
    });
  });
  input.addEventListener('focus', () => { if (!input.value) input.dispatchEvent(new Event('input')); });
  document.addEventListener('click', e => { if (!results.contains(e.target) && e.target !== input) results.style.display = 'none'; });
}

function setupFollowUp(container) {
  const di = container.querySelector('#followUpDate');
  container.querySelectorAll('.followup-quick').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.followup-quick').forEach(b => { b.style.background='#fff'; b.style.color='#64748B'; b.style.borderColor='#E2E8F0'; });
      btn.style.background = '#EEF2FF'; btn.style.color = '#4338CA'; btn.style.borderColor = '#C7D2FE';
      if (btn.dataset.days && di) {
        const d = new Date(); d.setDate(d.getDate() + parseInt(btn.dataset.days));
        di.value = d.toISOString().split('T')[0];
      }
    });
  });
}

function setupReprescribe(container, prevRx) {
  if (!prevRx) return;
  const allBtn = container.querySelector('#represcribeAllBtn');
  const selBtn = container.querySelector('#represcribeSelectedBtn');
  const cbs    = container.querySelectorAll('.represcribe-check');
  cbs.forEach(cb => cb.addEventListener('change', () => {
    if (selBtn) selBtn.style.opacity = Array.from(cbs).some(c => c.checked) ? '1' : '0.5';
  }));
  allBtn?.addEventListener('click', () => { prevRx.medicines.forEach(m => addMedicineToRx(container, m)); showToast('Re-prescribed ' + prevRx.medicines.length + ' medicines'); });
  selBtn?.addEventListener('click', () => {
    const sel = Array.from(cbs).filter(c => c.checked);
    if (!sel.length) { showToast('Select medicines first', 'error'); return; }
    sel.forEach(cb => { const m = prevRx.medicines[parseInt(cb.dataset.idx)]; if (m) addMedicineToRx(container, m); });
    showToast('Re-prescribed ' + sel.length + ' medicines');
  });
}

function setupApproval(container, appt) {
  container.querySelector('#approveBtn')?.addEventListener('click', () => {
    const rows = container.querySelector('#rxBody')?.querySelectorAll('tr:not(.rx-empty)');
    if (!rows?.length && !rxState.tests.length) { showToast('Add at least 1 medicine or test', 'error'); return; }
    showToast('✓ Prescription approved for ' + appt.patient_name);
  });
}

function setupDiagnosisDropdown(container) {
  const trigger = container.querySelector('#dxSelectTrigger');
  const dropdown = container.querySelector('#dxSelectDropdown');
  const searchInput = container.querySelector('#dxSelectSearch');
  const optionsList = container.querySelector('#dxOptionsList');
  const ta = container.querySelector('#diagnosisText');

  if (!trigger || !dropdown || !searchInput || !optionsList || !ta) return;

  function renderOptions(query = '') {
    const q = query.toLowerCase().trim();
    let matches = SUGGESTED_DX.filter(dx => dx.toLowerCase().includes(q));
    
    let html = matches.map(dx => `
      <div class="dx-option" data-value="${dx}"
        style="padding:6px 10px; font-size:0.74rem; color:#1B2B45; border-radius:5px; cursor:pointer; transition:background 0.1s;"
        onmouseover="this.style.background='#EEF2FF'; this.style.color='#4338CA';"
        onmouseout="this.style.background=''; this.style.color='#1B2B45';">
        ${dx}
      </div>
    `).join('');

    if (q && !SUGGESTED_DX.some(dx => dx.toLowerCase() === q)) {
      html += `
        <div style="height:1px; background:#F1F5F9; margin:4px 0;"></div>
        <div class="dx-option dx-custom-option" data-value="${query}"
          style="padding:6px 10px; font-size:0.74rem; color:#4F46E5; font-weight:600; border-radius:5px; cursor:pointer;"
          onmouseover="this.style.background='#EEF2FF';"
          onmouseout="this.style.background='';">
          + Add custom: "${query}"
        </div>
      `;
    }

    optionsList.innerHTML = html || '<div style="padding:8px 10px; font-size:0.72rem; color:#94A3B8; font-style:italic; text-align:center;">No matching diagnoses</div>';

    optionsList.querySelectorAll('.dx-option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = opt.dataset.value;
        if (val) {
          ta.value = ta.value ? ta.value + ', ' + val : val;
          rxState.diagnosis = ta.value;
          showToast('Added diagnosis: ' + val);
        }
        closeDropdown();
      });
    });
  }

  function openDropdown() {
    dropdown.style.display = 'block';
    trigger.style.borderColor = '#6366F1';
    searchInput.focus();
    renderOptions(searchInput.value);
  }

  function closeDropdown() {
    dropdown.style.display = 'none';
    trigger.style.borderColor = '#E2E8F0';
    searchInput.value = '';
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (dropdown.style.display === 'none') {
      openDropdown();
    } else {
      closeDropdown();
    }
  });

  searchInput.addEventListener('input', () => {
    renderOptions(searchInput.value);
  });

  searchInput.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== trigger) {
      closeDropdown();
    }
  });

  // Keep rxState in sync if user types directly
  ta.addEventListener('input', () => {
    rxState.diagnosis = ta.value;
  });

  const remarksTa = container.querySelector('#remarksText');
  if (remarksTa) {
    remarksTa.addEventListener('input', () => {
      rxState.remarks = remarksTa.value;
    });
  }
}
function setupTestPanelDropdown(container) {
  const btn = container.querySelector('#testPanelBtn');
  const dropdown = container.querySelector('#testPanelDropdown');
  const tagsEl = container.querySelector('#selectedTestTags');
  if (!btn || !dropdown || !tagsEl) return;

  function renderTags() {
    tagsEl.innerHTML = rxState.tests.map(t => testTag(t)).join('');
    tagsEl.querySelectorAll('.remove-test-tag').forEach(b => {
      b.addEventListener('click', () => {
        rxState.tests = rxState.tests.filter(t => t !== b.dataset.test);
        renderTags();
        updateBadge();
      });
    });
    updateBadge();
  }

  function updateBadge() {
    const badge = container.querySelector('#labTestCountBadge');
    if (badge) {
      badge.style.display = rxState.tests.length ? 'inline-block' : 'none';
      badge.textContent = rxState.tests.length + ' Selected';
    }
  }

  function openDropdown() {
    const rect = btn.getBoundingClientRect();
    dropdown.style.display = 'block';
    dropdown.style.top = (rect.bottom + 6) + 'px';
    dropdown.style.left = Math.max(8, rect.right - 240) + 'px';
  }

  function closeDropdown() {
    dropdown.style.display = 'none';
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.style.display === 'none' ? openDropdown() : closeDropdown();
  });

  dropdown.querySelectorAll('.test-panel-option').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const panel = testPanels.find(p => p.id === el.dataset.panelId);
      if (panel) {
        let added = 0;
        panel.tests.forEach(t => {
          if (!rxState.tests.includes(t)) { rxState.tests.push(t); added++; }
        });
        renderTags();
        showToast(panel.icon + ' ' + panel.name + ' — ' + added + ' tests added');
      }
      closeDropdown();
    });
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== btn) closeDropdown();
  });
}
