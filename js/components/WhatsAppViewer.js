// ══════════════════════════════════════════
// WhatsAppViewer — Espacio Alvarado
// Modal de chat · Conversaciones de Mía (bot)
// ══════════════════════════════════════════

window.openChat = function (patientName) {
  // Remove existing modal if any
  const existingModal = document.getElementById('chat-modal');
  if (existingModal) existingModal.remove();

  // Clean patient name parameter to select conversation
  const name = patientName ? patientName.trim() : 'María Gomez';

  // ── Conversaciones dinámicas según paciente ────────
  let messages = [];

  if (name.includes('Tomás') || name.includes('Tomas')) {
    messages = [
      {
        sender: 'bot',
        text: '¡Hola! Bienvenido/a a Espacio Alvarado. Soy Mía, tu asistente virtual. ¿En qué puedo ayudarte?',
        time: '09:12'
      },
      {
        sender: 'patient',
        text: 'Hola, vi que tienen clases de yoga. ¿Me podrías pasar info de horarios y si hay lugar?',
        time: '09:13'
      },
      {
        sender: 'bot',
        text: '¡Hola Tomás! Qué bueno tu interés. Sí, tenemos clases grupales de Yoga Terapéutico a cargo del Prof. Lucas Méndez. Las clases se dictan en el Hall de la planta baja los martes y jueves a las 18:00 hs.\n\nLas clases están diseñadas para un máximo de 15 personas para garantizar un espacio cómodo y atención personalizada. Para la clase de hoy a las 18:00 hs quedan 3 lugares libres. ¿Te gustaría que te reserve un cupo?',
        time: '09:14'
      },
      {
        sender: 'patient',
        text: 'Sí, dale, por favor reservame para hoy a las 18 hs.',
        time: '09:15'
      },
      {
        sender: 'bot',
        text: '¡Excelente elección! Tu lugar para hoy a las 18:00 hs ya quedó reservado. Quedan 2 lugares disponibles en la clase. ¿Me confirmás tu nombre completo para la lista?',
        time: '09:15'
      },
      {
        sender: 'patient',
        text: 'Tomás Blanco',
        time: '09:16'
      },
      {
        sender: 'bot',
        text: '¡Listo, Tomás! Quedás registrado. Recordá venir con ropa cómoda. ¡Te esperamos hoy a las 18:00 hs en el Hall de Espacio Alvarado!',
        time: '09:16'
      }
    ];
  } else if (name.includes('Carolina')) {
    messages = [
      {
        sender: 'bot',
        text: '¡Hola! Bienvenido/a a Espacio Alvarado. Soy Mía, la asistente virtual. ¿En qué puedo ayudarte?',
        time: '11:20'
      },
      {
        sender: 'patient',
        text: 'Hola, estoy buscando iniciar terapia individual, quería saber qué psicólogos tienen disponibles y cómo es el sistema.',
        time: '11:21'
      },
      {
        sender: 'bot',
        text: '¡Hola Carolina! Te cuento que en Espacio Alvarado contamos con excelentes profesionales. Para terapia individual tenemos a la Lic. María García (enfoque sistémico, dinámica familiar) en Consultorio A, y al Lic. Daniel Rodríguez (enfoque holístico con meditación y cuencos) en Consultorio C. También contamos con la Lic. Camila Torres (Terapia Gestalt) en Consultorio A.\n\n¿Hay algún enfoque o profesional en particular que te interese o prefieras que te asesore más detalladamente?',
        time: '11:22'
      },
      {
        sender: 'patient',
        text: 'Me gustaría saber un poco más sobre la terapia Gestalt de Camila.',
        time: '11:24'
      },
      {
        sender: 'bot',
        text: '¡Claro! La Lic. Camila Torres trabaja con Terapia Gestalt orientada al aquí y ahora, enfocándose en la conciencia corporal y emocional para facilitar procesos de cambio genuino. Atiende los lunes y viernes de 10:00 a 16:00 hs en el Consultorio A.\n\n¿Te gustaría ver sus horarios disponibles para esta semana?',
        time: '11:25'
      },
      {
        sender: 'patient',
        text: 'Buenísimo, dejame pensarlo y te vuelvo a escribir. Muchas gracias.',
        time: '11:27'
      },
      {
        sender: 'bot',
        text: 'De nada, Carolina. Tómate tu tiempo. Quedo a tu disposición cuando decidas avanzar. ¡Que tengas un hermoso día!',
        time: '11:27'
      }
    ];
  } else if (name.includes('Patricia')) {
    messages = [
      {
        sender: 'bot',
        text: '¡Hola! Bienvenido/a a Espacio Alvarado. Soy Mía, la asistente virtual. ¿En qué puedo ayudarte?',
        time: '10:02'
      },
      {
        sender: 'patient',
        text: 'Hola, necesito cambiar urgente mi turno con la Dra. Marina Fossati de hoy, pero no me deja la web. Me surgió un inconveniente familiar.',
        time: '10:03'
      },
      {
        sender: 'bot',
        text: '¡Hola Patricia! Entiendo perfectamente la urgencia. Lamentablemente, como faltan menos de 2 horas para el turno, las cancelaciones automáticas están bloqueadas.\n\nVoy a derivar tu caso inmediatamente a Sofi, la administradora del espacio, para que lo resuelva de forma manual y te contacte a la brevedad. ¿Te parece bien?',
        time: '10:04'
      },
      {
        sender: 'patient',
        text: 'Sí por favor, porque no quiero perder la seña del consultorio.',
        time: '10:05'
      },
      {
        sender: 'bot',
        text: 'Comprendido, Patricia. Ya escalé tu caso con la prioridad correspondiente a Sofi. Ella se comunicará con vos al teléfono registrado a la brevedad para coordinar la reprogramación sin recargos. ¡Disculpas por las molestias!',
        time: '10:06'
      }
    ];
  } else {
    // Default: María Gomez
    messages = [
      {
        sender: 'bot',
        text: '¡Hola! Bienvenido/a a Espacio Alvarado. Soy Mía, la asistente virtual. ¿En qué puedo ayudarte?',
        time: '09:12'
      },
      {
        sender: 'patient',
        text: 'Hola, vi su publicidad. Busco un psicólogo',
        time: '09:13'
      },
      {
        sender: 'bot',
        text: '¡Qué bueno que nos escribís! Te cuento qué profesionales de psicología tenemos:\n\nLic. Daniel Rodríguez — Psicología integral con meditación y cuencos tibetanos. Ideal si buscás un abordaje holístico.\n\nLic. María García — Psicología sistémica con foco en vínculos y dinámicas familiares.\n\n¿Alguno te resuena más?',
        time: '09:13'
      },
      {
        sender: 'patient',
        text: 'Me interesa lo de Daniel, lo holístico',
        time: '09:15'
      },
      {
        sender: 'bot',
        text: '¡Genial! Daniel atiende martes y jueves. Horarios disponibles:\n\nMartes 3/06: 15:00 · 17:00\nJueves 5/06: 10:00 · 14:00\n\n¿Cuál te queda mejor?',
        time: '09:15'
      },
      {
        sender: 'patient',
        text: 'Martes 17:00',
        time: '09:16'
      },
      {
        sender: 'bot',
        text: '¡Listo! Tu turno quedó agendado.\n\nMartes 3 de junio · 17:00\nLic. Daniel Rodríguez\nEspacio Alvarado\n\n¿Me pasás tu nombre completo para la reserva?',
        time: '09:16'
      },
      {
        sender: 'patient',
        text: 'María Gomez',
        time: '09:17'
      },
      {
        sender: 'bot',
        text: 'Perfecto, María. Quedás agendada. ¡Te esperamos!',
        time: '09:17'
      }
    ];
  }

  // ── Create modal ─────────────────────────
  const modal = document.createElement('div');
  modal.id = 'chat-modal';
  modal.className = 'modal-overlay';

  modal.innerHTML = `
    <div class="chat-window" style="animation: fadeUp 0.25s ease-out;">
      <!-- Header -->
      <div class="chat-header">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="avatar" style="background: #7A8B6F;">M</div>
          <div>
            <h3 style="margin: 0; font-size: 0.95rem;">Mía · Asistente IA</h3>
            <small style="font-size: 0.72rem; opacity: 0.6;">Espacio Alvarado</small>
          </div>
        </div>
        <button class="close-btn" onclick="document.getElementById('chat-modal').remove()">✕</button>
      </div>

      <!-- Messages -->
      <div class="chat-body">
        ${messages.map(msg => {
          const isSent = msg.sender === 'bot';
          const formattedText = msg.text.replace(/\n/g, '<br>');
          return `
            <div class="message ${isSent ? 'sent' : 'received'}">
              <div class="bubble">
                ${formattedText}
                <span class="time">${msg.time}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Footer (read-only) -->
      <div class="chat-footer">
        <input type="text" placeholder="Conversación gestionada por el bot" disabled style="cursor: not-allowed; opacity: 0.6;">
        <button class="button-primary" disabled style="opacity: 0.5; cursor: not-allowed;">Enviar</button>
      </div>
    </div>
  `;

  // Close on click outside
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };

  document.body.appendChild(modal);
};
