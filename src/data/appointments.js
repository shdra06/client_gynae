// ================================================================
// DUMMY DATA — Complete clinic data with templates, tests, etc.
// ================================================================

export const doctors = [
  { id: 'D001', name: 'Dr. Anita Mehta', specialty: 'Obstetrics & Gynaecology', initials: 'AM', mci_reg: 'MCI-2008-12345' },
  { id: 'D002', name: 'Dr. Sunita Hale', specialty: 'Gynaecology & Fertility', initials: 'SH', mci_reg: 'MCI-2012-67890' }
];

export const todayAppointments = [
  {
    id: 'A001', token_number: 1, patient_id: 'P001', patient_name: 'Priya Sharma', patient_age: '34F',
    doctor_id: 'D001', doctor_name: 'Dr. Anita Mehta',
    chief_complaint: 'Lower abdominal pain for 3 days',
    todays_symptoms: 'Dull aching pain in lower abdomen, worsens in evening. No fever. Mild bloating.',
    vitals: { bp: '118/76', pulse: '74', temp: '98.4°F', weight: '62 kg' },
    status: 'waiting', is_returning: true, last_visit: '2026-03-10',
    scheduled_time: '08:45', prescription_status: null, created_at: '2026-06-14T08:30:00'
  },
  {
    id: 'A002', token_number: 2, patient_id: 'P002', patient_name: 'Meena Kulkarni', patient_age: '28F',
    doctor_id: 'D001', doctor_name: 'Dr. Anita Mehta',
    chief_complaint: 'Missed period, pregnancy test positive',
    todays_symptoms: 'Missed period ~4 weeks. Home pregnancy test positive 2 days ago. Mild morning nausea. No pain, no bleeding.',
    vitals: { bp: '110/70', pulse: '78', temp: '98.2°F', weight: '56 kg' },
    status: 'in_progress', is_returning: false, last_visit: null,
    scheduled_time: '09:15', prescription_status: 'draft', created_at: '2026-06-14T08:35:00'
  },
  {
    id: 'A003', token_number: 3, patient_id: 'P003', patient_name: 'Asha Reddy', patient_age: '35F',
    doctor_id: 'D001', doctor_name: 'Dr. Anita Mehta',
    chief_complaint: 'Pelvic pain, heavy periods',
    todays_symptoms: 'Heavy menstrual flow for last 3 cycles. Clots present. Pelvic pain during periods, radiating to lower back.',
    vitals: { bp: '124/80', pulse: '82', temp: '98.6°F', weight: '68 kg' },
    status: 'waiting', is_returning: true, last_visit: '2026-05-20',
    scheduled_time: '10:00', prescription_status: null, created_at: '2026-06-14T09:00:00'
  },
  {
    id: 'A004', token_number: 4, patient_id: 'P004', patient_name: 'Kavita Deshmukh', patient_age: '41F',
    doctor_id: 'D002', doctor_name: 'Dr. Sunita Hale',
    chief_complaint: 'Annual well-woman exam',
    todays_symptoms: 'Routine check-up. No specific complaints. Occasional hot flashes.',
    vitals: { bp: '130/84', pulse: '76', temp: '98.4°F', weight: '71 kg' },
    status: 'checked_in', is_returning: true, last_visit: '2026-04-18',
    scheduled_time: '10:30', prescription_status: null, created_at: '2026-06-14T09:15:00'
  },
  {
    id: 'A005', token_number: 5, patient_id: 'P005', patient_name: 'Noor Khan', patient_age: '30F',
    doctor_id: 'D001', doctor_name: 'Dr. Anita Mehta',
    chief_complaint: 'IUD insertion follow-up',
    todays_symptoms: 'Copper IUD inserted 3 weeks ago. Mild spotting first week, now resolved. No pain.',
    vitals: { bp: '112/72', pulse: '70', temp: '98.2°F', weight: '58 kg' },
    status: 'scheduled', is_returning: true, last_visit: '2026-05-10',
    scheduled_time: '11:15', prescription_status: null, created_at: '2026-06-14T09:30:00'
  },
  {
    id: 'A006', token_number: 6, patient_id: 'P006', patient_name: 'Deepika Joshi', patient_age: '26F',
    doctor_id: 'D002', doctor_name: 'Dr. Sunita Hale',
    chief_complaint: 'PCOS follow-up, acne worsening',
    todays_symptoms: 'PCOS diagnosed 3 months ago. Acne worsening on chin and jawline. Weight gained 2 kg. Periods still irregular.',
    vitals: { bp: '116/74', pulse: '72', temp: '98.4°F', weight: '64 kg' },
    status: 'scheduled', is_returning: true, last_visit: '2026-05-28',
    scheduled_time: '11:30', prescription_status: null, created_at: '2026-06-14T09:45:00'
  },
  {
    id: 'A007', token_number: 7, patient_id: 'P007', patient_name: 'Fatima Ansari', patient_age: '37F',
    doctor_id: 'D001', doctor_name: 'Dr. Anita Mehta',
    chief_complaint: 'Vaginal discharge, itching',
    todays_symptoms: 'White curdy discharge for 5 days. Itching and burning during urination. No fever.',
    vitals: { bp: '120/78', pulse: '76', temp: '98.8°F', weight: '65 kg' },
    status: 'waiting', is_returning: true, last_visit: '2026-04-22',
    scheduled_time: '12:00', prescription_status: null, created_at: '2026-06-14T10:00:00'
  },
  {
    id: 'A008', token_number: 8, patient_id: 'P008', patient_name: 'Sunita Patil', patient_age: '33F',
    doctor_id: 'D002', doctor_name: 'Dr. Sunita Hale',
    chief_complaint: 'Missed period, nausea',
    todays_symptoms: 'Missed period ~6 weeks. Persistent nausea, especially morning. Breast tenderness. No bleeding.',
    vitals: { bp: '108/68', pulse: '80', temp: '98.4°F', weight: '59 kg' },
    status: 'waiting', is_returning: false, last_visit: null,
    scheduled_time: '12:30', prescription_status: null, created_at: '2026-06-14T10:15:00'
  },
  {
    id: 'A009', token_number: 9, patient_id: 'P009', patient_name: 'Rekha Iyer', patient_age: '47F',
    doctor_id: 'D001', doctor_name: 'Dr. Anita Mehta',
    chief_complaint: 'Hot flashes, mood changes',
    todays_symptoms: '',
    vitals: { bp: '136/86', pulse: '78', temp: '98.4°F', weight: '72 kg' },
    status: 'completed', is_returning: true, last_visit: '2026-05-30',
    scheduled_time: '08:30', prescription_status: 'approved', created_at: '2026-06-14T08:15:00'
  },
  {
    id: 'A010', token_number: 10, patient_id: 'P010', patient_name: 'Hannah Lee', patient_age: '29F',
    doctor_id: 'D002', doctor_name: 'Dr. Sunita Hale',
    chief_complaint: 'Postpartum 6-week check',
    todays_symptoms: 'Postpartum 6 weeks. Breastfeeding well. Episiotomy site healed. Mild fatigue.',
    vitals: { bp: '114/72', pulse: '74', temp: '98.2°F', weight: '63 kg' },
    status: 'scheduled', is_returning: true, last_visit: '2026-05-01',
    scheduled_time: '13:00', prescription_status: null, created_at: '2026-06-14T10:30:00'
  }
];


