import fs from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '../db.json');

// Lee toda la base de datos local
export async function readDB() {
  try {
    const content = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error("Error leyendo db.json, intentando inicializar vacío:", error);
    return { profesionales: [], talleres: [], turnos: {}, interesados: [] };
  }
}

// Escribe los cambios de vuelta al JSON
export async function writeDB(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Obtener profesionales activos
export async function getActiveProfessionals(specialtyFilter = null) {
  const db = await readDB();
  let list = db.profesionales || [];
  list = list.filter(p => p.activo !== false);
  if (specialtyFilter) {
    const filter = specialtyFilter.toLowerCase();
    list = list.filter(p => p.specialty.toLowerCase().includes(filter));
  }
  return list;
}

// Obtener talleres activos
export async function getActiveWorkshops() {
  const db = await readDB();
  return (db.talleres || []).filter(w => w.active !== false);
}

// Buscar disponibilidad de un profesional para una fecha específica
// Lógica: Cruzar scheduleSlots del profesional con los turnos ya agendados en db.json
export async function checkAvailability(profName, dateKey) {
  const db = await readDB();
  const prof = (db.profesionales || []).find(
    p => p.name.toLowerCase().includes(profName.toLowerCase()) && p.activo !== false
  );

  if (!prof) {
    throw new Error(`Profesional "${profName}" no encontrado o inactivo.`);
  }

  // Mapear día de la semana (dateKey formato YYYY-MM-DD)
  // Nota: necesitamos parsear la fecha de forma que coincida con los días (LUN, MAR, MIE, JUE, VIE, SAB, DOM)
  const daysOfWeek = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
  const dateObj = new Date(dateKey + 'T00:00:00');
  const dayName = daysOfWeek[dateObj.getDay()];

  // Buscar slots válidos para el profesional ese día
  const slotsConfig = prof.scheduleSlots || [];
  const activeSlots = slotsConfig.filter(s => s.days.includes(dayName));

  if (activeSlots.length === 0) {
    return {
      profName: prof.name,
      date: dateKey,
      availableSlots: [],
      reason: `El profesional no atiende los días ${dayName}.`
    };
  }

  // Consultorios
  const roomIdxMap = {
    'Consultorio A': 0,
    'Consultorio B': 1,
    'Consultorio C': 2,
    'Consultorio D': 3,
    'Hall': 4
  };
  const roomIdx = roomIdxMap[prof.room] !== undefined ? roomIdxMap[prof.room] : 0;

  // Turnos ya agendados para este día en la agenda
  const dayBookings = (db.turnos || {})[dateKey] || {};

  // Generar slots de 1 hora dentro de los rangos de atención
  const availableSlots = [];
  
  for (const slot of activeSlots) {
    // Ejemplo: from: '09:00', to: '16:00'
    const startHour = parseInt(slot.from.split(':')[0]);
    const endHour = parseInt(slot.to.split(':')[0]);

    for (let h = startHour; h < endHour; h++) {
      const hourStr = `${String(h).padStart(2, '0')}:00`;
      const slotKey = `${hourStr}-${roomIdx}`; // Formato de clave: "14:00-2"

      // Si no hay un turno asignado a ese slotKey, o si el tipo es 'empty', entonces está disponible
      const isBooked = dayBookings[slotKey] && dayBookings[slotKey].type !== 'empty';
      
      if (!isBooked) {
        availableSlots.push({
          hour: hourStr,
          room: prof.room,
          consultorioIndex: roomIdx
        });
      }
    }
  }

  return {
    profName: prof.name,
    specialty: prof.specialty,
    room: prof.room,
    date: dateKey,
    dayOfWeek: dayName,
    availableSlots
  };
}

// Agendar un turno nuevo en la agenda y guardarlo en db.json
export async function bookAppointment(profName, dateKey, hour, patientName, patientTel, service) {
  const db = await readDB();
  const prof = (db.profesionales || []).find(
    p => p.name.toLowerCase().includes(profName.toLowerCase()) && p.activo !== false
  );

  if (!prof) {
    throw new Error(`Profesional "${profName}" no encontrado o inactivo.`);
  }

  const roomIdxMap = {
    'Consultorio A': 0,
    'Consultorio B': 1,
    'Consultorio C': 2,
    'Consultorio D': 3,
    'Hall': 4
  };
  const roomIdx = roomIdxMap[prof.room] !== undefined ? roomIdxMap[prof.room] : 0;
  const slotKey = `${hour}-${roomIdx}`;

  // Verificar disponibilidad una vez más
  if (!db.turnos) db.turnos = {};
  if (!db.turnos[dateKey]) db.turnos[dateKey] = {};

  const existingSlot = db.turnos[dateKey][slotKey];
  if (existingSlot && existingSlot.type !== 'empty') {
    throw new Error(`El horario ${hour} en el ${prof.room} ya está ocupado por: ${existingSlot.name}.`);
  }

  // Agendar
  db.turnos[dateKey][slotKey] = {
    name: prof.name,
    type: 'profesional',
    patient: {
      nombre: patientName,
      telefono: patientTel || '',
      servicio: service || prof.specialty
    }
  };

  await writeDB(db);

  return {
    success: true,
    profName: prof.name,
    room: prof.room,
    date: dateKey,
    hour,
    patient: db.turnos[dateKey][slotKey].patient
  };
}

// Registrar profesional interesado en alquilar
export async function addInterestedApplicant(name, specialty, tel, ig, description) {
  const db = await readDB();
  if (!db.interesados) db.interesados = [];

  const newApplicant = {
    name,
    specialty,
    tel,
    ig: ig || 'No especificado',
    time: "Hoy (vía MCP)",
    status: "pending",
    description: description || "Interesado/a captado por el Servidor MCP"
  };

  db.interesados.push(newApplicant);
  await writeDB(db);
  return newApplicant;
}

// Agregar sesión de taller en el Hall u otro espacio
export async function scheduleWorkshopSession(tallerName, date, timeStart, timeEnd, space, price) {
  const db = await readDB();
  if (!db.talleres) db.talleres = [];

  const workshop = db.talleres.find(
    w => w.name.toLowerCase().includes(tallerName.toLowerCase()) && w.active !== false
  );

  if (!workshop) {
    throw new Error(`Taller "${tallerName}" no encontrado o inactivo.`);
  }

  if (!workshop.sessions) workshop.sessions = [];

  const newSession = {
    date,
    timeStart,
    timeEnd: timeEnd || '',
    space: space || 'Hall',
    price: parseInt(price) || 0,
    inscriptos: 0
  };

  workshop.sessions.push(newSession);
  await writeDB(db);

  return {
    success: true,
    tallerName: workshop.name,
    instructor: workshop.instructor,
    session: newSession
  };
}
