// ================================================================
// DUMMY DATA — Patients
// Realistic Indian patient data for gynecology clinic
// ================================================================

export const patients = [
  {
    id: 'P001',
    name: 'Priya Sharma',
    phone: '9876543210',
    email: 'priya.sharma@email.com',
    dob: '1992-03-12',
    age: 34,
    gender: 'F',
    blood_group: 'B+',
    allergies: 'Penicillin',
    address: '42, Laxmi Nagar, Sector 5, New Delhi - 110092',
    doctor_id: 'D001',
    doctor_name: 'Dr. Anita Mehta',
    registered_at: '2026-01-10',
    is_returning: true,
    last_visit: '2026-03-10',
    token_number: 1,
    gynec: {
      lmp: '2026-05-18',
      cycle_length: 28,
      cycle_duration: 5,
      regularity: 'regular',
      dysmenorrhoea: 'mild',
      gravida: 2,
      para: 1,
      abortions: 1,
      living: 1,
      contraception: 'oral_pills',
      pregnancies: [
        { year: 2022, type: 'spontaneous', outcome: 'live_birth', gestation: '38 weeks', mode: 'vaginal', complications: 'None' },
        { year: 2024, type: 'spontaneous', outcome: 'miscarriage', gestation: '8 weeks', mode: '-', complications: 'Complete abortion, no D&C needed' }
      ],
      surgical_history: []
    },
    recent_appointments: [
      { date: '2026-03-10', status: 'completed', complaint: 'Irregular periods', diagnosis: 'Dysfunctional uterine bleeding' },
      { date: '2025-11-22', status: 'completed', complaint: 'Annual check-up', diagnosis: 'Normal findings' }
    ]
  },
  {
    id: 'P002',
    name: 'Meena Kulkarni',
    phone: '9988776655',
    email: 'meena.k@email.com',
    dob: '1998-07-22',
    age: 28,
    gender: 'F',
    blood_group: 'O+',
    allergies: null,
    address: '15, MG Road, Pune - 411001',
    doctor_id: 'D001',
    doctor_name: 'Dr. Anita Mehta',
    registered_at: '2026-06-14',
    is_returning: false,
    last_visit: null,
    token_number: 2,
    gynec: {
      lmp: '2026-05-10',
      cycle_length: 30,
      cycle_duration: 4,
      regularity: 'regular',
      dysmenorrhoea: 'none',
      gravida: 0,
      para: 0,
      abortions: 0,
      living: 0,
      contraception: 'none',
      pregnancies: [],
      surgical_history: []
    },
    recent_appointments: []
  },
  {
    id: 'P003',
    name: 'Asha Reddy',
    phone: '8877665544',
    email: 'asha.reddy@email.com',
    dob: '1990-11-05',
    age: 35,
    gender: 'F',
    blood_group: 'A+',
    allergies: 'Sulfa drugs, Ibuprofen',
    address: '78, Jubilee Hills, Hyderabad - 500033',
    doctor_id: 'D001',
    doctor_name: 'Dr. Anita Mehta',
    registered_at: '2025-06-15',
    is_returning: true,
    last_visit: '2026-05-20',
    token_number: 3,
    gynec: {
      lmp: '2026-05-25',
      cycle_length: 26,
      cycle_duration: 6,
      regularity: 'irregular',
      dysmenorrhoea: 'severe',
      gravida: 3,
      para: 2,
      abortions: 0,
      living: 2,
      contraception: 'iud',
      pregnancies: [
        { year: 2018, type: 'spontaneous', outcome: 'live_birth', gestation: '39 weeks', mode: 'c-section', complications: 'Gestational diabetes' },
        { year: 2020, type: 'spontaneous', outcome: 'live_birth', gestation: '37 weeks', mode: 'c-section', complications: 'Pre-eclampsia' },
        { year: 2023, type: 'induced', outcome: 'live_birth', gestation: '38 weeks', mode: 'c-section', complications: 'None' }
      ],
      surgical_history: [
        { procedure: 'Laparoscopic ovarian cystectomy', year: 2019, notes: 'Right ovarian dermoid cyst 4cm' }
      ]
    },
    recent_appointments: [
      { date: '2026-05-20', status: 'completed', complaint: 'Pelvic pain, heavy bleeding', diagnosis: 'Endometriosis, IUD displacement' },
      { date: '2026-02-14', status: 'completed', complaint: 'Follow-up IUD check', diagnosis: 'IUD in situ, normal' },
      { date: '2025-11-08', status: 'completed', complaint: 'Irregular bleeding', diagnosis: 'Adjustment period post IUD insertion' }
    ]
  },
  {
    id: 'P004',
    name: 'Kavita Deshmukh',
    phone: '7766554433',
    email: null,
    dob: '1985-01-30',
    age: 41,
    gender: 'F',
    blood_group: 'AB-',
    allergies: null,
    address: '23, Kothrud, Pune - 411038',
    doctor_id: 'D002',
    doctor_name: 'Dr. Sunita Hale',
    registered_at: '2024-09-12',
    is_returning: true,
    last_visit: '2026-04-18',
    token_number: 4,
    gynec: {
      lmp: '2026-04-20',
      cycle_length: 24,
      cycle_duration: 7,
      regularity: 'irregular',
      dysmenorrhoea: 'moderate',
      gravida: 4,
      para: 3,
      abortions: 1,
      living: 3,
      contraception: 'none',
      pregnancies: [
        { year: 2010, type: 'spontaneous', outcome: 'live_birth', gestation: '40 weeks', mode: 'vaginal', complications: 'None' },
        { year: 2013, type: 'spontaneous', outcome: 'live_birth', gestation: '38 weeks', mode: 'vaginal', complications: 'None' },
        { year: 2015, type: 'spontaneous', outcome: 'miscarriage', gestation: '12 weeks', mode: '-', complications: 'D&C performed' },
        { year: 2017, type: 'spontaneous', outcome: 'live_birth', gestation: '39 weeks', mode: 'vaginal', complications: 'None' }
      ],
      surgical_history: [
        { procedure: 'D&C', year: 2015, notes: 'Incomplete abortion' }
      ]
    },
    recent_appointments: [
      { date: '2026-04-18', status: 'completed', complaint: 'Perimenopause symptoms', diagnosis: 'Perimenopausal transition' }
    ]
  },
  {
    id: 'P005',
    name: 'Noor Khan',
    phone: '9123456789',
    email: 'noor.khan@email.com',
    dob: '1995-09-18',
    age: 30,
    gender: 'F',
    blood_group: 'O-',
    allergies: null,
    address: '56, Banjara Hills, Hyderabad - 500034',
    doctor_id: 'D001',
    doctor_name: 'Dr. Anita Mehta',
    registered_at: '2026-02-20',
    is_returning: true,
    last_visit: '2026-05-10',
    token_number: 5,
    gynec: {
      lmp: '2026-05-30',
      cycle_length: 32,
      cycle_duration: 4,
      regularity: 'regular',
      dysmenorrhoea: 'none',
      gravida: 1,
      para: 0,
      abortions: 0,
      living: 0,
      contraception: 'condom',
      pregnancies: [],
      surgical_history: []
    },
    recent_appointments: [
      { date: '2026-05-10', status: 'completed', complaint: 'IUD consultation', diagnosis: 'Counselled for copper IUD insertion' }
    ]
  },
  {
    id: 'P006',
    name: 'Deepika Joshi',
    phone: '8234567890',
    email: 'deepika.j@email.com',
    dob: '2000-04-14',
    age: 26,
    gender: 'F',
    blood_group: 'A-',
    allergies: null,
    address: '112, Aundh, Pune - 411007',
    doctor_id: 'D002',
    doctor_name: 'Dr. Sunita Hale',
    registered_at: '2026-05-01',
    is_returning: true,
    last_visit: '2026-05-28',
    token_number: 6,
    gynec: {
      lmp: '2026-06-01',
      cycle_length: 28,
      cycle_duration: 5,
      regularity: 'regular',
      dysmenorrhoea: 'moderate',
      gravida: 0,
      para: 0,
      abortions: 0,
      living: 0,
      contraception: 'oral_pills',
      pregnancies: [],
      surgical_history: []
    },
    recent_appointments: [
      { date: '2026-05-28', status: 'completed', complaint: 'PCOS evaluation', diagnosis: 'Polycystic ovarian syndrome' }
    ]
  },
  {
    id: 'P007',
    name: 'Fatima Ansari',
    phone: '7345678901',
    email: null,
    dob: '1988-12-25',
    age: 37,
    gender: 'F',
    blood_group: 'B-',
    allergies: 'Metformin',
    address: '89, Camp, Pune - 411001',
    doctor_id: 'D001',
    doctor_name: 'Dr. Anita Mehta',
    registered_at: '2025-11-10',
    is_returning: true,
    last_visit: '2026-04-22',
    token_number: 7,
    gynec: {
      lmp: '2026-05-15',
      cycle_length: 35,
      cycle_duration: 3,
      regularity: 'irregular',
      dysmenorrhoea: 'mild',
      gravida: 5,
      para: 3,
      abortions: 2,
      living: 3,
      contraception: 'iud',
      pregnancies: [
        { year: 2012, type: 'spontaneous', outcome: 'live_birth', gestation: '39 weeks', mode: 'vaginal', complications: 'None' },
        { year: 2014, type: 'spontaneous', outcome: 'miscarriage', gestation: '6 weeks', mode: '-', complications: 'Chemical pregnancy' },
        { year: 2016, type: 'spontaneous', outcome: 'live_birth', gestation: '40 weeks', mode: 'vaginal', complications: 'None' },
        { year: 2018, type: 'spontaneous', outcome: 'live_birth', gestation: '37 weeks', mode: 'c-section', complications: 'Breech presentation' },
        { year: 2021, type: 'induced', outcome: 'miscarriage', gestation: '10 weeks', mode: '-', complications: 'Medical termination' }
      ],
      surgical_history: [
        { procedure: 'Cesarean section', year: 2018, notes: 'LSCS for breech' }
      ]
    },
    recent_appointments: [
      { date: '2026-04-22', status: 'completed', complaint: 'IUD follow-up', diagnosis: 'IUD in situ, spotting resolved' }
    ]
  },
  {
    id: 'P008',
    name: 'Sunita Patil',
    phone: '9456789012',
    email: 'sunita.patil@email.com',
    dob: '1993-06-08',
    age: 33,
    gender: 'F',
    blood_group: 'O+',
    allergies: null,
    address: '34, Wakad, Pune - 411057',
    doctor_id: 'D002',
    doctor_name: 'Dr. Sunita Hale',
    registered_at: '2026-06-10',
    is_returning: false,
    last_visit: null,
    token_number: 8,
    gynec: {
      lmp: '2026-04-01',
      cycle_length: 28,
      cycle_duration: 5,
      regularity: 'regular',
      dysmenorrhoea: 'none',
      gravida: 1,
      para: 0,
      abortions: 0,
      living: 0,
      contraception: 'none',
      pregnancies: [],
      surgical_history: []
    },
    recent_appointments: []
  },
  {
    id: 'P009',
    name: 'Rekha Iyer',
    phone: '8567890123',
    email: 'rekha.iyer@email.com',
    dob: '1979-02-14',
    age: 47,
    gender: 'F',
    blood_group: 'A+',
    allergies: null,
    address: '67, Koregaon Park, Pune - 411001',
    doctor_id: 'D001',
    doctor_name: 'Dr. Anita Mehta',
    registered_at: '2024-03-18',
    is_returning: true,
    last_visit: '2026-05-30',
    token_number: 9,
    gynec: {
      lmp: '2026-03-15',
      cycle_length: 45,
      cycle_duration: 2,
      regularity: 'irregular',
      dysmenorrhoea: 'none',
      gravida: 3,
      para: 3,
      abortions: 0,
      living: 3,
      contraception: 'none',
      pregnancies: [
        { year: 2005, type: 'spontaneous', outcome: 'live_birth', gestation: '40 weeks', mode: 'vaginal', complications: 'None' },
        { year: 2008, type: 'spontaneous', outcome: 'live_birth', gestation: '39 weeks', mode: 'vaginal', complications: 'None' },
        { year: 2012, type: 'spontaneous', outcome: 'live_birth', gestation: '38 weeks', mode: 'vaginal', complications: 'None' }
      ],
      surgical_history: []
    },
    recent_appointments: [
      { date: '2026-05-30', status: 'completed', complaint: 'Hot flashes, sleep issues', diagnosis: 'Menopause transition' }
    ]
  },
  {
    id: 'P010',
    name: 'Hannah Lee',
    phone: '7678901234',
    email: 'hannah.lee@email.com',
    dob: '1996-10-30',
    age: 29,
    gender: 'F',
    blood_group: 'B+',
    allergies: null,
    address: '90, Viman Nagar, Pune - 411014',
    doctor_id: 'D002',
    doctor_name: 'Dr. Sunita Hale',
    registered_at: '2026-04-05',
    is_returning: true,
    last_visit: '2026-05-01',
    token_number: 10,
    gynec: {
      lmp: '2026-05-05',
      cycle_length: 28,
      cycle_duration: 5,
      regularity: 'regular',
      dysmenorrhoea: 'mild',
      gravida: 1,
      para: 1,
      abortions: 0,
      living: 1,
      contraception: 'none',
      pregnancies: [
        { year: 2026, type: 'spontaneous', outcome: 'live_birth', gestation: '39 weeks', mode: 'vaginal', complications: 'None' }
      ],
      surgical_history: []
    },
    recent_appointments: [
      { date: '2026-05-01', status: 'completed', complaint: 'Postpartum 6-week follow-up', diagnosis: 'Normal postpartum recovery' }
    ]
  }
];

export function getPatientById(id) {
  return patients.find(p => p.id === id);
}

export function searchPatients(query) {
  const q = query.toLowerCase();
  return patients.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.phone.includes(q)
  );
}

export function getPatientsByDoctor(doctorId) {
  return patients.filter(p => p.doctor_id === doctorId);
}
