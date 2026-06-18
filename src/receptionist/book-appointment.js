// ================================================================
// RECEPTIONIST PORTAL — Book Appointment (Overhauled)
// ================================================================
import { doctors, todayAppointments } from '../data/appointments.js';
import { patients } from '../data/patients.js';
import { receptionistSidebar, showToast } from '../components/shared.js';

const SLOTS = [];
for (let h = 8; h <= 15; h++) {
  SLOTS.push(`${String(h).padStart(2,'0')}:00`);
  SLOTS.push(`${String(h).padStart(2,'0')}:30`);
}
SLOTS.push('16:00');

let bookState = {
  step: 1,
  patientId: null,
  patientName: '',
  patientPhone: '',
  doctorId: '',
  date: new Date().toISOString().split('T')[0],
  timeSlot: '',
  complaint: '',
  visitType: 'new',
  isQuickRegister: false
};

export function renderBookAppointment(container) {
  bookState = {
    step: 1, patientId: null, patientName: '', patientPhone: '',
    doctorId: '', date: new Date().toISOString().split('T')[0],
    timeSlot: '', complaint: '', visitType: 'new', isQuickRegister: false
  };
  renderBookStep(container);
}

function renderBookStep(container) {
  const s = bookState;
  const stepLabels = ['Patient', 'Doctor & Date', 'Time Slot', 'Complaint'];
  const stepIcons = ['👤','👩‍⚕️','🕐','📝'];

  container.innerHTML = `
    <div class="app-shell portal-receptionist">
      ${receptionistSidebar('/receptionist/appointments/new')}
      <main class="main-content" style="margin-left:48px;">
        <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 24px; border-bottom:1px solid var(--border-light); background:var(--bg-surface);">
          <div>
            <div style="font-size:1rem; font-weight:700;">Book Appointment</div>
            <div style="font-size:0.72rem; color:var(--text-muted);">Step ${s.step} of 4 — ${stepLabels[s.step-1]}</div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="navigate('/receptionist')">← Back</button>
        </div>

        <!-- Step Progress -->
        <div style="padding:16px 24px 0; background:var(--bg-surface); border-bottom:1px solid var(--border-light);">
          <div style="display:flex; gap:0; max-width:700px;">
            ${stepLabels.map((label, i) => {
              const num = i + 1;
              const done = num < s.step;
              const active = num === s.step;
              return `
              <div style="flex:1; display:flex; align-items:center;">
                <div style="display:flex; flex-direction:column; align-items:center; gap:4px; flex:1;">
                  <div style="width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:${done ? '0.7rem' : '0.85rem'}; font-weight:700;
                    background:${done ? 'var(--status-success)' : active ? 'var(--accent-coral)' : 'var(--bg-subtle)'};
                    color:${done || active ? '#fff' : 'var(--text-muted)'};
                    border:2px solid ${done ? 'var(--status-success)' : active ? 'var(--accent-coral)' : 'var(--border)'};">
                    ${done ? '✓' : stepIcons[i]}
                  </div>
                  <div style="font-size:0.62rem; font-weight:${active ? '700' : '400'}; color:${active ? 'var(--accent-coral)' : done ? 'var(--status-success)' : 'var(--text-muted)'};">${label}</div>
                </div>
                ${num < 4 ? `<div style="height:2px; width:100%; background:${done ? 'var(--status-success)' : 'var(--border-light)'}; margin-bottom:18px;"></div>` : ''}
              </div>`;
            }).join('')}
          </div>
        </div>

        <div class="page-body" style="padding-top:20px;">
          <div class="card animate-fade-in-up" style="max-width:700px;">
            ${renderStepContent(s)}
          </div>
          <!-- Navigation -->
          <div style="display:flex; justify-content:space-between; margin-top:16px; max-width:700px;">
            ${s.step > 1 ? `<button class="btn btn-ghost" id="prevBtn">← Previous</button>` : '<div></div>'}
            ${s.step < 4
              ? `<button class="btn btn-coral" id="nextBtn" style="padding:8px 24px;">Next →</button>`
              : `<button class="btn btn-coral btn-lg" id="submitBtn">📅 Confirm Booking</button>`}
          </div>
        </div>
      </main>
    </div>
  `;

  wireUpStep(container);
}

