// ══════════════════════════════════════════════════════════
// Inicio — Agenda del Día + Talleres Activos
// Espacio Alvarado · 4 consultorios + Hall · Vista diaria
// ══════════════════════════════════════════════════════════

window.renderMarket = function (container) {
  console.log('[INICIO] renderMarket called', container);

  // ── Color palette ──
  const sage        = '#7A8B6F';
  const terracotta  = '#C4956A';
  const lightSage   = '#E8EDE5';
  const lightTerracotta = '#F5EDE5';

  // ── Workshops data (Stateful) ──
  const defaultWorkshops = [
    {
      name: 'Yoga Terapéutico',
      instructor: 'Prof. Lucas Méndez',
      schedule: 'Martes y Jueves 18:00',
      occupied: 12, total: 15, color: sage, active: true,
      descripcion: 'Clase de yoga suave adaptada a todos los niveles, ideal para liberar tensiones corporales, mejorar la postura y calmar la mente a través de la respiración consciente y la meditación.'
    },
    {
      name: 'Taller de Cuencos Tibetanos',
      instructor: 'Lic. Daniel Rodríguez',
      schedule: 'Sábados 16:00',
      occupied: 14, total: 15, color: terracotta, active: true,
      descripcion: 'Viaje sonoro vibracional con cuencos de cuarzo y tibetanos. Una experiencia profunda de relajación diseñada para equilibrar el sistema nervioso, aliviar el insomnio y reducir el estrés.'
    },
    {
      name: 'Meditación & Mindfulness',
      instructor: 'Prof. Julián Ramos',
      schedule: 'Miércoles 19:00',
      occupied: 8, total: 12, color: sage, active: true,
      descripcion: 'Clase práctica semanal para incorporar la atención plena en tu vida diaria. Incluye ejercicios de respiración, escaneo corporal y técnicas para calmar la rumiación mental.'
    }
  ];

  if (!window._workshopsData) window._workshopsData = defaultWorkshops;
  const workshops       = window._workshopsData;
  const activeWorkshops = workshops.filter(w => w.active !== false);

  // ── Agenda: navigable date state ──
  if (!window._agendaDate) {
    window._agendaDate = new Date();
    window._agendaDate.setHours(0, 0, 0, 0);
  }

  const DAY_NAMES   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const MONTH_NAMES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

  function formatAgendaDate(d) {
    const today     = new Date(); today.setHours(0,0,0,0);
    const tomorrow  = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const dd = new Date(d); dd.setHours(0,0,0,0);
    let prefix = DAY_NAMES[dd.getDay()];
    if      (dd.getTime() === today.getTime())     prefix = 'Hoy — '     + DAY_NAMES[dd.getDay()];
    else if (dd.getTime() === tomorrow.getTime())  prefix = 'Mañana — '  + DAY_NAMES[dd.getDay()];
    else if (dd.getTime() === yesterday.getTime()) prefix = 'Ayer — '    + DAY_NAMES[dd.getDay()];
    return `${prefix} ${dd.getDate()} ${MONTH_NAMES[dd.getMonth()]} ${dd.getFullYear()}`;
  }

  // ── Patient appointments (mock, keyed 'DOW-HOUR-ROOM') ──
  const APPOINTMENTS = {
    '1-09:00-0':'Laura M.', '1-10:00-0':'Diego R.', '1-15:00-0':'Ana G.', '1-15:00-1':'Carla F.',
    '2-09:00-1':'Marcos P.','2-10:00-2':'Sofía L.', '2-11:00-2':'Tomás V.','2-14:00-2':'Renata B.',
    '2-15:00-2':'Ignacio H.','2-17:00-0':'Valentina C.','2-18:00-0':'Emilio S.',
    '3-09:00-0':'Bárbara T.','3-10:00-0':'Nicolás M.','3-16:00-2':'Paula R.',
    '4-09:00-1':'Florencia D.','4-10:00-2':'Sebastián K.','4-14:00-2':'Miranda A.','4-17:00-0':'Lucía B.',
    '5-09:00-0':'Matías P.','5-14:00-0':'Camila W.','5-15:00-1':'Roberto N.','5-16:00-2':'Verónica I.'
  };

  // ── Build schedule rows for a given date ──
  function buildScheduleForDate(d) {
    const dow   = d.getDay();
    const isSat = dow === 6;
    const isSun = dow === 0;

    function slot(prof, roomIdx, hour) {
      if (!prof) return { prof: '—', patient: null, roomIdx, hour };
      const key = `${dow}-${hour}-${roomIdx}`;
      return { prof, patient: APPOINTMENTS[key] || null, roomIdx, hour };
    }
    const ws  = (s, roomIdx, hour) => ({ prof: s, patient: null, isTaller: true, roomIdx, hour });
    const cls = (s, roomIdx, hour) => ({ prof: s, patient: null, isClosed: true, roomIdx, hour });
    const emp = (roomIdx, hour)    => ({ prof: '—', patient: null, roomIdx, hour });

    if (isSat) return [
      { hour:'10:00', cols:[cls('Sin turnos',0,'10:00'),cls('Sin turnos',1,'10:00'),cls('Sin turnos',2,'10:00'),cls('Sin turnos',3,'10:00'),ws(`Taller Cuencos (${(workshops[1]||{}).occupied||0}/${(workshops[1]||{}).total||0})`,4,'10:00')] },
      { hour:'14:00', cols:[cls('Sin turnos',0,'14:00'),cls('Sin turnos',1,'14:00'),cls('Sin turnos',2,'14:00'),cls('Sin turnos',3,'14:00'),emp(4,'14:00')] },
      { hour:'16:00', cols:[cls('Sin turnos',0,'16:00'),cls('Sin turnos',1,'16:00'),cls('Sin turnos',2,'16:00'),cls('Sin turnos',3,'16:00'),ws(`Taller Cuencos (${(workshops[1]||{}).occupied||0}/${(workshops[1]||{}).total||0})`,4,'16:00')] },
    ];

    if (isSun) return [{ hour:'—', cols:[0,1,2,3,4].map(i => cls('Espacio cerrado',i,'—')) }];

    const isMWF = [1,3,5].includes(dow);
    const isTT  = [2,4].includes(dow);
    const isWed = dow === 3;
    const hasGarcia    = isMWF;
    const hasTorres    = [1,5].includes(dow);
    const hasMendez    = isTT;
    const hasRodriguez = isTT;

    const baseRows = [
      { hour:'09:00', cols:[ slot(hasGarcia?'Lic. García':null,0,'09:00'), slot(isTT?'Dra. Fossati':null,1,'09:00'), slot(isTT?'Dr. Rodríguez':null,2,'09:00'), emp(3,'09:00'), emp(4,'09:00') ]},
      { hour:'10:00', cols:[ slot(hasGarcia?'Lic. García':null,0,'10:00'), slot(isTT?'Dra. Fossati':null,1,'10:00'), slot(isTT?'Dr. Rodríguez':null,2,'10:00'), hasMendez?ws('Prof. Méndez (Yoga)',3,'10:00'):emp(3,'10:00'), emp(4,'10:00') ]},
      { hour:'11:00', cols:[ emp(0,'11:00'), slot(isTT?'Dra. Fossati':null,1,'11:00'), slot(isTT?'Dra. Ruiz':null,2,'11:00'), hasMendez?ws('Prof. Méndez (Yoga)',3,'11:00'):emp(3,'11:00'), emp(4,'11:00') ]},
      { hour:'14:00', cols:[ slot(hasTorres?'Lic. Torres':null,0,'14:00'), emp(1,'14:00'), slot(isTT?'Dr. Rodríguez':null,2,'14:00'), emp(3,'14:00'), emp(4,'14:00') ]},
      { hour:'15:00', cols:[ slot(hasTorres?'Lic. Torres':null,0,'15:00'), slot(hasGarcia?'Lic. García':null,1,'15:00'), slot(isTT?'Dr. Rodríguez':null,2,'15:00'), emp(3,'15:00'), emp(4,'15:00') ]},
      { hour:'16:00', cols:[ emp(0,'16:00'), emp(1,'16:00'), slot([3,5].includes(dow)?'Dra. Ruiz':null,2,'16:00'), isTT?ws('Taller grupal',3,'16:00'):emp(3,'16:00'), isWed?ws(`Meditación (${(workshops[2]||{}).occupied||0}/${(workshops[2]||{}).total||0})`,4,'16:00'):emp(4,'16:00') ]},
      { hour:'17:00', cols:[ slot(hasRodriguez?'Dr. Rodríguez':null,0,'17:00'), emp(1,'17:00'), emp(2,'17:00'), isTT?ws('Taller grupal',3,'17:00'):emp(3,'17:00'), isTT?ws(`Taller Cuencos (${(workshops[1]||{}).occupied||0}/${(workshops[1]||{}).total||0})`,4,'17:00'):emp(4,'17:00') ]},
      { hour:'18:00', cols:[ slot(hasRodriguez?'Dr. Rodríguez':null,0,'18:00'), emp(1,'18:00'), emp(2,'18:00'), emp(3,'18:00'), isTT?ws(`Yoga Terapéutico (${(workshops[0]||{}).occupied||0}/${(workshops[0]||{}).total||0})`,4,'18:00'):emp(4,'18:00') ]},
    ];

    // Merge custom slots from _agendaCustomSlots
    const dateKey = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const customSlots = (window._agendaCustomSlots || {})[dateKey] || {};

    baseRows.forEach(row => {
      row.cols.forEach((cell, colIdx) => {
        const slotKey = `${row.hour}-${colIdx}`;
        const custom = customSlots[slotKey];
        if (custom) {
          if (cell.prof === '—' || !cell.prof) {
            // Empty slot → fill with custom assignment
            if (custom.type === 'taller') {
              row.cols[colIdx] = { prof: custom.name, patient: custom.patient || null, isTaller: true, roomIdx: colIdx, hour: row.hour };
            } else {
              row.cols[colIdx] = { prof: custom.name, patient: custom.patient || null, roomIdx: colIdx, hour: row.hour };
            }
          } else {
            // Existing slot → apply patient override if set
            if (custom.patient) row.cols[colIdx].patient = custom.patient;
            if (custom.name && custom.name !== cell.prof) {
              row.cols[colIdx].prof = custom.name;
              row.cols[colIdx].isTaller = custom.type === 'taller';
            }
          }
        }
      });
    });

    return baseRows;
  }

  const ROOM_LABELS = ['Consultorio A','Consultorio B','Consultorio C','Consultorio D','Hall'];

  // ── Render one table cell ──
  function renderCell(s, rowHour) {
    const { prof, patient, isTaller, isClosed, roomIdx } = s;
    const isFree      = !prof || prof === '—';
    const isReserved  = !isFree && !isTaller && !isClosed && patient;
    const isAvailable = !isFree && !isTaller && !isClosed && !patient;

    let bg = 'transparent', borderLeft = 'none', profColor = 'var(--color-text-muted)', profWeight = '400';

    if      (isTaller)    { bg = lightTerracotta; borderLeft = `3px solid ${terracotta}`; profColor = terracotta; profWeight = '600'; }
    else if (isReserved)  { bg = sage+'22';       borderLeft = `3px solid ${sage}`;       profColor = '#3a4d30';  profWeight = '700'; }
    else if (isAvailable) { bg = lightSage;       borderLeft = `3px solid ${sage}60`;     profColor = 'var(--color-text-primary)'; profWeight = '500'; }

    const profLine = (isFree||isClosed)
      ? `<span style="color:var(--color-text-muted);font-weight:400;font-size:0.82rem;">${prof}</span>`
      : `<span style="color:${profColor};font-weight:${profWeight};font-size:0.82rem;">${prof}</span>`;

    const badge = isReserved
      ? `<div style="margin-top:3px;display:flex;align-items:center;gap:4px;">
           <span style="width:5px;height:5px;border-radius:50%;background:${sage};flex-shrink:0;"></span>
           <span style="font-size:0.71rem;color:${sage};font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:110px;">${patient}</span>
         </div>` : '';

    // ALL non-closed cells are clickable
    const clickable = !isClosed && rowHour !== '—';
    const hoverBg = isFree ? 'rgba(122,139,111,0.08)' : (isTaller ? lightTerracotta : bg);
    const escapedProf = (prof||'').replace(/'/g, "\\'");
    const escapedPatient = (patient||'').replace(/'/g, "\\'");
    const cellType = isTaller ? 'taller' : 'profesional';

    const clickAttr = clickable
      ? ` onclick="window._openAgendaSlotModal('${rowHour}', ${roomIdx}, '${escapedProf}', '${escapedPatient}', '${cellType}')" style="padding:${isReserved||isAvailable||isTaller?'8px 10px 8px 9px':'10px 12px'};background:${bg};border-left:${borderLeft};border-bottom:1px solid rgba(0,0,0,0.05);vertical-align:top;min-width:120px;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='${hoverBg}'" onmouseout="this.style.background='${bg}'"`
      : ` style="padding:10px 12px;background:${bg};border-left:${borderLeft};border-bottom:1px solid rgba(0,0,0,0.05);vertical-align:top;min-width:120px;"`;

    const freeHint = (clickable && isFree) ? `<span style="font-size:0.68rem;color:rgba(0,0,0,0.18);display:block;margin-top:2px;">+ asignar</span>` : '';

    return `<td${clickAttr}>${profLine}${badge}${freeHint}</td>`;
  }

  function renderAgendaRow(row) {
    const hourCell = `<td style="padding:10px 14px;font-weight:700;font-size:0.82rem;color:var(--color-text-secondary);background:var(--bg-card-alt);border-bottom:1px solid rgba(0,0,0,0.05);white-space:nowrap;">${row.hour}</td>`;
    return `<tr>${hourCell}${row.cols.map(s => renderCell(s, row.hour)).join('')}</tr>`;
  }

  // ── Agenda Slot Assignment Modal (supports empty + edit mode) ──
  window._openAgendaSlotModal = function(hour, roomIdx, currentProf, currentPatient, currentType) {
    const existing = document.querySelector('.agenda-slot-overlay');
    if (existing) existing.remove();

    currentProf = currentProf || '';
    currentPatient = currentPatient || '';
    currentType = currentType || 'profesional';
    const isEdit = currentProf && currentProf !== '—';

    const profData = window._profData || [];
    const wsData = window._workshopsData || [];
    const activeProfessionals = profData.filter(p => p.activo !== false);
    const activeWS = wsData.filter(w => w.active !== false);

    const d = window._agendaDate;
    const dateKey = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const dayLabel = formatAgendaDate(d);

    const isProfType = currentType !== 'taller';
    const endHour = (() => { const [h,m]= hour.split(':'); return String(parseInt(h)+1).padStart(2,'0')+':'+m; })();

    const overlay = document.createElement('div');
    overlay.className = 'agenda-slot-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease;';

    overlay.innerHTML = `
      <style>
        .aslot-modal select, .aslot-modal input {
          width:100%; padding:9px 12px; border:1px solid rgba(0,0,0,0.12); border-radius:6px;
          font-family:var(--font-main); font-size:0.88rem; color:var(--color-text-primary);
          background:var(--bg-card-alt); outline:none; transition:border-color 0.2s;
        }
        .aslot-modal select:focus, .aslot-modal input:focus { border-color:${sage}; box-shadow:0 0 0 3px ${sage}22; }
        .aslot-modal label { display:block; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--color-text-muted); margin-bottom:5px; }
        .aslot-type-btn { padding:10px 20px; border:2px solid rgba(0,0,0,0.1); border-radius:8px; background:#fff; font-size:0.85rem; font-weight:700; cursor:pointer; transition:all 0.2s; flex:1; text-align:center; }
        .aslot-type-btn.active { border-color:${sage}; background:${sage}15; color:${sage}; }
        .aslot-type-btn:not(.active):hover { border-color:rgba(0,0,0,0.2); }
      </style>
      <div class="aslot-modal" style="background:var(--bg-card);border-radius:var(--radius-lg);width:460px;box-shadow:var(--shadow-float);padding:0;">
        <div style="padding:24px 28px 0;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <h2 style="margin:0;font-size:1.15rem;color:var(--color-text-primary);">${isEdit ? 'Editar horario' : 'Asignar horario'}</h2>
            <button onclick="this.closest('.agenda-slot-overlay').remove()" style="width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,0.06);color:var(--color-text-muted);font-size:1.1rem;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;">✕</button>
          </div>
          <div style="display:flex;gap:10px;padding:8px 0 4px;font-size:0.78rem;color:var(--color-text-muted);">
            <span style="background:${sage}15;color:${sage};font-weight:700;padding:3px 10px;border-radius:4px;">${hour}</span>
            <span style="background:rgba(0,0,0,0.04);font-weight:600;padding:3px 10px;border-radius:4px;">${ROOM_LABELS[roomIdx]}</span>
            <span style="padding:3px 0;font-weight:500;">${dayLabel}</span>
          </div>
        </div>

        <div style="padding:18px 28px 20px;display:flex;flex-direction:column;gap:16px;">
          <!-- Time range -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
            <div>
              <label>Hora de inicio</label>
              <input type="time" id="aslot-time-start" value="${hour}">
            </div>
            <div>
              <label>Hora de finalización</label>
              <input type="time" id="aslot-time-end" value="${endHour}">
            </div>
          </div>

          <!-- Type selector -->
          <div>
            <label>Tipo de asignación</label>
            <div style="display:flex;gap:10px;">
              <button class="aslot-type-btn ${isProfType?'active':''}" id="aslot-btn-prof" onclick="
                document.getElementById('aslot-btn-prof').classList.add('active');
                document.getElementById('aslot-btn-taller').classList.remove('active');
                document.getElementById('aslot-prof-select').style.display='block';
                document.getElementById('aslot-taller-select').style.display='none';
              ">👤 Profesional</button>
              <button class="aslot-type-btn ${!isProfType?'active':''}" id="aslot-btn-taller" onclick="
                document.getElementById('aslot-btn-taller').classList.add('active');
                document.getElementById('aslot-btn-prof').classList.remove('active');
                document.getElementById('aslot-taller-select').style.display='block';
                document.getElementById('aslot-prof-select').style.display='none';
              ">📋 Taller</button>
            </div>
          </div>

          <!-- Professional dropdown -->
          <div id="aslot-prof-select" style="display:${isProfType?'block':'none'};">
            <label>Profesional</label>
            <select id="aslot-prof-dropdown">
              <option value="" disabled ${!isEdit||!isProfType?'selected':''}>Seleccionar profesional...</option>
              ${activeProfessionals.map(p => `<option value="${p.name}" ${isEdit&&isProfType&&currentProf===p.name?'selected':''}>${p.name} — ${p.specialty}</option>`).join('')}
            </select>
          </div>

          <!-- Workshop dropdown -->
          <div id="aslot-taller-select" style="display:${!isProfType?'block':'none'};">
            <label>Taller / Clase</label>
            <select id="aslot-taller-dropdown">
              <option value="" disabled ${!isEdit||isProfType?'selected':''}>Seleccionar taller...</option>
              ${activeWS.map(w => `<option value="${w.name}" ${isEdit&&!isProfType&&currentProf===w.name?'selected':''}>${w.name}</option>`).join('')}
            </select>
          </div>

          <!-- Patient assignment -->
          <div style="border-top:1px solid rgba(0,0,0,0.06);padding-top:14px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
              <label style="margin-bottom:0;">Paciente reservado</label>
              ${currentPatient ? `<button onclick="window._clearPatientOnly('${dateKey}','${hour}',${roomIdx})" style="font-size:0.7rem;color:#d9534f;background:none;border:none;cursor:pointer;font-weight:600;text-decoration:underline;">Quitar paciente</button>` : ''}
            </div>
            <input type="text" id="aslot-patient" placeholder="Nombre del paciente (opcional)" value="${currentPatient}">
          </div>
        </div>

        <div style="padding:14px 28px 22px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(0,0,0,0.06);">
          <button onclick="window._removeAgendaSlot('${dateKey}','${hour}',${roomIdx})" style="padding:9px 16px;font-size:0.82rem;background:transparent;color:#d9534f;font-weight:600;border:1px solid rgba(217,83,79,0.2);border-radius:6px;cursor:pointer;">Liberar horario</button>
          <button style="padding:9px 24px;font-size:0.85rem;background:${sage};color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;"
            onclick="window._saveAgendaSlot('${dateKey}','${hour}',${roomIdx})">${isEdit ? 'Guardar' : 'Asignar'}</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  };

  window._saveAgendaSlot = function(dateKey, hour, roomIdx) {
    const isProfActive = document.getElementById('aslot-btn-prof').classList.contains('active');
    let name = '';
    let type = 'profesional';

    if (isProfActive) {
      const sel = document.getElementById('aslot-prof-dropdown');
      if (!sel || !sel.value) { alert('Seleccioná un profesional'); return; }
      name = sel.value;
      type = 'profesional';
    } else {
      const sel = document.getElementById('aslot-taller-dropdown');
      if (!sel || !sel.value) { alert('Seleccioná un taller'); return; }
      name = sel.value;
      type = 'taller';
    }

    const patientInput = document.getElementById('aslot-patient');
    const patient = patientInput ? patientInput.value.trim() : '';

    if (!window._agendaCustomSlots) window._agendaCustomSlots = {};
    if (!window._agendaCustomSlots[dateKey]) window._agendaCustomSlots[dateKey] = {};
    window._agendaCustomSlots[dateKey][`${hour}-${roomIdx}`] = { name, type, patient: patient || null };

    document.querySelector('.agenda-slot-overlay')?.remove();
    const root = document.getElementById('agenda-section-root');
    if (root) root.innerHTML = buildAgendaHtml();
  };

  // Clear only the patient, keep the professional assignment
  window._clearPatientOnly = function(dateKey, hour, roomIdx) {
    if (window._agendaCustomSlots && window._agendaCustomSlots[dateKey]) {
      const slotKey = `${hour}-${roomIdx}`;
      const slot = window._agendaCustomSlots[dateKey][slotKey];
      if (slot) {
        slot.patient = null;
      } else {
        // Create a slot override just to clear patient on a hardcoded slot
        if (!window._agendaCustomSlots[dateKey]) window._agendaCustomSlots[dateKey] = {};
        window._agendaCustomSlots[dateKey][slotKey] = { name: '', type: 'profesional', patient: null, clearPatient: true };
      }
    }
    document.querySelector('.agenda-slot-overlay')?.remove();
    const root = document.getElementById('agenda-section-root');
    if (root) root.innerHTML = buildAgendaHtml();
  };

  window._removeAgendaSlot = function(dateKey, hour, roomIdx) {
    if (window._agendaCustomSlots && window._agendaCustomSlots[dateKey]) {
      delete window._agendaCustomSlots[dateKey][`${hour}-${roomIdx}`];
    }
    document.querySelector('.agenda-slot-overlay')?.remove();
    const root = document.getElementById('agenda-section-root');
    if (root) root.innerHTML = buildAgendaHtml();
  };

  // ── Workshop card (Hall) ──
  function renderWorkshopCard(w, idx) {
    const progress   = Math.round((w.occupied / w.total) * 100);
    const descPreview = w.descripcion.length > 90 ? w.descripcion.substring(0,90)+'...' : w.descripcion;
    return `
      <div class="card" style="border-top:3px solid ${w.color};display:flex;flex-direction:column;justify-content:space-between;height:100%;">
        <div>
          <h4 style="margin:0 0 4px;font-size:1rem;font-weight:700;color:var(--color-text-primary);">${w.name}</h4>
          <p style="margin:0 0 8px;font-size:0.8rem;color:${terracotta};font-weight:600;">${w.instructor} · ${w.schedule}</p>
          <p style="margin:0 0 16px;font-size:0.8rem;color:var(--color-text-secondary);line-height:1.5;font-style:italic;">"${descPreview}"</p>
        </div>
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.78rem;margin-bottom:6px;">
            <span style="color:var(--color-text-muted);">Capacidad máxima: <strong>${w.total} personas</strong></span>
            <span style="color:var(--color-text-primary);font-weight:600;">${w.occupied}/${w.total}</span>
          </div>
          <div style="width:100%;height:6px;background:#eee;border-radius:3px;overflow:hidden;margin-bottom:14px;">
            <div style="width:${progress}%;height:100%;background:${w.color};border-radius:3px;transition:width 0.4s ease;"></div>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="button-secondary" style="flex:1;padding:7px 10px;font-size:0.8rem;"
              onclick="window._openWorkshopModal(window._workshopsData[${idx}], ${idx})">Editar Ficha</button>
          </div>
        </div>
      </div>`;
  }

  // ════════════════════════════════════════════
  // buildAgendaHtml — returns the agenda HTML
  // ════════════════════════════════════════════
  function buildAgendaHtml() {
    try {
      const d         = window._agendaDate;
      const rows      = buildScheduleForDate(d);
      const dateLabel = formatAgendaDate(d);
      const today     = new Date(); today.setHours(0,0,0,0);
      const isToday   = d.getTime() === today.getTime();

      function roomOcc(roomIdx) {
        const sched  = rows.filter(r => { const s=r.cols[roomIdx]; return s && s.prof && s.prof!=='—' && !s.isTaller && !s.isClosed; });
        const booked = sched.filter(r => r.cols[roomIdx].patient);
        return { scheduled: sched.length, booked: booked.length };
      }

      const roomDefs = [
        { label:'Consultorio A', color:sage,       idx:0 },
        { label:'Consultorio B', color:sage,       idx:1 },
        { label:'Consultorio C', color:terracotta, idx:2 },
        { label:'Consultorio D', color:sage,       idx:3 },
        { label:'Hall (Talleres)', color:terracotta, idx:4 },
      ];

      function roomHeader(rc) {
        if (rc.idx === 4) {
          const n = activeWorkshops.length;
          return `<th style="padding:10px 12px;text-align:left;border-bottom:2px solid ${rc.color}40;min-width:130px;">
            <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${rc.color};margin-bottom:4px;">${rc.label}</div>
            <div style="font-size:0.71rem;color:var(--color-text-muted);">${n} taller${n!==1?'es':''} activo${n!==1?'s':''}</div>
          </th>`;
        }
        const occ = roomOcc(rc.idx);
        const pct = occ.scheduled > 0 ? Math.round((occ.booked/occ.scheduled)*100) : 0;
        return `<th style="padding:10px 12px;text-align:left;border-bottom:2px solid ${rc.color}40;min-width:130px;">
          <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${rc.color};margin-bottom:5px;">${rc.label}</div>
          ${occ.scheduled > 0
            ? `<div style="display:flex;align-items:center;gap:6px;">
                 <div style="flex:1;height:4px;background:rgba(0,0,0,0.07);border-radius:2px;overflow:hidden;">
                   <div style="width:${pct}%;height:100%;background:${rc.color};border-radius:2px;"></div>
                 </div>
                 <span style="font-size:0.68rem;color:var(--color-text-muted);white-space:nowrap;">${occ.booked}/${occ.scheduled}</span>
               </div>`
            : `<div style="font-size:0.68rem;color:var(--color-text-muted);">Sin agenda</div>`}
        </th>`;
      }

      return `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap;">
          <div style="flex:1;">
            <h2 style="margin:0 0 2px;font-size:1.4rem;">Agenda del día</h2>
            <p style="margin:0;font-size:0.78rem;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:0.06em;">Espacio Alvarado</p>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            ${!isToday ? `<button onclick="window._agendaGoToday()" style="padding:6px 14px;font-size:0.78rem;font-weight:700;border-radius:var(--radius-pill);background:${sage}18;color:${sage};border:1.5px solid ${sage}40;cursor:pointer;">Hoy</button>` : ''}
            <div style="display:flex;align-items:center;background:var(--bg-card-alt);border-radius:var(--radius-pill);border:1px solid rgba(0,0,0,0.08);overflow:hidden;">
              <button style="padding:8px 16px;background:none;border:none;cursor:pointer;font-size:1.2rem;color:var(--color-text-muted);line-height:1;transition:background 0.15s;"
                onmouseover="this.style.background='rgba(0,0,0,0.06)'" onmouseout="this.style.background='none'"
                onclick="window._agendaNav(-1)">‹</button>
              <div style="padding:0 16px;font-size:0.9rem;font-weight:700;color:${isToday?sage:'var(--color-text-primary)'};min-width:230px;text-align:center;white-space:nowrap;">
                ${dateLabel}
              </div>
              <button style="padding:8px 16px;background:none;border:none;cursor:pointer;font-size:1.2rem;color:var(--color-text-muted);line-height:1;transition:background 0.15s;"
                onmouseover="this.style.background='rgba(0,0,0,0.06)'" onmouseout="this.style.background='none'"
                onclick="window._agendaNav(1)">›</button>
            </div>
          </div>
        </div>

        <div class="card" style="padding:0;overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;min-width:640px;">
            <thead>
              <tr style="background:var(--bg-card-alt);">
                <th style="padding:10px 12px;text-align:left;border-bottom:2px solid rgba(0,0,0,0.08);min-width:60px;">
                  <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-text-muted);">Hora</div>
                </th>
                ${roomDefs.map(rc => roomHeader(rc)).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows.map(r => renderAgendaRow(r)).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (err) {
      console.error('buildAgendaHtml error:', err);
      return '<div class="card" style="padding:24px;color:#d9534f;"><strong>Error al cargar agenda:</strong> ' + err.message + '</div>';
    }
  }

  // paintAgenda — for navigation buttons
  function paintAgenda() {
    const root = document.getElementById('agenda-section-root');
    if (!root) return;
    root.innerHTML = buildAgendaHtml();
  }

  window._agendaNav = function(delta) {
    window._agendaDate = new Date(window._agendaDate);
    window._agendaDate.setDate(window._agendaDate.getDate() + delta);
    paintAgenda();
  };
  window._agendaGoToday = function() {
    window._agendaDate = new Date(); window._agendaDate.setHours(0,0,0,0);
    paintAgenda();
  };

  // ════════════════════════════════════════════
  // Render full Inicio view
  // ════════════════════════════════════════════
  container.innerHTML = `
    <div class="dashboard-header">
      <h1>Inicio</h1>
      <p class="dashboard-subtitle">ESPACIO ALVARADO · GESTIÓN DIARIA</p>
    </div>

    <!-- Agenda del día — PRIMERO -->
    <div id="agenda-section-root" style="margin-bottom:36px;">
      ${buildAgendaHtml()}
    </div>

    <!-- Talleres activos — ABAJO -->
    <div>
      <h3 style="margin-bottom:16px;">Talleres activos</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;">
        ${activeWorkshops.map(w => {
          const realIdx = workshops.indexOf(w);
          return renderWorkshopCard(w, realIdx);
        }).join('')}
      </div>
    </div>
  `;
};
