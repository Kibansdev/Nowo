// ============================================
// Inicio - Agenda del Dia + Talleres Activos
// Espacio Alvarado - 4 consultorios + Hall - Vista diaria
// ============================================

window.renderMarket = function (container) {
  console.log('[INICIO] renderMarket called', container);

  // -- Color palette --
  const sage        = '#7A8B6F';
  const terracotta  = '#C4956A';
  const lightSage   = '#E8EDE5';
  const lightTerracotta = '#F5EDE5';

  function getProfColor(name) {
    if (!name || name === '\u2014' || name === 'Cerrado' || name === 'Espacio cerrado' || name === 'Sin turnos') {
      return null;
    }
    
    var cleanLower = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    function getWords(str) {
      var titlesAndCommon = ['lic', 'dr', 'dra', 'prof', 'taller', 'yoga', 'terapeutico', 'meditacion', 'cuencos', 'de', 'y', 'con', 'para'];
      return str.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(function(w) { return w.length > 2 && !titlesAndCommon.includes(w); });
    }

    var nameWords = getWords(name);
    var profs = window._profData || [];
    if (nameWords.length > 0) {
      for (var i = 0; i < profs.length; i++) {
        var pWords = getWords(profs[i].name);
        var hasOverlap = nameWords.some(function(w) { return pWords.includes(w); });
        if (hasOverlap) {
          return profs[i].color || null;
        }
      }
    }

    for (var i = 0; i < profs.length; i++) {
      var pNameLower = profs[i].name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      var pNameNoTitle = pNameLower.replace(/^(lic\.|dr\.|dra\.|prof\.)\s*/, '');
      var nameNoTitle = cleanLower.replace(/^(lic\.|dr\.|dra\.|prof\.)\s*/, '');
      if (pNameNoTitle.includes(nameNoTitle) || nameNoTitle.includes(pNameNoTitle)) {
        return profs[i].color || null;
      }
    }

    var workshops = window._workshopsData || [];
    for (var i = 0; i < workshops.length; i++) {
      var wNameLower = workshops[i].name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (cleanLower.includes(wNameLower) || wNameLower.includes(cleanLower)) {
        return workshops[i].color || null;
      }
    }

    if (nameWords.length > 0) {
      for (var i = 0; i < workshops.length; i++) {
        var wWords = getWords(workshops[i].name);
        var hasOverlap = nameWords.some(function(w) { return wWords.includes(w); });
        if (hasOverlap) {
          return workshops[i].color || null;
        }
      }
    }

    return null;
  }

  // -- Workshops data (Stateful) --
  const defaultWorkshops = [
    {
      name: 'Yoga Terap\u00e9utico',
      instructor: 'Prof. Lucas M\u00e9ndez',
      schedule: 'Martes y Jueves 18:00',
      occupied: 12, total: 15, color: sage, active: true,
      descripcion: 'Clase de yoga suave adaptada a todos los niveles, ideal para liberar tensiones corporales, mejorar la postura y calmar la mente a trav\u00e9s de la respiraci\u00f3n consciente y la meditaci\u00f3n.'
    },
    {
      name: 'Taller de Cuencos Tibetanos',
      instructor: 'Lic. Daniel Rodr\u00edguez',
      schedule: 'S\u00e1bados 16:00',
      occupied: 14, total: 15, color: terracotta, active: true,
      descripcion: 'Viaje sonoro vibracional con cuencos de cuarzo y tibetanos. Una experiencia profunda de relajaci\u00f3n dise\u00f1ada para equilibrar el sistema nervioso, aliviar el insomnio y reducir el estr\u00e9s.'
    },
    {
      name: 'Meditaci\u00f3n & Mindfulness',
      instructor: 'Prof. Juli\u00e1n Ramos',
      schedule: 'Mi\u00e9rcoles 19:00',
      occupied: 8, total: 12, color: sage, active: true,
      descripcion: 'Clase pr\u00e1ctica semanal para incorporar la atenci\u00f3n plena en tu vida diaria. Incluye ejercicios de respiraci\u00f3n, escaneo corporal y t\u00e9cnicas para calmar la rumiaci\u00f3n mental.'
    }
  ];

  if (!window._workshopsData) window._workshopsData = defaultWorkshops;
  const workshops       = window._workshopsData;
  const activeWorkshops = workshops.filter(w => w.active !== false);

  // -- Agenda: navigable date state --
  if (!window._agendaDate) {
    window._agendaDate = new Date();
    window._agendaDate.setHours(0, 0, 0, 0);
  }

  const DAY_NAMES   = ['Domingo','Lunes','Martes','Mi\u00e9rcoles','Jueves','Viernes','S\u00e1bado'];
  const MONTH_NAMES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

  function formatAgendaDate(d) {
    const today     = new Date(); today.setHours(0,0,0,0);
    const tomorrow  = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const dd = new Date(d); dd.setHours(0,0,0,0);
    let prefix = DAY_NAMES[dd.getDay()];
    if      (dd.getTime() === today.getTime())     prefix = 'Hoy \u2014 '     + DAY_NAMES[dd.getDay()];
    else if (dd.getTime() === tomorrow.getTime())  prefix = 'Ma\u00f1ana \u2014 '  + DAY_NAMES[dd.getDay()];
    else if (dd.getTime() === yesterday.getTime()) prefix = 'Ayer \u2014 '    + DAY_NAMES[dd.getDay()];
    return `${prefix} ${dd.getDate()} ${MONTH_NAMES[dd.getMonth()]} ${dd.getFullYear()}`;
  }

  // -- Patient appointments (mock, keyed 'DOW-HOUR-ROOM') --
  const APPOINTMENTS = {
    '1-09:00-0':'Laura M.', '1-10:00-0':'Diego R.', '1-15:00-0':'Ana G.', '1-15:00-1':'Carla F.',
    '2-09:00-1':'Marcos P.','2-10:00-2':'Sof\u00eda L.', '2-11:00-2':'Tom\u00e1s V.','2-14:00-2':'Renata B.',
    '2-15:00-2':'Ignacio H.','2-17:00-0':'Valentina C.','2-18:00-0':'Emilio S.',
    '3-09:00-0':'B\u00e1rbara T.','3-10:00-0':'Nicol\u00e1s M.','3-16:00-2':'Paula R.',
    '4-09:00-1':'Florencia D.','4-10:00-2':'Sebasti\u00e1n K.','4-14:00-2':'Miranda A.','4-17:00-0':'Luc\u00eda B.',
    '5-09:00-0':'Mat\u00edas P.','5-14:00-0':'Camila W.','5-15:00-1':'Roberto N.','5-16:00-2':'Ver\u00f3nica I.'
  };

  // -- Time helper functions --
  window._timeToMinutes = function(timeStr) {
    if (!timeStr) return 0;
    var parts = timeStr.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  };

  function padZero(num) {
    return num < 10 ? '0' + num : String(num);
  }

  window._minutesToTime = function(minutes) {
    var h = Math.floor(minutes / 60);
    var m = minutes % 60;
    return padZero(h) + ':' + padZero(m);
  };

  window._getAgendaEventsForDate = function(d) {
    var dow = d.getDay();
    var isSat = dow === 6;
    var isSun = dow === 0;
    var dateKey = d.getFullYear() + '-' + padZero(d.getMonth() + 1) + '-' + padZero(d.getDate());

    var defaults = [];

    function timeToMinutes(t) { return window._timeToMinutes(t); }
    function minutesToTime(m) { return window._minutesToTime(m); }

    // Saturday defaults
    if (isSat) {
      defaults.push({ start: '10:00', end: '11:00', prof: 'Taller de Cuencos Tibetanos', roomIdx: 4, type: 'taller' });
      defaults.push({ start: '16:00', end: '17:00', prof: 'Taller de Cuencos Tibetanos', roomIdx: 4, type: 'taller' });
    } else if (!isSun) {
      // Mon-Fri defaults
      var isMWF = [1,3,5].includes(dow);
      var isTT  = [2,4].includes(dow);
      var isWed = dow === 3;
      var hasGarcia    = isMWF;
      var hasTorres    = [1,5].includes(dow);
      var hasMendez    = isTT;
      var hasRodriguez = isTT;

      function addDef(hour, roomIdx, prof, type) {
        if (!prof) return;
        var startMin = timeToMinutes(hour);
        var endMin = startMin + 60;
        var endHour = minutesToTime(endMin);
        var key = dow + '-' + hour + '-' + roomIdx;
        var patient = APPOINTMENTS[key] || null;
        defaults.push({
          start: hour,
          end: endHour,
          prof: prof,
          roomIdx: roomIdx,
          type: type || 'profesional',
          patient: patient
        });
      }

      // 09:00
      addDef('09:00', 0, hasGarcia ? 'Lic. Mar\u00eda Garc\u00eda' : null);
      addDef('09:00', 1, isTT ? 'Dra. Marina Fossati' : null);
      addDef('09:00', 2, isTT ? 'Lic. Daniel Rodr\u00edguez' : null);

      // 10:00
      addDef('10:00', 0, hasGarcia ? 'Lic. Mar\u00eda Garc\u00eda' : null);
      addDef('10:00', 1, isTT ? 'Dra. Marina Fossati' : null);
      addDef('10:00', 2, isTT ? 'Lic. Daniel Rodr\u00edguez' : null);
      addDef('10:00', 3, hasMendez ? 'Prof. Lucas M\u00e9ndez' : null, 'taller');

      // 11:00
      addDef('11:00', 1, isTT ? 'Dra. Marina Fossati' : null);
      addDef('11:00', 2, isTT ? 'Dra. Valentina Ruiz' : null);
      addDef('11:00', 3, hasMendez ? 'Prof. Lucas M\u00e9ndez' : null, 'taller');

      // 14:00
      addDef('14:00', 0, hasTorres ? 'Lic. Camila Torres' : null);
      addDef('14:00', 2, isTT ? 'Lic. Daniel Rodr\u00edguez' : null);

      // 15:00
      addDef('15:00', 0, hasTorres ? 'Lic. Camila Torres' : null);
      addDef('15:00', 1, hasGarcia ? 'Lic. Mar\u00eda Garc\u00eda' : null);
      addDef('15:00', 2, isTT ? 'Lic. Daniel Rodr\u00edguez' : null);

      // 16:00
      addDef('16:00', 2, [3,5].includes(dow) ? 'Dra. Valentina Ruiz' : null);
      addDef('16:00', 3, isTT ? 'Taller grupal' : null, 'taller');
      addDef('16:00', 4, isWed ? 'Meditaci\u00f3n & Mindfulness' : null, 'taller');

      // 17:00
      addDef('17:00', 0, hasRodriguez ? 'Lic. Daniel Rodr\u00edguez' : null);
      addDef('17:00', 3, isTT ? 'Taller grupal' : null, 'taller');
      addDef('17:00', 4, isTT ? 'Taller de Cuencos Tibetanos' : null, 'taller');

      // 18:00
      addDef('18:00', 0, hasRodriguez ? 'Lic. Daniel Rodr\u00edguez' : null);
      addDef('18:00', 4, isTT ? 'Yoga Terap\u00e9utico' : null, 'taller');
    }

    // Load customs
    var customs = [];
    var customSlots = (window._agendaCustomSlots || {})[dateKey] || {};
    Object.keys(customSlots).forEach(function(key) {
      var parts = key.split('-');
      if (parts.length < 2) return;
      var startStr = parts[0];
      var roomIdx = parseInt(parts[1], 10);
      var val = customSlots[key];
      if (!val) return;

      var start = val.start || startStr;
      var duration = val.service && val.service.duration ? val.service.duration : 60;
      var end = val.end || minutesToTime(timeToMinutes(start) + duration);

      customs.push({
        key: key,
        start: start,
        end: end,
        prof: val.name || '',
        patient: val.patient || null,
        roomIdx: roomIdx,
        type: val.type || 'profesional',
        service: val.service || null,
        price: val.price !== undefined ? val.price : null,
        custom: true,
        deleted: val.name === '' || val.type === 'empty'
      });
    });

    var activeEvents = [];

    // Filter defaults
    defaults.forEach(function(def) {
      var defStart = timeToMinutes(def.start);
      var defEnd = timeToMinutes(def.end);

      var hasOverlap = customs.some(function(cust) {
        if (cust.roomIdx !== def.roomIdx) return false;
        var custStart = timeToMinutes(cust.start);
        var custEnd = timeToMinutes(cust.end);
        return (defStart < custEnd) && (custStart < defEnd);
      });

      if (!hasOverlap) {
        activeEvents.push(def);
      }
    });

    // Add active customs
    customs.forEach(function(cust) {
      if (!cust.deleted) {
        activeEvents.push(cust);
      }
    });

    return activeEvents;
  };

  function getDefaultServicesForProf(prof) {
    if (prof.services && prof.services.length > 0) {
      return prof.services;
    }
    var price = 3000;
    if (prof.room === 'Consultorio A') price = 3000;
    else if (prof.room === 'Consultorio B') price = 2500;
    else if (prof.room === 'Consultorio C') price = 3500;
    else if (prof.room === 'Consultorio D') price = 2000;
    return [
      { name: prof.specialty || 'Consulta General', price: price, duration: 60 }
    ];
  }

  const ROOM_LABELS = ['Consultorio A','Consultorio B','Consultorio C','Consultorio D','Hall','Espacio Coworking'];

  function buildAgendaHtml() {
    try {
      var d = window._agendaDate;
      var dateLabel = formatAgendaDate(d);
      var today = new Date(); today.setHours(0,0,0,0);
      var isToday = d.getTime() === today.getTime();
      var isSun = d.getDay() === 0;

      var events = window._getAgendaEventsForDate(d);

      var roomDefs = [
        { label: 'Consultorio A', color: sage, idx: 0 },
        { label: 'Consultorio B', color: sage, idx: 1 },
        { label: 'Consultorio C', color: terracotta, idx: 2 },
        { label: 'Consultorio D', color: sage, idx: 3 },
        { label: 'Hall (Talleres)', color: terracotta, idx: 4 },
        { label: 'Coworking', color: sage, idx: 5 }
      ];

      var hoursList = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

      // Render cards helper
      function renderCardsForRoom(roomIdx) {
        var roomEvents = events.filter(function(ev) { return ev.roomIdx === roomIdx; });
        return roomEvents.map(function(ev) {
          var colors = (function() {
            var hex = getProfColor(ev.prof);
            if (!hex) {
              hex = ev.type === 'taller' ? terracotta : sage;
            }
            return {
              bg: hex + '1A',
              border: hex,
              text: hex
            };
          })();

          var baseMin = window._timeToMinutes("08:00");
          var startMin = window._timeToMinutes(ev.start);
          var endMin = window._timeToMinutes(ev.end);
          var top = startMin - baseMin;
          var height = endMin - startMin;

          var clampedTop = Math.max(0, Math.min(720, top));
          var clampedHeight = Math.max(15, Math.min(720 - clampedTop, height));

          var cardStyle = 'position: absolute; top: ' + clampedTop + 'px; left: 4px; right: 4px; height: ' + clampedHeight + 'px; background: ' + colors.bg + '; border-left: 3.5px solid ' + colors.border + '; border-top: 1px solid ' + colors.border + '40; border-right: 1px solid ' + colors.border + '40; border-bottom: 1px solid ' + colors.border + '40; border-radius: 6px; padding: 6px 8px; overflow: hidden; cursor: grab; display: flex; flex-direction: column; justify-content: flex-start; z-index: 10; box-shadow: 0 2px 4px rgba(0,0,0,0.04); transition: box-shadow 0.15s, border-color 0.15s;';

          var patientLine = ev.patient
            ? '<div style="font-size: 0.72rem; font-weight: 700; color: ' + colors.text + '; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;">\uD83D\uDC64 ' + ev.patient + '</div>'
            : '';

          var serviceName = ev.service ? ev.service.name : (ev.type === 'taller' ? 'Taller' : '');
          var serviceLine = serviceName
            ? '<div style="font-size: 0.65rem; color: var(--color-text-muted); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + serviceName + '</div>'
            : '';

          var timeText = '<span style="font-size: 0.65rem; font-weight: 600; color: ' + colors.text + '; opacity: 0.85;">' + ev.start + ' - ' + ev.end + '</span>';
          var resizeHandle = '<div class="resize-handle" style="position: absolute; bottom: 0; left: 0; right: 0; height: 6px; cursor: s-resize; background: transparent; z-index: 20;" onmouseover="this.style.background=\'' + colors.border + '30\'" onmouseout="this.style.background=\'transparent\'"></div>';
          var customIndicator = ev.custom
            ? '<div style="position: absolute; top: 4px; right: 6px; width: 4px; height: 4px; border-radius: 50%; background: ' + colors.border + ';" title="Modificado"></div>'
            : '';

          var cleanProf = (ev.prof || '').replace(/"/g, '&quot;');
          var cleanPatient = (ev.patient || '').replace(/"/g, '&quot;');

          return '<div class="calendar-event-card" data-key="' + (ev.key || (ev.start + '-' + ev.roomIdx)) + '" data-start="' + ev.start + '" data-end="' + ev.end + '" data-room="' + ev.roomIdx + '" data-prof="' + cleanProf + '" data-patient="' + cleanPatient + '" data-type="' + ev.type + '" style="' + cardStyle + '" onmousedown="window._onCardMouseDown(event, this)">' +
            customIndicator +
            '<div style="font-size: 0.76rem; font-weight: 700; color: var(--color-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2;">' + (ev.prof || '\u2014') + '</div>' +
            serviceLine +
            patientLine +
            '<div style="margin-top: auto; display: flex; align-items: center; justify-content: space-between; padding-top: 2px;">' +
              timeText +
            '</div>' +
            resizeHandle +
          '</div>';
        }).join('');
      }

      // Calculate room occupied hours vs scheduled
      var headersHtml = roomDefs.map(function(rc) {
        var roomEvents = events.filter(function(ev) { return ev.roomIdx === rc.idx; });
        var totalHrs = 0;
        var reservedHrs = 0;
        roomEvents.forEach(function(ev) {
          var dur = (window._timeToMinutes(ev.end) - window._timeToMinutes(ev.start)) / 60;
          totalHrs += dur;
          if (ev.patient) {
            reservedHrs += dur;
          }
        });
        
        var pct = totalHrs > 0 ? Math.round((reservedHrs / totalHrs) * 100) : 0;
        var progressHtml = totalHrs > 0
          ? '<div style="display:flex;align-items:center;gap:6px;margin-top:2px;">' +
               '<div style="flex:1;height:4px;background:rgba(0,0,0,0.07);border-radius:2px;overflow:hidden;">' +
                 '<div style="width:' + pct + '%;height:100%;background:' + rc.color + ';border-radius:2px;"></div>' +
               '</div>' +
               '<span style="font-size:0.68rem;color:var(--color-text-muted);white-space:nowrap;">' + reservedHrs + '/' + totalHrs + 'h</span>' +
             '</div>'
          : '<div style="font-size:0.68rem;color:var(--color-text-muted);margin-top:2px;">Sin agenda</div>';

        if (rc.idx === 4) {
          progressHtml = '<div style="font-size:0.68rem;color:var(--color-text-muted);margin-top:2px;">' + roomEvents.length + ' taller' + (roomEvents.length !== 1 ? 'es' : '') + '</div>';
        }

        return '<div style="flex:1; padding:12px; border-right:1px solid rgba(0,0,0,0.05); min-width:120px; box-sizing:border-box;">' +
          '<div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:' + rc.color + ';">' + rc.label + '</div>' +
          progressHtml +
        '</div>';
      }).join('');

      var sunPlaceholder = isSun
        ? '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.02);display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:600;color:var(--color-text-muted);font-style:italic;z-index:30;">Domingo \u2014 Espacio Cerrado</div>'
        : '';

      return `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap;">
          <div style="flex:1;">
            <h2 style="margin:0 0 2px;font-size:1.4rem;">Agenda del d\u00eda</h2>
            <p style="margin:0;font-size:0.78rem;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:0.06em;">Espacio Alvarado</p>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            ${!isToday ? `<button onclick="window._agendaGoToday()" style="padding:6px 14px;font-size:0.78rem;font-weight:700;border-radius:var(--radius-pill);background:${sage}18;color:${sage};border:1.5px solid ${sage}40;cursor:pointer;">Hoy</button>` : ''}
            <div style="display:flex;align-items:center;background:var(--bg-card-alt);border-radius:var(--radius-pill);border:1px solid rgba(0,0,0,0.08);overflow:hidden;">
              <button style="padding:8px 16px;background:none;border:none;cursor:pointer;font-size:1.2rem;color:var(--color-text-muted);line-height:1;transition:background 0.15s;"
                onmouseover="this.style.background='rgba(0,0,0,0.06)'" onmouseout="this.style.background='none'"
                onclick="window._agendaNav(-1)">\u2039</button>
              <div style="padding:0 16px;font-size:0.9rem;font-weight:700;color:${isToday?sage:'var(--color-text-primary)'};min-width:230px;text-align:center;white-space:nowrap;">
                ${dateLabel}
              </div>
              <button style="padding:8px 16px;background:none;border:none;cursor:pointer;font-size:1.2rem;color:var(--color-text-muted);line-height:1;transition:background 0.15s;"
                onmouseover="this.style.background='rgba(0,0,0,0.06)'" onmouseout="this.style.background='none'"
                onclick="window._agendaNav(1)">\u203A</button>
            </div>
          </div>
        </div>

        <div class="calendar-grid-container" style="display:flex; flex-direction:column; background:var(--bg-card); border-radius:var(--radius-lg); box-shadow:var(--shadow-sm); overflow:hidden; border:1px solid rgba(0,0,0,0.06); position:relative;">
          <!-- Headers -->
          <div class="calendar-headers" style="display:flex; background:var(--bg-card-alt); border-bottom:1.5px solid rgba(0,0,0,0.08); padding-left:60px;">
            ${headersHtml}
          </div>

          <!-- Grid Body -->
          <div class="calendar-body" style="display:flex; position:relative; height:720px; user-select:none;">
            ${sunPlaceholder}
            <!-- Left Time Axis -->
            <div class="time-axis" style="width:60px; height:720px; position:relative; background:var(--bg-card-alt); border-right:1.5px solid rgba(0,0,0,0.08); flex-shrink:0;">
              ${hoursList.map((h, i) => {
                return `<div style="position:absolute; top:${i * 60 - 7}px; right:8px; font-size:0.72rem; font-weight:700; color:var(--color-text-secondary);">${h}</div>`;
              }).join('')}
            </div>

            <!-- Grid Columns Area -->
            <div class="columns-area" id="calendar-columns-area" style="display:flex; flex:1; position:relative; height:720px; overflow:hidden;">
              <!-- Background Horizontal Hour Lines -->
              ${hoursList.map((h, i) => {
                return `<div style="position:absolute; top:${i * 60}px; left:0; right:0; height:1px; background:rgba(0,0,0,0.06); pointer-events:none;"></div>`;
              }).join('')}

              <!-- Columns -->
              ${roomDefs.map(rc => {
                return `
                  <div class="room-column" data-room="${rc.idx}" style="flex:1; height:720px; position:relative; border-right:1px solid rgba(0,0,0,0.04); min-width:120px; box-sizing:border-box;" onclick="window._onColumnClick(event, ${rc.idx})">
                    ${renderCardsForRoom(rc.idx)}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      console.error('buildAgendaHtml error:', err);
      return '<div class="card" style="padding:24px;color:#d9534f;"><strong>Error al cargar agenda:</strong> ' + err.message + '</div>';
    }
  }

  window._onColumnClick = function(e, roomIdx) {
    if (e.target.classList.contains('room-column')) {
      var rect = e.currentTarget.getBoundingClientRect();
      var clickY = e.clientY - rect.top;
      var clickedMin = Math.round(clickY / 15) * 15; // snap to 15 min
      var startMin = 8 * 60 + clickedMin;
      var startStr = window._minutesToTime(startMin);
      window._openAgendaSlotModal(startStr, roomIdx);
    }
  };

  window._onCardMouseDown = function(e, cardEl) {
    var isResize = e.target.classList.contains('resize-handle');
    e.stopPropagation();

    if (e.button !== 0) return;

    var key = cardEl.getAttribute('data-key');
    var startStr = cardEl.getAttribute('data-start');
    var endStr = cardEl.getAttribute('data-end');
    var roomIdx = parseInt(cardEl.getAttribute('data-room'), 10);
    var prof = cardEl.getAttribute('data-prof');
    var patient = cardEl.getAttribute('data-patient');
    var type = cardEl.getAttribute('data-type');

    var startY = e.pageY;
    var startX = e.pageX;
    var cardTop = cardEl.offsetTop;
    var cardHeight = cardEl.offsetHeight;

    var hasMoved = false;

    var columnsArea = document.getElementById('calendar-columns-area');
    if (!columnsArea) return;
    var columnsRect = columnsArea.getBoundingClientRect();
    var colWidth = columnsRect.width / 6;

    function onMouseMove(moveEv) {
      var dy = moveEv.pageY - startY;
      var dx = moveEv.pageX - startX;

      if (Math.abs(dy) > 4 || Math.abs(dx) > 4) {
        hasMoved = true;
      }

      if (!hasMoved) return;

      if (isResize) {
        var newHeight = cardHeight + dy;
        var snappedHeight = Math.max(15, Math.round(newHeight / 15) * 15);
        cardEl.style.height = snappedHeight + 'px';

        var startMin = window._timeToMinutes(startStr);
        var newEndMin = startMin + snappedHeight;
        var newEndStr = window._minutesToTime(newEndMin);

        var timeSpan = cardEl.querySelector('span');
        if (timeSpan) {
          timeSpan.textContent = startStr + ' - ' + newEndStr;
        }
        cardEl.setAttribute('data-new-end', newEndStr);
      } else {
        cardEl.style.zIndex = '1000';
        cardEl.style.opacity = '0.85';

        var newTop = cardTop + dy;
        var snappedTop = Math.max(0, Math.min(720 - cardEl.offsetHeight, Math.round(newTop / 15) * 15));
        cardEl.style.top = snappedTop + 'px';

        var clientX = moveEv.clientX;
        var relativeX = clientX - columnsRect.left;
        var targetRoomIdx = Math.floor(relativeX / colWidth);
        targetRoomIdx = Math.max(0, Math.min(5, targetRoomIdx));

        var targetColDiv = columnsArea.querySelectorAll('.room-column')[targetRoomIdx];
        if (targetColDiv && cardEl.parentElement !== targetColDiv) {
          targetColDiv.appendChild(cardEl);
        }

        var newStartMin = 8 * 60 + snappedTop;
        var durationMin = window._timeToMinutes(endStr) - window._timeToMinutes(startStr);
        var newEndMin = newStartMin + durationMin;

        var newStartStr = window._minutesToTime(newStartMin);
        var newEndStr = window._minutesToTime(newEndMin);

        var timeSpan = cardEl.querySelector('span');
        if (timeSpan) {
          timeSpan.textContent = newStartStr + ' - ' + newEndStr;
        }

        cardEl.setAttribute('data-new-start', newStartStr);
        cardEl.setAttribute('data-new-end', newEndStr);
        cardEl.setAttribute('data-new-room', targetRoomIdx);
      }
    }

    function onMouseUp(upEv) {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      if (!hasMoved) {
        window._openAgendaSlotModal(startStr, roomIdx, prof, patient, type, key);
        return;
      }

      var d = window._agendaDate;
      var dateKey = d.getFullYear() + '-' + padZero(d.getMonth() + 1) + '-' + padZero(d.getDate());

      if (isResize) {
        var finalEnd = cardEl.getAttribute('data-new-end') || endStr;
        if (!window._agendaCustomSlots) window._agendaCustomSlots = {};
        if (!window._agendaCustomSlots[dateKey]) window._agendaCustomSlots[dateKey] = {};

        var slot = window._agendaCustomSlots[dateKey][key] || { name: prof, type: type, patient: patient || null };
        slot.start = startStr;
        slot.end = finalEnd;

        window._agendaCustomSlots[dateKey][key] = slot;
      } else {
        var finalStart = cardEl.getAttribute('data-new-start') || startStr;
        var finalEnd = cardEl.getAttribute('data-new-end') || endStr;
        var finalRoom = parseInt(cardEl.getAttribute('data-new-room') !== null ? cardEl.getAttribute('data-new-room') : roomIdx, 10);

        if (!window._agendaCustomSlots) window._agendaCustomSlots = {};
        if (!window._agendaCustomSlots[dateKey]) window._agendaCustomSlots[dateKey] = {};

        if (window._agendaCustomSlots[dateKey][key]) {
          delete window._agendaCustomSlots[dateKey][key];
        } else {
          var defaults = window._getAgendaEventsForDate(d);
          var isDefault = defaults.some(function(def) {
            return !def.custom && def.start === startStr && def.roomIdx === roomIdx;
          });
          if (isDefault) {
            window._agendaCustomSlots[dateKey][key] = { name: '', type: 'empty', patient: null };
          }
        }

        var newKey = finalStart + '-' + finalRoom;
        window._agendaCustomSlots[dateKey][newKey] = {
          name: prof,
          type: type,
          patient: patient || null,
          start: finalStart,
          end: finalEnd,
          roomIdx: finalRoom
        };
      }

      paintAgenda();
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  window._openAgendaSlotModal = function(hour, roomIdx, currentProf, currentPatient, currentType, currentKey) {
    var existing = document.querySelector('.agenda-slot-overlay');
    if (existing) existing.remove();

    currentProf = currentProf || '';
    currentPatient = currentPatient || '';
    currentType = currentType || 'profesional';
    currentKey = currentKey || (hour + '-' + roomIdx);
    var isEdit = currentProf && currentProf !== '\u2014';

    var profData = window._profData || [];
    var wsData = window._workshopsData || [];
    var activeProfessionals = profData.filter(function(p) { return p.activo !== false; });
    var activeWS = wsData.filter(function(w) { return w.active !== false; });

    var d = window._agendaDate;
    var dateKey = d.getFullYear() + '-' + padZero(d.getMonth() + 1) + '-' + padZero(d.getDate());
    var dayLabel = formatAgendaDate(d);

    var isProfType = currentType !== 'taller';
    
    var slotValue = window._agendaCustomSlots && window._agendaCustomSlots[dateKey] ? window._agendaCustomSlots[dateKey][currentKey] : null;
    var activeService = slotValue ? slotValue.service : null;

    var endHour = (function() {
      var startMin = window._timeToMinutes(hour);
      var endMin = startMin + 60;
      return window._minutesToTime(endMin);
    })();

    var overlay = document.createElement('div');
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
            <button onclick="this.closest('.agenda-slot-overlay').remove()" style="width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,0.06);color:var(--color-text-muted);font-size:1.1rem;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;">\u2715</button>
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
              <label>Hora de finalizaci\u00f3n</label>
              <input type="time" id="aslot-time-end" value="${endHour}">
            </div>
          </div>

          <!-- Type selector -->
          <div>
            <label>Tipo de asignaci\u00f3n</label>
            <div style="display:flex;gap:10px;">
              <button class="aslot-type-btn ${isProfType?'active':''}" id="aslot-btn-prof" onclick="
                document.getElementById('aslot-btn-prof').classList.add('active');
                document.getElementById('aslot-btn-taller').classList.remove('active');
                document.getElementById('aslot-prof-select').style.display='block';
                document.getElementById('aslot-service-select').style.display='block';
                document.getElementById('aslot-taller-select').style.display='none';
              ">\uD83D\uDC64 Profesional</button>
              <button class="aslot-type-btn ${!isProfType?'active':''}" id="aslot-btn-taller" onclick="
                document.getElementById('aslot-btn-taller').classList.add('active');
                document.getElementById('aslot-btn-prof').classList.remove('active');
                document.getElementById('aslot-taller-select').style.display='block';
                document.getElementById('aslot-prof-select').style.display='none';
                document.getElementById('aslot-service-select').style.display='none';
              ">\uD83D\uDCCB Taller</button>
            </div>
          </div>

          <!-- Professional dropdown -->
          <div id="aslot-prof-select" style="display:${isProfType?'block':'none'};">
            <label>Profesional</label>
            <select id="aslot-prof-dropdown" onchange="window._onAgendaProfChange()">
              <option value="" disabled ${!isEdit||!isProfType?'selected':''}>Seleccionar profesional...</option>
              ${activeProfessionals.map(p => `<option value="${p.name}" ${isEdit&&isProfType&&currentProf===p.name?'selected':''}>${p.name} \u2014 ${p.specialty}</option>`).join('')}
            </select>
          </div>

          <!-- Services dropdown -->
          <div id="aslot-service-select" style="display:${isProfType?'block':'none'};">
            <label>Servicio</label>
            <select id="aslot-service-dropdown" onchange="window._onAgendaServiceChange()">
              <!-- populated dynamically -->
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
              ${currentPatient ? `<button onclick="window._clearPatientOnly('${dateKey}','${currentKey}',${roomIdx})" style="font-size:0.7rem;color:#d9534f;background:none;border:none;cursor:pointer;font-weight:600;text-decoration:underline;">Quitar paciente</button>` : ''}
            </div>
            <input type="text" id="aslot-patient" placeholder="Nombre del paciente (opcional)" value="${currentPatient}">
          </div>
        </div>

        <div style="padding:14px 28px 22px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(0,0,0,0.06);">
          <button onclick="window._removeAgendaSlot('${dateKey}','${currentKey}',${roomIdx})" style="padding:9px 16px;font-size:0.82rem;background:transparent;color:#d9534f;font-weight:600;border:1px solid rgba(217,83,79,0.2);border-radius:6px;cursor:pointer;">Liberar horario</button>
          <button style="padding:9px 24px;font-size:0.85rem;background:${sage};color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;"
            onclick="window._saveAgendaSlot('${dateKey}','${currentKey}',${roomIdx})">${isEdit ? 'Guardar' : 'Asignar'}</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    if (isProfType && currentProf) {
      var prof = activeProfessionals.find(function(p) { return p.name === currentProf; });
      if (prof) {
        var services = getDefaultServicesForProf(prof);
        var serviceSelect = document.getElementById('aslot-service-dropdown');
        if (serviceSelect) {
          serviceSelect.innerHTML = services.map(function(s, idx) {
            var selected = activeService && activeService.name === s.name ? 'selected' : '';
            return '<option value="' + idx + '" ' + selected + '>' + s.name + ' ($' + s.price + ' \u00b7 ' + s.duration + ' min)</option>';
          }).join('');
        }
      }
    }

    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  };

  window._onAgendaProfChange = function() {
    var profSelect = document.getElementById('aslot-prof-dropdown');
    if (!profSelect) return;
    var profName = profSelect.value;
    var prof = (window._profData || []).find(function(p) { return p.name === profName; });
    if (!prof) return;

    var services = getDefaultServicesForProf(prof);
    var serviceSelect = document.getElementById('aslot-service-dropdown');
    if (!serviceSelect) return;

    serviceSelect.innerHTML = services.map(function(s, idx) {
      return '<option value="' + idx + '">' + s.name + ' ($' + s.price + ' \u00b7 ' + s.duration + ' min)</option>';
    }).join('');

    window._onAgendaServiceChange();
  };

  window._onAgendaServiceChange = function() {
    var profSelect = document.getElementById('aslot-prof-dropdown');
    var serviceSelect = document.getElementById('aslot-service-dropdown');
    if (!profSelect || !serviceSelect) return;

    var profName = profSelect.value;
    var prof = (window._profData || []).find(function(p) { return p.name === profName; });
    if (!prof) return;

    var services = getDefaultServicesForProf(prof);
    var serviceIdx = parseInt(serviceSelect.value, 10);
    var service = services[serviceIdx];
    if (!service) return;

    var startTimeInput = document.getElementById('aslot-time-start');
    var endTimeInput = document.getElementById('aslot-time-end');
    if (startTimeInput && endTimeInput) {
      var startMin = window._timeToMinutes(startTimeInput.value);
      var endMin = startMin + service.duration;
      endTimeInput.value = window._minutesToTime(endMin);
    }
  };

  window._saveAgendaSlot = function(dateKey, originalKey, roomIdx) {
    var isProfActive = document.getElementById('aslot-btn-prof').classList.contains('active');
    var name = '';
    var type = 'profesional';
    var service = null;
    var price = null;

    if (isProfActive) {
      var sel = document.getElementById('aslot-prof-dropdown');
      if (!sel || !sel.value) { alert('Seleccion\u00e1 un profesional'); return; }
      name = sel.value;
      type = 'profesional';

      var serviceSel = document.getElementById('aslot-service-dropdown');
      if (serviceSel) {
        var prof = (window._profData || []).find(function(p) { return p.name === name; });
        if (prof) {
          var services = getDefaultServicesForProf(prof);
          var idx = parseInt(serviceSel.value, 10);
          if (services[idx]) {
            service = services[idx];
            price = service.price;
          }
        }
      }
    } else {
      var sel = document.getElementById('aslot-taller-dropdown');
      if (!sel || !sel.value) { alert('Seleccion\u00e1 un taller'); return; }
      name = sel.value;
      type = 'taller';
    }

    var startVal = document.getElementById('aslot-time-start').value;
    var endVal = document.getElementById('aslot-time-end').value;
    var patientInput = document.getElementById('aslot-patient');
    var patient = patientInput ? patientInput.value.trim() : '';

    if (!window._agendaCustomSlots) window._agendaCustomSlots = {};
    if (!window._agendaCustomSlots[dateKey]) window._agendaCustomSlots[dateKey] = {};

    var newKey = startVal + '-' + roomIdx;

    if (originalKey && originalKey !== newKey) {
      delete window._agendaCustomSlots[dateKey][originalKey];
    }

    window._agendaCustomSlots[dateKey][newKey] = {
      name: name,
      type: type,
      patient: patient || null,
      start: startVal,
      end: endVal,
      service: service,
      price: price
    };

    document.querySelector('.agenda-slot-overlay')?.remove();
    paintAgenda();
  };

  window._clearPatientOnly = function(dateKey, originalKey, roomIdx) {
    if (window._agendaCustomSlots && window._agendaCustomSlots[dateKey]) {
      var slot = window._agendaCustomSlots[dateKey][originalKey];
      if (slot) {
        slot.patient = null;
      } else {
        var parts = originalKey.split('-');
        var startHour = parts[0];
        var rIdx = parseInt(parts[1], 10);
        var defaults = window._getAgendaEventsForDate(window._agendaDate);
        var def = defaults.find(function(d) { return !d.custom && d.start === startHour && d.roomIdx === rIdx; });
        var name = def ? def.prof : '';
        var type = def ? def.type : 'profesional';
        window._agendaCustomSlots[dateKey][originalKey] = { name: name, type: type, patient: null };
      }
    }
    document.querySelector('.agenda-slot-overlay')?.remove();
    paintAgenda();
  };

  window._removeAgendaSlot = function(dateKey, originalKey, roomIdx) {
    if (window._agendaCustomSlots && window._agendaCustomSlots[dateKey]) {
      delete window._agendaCustomSlots[dateKey][originalKey];

      var parts = originalKey.split('-');
      var startHour = parts[0];
      var rIdx = parseInt(parts[1], 10);
      
      var dow = window._agendaDate.getDay();
      var isSat = dow === 6;
      var isSun = dow === 0;
      var hasDefault = false;
      if (isSat && rIdx === 4 && (startHour === '10:00' || startHour === '16:00')) {
        hasDefault = true;
      } else if (!isSat && !isSun) {
        var isMWF = [1,3,5].includes(dow);
        var isTT  = [2,4].includes(dow);
        var isWed = dow === 3;
        var hasGarcia    = isMWF;
        var hasTorres    = [1,5].includes(dow);
        var hasMendez    = isTT;
        var hasRodriguez = isTT;

        if (startHour === '09:00' && ((rIdx === 0 && hasGarcia) || (rIdx === 1 && isTT) || (rIdx === 2 && isTT))) hasDefault = true;
        else if (startHour === '10:00' && ((rIdx === 0 && hasGarcia) || (rIdx === 1 && isTT) || (rIdx === 2 && isTT) || (rIdx === 3 && hasMendez))) hasDefault = true;
        else if (startHour === '11:00' && ((rIdx === 1 && isTT) || (rIdx === 2 && isTT) || (rIdx === 3 && hasMendez))) hasDefault = true;
        else if (startHour === '14:00' && ((rIdx === 0 && hasTorres) || (rIdx === 2 && isTT))) hasDefault = true;
        else if (startHour === '15:00' && ((rIdx === 0 && hasTorres) || (rIdx === 1 && hasGarcia) || (rIdx === 2 && isTT))) hasDefault = true;
        else if (startHour === '16:00' && ((rIdx === 2 && [3,5].includes(dow)) || (rIdx === 3 && isTT) || (rIdx === 4 && isWed))) hasDefault = true;
        else if (startHour === '17:00' && ((rIdx === 0 && hasRodriguez) || (rIdx === 3 && isTT) || (rIdx === 4 && isTT))) hasDefault = true;
        else if (startHour === '18:00' && ((rIdx === 0 && hasRodriguez) || (rIdx === 4 && isTT))) hasDefault = true;
      }

      if (hasDefault) {
        window._agendaCustomSlots[dateKey][originalKey] = { name: '', type: 'empty', patient: null };
      }
    }
    document.querySelector('.agenda-slot-overlay')?.remove();
    paintAgenda();
  };

  function paintAgenda() {
    var root = document.getElementById('agenda-section-root');
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

  function renderWorkshopCard(w, idx) {
    var progress = Math.round(((w.occupied || 0) / (w.total || 15)) * 100);
    return `
      <div class="card" style="padding:16px 20px;display:flex;align-items:center;gap:14px;border-top:3px solid ${w.color};">
        <div style="width:40px;height:40px;border-radius:50%;background:${w.color}20;color:${w.color};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.15rem;flex-shrink:0;">
          ${w.name.charAt(0).toUpperCase()}
        </div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;">
            <h4 style="margin:0;font-size:0.88rem;font-weight:700;color:var(--color-text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${w.name}</h4>
            <span style="color:var(--color-text-primary);font-weight:600;">${w.occupied}/${w.total}</span>
          </div>
          <div style="width:100%;height:6px;background:#eee;border-radius:3px;overflow:hidden;margin-bottom:14px;">
            <div style="width:${progress}%;height:100%;background:${w.color};border-radius:3px;transition:width 0.4s ease;"></div>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="button-secondary" style="flex:1;padding:7px 10px;font-size:0.8rem;"
              onclick="window._openManagerWorkshopModal(window._workshopsData[${idx}], ${idx})">Editar Ficha</button>
          </div>
        </div>
      </div>`;
  }

  // Render full Inicio view
  container.innerHTML = `
    <div class="dashboard-header">
      <h1>Inicio</h1>
      <p class="dashboard-subtitle">ESPACIO ALVARADO \u00b7 GESTI\u00d3N DIARIA</p>
    </div>

    <!-- Agenda del d\u00eda \u2014 PRIMERO -->
    <div id="agenda-section-root" style="margin-bottom:36px;">
      ${buildAgendaHtml()}
    </div>

    <!-- Talleres activos \u2014 ABAJO -->
    <div>
      <h3 style="margin-bottom:16px;">Talleres activos</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;">
        ${activeWorkshops.map(w => {
          var realIdx = workshops.indexOf(w);
          return renderWorkshopCard(w, realIdx);
        }).join('')}
      </div>
    </div>
  `;
};
