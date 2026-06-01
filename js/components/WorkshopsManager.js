// ══════════════════════════════════════════════════════════
// WorkshopsManager — Gestión de Talleres (Listado y Fechas IA)
// Panel de control para crear, editar, activar/desactivar talleres
// ══════════════════════════════════════════════════════════

window.renderWorkshops = function (container) {
  const sage = '#7A8B6F';
  const terracotta = '#C4956A';
  const lightSage = '#E8EDE5';
  const lightTerracotta = '#F5EDE5';

  // Ensure global workshops data is initialized
  // Spaces available
  const SPACES = ['Hall','Consultorio A','Consultorio B','Consultorio C','Consultorio D'];

  if (!window._workshopsData) {
    window._workshopsData = [
      {
        name: 'Yoga Terapéutico',
        instructor: 'Prof. Lucas Méndez',
        schedule: 'Martes y Jueves 18:00',
        occupied: 12, total: 15, color: sage, active: true,
        sessions: [
          { date:'2026-06-02', time:'18:00', space:'Hall', price:4500 },
          { date:'2026-06-04', time:'18:00', space:'Hall', price:4500 },
        ],
        descripcion: 'Clase de yoga suave adaptada a todos los niveles, ideal para liberar tensiones corporales, mejorar la postura y calmar la mente a través de la respiración consciente y la meditación.'
      },
      {
        name: 'Taller de Cuencos Tibetanos',
        instructor: 'Lic. Daniel Rodríguez',
        schedule: 'Sábados 16:00',
        occupied: 14, total: 15, color: terracotta, active: true,
        sessions: [
          { date:'2026-06-06', time:'16:00', space:'Hall', price:5000 },
          { date:'2026-06-20', time:'16:00', space:'Hall', price:5000 },
        ],
        descripcion: 'Viaje sonoro vibracional con cuencos de cuarzo y tibetanos. Una experiencia profunda de relajación diseñada para equilibrar el sistema nervioso, aliviar el insomnio y reducir el estrés.'
      },
      {
        name: 'Meditación & Mindfulness',
        instructor: 'Prof. Julián Ramos',
        schedule: 'Miércoles 19:00',
        occupied: 8, total: 12, color: sage, active: true,
        sessions: [
          { date:'2026-06-03', time:'19:00', space:'Hall', price:3500 },
        ],
        descripcion: 'Clase práctica semanal para incorporar la atención plena en tu vida diaria. Incluye ejercicios de respiración, escaneo corporal y técnicas para calmar la rumiación mental.'
      }
    ];
  }

  const workshops = window._workshopsData;

  // ── Render individual workshop card (Full Width) ──
  function renderManagerCard(w, idx) {
    const isActive = w.active !== false;

    if (!w.sessions) w.sessions = [];
    if (w.dates && w.dates.length && !w.sessions.length) {
      w.sessions = []; w.dates = [];
    }

    const DAY_SHORT = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

    function fmtSessionDate(s) {
      const d = new Date(s.date + 'T00:00:00');
      return `${DAY_SHORT[d.getDay()]} ${d.getDate()}/${String(d.getMonth()+1).padStart(2,'0')}`;
    }

    const sessionsHtml = w.sessions.map((s, sIdx) => {
      const occ = s.inscriptos || 0;
      const cap = w.total || 15;
      const pct = Math.round((occ / cap) * 100);
      const isFull = occ >= cap;
      return `
        <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:#fff;border:1px solid rgba(0,0,0,0.08);border-radius:8px;font-size:0.8rem;">
          <span style="font-weight:700;color:var(--color-text-primary);min-width:70px;">${fmtSessionDate(s)}</span>
          <span style="color:${sage};font-weight:600;min-width:90px;">${s.timeStart || s.time}${s.timeEnd ? ' – '+s.timeEnd : ''}</span>
          <span style="color:var(--color-text-muted);min-width:50px;">${s.space}</span>
          <div style="display:flex;align-items:center;gap:6px;margin-left:auto;">
            <div style="width:50px;height:5px;background:#eee;border-radius:3px;overflow:hidden;">
              <div style="width:${pct}%;height:100%;background:${isFull ? terracotta : sage};border-radius:3px;"></div>
            </div>
            <span style="font-size:0.72rem;font-weight:700;color:${isFull ? terracotta : sage};white-space:nowrap;">${occ}/${cap}</span>
          </div>
          <span style="color:${terracotta};font-weight:700;">$${(s.price||0).toLocaleString('es-AR')}</span>
          <span onclick="window._removeWorkshopSession(${idx}, ${sIdx})" style="cursor:pointer;color:#d9534f;font-weight:700;font-size:0.85rem;" title="Eliminar sesión">✕</span>
        </div>
      `;
    }).join('');

    return `
      <div class="card" style="border-top:3px solid ${w.color};display:flex;flex-direction:column;gap:20px;opacity:${isActive?'1':'0.75'};transition:opacity 0.3s ease;padding:24px;width:100%;box-sizing:border-box;">
        <!-- Top Row -->
        <div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:16px;border-bottom:1px solid rgba(0,0,0,0.06);padding-bottom:16px;">
          <div>
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
              <h4 style="margin:0;font-size:1.25rem;font-weight:700;color:var(--color-text-primary);font-family:var(--font-display);">${w.name}</h4>
              <span style="background:rgba(0,0,0,0.04);color:var(--color-text-muted);font-size:0.72rem;font-weight:700;padding:3px 10px;border-radius:4px;">Cupo: ${w.total} personas</span>
              ${isActive
                ? `<span style="background:rgba(122,139,111,0.1);color:${sage};font-size:0.7rem;font-weight:700;padding:3px 10px;border-radius:4px;border:1px solid rgba(122,139,111,0.2);">Ofrecido por Asistente IA</span>`
                : `<span style="background:rgba(0,0,0,0.05);color:var(--color-text-muted);font-size:0.7rem;font-weight:600;padding:3px 10px;border-radius:4px;border:1px solid rgba(0,0,0,0.1);">Oculto para Asistente IA</span>`}
            </div>
            ${w.instructor ? `<div style="margin-top:6px;font-size:0.78rem;color:var(--color-text-muted);">Instructor: <strong style="color:var(--color-text-secondary);">${w.instructor}</strong></div>` : ''}
          </div>
          <div style="display:flex;align-items:center;gap:12px;">
            <label style="display:flex;align-items:center;cursor:pointer;background:var(--bg-card-alt);padding:8px 16px;border-radius:20px;border:1px solid rgba(0,0,0,0.06);">
              <span style="font-size:0.82rem;font-weight:700;margin-right:12px;color:${isActive?sage:'var(--color-text-muted)'}">${isActive?'Taller Activo':'Taller Pausado'}</span>
              <div onclick="window._toggleWorkshopActive(${idx});event.stopPropagation();" style="width:40px;height:22px;background:${isActive?sage:'#ccc'};border-radius:11px;position:relative;transition:background 0.3s;flex-shrink:0;">
                <div style="width:16px;height:16px;background:#fff;border-radius:50%;position:absolute;top:3px;left:${isActive?'21px':'3px'};transition:left 0.3s;"></div>
              </div>
            </label>
          </div>
        </div>

        <!-- Description -->
        <div>
          <h5 style="margin:0 0 10px;font-size:0.8rem;font-weight:700;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:0.05em;">Descripción Completa</h5>
          <p style="margin:0;font-size:0.88rem;color:var(--color-text-secondary);line-height:1.6;white-space:pre-line;text-align:justify;">${w.descripcion}</p>
        </div>

        <div style="padding:12px 16px;background:${sage}08;border:1px dashed ${sage}30;border-radius:8px;">
          <span style="font-size:0.78rem;color:${sage};font-weight:600;">Las sesiones y horarios de este taller se asignan desde la sección <strong>Actividad</strong></span>
        </div>

        <!-- Bottom: Buttons -->
        <div style="display:flex;justify-content:flex-end;gap:12px;border-top:1px solid rgba(0,0,0,0.06);padding-top:16px;margin-top:8px;">
          <button class="button-secondary" style="padding:8px 20px;font-size:0.82rem;"
            onclick="window._openManagerWorkshopModal(window._workshopsData[${idx}], ${idx})">Editar Ficha</button>
          <button class="button-secondary" style="padding:8px 20px;font-size:0.82rem;color:#d9534f;border-color:rgba(217,83,79,0.2);background:rgba(217,83,79,0.02);"
            onclick="window._deleteWorkshop(${idx})">Eliminar Taller</button>
        </div>
      </div>
    `;
  }

  // ── Toggle active status ──
  window._toggleWorkshopActive = function (idx) {
    workshops[idx].active = workshops[idx].active === false ? true : false;
    window.renderWorkshops(container);
  };

  // ── Delete Workshop ──
  window._deleteWorkshop = function (idx) {
    if (confirm(`¿Estás segura de que querés eliminar el taller "${workshops[idx].name}"?`)) {
      workshops.splice(idx, 1);
      window.renderWorkshops(container);
    }
  };

  // ── Session Modal ──
  window._openSessionModal = function (idx) {
    const w = workshops[idx];
    const existing = document.querySelector('.session-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'session-modal-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease;';

    const spaceOpts = SPACES.map(sp => `<option value="${sp}">${sp}</option>`).join('');
    const lastPrice = w.sessions.length ? w.sessions[w.sessions.length-1].price : 0;

    overlay.innerHTML = `
      <style>
        .session-modal input, .session-modal select {
          width:100%; padding:9px 12px; border:1px solid rgba(0,0,0,0.12); border-radius:var(--radius-sm);
          font-family:var(--font-main); font-size:0.88rem; color:var(--color-text-primary);
          background:var(--bg-card-alt); outline:none; transition:border-color 0.2s;
        }
        .session-modal input:focus, .session-modal select:focus {
          border-color:${sage}; box-shadow:0 0 0 3px ${sage}22;
        }
        .session-modal label {
          display:block; font-size:0.72rem; font-weight:700; text-transform:uppercase;
          letter-spacing:0.05em; color:var(--color-text-muted); margin-bottom:5px;
        }
      </style>
      <div class="session-modal" style="background:var(--bg-card);border-radius:var(--radius-lg);width:480px;box-shadow:var(--shadow-float);padding:0;">
        <div style="padding:24px 28px 0;display:flex;align-items:center;gap:14px;margin-bottom:20px;">
          <div style="width:44px;height:44px;background:${w.color};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:700;color:#fff;flex-shrink:0;">${w.name.charAt(0).toUpperCase()}</div>
          <div style="flex:1;">
            <h2 style="margin:0;font-size:1.2rem;color:var(--color-text-primary);">Nueva sesión</h2>
            <p style="margin:2px 0 0;font-size:0.78rem;color:var(--color-text-muted);">${w.name} · Cupo ${w.total} personas</p>
          </div>
          <button onclick="this.closest('.session-modal-overlay').remove()" style="width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,0.06);color:var(--color-text-muted);font-size:1.1rem;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;">✕</button>
        </div>

        <div style="padding:0 28px 20px;display:flex;flex-direction:column;gap:14px;">
          <div>
            <label>Fecha</label>
            <input type="date" id="sm-date">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
            <div>
              <label>Hora inicio</label>
              <input type="time" id="sm-time-start" value="18:00">
            </div>
            <div>
              <label>Hora fin</label>
              <input type="time" id="sm-time-end" value="19:30">
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
            <div>
              <label>Espacio</label>
              <select id="sm-space">${spaceOpts}</select>
            </div>
            <div>
              <label>Precio por persona ($)</label>
              <input type="number" id="sm-price" value="${lastPrice}" min="0" placeholder="0">
            </div>
          </div>
        </div>

        <div style="padding:14px 28px 22px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(0,0,0,0.06);">
          <button onclick="this.closest('.session-modal-overlay').remove()" style="padding:9px 20px;font-size:0.85rem;background:transparent;color:var(--color-text-muted);font-weight:500;border:none;cursor:pointer;">Cancelar</button>
          <button style="padding:9px 24px;font-size:0.85rem;background:${sage};color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;"
            onclick="window._saveSession(${idx})">Programar sesión</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  };

  window._saveSession = function (idx) {
    const date = document.getElementById('sm-date');
    const timeStart = document.getElementById('sm-time-start');
    const timeEnd = document.getElementById('sm-time-end');
    const space = document.getElementById('sm-space');
    const price = document.getElementById('sm-price');

    if (!date || !date.value) { alert('Seleccioná una fecha'); return; }
    if (!timeStart || !timeStart.value) { alert('Seleccioná hora de inicio'); return; }

    if (!workshops[idx].sessions) workshops[idx].sessions = [];
    workshops[idx].sessions.push({
      date: date.value,
      timeStart: timeStart.value,
      timeEnd: timeEnd ? timeEnd.value : '',
      space: space ? space.value : 'Hall',
      price: parseInt(price ? price.value : 0) || 0,
      inscriptos: 0
    });

    const overlay = document.querySelector('.session-modal-overlay');
    if (overlay) overlay.remove();
    window.renderWorkshops(container);
  };

  // ── Remove Workshop Session ──
  window._removeWorkshopSession = function (idx, sIdx) {
    if (!workshops[idx].sessions) return;
    workshops[idx].sessions.splice(sIdx, 1);
    window.renderWorkshops(container);
  };

  // Legacy compat
  window._addWorkshopDate = window._addWorkshopSession;
  window._removeWorkshopDate = window._removeWorkshopSession;

  // ── Modal for Create / Edit ──
  window._openManagerWorkshopModal = function (w = null, idx = null) {
    const isEdit = w !== null;
    const existing = document.querySelector('.workshop-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'workshop-modal-overlay';
    overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.45); backdrop-filter:blur(6px); z-index:9999; display:flex; align-items:center; justify-content:center; animation: fadeIn 0.2s ease;';

    const modalData = w || {
      name: '',
      instructor: '',
      schedule: '',
      total: 15,
      occupied: 0,
      price: 0,
      color: sage,
      active: true,
      descripcion: '',
      dates: []
    };

    overlay.innerHTML = `
      <style>
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .workshop-modal { animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1); }
        .workshop-modal label { display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 5px; }
        .workshop-modal input, .workshop-modal textarea, .workshop-modal select {
          width: 100%; padding: 9px 12px; border: 1px solid rgba(0,0,0,0.12); border-radius: var(--radius-sm);
          font-family: var(--font-main); font-size: 0.88rem; color: var(--color-text-primary);
          background: var(--bg-card-alt); transition: border-color 0.2s; outline: none;
        }
        .workshop-modal input:focus, .workshop-modal textarea:focus, .workshop-modal select:focus {
          border-color: ${sage}; box-shadow: 0 0 0 3px ${sage}22;
        }
        .workshop-modal textarea { resize: vertical; min-height: 120px; line-height: 1.6; }
        .workshop-modal .field-group { margin-bottom: 14px; }
        .workshop-modal .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .workshop-modal .desc-hint { font-size: 0.72rem; color: var(--color-text-muted); margin-top: 4px; font-style: italic; }
      </style>

      <div class="workshop-modal" style="background: var(--bg-card); border-radius: var(--radius-lg); width: 760px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-float); padding: 0;">
        <div style="padding: 28px 28px 0; display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
          <div id="modal-color-indicator" style="width: 48px; height: 48px; background: ${modalData.color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; font-weight: 700; color: #fff; flex-shrink: 0;">
            ${modalData.name ? modalData.name.charAt(0).toUpperCase() : 'T'}
          </div>
          <div style="flex: 1;">
            <h2 style="margin: 0; font-size: 1.35rem; color: var(--color-text-primary);">${isEdit ? 'Editar Taller' : 'Crear Nuevo Taller'}</h2>
            <p style="margin: 2px 0 0; font-size: 0.78rem; color: var(--color-text-muted);">Definir ficha técnica y disponibilidad de clase grupal</p>
          </div>
          <button onclick="this.closest('.workshop-modal-overlay').remove()" style="width: 32px; height: 32px; border-radius: 50%; background: rgba(0,0,0,0.06); color: var(--color-text-muted); font-size: 1.1rem; display: flex; align-items: center; justify-content: center;">✕</button>
        </div>

        <div style="padding: 0 28px 8px;">
          <!-- Nombre + Capacidad + Precio -->
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div class="field-group" style="margin-bottom:0;">
              <label>Nombre del Taller / Clase</label>
              <input type="text" value="${modalData.name}" id="mws-name" placeholder="Ej. Yoga Terapéutico" oninput="document.getElementById('modal-color-indicator').textContent = this.value ? this.value.charAt(0).toUpperCase() : 'T'">
            </div>
            <div class="field-group" style="margin-bottom:0;">
              <label>Cupo máx.</label>
              <input type="number" value="${modalData.total}" id="mws-total" min="1">
            </div>
            <div class="field-group" style="margin-bottom:0;">
              <label>Precio / Persona</label>
              <input type="number" value="${modalData.price || 0}" id="mws-price" min="0">
            </div>
          </div>

          <!-- Descripción para IA -->
          <div class="field-group" style="background: ${lightTerracotta}; border-radius: var(--radius-md); padding: 16px; border: 1px solid ${terracotta}30;">
            <label style="margin: 0; color: ${terracotta}; font-weight: 800;">Descripción para el Asistente IA</label>
            <textarea id="mws-descripcion" placeholder="Explica detalladamente de qué trata el taller para que el asistente pueda venderlo y agendar...">${modalData.descripcion}</textarea>
            <p class="desc-hint">El bot usará este texto para interactuar con pacientes interesados y motivarlos a reservar.</p>
          </div>
        </div>

        <div style="padding: 16px 28px 24px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(0,0,0,0.06); margin-top: 12px;">
          <button onclick="this.closest('.workshop-modal-overlay').remove()" style="padding: 9px 20px; font-size: 0.85rem; background: transparent; color: var(--color-text-muted); font-weight: 500;">
            Cancelar
          </button>
          <button class="button-primary" style="padding: 9px 24px; font-size: 0.85rem;"
            onclick="
              const name = document.getElementById('mws-name').value.trim();
              const total = parseInt(document.getElementById('mws-total').value, 10) || 15;
              const price = parseFloat(document.getElementById('mws-price').value) || 0;
              const descripcion = document.getElementById('mws-descripcion').value.trim();

              if (!name) {
                alert('Por favor introduce el nombre del taller');
                return;
              }

              const data = { name, total, price, descripcion };

              if (${isEdit}) {
                window._workshopsData[${idx}] = {
                  ...window._workshopsData[${idx}],
                  ...data
                };
              } else {
                data.sessions = [];
                data.occupied = 0;
                data.color = '${sage}';
                data.active = true;
                data.instructor = '';
                window._workshopsData.push(data);
              }

              this.closest('.workshop-modal-overlay').remove();
              window.renderWorkshops(container);
            ">
            ${isEdit ? 'Guardar Cambios' : 'Crear Taller'}
          </button>
        </div>
      </div>
    `;

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    document.body.appendChild(overlay);
  };

  // ── Render view layout ──
  container.innerHTML = `
    <div class="dashboard-header" style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h1>Talleres y Clases</h1>
        <p class="dashboard-subtitle">CONFIGURACIÓN DE CLASES GRUPALES Y CONTROL DE OFERTAS IA</p>
      </div>
      <button class="button-primary" onclick="window._openManagerWorkshopModal()" style="display: flex; align-items: center; gap: 8px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Crear Taller
      </button>
    </div>

    ${workshops.length === 0 
      ? `
        <div class="card" style="text-align: center; padding: 48px; border: 2px dashed rgba(0,0,0,0.08); background: transparent;">
          <h3 style="color: var(--color-text-secondary); margin-bottom: 8px;">No hay talleres registrados</h3>
          <p style="color: var(--color-text-muted); font-size: 0.88rem; max-width: 400px; margin: 0 auto 20px;">
            Creá talleres grupales y el asistente conversacional de WhatsApp los ofrecerá automáticamente a los pacientes interesados según su cupo y descripción.
          </p>
          <button class="button-primary" onclick="window._openManagerWorkshopModal()">Crear Primer Taller</button>
        </div>
      `
      : `
        <div style="display: flex; flex-direction: column; gap: 20px;">
          ${workshops.map((w, idx) => renderManagerCard(w, idx)).join('')}
        </div>
      `
    }
  `;
};
