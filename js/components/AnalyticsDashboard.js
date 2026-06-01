// ============================================
// AnalyticsDashboard.js — Espacio Alvarado
// Dashboard de gestión financiera (vista de Sofi)
// ============================================

window.renderAnalytics = function (container) {
  const sage = '#7A8B6F';
  const terracotta = '#C4956A';
  const lightSage = '#E8EDE5';

  // Helper para iconos con fallback
  const icon = (name, color = 'var(--color-accent)', size = 24) =>
    window.getIcon ? window.getIcon(name, color, size) : '';

  // ── State: configurable room prices & hours ──
  if (!window._roomsData) {
    window._roomsData = [
      { name: 'Consultorio 1 (A)', pct: 78, hours: 62, price: 3000 },
      { name: 'Consultorio 2 (B)', pct: 62, hours: 50, price: 2500 },
      { name: 'Consultorio 3 (C)', pct: 89, hours: 71, price: 3500 },
      { name: 'Consultorio 4 (D)', pct: 45, hours: 36, price: 2000 },
    ];
  }

  // ── State: workshops ──
  const workshops = window._workshopsData || [
    { name: 'Yoga Terapéutico',       occupied: 12, total: 15, price: 4500, active: true },
    { name: 'Taller de Cuencos',      occupied: 14, total: 15, price: 5000, active: true },
    { name: 'Meditación & Mindfulness', occupied: 8, total: 12, price: 3500, active: true },
  ];

  const rooms = window._roomsData;

  // ── Derived KPIs ──
  const totalHoursAvailable = 80; // horas totales del mes por consultorio (ref)
  const totalHoursUsed = rooms.reduce((s, r) => s + r.hours, 0);
  const totalHoursPossible = rooms.length * totalHoursAvailable;
  const overallPct = Math.round((totalHoursUsed / totalHoursPossible) * 100);
  const totalRoomRevenue = rooms.reduce((s, r) => s + r.hours * r.price, 0);
  const totalWorkshopRevenue = workshops.reduce((s, w) => {
    if (w.active === false) return s;
    const sess = w.sessions || [];
    const avg = sess.length > 0
      ? Math.round(sess.reduce((a, x) => a + (x.price||0), 0) / sess.length)
      : (w.price || 0);
    return s + w.occupied * avg;
  }, 0);
  const totalRevenue = totalRoomRevenue + totalWorkshopRevenue;

  // ── Helper: occupancy bar ──
  function occBar(pct, color) {
    return `
      <div style="flex:1; height: 10px; background: #eee; border-radius: 5px; overflow: hidden;">
        <div style="width:${pct}%; height:100%; background:${color}; border-radius:5px; transition: width 0.5s ease;"></div>
      </div>
    `;
  }

  // ── Helper: editable number cell ──
  function editCell(id, value, prefix = '') {
    return `
      <span style="display:inline-flex; align-items:center; gap:3px;">
        ${prefix}<input id="${id}" type="number" value="${value}"
          style="width:70px; padding:4px 6px; border:1px solid rgba(0,0,0,0.10); border-radius:4px;
                 font-size:0.85rem; font-weight:600; text-align:right; background: var(--bg-card-alt); outline:none;"
          onchange="window._updateRoomData()">
      </span>
    `;
  }

  container.innerHTML = `
    <!-- Header -->
    <div class="dashboard-header">
      <h1>Finanzas</h1>
      <p class="dashboard-subtitle">DASHBOARD DE GESTIÓN · ESPACIO ALVARADO</p>
    </div>

    <!-- KPI Cards (top) -->
    <div class="dashboard-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 28px;">

      <div class="card" style="text-align:center;">
        <small style="color:var(--color-text-secondary); text-transform:uppercase; font-size:0.72rem; letter-spacing:0.05em;">Ingresos del mes</small>
        <div style="font-size:1.9rem; font-weight:700; color:var(--color-text-primary); margin:8px 0; font-family:var(--font-display);">
          $${totalRevenue.toLocaleString('es-AR')}
        </div>
        <span style="color:var(--color-success); font-size:0.82rem;">▲ Consultorios + Talleres</span>
      </div>

      <div class="card" style="text-align:center;">
        <small style="color:var(--color-text-secondary); text-transform:uppercase; font-size:0.72rem; letter-spacing:0.05em;">Horas contratadas (mes)</small>
        <div style="font-size:1.9rem; font-weight:700; color:var(--color-text-primary); margin:8px 0; font-family:var(--font-display);">
          ${totalHoursUsed} <span style="font-size:1rem; color:var(--color-text-muted);">/ ${totalHoursPossible} hrs</span>
        </div>
        <span style="color:var(--color-text-secondary); font-size:0.82rem;">Ocupación promedio: <strong>${overallPct}%</strong></span>
      </div>

      <div class="card" style="text-align:center;">
        <small style="color:var(--color-text-secondary); text-transform:uppercase; font-size:0.72rem; letter-spacing:0.05em;">Ingresos por talleres</small>
        <div style="font-size:1.9rem; font-weight:700; color:var(--color-text-primary); margin:8px 0; font-family:var(--font-display);">
          $${totalWorkshopRevenue.toLocaleString('es-AR')}
        </div>
        <span style="color:var(--color-text-secondary); font-size:0.82rem;">${workshops.filter(w => w.active !== false).length} taller(es) activos</span>
      </div>

    </div>

    <!-- ═══════════════════════════════════ -->
    <!-- SECCIÓN 1: HORAS CONTRATADAS       -->
    <!-- ═══════════════════════════════════ -->
    <div class="card" style="margin-bottom:24px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
        <h3 style="margin:0;">Horas Contratadas — Ocupación Total del Espacio</h3>
        <span style="font-size:0.88rem; color:var(--color-text-muted);">Mayo 2026</span>
      </div>

      <!-- Overall bar -->
      <div style="display:flex; align-items:center; gap:14px; margin-bottom:22px; padding:14px; background:var(--bg-card-alt); border-radius:var(--radius-md);">
        <div style="min-width:120px;">
          <div style="font-size:1.6rem; font-weight:700; color:${sage}; font-family:var(--font-display);">${overallPct}%</div>
          <div style="font-size:0.75rem; color:var(--color-text-muted); text-transform:uppercase; letter-spacing:0.05em;">Ocupación general</div>
        </div>
        <div style="flex:1;">
          ${occBar(overallPct, sage)}
          <div style="display:flex; justify-content:space-between; margin-top:4px; font-size:0.75rem; color:var(--color-text-muted);">
            <span>${totalHoursUsed} hrs usadas</span>
            <span>${totalHoursPossible} hrs disponibles</span>
          </div>
        </div>
      </div>

      <!-- Per-room bars -->
      <div style="display:flex; flex-direction:column; gap:10px;" id="room-occ-bars">
        ${rooms.map(r => `
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="min-width:145px; font-size:0.85rem; color:var(--color-text-primary); font-weight:500;">${r.name}</span>
            ${occBar(r.pct, r.pct > 80 ? terracotta : sage)}
            <span style="min-width:80px; text-align:right; font-size:0.85rem;">
              <strong>${r.pct}%</strong> <span style="color:var(--color-text-muted); font-size:0.78rem;">(${r.hours} hrs)</span>
            </span>
          </div>
        `).join('')}
      </div>
    </div>



    <!-- ═══════════════════════════════════ -->
    <!-- SECCIÓN 3: TALLERES                 -->
    <!-- ═══════════════════════════════════ -->
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
        <h3 style="margin:0;">Talleres — Participantes e Ingreso</h3>
        <span style="font-size:0.78rem; color:var(--color-text-muted); background:var(--bg-card-alt); padding:5px 12px; border-radius:20px;">
          Solo talleres activos
        </span>
      </div>

      ${workshops.filter(w => w.active !== false).length === 0
        ? `<p style="color:var(--color-text-muted); text-align:center; padding:24px 0; font-style:italic;">No hay talleres activos. Activá talleres desde la sección Talleres.</p>`
        : `
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse;">
            <thead>
              <tr style="background:var(--bg-card-alt);">
                <th style="padding:10px 14px; text-align:left; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--color-text-muted); border-bottom:2px solid rgba(0,0,0,0.07);">Taller</th>
                <th style="padding:10px 14px; text-align:center; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:${sage}; border-bottom:2px solid ${sage}40;">Participantes</th>
                <th style="padding:10px 14px; text-align:center; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:${sage}; border-bottom:2px solid ${sage}40;">Cupo</th>
                <th style="padding:10px 14px; text-align:center; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:${sage}; border-bottom:2px solid ${sage}40;">Sesiones</th>
                <th style="padding:10px 14px; text-align:right; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:${sage}; border-bottom:2px solid ${sage}40;">Precio/persona</th>
                <th style="padding:10px 14px; text-align:right; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:${terracotta}; border-bottom:2px solid ${terracotta}40;">Ingreso</th>
              </tr>
            </thead>
            <tbody>
              ${workshops.filter(w => w.active !== false).map((w) => {
                const sessions = w.sessions || [];
                const avgPrice = sessions.length > 0
                  ? Math.round(sessions.reduce((s,x) => s + (x.price||0), 0) / sessions.length)
                  : (w.price || 0);
                const revenue = w.occupied * avgPrice;
                const pct = Math.round((w.occupied / w.total) * 100);
                return `
                  <tr style="border-bottom:1px solid rgba(0,0,0,0.05);">
                    <td style="padding:12px 14px; font-weight:600; font-size:0.88rem; color:var(--color-text-primary);">${w.name}</td>
                    <td style="padding:12px 14px; text-align:center;">
                      <div style="display:flex; align-items:center; gap:8px; justify-content:center;">
                        <div style="width:80px; height:8px; background:#eee; border-radius:4px; overflow:hidden;">
                          <div style="width:${pct}%; height:100%; background:${pct > 80 ? terracotta : sage}; border-radius:4px;"></div>
                        </div>
                        <span style="font-weight:700; color:var(--color-text-primary);">${w.occupied}</span>
                      </div>
                    </td>
                    <td style="padding:12px 14px; text-align:center; color:var(--color-text-muted); font-size:0.88rem;">${w.total}</td>
                    <td style="padding:12px 14px; text-align:center; font-size:0.85rem; font-weight:600; color:var(--color-text-primary);">${sessions.length}</td>
                    <td style="padding:12px 14px; text-align:right; font-size:0.92rem; font-weight:700; color:var(--color-text-primary);">
                      $${avgPrice.toLocaleString('es-AR')}
                    </td>
                    <td style="padding:12px 14px; text-align:right; font-size:1rem; font-weight:700; color:${terracotta};">
                      $${revenue.toLocaleString('es-AR')}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
            <tfoot>
              <tr style="background:var(--bg-card-alt);">
                <td style="padding:12px 14px; font-weight:700; font-size:0.88rem; color:var(--color-text-primary);" colspan="5">TOTAL TALLERES</td>
                <td style="padding:12px 14px; text-align:right; font-weight:700; font-size:1.05rem; color:${terracotta};">$${totalWorkshopRevenue.toLocaleString('es-AR')}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      `}
    </div>
  `;

  // ── Live update handlers ──
  window._updateRoomField = function (idx, field, val) {
    window._roomsData[idx][field] = parseInt(val) || 0;
    // Recalculate occupancy %
    if (field === 'hours') {
      window._roomsData[idx].pct = Math.round((parseInt(val) / totalHoursAvailable) * 100);
    }
    window.renderAnalytics(container);
  };
};
