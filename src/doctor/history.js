// ================================================================
// DOCTOR PORTAL — Patient Full History Page
// Sections: Visit Timeline · Past Prescriptions · Lab Reports
// ================================================================
import { patientHistory, allLabReports } from '../data/appointments.js';
import { patients } from '../data/patients.js';
import { todayAppointments } from '../data/appointments.js';
import { doctorSidebar, statusChip, gpalmBadge, formatDate, showToast } from '../components/shared.js';

export function renderPatientHistory(container, patientId) {
  const patient = patients.find(p => p.id === patientId);
  const appt = todayAppointments.find(a => a.patient_id === patientId);
  const history = patientHistory[patientId];
  const reports = allLabReports.filter(r => r.patient_id === patientId).sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));

  if (!patient) {
    container.innerHTML = '<div class="empty-state"><h2>Patient not found</h2></div>';
    return;
  }

  const g = patient.gynec;
  const visits = history?.visits || [];
  const totalRx = visits.filter(v => v.prescription?.medicines?.length > 0).length;

  container.innerHTML = `
    <div class="app-shell portal-doctor">
      ${doctorSidebar('/doctor')}
      <main class="main-content" style="display:flex; flex-direction:column; height:100vh; overflow:hidden;">

        <!-- ── HEADER ── -->
        <div style="flex-shrink:0; padding:10px 24px; background:var(--bg-surface); border-bottom:1px solid var(--border-light); display:flex; align-items:center; justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:14px;">
            ${appt ? `<a href="#/doctor/consult/${appt.id}" style="font-size:0.75rem; color:var(--text-muted); text-decoration:none;">← Back to Consult</a>` : `<a href="#/doctor" style="font-size:0.75rem; color:var(--text-muted); text-decoration:none;">← Dashboard</a>`}
            <div style="width:36px; height:36px; border-radius:50%; background:var(--accent-teal-light); border:2px solid var(--accent-teal); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.85rem; color:var(--accent-teal); flex-shrink:0;">
              ${patient.name.split(' ').map(n=>n[0]).join('').substring(0,2)}
            </div>
            <div>
              <div style="font-weight:700; font-size:0.98rem;">${patient.name} · <span style="font-weight:400; color:var(--text-secondary);">${patient.age}F · ${patient.blood_group}</span></div>
              <div style="font-size:0.72rem; color:var(--text-muted);">${patient.phone} · ${visits.length} visits · ${reports.length} lab reports · ${totalRx} prescriptions</div>
            </div>
          </div>
          <div style="display:flex; gap:6px; align-items:center;">
            ${appt ? `<button class="btn btn-teal btn-sm" onclick="navigate('/doctor/consult/${appt.id}')">Open Consult →</button>` : ''}
          </div>
        </div>

        <!-- ── TABS ── -->
        <div style="flex-shrink:0; display:flex; gap:0; border-bottom:2px solid var(--border-light); background:var(--bg-surface); padding:0 24px;">
          <button class="history-tab active" data-tab="visits" onclick="switchHistoryTab('visits')" style="padding:10px 18px; background:none; border:none; border-bottom:2px solid var(--accent-teal); margin-bottom:-2px; font-weight:600; font-size:0.82rem; color:var(--accent-teal); cursor:pointer;">
            📋 Visit History <span style="background:var(--accent-teal-light); color:var(--accent-teal); font-size:0.65rem; padding:1px 6px; border-radius:var(--radius-full); margin-left:5px;">${visits.length}</span>
          </button>
          <button class="history-tab" data-tab="prescriptions" onclick="switchHistoryTab('prescriptions')" style="padding:10px 18px; background:none; border:none; border-bottom:2px solid transparent; margin-bottom:-2px; font-weight:600; font-size:0.82rem; color:var(--text-muted); cursor:pointer;">
            💊 Prescriptions <span style="background:var(--bg-subtle); color:var(--text-muted); font-size:0.65rem; padding:1px 6px; border-radius:var(--radius-full); margin-left:5px;">${totalRx}</span>
          </button>
          <button class="history-tab" data-tab="labs" onclick="switchHistoryTab('labs')" style="padding:10px 18px; background:none; border:none; border-bottom:2px solid transparent; margin-bottom:-2px; font-weight:600; font-size:0.82rem; color:var(--text-muted); cursor:pointer;">
            📁 Lab Reports <span style="background:var(--bg-subtle); color:var(--text-muted); font-size:0.65rem; padding:1px 6px; border-radius:var(--radius-full); margin-left:5px;">${reports.length}</span>
          </button>
        </div>

        <!-- ── CONTENT AREA ── -->
        <div style="flex:1; overflow-y:auto; padding:20px 24px; background:var(--bg-canvas);">

          <!-- ══ VISITS TAB ══ -->
          <div id="tab-visits" class="history-tab-content">
            ${visits.length === 0 ? `
              <div style="text-align:center; padding:60px 20px; color:var(--text-muted);">
                <div style="font-size:2.5rem; margin-bottom:12px;">📋</div>
                <div style="font-size:1rem; font-weight:600; margin-bottom:4px;">No visit history</div>
                <div style="font-size:0.82rem;">New patient — first visit will appear here after consultation</div>
              </div>
            ` : visits.map((v, idx) => `
              <div style="display:grid; grid-template-columns:160px 1fr; gap:0; margin-bottom:0; position:relative;">
                <!-- Timeline -->
                <div style="padding:0 20px 0 0; text-align:right; position:relative;">
                  <div style="position:absolute; right:-1px; top:10px; bottom:0; width:2px; background:var(--border-light); ${idx === visits.length - 1 ? 'height:20px; bottom:auto;' : ''}"></div>
                  <div style="position:absolute; right:-7px; top:8px; width:14px; height:14px; border-radius:50%; background:${v.status === 'completed' ? 'var(--status-success)' : 'var(--accent-teal)'}; border:2px solid var(--bg-canvas);"></div>
                  <div style="font-size:0.8rem; font-weight:700; color:var(--text-primary); padding-right:12px;">${formatDate(v.date)}</div>
                  <div style="font-size:0.65rem; color:var(--text-muted); margin-top:2px;">${v.type}</div>
                  <div style="font-size:0.65rem; color:var(--text-muted); margin-top:1px;">${v.doctor.replace('Dr. Anita ', 'Dr. A.')}</div>
                </div>

                <!-- Visit Card -->
                <div style="padding-left:24px; padding-bottom:28px;">
                  <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-sm);">

                    <!-- Card Header -->
                    <div style="padding:12px 16px; background:var(--bg-subtle); border-bottom:1px solid var(--border-light); display:flex; align-items:flex-start; justify-content:space-between; gap:12px; cursor:pointer;" onclick="toggleVisitCard('${v.id}')">
                      <div style="flex:1; min-width:0;">
                        <div style="font-weight:700; font-size:0.9rem; color:var(--text-primary); margin-bottom:3px;">${v.chief_complaint}</div>
                        <div style="font-size:0.75rem; color:var(--accent-teal); font-weight:600;">Dx: ${v.diagnosis}</div>
                      </div>
                      <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
                        <div style="display:flex; gap:5px; align-items:center; font-size:0.68rem; color:var(--text-muted);">
                          ${v.vitals ? `<span style="background:var(--bg-canvas); border:1px solid var(--border-light); padding:2px 7px; border-radius:var(--radius-sm);">BP ${v.vitals.bp}</span>` : ''}
                          ${v.prescription?.medicines?.length > 0 ? `<span style="background:var(--accent-teal-light); color:var(--accent-teal); border:1px solid rgba(15,139,141,0.2); padding:2px 7px; border-radius:var(--radius-sm); font-weight:600;">💊 ${v.prescription.medicines.length} medicines</span>` : ''}
                        </div>
                        ${statusChip(v.status)}
                        <span class="visit-chevron" id="chevron-${v.id}" style="font-size:0.65rem; color:var(--text-muted); transition:transform 0.2s;">▼</span>
                      </div>
                    </div>

                    <!-- Card Body (expandable) -->
                    <div id="visitcard-${v.id}" style="display:none;">
                      <!-- Symptoms -->
                      <div style="padding:12px 16px; border-bottom:1px solid var(--border-light);">
                        <div style="font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--text-muted); margin-bottom:5px;">📋 Symptoms reported</div>
                        <p style="font-size:0.8rem; color:var(--text-secondary); line-height:1.6; margin:0;">${v.symptoms}</p>
                      </div>

                      <!-- SOAP -->
                      <div style="padding:12px 16px; border-bottom:1px solid var(--border-light); background:rgba(111,66,193,0.03);">
                        <div style="font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--ai-violet); margin-bottom:8px;">📝 SOAP Notes</div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                          ${[['S','Subjective',v.soap.subjective],['O','Objective',v.soap.objective],['A','Assessment',v.soap.assessment],['P','Plan',v.soap.plan]].map(([l,lbl,txt]) => `
                            <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:8px 10px;">
                              <div style="display:flex; align-items:center; gap:5px; margin-bottom:4px;">
                                <span style="width:17px; height:17px; border-radius:50%; background:var(--ai-violet-light); color:var(--ai-violet); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.6rem; flex-shrink:0;">${l}</span>
                                <span style="font-size:0.62rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">${lbl}</span>
                              </div>
                              <p style="font-size:0.74rem; color:var(--text-secondary); line-height:1.5; margin:0;">${txt}</p>
                            </div>
                          `).join('')}
                        </div>
                      </div>

                      <!-- Vitals -->
                      ${v.vitals ? `
                        <div style="padding:10px 16px; border-bottom:1px solid var(--border-light); display:flex; gap:8px; flex-wrap:wrap;">
                          ${[['BP',v.vitals.bp],['Pulse',v.vitals.pulse],['Temp',v.vitals.temp],['Weight',v.vitals.weight]].map(([l,val]) => `
                            <div style="padding:5px 12px; background:var(--bg-subtle); border:1px solid var(--border-light); border-radius:var(--radius-sm); text-align:center;">
                              <div style="font-size:0.58rem; font-weight:700; text-transform:uppercase; color:var(--text-muted);">${l}</div>
                              <div style="font-size:0.82rem; font-weight:700; color:var(--text-primary);">${val}</div>
                            </div>
                          `).join('')}
                        </div>
                      ` : ''}

                      <!-- Prescription -->
                      ${v.prescription ? `
                        <div style="padding:12px 16px; border-bottom:1px solid var(--border-light); background:rgba(15,139,141,0.02);">
                          <div style="font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--accent-teal); margin-bottom:8px;">💊 Prescription</div>
                          ${v.prescription.medicines.length > 0 ? `
                            <table style="width:100%; border-collapse:collapse; font-size:0.78rem; margin-bottom:8px;">
                              <thead>
                                <tr style="background:var(--bg-subtle);">
                                  <th style="text-align:left; padding:5px 10px; font-size:0.65rem; color:var(--text-muted); font-weight:600; text-transform:uppercase; border-bottom:1px solid var(--border-light);">Medicine</th>
                                  <th style="text-align:left; padding:5px 10px; font-size:0.65rem; color:var(--text-muted); font-weight:600; text-transform:uppercase; border-bottom:1px solid var(--border-light);">Dosage</th>
                                  <th style="text-align:left; padding:5px 10px; font-size:0.65rem; color:var(--text-muted); font-weight:600; text-transform:uppercase; border-bottom:1px solid var(--border-light);">Duration</th>
                                  <th style="text-align:left; padding:5px 10px; font-size:0.65rem; color:var(--text-muted); font-weight:600; text-transform:uppercase; border-bottom:1px solid var(--border-light);">Instructions</th>
                                </tr>
                              </thead>
                              <tbody>
                                ${v.prescription.medicines.map((m, mi) => `
                                  <tr style="${mi % 2 === 0 ? '' : 'background:var(--bg-subtle);'}">
                                    <td style="padding:6px 10px; font-weight:600; border-bottom:1px solid var(--border-light);">${m.name}</td>
                                    <td style="padding:6px 10px; font-family:monospace; border-bottom:1px solid var(--border-light);">${m.dosage}</td>
                                    <td style="padding:6px 10px; color:var(--text-secondary); border-bottom:1px solid var(--border-light);">${m.duration}</td>
                                    <td style="padding:6px 10px; color:var(--text-muted); border-bottom:1px solid var(--border-light);">${m.instructions}</td>
                                  </tr>
                                `).join('')}
                              </tbody>
                            </table>
                          ` : '<div style="font-size:0.78rem; color:var(--text-muted); padding:4px 0;">No medicines prescribed</div>'}
                          ${v.prescription.tests_ordered?.length > 0 ? `
                            <div style="display:flex; align-items:flex-start; gap:8px; margin-top:6px;">
                              <span style="font-size:0.68rem; font-weight:700; color:var(--text-muted); white-space:nowrap; padding-top:1px;">🔬 Tests:</span>
                              <div style="display:flex; flex-wrap:wrap; gap:3px;">
                                ${v.prescription.tests_ordered.map(t => `<span style="font-size:0.65rem; padding:2px 7px; background:var(--bg-subtle); border:1px solid var(--border); border-radius:var(--radius-full); color:var(--text-secondary);">${t}</span>`).join('')}
                              </div>
                            </div>
                          ` : ''}
                          ${v.prescription.advice ? `
                            <div style="margin-top:8px; padding:7px 10px; background:var(--bg-subtle); border-left:3px solid var(--accent-teal); border-radius:0 var(--radius-sm) var(--radius-sm) 0; font-size:0.74rem; color:var(--text-secondary); line-height:1.5;">
                              <span style="font-weight:600;">Advice: </span>${v.prescription.advice}
                            </div>
                          ` : ''}
                          ${v.prescription.follow_up ? `
                            <div style="margin-top:6px; font-size:0.72rem; color:var(--text-muted);">📅 Follow-up: <strong>${v.prescription.follow_up}</strong></div>
                          ` : ''}
                        </div>
                      ` : ''}
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- ══ PRESCRIPTIONS TAB ══ -->
          <div id="tab-prescriptions" class="history-tab-content" style="display:none;">
            <div style="margin-bottom:16px; display:flex; align-items:center; justify-content:space-between;">
              <div style="font-size:0.82rem; color:var(--text-muted);">All prescriptions ordered chronologically — most recent first</div>
            </div>
            ${visits.filter(v => v.prescription?.medicines?.length > 0).length === 0 ? `
              <div style="text-align:center; padding:60px 20px; color:var(--text-muted);">
                <div style="font-size:2.5rem; margin-bottom:12px;">💊</div>
                <div style="font-size:1rem; font-weight:600;">No prescriptions yet</div>
              </div>
            ` : visits.filter(v => v.prescription?.medicines?.length > 0).map(v => `
              <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); overflow:hidden; margin-bottom:14px; box-shadow:var(--shadow-sm);">
                <!-- Rx header -->
                <div style="padding:12px 20px; background:var(--accent-teal-light); border-bottom:1px solid rgba(15,139,141,0.15); display:flex; align-items:center; justify-content:space-between;">
                  <div>
                    <div style="font-weight:700; font-size:0.88rem; color:var(--text-primary);">${v.chief_complaint}</div>
                    <div style="font-size:0.72rem; color:var(--accent-teal); font-weight:600; margin-top:2px;">Dx: ${v.diagnosis}</div>
                  </div>
                  <div style="text-align:right; flex-shrink:0;">
                    <div style="font-size:0.82rem; font-weight:700; color:var(--text-primary);">${formatDate(v.date)}</div>
                    <div style="font-size:0.68rem; color:var(--text-muted);">${v.doctor}</div>
                  </div>
                </div>
                <!-- Medicines table -->
                <div style="padding:14px 20px;">
                  <table style="width:100%; border-collapse:collapse; font-size:0.8rem;">
                    <thead>
                      <tr>
                        <th style="text-align:left; padding:5px 8px; font-size:0.62rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid var(--border-light);">#</th>
                        <th style="text-align:left; padding:5px 8px; font-size:0.62rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid var(--border-light);">Medicine</th>
                        <th style="text-align:left; padding:5px 8px; font-size:0.62rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid var(--border-light);">Dosage</th>
                        <th style="text-align:left; padding:5px 8px; font-size:0.62rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid var(--border-light);">Duration</th>
                        <th style="text-align:left; padding:5px 8px; font-size:0.62rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid var(--border-light);">Instructions</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${v.prescription.medicines.map((m, mi) => `
                        <tr style="${mi % 2 !== 0 ? 'background:var(--bg-subtle);' : ''}">
                          <td style="padding:7px 8px; color:var(--text-muted); font-size:0.72rem; border-bottom:1px solid var(--border-light);">${mi + 1}</td>
                          <td style="padding:7px 8px; font-weight:700; border-bottom:1px solid var(--border-light);">${m.name}</td>
                          <td style="padding:7px 8px; font-family:monospace; font-size:0.8rem; letter-spacing:1px; border-bottom:1px solid var(--border-light);">${m.dosage}</td>
                          <td style="padding:7px 8px; color:var(--text-secondary); border-bottom:1px solid var(--border-light);">${m.duration}</td>
                          <td style="padding:7px 8px; color:var(--text-muted); font-size:0.72rem; border-bottom:1px solid var(--border-light);">${m.instructions}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                  <div style="margin-top:10px; display:flex; gap:20px; align-items:flex-start; flex-wrap:wrap;">
                    ${v.prescription.tests_ordered?.length > 0 ? `
                      <div>
                        <div style="font-size:0.62rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:4px;">Tests Ordered</div>
                        <div style="display:flex; flex-wrap:wrap; gap:3px;">${v.prescription.tests_ordered.map(t => `<span style="font-size:0.65rem; padding:2px 7px; background:var(--bg-subtle); border:1px solid var(--border); border-radius:var(--radius-full);">${t}</span>`).join('')}</div>
                      </div>
                    ` : ''}
                    ${v.prescription.follow_up ? `
                      <div>
                        <div style="font-size:0.62rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:4px;">Follow-up</div>
                        <div style="font-size:0.78rem; font-weight:600; color:var(--text-secondary);">${v.prescription.follow_up}</div>
                      </div>
                    ` : ''}
                    ${v.prescription.advice ? `
                      <div style="flex:1; min-width:200px;">
                        <div style="font-size:0.62rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:4px;">Patient Advice</div>
                        <div style="font-size:0.74rem; color:var(--text-secondary); line-height:1.5;">${v.prescription.advice}</div>
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- ══ LAB REPORTS TAB ══ -->
          <div id="tab-labs" class="history-tab-content" style="display:none;">
            ${reports.length === 0 ? `
              <div style="text-align:center; padding:60px 20px; color:var(--text-muted);">
                <div style="font-size:2.5rem; margin-bottom:12px;">📁</div>
                <div style="font-size:1rem; font-weight:600;">No lab reports</div>
                <div style="font-size:0.82rem; margin-top:4px;">Upload via the Reception portal</div>
              </div>
            ` : `
              <div style="display:flex; flex-direction:column; gap:10px;">
                ${reports.map(r => `
                  <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); overflow:hidden; display:flex; align-items:stretch; box-shadow:var(--shadow-sm); transition:box-shadow 0.15s;" onmouseover="this.style.boxShadow='var(--shadow-md)'" onmouseout="this.style.boxShadow='var(--shadow-sm)'">

                    <!-- Type icon column -->
                    <div style="width:56px; flex-shrink:0; background:${r.flag === 'abnormal' ? 'rgba(239,68,68,0.08)' : r.flag === 'attention' ? 'rgba(245,158,11,0.08)' : 'var(--bg-subtle)'}; display:flex; align-items:center; justify-content:center; border-right:1px solid var(--border-light);">
                      <div style="font-size:1.4rem;">${r.type === 'Ultrasound' ? '🔊' : r.type === 'Pap Smear' ? '🩺' : '🧪'}</div>
                    </div>

                    <!-- Main content -->
                    <div style="flex:1; padding:12px 16px;">
                      <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:6px;">
                        <div>
                          <div style="font-weight:700; font-size:0.88rem; color:var(--accent-teal); margin-bottom:2px;">📄 ${r.file_name.replace(/_/g,' ')}</div>
                          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                            <span style="font-size:0.68rem; padding:2px 8px; border-radius:var(--radius-full); background:var(--bg-subtle); border:1px solid var(--border); color:var(--text-muted);">${r.type}</span>
                            ${r.flag === 'abnormal' ? '<span style="font-size:0.65rem; padding:2px 8px; border-radius:var(--radius-full); background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.2); color:var(--status-danger); font-weight:700;">⚠ Abnormal</span>' : ''}
                            ${r.flag === 'attention' ? '<span style="font-size:0.65rem; padding:2px 8px; border-radius:var(--radius-full); background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.2); color:var(--status-warning); font-weight:700;">⚡ Needs Review</span>' : ''}
                            ${r.status === 'reviewed' ? '<span style="font-size:0.65rem; color:var(--status-success);">✓ Reviewed</span>' : '<span style="font-size:0.65rem; color:var(--status-warning);">⏳ Pending</span>'}
                          </div>
                        </div>
                        <div style="text-align:right; flex-shrink:0;">
                          <div style="font-size:0.8rem; font-weight:700; color:var(--text-primary);">${formatDate(r.uploaded_at)}</div>
                          <div style="font-size:0.65rem; color:var(--text-muted); margin-top:1px;">${r.size} · ${r.uploaded_by}</div>
                        </div>
                      </div>
                      ${r.ai_summary ? `
                        <div style="padding:7px 10px; background:rgba(111,66,193,0.05); border:1px solid rgba(111,66,193,0.12); border-radius:var(--radius-sm);">
                          <div style="font-size:0.62rem; font-weight:700; text-transform:uppercase; color:var(--ai-violet); margin-bottom:3px; letter-spacing:0.5px;">✨ AI Summary</div>
                          <div style="font-size:0.76rem; color:var(--text-secondary); line-height:1.5;">${r.ai_summary}</div>
                        </div>
                      ` : ''}
                    </div>

                    <!-- Action buttons -->
                    <div style="display:flex; flex-direction:column; justify-content:center; gap:6px; padding:12px; border-left:1px solid var(--border-light); background:var(--bg-subtle);">
                      <button class="btn btn-teal-outline btn-sm" style="font-size:0.65rem; padding:5px 10px; white-space:nowrap;" onclick="showToast('Opening ${r.file_name.replace(/_/g,' ')}...')">View PDF</button>
                      <button class="btn btn-ghost btn-sm" style="font-size:0.65rem; padding:5px 10px; white-space:nowrap;">🖨 Print</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

        </div>
      </main>
    </div>
  `;

  // Tab switching
  window.switchHistoryTab = (tab) => {
    container.querySelectorAll('.history-tab-content').forEach(el => el.style.display = 'none');
    container.querySelectorAll('.history-tab').forEach(btn => {
      const isActive = btn.dataset.tab === tab;
      btn.style.color = isActive ? 'var(--accent-teal)' : 'var(--text-muted)';
      btn.style.borderBottom = isActive ? '2px solid var(--accent-teal)' : '2px solid transparent';
      btn.style.fontWeight = isActive ? '700' : '600';
    });
    const el = container.querySelector(`#tab-${tab}`);
    if (el) el.style.display = 'block';
  };

  // Visit card toggle
  window.toggleVisitCard = (visitId) => {
    const card = container.querySelector(`#visitcard-${visitId}`);
    const chevron = container.querySelector(`#chevron-${visitId}`);
    if (!card) return;
    const isOpen = card.style.display !== 'none';
    card.style.display = isOpen ? 'none' : 'block';
    if (chevron) chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
  };

  // Auto-expand first visit
  if (visits.length > 0) {
    setTimeout(() => window.toggleVisitCard(visits[0].id), 50);
  }
}
