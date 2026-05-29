// ══════════════════════════════════════════
// SmartWidgets — Espacio Alvarado
// Estado de consultorios · Bot WhatsApp · Próximos turnos
// Layout unificado: Próximos Turnos ocupa toda la columna derecha
// ══════════════════════════════════════════

window.renderSmartWidgets = function (container) {
  let widgetArea = container.querySelector('.smart-widgets');
  if (!widgetArea) {
    widgetArea = document.createElement('div');
    widgetArea.className = 'smart-widgets';
    const mainGrid = container.querySelector('.dashboard-grid');
    if (mainGrid) {
      container.insertBefore(widgetArea, mainGrid);
      mainGrid.style.display = 'none';
    } else {
      container.appendChild(widgetArea);
    }
  }

  // ── Data ──────────────────────────────────
  const workshops = window._workshopsData || [
    { name: 'Yoga Terapéutico', occupied: 12, total: 15 }
  ];
  const activeYoga = workshops[0];

  const consultorios = [
    { nombre: 'Consultorio A', profesional: 'Lic. García', estado: 'En sesión', color: '#e6a817', ubicacion: 'Planta baja' },
    { nombre: 'Consultorio B', profesional: null, estado: 'Libre', color: '#3d9970', ubicacion: 'Planta baja' },
    { nombre: 'Consultorio C', profesional: 'Dr. Rodríguez', estado: 'En sesión', color: '#e6a817', ubicacion: '1er piso' },
    { nombre: 'Consultorio D', profesional: null, estado: 'Libre', color: '#3d9970', ubicacion: '1er piso' },
    { nombre: 'Hall (Talleres)', profesional: 'Prof. Méndez', estado: `Yoga (${activeYoga.occupied}/${activeYoga.total})`, color: '#C4956A', ubicacion: 'Planta baja' }
  ];

  const turnos = [
    { hora: '14:00', paciente: 'Laura Méndez', profesional: 'Lic. García', sala: 'Consultorio A' },
    { hora: '15:00', paciente: 'Martín Sosa', profesional: 'Dr. Rodríguez', sala: 'Consultorio C' },
    { hora: '16:30', paciente: 'Camila Herrera', profesional: 'Prof. Méndez', sala: 'Consultorio D' },
    { hora: '17:00', paciente: 'Diego Acosta', profesional: 'Lic. Torres', sala: 'Consultorio A' },
    { hora: '18:00', paciente: 'Sofía Blanco', profesional: 'Dra. Ruiz', sala: 'Consultorio C' },
    { hora: '19:00', paciente: 'Tomás Heredia', profesional: 'Lic. García', sala: 'Consultorio A' }
  ];

  widgetArea.innerHTML = `
    <!-- ═══ Row 1: Estado de Consultorios (full width) ═══ -->
    <div class="card" style="grid-column: 1 / -1; margin-bottom: 16px;">
      <h3 style="margin-bottom: 12px;">Estado de Consultorios</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px;">
        ${consultorios.map(c => `
          <div style="background: var(--bg-card-alt); border-radius: var(--radius-sm); padding: 14px; border: 1px solid rgba(0,0,0,0.06);">
            <div style="font-weight: 700; font-size: 0.85rem; color: var(--color-text-primary); margin-bottom: 8px;">
              ${c.nombre}
            </div>
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: ${c.color}; display: inline-block; flex-shrink: 0;"></span>
              <span style="font-size: 0.82rem; color: var(--color-text-secondary);">
                ${c.profesional ? c.profesional + ' — ' + c.estado : c.estado}
              </span>
            </div>
            <div style="font-size: 0.7rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.08em;">
              ${c.ubicacion}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- ═══ Row 2+3: Grid unificado ═══ -->
    <div style="grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: auto auto; gap: 16px;">

      <!-- LEFT: Bot WhatsApp Hoy -->
      <div class="card" style="grid-column: 1; grid-row: 1;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
          <h3 style="margin: 0;">Bot WhatsApp Hoy</h3>
          <span style="display: inline-flex; align-items: center; gap: 5px; font-size: 0.72rem; color: var(--color-success); font-weight: 600;">
            <span style="width: 7px; height: 7px; border-radius: 50%; background: var(--color-success); display: inline-block; animation: pulse 2s infinite;"></span>
            Bot activo
          </span>
        </div>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          ${renderBotStat('12', 'conversaciones')}
          ${renderBotStat('8', 'turnos agendados')}
          ${renderBotStat('2', 'derivados a Sofi')}
        </div>
        <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 2rem; font-weight: 800; color: var(--color-accent); line-height: 1;">96%</span>
          <span style="font-size: 0.78rem; color: var(--color-text-muted);">tasa de<br>respuesta</span>
        </div>
        <style>
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        </style>
      </div>

      <!-- LEFT: Resumen + Prof. Interesados -->
      <div style="grid-column: 1; grid-row: 2; display: flex; flex-direction: column; gap: 16px;">
        <div class="card" style="flex: 1;">
          <h3>Resumen del día</h3>
          <p style="color: var(--color-text-secondary); line-height: 1.7; margin: 8px 0 0;">
            Hoy tenés <strong>12 turnos</strong> programados en 4 consultorios.<br>
            El bot agendó <strong>3 turnos nuevos</strong> esta mañana.<br>
            <strong>2 consultorios</strong> están ocupados ahora.
          </p>
        </div>
        <div class="card" style="flex: 1;">
          <h3>Profesionales interesados</h3>
          <p style="color: var(--color-text-secondary); line-height: 1.7; margin: 8px 0 0;">
            <strong>3 profesionales</strong> nuevos se contactaron vía el bot.<br>
            <span style="color: var(--color-accent); cursor: pointer;" onclick="document.querySelector('button[onclick*=\\'professionals\\']').click()">→ Revisalos en la sección Profesionales</span>
          </p>
        </div>
      </div>

      <!-- RIGHT: Próximos Turnos (spans both rows, height 100% for alignment) -->
      <div class="card" style="grid-column: 2; grid-row: 1 / 3; display: flex; flex-direction: column; height: 100%;">
        <h3 style="margin-bottom: 12px;">Próximos Turnos</h3>
        <div style="display: flex; flex-direction: column; gap: 0; flex: 1; justify-content: space-between;">
          ${turnos.map((t, i) => `
            <div style="display: flex; align-items: center; gap: 12px; padding: 8px 0; ${i < turnos.length - 1 ? 'border-bottom: 1px solid rgba(0,0,0,0.05);' : ''} flex: 1;">
              <span style="font-weight: 700; font-size: 0.95rem; color: var(--color-text-primary); font-family: var(--font-display); min-width: 48px;">
                ${t.hora}
              </span>
              <span style="font-size: 0.88rem; color: var(--color-text-secondary);">
                ${t.paciente}
              </span>
              <span style="color: var(--color-text-muted); font-size: 0.8rem;">→</span>
              <span style="font-size: 0.88rem; font-weight: 500; color: var(--color-text-primary);">
                ${t.profesional}
              </span>
              <span class="badge" style="margin-left: auto; font-size: 0.65rem;">
                ${t.sala}
              </span>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
};

// ── Helper: stat item for Bot widget ────────
function renderBotStat(number, label) {
  return `
    <div style="flex: 1; min-width: 80px; text-align: center; padding: 10px 6px; background: var(--bg-card-alt); border-radius: var(--radius-sm);">
      <div style="font-size: 1.6rem; font-weight: 800; color: var(--color-text-primary); line-height: 1;">${number}</div>
      <div style="font-size: 0.72rem; color: var(--color-text-muted); margin-top: 4px;">${label}</div>
    </div>
  `;
}