// Week appointments for calendar view (Mon–Sat of current week)
export const weekAppointments = [
  // Monday
  { id: 'W001', patient_name: 'Priya Sharma', patient_age: '34F', doctor_id: 'D001', doctor_name: 'Dr. Anita Mehta', chief_complaint: 'Lower abdominal pain', time: '09:00', day: 1, status: 'completed', is_returning: true, appt_id: 'A001' },
  { id: 'W002', patient_name: 'Rekha Iyer', patient_age: '47F', doctor_id: 'D001', doctor_name: 'Dr. Anita Mehta', chief_complaint: 'HRT review', time: '10:30', day: 1, status: 'completed', is_returning: true, appt_id: null },
  { id: 'W003', patient_name: 'Kavita Deshmukh', patient_age: '41F', doctor_id: 'D002', doctor_name: 'Dr. Sunita Hale', chief_complaint: 'Annual well-woman exam', time: '11:00', day: 1, status: 'completed', is_returning: true, appt_id: null },
  { id: 'W004', patient_name: 'Sunita Patil', patient_age: '33F', doctor_id: 'D002', doctor_name: 'Dr. Sunita Hale', chief_complaint: 'Missed period, nausea', time: '14:00', day: 1, status: 'completed', is_returning: false, appt_id: null },
  // Tuesday
  { id: 'W005', patient_name: 'Meena Kulkarni', patient_age: '28F', doctor_id: 'D001', doctor_name: 'Dr. Anita Mehta', chief_complaint: 'Pregnancy confirmation', time: '08:30', day: 2, status: 'completed', is_returning: false, appt_id: null },
  { id: 'W006', patient_name: 'Noor Khan', patient_age: '30F', doctor_id: 'D001', doctor_name: 'Dr. Anita Mehta', chief_complaint: 'IUD follow-up', time: '10:00', day: 2, status: 'completed', is_returning: true, appt_id: null },
  { id: 'W007', patient_name: 'Fatima Ansari', patient_age: '37F', doctor_id: 'D002', doctor_name: 'Dr. Sunita Hale', chief_complaint: 'Vaginal discharge, itching', time: '11:30', day: 2, status: 'completed', is_returning: true, appt_id: null },
  { id: 'W008', patient_name: 'Deepika Joshi', patient_age: '26F', doctor_id: 'D002', doctor_name: 'Dr. Sunita Hale', chief_complaint: 'PCOS labs review', time: '15:00', day: 2, status: 'completed', is_returning: true, appt_id: null },
  // Wednesday (today — mixed statuses)
  { id: 'W009', patient_name: 'Rekha Iyer', patient_age: '47F', doctor_id: 'D001', doctor_name: 'Dr. Anita Mehta', chief_complaint: 'Hot flashes, mood changes', time: '08:30', day: 3, status: 'completed', is_returning: true, appt_id: 'A009' },
  { id: 'W010', patient_name: 'Priya Sharma', patient_age: '34F', doctor_id: 'D001', doctor_name: 'Dr. Anita Mehta', chief_complaint: 'Lower abdominal pain for 3 days', time: '08:45', day: 3, status: 'waiting', is_returning: true, appt_id: 'A001' },
  { id: 'W011', patient_name: 'Meena Kulkarni', patient_age: '28F', doctor_id: 'D001', doctor_name: 'Dr. Anita Mehta', chief_complaint: 'Missed period, pregnancy test positive', time: '09:15', day: 3, status: 'in_progress', is_returning: false, appt_id: 'A002' },
  { id: 'W012', patient_name: 'Asha Reddy', patient_age: '35F', doctor_id: 'D001', doctor_name: 'Dr. Anita Mehta', chief_complaint: 'Pelvic pain, heavy periods', time: '10:00', day: 3, status: 'waiting', is_returning: true, appt_id: 'A003' },
  { id: 'W013', patient_name: 'Kavita Deshmukh', patient_age: '41F', doctor_id: 'D002', doctor_name: 'Dr. Sunita Hale', chief_complaint: 'Annual well-woman exam', time: '10:30', day: 3, status: 'checked_in', is_returning: true, appt_id: 'A004' },
  { id: 'W014', patient_name: 'Noor Khan', patient_age: '30F', doctor_id: 'D001', doctor_name: 'Dr. Anita Mehta', chief_complaint: 'IUD insertion follow-up', time: '11:15', day: 3, status: 'scheduled', is_returning: true, appt_id: 'A005' },
  { id: 'W015', patient_name: 'Deepika Joshi', patient_age: '26F', doctor_id: 'D002', doctor_name: 'Dr. Sunita Hale', chief_complaint: 'PCOS follow-up, acne worsening', time: '11:30', day: 3, status: 'scheduled', is_returning: true, appt_id: 'A006' },
  { id: 'W016', patient_name: 'Fatima Ansari', patient_age: '37F', doctor_id: 'D001', doctor_name: 'Dr. Anita Mehta', chief_complaint: 'Vaginal discharge, itching', time: '12:00', day: 3, status: 'waiting', is_returning: true, appt_id: 'A007' },
  { id: 'W017', patient_name: 'Sunita Patil', patient_age: '33F', doctor_id: 'D002', doctor_name: 'Dr. Sunita Hale', chief_complaint: 'Missed period, nausea', time: '12:30', day: 3, status: 'waiting', is_returning: false, appt_id: 'A008' },
  { id: 'W018', patient_name: 'Hannah Lee', patient_age: '29F', doctor_id: 'D002', doctor_name: 'Dr. Sunita Hale', chief_complaint: 'Postpartum 6-week check', time: '13:00', day: 3, status: 'scheduled', is_returning: true, appt_id: 'A010' },
  // Thursday
  { id: 'W019', patient_name: 'Asha Reddy', patient_age: '35F', doctor_id: 'D001', doctor_name: 'Dr. Anita Mehta', chief_complaint: 'Pap smear follow-up', time: '09:00', day: 4, status: 'scheduled', is_returning: true, appt_id: null },
  { id: 'W020', patient_name: 'Hannah Lee', patient_age: '29F', doctor_id: 'D002', doctor_name: 'Dr. Sunita Hale', chief_complaint: 'Breastfeeding consultation', time: '10:30', day: 4, status: 'scheduled', is_returning: true, appt_id: null },
  { id: 'W021', patient_name: 'Noor Khan', patient_age: '30F', doctor_id: 'D001', doctor_name: 'Dr. Anita Mehta', chief_complaint: 'Contraceptive counseling', time: '14:00', day: 4, status: 'scheduled', is_returning: true, appt_id: null },
  // Friday
  { id: 'W022', patient_name: 'Priya Sharma', patient_age: '34F', doctor_id: 'D001', doctor_name: 'Dr. Anita Mehta', chief_complaint: 'Ultrasound review', time: '09:30', day: 5, status: 'scheduled', is_returning: true, appt_id: null },
  { id: 'W023', patient_name: 'Deepika Joshi', patient_age: '26F', doctor_id: 'D002', doctor_name: 'Dr. Sunita Hale', chief_complaint: 'PCOS labs result review', time: '11:00', day: 5, status: 'scheduled', is_returning: true, appt_id: null },
  { id: 'W024', patient_name: 'Rekha Iyer', patient_age: '47F', doctor_id: 'D001', doctor_name: 'Dr. Anita Mehta', chief_complaint: 'HRT dose adjustment', time: '14:30', day: 5, status: 'scheduled', is_returning: true, appt_id: null },
  // Saturday (half day)
  { id: 'W025', patient_name: 'Meena Kulkarni', patient_age: '28F', doctor_id: 'D001', doctor_name: 'Dr. Anita Mehta', chief_complaint: 'First trimester scan review', time: '09:00', day: 6, status: 'scheduled', is_returning: false, appt_id: null },
  { id: 'W026', patient_name: 'Sunita Patil', patient_age: '33F', doctor_id: 'D002', doctor_name: 'Dr. Sunita Hale', chief_complaint: 'Pregnancy confirmation', time: '10:00', day: 6, status: 'scheduled', is_returning: false, appt_id: null },
];

