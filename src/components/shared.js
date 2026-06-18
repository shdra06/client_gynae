// ================================================================
// Shared UI Helpers — ClinicFlow OB/GYN
// ================================================================

export function statusChip(status) {
  const labels = {
    waiting: 'Waiting', in_progress: 'Consulting', consulting: 'Consulting',
    active: 'Active', completed: 'Completed', checked_in: 'Checked-in',
    scheduled: 'Scheduled', cancelled: 'Cancelled', draft: 'Draft',
    approved: 'Approved', printed: 'Printed'
  };
  return '<span class="status-chip ' + status.replace(' ', '_') + '">' + (labels[status] || status) + '</span>';
}

export function tokenBadge(number, status) {
  return '<div class="token-badge ' + status + '">#' + number + '</div>';
}

export function gpalmBadge(g, p, a, l) {
  return '<span class="gpalm-badge">G' + g + ' P' + p + ' A' + a + ' L' + l + '</span>';
}

export function allergyBanner(allergies) {
  if (!allergies) return '';
  return '<div class="allergy-banner">⚠️ Allergies: ' + allergies + '</div>';
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
}

export function weeksAgo(dateStr) {
  if (!dateStr) return '';
  return Math.floor((new Date() - new Date(dateStr)) / (7 * 24 * 60 * 60 * 1000)) + 'w ago';
}

export function relativeTime(dateStr) {
  if (!dateStr) return '';
  const diff = Math.floor((new Date() - new Date(dateStr)) / 60000);
  if (diff < 1) return 'just now';
  if (diff < 60) return diff + 'm ago';
  if (diff < 1440) return Math.floor(diff / 60) + 'h ago';
  return formatDate(dateStr);
}

