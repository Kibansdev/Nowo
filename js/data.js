// ══════════════════════════════════════════════════════════
// Shared Data — Inicialización de datos globales
// Se carga ANTES que cualquier componente
// ══════════════════════════════════════════════════════════

if (!window._profData) {
  window._profData = [
    { name: 'Lic. Daniel Rodríguez', specialty: 'Psicología Holística', schedule: 'MAR/JUE 14:00–20:00', scheduleSlots: [{ days: ['MAR','JUE'], from: '14:00', to: '20:00' }], room: 'Consultorio C', ig: '@lic.rodriguez', tel: '+54 911 4444-1001', email: 'daniel.rodriguez@gmail.com', activo: true, descripcion: 'Psicología integral con enfoque holístico.' },
    { name: 'Lic. María García', specialty: 'Psicología Sistémica', schedule: 'LUN/MIE/VIE 09:00–16:00', scheduleSlots: [{ days: ['LUN','MIE','VIE'], from: '09:00', to: '16:00' }], room: 'Consultorio A', ig: '@lic.garcia', tel: '+54 911 4444-1002', email: 'maria.garcia@gmail.com', activo: true, descripcion: 'Psicología sistémica con foco en vínculos y dinámicas familiares.' },
    { name: 'Dra. Marina Fossati', specialty: 'Nutrición Integrativa', schedule: 'MAR/JUE 09:00–14:00', scheduleSlots: [{ days: ['MAR','JUE'], from: '09:00', to: '14:00' }], room: 'Consultorio B', ig: '@dra.fossati', tel: '+54 911 4444-1003', email: 'marina.fossati@gmail.com', activo: true, descripcion: 'Nutrición con enfoque integrativo.' },
    { name: 'Lic. Camila Torres', specialty: 'Terapia Gestalt', schedule: 'LUN/VIE 10:00–16:00', scheduleSlots: [{ days: ['LUN','VIE'], from: '10:00', to: '16:00' }], room: 'Consultorio A', ig: '@lic.torres', tel: '+54 911 4444-1004', email: 'camila.torres@gmail.com', activo: true, descripcion: 'Terapia Gestalt orientada al aquí y ahora.' },
    { name: 'Prof. Lucas Méndez', specialty: 'Yoga Terapéutico', schedule: 'MAR/JUE/SAB 08:00–12:00', scheduleSlots: [{ days: ['MAR','JUE','SAB'], from: '08:00', to: '12:00' }], room: 'Consultorio D', ig: '@prof.mendez', tel: '+54 911 4444-1005', email: 'lucas.mendez@gmail.com', activo: true, descripcion: 'Yoga terapéutico adaptado a cada persona.' },
    { name: 'Dra. Valentina Ruiz', specialty: 'Reiki & Sanación Energética', schedule: 'MIE/VIE 15:00–20:00', scheduleSlots: [{ days: ['MIE','VIE'], from: '15:00', to: '20:00' }], room: 'Consultorio C', ig: '@dra.ruiz', tel: '+54 911 4444-1006', email: 'valentina.ruiz@gmail.com', activo: true, descripcion: 'Sesiones de Reiki y sanación energética.' },
    { name: 'Lic. Sofía Peralta', specialty: 'Coaching Ontológico', schedule: 'LUN/MIE 10:00–14:00', scheduleSlots: [{ days: ['LUN','MIE'], from: '10:00', to: '14:00' }], room: 'Consultorio B', ig: '@lic.peralta', tel: '+54 911 4444-1007', email: 'sofia.peralta@gmail.com', activo: true, descripcion: 'Coaching ontológico para transformar tu manera de observar.' },
    { name: 'Dr. Marcos Delgado', specialty: 'Osteopatía', schedule: 'MAR/JUE/SAB 09:00–13:00', scheduleSlots: [{ days: ['MAR','JUE','SAB'], from: '09:00', to: '13:00' }], room: 'Consultorio B', ig: '@dr.delgado', tel: '+54 911 4444-1008', email: 'marcos.delgado@gmail.com', activo: true, descripcion: 'Osteopatía estructural y visceral.' },
  ];
}

if (!window._workshopsData) {
  window._workshopsData = [
    { name: 'Yoga Terapéutico', instructor: 'Prof. Lucas Méndez', schedule: 'Martes y Jueves 18:00', occupied: 12, total: 15, color: '#C4956A', active: true, sessions: [], descripcion: 'Yoga adaptado a cada persona.' },
    { name: 'Taller de Cuencos Tibetanos', instructor: 'Dra. Valentina Ruiz', schedule: 'Sábados 16:00', occupied: 8, total: 10, color: '#7A8B6F', active: true, sessions: [], descripcion: 'Sanación sonora con cuencos tibetanos.' },
    { name: 'Meditación & Mindfulness', instructor: 'Lic. Daniel Rodríguez', schedule: 'Miércoles 19:00', occupied: 10, total: 12, color: '#C4956A', active: true, sessions: [], descripcion: 'Meditación guiada y mindfulness.' },
  ];
}

if (!window._agendaCustomSlots) {
  window._agendaCustomSlots = {};
}