function renderStepContent(s) {
  switch (s.step) {

    case 1: return `
      <h3 style="margin-bottom:16px; font-size:1rem;">Select or Register Patient</h3>

      <!-- Mode Toggle -->
      <div style="display:flex; background:var(--bg-subtle); border-radius:8px; padding:3px; gap:3px; margin-bottom:20px; width:fit-content;">
        <button id="modeExisting" style="padding:6px 16px; border-radius:6px; border:none; cursor:pointer; font-size:0.78rem; font-weight:600; transition:all 0.15s;
          background:${!s.isQuickRegister ? 'var(--bg-surface)' : 'none'};
          color:${!s.isQuickRegister ? 'var(--text-primary)' : 'var(--text-muted)'};
          box-shadow:${!s.isQuickRegister ? 'var(--shadow-sm)' : 'none'};">
          🔍 Existing Patient
        </button>
        <button id="modeQuick" style="padding:6px 16px; border-radius:6px; border:none; cursor:pointer; font-size:0.78rem; font-weight:600; transition:all 0.15s;
          background:${s.isQuickRegister ? 'var(--bg-surface)' : 'none'};
          color:${s.isQuickRegister ? 'var(--text-primary)' : 'var(--text-muted)'};
          box-shadow:${s.isQuickRegister ? 'var(--shadow-sm)' : 'none'};">
          ⚡ Quick Register Walk-in
        </button>
      </div>

      ${!s.isQuickRegister ? `
        <!-- Existing patient search -->
        <div class="form-group">
          <label class="form-label">Search patient by name or phone</label>
          <div style="position:relative;">
            <input type="text" class="form-input" id="patientSearchInput" placeholder="Type to search..." autocomplete="off" value="${s.patientName}">
            <div id="patientDropdown" style="position:absolute; top:100%; left:0; right:0; z-index:10; display:none;"></div>
          </div>
        </div>
        ${s.patientId ? `
          <div style="display:flex; align-items:center; gap:10px; padding:10px 14px; background:var(--accent-teal-light); border:1px solid rgba(15,139,141,0.3); border-radius:8px; margin-top:8px;">
            <span style="font-size:1rem;">✓</span>
            <div>
              <div style="font-weight:700; font-size:0.85rem;">${s.patientName}</div>
              <div style="font-size:0.72rem; color:var(--text-muted);">${s.patientPhone}</div>
            </div>
          </div>` : ''}
      ` : `
        <!-- Quick register -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <div class="form-group" style="grid-column:span 2;">
            <label class="form-label">Full Name *</label>
            <input type="text" class="form-input" id="qrName" placeholder="Patient full name" value="${s.patientName}">
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number *</label>
            <input type="tel" class="form-input" id="qrPhone" placeholder="10-digit mobile" value="${s.patientPhone}">
          </div>
          <div class="form-group">
            <label class="form-label">Age</label>
            <input type="text" class="form-input" id="qrAge" placeholder="e.g. 32F">
          </div>
        </div>
        <div style="margin-top:8px; padding:8px 12px; background:var(--bg-subtle); border-radius:6px; font-size:0.72rem; color:var(--text-muted);">
          ⚡ Quick register creates a minimal patient record. Full profile can be completed later.
        </div>
      `}
    `;

    case 2: return `
      <h3 style="margin-bottom:16px; font-size:1rem;">Select Doctor &amp; Date</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div class="form-group">
          <label class="form-label">Doctor *</label>
          <select class="form-select" id="doctorSelect">
            <option value="">Select doctor</option>
            ${doctors.map(d => `<option value="${d.id}" ${s.doctorId === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
          </select>
          ${s.doctorId ? `<div class="form-hint" style="color:var(--accent-teal);">✓ ${doctors.find(d=>d.id===s.doctorId)?.specialty}</div>` : ''}
        </div>
        <div class="form-group">
          <label class="form-label">Date *</label>
          <input type="date" class="form-input" id="apptDate" value="${s.date}" min="${new Date().toISOString().split('T')[0]}">
        </div>
      </div>
      ${s.doctorId && s.date ? `
        <div style="margin-top:12px; padding:10px 14px; background:var(--bg-subtle); border-radius:8px; font-size:0.78rem; color:var(--text-secondary);">
          📋 ${(() => {
            const today = new Date().toISOString().split('T')[0];
            const cnt = s.date === today ? todayAppointments.filter(a => a.doctor_id === s.doctorId).length : 0;
            return s.date === today
              ? `${cnt} appointments already booked for today with ${doctors.find(d=>d.id===s.doctorId)?.name.replace('Dr.','')} → Next step shows available slots`
              : `Appointments for future dates are simulated`;
          })()}
        </div>` : ''}
    `;

    case 3: {
      const today = new Date().toISOString().split('T')[0];
      const bookedSlots = s.date === today
        ? todayAppointments.filter(a => a.doctor_id === s.doctorId).map(a => a.scheduled_time)
        : ['09:00','10:30','12:00']; // simulated for future dates

      return `
        <h3 style="margin-bottom:4px; font-size:1rem;">Pick a Time Slot</h3>
        <div style="font-size:0.72rem; color:var(--text-muted); margin-bottom:16px;">
          ${doctors.find(d=>d.id===s.doctorId)?.name} · ${new Date(s.date+'T00:00:00').toLocaleDateString('en-IN',{weekday:'long',month:'long',day:'numeric'})}
        </div>
        <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:8px;">
          ${SLOTS.map(slot => {
            const booked = bookedSlots.includes(slot);
            const selected = s.timeSlot === slot;
            return `
              <button class="slot-btn" data-slot="${slot}"
                ${booked ? 'disabled' : ''}
                style="padding:10px 6px; border-radius:8px; border:1.5px solid; font-size:0.75rem; font-weight:600; cursor:${booked ? 'not-allowed' : 'pointer'}; transition:all 0.15s;
                  background:${booked ? 'var(--bg-subtle)' : selected ? 'var(--accent-teal)' : 'var(--bg-surface)'};
                  border-color:${booked ? 'var(--border-light)' : selected ? 'var(--accent-teal)' : 'var(--border)'};
                  color:${booked ? 'var(--text-muted)' : selected ? '#fff' : 'var(--text-primary)'};
                  opacity:${booked ? '0.45' : '1'};">
                ${slot}
                ${booked ? '<br><span style="font-size:0.55rem; font-weight:400;">Booked</span>' : ''}
              </button>`;
          }).join('')}
        </div>
        <div style="display:flex; gap:16px; margin-top:14px; font-size:0.65rem; color:var(--text-muted);">
          <span style="display:flex; align-items:center; gap:4px;"><span style="width:10px; height:10px; border-radius:3px; background:var(--accent-teal); display:inline-block;"></span> Selected</span>
          <span style="display:flex; align-items:center; gap:4px; opacity:0.45;"><span style="width:10px; height:10px; border-radius:3px; background:var(--bg-subtle); border:1px solid var(--border); display:inline-block;"></span> Booked</span>
          <span style="display:flex; align-items:center; gap:4px;"><span style="width:10px; height:10px; border-radius:3px; background:var(--bg-surface); border:1px solid var(--border); display:inline-block;"></span> Available</span>
        </div>
        ${s.timeSlot ? `<div style="margin-top:10px; font-size:0.78rem; color:var(--accent-teal); font-weight:600;">✓ Selected: ${s.timeSlot}</div>` : ''}
      `;
    }

    case 4: return `
      <h3 style="margin-bottom:16px; font-size:1rem;">Visit Details</h3>

      <!-- Summary banner -->
      <div style="display:flex; gap:10px; flex-wrap:wrap; padding:12px 14px; background:var(--bg-subtle); border-radius:8px; margin-bottom:20px; font-size:0.75rem; color:var(--text-secondary);">
        <span>👤 <strong>${s.patientName}</strong></span>
        <span>·</span>
        <span>👩‍⚕️ ${doctors.find(d=>d.id===s.doctorId)?.name}</span>
        <span>·</span>
        <span>🕐 ${s.timeSlot} · ${new Date(s.date+'T00:00:00').toLocaleDateString('en-IN',{month:'short',day:'numeric'})}</span>
      </div>

      <div class="form-group">
        <label class="form-label">Chief Complaint *</label>
        <textarea class="form-textarea" id="chiefComplaint" placeholder="Reason for visit — this appears on the doctor's queue..." style="min-height:80px;">${s.complaint}</textarea>
      </div>

      <div class="form-group" style="margin-top:12px;">
        <label class="form-label">Visit Type</label>
        <div style="display:flex; gap:10px; margin-top:6px;">
          ${[['new','New Patient','🆕'],['return','Return Visit','🔄'],['emergency','Emergency','🚨'],['followup','Follow-up','📋']].map(([val, label, icon]) => `
            <label style="display:flex; align-items:center; gap:6px; padding:8px 12px; border:1.5px solid ${s.visitType===val ? 'var(--accent-coral)' : 'var(--border)'}; border-radius:8px; cursor:pointer; background:${s.visitType===val ? 'var(--accent-coral-light)' : 'var(--bg-surface)'}; transition:all 0.15s;">
              <input type="radio" name="visitType" value="${val}" ${s.visitType===val ? 'checked' : ''} style="display:none;">
              <span>${icon}</span>
              <span style="font-size:0.72rem; font-weight:${s.visitType===val ? '700' : '400'};">${label}</span>
            </label>`).join('')}
        </div>
      </div>
    `;
  }
}

function wireUpStep(container) {
  const s = bookState;

  // Mode toggle (step 1)
  container.querySelector('#modeExisting')?.addEventListener('click', () => {
    bookState.isQuickRegister = false; bookState.patientId = null; bookState.patientName = ''; renderBookStep(container);
  });
  container.querySelector('#modeQuick')?.addEventListener('click', () => {
    bookState.isQuickRegister = true; bookState.patientId = null; bookState.patientName = ''; renderBookStep(container);
  });

  // Patient search (step 1 existing mode)
  const searchInput = container.querySelector('#patientSearchInput');
  const dropdown = container.querySelector('#patientDropdown');
  if (searchInput && dropdown) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      if (q.length < 2) { dropdown.style.display = 'none'; return; }
      const matches = patients.filter(p => p.name.toLowerCase().includes(q) || p.phone.includes(q)).slice(0, 6);
      if (!matches.length) { dropdown.style.display = 'none'; return; }
      dropdown.style.display = 'block';
      dropdown.innerHTML = `<div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:8px; box-shadow:var(--shadow-lg); overflow:hidden;">
        ${matches.map(p => `
          <div class="patient-option" data-id="${p.id}" data-name="${p.name}" data-phone="${p.phone}"
            style="padding:10px 14px; cursor:pointer; border-bottom:1px solid var(--border-light);"
            onmouseover="this.style.background='var(--bg-surface-hover)'" onmouseout="this.style.background=''">
            <div style="font-weight:600; font-size:0.83rem;">${p.name}</div>
            <div style="font-size:0.72rem; color:var(--text-muted);">${p.phone} · ${p.age}${p.gender} · ${p.doctor_name}</div>
          </div>`).join('')}
      </div>`;
      dropdown.querySelectorAll('.patient-option').forEach(opt => {
        opt.addEventListener('click', () => {
          const pat = patients.find(p => p.id === opt.dataset.id);
          bookState.patientId = pat.id;
          bookState.patientName = pat.name;
          bookState.patientPhone = pat.phone;
          bookState.doctorId = pat.doctor_id || '';
          renderBookStep(container);
        });
      });
    });
    document.addEventListener('click', e => {
      if (!dropdown.contains(e.target) && e.target !== searchInput) dropdown.style.display = 'none';
    });
  }

  // Time slot selection (step 3)
  container.querySelectorAll('.slot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      bookState.timeSlot = btn.dataset.slot;
      renderBookStep(container);
    });
  });

  // Visit type radio (step 4)
  container.querySelectorAll('input[name="visitType"]').forEach(radio => {
    radio.addEventListener('change', () => { bookState.visitType = radio.value; });
  });

  // Navigation
  container.querySelector('#prevBtn')?.addEventListener('click', () => {
    saveStepData(container);
    bookState.step--;
    renderBookStep(container);
  });

  container.querySelector('#nextBtn')?.addEventListener('click', () => {
    if (!validateStep(container)) return;
    saveStepData(container);
    bookState.step++;
    renderBookStep(container);
  });

  container.querySelector('#submitBtn')?.addEventListener('click', () => {
    saveStepData(container);
    const complaint = container.querySelector('#chiefComplaint')?.value || bookState.complaint;
    if (!complaint.trim()) { showToast('Please enter the chief complaint', 'error'); return; }
    bookState.complaint = complaint;
    showConfirmation(container);
  });
}

function validateStep(container) {
  const s = bookState;
  if (s.step === 1) {
    if (s.isQuickRegister) {
      const name = container.querySelector('#qrName')?.value?.trim();
      const phone = container.querySelector('#qrPhone')?.value?.trim();
      if (!name || !phone) { showToast('Name and phone are required', 'error'); return false; }
    } else {
      if (!s.patientId) { showToast('Please select a patient', 'error'); return false; }
    }
  }
  if (s.step === 2) {
    if (!s.doctorId) { showToast('Please select a doctor', 'error'); return false; }
    if (!s.date) { showToast('Please select a date', 'error'); return false; }
  }
  if (s.step === 3) {
    if (!s.timeSlot) { showToast('Please select a time slot', 'error'); return false; }
  }
  return true;
}

function saveStepData(container) {
  const s = bookState;
  if (s.step === 1 && s.isQuickRegister) {
    bookState.patientName = container.querySelector('#qrName')?.value || s.patientName;
    bookState.patientPhone = container.querySelector('#qrPhone')?.value || s.patientPhone;
  }
  if (s.step === 2) {
    bookState.doctorId = container.querySelector('#doctorSelect')?.value || s.doctorId;
    bookState.date = container.querySelector('#apptDate')?.value || s.date;
  }
  if (s.step === 4) {
    bookState.complaint = container.querySelector('#chiefComplaint')?.value || s.complaint;
    const checkedType = container.querySelector('input[name="visitType"]:checked');
    if (checkedType) bookState.visitType = checkedType.value;
  }
}

function showConfirmation(container) {
  const s = bookState;
  const doc = doctors.find(d => d.id === s.doctorId);
  const tokenNum = todayAppointments.length + 1;
  const dateLabel = new Date(s.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday:'long', month:'long', day:'numeric', year:'numeric' });

  container.querySelector('.page-body').innerHTML = `
    <div class="card animate-scale-in" style="max-width:580px; margin:0 auto; border-left:4px solid var(--status-success);">
      <div style="text-align:center; padding:8px 0 16px;">
        <div style="font-size:2.5rem; margin-bottom:10px;">✅</div>
        <h2 style="color:var(--status-success); margin-bottom:4px;">Appointment Booked!</h2>
        <div style="font-size:0.78rem; color:var(--text-muted);">${dateLabel}</div>
      </div>

      <!-- Token Slip -->
      <div style="background:var(--bg-subtle); border-radius:12px; padding:20px; text-align:center; margin-bottom:20px; border:1px dashed var(--border);">
        <div style="font-size:0.62rem; text-transform:uppercase; letter-spacing:1.5px; color:var(--text-muted); margin-bottom:10px;">Token Slip</div>
        <div style="width:64px; height:64px; border-radius:50%; background:var(--accent-coral); color:#fff; font-size:1.6rem; font-weight:800; display:flex; align-items:center; justify-content:center; margin:0 auto 12px;">${tokenNum}</div>
        <div style="font-size:1.1rem; font-weight:700; color:var(--text-primary);">${s.patientName}</div>
        <div style="font-size:0.82rem; color:var(--text-secondary); margin-top:4px;">${doc?.name} · ${s.timeSlot}</div>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:8px; padding:8px 12px; background:var(--bg-surface); border-radius:8px;">
          <strong>Chief Complaint:</strong> ${s.complaint}
        </div>
        <div style="margin-top:10px;">
          <span style="font-size:0.65rem; padding:3px 8px; border-radius:99px; background:var(--accent-teal-light); color:var(--accent-teal); font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">${s.visitType.replace('_',' ')}</span>
        </div>
      </div>

      <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:10px;">
        <button class="btn btn-coral" onclick="window.print()">🖨️ Print Token Slip</button>
        <button class="btn btn-coral-outline" onclick="navigate('/receptionist/appointments/new')">Book Another</button>
        <button class="btn btn-ghost" onclick="navigate('/receptionist')">Back to Queue</button>
      </div>
    </div>
  `;
  showToast('Appointment booked successfully!');
}