export const medicines = [
  { id: 'M001', name: 'Meftal-Spas', generic: 'Mefenamic Acid + Dicyclomine', strength: '500mg', form: 'Tablet', default_dosage: '1-0-1', category: 'NSAID', color: 'red' },
  { id: 'M002', name: 'Duphaston', generic: 'Dydrogesterone', strength: '10mg', form: 'Tablet', default_dosage: '1-0-1', category: 'Progestogen', color: 'purple' },
  { id: 'M003', name: 'Folvite', generic: 'Folic Acid', strength: '5mg', form: 'Tablet', default_dosage: '1-0-0', category: 'Vitamin', color: 'green' },
  { id: 'M004', name: 'Susten', generic: 'Progesterone', strength: '200mg', form: 'Capsule', default_dosage: '0-0-1', category: 'Hormone', color: 'purple' },
  { id: 'M005', name: 'Metformin', generic: 'Metformin HCl', strength: '500mg', form: 'Tablet', default_dosage: '1-0-1', category: 'Anti-diabetic', color: 'blue' },
  { id: 'M006', name: 'Clomid', generic: 'Clomiphene Citrate', strength: '50mg', form: 'Tablet', default_dosage: '1-0-0', category: 'Fertility', color: 'pink' },
  { id: 'M007', name: 'Candid-V', generic: 'Clotrimazole', strength: '500mg', form: 'Pessary', default_dosage: '0-0-1', category: 'Antifungal', color: 'orange' },
  { id: 'M008', name: 'Oflox-OZ', generic: 'Ofloxacin + Ornidazole', strength: '200mg', form: 'Tablet', default_dosage: '1-0-1', category: 'Antibiotic', color: 'red' },
  { id: 'M009', name: 'Pause-MF', generic: 'Tranexamic + Mefenamic', strength: '500mg', form: 'Tablet', default_dosage: '1-1-1', category: 'Hemostatic', color: 'red' },
  { id: 'M010', name: 'Shelcal', generic: 'Calcium + Vitamin D3', strength: '500mg', form: 'Tablet', default_dosage: '0-0-1', category: 'Supplement', color: 'green' },
  { id: 'M011', name: 'Feronia-XT', generic: 'Ferrous Ascorbate + Folic Acid', strength: '100mg', form: 'Tablet', default_dosage: '1-0-0', category: 'Iron', color: 'green' },
  { id: 'M012', name: 'Azithral', generic: 'Azithromycin', strength: '500mg', form: 'Tablet', default_dosage: '1-0-0', category: 'Antibiotic', color: 'red' },
  { id: 'M013', name: 'Fluconazole', generic: 'Fluconazole', strength: '150mg', form: 'Tablet', default_dosage: 'single dose', category: 'Antifungal', color: 'orange' },
  { id: 'M014', name: 'Buscopan', generic: 'Hyoscine Butylbromide', strength: '10mg', form: 'Tablet', default_dosage: 'SOS', category: 'Antispasmodic', color: 'blue' },
  { id: 'M015', name: 'Dronis-30', generic: 'Drospirenone + Ethinylestradiol', strength: '3mg/0.03mg', form: 'Tablet', default_dosage: '1-0-0', category: 'OCP', color: 'pink' },
  { id: 'M016', name: 'Spironolactone', generic: 'Spironolactone', strength: '25mg', form: 'Tablet', default_dosage: '0-0-1', category: 'Anti-androgen', color: 'blue' },
  { id: 'M017', name: 'Vitamin C', generic: 'Ascorbic Acid', strength: '500mg', form: 'Tablet', default_dosage: '1-0-0', category: 'Vitamin', color: 'green' },
  { id: 'M018', name: 'B-Complex', generic: 'B-Complex', strength: '', form: 'Tablet', default_dosage: '1-0-0', category: 'Vitamin', color: 'green' },
  { id: 'M019', name: 'Premarin', generic: 'Conjugated Estrogens', strength: '0.625mg', form: 'Tablet', default_dosage: '1-0-0', category: 'HRT', color: 'purple' },
  { id: 'M020', name: 'Metrogyl', generic: 'Metronidazole', strength: '400mg', form: 'Tablet', default_dosage: '1-1-1', category: 'Antibiotic', color: 'red' }
];

