// ================================================================
// RECEPTIONIST PORTAL — Patient Registration Wizard
// ================================================================
import { doctors } from '../data/appointments.js';
import { receptionistSidebar, gpalmBadge, showToast } from '../components/shared.js';

let wizardState = {
  step: 1,
  mode: 'full', // 'quick' | 'full'
  data: {
    phone: '', email: '', doctor_id: '', name: '', dob: '', blood_group: '', allergies: '', address: '',
    lmp: '', cycle_length: 28, cycle_duration: 5, regularity: 'regular', dysmenorrhoea: 'none',
    gravida: 0, para: 0, abortions: 0, living: 0,
    pregnancies: [],
    contraception: 'none', surgical_history: []
  }
};

export function renderPatientRegister(container) {
  wizardState.step = 1;
  wizardState.mode = 'full';
  renderWizard(container);
}

function renderWizard(container) {
  const totalSteps = 6;
  const s = wizardState;

  // Quick Register mode renders a separate simple form
  if (s.mode === 'quick') {
    renderQuickRegister(container);
    return;
  }


  container.innerHTML = `
    <div class="app-shell portal-receptionist">
      ${receptionistSidebar('/receptionist/patients/new')}
      <main class="main-content">
        <div class="page-header">
          <div class="page-header-top">
            <div>
              <h1>Register New Patient</h1>
              <p class="page-subtitle">Step ${s.step} of ${totalSteps} — Full Profile</p>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <!-- Mode Toggle -->
              <div style="display:flex; background:var(--bg-subtle); border-radius:8px; padding:3px; gap:3px;">
                <button id="modeQuickBtn" style="padding:5px 14px; border-radius:6px; border:none; cursor:pointer; font-size:0.75rem; font-weight:600; background:var(--bg-surface); color:var(--text-primary); box-shadow:var(--shadow-sm); transition:all 0.15s;">⚡ Quick Register</button>
                <button id="modeFullBtn" style="padding:5px 14px; border-radius:6px; border:none; cursor:pointer; font-size:0.75rem; font-weight:600; background:var(--accent-teal); color:#fff; transition:all 0.15s;">📋 Full Profile</button>
              </div>
              <button class="btn btn-ghost btn-sm" onclick="navigate('/receptionist/patients')">← Back</button>
            </div>
          </div>
        </div>

        <div class="page-body">
          <!-- Wizard Stepper -->
          <div class="wizard-stepper">
            ${['Identity', 'Menstrual', 'Obstetric', 'Pregnancies', 'Contraception', 'Review'].map((label, i) => {
              const stepNum = i + 1;
              const cls = stepNum < s.step ? 'completed' : stepNum === s.step ? 'current' : '';
              return `
                <div class="wizard-step ${cls}">
                  <div class="wizard-step-num">${stepNum < s.step ? '✓' : stepNum}</div>
                  <span style="font-size: 0.75rem; white-space: nowrap;">${label}</span>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Step Content -->
          <div class="card animate-fade-in-up" style="max-width: 800px;">
            ${renderStep(s.step, s.data)}
          </div>

          <!-- Navigation -->
          <div style="display: flex; justify-content: space-between; margin-top: var(--space-xl); max-width: 800px;">
            ${s.step > 1 ? `<button class="btn btn-ghost" id="prevBtn">← Previous</button>` : '<div></div>'}
            ${s.step < totalSteps
              ? `<button class="btn btn-coral" id="nextBtn">Next step →</button>`
              : `<button class="btn btn-coral btn-lg" id="submitBtn">✓ Register Patient</button>`
            }
          </div>
        </div>
      </main>
    </div>
  `;

  // Event listeners
  const prevBtn = container.querySelector('#prevBtn');
  const nextBtn = container.querySelector('#nextBtn');
  const submitBtn = container.querySelector('#submitBtn');

  if (prevBtn) prevBtn.addEventListener('click', () => {
    saveCurrentStep(container);
    wizardState.step--;
    renderWizard(container);
  });

  if (nextBtn) nextBtn.addEventListener('click', () => {
    saveCurrentStep(container);
    wizardState.step++;
    renderWizard(container);
  });

  if (submitBtn) submitBtn.addEventListener('click', () => {
    showRegistrationSuccess(container);
  });

  // Mode toggle
  container.querySelector('#modeQuickBtn')?.addEventListener('click', () => {
    wizardState.mode = 'quick'; renderWizard(container);
  });

  // GPALM live preview
  setupGPALMPreview(container);
  // LMP weeks computation
  setupLMPCompute(container);
}

function renderQuickRegister(container) {
  container.innerHTML = `
    <div class="app-shell portal-receptionist">
      ${receptionistSidebar('/receptionist/patients/new')}
      <main class="main-content">
        <div class="page-header">
          <div class="page-header-top">
            <div>
              <h1>Quick Register</h1>
              <p class="page-subtitle">Walk-in patient &#8212; token in seconds</p>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="display:flex; background:var(--bg-subtle); border-radius:8px; padding:3px; gap:3px;">
                <button id="modeQuickBtn2" style="padding:5px 14px; border-radius:6px; border:none; cursor:pointer; font-size:0.75rem; font-weight:600; background:var(--accent-teal); color:#fff;">&#x26A1; Quick</button>
                <button id="modeFullBtn2" style="padding:5px 14px; border-radius:6px; border:none; cursor:pointer; font-size:0.75rem; font-weight:600; background:var(--bg-surface); color:var(--text-primary); box-shadow:var(--shadow-sm);">&#x1F4CB; Full Profile</button>
              </div>
              <button class="btn btn-ghost btn-sm" onclick="navigate('/receptionist')">&#x2190; Back</button>
            </div>
          </div>
        </div>
        <div class="page-body">
          <div class="card animate-fade-in-up" style="max-width:500px;">
            <h3 style="margin-bottom:20px; font-size:1rem;">Walk-in Registration</h3>
            <div style="display:flex; flex-direction:column; gap:14px;">
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input type="text" class="form-input" id="qr_name" placeholder="Patient full name" autofocus>
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number *</label>
                <input type="tel" class="form-input" id="qr_phone" placeholder="10-digit mobile" maxlength="10">
              </div>
              <div class="form-group">
                <label class="form-label">Assigned Doctor *</label>
                <select class="form-select" id="qr_doctor">
                  <option value="">Select doctor</option>
                  ${doctors.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Chief Complaint (optional)</label>
                <input type="text" class="form-input" id="qr_complaint" placeholder="Reason for visit">
              </div>
            </div>
            <div style="margin-top:16px; padding:10px 14px; background:var(--accent-teal-light); border-radius:8px; font-size:0.72rem; color:var(--text-secondary);">
              &#x26A1; Quick register issues a token immediately. Full profile can be completed later.
            </div>
            <div style="display:flex; gap:10px; margin-top:20px;">
              <button class="btn btn-teal btn-lg" id="qrSubmitBtn" style="flex:1;">&#x2713; Register &amp; Issue Token</button>
              <button class="btn btn-ghost" onclick="navigate('/receptionist')">Cancel</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
  container.querySelector('#modeFullBtn2')?.addEventListener('click', () => {
    wizardState.mode = 'full'; renderWizard(container);
  });
  container.querySelector('#qrSubmitBtn')?.addEventListener('click', () => {
    const name = container.querySelector('#qr_name')?.value?.trim();
    const phone = container.querySelector('#qr_phone')?.value?.trim();
    const doctorId = container.querySelector('#qr_doctor')?.value;
    const complaint = container.querySelector('#qr_complaint')?.value?.trim();
    if (!name || !phone || !doctorId) { showToast('Name, phone and doctor are required', 'error'); return; }
    const doc = doctors.find(d => d.id === doctorId);
    const tokenNum = Math.floor(Math.random() * 10) + 5;
    container.querySelector('.page-body').innerHTML = `
      <div class="card animate-scale-in" style="max-width:460px; margin:0 auto; text-align:center; border-left:4px solid var(--status-success);">
        <div style="font-size:2.5rem; margin-bottom:12px;">&#x1F389;</div>
        <h2 style="color:var(--status-success); margin-bottom:16px;">Registered!</h2>
        <div style="background:var(--bg-subtle); border-radius:12px; padding:20px; margin-bottom:20px; border:1px dashed var(--border);">
          <div style="width:60px; height:60px; border-radius:50%; background:var(--accent-teal); color:#fff; font-size:1.5rem; font-weight:800; display:flex; align-items:center; justify-content:center; margin:0 auto 12px;">${tokenNum}</div>
          <div style="font-size:1.1rem; font-weight:700;">${name}</div>
          <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:4px;">${doc?.name}</div>
          ${complaint ? '<div style="font-size:0.75rem; margin-top:8px; padding:6px 10px; background:var(--bg-surface); border-radius:6px;">' + complaint + '</div>' : ''}
        </div>
        <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:8px;">
          <button class="btn btn-teal" onclick="navigate('/receptionist/appointments/new')">&#x1F4C5; Book Appointment</button>
          <button class="btn btn-teal-outline" onclick="navigate('/receptionist/patients/new')">&#x2795; Register Another</button>
          <button class="btn btn-ghost" onclick="navigate('/receptionist')">Back to Queue</button>
        </div>
      </div>`;
    showToast(name + ' registered &#8212; Token #' + tokenNum);
  });
}

function renderStep(step, data) {
  switch (step) {
    case 1: return `
      <h3 style="margin-bottom: var(--space-lg);">Identity & Assignment</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg);">
        <div class="form-group">
          <label class="form-label">Phone Number *</label>
          <input type="tel" class="form-input" id="f_phone" value="${data.phone}" placeholder="+91 98765 43210" maxlength="10">
          <div class="form-hint">10-digit Indian mobile number</div>
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-input" id="f_email" value="${data.email}" placeholder="patient@email.com">
        </div>
        <div class="form-group">
          <label class="form-label">Full Name *</label>
          <input type="text" class="form-input" id="f_name" value="${data.name}" placeholder="Full name">
        </div>
        <div class="form-group">
          <label class="form-label">Assigned Doctor *</label>
          <select class="form-select" id="f_doctor_id">
            <option value="">Select doctor</option>
            ${doctors.map(d => `<option value="${d.id}" ${data.doctor_id === d.id ? 'selected' : ''}>${d.name} — ${d.specialty}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Date of Birth</label>
          <input type="date" class="form-input" id="f_dob" value="${data.dob}">
        </div>
        <div class="form-group">
          <label class="form-label">Blood Group</label>
          <select class="form-select" id="f_blood_group">
            <option value="">Select</option>
            ${['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => `<option value="${bg}" ${data.blood_group === bg ? 'selected' : ''}>${bg}</option>`).join('')}
          </select>
        </div>
        <div class="form-group" style="grid-column: span 2;">
          <label class="form-label">Allergies</label>
          <input type="text" class="form-input" id="f_allergies" value="${data.allergies}" placeholder="e.g. Penicillin, Sulfa drugs">
          ${data.allergies ? '<div class="form-hint" style="color: var(--status-warning);">⚠️ Allergy information will be highlighted on patient profile</div>' : ''}
        </div>
        <div class="form-group" style="grid-column: span 2;">
          <label class="form-label">Address</label>
          <textarea class="form-textarea" id="f_address" style="min-height: 60px;" placeholder="Full address">${data.address}</textarea>
        </div>
      </div>
    `;

    case 2: return `
      <h3 style="margin-bottom: var(--space-lg);">Gynecological History — Menstrual</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg);">
        <div class="form-group">
          <label class="form-label">Last Menstrual Period (LMP)</label>
          <input type="date" class="form-input" id="f_lmp" value="${data.lmp}">
          <div class="form-hint" id="lmpWeeks"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Cycle Length (days)</label>
          <input type="number" class="form-input" id="f_cycle_length" value="${data.cycle_length}" min="20" max="45">
          <div class="form-hint">Typical: 28 days</div>
        </div>
        <div class="form-group">
          <label class="form-label">Cycle Duration (days)</label>
          <input type="number" class="form-input" id="f_cycle_duration" value="${data.cycle_duration}" min="1" max="10">
          <div class="form-hint">How many days of bleeding</div>
        </div>
        <div class="form-group">
          <label class="form-label">Regularity</label>
          <select class="form-select" id="f_regularity">
            <option value="regular" ${data.regularity === 'regular' ? 'selected' : ''}>Regular</option>
            <option value="irregular" ${data.regularity === 'irregular' ? 'selected' : ''}>Irregular</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Dysmenorrhoea</label>
          <select class="form-select" id="f_dysmenorrhoea">
            <option value="none" ${data.dysmenorrhoea === 'none' ? 'selected' : ''}>None</option>
            <option value="mild" ${data.dysmenorrhoea === 'mild' ? 'selected' : ''}>Mild</option>
            <option value="moderate" ${data.dysmenorrhoea === 'moderate' ? 'selected' : ''}>Moderate</option>
            <option value="severe" ${data.dysmenorrhoea === 'severe' ? 'selected' : ''}>Severe</option>
          </select>
        </div>
      </div>
    `;

    case 3: return `
      <h3 style="margin-bottom: var(--space-lg);">Obstetric History (GPALM)</h3>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-xl); margin-bottom: var(--space-xl);">
        ${gpalmStepper('Gravida (G)', 'f_gravida', data.gravida)}
        ${gpalmStepper('Para (P)', 'f_para', data.para)}
        ${gpalmStepper('Abortions (A)', 'f_abortions', data.abortions)}
        ${gpalmStepper('Living (L)', 'f_living', data.living)}
      </div>
      <div style="text-align: center; padding: var(--space-lg); background: var(--bg-subtle); border-radius: var(--radius-lg);">
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: var(--space-sm); text-transform: uppercase; letter-spacing: 1px;">Live Preview</div>
        <div id="gpalmPreview" style="font-size: 1.5rem;">
          ${gpalmBadge(data.gravida, data.para, data.abortions, data.living)}
        </div>
      </div>
    `;

    case 4: return `
      <h3 style="margin-bottom: var(--space-lg);">Pregnancy History</h3>
      <div id="pregnancyList">
        ${data.pregnancies.length === 0 ? `
          <div style="text-align: center; padding: var(--space-xl); color: var(--text-muted);">
            No previous pregnancies recorded
          </div>
        ` : data.pregnancies.map((p, i) => pregnancyRow(p, i)).join('')}
      </div>
      <button class="btn btn-coral-outline" style="margin-top: var(--space-md);" id="addPregnancyBtn">➕ Add pregnancy</button>
    `;

    case 5: return `
      <h3 style="margin-bottom: var(--space-lg);">Contraception & Surgical History</h3>
      <div class="form-group">
        <label class="form-label">Current Contraception Method</label>
        <select class="form-select" id="f_contraception" style="max-width: 400px;">
          ${['none', 'oral_pills', 'iud', 'condom', 'other'].map(c =>
            `<option value="${c}" ${data.contraception === c ? 'selected' : ''}>${c.replace('_', ' ')}</option>`
          ).join('')}
        </select>
      </div>
      <div style="margin-top: var(--space-xl);">
        <label class="form-label">Surgical History</label>
        <div id="surgeryList">
          ${data.surgical_history.length === 0 ? `
            <div style="padding: var(--space-lg); color: var(--text-muted); text-align: center;">No surgical history recorded</div>
          ` : data.surgical_history.map((s, i) => `
            <div style="display: grid; grid-template-columns: 2fr 1fr 2fr auto; gap: var(--space-md); padding: var(--space-md); border-bottom: 1px solid var(--border-light); align-items: center;">
              <input class="form-input" value="${s.procedure}" placeholder="Procedure name">
              <input class="form-input" value="${s.year}" placeholder="Year" type="number">
              <input class="form-input" value="${s.notes}" placeholder="Notes">
              <button style="color: var(--status-danger); font-size: 1.1rem; cursor: pointer;">✕</button>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-coral-outline btn-sm" style="margin-top: var(--space-md);" id="addSurgeryBtn">➕ Add surgical record</button>
      </div>
    `;

    case 6: return `
      <h3 style="margin-bottom: var(--space-lg);">Review & Submit</h3>
      <div style="display: grid; gap: var(--space-lg);">
        ${reviewSection('Identity', [
          ['Name', data.name || '—'],
          ['Phone', data.phone || '—'],
          ['Doctor', doctors.find(d => d.id === data.doctor_id)?.name || '—'],
          ['DOB', data.dob || '—'],
          ['Blood Group', data.blood_group || '—'],
          ['Allergies', data.allergies || 'None'],
        ])}
        ${reviewSection('Menstrual History', [
          ['LMP', data.lmp || '—'],
          ['Cycle', `${data.cycle_length}d / ${data.cycle_duration}d`],
          ['Regularity', data.regularity],
          ['Dysmenorrhoea', data.dysmenorrhoea],
        ])}
        ${reviewSection('Obstetric', [
          ['GPALM', `G${data.gravida} P${data.para} A${data.abortions} L${data.living}`],
          ['Pregnancies', `${data.pregnancies.length} recorded`],
        ])}
        ${reviewSection('Other', [
          ['Contraception', data.contraception.replace('_', ' ')],
          ['Surgical History', `${data.surgical_history.length} recorded`],
        ])}
      </div>
    `;
  }
}

function gpalmStepper(label, id, value) {
  return `
    <div style="text-align: center;">
      <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); margin-bottom: var(--space-sm); text-transform: uppercase;">${label}</div>
      <div style="display: flex; align-items: center; justify-content: center; gap: var(--space-sm);">
        <button class="btn btn-ghost" style="width: 36px; height: 36px; padding: 0; border-radius: 50%; font-size: 1.1rem;" onclick="document.getElementById('${id}').stepDown(); document.getElementById('${id}').dispatchEvent(new Event('input'));">−</button>
        <input type="number" class="form-input gpalm-input" id="${id}" value="${value}" min="0" max="20"
          style="width: 56px; text-align: center; font-size: 1.3rem; font-weight: 700; padding: 8px;">
        <button class="btn btn-ghost" style="width: 36px; height: 36px; padding: 0; border-radius: 50%; font-size: 1.1rem;" onclick="document.getElementById('${id}').stepUp(); document.getElementById('${id}').dispatchEvent(new Event('input'));">+</button>
      </div>
    </div>
  `;
}

function pregnancyRow(p, idx) {
  return `
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr auto; gap: var(--space-sm); padding: var(--space-md); border-bottom: 1px solid var(--border-light); align-items: center; font-size: 0.85rem;">
      <input class="form-input" value="${p.year}" placeholder="Year" type="number" style="padding: 6px 8px;">
      <select class="form-select" style="padding: 6px 8px;">
        ${['spontaneous', 'induced', 'ectopic'].map(t => `<option ${p.type === t ? 'selected' : ''}>${t}</option>`).join('')}
      </select>
      <select class="form-select" style="padding: 6px 8px;">
        ${['live_birth', 'stillbirth', 'miscarriage'].map(o => `<option ${p.outcome === o ? 'selected' : ''}>${o.replace('_', ' ')}</option>`).join('')}
      </select>
      <input class="form-input" value="${p.gestation}" placeholder="Gestation" style="padding: 6px 8px;">
      <select class="form-select" style="padding: 6px 8px;">
        ${['vaginal', 'c-section', '-'].map(m => `<option ${p.mode === m ? 'selected' : ''}>${m}</option>`).join('')}
      </select>
      <input class="form-input" value="${p.complications}" placeholder="Complications" style="padding: 6px 8px;">
      <button style="color: var(--status-danger); cursor: pointer; font-size: 1.1rem;">✕</button>
    </div>
  `;
}

function reviewSection(title, rows) {
  return `
    <div style="background: var(--bg-subtle); border-radius: var(--radius-md); padding: var(--space-lg);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
        <h4 style="font-size: 0.85rem; color: var(--text-secondary);">${title}</h4>
        <span style="font-size: 0.75rem; color: var(--accent-coral); cursor: pointer; font-weight: 600;">Edit</span>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-sm);">
        ${rows.map(([k, v]) => `
          <div style="font-size: 0.8rem;">
            <span style="color: var(--text-muted);">${k}:</span>
            <span style="font-weight: 600; margin-left: 4px;">${v}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function saveCurrentStep(container) {
  const d = wizardState.data;
  const get = id => { const el = container.querySelector(`#${id}`); return el ? el.value : undefined; };

  if (wizardState.step === 1) {
    d.phone = get('f_phone') || d.phone;
    d.email = get('f_email') || d.email;
    d.name = get('f_name') || d.name;
    d.doctor_id = get('f_doctor_id') || d.doctor_id;
    d.dob = get('f_dob') || d.dob;
    d.blood_group = get('f_blood_group') || d.blood_group;
    d.allergies = get('f_allergies') || d.allergies;
    d.address = container.querySelector('#f_address')?.value || d.address;
  } else if (wizardState.step === 2) {
    d.lmp = get('f_lmp') || d.lmp;
    d.cycle_length = parseInt(get('f_cycle_length')) || d.cycle_length;
    d.cycle_duration = parseInt(get('f_cycle_duration')) || d.cycle_duration;
    d.regularity = get('f_regularity') || d.regularity;
    d.dysmenorrhoea = get('f_dysmenorrhoea') || d.dysmenorrhoea;
  } else if (wizardState.step === 3) {
    d.gravida = parseInt(get('f_gravida')) || 0;
    d.para = parseInt(get('f_para')) || 0;
    d.abortions = parseInt(get('f_abortions')) || 0;
    d.living = parseInt(get('f_living')) || 0;
  } else if (wizardState.step === 5) {
    d.contraception = get('f_contraception') || d.contraception;
  }
}

function setupGPALMPreview(container) {
  const inputs = container.querySelectorAll('.gpalm-input');
  const preview = container.querySelector('#gpalmPreview');
  if (!preview || inputs.length === 0) return;

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const g = parseInt(container.querySelector('#f_gravida')?.value) || 0;
      const p = parseInt(container.querySelector('#f_para')?.value) || 0;
      const a = parseInt(container.querySelector('#f_abortions')?.value) || 0;
      const l = parseInt(container.querySelector('#f_living')?.value) || 0;
      preview.innerHTML = gpalmBadge(g, p, a, l);
    });
  });
}

