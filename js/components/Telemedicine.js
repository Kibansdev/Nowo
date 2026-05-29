// ============================================
// Telemedicine.js — Espacio Alvarado
// Módulo de videoconsulta para sesiones remotas
// ============================================

window.renderTelemedicine = function (container) {
    container.innerHTML = `
    <!-- Fase 2 Banner -->
    <div style="background: var(--color-bg-secondary, #f0f0f0); border-left: 3px solid var(--color-accent); padding: 10px 16px; border-radius: 6px; margin-bottom: 20px;">
      <small style="color: var(--color-text-secondary); font-size: 0.8rem; letter-spacing: 0.03em;">Fase 2 — Módulo de videoconsulta para sesiones remotas</small>
    </div>

    <h1>Videoconsulta</h1>
    <p style="color: var(--color-text-secondary); margin-bottom: 30px;">Atención remota segura. Ideal para consultas de seguimiento o entre profesionales.</p>
    
    <div class="card" style="padding: 0; overflow: hidden; background: #1a1a1a;">
      <!-- Video Area -->
      <div style="position: relative; background: linear-gradient(135deg, #2d3436 0%, #636e72 100%); height: 400px; display: flex; align-items: center; justify-content: center;">
        <div style="text-align: center; color: white;">
          <div style="font-size: 2rem; margin-bottom: 15px; color: rgba(255,255,255,0.6); font-weight: 700;">Video</div>
          <p style="font-size: 1.2rem; margin-bottom: 20px;">Esperando conexión...</p>
          <button class="button-primary" onclick="startCall(this)" style="background: var(--color-success);">Iniciar Llamada</button>
        </div>
        
        <!-- Self View (Small Preview) -->
        <div style="position: absolute; bottom: 20px; right: 20px; width: 150px; height: 110px; background: #000; border-radius: 12px; border: 2px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center;">
          <span style="color: rgba(255,255,255,0.5); font-size: 0.8rem; font-weight: 600;">Vista previa</span>
        </div>

        <!-- Espacio Alvarado Branding Overlay -->
        <div style="position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.5); padding: 10px 15px; border-radius: 8px; backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1);">
          <span style="color: white; font-family: var(--font-display); font-size: 1rem; font-weight: 700; letter-spacing: 0.05em;">EA</span>
        </div>
      </div>

      <!-- Controls -->
      <div style="background: #2d3436; padding: 20px; display: flex; justify-content: center; gap: 15px;">
        <button class="video-control" onclick="alert('Micrófono ${Math.random() > 0.5 ? 'silenciado' : 'activado'}')">
          ${window.getIcon ? window.getIcon('message-circle', '#fff', 24) : 'Mic'}
        </button>
        <button class="video-control" onclick="alert('Cámara ${Math.random() > 0.5 ? 'apagada' : 'encendida'}')">
          Cam
        </button>
        <button class="video-control" style="background: var(--color-error);" onclick="alert('Llamada finalizada')">
          ✕
        </button>
      </div>
    </div>

    <div class="dashboard-grid" style="margin-top: 30px;">
      <div class="card">
        <h3>Próximas Video-consultas</h3>
        <p style="margin-top: 15px; color: var(--color-text-secondary);">No hay llamadas programadas.</p>
        <button class="button-secondary" style="margin-top: 15px; width: 100%;">Programar Nueva</button>
      </div>
      <div class="card">
        <h3>Historial</h3>
        <p style="margin-top: 15px; color: var(--color-text-secondary);">3 llamadas este mes</p>
        <small style="display: block; margin-top: 10px;">Última: María Gomez (2 días atrás)</small>
      </div>
    </div>
  `;
}

function startCall(btn) {
    btn.textContent = 'En llamada...';
    btn.style.background = 'var(--color-error)';
    btn.onclick = () => {
        btn.textContent = 'Iniciar Llamada';
        btn.style.background = 'var(--color-success)';
        btn.onclick = () => startCall(btn);
        alert('Llamada finalizada');
    };
}
