// ══════════════════════════════════════════════════════════
// Shared Data — Inicialización de datos globales
// Se carga ANTES que cualquier componente
// ══════════════════════════════════════════════════════════

// ── Fallback Mock Data (coincide con db.json) ──
const fallbackProfData = [
  {
    name: 'Lic. Daniel Rodríguez',
    specialty: 'Psicología Holística',
    schedule: 'MAR/JUE 14:00–20:00',
    scheduleSlots: [{ days: ['MAR','JUE'], from: '14:00', to: '20:00' }],
    room: 'Consultorio C',
    ig: '@lic.rodriguez',
    tel: '+54 911 4444-1001',
    email: 'daniel.rodriguez@gmail.com',
    activo: true,
    color: '#7A8B6F',
    descripcion: 'Psicología integral con enfoque holístico. Combina técnicas de psicoterapia con meditación guiada y cuencos tibetanos. Ideal para quienes buscan un abordaje que contemple mente, cuerpo y espíritu. Especialista en ansiedad, estrés y autoconocimiento.'
  },
  {
    name: 'Lic. María García',
    specialty: 'Psicología Sistémica',
    schedule: 'LUN/MIE/VIE 09:00–16:00',
    scheduleSlots: [{ days: ['LUN','MIE','VIE'], from: '09:00', to: '16:00' }],
    room: 'Consultorio A',
    ig: '@lic.garcia',
    tel: '+54 911 4444-1002',
    email: 'maria.garcia@gmail.com',
    activo: true,
    color: '#C4956A',
    descripcion: 'Psicología sistémica con foco en vínculos y dinámicas familiares. Trabaja con adultos, parejas y familias. Su enfoque busca entender los patrones relacionales para generar cambios profundos y duraderos.'
  },
  {
    name: 'Dra. Marina Fossati',
    specialty: 'Nutrición Integrativa',
    schedule: 'MAR/JUE 09:00–14:00',
    scheduleSlots: [{ days: ['MAR','JUE'], from: '09:00', to: '14:00' }],
    room: 'Consultorio B',
    ig: '@dra.fossati',
    tel: '+54 911 4444-1003',
    email: 'marina.fossati@gmail.com',
    activo: true,
    color: '#7C9EB2',
    descripcion: 'Nutrición con enfoque integrativo que considera la alimentación como herramienta de bienestar integral. Planes personalizados, sin dietas restrictivas. Especialista en alimentación consciente, celiaquía y desórdenes alimentarios.'
  },
  {
    name: 'Lic. Camila Torres',
    specialty: 'Terapia Gestalt',
    schedule: 'LUN/VIE 10:00–16:00',
    scheduleSlots: [{ days: ['LUN','VIE'], from: '10:00', to: '16:00' }],
    room: 'Consultorio A',
    ig: '@lic.torres',
    tel: '+54 911 4444-1004',
    email: 'camila.torres@gmail.com',
    activo: true,
    color: '#D4A5A9',
    descripcion: 'Terapia Gestalt orientada al aquí y ahora. Trabaja con la conciencia corporal y emocional para facilitar procesos de cambio. Ideal para quienes buscan conectar con sus emociones y vivir de forma más auténtica.'
  },
  {
    name: 'Prof. Lucas Méndez',
    specialty: 'Yoga Terapéutico',
    schedule: 'MAR/JUE/SAB 08:00–12:00',
    scheduleSlots: [{ days: ['MAR','JUE','SAB'], from: '08:00', to: '13:00' }],
    room: 'Consultorio D',
    ig: '@prof.mendez',
    tel: '+54 911 4444-1005',
    email: 'lucas.mendez@gmail.com',
    activo: true,
    color: '#5E7C65',
    descripcion: 'Yoga terapéutico adaptado a cada persona. Clases individuales y grupales que combinan posturas, respiración and meditación. Especialmente indicado para dolor crónico, recuperación postural y manejo del estrés.'
  },
  {
    name: 'Dra. Valentina Ruiz',
    specialty: 'Reiki & Sanación Energética',
    schedule: 'MIE/VIE 15:00–20:00',
    scheduleSlots: [{ days: ['MIE','VIE'], from: '15:00', to: '20:00' }],
    room: 'Consultorio C',
    ig: '@dra.ruiz',
    tel: '+54 911 4444-1006',
    email: 'valentina.ruiz@gmail.com',
    activo: true,
    color: '#A79BB7',
    descripcion: 'Sesiones de Reiki y sanación energética para restablecer el equilibrio del cuerpo y la mente. Trabaja con imposición de manos, cristales y aromaterapia. Ideal como complemento a tratamientos psicológicos o médicos.'
  },
  {
    name: 'Lic. Sofía Peralta',
    specialty: 'Coaching Ontológico',
    schedule: 'LUN/MIE 10:00–14:00',
    scheduleSlots: [{ days: ['LUN','MIE'], from: '10:00', to: '14:00' }],
    room: 'Consultorio B',
    ig: '@lic.peralta',
    tel: '+54 911 4444-1007',
    email: 'sofia.peralta@gmail.com',
    activo: true,
    color: '#D9C39B',
    descripcion: 'Coaching ontológico para transformar tu manera de observar la vida. Sesiones individuales enfocadas en liderazgo personal, transiciones de carrera y desarrollo de habilidades conversacionales.'
  },
  {
    name: 'Dr. Marcos Delgado',
    specialty: 'Osteopatía',
    schedule: 'MAR/JUE/SAB 09:00–13:00',
    scheduleSlots: [{ days: ['MAR','JUE','SAB'], from: '09:00', to: '13:00' }],
    room: 'Consultorio B',
    ig: '@dr.delgado',
    tel: '+54 911 4444-1008',
    email: 'marcos.delgado@gmail.com',
    activo: true,
    color: '#8E8279',
    descripcion: 'Osteopatía estructural y visceral. Tratamiento manual para dolores musculares, contracturas, cefaleas y problemas posturales. Enfoque integral que busca la causa del dolor, no solo el síntoma.'
  }
];