function setupLMPCompute(container) {
  const lmpInput = container.querySelector('#f_lmp');
  const lmpWeeks = container.querySelector('#lmpWeeks');
  if (!lmpInput || !lmpWeeks) return;

  const compute = () => {
    if (!lmpInput.value) { lmpWeeks.textContent = ''; return; }
    const weeks = Math.floor((new Date() - new Date(lmpInput.value)) / (7 * 24 * 60 * 60 * 1000));
    lmpWeeks.textContent = `Approximately ${weeks} weeks since LMP`;
    lmpWeeks.style.color = 'var(--accent-coral)';
  };
  compute();
  lmpInput.addEventListener('change', compute);
}

function showRegistrationSuccess(container) {
  const tokenNum = Math.floor(Math.random() * 15) + 1;
  const d = wizardState.data;
  const doc = doctors.find(dr => dr.id === d.doctor_id);

  container.querySelector('.page-body').innerHTML = `
    <div class="card animate-scale-in" style="max-width: 600px; margin: var(--space-2xl) auto; text-align: center; border-left: 4px solid var(--status-success);">
      <div style="font-size: 3rem; margin-bottom: var(--space-md);">🎉</div>
      <h2 style="color: var(--status-success); margin-bottom: var(--space-md);">Patient Registered Successfully</h2>
      <div style="background: var(--bg-subtle); border-radius: var(--radius-lg); padding: var(--space-xl); margin-bottom: var(--space-xl);">
        <div class="token-badge waiting" style="width: 72px; height: 72px; font-size: 1.8rem; margin: 0 auto var(--space-md);">${tokenNum}</div>
        <div style="font-size: 1.1rem; font-weight: 600;">${d.name || 'New Patient'}</div>
        <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 4px;">${doc?.name || 'Doctor'}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Token #${tokenNum} · ${new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
      </div>
      <div style="display: flex; justify-content: center; gap: var(--space-md);">
        <button class="btn btn-coral" onclick="navigate('/receptionist/appointments/new')">📅 Book appointment now</button>
        <button class="btn btn-coral-outline" onclick="navigate('/receptionist/patients/new')">➕ Register another</button>
      </div>
    </div>
  `;

  showToast('Patient registered successfully!');
}