// ── SIDEBAR ──
// Doctor sidebar — slim icon bar used by dashboard, calendar, etc.
export function doctorSidebar(activeRoute, activeApptId, theme) {
  const nav_items = [
    { path: '/doctor',               label: 'Dashboard',      svg: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>', active: activeRoute === '/doctor' },
    { path: '/doctor/calendar',      label: 'Calendar',       svg: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>', active: activeRoute === '/doctor/calendar' },
    { path: '/doctor/patients',      label: 'Patients',       svg: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', active: activeRoute === '/doctor/patients' },
    { path: '/doctor/prescriptions', label: 'Prescriptions',  svg: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>', active: activeRoute === '/doctor/prescriptions' },
  ];

  if (activeApptId || activeRoute.startsWith('/doctor/consult')) {
    nav_items.push({
      path: '/doctor/consult/' + (activeApptId || 'A002'),
      label: 'Active Consult',
      svg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
      active: true,
      badge: true
    });
  }

  const links_html = nav_items.map(function(item) {
    const cls = item.active ? 'sidebar-link active' : 'sidebar-link';
    const badge_html = item.badge ? '<span class="sidebar-badge" style="position:absolute;top:4px;right:4px;width:7px;height:7px;background:#22C55E;border-radius:50%;border:1.5px solid #F8FAFF;"></span>' : '';
    return '<a href="#' + item.path + '" class="' + cls + '" title="' + item.label + '">'
      + '<span class="sidebar-link-icon">'
      + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
      + item.svg
      + '</svg>'
      + '</span>'
      + '<span class="sidebar-link-text sidebar-show-text" style="margin-left:10px; font-size:0.75rem; font-weight:600; white-space:nowrap;">' + item.label + '</span>'
      + badge_html
      + '</a>';
  }).join('');

  const switch_icon_svg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 8 16 13"/><line x1="21" y1="8" x2="9" y2="8"/><polyline points="8 21 3 16 8 11"/><line x1="3" y1="16" x2="15" y2="16"/></svg>';
  const settings_icon_svg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
  const help_icon_svg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';

  const sidebarClass = theme === 'light' ? 'sidebar sidebar-light' : 'sidebar';

  return '<nav class="' + sidebarClass + '">'
    + '<div class="sidebar-brand" style="width:100%; display:flex; align-items:center; padding:10px 12px 12px; border-bottom:1px solid #E4E9F2; margin-bottom:6px; box-sizing:border-box;">'
    + '<div class="sidebar-logo">S</div>'
    + '<span class="sidebar-brand-name sidebar-show-text" style="font-weight:800; font-size:0.82rem; color:#1B2B45; margin-left:8px; white-space:nowrap;">ClinicFlow</span>'
    + '<button class="sidebar-toggle" style="background:none; border:none; cursor:pointer; padding:4px; display:flex; align-items:center; justify-content:center; margin-left:auto;">'
    + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition:transform 0.2s;"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>'
    + '</button>'
    + '</div>'
    + '<div class="sidebar-nav">' + links_html + '</div>'
    + '<div style="display:flex;flex-direction:column;align-items:stretch;gap:3px;padding:0 6px 6px;">'
    + '<a href="#/" class="sidebar-link" title="Switch Portal">'
    + '<span class="sidebar-link-icon">' + switch_icon_svg + '</span>'
    + '<span class="sidebar-link-text sidebar-show-text" style="margin-left:10px; font-size:0.75rem; font-weight:600; white-space:nowrap;">Switch Portal</span>'
    + '</a>'
    + '<div class="sidebar-link" title="Settings" style="cursor:default;">'
    + '<span class="sidebar-link-icon">' + settings_icon_svg + '</span>'
    + '<span class="sidebar-link-text sidebar-show-text" style="margin-left:10px; font-size:0.75rem; font-weight:600; white-space:nowrap;">Settings</span>'
    + '</div>'
    + '<div class="sidebar-link" title="Help" style="cursor:default;">'
    + '<span class="sidebar-link-icon">' + help_icon_svg + '</span>'
    + '<span class="sidebar-link-text sidebar-show-text" style="margin-left:10px; font-size:0.75rem; font-weight:600; white-space:nowrap;">Help</span>'
    + '</div>'
    + '</div>'
    + '<div class="sidebar-footer" style="width:100%; display:flex; align-items:center; padding:10px 12px; border-top:1px solid #E4E9F2; box-sizing:border-box;">'
    + '<div class="sidebar-avatar" title="Dr. Anita Mehta">AM</div>'
    + '<span class="sidebar-avatar-name sidebar-show-text" style="font-size:0.7rem; font-weight:700; color:#1B2B45; margin-left:8px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Dr. Anita Mehta</span>'
    + '</div>'
    + '</nav>';
}

// Receptionist sidebar
export function receptionistSidebar(activeRoute) {
  const nav_items = [
    { path: '/receptionist',                  label: 'Dashboard',        svg: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>', active: activeRoute === '/receptionist' },
    { path: '/receptionist/patients',         label: 'Patients',         svg: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', active: activeRoute === '/receptionist/patients' },
    { path: '/receptionist/appointments',     label: 'Appointments',     svg: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>', active: activeRoute === '/receptionist/appointments' },
    { path: '/receptionist/patients/new',     label: 'Register Patient', svg: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/>', active: activeRoute === '/receptionist/patients/new' },
    { path: '/receptionist/appointments/new', label: 'Book Appointment', svg: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/>', active: activeRoute === '/receptionist/appointments/new' },
  ];

  const links_html = nav_items.map(function(item) {
    const cls = item.active ? 'sidebar-link active' : 'sidebar-link';
    return '<a href="#' + item.path + '" class="' + cls + '" title="' + item.label + '">'
      + '<span class="sidebar-link-icon">'
      + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
      + item.svg
      + '</svg>'
      + '</span>'
      + '<span class="sidebar-link-text sidebar-show-text" style="margin-left:10px; font-size:0.75rem; font-weight:600; white-space:nowrap;">' + item.label + '</span>'
      + '</a>';
  }).join('');

  const switch_icon_svg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 8 16 13"/><line x1="21" y1="8" x2="9" y2="8"/><polyline points="8 21 3 16 8 11"/><line x1="3" y1="16" x2="15" y2="16"/></svg>';
  const settings_icon_svg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';

  return '<nav class="sidebar">'
    + '<div class="sidebar-brand" style="width:100%; display:flex; align-items:center; padding:10px 12px 12px; border-bottom:1px solid #E4E9F2; margin-bottom:6px; box-sizing:border-box;">'
    + '<div class="sidebar-logo">S</div>'
    + '<span class="sidebar-brand-name sidebar-show-text" style="font-weight:800; font-size:0.82rem; color:#1B2B45; margin-left:8px; white-space:nowrap;">ClinicFlow</span>'
    + '<button class="sidebar-toggle" style="background:none; border:none; cursor:pointer; padding:4px; display:flex; align-items:center; justify-content:center; margin-left:auto;">'
    + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition:transform 0.2s;"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>'
    + '</button>'
    + '</div>'
    + '<div class="sidebar-nav">' + links_html + '</div>'
    + '<div style="display:flex;flex-direction:column;align-items:stretch;gap:3px;padding:0 6px 6px;">'
    + '<a href="#/" class="sidebar-link" title="Switch Portal">'
    + '<span class="sidebar-link-icon">' + switch_icon_svg + '</span>'
    + '<span class="sidebar-link-text sidebar-show-text" style="margin-left:10px; font-size:0.75rem; font-weight:600; white-space:nowrap;">Switch Portal</span>'
    + '</a>'
    + '<div class="sidebar-link" title="Settings" style="cursor:default;">'
    + '<span class="sidebar-link-icon">' + settings_icon_svg + '</span>'
    + '<span class="sidebar-link-text sidebar-show-text" style="margin-left:10px; font-size:0.75rem; font-weight:600; white-space:nowrap;">Settings</span>'
    + '</div>'
    + '</div>'
    + '<div class="sidebar-footer" style="width:100%; display:flex; align-items:center; padding:10px 12px; border-top:1px solid #E4E9F2; box-sizing:border-box;">'
    + '<div class="sidebar-avatar" title="Ritu Patel">RP</div>'
    + '<span class="sidebar-avatar-name sidebar-show-text" style="font-size:0.7rem; font-weight:700; color:#1B2B45; margin-left:8px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Ritu Patel</span>'
    + '</div>'
    + '</nav>';
}

export function showToast(message, type) {
  type = type || 'success';
  var existing = document.querySelector('.toast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.innerHTML = '<span style="font-size:0.9rem;">' + (type === 'success' ? '✓' : '✕') + '</span>'
    + '<span>' + message + '</span>';
  document.body.appendChild(toast);
  setTimeout(function() { toast.remove(); }, 3000);
}