// Medication templates — gynec-specific
export const medicationTemplates = [
  {
    id: 'T001', name: '1st Trimester Prenatal', icon: '🤰',
    description: 'Standard first trimester vitamins and supplements',
    medicines: [
      { id: 'M003', name: 'Folvite 5mg', dosage: '1-0-0', duration: '90 days', instructions: 'after food' },
      { id: 'M011', name: 'Feronia-XT 100mg', dosage: '1-0-0', duration: '30 days', instructions: 'after food' },
      { id: 'M010', name: 'Shelcal 500mg', dosage: '0-0-1', duration: '30 days', instructions: 'after dinner' }
    ]
  },
  {
    id: 'T002', name: 'PCOS Management', icon: '💊',
    description: 'Standard PCOS treatment with insulin sensitizer and anti-androgen',
    medicines: [
      { id: 'M005', name: 'Metformin 500mg', dosage: '1-0-1', duration: '30 days', instructions: 'after food' },
      { id: 'M016', name: 'Spironolactone 25mg', dosage: '0-0-1', duration: '30 days', instructions: 'after dinner' },
      { id: 'M015', name: 'Dronis-30', dosage: '1-0-0', duration: '21 days', instructions: 'Day 1–21 of cycle' }
    ]
  },
  {
    id: 'T003', name: 'UTI Treatment', icon: '💧',
    description: 'Short course antibiotic for uncomplicated UTI',
    medicines: [
      { id: 'M008', name: 'Oflox-OZ 200mg', dosage: '1-0-1', duration: '5 days', instructions: 'after food' }
    ]
  },
  {
    id: 'T004', name: 'Vaginal Candidiasis', icon: '🩹',
    description: 'Antifungal treatment for vaginal yeast infection',
    medicines: [
      { id: 'M007', name: 'Candid-V 500mg', dosage: 'single dose', duration: '1 day', instructions: 'at bedtime, vaginal' },
      { id: 'M013', name: 'Fluconazole 150mg', dosage: 'single dose', duration: '1 day', instructions: 'oral, single dose' }
    ]
  },
  {
    id: 'T005', name: 'Dysmenorrhoea Relief', icon: '🌡️',
    description: 'Pain relief for menstrual cramps',
    medicines: [
      { id: 'M001', name: 'Meftal-Spas 500mg', dosage: '1-1-1', duration: '3 days', instructions: 'after food' },
      { id: 'M014', name: 'Buscopan 10mg', dosage: 'SOS', duration: '3 days', instructions: 'as needed for spasm' }
    ]
  },
  {
    id: 'T006', name: 'Post-Delivery Care', icon: '👶',
    description: 'Postpartum supplementation',
    medicines: [
      { id: 'M011', name: 'Feronia-XT 100mg', dosage: '1-0-0', duration: '30 days', instructions: 'after food' },
      { id: 'M010', name: 'Shelcal 500mg', dosage: '0-0-1', duration: '30 days', instructions: 'after dinner' },
      { id: 'M018', name: 'B-Complex', dosage: '1-0-0', duration: '30 days', instructions: 'after food' }
    ]
  },
  {
    id: 'T007', name: 'Iron Deficiency Anemia', icon: '🩸',
    description: 'Iron supplementation with Vitamin C for better absorption',
    medicines: [
      { id: 'M011', name: 'Feronia-XT 100mg', dosage: '1-0-0', duration: '30 days', instructions: 'after food' },
      { id: 'M017', name: 'Vitamin C 500mg', dosage: '1-0-0', duration: '30 days', instructions: 'with iron tablet' }
    ]
  },
  {
    id: 'T008', name: '3rd Trimester Care', icon: '🤰',
    description: 'Third trimester vitamins and monitoring prep',
    medicines: [
      { id: 'M011', name: 'Feronia-XT 100mg', dosage: '1-0-0', duration: '30 days', instructions: 'after food' },
      { id: 'M010', name: 'Shelcal 500mg', dosage: '0-0-1', duration: '30 days', instructions: 'after dinner' },
      { id: 'M003', name: 'Folvite 5mg', dosage: '1-0-0', duration: '30 days', instructions: 'after food' }
    ]
  }
];

