// ══════════════════════════════════════════
// AssistantDashboard — Espacio Alvarado
// Panel del Bot · Vista admin de Sofi
// ══════════════════════════════════════════

window.renderAssistant = function (container) {
  // ── Data: turnos agendados por el bot ────
  const turnos = [
    { hora: '09:00', paciente: 'María Gomez', profesional: 'Lic. García', especialidad: 'Psicología', sala: 'Consultorio A', estado: 'Confirmado', pendiente: false },
    { hora: '10:30', paciente: 'Juan Pérez', profesional: 'Dr. Rodríguez', especialidad: 'Psicología Holística', sala: 'Consultorio C', estado: 'Confirmado', pendiente: false },
    { hora: '14:00', paciente: 'Laura Méndez', profesional: 'Lic. Torres', especialidad: 'Gestalt', sala: 'Consultorio A', estado: 'Pendiente confirmación', pendiente: true },
    { hora: '16:00', paciente: 'Ana Torres', profesional: 'Dra. Fossati', especialidad: 'Nutrición', sala: 'Consultorio B', estado: 'Confirmado', pendiente: false },
    { hora: '17:00', paciente: 'Diego Acosta', profesional: 'Prof. Méndez', especialidad: 'Yoga Terapéutico', sala: 'Consultorio D', estado: 'Confirmado', pendiente: false }
  ];

  // ── Data: conversaciones activas ─────────
  const conversaciones = [
    { nombre: 'Carolina Ruiz', resumen: 'Busca psicólogo', badge: 'Eligiendo profesional', escalado: false },
    { nombre: 'Tomás Blanco', resumen: 'Consulta por yoga', badge: 'Agendando turno', escalado: false },
    { nombre: 'Patricia Vega', resumen: 'Reclamo por turno', badge: 'Escalado a Sofi', escalado: true }
  ];

  container.innerHTML = `
    <!-- ═══ Header ═══ -->
    <div class="dashboard-header">
      <h1>Asistente IA</h1>
      <p class="dashboard-subtitle">CONVERSACIONES DEL BOT · HOY</p>
    </div>

    <!-- ═══ Two-column grid ═══ -->
    <div style="display: grid; grid-template-columns: 3fr 2fr; gap: 18px; align-items: start;">

      <!-- ── Left column: Turnos agendados ── -->
      <div class="card">
        <h3>Turnos agendados por el bot</h3>
        <div style="display: flex; flex-direction: column; gap: 0;">
          ${turnos.map((t, i) => `
            <div style="display: flex; align-items: center; gap: 14px; padding: 12px 0; ${i < turnos.length - 1 ? 'border-bottom: 1px solid rgba(0,0,0,0.06);' : ''}">
              <!-- Hora -->
              <span style="font-weight: 700; font-size: 1rem; color: var(--color-text-primary); font-family: var(--font-display); min-width: 50px;">
                ${t.hora}
              </span>
              <!-- Info del turno -->
              <div style="flex: 1; min-width: 0;">
                <div style="font-size: 0.88rem; color: var(--color-text-primary); font-weight: 500;">
                  ${t.paciente} <span style="color: var(--color-text-muted);">→</span> ${t.profesional}
                </div>
                <div style="font-size: 0.78rem; color: var(--color-text-muted); margin-top: 2px;">
                  ${t.especialidad} · ${t.sala} · <span style="color: ${t.pendiente ? 'var(--color-warning)' : 'var(--color-success)'};">${t.estado}</span>
                </div>
              </div>
              <!-- Botón Ver Chat -->
              <button class="button-secondary" style="font-size: 0.78rem; padding: 6px 14px; white-space: nowrap;"
                onclick="if (window.openChat) window.openChat('${t.paciente}')">
                Ver Chat
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ── Right column: Conversaciones activas ── -->
      <div class="card">
        <h3>Conversaciones activas</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${conversaciones.map(c => `
            <div style="background: var(--bg-card-alt); border-radius: var(--radius-sm); padding: 14px; border: 1px solid rgba(0,0,0,0.06); ${c.escalado ? 'border-left: 3px solid var(--color-warning);' : ''}; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
              <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 600; font-size: 0.88rem; color: var(--color-text-primary); margin-bottom: 3px;">
                  ${c.nombre}
                </div>
                <div style="font-size: 0.82rem; color: var(--color-text-secondary); margin-bottom: 8px;">
                  ${c.resumen}
                </div>
                <span style="
                  display: inline-block;
                  padding: 3px 10px;
                  border-radius: var(--radius-sm);
                  font-size: 0.67rem;
                  font-weight: 700;
                  text-transform: uppercase;
                  letter-spacing: 0.06em;
                  ${c.escalado
                    ? 'background: rgba(230,168,23,0.12); color: var(--color-warning); border: 1px solid rgba(230,168,23,0.25);'
                    : 'background: rgba(122,139,111,0.12); color: #7A8B6F; border: 1px solid rgba(122,139,111,0.25);'
                  }
                ">
                  ${c.badge}
                </span>
              </div>
              <button class="button-secondary" style="font-size: 0.75rem; padding: 6px 12px; white-space: nowrap; flex-shrink: 0;"
                onclick="if (window.openChat) window.openChat('${c.nombre}')">
                Ver Chat
              </button>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
};
