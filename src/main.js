// ================================================================
// MAIN — App Shell, Router, Portal Switcher
// ================================================================
import './styles/design-system.css';
import './styles/components.css';
import { renderDoctorDashboard } from './doctor/dashboard.js';
import { renderConsultation } from './doctor/consultation.js';
import { renderDoctorPatients } from './doctor/patients.js';
import { renderDoctorPrescriptions } from './doctor/prescriptions.js';
import { renderPatientHistory } from './doctor/history.js';
import { renderDoctorCalendar } from './doctor/calendar.js';
import { renderReceptionistDashboard } from './receptionist/dashboard.js';
import { renderReceptionistPatients } from './receptionist/patients.js';
import { renderPatientRegister } from './receptionist/register.js';
import { renderPatientProfile } from './receptionist/patient-profile.js';
import { renderBookAppointment } from './receptionist/book-appointment.js';
import { renderAppointmentsQueue } from './receptionist/appointments.js';

// ---- Simple Hash Router ----
function getRoute() {
  return window.location.hash.slice(1) || '/';
}

function navigate(path) {
  window.location.hash = path;
}

// Make navigate globally available
window.navigate = navigate;

function router() {
  const route = getRoute();
  const app = document.getElementById('app');

  // Landing page
  if (route === '/') {
    renderLanding(app);
    return;
  }

  // Doctor portal routes
  if (route === '/doctor' || route === '/doctor/') {
    renderDoctorDashboard(app);
  } else if (route.startsWith('/doctor/consult/')) {
    const apptId = route.split('/doctor/consult/')[1];
    renderConsultation(app, apptId);
  } else if (route === '/doctor/calendar') {
    renderDoctorCalendar(app);
  } else if (route === '/doctor/patients') {
    renderDoctorPatients(app);
  } else if (route === '/doctor/prescriptions') {
    renderDoctorPrescriptions(app);
  } else if (route.startsWith('/doctor/history/')) {
    const patientId = route.split('/doctor/history/')[1];
    renderPatientHistory(app, patientId);
  }
  // Receptionist portal routes
  else if (route === '/receptionist' || route === '/receptionist/') {
    renderReceptionistDashboard(app);
  } else if (route === '/receptionist/patients') {
    renderReceptionistPatients(app);
  } else if (route === '/receptionist/patients/new') {
    renderPatientRegister(app);
  } else if (route.startsWith('/receptionist/patients/')) {
    const patientId = route.split('/receptionist/patients/')[1];
    renderPatientProfile(app, patientId);
  } else if (route === '/receptionist/appointments/new') {
    renderBookAppointment(app);
  } else if (route === '/receptionist/appointments') {
    renderAppointmentsQueue(app);
  }
  // Fallback
  else {
    renderLanding(app);
  }
}

// ---- Landing Page ----
function renderLanding(container) {
  container.innerHTML = `
    <div class="landing-page">
      <div class="landing-logo animate-fade-in-up">Shiflyn</div>
      <p class="landing-tagline animate-fade-in-up" style="animation-delay: 100ms">
        Professional Clinic Management — Choose your portal
      </p>
      <div class="portal-cards stagger-children">
        <div class="portal-card doctor-card" onclick="navigate('/doctor')">
          <div class="portal-card-icon">🩺</div>
          <div class="portal-card-title">Doctor Portal</div>
          <p class="portal-card-desc">
            Manage your daily queue, consult patients, write SOAP notes, prescribe with AI assistance, and track follow-ups.
          </p>
          <div class="portal-card-enter">Enter as Dr. Anita Mehta →</div>
        </div>
        <div class="portal-card receptionist-card" onclick="navigate('/receptionist')">
          <div class="portal-card-icon">🏥</div>
          <div class="portal-card-title">Receptionist Portal</div>
          <p class="portal-card-desc">
            Register patients, manage appointments, maintain the daily queue, upload lab reports, and handle front-desk operations.
          </p>
          <div class="portal-card-enter">Enter as Ritu (Reception) →</div>
        </div>
      </div>
      <p style="margin-top: 48px; font-size: 0.75rem; color: var(--text-muted);">
        ✦ UI Preview Mode — All data is simulated for design review
      </p>
    </div>
  `;
}

// ---- Init ----
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('sidebar-expanded') === 'true') {
    document.body.classList.add('sidebar-expanded');
  }
  router();
});

document.addEventListener('click', e => {
  const toggle = e.target.closest('.sidebar-toggle');
  if (toggle) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-expanded');
    const isExpanded = document.body.classList.contains('sidebar-expanded');
    localStorage.setItem('sidebar-expanded', isExpanded ? 'true' : 'false');
  }
});

router();