// Test panels — gynec-specific
export const testPanels = [
  {
    id: 'TP01', name: 'Basic Prenatal', icon: '🤰',
    tests: ['CBC', 'Blood Group + Rh', 'HIV', 'HBsAg', 'VDRL', 'TSH', 'Urine R/M', 'Random Blood Sugar']
  },
  {
    id: 'TP02', name: 'PCOS Evaluation', icon: '💊',
    tests: ['FSH', 'LH', 'Total Testosterone', 'DHEAS', 'TSH', 'Prolactin', 'AMH', 'Fasting Insulin', 'Fasting Glucose', 'USG Pelvis']
  },
  {
    id: 'TP03', name: 'Infertility Workup', icon: '🔬',
    tests: ['FSH', 'LH', 'AMH', 'Estradiol', 'Progesterone (Day 21)', 'Prolactin', 'TSH', 'HSG']
  },
  {
    id: 'TP04', name: 'Menopause Panel', icon: '🌡️',
    tests: ['FSH', 'LH', 'Estradiol', 'TSH', 'Calcium', 'Vitamin D', 'Lipid Profile']
  },
  {
    id: 'TP05', name: 'Cervical Screening', icon: '🩺',
    tests: ['Pap Smear', 'HPV Co-test']
  },
  {
    id: 'TP06', name: 'Pregnancy Confirmation', icon: '✅',
    tests: ['Urine β-hCG', 'Serum β-hCG', 'USG Transvaginal']
  }
];

// Individual common tests
export const commonTests = [
  'CBC', 'TSH', 'Prolactin', 'FSH', 'LH', 'AMH', 'Estradiol', 'Progesterone',
  'HbA1c', 'Blood Group + Rh', 'HIV', 'HBsAg', 'VDRL', 'Urine R/M',
  'Urine Culture', 'Urine Protein', 'USG Pelvis', 'USG Obstetric', 'Doppler',
  'Pap Smear', 'GTT', 'NIPT', 'NT Scan', 'Beta-hCG', 'Vitamin D',
  'Calcium', 'Lipid Profile', 'Ferritin', 'Iron Studies', 'KFT', 'LFT'
];

// Quick advice buttons
export const quickAdvice = [
  'Complete bed rest', 'Light activity only', 'Plenty of fluids', 'Avoid heavy lifting',
  'No intercourse', 'Folic acid-rich diet', 'Iron-rich diet', 'Follow diabetic diet',
  'Avoid raw/uncooked food', 'Warm compress for pain', 'Pelvic floor exercises',
  'Monitor blood pressure daily', 'Maintain weight diary', 'Count fetal movements daily'
];

export const labReports = [
  { id: 'R001', patient_id: 'P001', file_name: 'CBC_Report_Mar2026.pdf', type: 'blood_test', uploaded_by: 'Ritu (Reception)', uploaded_at: '2026-03-10', notes: 'Pre-visit blood work', ai_summary: 'Hb: 11.2 g/dL (Normal) | WBC: 7,800 (Normal) | Platelets: 245k (Normal)' },
  { id: 'R002', patient_id: 'P003', file_name: 'USG_Pelvis_May2026.pdf', type: 'usg', uploaded_by: 'Ritu (Reception)', uploaded_at: '2026-05-18', notes: 'Follow-up ultrasound', ai_summary: 'Right ovarian cyst 2.3cm (unchanged) | Uterus: normal size | Endometrium: 8mm' },
  { id: 'R003', patient_id: 'P003', file_name: 'Pap_Smear_Feb2026.pdf', type: 'pap_smear', uploaded_by: 'Ritu (Reception)', uploaded_at: '2026-02-10', notes: 'Annual screening', ai_summary: 'ASCUS — atypical squamous cells. HPV co-test pending.' },
  { id: 'R004', patient_id: 'P001', file_name: 'Thyroid_Panel_Jan2026.pdf', type: 'blood_test', uploaded_by: 'Ritu (Reception)', uploaded_at: '2026-01-15', notes: '', ai_summary: 'TSH: 3.2 mIU/L (Normal) | T3: 1.1 (Normal) | T4: 8.5 (Normal)' },
  { id: 'R005', patient_id: 'P009', file_name: 'Hormone_Panel_May2026.pdf', type: 'blood_test', uploaded_by: 'Ritu (Reception)', uploaded_at: '2026-05-28', notes: 'Menopause evaluation', ai_summary: 'FSH: 48.2 (↑ High) | Estradiol: 18 pg/mL (↓ Low) | LH: 32.5 (↑ High)' }
];

// Previous prescriptions (for re-prescribe feature)
export const previousPrescriptions = {
  'P001': {
    date: '2026-03-10', diagnosis: 'Dysfunctional uterine bleeding',
    medicines: [
      { name: 'Pause-MF 500mg', dosage: '1-1-1', duration: '5 days', instructions: 'after food' },
      { name: 'Meftal-Spas 500mg', dosage: '1-0-1', duration: '3 days', instructions: 'after food, SOS' },
      { name: 'Feronia-XT 100mg', dosage: '1-0-0', duration: '30 days', instructions: 'after food' }
    ]
  },
  'P003': {
    date: '2026-05-20', diagnosis: 'Endometriosis, IUD displacement',
    medicines: [
      { name: 'Meftal-Spas 500mg', dosage: '1-1-1', duration: '5 days', instructions: 'after food' },
      { name: 'Duphaston 10mg', dosage: '1-0-1', duration: '10 days', instructions: 'Day 16–25 of cycle' }
    ]
  },
  'P005': {
    date: '2026-05-10', diagnosis: 'Post IUD insertion care',
    medicines: [
      { name: 'Meftal-Spas 500mg', dosage: '1-0-1', duration: '3 days', instructions: 'after food, if pain' }
    ]
  },
  'P007': {
    date: '2026-04-22', diagnosis: 'IUD in situ, spotting resolved',
    medicines: [
      { name: 'Feronia-XT 100mg', dosage: '1-0-0', duration: '30 days', instructions: 'after food' }
    ]
  },
  'P009': {
    date: '2026-05-30', diagnosis: 'Menopause transition',
    medicines: [
      { name: 'Premarin 0.625mg', dosage: '1-0-0', duration: '30 days', instructions: 'after food' },
      { name: 'Shelcal 500mg', dosage: '0-0-1', duration: '30 days', instructions: 'after dinner' },
      { name: 'Feronia-XT 100mg', dosage: '1-0-0', duration: '30 days', instructions: 'after food' }
    ]
  }
};

