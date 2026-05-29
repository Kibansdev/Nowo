// ============================================
// PanicButton.js — Espacio Alvarado
// Modal de asistencia inmediata para profesionales
// ============================================

window.renderPanicModal = function () {
    // Remove existing modal if any
    const existingModal = document.getElementById('panic-modal');
    if (existingModal) existingModal.remove();

    // Create Modal Overlay
    const modal = document.createElement('div');
    modal.id = 'panic-modal';
    modal.className = 'modal-overlay'; // Re-use existing modal overlay style

    modal.innerHTML = `
    <div class="chat-window animate-slide-up" style="height: auto; max-height: 90vh; background: #fffcfc;">
      <!-- Header -->
      <div class="chat-header" style="background: #ffebeb; color: #d00;">
        <h3 style="color: #d00; display: flex; align-items: center; gap: 10px;">
          Asistencia Inmediata
        </h3>
        <button class="close-btn" onclick="document.getElementById('panic-modal').remove()">✕</button>
      </div>

      <!-- Body -->
      <div class="chat-body" style="background: white; padding: 25px;">
        <p style="margin-bottom: 20px; color: var(--color-text-secondary); text-align: center;">
          Solicita ayuda al staff de Espacio Alvarado. Esta alerta tiene <strong>prioridad alta</strong>.
        </p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          ${renderPanicOption('Limpieza', 'Derrames, suciedad')}
          ${renderPanicOption('Seguridad', 'Problema con paciente')}
          ${renderPanicOption('Insumos', 'Papel, Agua, Café')}
          ${renderPanicOption('Mantenimiento', 'Luz, Internet, AC')}
        </div>

        <div id="panic-status" style="margin-top: 20px; text-align: center; display: none;">
          <div style="font-size: 1.1rem; margin-bottom: 10px; font-weight: 700; color: var(--color-success);">Listo</div>
          <strong style="color: var(--color-success);">Ayuda en camino</strong>
          <p style="font-size: 0.9rem;">Tiempo estimado: 2 min</p>
        </div>
      </div>
    </div>
  `;

    // Close on click outside
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };

    document.body.appendChild(modal);
}

function renderPanicOption(title, subtitle) {
    return `
    <button class="card" style="text-align: center; border: 1px solid #eee; cursor: pointer; transition: 0.2s;" 
      onclick="triggerPanicAction(this)">
      <strong style="color: var(--color-text-primary); display: block; font-size: 1rem; margin-bottom: 4px;">${title}</strong>
      <small style="color: var(--color-text-secondary); font-size: 0.75rem;">${subtitle}</small>
    </button>
  `;
}

window.triggerPanicAction = function (btn) {
    // Visual feedback
    const allBtns = btn.parentNode.children;
    Array.from(allBtns).forEach(b => b.style.opacity = '0.5');
    btn.style.opacity = '1';
    btn.style.borderColor = 'var(--color-error)';
    btn.style.background = '#fff5f5';

    // Show status after brief delay simulation
    setTimeout(() => {
        document.getElementById('panic-status').style.display = 'block';
    }, 500);
}
