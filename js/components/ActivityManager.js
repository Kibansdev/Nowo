// ══════════════════════════════════════════════════════════
// Consultorios — Vista semanal por espacio
// Una grilla por consultorio: filas = horas, columnas = Lun-Sáb
// Drag & drop de profesionales y talleres
// ══════════════════════════════════════════════════════════

window.renderActivity = function (container) {
  var sage       = '#7A8B6F';
  var terracotta = '#C4956A';
  var lightSage  = '#E8EDE5';
  var lightTerra = '#F5EDE5';

  var ROOMS = [
    { label: 'Consultorio A', idx: 0, color: sage },
    { label: 'Consultorio B', idx: 1, color: sage },
    { label: 'Consultorio C', idx: 2, color: terracotta },
    { label: 'Consultorio D', idx: 3, color: sage },
    { label: 'Hall',          idx: 4, color: terracotta },
  ];
  var HOURS = ['09:00','10:00','11:00','14:00','15:00','16:00','17:00','18:00'];
  var DAY_NAMES = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  var MONTH_NAMES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

  window._actDragPayload = null;

  if (!window._activityWeekStart) {
    var today = new Date(); today.setHours(0,0,0,0);
    var dow = today.getDay();
    var mon = new Date(today); mon.setDate(today.getDate() - ((dow + 6) % 7));
    window._activityWeekStart = mon;
  }

  function getDateKey(d) {
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }

  // Get weekday dates Mon-Sat from weekStart
  function getWeekDays() {
    var days = [];
    for (var i = 0; i < 6; i++) {
      var dd = new Date(window._activityWeekStart);
      dd.setDate(dd.getDate() + i);
      days.push(dd);
    }
    return days;
  }

  // Build schedule for one room on one day
  function getSlot(d, roomIdx) {
    var dow = d.getDay();
    var dateKey = getDateKey(d);
    var customSlots = (window._agendaCustomSlots || {})[dateKey] || {};
    var isMWF = [1,3,5].includes(dow);
    var isTT  = [2,4].includes(dow);
    var isWed = dow === 3;
    var isSat = dow === 6;
    var isSun = dow === 0;

    var slots = {};
    HOURS.forEach(function(h) {
      slots[h] = { prof: null, type: 'empty' };
    });

    if (isSun) {
      HOURS.forEach(function(h) { slots[h] = { prof: 'Cerrado', type: 'closed' }; });
      return slots;
    }
    if (isSat && roomIdx < 4) {
      HOURS.forEach(function(h) { slots[h] = { prof: null, type: 'closed' }; });
    }

    // Hardcoded professional schedules per room
    if (roomIdx === 0) {
      if (isMWF) { ['09:00','10:00'].forEach(function(h) { slots[h] = { prof: 'Lic. García', type: 'profesional' }; }); }
      if ([1,5].includes(dow)) { ['14:00','15:00'].forEach(function(h) { slots[h] = { prof: 'Lic. Torres', type: 'profesional' }; }); }
      if (isTT) { ['17:00','18:00'].forEach(function(h) { slots[h] = { prof: 'Dr. Rodríguez', type: 'profesional' }; }); }
    }
    if (roomIdx === 1) {
      if (isTT) { ['09:00','10:00','11:00'].forEach(function(h) { slots[h] = { prof: 'Dra. Fossati', type: 'profesional' }; }); }
      if (isMWF) { slots['15:00'] = { prof: 'Lic. García', type: 'profesional' }; }
    }
    if (roomIdx === 2) {
      if (isTT) {
        ['09:00','10:00'].forEach(function(h) { slots[h] = { prof: 'Dr. Rodríguez', type: 'profesional' }; });
        ['14:00','15:00'].forEach(function(h) { slots[h] = { prof: 'Dr. Rodríguez', type: 'profesional' }; });
        slots['11:00'] = { prof: 'Dra. Ruiz', type: 'profesional' };
      }
      if ([3,5].includes(dow)) { slots['16:00'] = { prof: 'Dra. Ruiz', type: 'profesional' }; }
    }
    if (roomIdx === 3) {
      if (isTT) {
        slots['10:00'] = { prof: 'Prof. Méndez (Yoga)', type: 'taller' };
        slots['11:00'] = { prof: 'Prof. Méndez (Yoga)', type: 'taller' };
        slots['16:00'] = { prof: 'Taller grupal', type: 'taller' };
        slots['17:00'] = { prof: 'Taller grupal', type: 'taller' };
      }
    }
    if (roomIdx === 4) {
      if (isTT) {
        slots['17:00'] = { prof: 'Taller Cuencos', type: 'taller' };
        slots['18:00'] = { prof: 'Yoga Terapéutico', type: 'taller' };
      }
      if (isWed) { slots['16:00'] = { prof: 'Meditación', type: 'taller' }; }
      if (isSat) {
        slots['10:00'] = { prof: 'Taller Cuencos', type: 'taller' };
        slots['16:00'] = { prof: 'Taller Cuencos', type: 'taller' };
      }
    }

    // Apply custom overrides
    HOURS.forEach(function(h) {
      var key = h + '-' + roomIdx;
      if (customSlots[key]) {
        var v = customSlots[key];
        if (v.name) slots[h] = { prof: v.name, type: v.type };
      }
    });

    return slots;
  }

  function saveDrop(dateKey, hour, roomIdx, name, type) {
    if (!window._agendaCustomSlots) window._agendaCustomSlots = {};
    if (!window._agendaCustomSlots[dateKey]) window._agendaCustomSlots[dateKey] = {};
    window._agendaCustomSlots[dateKey][hour + '-' + roomIdx] = { name: name, type: type, patient: null };
  }

  function clearSlot(dateKey, hour, roomIdx) {
    if (!window._agendaCustomSlots) window._agendaCustomSlots = {};
    if (!window._agendaCustomSlots[dateKey]) window._agendaCustomSlots[dateKey] = {};
    window._agendaCustomSlots[dateKey][hour + '-' + roomIdx] = { name: '', type: 'empty', patient: null };
  }

  function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;'); }

  function renderAll() {
    var weekStart = window._activityWeekStart;
    var today = new Date(); today.setHours(0,0,0,0);
    var weekDays = getWeekDays();
    var profData = window._profData || [];
    var wsData   = window._workshopsData || [];
    var activeProfessionals = profData.filter(function(p) { return p.activo !== false; });
    var activeWorkshops = wsData.filter(function(w) { return w.active !== false; });

    var weekLabel = weekDays[0].getDate() + ' ' + MONTH_NAMES[weekDays[0].getMonth()] + ' — ' + weekDays[5].getDate() + ' ' + MONTH_NAMES[weekDays[5].getMonth()] + ' ' + weekDays[5].getFullYear();

    // Build room grids HTML
    var roomGridsHtml = ROOMS.map(function(room) {
      // Stats for this room this week
      var totalSlots = 0, occupiedSlots = 0;
      weekDays.forEach(function(dd) {
        var slots = getSlot(dd, room.idx);
        HOURS.forEach(function(h) {
          if (slots[h].type !== 'closed') totalSlots++;
          if (slots[h].prof && slots[h].type !== 'closed' && slots[h].type !== 'empty') occupiedSlots++;
        });
      });
      var pct = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

      var tableRows = HOURS.map(function(h) {
        var cells = weekDays.map(function(dd) {
          var slots = getSlot(dd, room.idx);
          var cell = slots[h];
          var isClosed = cell.type === 'closed';
          var isEmpty = !cell.prof || cell.type === 'empty';
          var isTaller = cell.type === 'taller';
          var isPro = cell.type === 'profesional';
          var isToday = dd.getTime() === today.getTime();
          var dateKey = getDateKey(dd);

          var bg = 'transparent';
          var clr = 'rgba(0,0,0,0.18)';
          var wt = '400';
          var brd = 'none';
          if (isClosed) { bg = 'rgba(0,0,0,0.02)'; clr = 'rgba(0,0,0,0.12)'; }
          else if (isTaller) { bg = lightTerra; clr = terracotta; wt = '600'; brd = '3px solid ' + terracotta; }
          else if (isPro) { bg = lightSage; clr = sage; wt = '600'; brd = '3px solid ' + sage + '60'; }

          if (isToday && !isClosed) bg = isEmpty ? sage + '08' : bg;

          var clickable = !isClosed;
          var isOccupied = !isEmpty && clickable;
          var label = isEmpty ? '<span style="color:rgba(0,0,0,0.12);font-size:0.72rem;">—</span>' :
            '<span style="color:' + clr + ';font-weight:' + wt + ';font-size:0.72rem;line-height:1.3;display:block;pointer-events:none;">' + cell.prof + '</span>';
          var hint = (clickable && isEmpty) ? '<span class="act-hint" style="font-size:0.6rem;color:rgba(0,0,0,0.1);pointer-events:none;">+ asignar</span>' : '';

          var ep = esc(cell.prof || '');
          var cellType = isTaller ? 'taller' : 'profesional';
          var dragAttr = isOccupied ? ' draggable="true" data-src-name="' + ep + '" data-src-type="' + cellType + '"' : '';

          return '<td class="act-cell' + (isOccupied ? ' act-occupied' : '') + '"' + dragAttr + ' data-hour="' + h + '" data-room="' + room.idx + '" data-date="' + dateKey + '"' +
            ' style="padding:5px 6px;background:' + bg + ';border-left:' + brd + ';border-bottom:1px solid rgba(0,0,0,0.04);vertical-align:top;min-width:80px;height:36px;' +
            (clickable ? 'cursor:pointer;' : '') + (isOccupied ? 'cursor:grab;' : '') + 'transition:all 0.15s;">' + label + hint + '</td>';
        }).join('');

        return '<tr>' +
          '<td style="padding:5px 10px;font-weight:700;font-size:0.72rem;color:var(--color-text-muted);background:var(--bg-card-alt);border-bottom:1px solid rgba(0,0,0,0.04);white-space:nowrap;text-align:center;">' + h + '</td>' +
          cells + '</tr>';
      }).join('');

      var dayHeaders = weekDays.map(function(dd) {
        var isT = dd.getTime() === today.getTime();
        var ddDow = dd.getDay();
        return '<th style="padding:8px 4px;text-align:center;border-bottom:2px solid ' + (isT ? sage : 'rgba(0,0,0,0.06)') + ';min-width:80px;">' +
          '<div style="font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:' + (isT ? sage : 'var(--color-text-muted)') + ';">' + DAY_NAMES[ddDow] + '</div>' +
          '<div style="font-size:0.85rem;font-weight:' + (isT ? '800' : '600') + ';color:' + (isT ? sage : 'var(--color-text-primary)') + ';">' + dd.getDate() + '</div>' +
          (isT ? '<div style="width:4px;height:4px;border-radius:50%;background:' + sage + ';margin:2px auto 0;"></div>' : '') +
        '</th>';
      }).join('');

      return '<div class="card" style="padding:0;overflow-x:auto;margin-bottom:20px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid rgba(0,0,0,0.06);">' +
          '<div style="display:flex;align-items:center;gap:10px;">' +
            '<div style="width:10px;height:10px;border-radius:3px;background:' + room.color + ';"></div>' +
            '<span style="font-size:0.85rem;font-weight:700;color:var(--color-text-primary);">' + room.label + '</span>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:10px;">' +
            '<div style="width:60px;height:5px;background:rgba(0,0,0,0.06);border-radius:3px;overflow:hidden;"><div style="width:' + pct + '%;height:100%;background:' + room.color + ';border-radius:3px;"></div></div>' +
            '<span style="font-size:0.72rem;font-weight:700;color:' + room.color + ';">' + pct + '% ocupado</span>' +
          '</div>' +
        '</div>' +
        '<table style="width:100%;border-collapse:collapse;">' +
          '<thead><tr style="background:var(--bg-card-alt);">' +
            '<th style="padding:8px 10px;text-align:center;border-bottom:2px solid rgba(0,0,0,0.06);min-width:50px;"><span style="font-size:0.6rem;font-weight:700;text-transform:uppercase;color:var(--color-text-muted);">Hora</span></th>' +
            dayHeaders +
          '</tr></thead>' +
          '<tbody>' + tableRows + '</tbody>' +
        '</table>' +
      '</div>';
    }).join('');

    container.innerHTML = '\
      <style>\
        .act-drag-item{cursor:grab;transition:transform 0.15s,opacity 0.15s;user-select:none;border-radius:6px;}\
        .act-drag-item:hover{transform:translateX(3px);background:rgba(0,0,0,0.02);}\
        .act-drag-item.dragging{opacity:0.4;transform:scale(0.95);}\
        .act-occupied{cursor:grab !important;}\
        .act-occupied:active{cursor:grabbing !important;}\
        .act-occupied.dragging{opacity:0.3;}\
        .act-cell.drag-over{outline:2.5px dashed ' + sage + ' !important;outline-offset:-2px;background:' + sage + '15 !important;}\
        .act-cell.drag-over .act-hint{color:' + sage + ' !important;font-weight:700 !important;}\
        .act-cell.drop-ok{animation:dropOk 0.5s ease;}\
        @keyframes dropOk{0%{background:' + sage + '35;}100%{background:transparent;}}\
        .act-trash.drag-over-trash{border-color:rgba(200,60,60,0.7) !important;background:rgba(200,60,60,0.08) !important;transform:scale(1.03);}\
        .act-trash.drag-over-trash div{color:rgba(200,60,60,0.9) !important;}\
        .act-cell:hover{background:rgba(122,139,111,0.04) !important;}\
      </style>\
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;">\
        <div class="dashboard-header" style="margin-bottom:0;">\
          <h1>Consultorios</h1>\
          <p class="dashboard-subtitle">ASIGNACIÓN SEMANAL DE PROFESIONALES Y TALLERES POR ESPACIO</p>\
        </div>\
      </div>\
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">\
        <div style="display:flex;align-items:center;background:var(--bg-card);border-radius:var(--radius-pill);border:1px solid rgba(0,0,0,0.08);overflow:hidden;box-shadow:var(--shadow-card);">\
          <button id="act-week-prev" style="padding:8px 14px;background:none;border:none;cursor:pointer;font-size:1.1rem;color:var(--color-text-muted);">‹</button>\
          <span style="padding:0 16px;font-size:0.82rem;font-weight:700;color:var(--color-text-primary);white-space:nowrap;">' + weekLabel + '</span>\
          <button id="act-week-next" style="padding:8px 14px;background:none;border:none;cursor:pointer;font-size:1.1rem;color:var(--color-text-muted);">›</button>\
        </div>\
      </div>\
      <div style="display:grid;grid-template-columns:1fr 240px;gap:20px;align-items:start;">\
        <div>' + roomGridsHtml + '</div>\
        <div style="display:flex;flex-direction:column;gap:14px;position:sticky;top:20px;">\
          <div id="act-trash" class="act-trash" style="padding:14px;border:2px dashed rgba(200,60,60,0.2);border-radius:12px;text-align:center;transition:all 0.2s;background:rgba(200,60,60,0.02);">\
            <div style="display:flex;align-items:center;justify-content:center;gap:8px;">\
              <span style="font-size:1.2rem;">🗑️</span>\
              <span style="font-size:0.72rem;font-weight:600;color:rgba(200,60,60,0.5);">Arrastrá aquí para eliminar</span>\
            </div>\
          </div>\
          <div class="card" style="padding:16px 18px;">\
            <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:' + sage + ';margin-bottom:10px;">👤 Profesionales <span style="font-weight:400;color:var(--color-text-muted);font-size:0.6rem;margin-left:2px;">arrastrá a la grilla</span></div>\
            ' + activeProfessionals.map(function(p, i) { return '\
              <div class="act-drag-item" draggable="true" data-idx="p-' + i + '" style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-bottom:1px solid rgba(0,0,0,0.04);margin-bottom:1px;">\
                <div style="width:5px;height:20px;border-radius:3px;background:' + sage + '40;flex-shrink:0;"></div>\
                <div style="flex:1;min-width:0;">\
                  <div style="font-size:0.75rem;font-weight:600;color:var(--color-text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + p.name + '</div>\
                  <div style="font-size:0.62rem;color:var(--color-text-muted);">' + p.specialty + '</div>\
                </div>\
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="3"><circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/></svg>\
              </div>'; }).join('') + '\
          </div>\
          <div class="card" style="padding:16px 18px;">\
            <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:' + terracotta + ';margin-bottom:10px;">📋 Talleres <span style="font-weight:400;color:var(--color-text-muted);font-size:0.6rem;margin-left:2px;">arrastrá a la grilla</span></div>\
            ' + activeWorkshops.map(function(w, i) { return '\
              <div class="act-drag-item" draggable="true" data-idx="w-' + i + '" style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-bottom:1px solid rgba(0,0,0,0.04);margin-bottom:1px;">\
                <div style="width:5px;height:20px;border-radius:3px;background:' + terracotta + '40;flex-shrink:0;"></div>\
                <div style="flex:1;min-width:0;">\
                  <div style="font-size:0.75rem;font-weight:600;color:var(--color-text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + w.name + '</div>\
                  <div style="font-size:0.62rem;color:var(--color-text-muted);">' + w.schedule + '</div>\
                </div>\
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="3"><circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/></svg>\
              </div>'; }).join('') + '\
          </div>\
          <div class="card" style="padding:14px 18px;background:' + sage + '08;border:1px dashed ' + sage + '25;">\
            <div style="font-size:0.7rem;font-weight:700;color:' + sage + ';margin-bottom:4px;">💡 Cómo usar</div>\
            <div style="font-size:0.72rem;color:var(--color-text-muted);line-height:1.5;">\
              Arrastrá profesionales o talleres a la grilla. Podés mover bloques ya asignados a otra celda, o arrastrarlos al tacho para eliminar.\
            </div>\
          </div>\
        </div>\
      </div>';

    // ═══ EVENT LISTENERS ═══
    container.querySelector('#act-week-prev').addEventListener('click', function() {
      window._activityWeekStart = new Date(window._activityWeekStart);
      window._activityWeekStart.setDate(window._activityWeekStart.getDate() - 7);
      renderAll();
    });
    container.querySelector('#act-week-next').addEventListener('click', function() {
      window._activityWeekStart = new Date(window._activityWeekStart);
      window._activityWeekStart.setDate(window._activityWeekStart.getDate() + 7);
      renderAll();
    });

    // ═══ DRAG & DROP ═══

    // Sidebar items (new assignments)
    container.querySelectorAll('.act-drag-item').forEach(function(item) {
      var dataIdx = item.dataset.idx;
      var parts = dataIdx.split('-');
      var isProf = parts[0] === 'p';
      var arrIdx = parseInt(parts[1]);

      item.addEventListener('dragstart', function(e) {
        var source = isProf ? activeProfessionals[arrIdx] : activeWorkshops[arrIdx];
        window._actDragPayload = { name: source.name, type: isProf ? 'profesional' : 'taller', fromCell: false };
        e.dataTransfer.effectAllowed = 'copyMove';
        e.dataTransfer.setData('text/plain', source.name);
        item.classList.add('dragging');
        setTimeout(function() {
          container.querySelectorAll('.act-cell[data-hour]').forEach(function(td) {
            td.style.outline = '2px dashed ' + sage + '25';
            td.style.outlineOffset = '-2px';
          });
        }, 30);
      });

      item.addEventListener('dragend', function() {
        item.classList.remove('dragging');
        window._actDragPayload = null;
        container.querySelectorAll('.act-cell').forEach(function(td) {
          td.style.outline = '';
          td.classList.remove('drag-over');
        });
        var trash = container.querySelector('#act-trash');
        if (trash) trash.classList.remove('drag-over-trash');
      });
    });

    // Occupied cells (move existing assignments)
    container.querySelectorAll('.act-occupied').forEach(function(cell) {
      cell.addEventListener('dragstart', function(e) {
        var srcName = cell.getAttribute('data-src-name');
        var srcType = cell.getAttribute('data-src-type');
        var srcHour = cell.getAttribute('data-hour');
        var srcRoom = cell.getAttribute('data-room');
        var srcDate = cell.getAttribute('data-date');
        window._actDragPayload = { name: srcName, type: srcType, fromCell: true, srcHour: srcHour, srcRoom: srcRoom, srcDate: srcDate };
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', srcName);
        cell.classList.add('dragging');
        setTimeout(function() {
          container.querySelectorAll('.act-cell[data-hour]').forEach(function(td) {
            td.style.outline = '2px dashed ' + sage + '25';
            td.style.outlineOffset = '-2px';
          });
        }, 30);
      });

      cell.addEventListener('dragend', function() {
        cell.classList.remove('dragging');
        window._actDragPayload = null;
        container.querySelectorAll('.act-cell').forEach(function(td) {
          td.style.outline = '';
          td.classList.remove('drag-over');
        });
        var trash = container.querySelector('#act-trash');
        if (trash) trash.classList.remove('drag-over-trash');
      });
    });

    // Drop targets (cells)
    container.querySelectorAll('.act-cell[data-hour]').forEach(function(td) {
      td.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = window._actDragPayload && window._actDragPayload.fromCell ? 'move' : 'copy';
        td.classList.add('drag-over');
      });
      td.addEventListener('dragleave', function() {
        td.classList.remove('drag-over');
      });
      td.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        td.classList.remove('drag-over');
        var payload = window._actDragPayload;
        if (!payload) return;
        var hour = td.getAttribute('data-hour');
        var roomIdx = parseInt(td.getAttribute('data-room'));
        var dateKey = td.getAttribute('data-date');
        // If moving from another cell, clear the source first
        if (payload.fromCell) {
          clearSlot(payload.srcDate, payload.srcHour, parseInt(payload.srcRoom));
        }
        saveDrop(dateKey, hour, roomIdx, payload.name, payload.type);
        window._actDragPayload = null;
        renderAll();
      });
    });

    // Trash zone
    var trashZone = container.querySelector('#act-trash');
    if (trashZone) {
      trashZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        trashZone.classList.add('drag-over-trash');
      });
      trashZone.addEventListener('dragleave', function() {
        trashZone.classList.remove('drag-over-trash');
      });
      trashZone.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        trashZone.classList.remove('drag-over-trash');
        var payload = window._actDragPayload;
        if (!payload || !payload.fromCell) return;
        clearSlot(payload.srcDate, payload.srcHour, parseInt(payload.srcRoom));
        window._actDragPayload = null;
        renderAll();
      });
    }
  }

  renderAll();
};