export const aiInsights = [
  { priority: 'high', text: '"Priya Sharma [10:00] — last 2 home BP logs ×138/88. Manual cuff + urine protein dipstick recommended."' },
  { priority: 'watch', text: '"Asha Reddy — Ferritin 14 ng/mL, borderline. Consider escalating iron supplementation."' },
  { priority: 'fyi', text: '"3 patients overdue for postpartum 6-week follow-up. Draft outreach ready."' }
];

export const privacyLog = [
  { action: 'Dr. Mehta opened private notes for Priya Sharma', time: '09:18', icon: '🔐' },
  { action: 'Dr. Hale declined access to Asha Reddy\'s OB notes', time: '08:47', icon: '🚫' },
  { action: 'Shared chart updated · Allergies (Penicillin)', time: '08:31', icon: '⚠️' }
];

export const soapData = {
  A002: {
    subjective: 'Patient reports missed period for approximately 4 weeks. Home pregnancy test positive 2 days ago. No vaginal bleeding or pain. Mild nausea in the mornings. No previous pregnancies. LMP around May 10, 2026.',
    objective: 'Vitals: BP 110/70, Pulse 78, Temp 98.4°F. General appearance: well-nourished, no acute distress. Abdomen: soft, non-tender. Pelvic exam deferred for today. Urine pregnancy test: positive.',
    assessment: 'Early intrauterine pregnancy, approximately 5 weeks gestation based on LMP. First prenatal visit.',
    plan: 'Order dating ultrasound in 2-3 weeks (7-8 weeks gestation). Start prenatal vitamins with folic acid 5mg. Basic prenatal labs: CBC, blood group, HIV, HBsAg, VDRL, urine routine. Dietary counseling provided. Follow-up in 3 weeks with USG.'
  }
};

export const aiPrescriptionSuggestions = {
  A002: {
    diagnoses: ['Early intrauterine pregnancy (~5 weeks)', 'Nausea of early pregnancy'],
    medicines: [
      { id: 'M003', name: 'Folvite 5mg', dosage: '1-0-0', duration: '90 days', instructions: 'after food', reason: 'Folic acid — essential for neural tube defect prevention' },
      { id: 'M011', name: 'Feronia-XT 100mg', dosage: '1-0-0', duration: '30 days', instructions: 'after food', reason: 'Iron + folic acid for anemia prevention in pregnancy' },
      { id: 'M010', name: 'Shelcal 500mg', dosage: '0-0-1', duration: '30 days', instructions: 'after dinner', reason: 'Calcium + Vitamin D3 for skeletal health' }
    ],
    warnings: [],
    follow_up: 'Review after dating USG (3 weeks)',
    confidence: 'high'
  }
};