const fallbackWorkshopsData = [
  { name: 'Yoga Terapéutico', instructor: 'Prof. Lucas Méndez', schedule: 'Martes y Jueves 18:00', occupied: 12, total: 15, color: '#C4956A', active: true, sessions: [], descripcion: 'Yoga adaptado a cada persona.' },
  { name: 'Taller de Cuencos Tibetanos', instructor: 'Dra. Valentina Ruiz', schedule: 'Sábados 16:00', occupied: 8, total: 10, color: '#7A8B6F', active: true, sessions: [], descripcion: 'Sanación sonora con cuencos tibetanos.' },
  { name: 'Meditación & Mindfulness', instructor: 'Lic. Daniel Rodríguez', schedule: 'Miércoles 19:00', occupied: 10, total: 12, color: '#C4956A', active: true, sessions: [], descripcion: 'Meditación guiada y mindfulness.' },
];

// Inicialización síncrona por defecto (para file://)
if (!window._profData) {
  window._profData = fallbackProfData;
}
if (!window._workshopsData) {
  window._workshopsData = fallbackWorkshopsData;
}
if (!window._roomsData) {
  window._roomsData = [
    { name: 'Consultorio A', idx: 0, pct: 78, hours: 62, price: 3000 },
    { name: 'Consultorio B', idx: 1, pct: 62, hours: 50, price: 2500 },
    { name: 'Consultorio C', idx: 2, pct: 89, hours: 71, price: 3500 },
    { name: 'Consultorio D', idx: 3, pct: 45, hours: 36, price: 2000 },
    { name: 'Hall',          idx: 4, pct: 30, hours: 24, price: 1500 },
    { name: 'Espacio Coworking', idx: 5, pct: 40, hours: 32, price: 1200 }
  ];
}
if (!window._agendaCustomSlots) {
  window._agendaCustomSlots = {};
}

// ── Carga asíncrona desde servidor (db.json) ──
window.loadDataFromServer = async function() {
  try {
    if (window.location.protocol !== 'file:') {
      const response = await fetch('db.json');
      if (response.ok) {
        const data = await response.json();
        if (data.profesionales) window._profData = data.profesionales;
        if (data.talleres) window._workshopsData = data.talleres;
        if (data.turnos) window._agendaCustomSlots = data.turnos;
        console.log("Nowo: Datos cargados exitosamente desde db.json.");
      } else {
        console.warn("Nowo: No se pudo leer db.json (HTTP " + response.status + "), usando fallback local.");
      }
    }
  } catch (e) {
    console.warn("Nowo: Error cargando db.json, usando fallback local:", e);
  }
};
