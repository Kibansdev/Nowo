// ══════════════════════════════════════════════════════════
// Profesionales — Equipo Espacio Alvarado
// 17 profesionales activos · Gestión del equipo
// Ficha editable con descripción para el agente IA
// ══════════════════════════════════════════════════════════

window.renderNUWOConnect = function (container) {

  // ── Avatar color rotation ──
  const avatarColors = ['#7A8B6F', '#C4956A', '#2C2C34', '#9BAF93'];
  const sage = '#7A8B6F';
  const terracotta = '#C4956A';
  const lightSage = '#E8EDE5';

  // ── Active professionals (con descripción para el agente IA) ──
  const professionals = window._profData || [
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
      descripcion: 'Terapia Gestalt orientada al aquí y ahora. Trabaja con la conciencia corporal y emocional para facilitar procesos de cambio. Ideal para quienes buscan conectar con sus emociones y vivir de forma más auténtica.'
    },
    {
      name: 'Prof. Lucas Méndez',
      specialty: 'Yoga Terapéutico',
      schedule: 'MAR/JUE/SAB 08:00–12:00',
      scheduleSlots: [{ days: ['MAR','JUE','SAB'], from: '08:00', to: '12:00' }],
      room: 'Consultorio D',
      ig: '@prof.mendez',
      tel: '+54 911 4444-1005',
      email: 'lucas.mendez@gmail.com',
      activo: true,
      descripcion: 'Yoga terapéutico adaptado a cada persona. Clases individuales y grupales que combinan posturas, respiración y meditación. Especialmente indicado para dolor crónico, recuperación postural y manejo del estrés.'
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
      descripcion: 'Osteopatía estructural y visceral. Tratamiento manual para dolores musculares, contracturas, cefaleas y problemas posturales. Enfoque integral que busca la causa del dolor, no solo el síntoma.'
    },
  ];

  // ── New applicants (captured by bot) ──
  const applicants = [
    { name: 'Dr. Carlos López',     specialty: 'Kinesiología Deportiva',    tel: '+54 911 5555-1234', ig: '@dr.lopez',   time: 'Hace 2 días', status: 'pending' },
    { name: 'Lic. Ana Belén Sosa',  specialty: 'Coach Ontológico',          tel: '+54 911 5555-5678', ig: '@lic.sosa',   time: 'Hace 5 días', status: 'contacted' },
    { name: 'Prof. Julián Ramos',   specialty: 'Meditación & Mindfulness',  tel: '+54 911 5555-9012', ig: '@prof.ramos', time: 'Hace 1 día',  status: 'pending' },
  ];

  // ── Helper: get initials from name ──
  function getInitial(name) {
    const parts = name.split(' ');
    return parts.length > 1 ? parts[1].charAt(0) : parts[0].charAt(0);
  }

  // ══════════════════════════════════════════
  // Modal de ficha editable del profesional
  // ══════════════════════════════════════════
  function openProfileModal(prof, index) {
    // Remove existing modal if any
    const existing = document.querySelector('.profile-modal-overlay');
    if (existing) existing.remove();

    const color = avatarColors[index % avatarColors.length];

    const overlay = document.createElement('div');
    overlay.className = 'profile-modal-overlay';
    overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.45); backdrop-filter:blur(6px); z-index:9999; display:flex; align-items:center; justify-content:center; animation: fadeIn 0.2s ease;';

    // ── Serialise slots → human-readable + agent string ──
    function slotsToString(slots) {
      if (!slots || !slots.length) return '';
      return slots.map(s => `${s.days.join('/')} ${s.from}–${s.to}`).join(' | ');
    }

    // ── Build initial slots state from prof ──
    let _slots = JSON.parse(JSON.stringify(
      prof.scheduleSlots && prof.scheduleSlots.length
        ? prof.scheduleSlots
        : [{ days: [], from: '09:00', to: '18:00' }]
    ));

    // ── Render the schedule picker into #schedule-picker-root ──
    function renderSchedulePicker() {
      const root = document.getElementById('schedule-picker-root');
      if (!root) return;
      const DAYS = ['LUN','MAR','MIE','JUE','VIE','SAB','DOM'];
      root.innerHTML = _slots.map((slot, si) => `
        <div class="sched-block" data-si="${si}" style="background:${lightSage}; border:1px solid ${sage}30; border-radius:10px; padding:14px 14px 10px; margin-bottom:10px; position:relative;">
          ${ _slots.length > 1 ? `<button onclick="window._removeScheduleSlot(${si})" title="Eliminar bloque"
            style="position:absolute;top:8px;right:10px;background:none;border:none;color:#ccc;font-size:1rem;cursor:pointer;line-height:1;" onmouseover="this.style.color='#c0392b'" onmouseout="this.style.color='#ccc'">✕</button>` : '' }
          <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${sage};margin-bottom:8px;">Días</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
            ${DAYS.map(d => {
              const active = slot.days.includes(d);
              return `<button
                onclick="window._toggleScheduleDay(${si},'${d}')"
                style="
                  padding:5px 10px; border-radius:20px; font-size:0.8rem; font-weight:700; cursor:pointer; transition:all 0.15s;
                  background:${ active ? sage : 'rgba(0,0,0,0.05)' };
                  color:${ active ? '#fff' : 'var(--color-text-muted)' };
                  border:1.5px solid ${ active ? sage : 'transparent' };
                ">${d}</button>`;
            }).join('')}
          </div>
          <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${sage};margin-bottom:8px;">Horario</div>
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="flex:1;">
              <div style="font-size:0.7rem;color:var(--color-text-muted);margin-bottom:3px;">Desde</div>
              <input type="time" value="${slot.from}"
                style="width:100%;padding:7px 10px;border:1px solid rgba(0,0,0,0.12);border-radius:6px;font-size:0.9rem;font-weight:600;background:#fff;outline:none;"
                onchange="window._updateScheduleTime(${si},'from',this.value)">
            </div>
            <div style="padding-top:18px;color:var(--color-text-muted);font-size:1rem;">→</div>
            <div style="flex:1;">
              <div style="font-size:0.7rem;color:var(--color-text-muted);margin-bottom:3px;">Hasta</div>
              <input type="time" value="${slot.to}"
                style="width:100%;padding:7px 10px;border:1px solid rgba(0,0,0,0.12);border-radius:6px;font-size:0.9rem;font-weight:600;background:#fff;outline:none;"
                onchange="window._updateScheduleTime(${si},'to',this.value)">
            </div>
          </div>
        </div>
      `).join('');

      // Live preview
      const preview = document.getElementById('schedule-preview');
      if (preview) {
        const str = slotsToString(_slots);
        preview.textContent = str || '—';
      }
    }

    window._toggleScheduleDay = function(si, day) {
      const idx = _slots[si].days.indexOf(day);
      if (idx === -1) _slots[si].days.push(day);
      else _slots[si].days.splice(idx, 1);
      // keep canonical order
      const order = ['LUN','MAR','MIE','JUE','VIE','SAB','DOM'];
      _slots[si].days.sort((a,b) => order.indexOf(a) - order.indexOf(b));
      renderSchedulePicker();
    };
    window._updateScheduleTime = function(si, field, val) {
      _slots[si][field] = val;
      renderSchedulePicker();
    };
    window._removeScheduleSlot = function(si) {
      _slots.splice(si, 1);
      renderSchedulePicker();
    };
    window._addScheduleSlot = function() {
      _slots.push({ days: [], from: '09:00', to: '18:00' });
      renderSchedulePicker();
    };

    overlay.innerHTML = `
      <style>
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .profile-modal { animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1); }
        .profile-modal label { display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 5px; }
        .profile-modal input[type=text], .profile-modal input[type=email],
        .profile-modal textarea, .profile-modal select {
          width: 100%; padding: 9px 12px; border: 1px solid rgba(0,0,0,0.12); border-radius: var(--radius-sm);
          font-family: var(--font-main); font-size: 0.88rem; color: var(--color-text-primary);
          background: var(--bg-card-alt); transition: border-color 0.2s; outline: none;
        }
        .profile-modal input[type=text]:focus, .profile-modal input[type=email]:focus,
        .profile-modal textarea:focus, .profile-modal select:focus {
          border-color: ${sage}; box-shadow: 0 0 0 3px ${sage}22;
        }
        .profile-modal textarea { resize: vertical; min-height: 100px; line-height: 1.6; }
        .profile-modal .field-group { margin-bottom: 14px; }
        .profile-modal .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .profile-modal .desc-hint { font-size: 0.72rem; color: var(--color-text-muted); margin-top: 4px; font-style: italic; }
      </style>

      <div class="profile-modal" style="background: var(--bg-card); border-radius: var(--radius-lg); width: 620px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-float); padding: 0;">

        <!-- Header con avatar -->
        <div style="padding: 28px 28px 0; display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
          <div style="width: 56px; height: 56px; background: ${color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 700; color: #fff; flex-shrink: 0;">
            ${getInitial(prof.name)}
          </div>
          <div style="flex: 1;">
            <h2 style="margin: 0; font-size: 1.35rem; color: var(--color-text-primary);">${prof.name}</h2>
            <span class="badge" style="background: ${lightSage}; color: ${sage}; border-color: ${sage}40; margin-top: 4px; display: inline-block;">${prof.specialty}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: var(--radius-pill); font-size: 0.72rem; font-weight: 700; background: ${prof.activo ? '#E8F5E9' : '#FFF3E0'}; color: ${prof.activo ? '#2E7D32' : '#E68A00'};">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: ${prof.activo ? '#2E7D32' : '#E68A00'};"></span>
              ${prof.activo ? 'Activo' : 'Inactivo'}
            </span>
            <button onclick="this.closest('.profile-modal-overlay').remove()" style="width: 32px; height: 32px; border-radius: 50%; background: rgba(0,0,0,0.06); color: var(--color-text-muted); font-size: 1.1rem; display: flex; align-items: center; justify-content: center;">✕</button>
          </div>
        </div>

        <!-- Formulario -->
        <div style="padding: 0 28px 8px;">

          <!-- Descripción del servicio (campo principal para el agente) -->
          <div class="field-group" style="background: ${lightSage}; border-radius: var(--radius-md); padding: 16px; border: 1px solid ${sage}30;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <label style="margin: 0; color: ${sage}; font-weight: 800;">Descripción del servicio para el Agente IA</label>
            </div>
            <textarea id="prof-descripcion">${prof.descripcion}</textarea>
            <p class="desc-hint">Este texto es lo que el bot de WhatsApp usa para presentar al profesional ante los pacientes. Sé descriptivo/a, cálido/a y mencioná el enfoque único.</p>
          </div>

          <!-- Datos de contacto -->
          <div class="field-row">
            <div class="field-group">
              <label>Nombre completo</label>
              <input type="text" value="${prof.name}" id="prof-name">
            </div>
            <div class="field-group">
              <label>Especialidad</label>
              <input type="text" value="${prof.specialty}" id="prof-specialty">
            </div>
          </div>

          <div class="field-row">
            <div class="field-group">
              <label>Teléfono</label>
              <input type="text" value="${prof.tel}" id="prof-tel">
            </div>
            <div class="field-group">
              <label>Email</label>
              <input type="text" value="${prof.email}" id="prof-email">
            </div>
          </div>

          <div class="field-row">
            <div class="field-group">
              <label>Instagram</label>
              <input type="text" value="${prof.ig}" id="prof-ig">
            </div>
            <div class="field-group">
              <label>Consultorio asignado</label>
              <select id="prof-room">
                <option ${prof.room === 'Consultorio A' ? 'selected' : ''}>Consultorio A</option>
                <option ${prof.room === 'Consultorio B' ? 'selected' : ''}>Consultorio B</option>
                <option ${prof.room === 'Consultorio C' ? 'selected' : ''}>Consultorio C</option>
                <option ${prof.room === 'Consultorio D' ? 'selected' : ''}>Consultorio D</option>
              </select>
            </div>
          </div>

          <!-- Horarios: selector visual -->
          <div class="field-group" style="border:1px solid rgba(0,0,0,0.08); border-radius:var(--radius-md); padding:16px; background:var(--bg-card-alt);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <label style="margin:0;">Horarios de atención</label>
              <button onclick="window._addScheduleSlot()"
                style="padding:4px 12px; font-size:0.78rem; font-weight:700; border-radius:20px;
                       background:${sage}18; color:${sage}; border:1.5px solid ${sage}40; cursor:pointer;"
                onmouseover="this.style.background='${sage}30'" onmouseout="this.style.background='${sage}18'">
                + Agregar bloque
              </button>
            </div>

            <div id="schedule-picker-root"></div>

            <!-- Preview para el agente -->
            <div style="margin-top:10px; padding:10px 12px; background:${sage}12; border-radius:8px; border:1px dashed ${sage}40;">
              <div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:${sage}; margin-bottom:4px;">Vista del agente IA</div>
              <div id="schedule-preview" style="font-size:0.82rem; font-weight:600; color:var(--color-text-primary); font-family:monospace;"></div>
            </div>
          </div>

          <div class="field-group">
            <label>Estado</label>
            <select id="prof-status">
              <option value="true" ${prof.activo ? 'selected' : ''}>Activo — El bot lo ofrece</option>
              <option value="false" ${!prof.activo ? 'selected' : ''}>Inactivo — Oculto del bot</option>
            </select>
          </div>

        </div>

        <!-- Footer con acciones -->
        <div style="padding: 16px 28px 24px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(0,0,0,0.06); margin-top: 8px;">
          <button onclick="this.closest('.profile-modal-overlay').remove()" style="padding: 9px 20px; font-size: 0.85rem; background: transparent; color: var(--color-text-muted); font-weight: 500;">
            Cancelar
          </button>
          <div style="display: flex; gap: 10px;">
            <button style="padding: 9px 20px; font-size: 0.85rem; background: #FDECEA; color: #C0392B; border-radius: var(--radius-sm); font-weight: 600;"
              onclick="alert('Profesional desactivado'); this.closest('.profile-modal-overlay').remove()">
              Desactivar
            </button>
            <button class="button-primary" style="padding: 9px 24px; font-size: 0.85rem;"
              onclick="
                const newSlots = JSON.parse(JSON.stringify(window._currentModalSlots || []));
                const schedStr = newSlots.map(s => s.days.join('/') + ' ' + s.from + '–' + s.to).join(' | ');
                window._profData[${index}] = {
                  ...window._profData[${index}],
                  name: document.getElementById('prof-name').value,
                  specialty: document.getElementById('prof-specialty').value,
                  tel: document.getElementById('prof-tel').value,
                  email: document.getElementById('prof-email').value,
                  ig: document.getElementById('prof-ig').value,
                  room: document.getElementById('prof-room').value,
                  schedule: schedStr,
                  scheduleSlots: newSlots,
                  activo: document.getElementById('prof-status').value === 'true',
                  descripcion: document.getElementById('prof-descripcion').value
                };
                this.closest('.profile-modal-overlay').remove();
                window.renderNUWOConnect(document.querySelector('.content-area'));
                alert('Cambios guardados. El agente IA de WhatsApp utilizará los horarios actualizados.');
              ">
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    `;

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    document.body.appendChild(overlay);
  }

  // Make openProfileModal available globally for onclick handlers
  window._openProfileModal = openProfileModal;
  window._profData = professionals;

  // ── New Professional Modal ──
  window._openNewProfModal = function() {
    const existing = document.querySelector('.new-prof-overlay');
    if (existing) existing.remove();

    const sage = '#7A8B6F';
    const overlay = document.createElement('div');
    overlay.className = 'new-prof-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease;';

    overlay.innerHTML = `
      <style>
        .newprof-modal input, .newprof-modal textarea, .newprof-modal select {
          width:100%; padding:9px 12px; border:1px solid rgba(0,0,0,0.12); border-radius:6px;
          font-family:var(--font-main); font-size:0.88rem; color:var(--color-text-primary);
          background:var(--bg-card-alt); outline:none; transition:border-color 0.2s; box-sizing:border-box;
        }
        .newprof-modal input:focus, .newprof-modal textarea:focus, .newprof-modal select:focus { border-color:${sage}; box-shadow:0 0 0 3px ${sage}22; }
        .newprof-modal textarea { resize:vertical; min-height:70px; }
        .newprof-modal label { display:block; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--color-text-muted); margin-bottom:5px; }
      </style>
      <div class="newprof-modal" style="background:var(--bg-card);border-radius:var(--radius-lg);width:480px;max-height:90vh;overflow-y:auto;box-shadow:var(--shadow-float);padding:0;">
        <div style="padding:24px 28px 0;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h2 style="margin:0;font-size:1.15rem;color:var(--color-text-primary);">Nuevo Profesional</h2>
            <button onclick="this.closest('.new-prof-overlay').remove()" style="width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,0.06);color:var(--color-text-muted);font-size:1.1rem;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;">✕</button>
          </div>
        </div>

        <div style="padding:0 28px 20px;display:flex;flex-direction:column;gap:14px;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
            <div>
              <label>Nombre completo</label>
              <input type="text" id="newprof-name" placeholder="Ej: Lic. Ana López">
            </div>
            <div>
              <label>Especialidad</label>
              <input type="text" id="newprof-specialty" placeholder="Ej: Psicología Clínica">
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
            <div>
              <label>Teléfono</label>
              <input type="tel" id="newprof-tel" placeholder="+54 911 ____-____">
            </div>
            <div>
              <label>Email</label>
              <input type="email" id="newprof-email" placeholder="nombre@email.com">
            </div>
          </div>

          <div>
            <label>Descripción del servicio</label>
            <textarea id="newprof-desc" placeholder="Describí brevemente el enfoque y servicios que ofrece este profesional. El Asistente IA usará este texto para presentarlo a los pacientes."></textarea>
          </div>

          <div>
            <label>Instagram</label>
            <input type="text" id="newprof-ig" placeholder="@usuario">
          </div>

        </div>

        <div style="padding:14px 28px 22px;display:flex;justify-content:flex-end;gap:10px;border-top:1px solid rgba(0,0,0,0.06);">
          <button onclick="this.closest('.new-prof-overlay').remove()" style="padding:9px 20px;font-size:0.85rem;background:transparent;color:var(--color-text-muted);border:1px solid rgba(0,0,0,0.12);border-radius:8px;font-weight:600;cursor:pointer;">Cancelar</button>
          <button onclick="window._saveNewProf()" style="padding:9px 24px;font-size:0.85rem;background:${sage};color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;">Crear Profesional</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  };

  window._saveNewProf = function() {
    const name = document.getElementById('newprof-name')?.value?.trim();
    const specialty = document.getElementById('newprof-specialty')?.value?.trim();
    const tel = document.getElementById('newprof-tel')?.value?.trim() || '';
    const email = document.getElementById('newprof-email')?.value?.trim() || '';
    const desc = document.getElementById('newprof-desc')?.value?.trim() || '';
    const ig = document.getElementById('newprof-ig')?.value?.trim() || '';

    if (!name) { alert('Ingresá el nombre del profesional'); return; }
    if (!specialty) { alert('Ingresá la especialidad'); return; }

    const newProf = {
      name,
      specialty,
      schedule: 'Asignar en Actividad',
      scheduleSlots: [],
      room: '',
      ig,
      tel,
      email,
      activo: true,
      descripcion: desc || 'Profesional del equipo de Espacio Alvarado.'
    };

    window._profData.push(newProf);
    document.querySelector('.new-prof-overlay')?.remove();

    // Re-render
    const contentArea = document.querySelector('.content-area');
    if (contentArea && window.renderNUWOConnect) {
      window.renderNUWOConnect(contentArea);
    }
  };

  // ── Helper: render active professional card ──
  function renderProfCard(prof, index) {
    const color = avatarColors[index % avatarColors.length];
    const descPreview = prof.descripcion.length > 60 ? prof.descripcion.substring(0, 60) + '...' : prof.descripcion;

    return `
      <div class="card profile-card" style="text-align: center;">
        <!-- Avatar -->
        <div style="width: 64px; height: 64px; background: ${color}; border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 700; color: #fff; letter-spacing: -0.02em;">
          ${getInitial(prof.name)}
        </div>

        <!-- Name -->
        <h4 style="margin: 0 0 6px; font-size: 0.95rem; font-weight: 700; color: var(--color-text-primary);">${prof.name}</h4>

        <!-- Specialty badge -->
        <span class="badge" style="display: inline-block; margin-bottom: 10px; background: ${lightSage}; color: ${sage}; border-color: ${sage}40;">
          ${prof.specialty}
        </span>

        <!-- Description preview -->
        <p style="font-size: 0.76rem; color: var(--color-text-muted); line-height: 1.5; margin: 0 0 10px; font-style: italic; min-height: 34px;">
          "${descPreview}"
        </p>

        <!-- Details -->
        <div style="text-align: left; font-size: 0.8rem; color: var(--color-text-secondary); line-height: 1.8;">
          <p style="margin: 0;">${prof.schedule}</p>
          <p style="margin: 0;">${prof.room}</p>
          <p style="margin: 0; color: var(--color-text-muted);">${prof.ig}</p>
        </div>

        <!-- Actions -->
        <div style="display: flex; gap: 8px; margin-top: 14px;">
          <button class="button-secondary" style="flex: 1; padding: 7px 10px; font-size: 0.8rem;"
            onclick="window._openProfileModal(window._profData[${index}], ${index})">Ver perfil</button>
          <button style="flex: 0; padding: 7px 14px; font-size: 0.8rem; background: transparent; color: var(--color-text-muted); border: none; font-weight: 500;"
            onclick="window._openProfileModal(window._profData[${index}], ${index})">Editar</button>
        </div>
      </div>
    `;
  }

  // ── Helper: render applicant card ──
  function renderApplicantCard(app) {
    const isPending = app.status === 'pending';

    const statusBadge = isPending
      ? `<span style="display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 700; background: #FFF3E0; color: #E68A00; border: 1px solid rgba(230,138,0,0.25);">Pendiente</span>`
      : `<span style="display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 700; background: #E8F5E9; color: #2E7D32; border: 1px solid rgba(46,125,50,0.25);">Contactada</span>`;

    const actions = isPending
      ? `
        <button class="button-primary" style="padding: 7px 18px; font-size: 0.82rem;"
          onclick="alert('Contactando a ${app.name}')">Contactar</button>
        <button style="padding: 7px 14px; font-size: 0.82rem; background: transparent; color: var(--color-text-muted); border: none; font-weight: 500;"
          onclick="alert('Descartado')">Descartar</button>
      `
      : `
        <button class="button-secondary" style="padding: 7px 18px; font-size: 0.82rem;"
          onclick="alert('Detalle de ${app.name}')">Ver detalle</button>
      `;

    return `
      <div class="card" style="display: flex; align-items: center; gap: 18px; flex-wrap: wrap;">
        <!-- Avatar -->
        <div style="width: 48px; height: 48px; background: ${terracotta}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 700; color: #fff; flex-shrink: 0;">
          ${getInitial(app.name)}
        </div>

        <!-- Info -->
        <div style="flex: 1; min-width: 200px;">
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 4px;">
            <strong style="font-size: 0.92rem; color: var(--color-text-primary);">${app.name}</strong>
            ${statusBadge}
          </div>
          <p style="margin: 0 0 2px; font-size: 0.82rem; color: var(--color-text-secondary);">${app.specialty}</p>
          <p style="margin: 0; font-size: 0.78rem; color: var(--color-text-muted);">
            ${app.tel} · ${app.ig} · <span style="font-style: italic;">${app.time}</span>
          </p>
        </div>

        <!-- Actions -->
        <div style="display: flex; gap: 8px; align-items: center;">
          ${actions}
        </div>
      </div>
    `;
  }

  // ══════════════════════════════════════════
  // Render full view
  // ══════════════════════════════════════════
  container.innerHTML = `
    <!-- ── Header ────────────────────────── -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;">
      <div class="dashboard-header" style="margin-bottom:0;">
        <h1>Profesionales</h1>
        <p class="dashboard-subtitle">EQUIPO ESPACIO ALVARADO · ${professionals.filter(p=>p.activo!==false).length} ACTIVOS</p>
      </div>
      <button class="button-primary" onclick="window._openNewProfModal()" style="display:flex;align-items:center;gap:8px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Nuevo Profesional
      </button>
    </div>

    <!-- ── Section A: Equipo activo ─────── -->
    <div style="margin-bottom: 16px;">
      <h3 style="margin-bottom: 16px;">Equipo activo</h3>
      <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
        ${professionals.map((p, i) => renderProfCard(p, i)).join('')}
      </div>
      <p style="margin-top: 18px; text-align: center;">
        <a href="#" style="color: ${sage}; font-size: 0.88rem; font-weight: 600; text-decoration: none;"
           onclick="event.preventDefault(); alert('Mostrando todos los profesionales')">
          Ver todos los profesionales (17) →
        </a>
      </p>
    </div>

    <!-- ── Divider ───────────────────────── -->
    <hr style="border: none; border-top: 1px solid rgba(0,0,0,0.08); margin: 32px 0;">

    <!-- ── Section B: Nuevos interesados ── -->
    <div>
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
        <h3 style="margin: 0;">Nuevos interesados</h3>
        <span style="display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 700; background: #FDECEA; color: #C0392B; border: 1px solid rgba(192,57,43,0.2);">
          3 sin revisar
        </span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${applicants.map(a => renderApplicantCard(a)).join('')}
      </div>
    </div>
  `;
};