// ================================================================
// PATIENT FULL VISIT HISTORY (per patient)
// Rich timeline with prescriptions + complaint summaries
// ================================================================
export const patientHistory = {
  'P001': {
    visits: [
      {
        id: 'V001', date: '2026-03-10', doctor: 'Dr. Anita Mehta',
        status: 'completed', type: 'OPD',
        chief_complaint: 'Irregular periods, heavy bleeding',
        symptoms: 'Heavy menstrual flow since 2 cycles. Clots present. Cramping lower abdomen. No fever. Mild dizziness.',
        vitals: { bp: '116/74', pulse: '80', temp: '98.2°F', weight: '61 kg' },
        diagnosis: 'Dysfunctional Uterine Bleeding (DUB)',
        soap: {
          subjective: 'Patient reports heavy menstrual flow for 2 cycles with clots. Cramping. Mild dizziness on standing. No fever or discharge.',
          objective: 'Vitals stable. Pallor +1. Abdomen soft, mild uterine tenderness. CBC: Hb 11.2 g/dL.',
          assessment: 'Dysfunctional uterine bleeding — likely ovulatory dysfunction. Mild anaemia.',
          plan: 'Haemostatic + analgesic for 5 days. Iron supplementation. CBC repeat in 4 weeks. Avoid NSAIDs.'
        },
        prescription: {
          medicines: [
            { name: 'Pause-MF 500mg', dosage: '1-1-1', duration: '5 days', instructions: 'after food' },
            { name: 'Meftal-Spas 500mg', dosage: '1-0-1', duration: '3 days', instructions: 'after food, SOS' },
            { name: 'Feronia-XT 100mg', dosage: '1-0-0', duration: '30 days', instructions: 'after food' }
          ],
          tests_ordered: ['CBC', 'TSH', 'Progesterone (Day 21)'],
          advice: 'Iron-rich diet. Track menstrual calendar. Return if bleeding soaks >2 pads/hr.',
          follow_up: '4 weeks or sooner if needed'
        }
      },
      {
        id: 'V002', date: '2025-11-22', doctor: 'Dr. Anita Mehta',
        status: 'completed', type: 'OPD',
        chief_complaint: 'Annual well-woman check-up',
        symptoms: 'No active complaints. Routine annual check. Mild stress, irregular sleep.',
        vitals: { bp: '118/76', pulse: '76', temp: '98.4°F', weight: '60 kg' },
        diagnosis: 'Normal gynaecological examination',
        soap: {
          subjective: 'No complaints. Annual visit. Mild work stress. Sleep 5-6 hours.',
          objective: 'All vitals normal. Breast exam: no lumps. Pelvic exam: normal. Pap smear done.',
          assessment: 'Normal well-woman exam. Pap smear sent.',
          plan: 'Continue Folvite. Pap smear result in 2 weeks. Calcium supplement started.'
        },
        prescription: {
          medicines: [
            { name: 'Folvite 5mg', dosage: '1-0-0', duration: '30 days', instructions: 'after food' },
            { name: 'Shelcal 500mg', dosage: '0-0-1', duration: '30 days', instructions: 'after dinner' }
          ],
          tests_ordered: ['Pap Smear', 'CBC', 'Lipid Profile', 'TSH'],
          advice: 'Calcium-rich diet. Regular exercise. Reduce caffeine.',
          follow_up: 'Review Pap smear results in 2 weeks'
        }
      },
      {
        id: 'V003', date: '2025-06-18', doctor: 'Dr. Anita Mehta',
        status: 'completed', type: 'OPD',
        chief_complaint: 'Painful periods, cramping',
        symptoms: 'Severe cramping on day 1–2 of period. Requires bed rest. No fever. Regular cycles.',
        vitals: { bp: '114/72', pulse: '74', temp: '98.2°F', weight: '59 kg' },
        diagnosis: 'Primary Dysmenorrhoea',
        soap: {
          subjective: 'Severe dysmenorrhoea since teenage years. Day 1 and 2 most painful. Takes OTC analgesics.',
          objective: 'Abdomen soft, mild uterine tenderness. No adnexal mass. USG pelvis normal.',
          assessment: 'Primary dysmenorrhoea. No secondary cause found.',
          plan: 'NSAID + antispasmodic for pain. Heat compress advised. Low-dose OCP considered.'
        },
        prescription: {
          medicines: [
            { name: 'Meftal-Spas 500mg', dosage: '1-1-1', duration: '3 days', instructions: 'Day 1 of period, after food' },
            { name: 'Buscopan 10mg', dosage: 'SOS', duration: '3 days', instructions: 'for spasm, after food' }
          ],
          tests_ordered: ['USG Pelvis'],
          advice: 'Warm compress. Light exercise. Avoid cold foods during period.',
          follow_up: '2 months'
        }
      }
    ]
  },
  'P003': {
    visits: [
      {
        id: 'V010', date: '2026-05-20', doctor: 'Dr. Anita Mehta',
        status: 'completed', type: 'OPD',
        chief_complaint: 'Pelvic pain, heavy bleeding, IUD check',
        symptoms: 'Heavy bleeding since IUD insertion 6 months ago. Clots. Severe pelvic pain during periods. IUD strings not felt by patient.',
        vitals: { bp: '122/80', pulse: '84', temp: '98.6°F', weight: '67 kg' },
        diagnosis: 'Endometriosis; IUD displacement — removed and reinserted',
        soap: {
          subjective: 'Increasing pelvic pain and heavier periods post IUD. Strings not palpable. Pain radiates to legs.',
          objective: 'Abdomen tender in left iliac fossa. IUD strings seen on USG displaced. Removed under speculum. New IUD inserted.',
          assessment: 'IUD displacement confirmed. Underlying endometriosis exacerbated.',
          plan: 'Duphaston for endometriosis. Pain management. USG repeat in 6 weeks to confirm IUD position.'
        },
        prescription: {
          medicines: [
            { name: 'Meftal-Spas 500mg', dosage: '1-1-1', duration: '5 days', instructions: 'after food' },
            { name: 'Duphaston 10mg', dosage: '1-0-1', duration: '10 days', instructions: 'Day 16–25 of cycle' }
          ],
          tests_ordered: ['USG Pelvis (6-week follow-up)', 'CBC', 'CA-125'],
          advice: 'Rest for 24 hours post IUD insertion. Monitor for fever. Return if heavy bleeding.',
          follow_up: '6 weeks'
        }
      },
      {
        id: 'V011', date: '2026-02-14', doctor: 'Dr. Anita Mehta',
        status: 'completed', type: 'OPD',
        chief_complaint: 'Follow-up IUD check',
        symptoms: 'No pain. IUD strings felt by patient. Mild spotting initially, now resolved.',
        vitals: { bp: '120/78', pulse: '80', temp: '98.4°F', weight: '66 kg' },
        diagnosis: 'IUD in situ — normal position confirmed',
        soap: {
          subjective: 'Doing well post-IUD. Occasional spotting first 2 weeks, resolved. No pain.',
          objective: 'IUD strings visible on speculum exam. USG: IUD in correct position. No evidence of perforation.',
          assessment: 'IUD in situ, satisfactory position. Healing well.',
          plan: 'Continue monitoring. Return in 6 months or if symptoms develop.'
        },
        prescription: {
          medicines: [],
          tests_ordered: [],
          advice: 'Check strings monthly. Return if strings not felt or any unusual symptoms.',
          follow_up: '6 months or PRN'
        }
      }
    ]
  },
  'P009': {
    visits: [
      {
        id: 'V020', date: '2026-05-30', doctor: 'Dr. Anita Mehta',
        status: 'completed', type: 'OPD',
        chief_complaint: 'Hot flashes, sleep issues, mood changes',
        symptoms: 'Hot flashes 8-10 times a day. Night sweats. Poor sleep. Mood swings. Last period 3 months ago. Joint aches.',
        vitals: { bp: '136/86', pulse: '78', temp: '98.4°F', weight: '72 kg' },
        diagnosis: 'Perimenopause — menopausal transition',
        soap: {
          subjective: 'Frequent hot flashes, night sweats, sleep disruption. Irritability. Periods have been irregular for 6 months, last period 3 months ago.',
          objective: 'BP slightly elevated. FSH: 48.2 mIU/mL (high). Estradiol: 18 pg/mL (low). No structural abnormality on exam.',
          assessment: 'Menopausal transition confirmed by symptoms and labs. Vasomotor symptoms predominant.',
          plan: 'Low-dose HRT initiated. Calcium + Vitamin D for bone protection. Monitor BP. Lifestyle modifications.'
        },
        prescription: {
          medicines: [
            { name: 'Premarin 0.625mg', dosage: '1-0-0', duration: '30 days', instructions: 'after food' },
            { name: 'Shelcal 500mg', dosage: '0-0-1', duration: '30 days', instructions: 'after dinner' },
            { name: 'Feronia-XT 100mg', dosage: '1-0-0', duration: '30 days', instructions: 'after food' }
          ],
          tests_ordered: ['Lipid Profile', 'Mammography', 'DEXA Scan', 'Pap Smear'],
          advice: 'Cool environment. Cotton clothing. Reduce caffeine and alcohol. Regular walking.',
          follow_up: '3 weeks for HRT monitoring'
        }
      }
    ]
  }
};

