// ══════════════════════════════════════════════════════════
// Profesionales — Equipo Espacio Alvarado
// 17 profesionales activos · Gestión del equipo
// Ficha editable con descripción para el agente IA
// ══════════════════════════════════════════════════════════

window.renderNUWOConnect = function (container) {
  
  function getDefaultServices(prof) {
    if (prof.services && prof.services.length > 0) {
      return prof.services;
    }
    let price = 3000;
    if (prof.room === 'Consultorio A') price = 3000;
    else if (prof.room === 'Consultorio B') price = 2500;
    else if (prof.room === 'Consultorio C') price = 3500;
    else if (prof.room === 'Consultorio D') price = 2000;
    return [
      { name: prof.specialty || 'Consulta General', price: price, duration: 60, description: '' }
    ];
  }

  window._addServiceRow = function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const div = document.createElement('div');
    div.className = containerId === 'services-container' ? 'prof-service-row' : 'newprof-service-row';
    div.style.cssText = 'background:var(--bg-card-alt); border:1px solid rgba(0,0,0,0.08); border-radius:var(--radius-sm); padding:16px; margin-bottom:12px; position:relative; text-align:left; box-sizing:border-box;';
    
    div.innerHTML = `
      <div style="position:absolute; right:12px; top:12px;">
        <button type="button" onclick="this.closest('.' + (containerId === 'services-container' ? 'prof-service-row' : 'newprof-service-row')).remove()" 
          style="background:none; border:none; color:#C4956A; cursor:pointer; padding:6px; display:flex; align-items:center; justify-content:center; border-radius:50%; transition:background 0.2s;"
          onmouseover="this.style.background='rgba(196,149,106,0.1)'"
          onmouseout="this.style.background='none'"
          title="Eliminar servicio">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4956A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
      <div style="display:grid; grid-template-columns: 2fr 1fr; gap:14px; margin-bottom:10px; padding-right:40px;">
        <div>
          <label style="display:block; font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--color-text-muted); margin-bottom:4px;">Título del Servicio</label>
          <input type="text" class="service-name" placeholder="Ej: Consulta Inicial" value="" 
            style="width:100%; padding:9px 12px; border:1px solid rgba(0,0,0,0.12); border-radius:var(--radius-sm); font-family:var(--font-main); font-size:0.85rem; color:var(--color-text-primary); background:var(--bg-card); outline:none; box-sizing:border-box;">
        </div>
        <div>
          <label style="display:block; font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--color-text-muted); margin-bottom:4px;">Precio ($)</label>
          <div style="position:relative; width:100%;">
            <span style="position:absolute; left:10px; top:50%; transform:translateY(-50%); font-size:0.85rem; color:var(--color-text-secondary); font-weight:600;">$</span>
            <input type="number" class="service-price" placeholder="Valor" value="" 
              style="width:100%; padding:9px 12px 9px 22px; font-size:0.85rem; text-align:right; border:1px solid rgba(0,0,0,0.12); border-radius:var(--radius-sm); font-family:var(--font-main); color:var(--color-text-primary); background:var(--bg-card); outline:none; box-sizing:border-box;">
          </div>
        </div>
      </div>
      <div>
        <label style="display:block; font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--color-text-muted); margin-bottom:4px;">Descripción del Servicio</label>
        <textarea class="service-description" placeholder="Explicá de qué trata el servicio..." 
          style="width:100%; padding:9px 12px; border:1px solid rgba(0,0,0,0.12); border-radius:var(--radius-sm); font-family:var(--font-main); font-size:0.85rem; color:var(--color-text-primary); background:var(--bg-card); outline:none; box-sizing:border-box; min-height:50px; resize:vertical; line-height:1.5;"></textarea>
      </div>
      <input type="hidden" class="service-duration" value="60">
    `;
    container.appendChild(div);
  };

  window._saveProfile = function(index) {
    const name = document.getElementById('prof-name')?.value?.trim();
    const specialty = document.getElementById('prof-specialty')?.value?.trim();
    const tel = document.getElementById('prof-tel')?.value?.trim() || '';
    const email = document.getElementById('prof-email')?.value?.trim() || '';
    const ig = document.getElementById('prof-ig')?.value?.trim() || '';
    const room = document.getElementById('prof-room')?.value || '';
    const status = document.getElementById('prof-status')?.value === 'true';

    if (!name) { alert('Ingresá el nombre del profesional'); return; }
    if (!specialty) { alert('Ingresá la especialidad'); return; }

    const services = [];
    const rows = document.querySelectorAll('.prof-service-row');
    rows.forEach(row => {
      const sName = row.querySelector('.service-name').value.trim();
      const sPrice = parseFloat(row.querySelector('.service-price').value) || 0;
      const sDuration = parseInt(row.querySelector('.service-duration').value) || 60;
      const sDesc = row.querySelector('.service-description')?.value?.trim() || '';
      if (sName) {
        services.push({ name: sName, price: sPrice, duration: sDuration, description: sDesc });
      }
    });

    window._profData[index] = {
      ...window._profData[index],
      name: name,
      specialty: specialty,
      tel: tel,
      email: email,
      ig: ig,
      room: room,
      color: window._selectedColor,
      activo: status,
      descripcion: window._profData[index].descripcion || '',
      services: services
    };

    document.querySelector('.profile-modal-overlay')?.remove();
    window.renderNUWOConnect(document.querySelector('.content-area'));
    alert('Cambios guardados.');
  };

  // ── Avatar color rotation ──
  const avatarColors = [
    '#7A8B6F', // Sage
    '#C4956A', // Terracotta
    '#7C9EB2', // Slate Blue
    '#D4A5A9', // Dusty Rose
    '#5E7C65', // Forest Green
    '#A79BB7', // Muted Lavender
    '#D9C39B', // Soft Ochre
    '#8E8279', // Warm Taupe
    '#2C2C34', // Deep Charcoal
    '#9BAF93'  // Soft Sage
  ];
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

    const color = prof.color || avatarColors[index % avatarColors.length];

    const overlay = document.createElement('div');
    overlay.className = 'profile-modal-overlay';
    overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.45); backdrop-filter:blur(6px); z-index:9999; display:flex; align-items:center; justify-content:center; animation: fadeIn 0.2s ease;';

    window._selectedColor = color;

    function renderColorPicker() {
      const root = document.getElementById('color-picker-root');
      if (!root) return;
      root.innerHTML = `
        <label>Color Identificador</label>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px;">
          ${avatarColors.map(c => {
            const isSelected = c.toLowerCase() === window._selectedColor.toLowerCase();
            return `
              <button onclick="window._selectProfColor('${c}')" type="button"
                style="
                  width:30px; height:30px; border-radius:50%; background:${c}; cursor:pointer; transition:all 0.15s; border:none; padding:0; display:flex; align-items:center; justify-content:center;
                  box-shadow: ${isSelected ? '0 0 0 2px var(--bg-card), 0 0 0 4px ' + c : '0 2px 4px rgba(0,0,0,0.1)'};
                  transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
                ">
                ${isSelected ? '<span style="color:#fff;font-weight:bold;font-size:0.8rem;">✓</span>' : ''}
              </button>
            `;
          }).join('')}
        </div>
      `;
    }

    window._selectProfColor = function(c) {
      window._selectedColor = c;
      renderColorPicker();
      const preview = document.getElementById('modal-avatar-preview');
      if (preview) {
        preview.style.background = c;
      }
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
          <div id="modal-avatar-preview" style="width: 56px; height: 56px; background: ${color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 700; color: #fff; flex-shrink: 0; transition: background 0.2s;">
            ${getInitial(prof.name)}
          </div>
          <div style="flex: 1;">
            <h2 style="margin: 0; font-size: 1.35rem; color: var(--color-text-primary);">${prof.name}</h2>
            <span class="badge" style="background: ${lightSage}; color: ${sage}; border-color: ${sage}40; margin-top: 4px; display: inline-block;">${prof.specialty}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: var(--radius-pill); font-size: 0.72rem; font-weight: 700; background: ${prof.activo ? '#E8F5E9' : '#FFF3E0'}; color: ${prof.activo ? '#2E7D32' : '#E68A00'};">
               <!-- Formulario -->
        <div style="padding: 0 28px 8px;">

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

          <!-- Color selector -->
          <div class="field-group" id="color-picker-root"></div>

          <!-- Services Offered -->
          <div class="field-group" style="border-top: 1px solid rgba(0,0,0,0.06); padding-top: 14px; margin-bottom: 14px; text-align: left;">
            <label style="font-weight:700; color:var(--color-text-primary); margin-bottom: 8px;">Servicios Ofrecidos</label>
            <div id="services-container" style="display:flex; flex-direction:column; gap:8px;">
              ${getDefaultServices(prof).map(service => `
                <div class="prof-service-row" style="background:var(--bg-card-alt); border:1px solid rgba(0,0,0,0.08); border-radius:var(--radius-sm); padding:16px; margin-bottom:12px; position:relative; text-align:left; box-sizing:border-box;">
                  <div style="position:absolute; right:12px; top:12px;">
                    <button type="button" onclick="this.closest('.prof-service-row').remove()" 
                      style="background:none; border:none; color:#C4956A; cursor:pointer; padding:6px; display:flex; align-items:center; justify-content:center; border-radius:50%; transition:background 0.2s;"
                      onmouseover="this.style.background='rgba(196,149,106,0.1)'"
                      onmouseout="this.style.background='none'"
                      title="Eliminar servicio">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4956A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                  <div style="display:grid; grid-template-columns: 2fr 1fr; gap:14px; margin-bottom:10px; padding-right:40px;">
                    <div>
                      <label style="display:block; font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--color-text-muted); margin-bottom:4px;">Título del Servicio</label>
                      <input type="text" class="service-name" placeholder="Ej: Consulta Inicial" value="${service.name}" 
                        style="width:100%; padding:9px 12px; border:1px solid rgba(0,0,0,0.12); border-radius:var(--radius-sm); font-family:var(--font-main); font-size:0.85rem; color:var(--color-text-primary); background:var(--bg-card); outline:none; box-sizing:border-box;">
                    </div>
                    <div>
                      <label style="display:block; font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--color-text-muted); margin-bottom:4px;">Precio ($)</label>
                      <div style="position:relative; width:100%;">
                        <span style="position:absolute; left:10px; top:50%; transform:translateY(-50%); font-size:0.85rem; color:var(--color-text-secondary); font-weight:600;">$</span>
                        <input type="number" class="service-price" placeholder="Valor" value="${service.price}" 
                          style="width:100%; padding:9px 12px 9px 22px; font-size:0.85rem; text-align:right; border:1px solid rgba(0,0,0,0.12); border-radius:var(--radius-sm); font-family:var(--font-main); color:var(--color-text-primary); background:var(--bg-card); outline:none; box-sizing:border-box;">
                      </div>
                    </div>
                  </div>
                  <div>
                    <label style="display:block; font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--color-text-muted); margin-bottom:4px;">Descripción del Servicio</label>
                    <textarea class="service-description" placeholder="Explicá de qué trata el servicio..." 
                      style="width:100%; padding:9px 12px; border:1px solid rgba(0,0,0,0.12); border-radius:var(--radius-sm); font-family:var(--font-main); font-size:0.85rem; color:var(--color-text-primary); background:var(--bg-card); outline:none; box-sizing:border-box; min-height:50px; resize:vertical; line-height:1.5;">${service.description || ''}</textarea>
                  </div>
                  <input type="hidden" class="service-duration" value="${service.duration || 60}">
                </div>
              `).join('')}
            </div>
            <button type="button" onclick="window._addServiceRow('services-container')" style="width:100%; padding:10px 12px; font-size:0.85rem; background:rgba(122, 139, 111, 0.1); color:#7A8B6F; border:1px dashed #7A8B6F; border-radius:var(--radius-sm); cursor:pointer; font-weight:700; display:flex; align-items:center; justify-content:center; gap:8px;">
              ＋ Agregar Servicio
            </button>
          </div>

          <div class="field-group">
            <label>Estado</label>
            <div style="display:flex; border:1px solid rgba(0,0,0,0.12); border-radius:var(--radius-sm); overflow:hidden; background:var(--bg-card-alt);">
              <button type="button" id="status-btn-active" onclick="window._setProfStatus(true)" style="flex:1; padding:9px; border:none; font-size:0.88rem; font-weight:700; cursor:pointer; transition:all 0.2s; background:${prof.activo ? '#7A8B6F' : 'transparent'}; color:${prof.activo ? '#fff' : 'var(--color-text-secondary)'};">
                Activo — El bot lo ofrece
              </button>
              <button type="button" id="status-btn-inactive" onclick="window._setProfStatus(false)" style="flex:1; padding:9px; border:none; font-size:0.88rem; font-weight:700; cursor:pointer; transition:all 0.2s; background:${!prof.activo ? '#C4956A' : 'transparent'}; color:${!prof.activo ? '#fff' : 'var(--color-text-secondary)'};">
                Inactivo — Oculto del bot
              </button>
            </div>
            <input type="hidden" id="prof-status" value="${prof.activo ? 'true' : 'false'}">
          </div>; cursor:pointer; font-weight:700; display:flex; align-items:center; justify-content:center; gap:8px;">
              ＋ Agregar Servicio
            </button>
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
              onclick="window._saveProfile(${index})">
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
    renderColorPicker();
  }

  window._setNewProfStatus = function(isActive) {
    const activeBtn = document.getElementById('new-status-btn-active');
    const inactiveBtn = document.getElementById('new-status-btn-inactive');
    const input = document.getElementById('newprof-status');
    if (!activeBtn || !inactiveBtn || !input) return;
    
    input.value = isActive ? 'true' : 'false';
    activeBtn.style.background = isActive ? '#7A8B6F' : 'transparent';
    activeBtn.style.color = isActive ? '#fff' : 'var(--color-text-secondary)';
    inactiveBtn.style.background = !isActive ? '#C4956A' : 'transparent';
    inactiveBtn.style.color = !isActive ? '#fff' : 'var(--color-text-secondary)';
  };

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

    window._selectedColorNew = avatarColors[0];

    window._selectNewProfColor = function(c) {
      window._selectedColorNew = c;
      window._renderNewColorPicker();
    };

    window._renderNewColorPicker = function() {
      const root = document.getElementById('new-color-picker-root');
      if (!root) return;
      root.innerHTML = `
        <label>Color Identificador</label>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px;">
          ${avatarColors.map(c => {
            const isSelected = c.toLowerCase() === window._selectedColorNew.toLowerCase();
            return `
              <button onclick="window._selectNewProfColor('${c}')" type="button"
                style="
                  width:30px; height:30px; border-radius:50%; background:${c}; cursor:pointer; transition:all 0.15s; border:none; padding:0; display:flex; align-items:center; justify-content:center;
                  box-shadow: ${isSelected ? '0 0 0 2px var(--bg-card), 0 0 0 4px ' + c : '0 2px 4px rgba(0,0,0,0.1)'};
                  transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
                ">
                ${isSelected ? '<span style="color:#fff;font-weight:bold;font-size:0.8rem;">✓</span>' : ''}
              </button>
            `;
          }).join('')}
        </div>
      `;
    };

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
              <label>Especialida          <div>
            <label>Instagram</label>
            <input type="text" id="newprof-ig" placeholder="@usuario">
          </div>

          <!-- Color Selector Container -->
          <div class="field-group" id="new-color-picker-root"></div>

          <div class="field-group">
            <label>Estado</label>
            <div style="display:flex; border:1px solid rgba(0,0,0,0.12); border-radius:var(--radius-sm); overflow:hidden; background:var(--bg-card-alt);">
              <button type="button" id="new-status-btn-active" onclick="window._setNewProfStatus(true)" style="flex:1; padding:9px; border:none; font-size:0.88rem; font-weight:700; cursor:pointer; transition:all 0.2s; background:#7A8B6F; color:#fff;">
                Activo — El bot lo ofrece
              </button>
              <button type="button" id="new-status-btn-inactive" onclick="window._setNewProfStatus(false)" style="flex:1; padding:9px; border:none; font-size:0.88rem; font-weight:700; cursor:pointer; transition:all 0.2s; background:transparent; color:var(--color-text-secondary);">
                Inactivo — Oculto del bot
              </button>
            </div>
            <input type="hidden" id="newprof-status" value="true">
          </div>

          <!-- Services Section for New Prof -->
          <div class="field-group" style="border-top:1px solid rgba(0,0,0,0.06); padding-top:14px; margin-bottom:14px; text-align: left;">
            <label style="font-weight:700; color:var(--color-text-primary); margin-bottom: 8px;">Servicios Ofrecidos</label>
            <div id="new-services-container" style="display:flex; flex-direction:column; gap:8px;">
              <div class="newprof-service-row" style="background:var(--bg-card-alt); border:1px solid rgba(0,0,0,0.08); border-radius:var(--radius-sm); padding:16px; margin-bottom:12px; position:relative; text-align:left; box-sizing:border-box;">
                <div style="position:absolute; right:12px; top:12px;">
                  <button type="button" onclick="this.closest('.newprof-service-row').remove()" 
                    style="background:none; border:none; color:#C4956A; cursor:pointer; padding:6px; display:flex; align-items:center; justify-content:center; border-radius:50%; transition:background 0.2s;"
                    onmouseover="this.style.background='rgba(196,149,106,0.1)'"
                    onmouseout="this.style.background='none'"
                    title="Eliminar servicio">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4956A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:14px; margin-bottom:10px; padding-right:40px;">
                  <div>
                    <label style="display:block; font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--color-text-muted); margin-bottom:4px;">Título del Servicio</label>
                    <input type="text" class="service-name" placeholder="Ej: Consulta Inicial" value="Consulta Inicial" 
                      style="width:100%; padding:9px 12px; border:1px solid rgba(0,0,0,0.12); border-radius:var(--radius-sm); font-family:var(--font-main); font-size:0.85rem; color:var(--color-text-primary); background:var(--bg-card); outline:none; box-sizing:border-box;">
                  </div>
                  <div>
                    <label style="display:block; font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--color-text-muted); margin-bottom:4px;">Precio ($)</label>
                    <div style="position:relative; width:100%;">
                      <span style="position:absolute; left:10px; top:50%; transform:translateY(-50%); font-size:0.85rem; color:var(--color-text-secondary); font-weight:600;">$</span>
                      <input type="number" class="service-price" placeholder="Valor" value="3000" 
                        style="width:100%; padding:9px 12px 9px 22px; font-size:0.85rem; text-align:right; border:1px solid rgba(0,0,0,0.12); border-radius:var(--radius-sm); font-family:var(--font-main); color:var(--color-text-primary); background:var(--bg-card); outline:none; box-sizing:border-box;">
                    </div>
                  </div>
                </div>
                <div>
                  <label style="display:block; font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--color-text-muted); margin-bottom:4px;">Descripción del Servicio</label>
                  <textarea class="service-description" placeholder="Explicá de qué trata el servicio..." 
                    style="width:100%; padding:9px 12px; border:1px solid rgba(0,0,0,0.12); border-radius:var(--radius-sm); font-family:var(--font-main); font-size:0.85rem; color:var(--color-text-primary); background:var(--bg-card); outline:none; box-sizing:border-box; min-height:50px; resize:vertical; line-height:1.5;"></textarea>
                </div>
                <input type="hidden" class="service-duration" value="60">
              </div>
            </div>
            <button type="button" onclick="window._addServiceRow('new-services-container')" style="width:100%; padding:10px 12px; font-size:0.85rem; background:rgba(122, 139, 111, 0.1); color:#7A8B6F; border:1px dashed #7A8B6F; border-radius:var(--radius-sm); cursor:pointer; font-weight:700; display:flex; align-items:center; justify-content:center; gap:8px;">
              ＋ Agregar Servicio
            </button>
          </div>

        </div>

        <div style="padding:14px 28px 22px;display:flex;justify-content:flex-end;gap:10px;border-top:1px solid rgba(0,0,0,0.06);">
          <button onclick="this.closest('.new-prof-overlay').remove()" style="padding:9px 20px;font-size:0.85rem;background:transparent;color:var(--color-text-muted);border:1px solid rgba(0,0,0,0.12);border-radius:8px;font-weight:600;cursor:pointer;">Cancelar</button>
          <button onclick="window._saveNewProf()" style="padding:9px 24px;font-size:0.85rem;background:${sage};color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;">Crear Profesional</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    window._renderNewColorPicker();
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  };

  window._saveNewProf = function() {
    const name = document.getElementById('newprof-name')?.value?.trim();
    const specialty = document.getElementById('newprof-specialty')?.value?.trim();
    const tel = document.getElementById('newprof-tel')?.value?.trim() || '';
    const email = document.getElementById('newprof-email')?.value?.trim() || '';
    const ig = document.getElementById('newprof-ig')?.value?.trim() || '';
    const status = document.getElementById('newprof-status')?.value === 'true';

    if (!name) { alert('Ingresá el nombre del profesional'); return; }
    if (!specialty) { alert('Ingresá la especialidad'); return; }

    const services = [];
    const rows = document.querySelectorAll('.newprof-service-row');
    rows.forEach(row => {
      const sName = row.querySelector('.service-name').value.trim();
      const sPrice = parseFloat(row.querySelector('.service-price').value) || 0;
      const sDuration = parseInt(row.querySelector('.service-duration').value) || 60;
      const sDesc = row.querySelector('.service-description')?.value?.trim() || '';
      if (sName) {
        services.push({ name: sName, price: sPrice, duration: sDuration, description: sDesc });
      }
    });

    const newProf = {
      name,
      specialty,
      schedule: 'Asignar en Actividad',
      scheduleSlots: [],
      room: 'Consultorio A',
      ig,
      tel,
      email,
      activo: status,
      color: window._selectedColorNew || avatarColors[0],
      descripcion: '',
      services: services
    };

    window._profData.push(newProf);
    document.querySelector('.new-prof-overlay')?.remove();

    // Re-render
    const contentArea = document.querySelector('.content-area');
    if (contentArea && window.renderNUWOConnect) {
      window.renderNUWOConnect(contentArea);
    }
  };

  function renderProfCard(prof, index) {
    const color = prof.color || avatarColors[index % avatarColors.length];
    const firstService = (prof.services && prof.services[0]) || getDefaultServices(prof)[0];
    const desc = prof.descripcion || (firstService && firstService.description) || '';
    const descPreview = desc.length > 60 ? desc.substring(0, 60) + '...' : desc;

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

  if (!window._activeProfsTab) {
    window._activeProfsTab = 'active';
  }

  window._setProfsTab = function(tabId) {
    window._activeProfsTab = tabId;
    const contentArea = document.querySelector('.content-area');
    if (contentArea && window.renderNUWOConnect) {
      window.renderNUWOConnect(contentArea);
    }
  };

  const activeProfsCount = professionals.filter(p => p.activo !== false).length;
  const applicantsCount = applicants.length;

  const tabsHtml = `
    <div style="display:flex;gap:6px;margin-bottom:24px;border-bottom:1px solid rgba(0,0,0,0.08);padding-bottom:12px;">
      <button onclick="window._setProfsTab('active')" style="padding:8px 16px;border-radius:var(--radius-pill);border:none;font-weight:700;font-size:0.75rem;cursor:pointer;transition:all 0.2s;
        ${window._activeProfsTab === 'active' ? `background:${sage};color:#fff;` : 'background:rgba(0,0,0,0.04);color:var(--color-text-secondary);'}">
        Equipo Activo (${activeProfsCount})
      </button>
      <button onclick="window._setProfsTab('applicants')" style="padding:8px 16px;border-radius:var(--radius-pill);border:none;font-weight:700;font-size:0.75rem;cursor:pointer;transition:all 0.2s;position:relative;
        ${window._activeProfsTab === 'applicants' ? `background:${sage};color:#fff;` : 'background:rgba(0,0,0,0.04);color:var(--color-text-secondary);'}">
        Nuevos Consultantes (${applicantsCount})
        ${applicantsCount > 0 ? `<span style="position:absolute;top:-2px;right:-2px;width:6px;height:6px;border-radius:50%;background:#C0392B;"></span>` : ''}
      </button>
    </div>
  `;

  let tabContent = '';
  if (window._activeProfsTab === 'active') {
    tabContent = `
      <div style="margin-bottom: 16px;">
        <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
          ${professionals.map((p, i) => renderProfCard(p, i)).join('')}
        </div>
      </div>
    `;
  } else {
    tabContent = `
      <div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${applicants.map(a => renderApplicantCard(a)).join('')}
        </div>
      </div>
    `;
  }

  // ══════════════════════════════════════════
  // Render full view
  // ══════════════════════════════════════════
  container.innerHTML = `
    <!-- ── Header ────────────────────────── -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;">
      <div class="dashboard-header" style="margin-bottom:0;">
        <h1>Profesionales</h1>
        <p class="dashboard-subtitle">EQUIPO ESPACIO ALVARADO · ${activeProfsCount} ACTIVOS</p>
      </div>
      <button class="button-primary" onclick="window._openNewProfModal()" style="display:flex;align-items:center;gap:8px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Nuevo Profesional
      </button>
    </div>

    <!-- Tabs Navigation -->
    ${tabsHtml}

    <!-- Tab Content -->
    ${tabContent}
  `;
};