// ================================================================
// ALL LAB REPORTS — extended with more per patient
// ================================================================
export const allLabReports = [
  // P001 - Priya Sharma
  { id: 'R001', patient_id: 'P001', visit_id: 'V001', file_name: 'CBC_Report_Mar2026.pdf', type: 'Blood Test', uploaded_by: 'Ritu (Reception)', uploaded_at: '2026-03-10', size: '420 KB', ai_summary: 'Hb: 11.2 g/dL (Normal) | WBC: 7,800 (Normal) | Platelets: 245k (Normal)', status: 'reviewed' },
  { id: 'R004', patient_id: 'P001', visit_id: 'V001', file_name: 'Thyroid_Panel_Jan2026.pdf', type: 'Blood Test', uploaded_by: 'Ritu (Reception)', uploaded_at: '2026-01-15', size: '380 KB', ai_summary: 'TSH: 3.2 mIU/L (Normal) | T3: 1.1 (Normal) | T4: 8.5 (Normal)', status: 'reviewed' },
  { id: 'R006', patient_id: 'P001', visit_id: 'V002', file_name: 'Pap_Smear_Nov2025.pdf', type: 'Pap Smear', uploaded_by: 'Lab (External)', uploaded_at: '2025-11-30', size: '1.2 MB', ai_summary: 'NILM — No intraepithelial lesion or malignancy. Normal result.', status: 'reviewed' },
  { id: 'R007', patient_id: 'P001', visit_id: 'V002', file_name: 'Lipid_Profile_Nov2025.pdf', type: 'Blood Test', uploaded_by: 'Ritu (Reception)', uploaded_at: '2025-11-22', size: '290 KB', ai_summary: 'Total Chol: 182 mg/dL | LDL: 108 | HDL: 52 | TG: 110 — All within normal range.', status: 'reviewed' },
  { id: 'R008', patient_id: 'P001', visit_id: 'V003', file_name: 'USG_Pelvis_Jun2025.pdf', type: 'Ultrasound', uploaded_by: 'Lab (External)', uploaded_at: '2025-06-20', size: '2.4 MB', ai_summary: 'Uterus: normal size and echotexture. Both ovaries: normal. No free fluid. No fibroid.', status: 'reviewed' },
  // P003 - Asha Reddy
  { id: 'R002', patient_id: 'P003', visit_id: 'V010', file_name: 'USG_Pelvis_May2026.pdf', type: 'Ultrasound', uploaded_by: 'Ritu (Reception)', uploaded_at: '2026-05-18', size: '3.1 MB', ai_summary: 'Right ovarian cyst 2.3cm (unchanged) | Uterus: retroflexed | Endometrium: 8mm', status: 'reviewed' },
  { id: 'R003', patient_id: 'P003', visit_id: 'V011', file_name: 'Pap_Smear_Feb2026.pdf', type: 'Pap Smear', uploaded_by: 'Ritu (Reception)', uploaded_at: '2026-02-10', size: '980 KB', ai_summary: 'ASCUS — atypical squamous cells of undetermined significance. HPV co-test: negative.', status: 'pending_review', flag: 'attention' },
  // P009 - Rekha Iyer
  { id: 'R005', patient_id: 'P009', visit_id: 'V020', file_name: 'Hormone_Panel_May2026.pdf', type: 'Blood Test', uploaded_by: 'Ritu (Reception)', uploaded_at: '2026-05-28', size: '510 KB', ai_summary: 'FSH: 48.2 mIU/mL (↑ High) | Estradiol: 18 pg/mL (↓ Low) | LH: 32.5 (↑ High)', status: 'reviewed', flag: 'abnormal' },
  { id: 'R009', patient_id: 'P009', visit_id: 'V020', file_name: 'Lipid_Profile_May2026.pdf', type: 'Blood Test', uploaded_by: 'Ritu (Reception)', uploaded_at: '2026-05-28', size: '310 KB', ai_summary: 'Total Chol: 214 mg/dL (Borderline) | LDL: 138 (↑) | HDL: 48 | TG: 142', status: 'reviewed', flag: 'abnormal' }

];

// ── Follow-ups Due Today ──
export const followUps = [
  { id: 'F001', patient_name: 'Priya Sharma',     patient_id: 'P001', reason: 'Post-op check (Day 7). Wound review needed.',         due: 'Today',    type: 'call'  },
  { id: 'F002', patient_name: 'Meena Kulkarni',   patient_id: 'P002', reason: 'Review recent lab results (Hormone levels).',         due: 'Today',    type: 'labs'  },
  { id: 'F003', patient_name: 'Asha Reddy',        patient_id: 'P003', reason: 'USG pelvis follow-up — right ovarian cyst recheck.',  due: 'Tomorrow', type: 'visit' },
  { id: 'F004', patient_name: 'Kavita Deshmukh',  patient_id: 'P004', reason: 'Annual mammogram report review.',                      due: 'Tomorrow', type: 'labs'  },
];
