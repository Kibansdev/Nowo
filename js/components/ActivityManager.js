// ══════════════════════════════════════════════════════════
// Consultorios — Vista semanal por espacio
// Una grilla por consultorio: filas = horas, columnas = Lun-Sáb
// Drag & drop de profesionales y talleres
// ══════════════════════════════════════════════════════════

window.renderActivity = function (container) {
  window._liquidationState = window._liquidationState || {};
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
    { label: 'Espacio Coworking', idx: 5, color: sage },
  ];
  var HOURS = ['09:00','10:00','11:00','14:00','15:00','16:00','17:00','18:00'];
  var DAY_NAMES = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  var MONTH_NAMES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

  window._actDragPayload = null;
  window._activeActivityTab = window._activeActivityTab || 'all';

  function getProfColor(name) {
    if (!name || name === '—' || name === 'Cerrado' || name === 'Espacio cerrado' || name === 'Sin turnos') {
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

  if (!window._activityWeekStart) {
    var today = new Date(); today.setHours(0,0,0,0);
    var dow = today.getDay();
    var mon = new Date(today); mon.setDate(today.getDate() - ((dow + 6) % 7));
    window._activityWeekStart = mon;
  }

  function getRoomPrice(roomIdx) {
    if (!window._roomsData) {
      window._roomsData = [
        { name: 'Consultorio A', idx: 0, price: 3000 },
        { name: 'Consultorio B', idx: 1, price: 2500 },
        { name: 'Consultorio C', idx: 2, price: 3500 },
        { name: 'Consultorio D', idx: 3, price: 2000 },
        { name: 'Hall',          idx: 4, price: 1500 },
        { name: 'Espacio Coworking', idx: 5, price: 1200 }
      ];
    }
    var r = window._roomsData.find(function(x) { return x.idx === roomIdx; });
    return r ? r.price : 2000;
  }

  function getSlotPrice(dateKey, hour, roomIdx) {
    var customSlots = (window._agendaCustomSlots || {})[dateKey] || {};
    var key = hour + '-' + roomIdx;
    if (customSlots[key] && customSlots[key].price !== undefined && customSlots[key].price !== null) {
      return parseFloat(customSlots[key].price);
    }
    return getRoomPrice(roomIdx);
  }

  function formatSlotDate(dateKey) {
    var parts = dateKey.split('-');
    var y = parseInt(parts[0]);
    var m = parseInt(parts[1]) - 1;
    var d = parseInt(parts[2]);
    var date = new Date(y, m, d);
    return DAY_NAMES[date.getDay()] + ' ' + d + ' de ' + MONTH_NAMES[m];
  }

  window._setRoomBasePrice = function(roomIdx, price) {
    if (!window._roomsData) {
      window._roomsData = [
        { name: 'Consultorio A', idx: 0, price: 3000 },
        { name: 'Consultorio B', idx: 1, price: 2500 },
        { name: 'Consultorio C', idx: 2, price: 3500 },
        { name: 'Consultorio D', idx: 3, price: 2000 },
        { name: 'Hall',          idx: 4, price: 1500 },
        { name: 'Espacio Coworking', idx: 5, price: 1200 }
      ];
    }
    var r = window._roomsData.find(function(x) { return x.idx === roomIdx; });
    if (r) {
      r.price = parseInt(price) || 0;
    }
    renderAll();
  };

  window._setActivityTab = function(tabId) {
    window._activeActivityTab = tabId;
    renderAll();
  };

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

  // Helper to calculate weekly professional hours liquidation
  function calculateLiquidationData() {
    var weekDays = getWeekDays();
    var profs = window._profData || [];
    var data = {};

    // Initialize all active professionals with 0 hours
    profs.forEach(function(p) {
      if (p.activo !== false) {
        data[p.name] = {
          name: p.name,
          tel: p.tel || '',
          email: p.email || '',
          color: p.color || sage,
          hours: 0,
          value: 0
        };
      }
    });

    // Scan all slots of the week
    weekDays.forEach(function(dd) {
      var dateKey = getDateKey(dd);
      var events = window._getAgendaEventsForDate(dd);
      events.forEach(function(ev) {
        if (ev.type !== 'closed' && ev.prof && ev.type !== 'empty') {
          var dur = (window._timeToMinutes(ev.end) - window._timeToMinutes(ev.start)) / 60;
          var price = (ev.price !== null && ev.price !== undefined) ? ev.price : (getRoomPrice(ev.roomIdx) * dur);
          
          // Try to match the professional name
          var matchedProfName = null;
          var cleanLower = ev.prof.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

          function getWords(str) {
            var titlesAndCommon = ['lic', 'dr', 'dra', 'prof', 'taller', 'yoga', 'terapeutico', 'meditacion', 'cuencos', 'de', 'y', 'con', 'para'];
            return str.toLowerCase()
              .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9\s]/g, '')
              .split(/\s+/)
              .filter(function(w) { return w.length > 2 && !titlesAndCommon.includes(w); });
          }

          var nameWords = getWords(ev.prof);
          if (nameWords.length > 0) {
            for (var i = 0; i < profs.length; i++) {
              var pWords = getWords(profs[i].name);
              var hasOverlap = nameWords.some(function(w) { return pWords.includes(w); });
              if (hasOverlap) {
                matchedProfName = profs[i].name;
                break;
              }
            }
          }

          if (!matchedProfName) {
            for (var i = 0; i < profs.length; i++) {
              var pNameLower = profs[i].name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
              var pNameNoTitle = pNameLower.replace(/^(lic\.|dr\.|dra\.|prof\.)\s*/, '');
              var nameNoTitle = cleanLower.replace(/^(lic\.|dr\.|dra\.|prof\.)\s*/, '');
              if (pNameNoTitle.includes(nameNoTitle) || nameNoTitle.includes(pNameNoTitle)) {
                matchedProfName = profs[i].name;
                break;
              }
            }
          }

          if (matchedProfName) {
            data[matchedProfName].hours += dur;
            data[matchedProfName].value += price;
          } else if (ev.type === 'profesional') {
            if (!data[ev.prof]) {
              data[ev.prof] = {
                name: ev.prof,
                tel: '',
                email: '',
                color: sage,
                hours: 0,
                value: 0
              };
            }
            data[ev.prof].hours += dur;
            data[ev.prof].value += price;
          }
        }
      });
    });

    return data;
  }

  function clearSlot(dateKey, hour, roomIdx) {
    if (!window._agendaCustomSlots) window._agendaCustomSlots = {};
    if (!window._agendaCustomSlots[dateKey]) window._agendaCustomSlots[dateKey] = {};
    window._agendaCustomSlots[dateKey][hour + '-' + roomIdx] = { name: '', type: 'empty', price: null, patient: null };
  }

  function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;'); }

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

  function renderCardsForDay(dd, colIdx, roomIdx) {
    var dateKey = getDateKey(dd);
    var events = window._getAgendaEventsForDate(dd);
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
        ? '<div style="font-size: 0.72rem; font-weight: 700; color: ' + colors.text + '; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;">' + ev.patient + '</div>'
        : '';

      var serviceName = ev.service ? ev.service.name : (ev.type === 'taller' ? 'Taller' : '');
      var serviceLine = serviceName
        ? '<div style="font-size: 0.65rem; color: var(--color-text-muted); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + serviceName + '</div>'
        : '';

      var timeText = '<span class="card-time-span" style="font-size: 0.65rem; font-weight: 600; color: ' + colors.text + '; opacity: 0.85;">' + ev.start + ' - ' + ev.end + '</span>';
      var resizeHandle = '<div class="resize-handle" style="position: absolute; bottom: 0; left: 0; right: 0; height: 6px; cursor: s-resize; background: transparent; z-index: 20;" onmouseover="this.style.background=\'' + colors.border + '30\'" onmouseout="this.style.background=\'transparent\'"></div>';
      var customIndicator = ev.custom
        ? '<div style="position: absolute; top: 4px; right: 6px; width: 4px; height: 4px; border-radius: 50%; background: ' + colors.border + ';" title="Modificado"></div>'
        : '';

      var cleanProf = (ev.prof || '').replace(/"/g, '&quot;');
      var cleanPatient = (ev.patient || '').replace(/"/g, '&quot;');

      return '<div class="calendar-event-card" data-key="' + (ev.key || (ev.start + '-' + ev.roomIdx)) + '" data-start="' + ev.start + '" data-end="' + ev.end + '" data-date="' + dateKey + '" data-room="' + ev.roomIdx + '" data-prof="' + cleanProf + '" data-patient="' + cleanPatient + '" data-type="' + ev.type + '" style="' + cardStyle + '" onmousedown="window._onActivityCardMouseDown(event, this)">' +
        customIndicator +
        '<div style="font-size: 0.76rem; font-weight: 700; color: var(--color-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2;">' + (ev.prof || '—') + '</div>' +
        serviceLine +
        patientLine +
        '<div style="margin-top: auto; display: flex; align-items: center; justify-content: space-between; padding-top: 2px;">' +
          timeText +
        '</div>' +
        resizeHandle +
      '</div>';
    }).join('');
  }

  window._onActivityColumnClick = function(e, colIdx, roomIdx) {
    if (e.target.classList.contains('day-column')) {
      var rect = e.currentTarget.getBoundingClientRect();
      var clickY = e.clientY - rect.top;
      var clickedMin = Math.round(clickY / 15) * 15; // snap to 15 min
      var startMin = 8 * 60 + clickedMin;
      var startStr = window._minutesToTime(startMin);
      
      var weekDays = getWeekDays();
      var dd = weekDays[colIdx];
      var dateKey = getDateKey(dd);
      window._openActivitySlotModal(dateKey, startStr, roomIdx);
    }
  };

  window._onActivityCardMouseDown = function(e, cardEl) {
    var isResize = e.target.classList.contains('resize-handle');
    e.stopPropagation();

    if (e.button !== 0) return;

    var key = cardEl.getAttribute('data-key');
    var startStr = cardEl.getAttribute('data-start');
    var endStr = cardEl.getAttribute('data-end');
    var roomIdx = parseInt(cardEl.getAttribute('data-room'), 10);
    var dateKey = cardEl.getAttribute('data-date');
    var prof = cardEl.getAttribute('data-prof');
    var type = cardEl.getAttribute('data-type');
    var patient = cardEl.getAttribute('data-patient') || '';

    var startY = e.pageY;
    var startX = e.pageX;
    var cardTop = cardEl.offsetTop;
    var cardHeight = cardEl.offsetHeight;

    var hasMoved = false;

    // Find the columns-area for this specific room grid
    var columnsArea = cardEl.closest('.columns-area');
    if (!columnsArea) return;
    var columnsRect = columnsArea.getBoundingClientRect();
    var colWidth = columnsRect.width / 6;

    var weekDays = getWeekDays();

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

        var timeSpan = cardEl.querySelector('.card-time-span');
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
        var targetColIdx = Math.floor(relativeX / colWidth);
        targetColIdx = Math.max(0, Math.min(5, targetColIdx));

        var targetColDiv = columnsArea.querySelectorAll('.day-column')[targetColIdx];
        if (targetColDiv && cardEl.parentElement !== targetColDiv) {
          targetColDiv.appendChild(cardEl);
        }

        var newStartMin = 8 * 60 + snappedTop;
        var durationMin = window._timeToMinutes(endStr) - window._timeToMinutes(startStr);
        var newEndMin = newStartMin + durationMin;

        var newStartStr = window._minutesToTime(newStartMin);
        var newEndStr = window._minutesToTime(newEndMin);

        var timeSpan = cardEl.querySelector('.card-time-span');
        if (timeSpan) {
          timeSpan.textContent = newStartStr + ' - ' + newEndStr;
        }

        cardEl.setAttribute('data-new-start', newStartStr);
        cardEl.setAttribute('data-new-end', newEndStr);
        cardEl.setAttribute('data-new-col-idx', targetColIdx);
      }
    }

    function onMouseUp(upEv) {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      if (!hasMoved) {
        window._openActivitySlotModal(dateKey, startStr, roomIdx, prof, type, key);
        return;
      }

      var trashEl = document.getElementById('act-trash');
      if (trashEl) {
        var trashRect = trashEl.getBoundingClientRect();
        if (upEv.clientX >= trashRect.left && upEv.clientX <= trashRect.right &&
            upEv.clientY >= trashRect.top && upEv.clientY <= trashRect.bottom) {
          // Delete slot!
          if (window._agendaCustomSlots[dateKey] && window._agendaCustomSlots[dateKey][key]) {
            delete window._agendaCustomSlots[dateKey][key];
          } else {
            var defaults = window._getAgendaEventsForDate(new Date(dateKey + 'T00:00:00'));
            var isDefault = defaults.some(function(def) {
              return !def.custom && def.start === startStr && def.roomIdx === roomIdx;
            });
            if (isDefault) {
              window._agendaCustomSlots[dateKey][key] = { name: '', type: 'empty', patient: null };
            }
          }
          renderAll();
          return;
        }
      }

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
        var finalColIdx = parseInt(cardEl.getAttribute('data-new-col-idx') !== null ? cardEl.getAttribute('data-new-col-idx') : weekDays.findIndex(function(d) { return getDateKey(d) === dateKey; }), 10);
        var newDateKey = getDateKey(weekDays[finalColIdx]);

        if (!window._agendaCustomSlots) window._agendaCustomSlots = {};
        if (!window._agendaCustomSlots[dateKey]) window._agendaCustomSlots[dateKey] = {};
        if (!window._agendaCustomSlots[newDateKey]) window._agendaCustomSlots[newDateKey] = {};

        var existingSlot = window._agendaCustomSlots[dateKey][key];
        var slotData = existingSlot ? JSON.parse(JSON.stringify(existingSlot)) : { name: prof, type: type, patient: patient || null };

        slotData.start = finalStart;
        slotData.end = finalEnd;
        slotData.roomIdx = roomIdx;

        // Delete from old place
        if (window._agendaCustomSlots[dateKey][key]) {
          delete window._agendaCustomSlots[dateKey][key];
        } else {
          // If it was a default slot, write empty slot to dateKey to override it
          var defaults = window._getAgendaEventsForDate(new Date(dateKey + 'T00:00:00'));
          var isDefault = defaults.some(function(def) {
            return !def.custom && def.start === startStr && def.roomIdx === roomIdx;
          });
          if (isDefault) {
            window._agendaCustomSlots[dateKey][key] = { name: '', type: 'empty', patient: null };
          }
        }

        // Add to new place
        var newKey = finalStart + '-' + roomIdx;
        window._agendaCustomSlots[newDateKey][newKey] = slotData;
      }

      renderAll();
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Slot Edit/Assign Modal
  window._openActivitySlotModal = function(dateKey, hour, roomIdx, currentProf, currentType, currentKey) {
    var existing = document.querySelector('.activity-slot-overlay');
    if (existing) existing.remove();

    currentProf = currentProf || '';
    currentType = currentType || 'profesional';
    currentKey = currentKey || (hour + '-' + roomIdx);
    var isEdit = currentProf && currentProf !== '—' && currentProf !== 'Cerrado' && currentProf !== 'Espacio cerrado';

    var profData = window._profData || [];
    var wsData = window._workshopsData || [];
    var activeProfessionals = profData.filter(function(p) { return p.activo !== false; });
    var activeWS = wsData.filter(function(w) { return w.active !== false; });

    var roomLabel = ROOMS[roomIdx].label;
    var dayLabel = formatSlotDate(dateKey);

    var isProfType = currentType !== 'taller';

    var slotValue = window._agendaCustomSlots && window._agendaCustomSlots[dateKey] ? window._agendaCustomSlots[dateKey][currentKey] : null;
    var activeService = slotValue ? slotValue.service : null;
    var currentPatient = slotValue ? slotValue.patient : '';

    var endHour = (function() {
      if (slotValue && slotValue.end) return slotValue.end;
      var startMin = window._timeToMinutes(hour);
      var endMin = startMin + 60;
      return window._minutesToTime(endMin);
    })();

    var overlay = document.createElement('div');
    overlay.className = 'activity-slot-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease;';

    overlay.innerHTML = '\
      <style>\
        .aslot-modal select, .aslot-modal input {\
          width:100%; padding:9px 12px; border:1px solid rgba(0,0,0,0.12); border-radius:6px;\
          font-family:var(--font-main); font-size:0.88rem; color:var(--color-text-primary);\
          background:var(--bg-card-alt); outline:none; transition:border-color 0.2s;\
        }\
        .aslot-modal select:focus, .aslot-modal input:focus { border-color:' + sage + '; box-shadow:0 0 0 3px ' + sage + '22; }\
        .aslot-modal label { display:block; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--color-text-muted); margin-bottom:5px; }\
        .aslot-type-btn { padding:10px 20px; border:2px solid rgba(0,0,0,0.1); border-radius:8px; background:#fff; font-size:0.85rem; font-weight:700; cursor:pointer; transition:all 0.2s; flex:1; text-align:center; }\
        .aslot-type-btn.active { border-color:' + sage + '; background:' + sage + '15; color:' + sage + '; }\
        .aslot-type-btn:not(.active):hover { border-color:rgba(0,0,0,0.2); }\
      </style>\
      <div class="aslot-modal" style="background:var(--bg-card);border-radius:var(--radius-lg);width:460px;box-shadow:var(--shadow-float);padding:0;">\
        <div style="padding:24px 28px 0;">\
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">\
            <h2 style="margin:0;font-size:1.15rem;color:var(--color-text-primary);">' + (isEdit ? 'Editar asignación' : 'Asignar horario') + '</h2>\
            <button onclick="this.closest(\'.activity-slot-overlay\').remove()" style="width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,0.06);color:var(--color-text-muted);font-size:1.1rem;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;">✕</button>\
          </div>\
          <div style="display:flex;gap:10px;padding:8px 0 4px;font-size:0.78rem;color:var(--color-text-muted);">\
            <span style="background:' + sage + '15;color:' + sage + ';font-weight:700;padding:3px 10px;border-radius:4px;">' + hour + '</span>\
            <span style="background:rgba(0,0,0,0.04);font-weight:600;padding:3px 10px;border-radius:4px;">' + roomLabel + '</span>\
            <span style="padding:3px 0;font-weight:500;">' + dayLabel + '</span>\
          </div>\
        </div>\
\
        <div style="padding:18px 28px 20px;display:flex;flex-direction:column;gap:16px;">\
          <!-- Time range -->\
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">\
            <div>\
              <label>Hora de inicio</label>\
              <input type="time" id="aslot-time-start" value="' + hour + '">\
            </div>\
            <div>\
              <label>Hora de finalización</label>\
              <input type="time" id="aslot-time-end" value="' + endHour + '">\
            </div>\
          </div>\
\
          <!-- Type selector -->\
          <div>\
            <label>Tipo de asignación</label>\
            <div style="display:flex;gap:10px;">\
              <button class="aslot-type-btn ' + (isProfType ? 'active' : '') + '" id="aslot-btn-prof" onclick="\
                document.getElementById(\'aslot-btn-prof\').classList.add(\'active\');\
                document.getElementById(\'aslot-btn-taller\').classList.remove(\'active\');\
                document.getElementById(\'aslot-prof-select\').style.display=\'block\';\
                document.getElementById(\'aslot-service-select\').style.display=\'block\';\
                document.getElementById(\'aslot-taller-select\').style.display=\'none\';\
              ">Profesional</button>\
              <button class="aslot-type-btn ' + (!isProfType ? 'active' : '') + '" id="aslot-btn-taller" onclick="\
                document.getElementById(\'aslot-btn-taller\').classList.add(\'active\');\
                document.getElementById(\'aslot-btn-prof\').classList.remove(\'active\');\
                document.getElementById(\'aslot-taller-select\').style.display=\'block\';\
                document.getElementById(\'aslot-prof-select\').style.display=\'none\';\
                document.getElementById(\'aslot-service-select\').style.display=\'none\';\
              ">Taller</button>\
            </div>\
          </div>\
\
          <!-- Professional dropdown -->\
          <div id="aslot-prof-select" style="display:' + (isProfType ? 'block' : 'none') + ';">\
            <label>Profesional</label>\
            <select id="aslot-prof-dropdown" onchange="window._onActivityProfChange()">\
              <option value="" disabled ' + (!isEdit || !isProfType ? 'selected' : '') + '>Seleccionar profesional...</option>\
              ' + activeProfessionals.map(function(p) { return '<option value="' + p.name + '" ' + (isEdit && isProfType && currentProf === p.name ? 'selected' : '') + '>' + p.name + ' — ' + p.specialty + '</option>'; }).join('') + '\
            </select>\
          </div>\
\
          <!-- Services dropdown -->\
          <div id="aslot-service-select" style="display:' + (isProfType ? 'block' : 'none') + ';">\
            <label>Servicio</label>\
            <select id="aslot-service-dropdown" onchange="window._onActivityServiceChange()">\
              <!-- populated dynamically -->\
            </select>\
          </div>\
\
          <!-- Workshop dropdown -->\
          <div id="aslot-taller-select" style="display:' + (!isProfType ? 'block' : 'none') + ';">\
            <label>Taller / Clase</label>\
            <select id="aslot-taller-dropdown">\
              <option value="" disabled ' + (!isEdit || isProfType ? 'selected' : '') + '>Seleccionar taller...</option>\
              ' + activeWS.map(function(w) { return '<option value="' + w.name + '" ' + (isEdit && !isProfType && currentProf === w.name ? 'selected' : '') + '>' + w.name + '</option>'; }).join('') + '\
            </select>\
          </div>\
\
          <!-- Patient assignment -->\
          <div style="border-top:1px solid rgba(0,0,0,0.06);padding-top:14px;">\
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">\
              <label style="margin-bottom:0;">Paciente reservado</label>\
              ' + (currentPatient ? '<button onclick="window._clearActivityPatientOnly(\'' + dateKey + '\',\'' + currentKey + '\',' + roomIdx + ')" style="font-size:0.7rem;color:#d9534f;background:none;border:none;cursor:pointer;font-weight:600;text-decoration:underline;">Quitar paciente</button>' : '') + '\
            </div>\
            <input type="text" id="aslot-patient" placeholder="Nombre del paciente (opcional)" value="' + currentPatient + '">\
          </div>\
        </div>\
\
        <div style="padding:14px 28px 22px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(0,0,0,0.06); gap:10px;">\
          <button onclick="window._removeActivitySlot(\'' + dateKey + '\',\'' + currentKey + '\',' + roomIdx + ')" style="padding:9px 16px;font-size:0.82rem;background:transparent;color:#d9534f;font-weight:600;border:1px solid rgba(217,83,79,0.2);border-radius:6px;cursor:pointer; white-space:nowrap;">Liberar</button>\
          <div style="display:flex;gap:10px;">\
            <button onclick="this.closest(\'.activity-slot-overlay\').remove()" style="padding:9px 16px;font-size:0.82rem;background:transparent;color:var(--color-text-muted);font-weight:600;border:none;cursor:pointer;">Cancelar</button>\
            <button style="padding:9px 24px;font-size:0.85rem;background:' + sage + ';color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;"\
              onclick="window._saveActivitySlot(\'' + dateKey + '\',\'' + currentKey + '\',' + roomIdx + ')">Guardar</button>\
          </div>\
        </div>\
      </div>\
    ';

    document.body.appendChild(overlay);

    if (isProfType && currentProf) {
      var prof = activeProfessionals.find(function(p) { return p.name === currentProf; });
      if (prof) {
        var services = getDefaultServicesForProf(prof);
        var serviceSelect = document.getElementById('aslot-service-dropdown');
        if (serviceSelect) {
          serviceSelect.innerHTML = services.map(function(s, idx) {
            var selected = activeService && activeService.name === s.name ? 'selected' : '';
            return '<option value="' + idx + '" ' + selected + '>' + s.name + ' ($' + s.price + ' · ' + s.duration + ' min)</option>';
          }).join('');
        }
      }
    }

    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  };

  window._onActivityProfChange = function() {
    var profSelect = document.getElementById('aslot-prof-dropdown');
    if (!profSelect) return;
    var profName = profSelect.value;
    var prof = (window._profData || []).find(function(p) { return p.name === profName; });
    if (!prof) return;

    var services = getDefaultServicesForProf(prof);
    var serviceSelect = document.getElementById('aslot-service-dropdown');
    if (!serviceSelect) return;

    serviceSelect.innerHTML = services.map(function(s, idx) {
      return '<option value="' + idx + '">' + s.name + ' ($' + s.price + ' · ' + s.duration + ' min)</option>';
    }).join('');

    window._onActivityServiceChange();
  };

  window._onActivityServiceChange = function() {
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

  window._clearActivityPatientOnly = function(dateKey, originalKey, roomIdx) {
    if (window._agendaCustomSlots && window._agendaCustomSlots[dateKey]) {
      var slot = window._agendaCustomSlots[dateKey][originalKey];
      if (slot) {
        slot.patient = null;
      }
    }
    document.querySelector('.activity-slot-overlay')?.remove();
    renderAll();
  };

  window._saveActivitySlot = function(dateKey, originalKey, roomIdx) {
    var isProfActive = document.getElementById('aslot-btn-prof').classList.contains('active');
    var name = '';
    var type = 'profesional';
    var service = null;
    var price = null;

    if (isProfActive) {
      var sel = document.getElementById('aslot-prof-dropdown');
      if (!sel || !sel.value) { alert('Seleccioná un profesional'); return; }
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
      if (!sel || !sel.value) { alert('Seleccioná un taller'); return; }
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

    document.querySelector('.activity-slot-overlay')?.remove();
    renderAll();
  };

  window._removeActivitySlot = function(dateKey, originalKey, roomIdx) {
    if (window._agendaCustomSlots && window._agendaCustomSlots[dateKey]) {
      delete window._agendaCustomSlots[dateKey][originalKey];

      var parts = originalKey.split('-');
      var startHour = parts[0];
      var rIdx = parseInt(parts[1], 10);
      
      var dd = new Date(dateKey + 'T00:00:00');
      var dow = dd.getDay();
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
    document.querySelector('.activity-slot-overlay')?.remove();
    renderAll();
  };

  // ── Weekly Professional Hours Liquidation Handlers ──
  window._onLiquidationInputChange = function(profName, weekKey) {
    var safeId = profName.replace(/[^a-zA-Z0-9]/g, '_');
    
    var hoursInput = document.querySelector('.liq-hours[data-prof="' + profName + '"]');
    var rateInput = document.querySelector('.liq-rate[data-prof="' + profName + '"]');
    var discountInput = document.querySelector('.liq-discount[data-prof="' + profName + '"]');
    
    if (!hoursInput || !rateInput || !discountInput) return;
    
    var hours = parseFloat(hoursInput.value);
    if (isNaN(hours)) hours = 0;
    var rate = parseFloat(rateInput.value);
    if (isNaN(rate)) rate = 0;
    var discount = parseFloat(discountInput.value);
    if (isNaN(discount)) discount = 0;
    
    var total = hours * rate;
    var finalTotal = total - discount;
    if (finalTotal < 0) finalTotal = 0;
    
    var totalSpan = document.getElementById('liq-total-' + safeId);
    var finalSpan = document.getElementById('liq-final-' + safeId);
    if (totalSpan) totalSpan.textContent = '$' + Math.round(total).toLocaleString('es-AR');
    if (finalSpan) finalSpan.textContent = '$' + Math.round(finalTotal).toLocaleString('es-AR');
    
    if (!window._liquidationState) window._liquidationState = {};
    if (!window._liquidationState[weekKey]) window._liquidationState[weekKey] = {};
    window._liquidationState[weekKey][profName] = {
      hours: hours,
      rate: rate,
      discount: discount
    };
    
    var grandHours = 0;
    var grandAmount = 0;
    var allHoursInputs = document.querySelectorAll('.liq-hours');
    
    for (var i = 0; i < allHoursInputs.length; i++) {
      var input = allHoursInputs[i];
      var pName = input.getAttribute('data-prof');
      var h = parseFloat(input.value);
      if (isNaN(h)) h = 0;
      var rInput = document.querySelector('.liq-rate[data-prof="' + pName + '"]');
      var r = rInput ? parseFloat(rInput.value) : 0;
      if (isNaN(r)) r = 0;
      var dInput = document.querySelector('.liq-discount[data-prof="' + pName + '"]');
      var d = dInput ? parseFloat(dInput.value) : 0;
      if (isNaN(d)) d = 0;
      
      var rowFinal = (h * r) - d;
      if (rowFinal < 0) rowFinal = 0;
      
      grandHours += h;
      grandAmount += rowFinal;
    }
    
    var grandHoursSpan = document.getElementById('liq-grand-hours');
    var grandAmountSpan = document.getElementById('liq-grand-amount');
    if (grandHoursSpan) grandHoursSpan.textContent = grandHours.toFixed(1) + ' hs';
    if (grandAmountSpan) grandAmountSpan.textContent = '$' + Math.round(grandAmount).toLocaleString('es-AR');
  };

  window._triggerRowWhatsApp = function(name, tel) {
    var hoursInput = document.querySelector('.liq-hours[data-prof="' + name + '"]');
    var rateInput = document.querySelector('.liq-rate[data-prof="' + name + '"]');
    var discountInput = document.querySelector('.liq-discount[data-prof="' + name + '"]');
    
    var hours = hoursInput ? parseFloat(hoursInput.value) : 0;
    if (isNaN(hours)) hours = 0;
    var rate = rateInput ? parseFloat(rateInput.value) : 0;
    if (isNaN(rate)) rate = 0;
    var discount = discountInput ? parseFloat(discountInput.value) : 0;
    if (isNaN(discount)) discount = 0;
    
    var finalTotal = (hours * rate) - discount;
    if (finalTotal < 0) finalTotal = 0;
    
    window._shareLiqWhatsApp(name, hours, rate, discount, finalTotal, tel);
  };

  window._shareLiqWhatsApp = function(name, hours, rate, discount, finalTotal, tel) {
    var msg = "¡Hola " + name + "! Espero que estés muy bien.\n\n" +
              "Te comparto la liquidación de las horas compartidas en Espacio Alvarado para esta semana:\n\n" +
              "• Horas tomadas: " + hours + " hs\n" +
              "• Valor por hora: $" + Math.round(rate).toLocaleString('es-AR') + "\n";
    if (discount > 0) {
      msg += "• Descuento aplicado: -$" + Math.round(discount).toLocaleString('es-AR') + "\n";
    }
    msg += "• Monto total: *$" + Math.round(finalTotal).toLocaleString('es-AR') + "*\n\n" +
           "Muchas gracias por formar parte de nuestro espacio de bienestar. ¡Que tengas una hermosa semana!";
    
    var cleanPhone = (tel || '').replace(/\D/g, '');
    var url = "";
    if (cleanPhone) {
      url = "https://wa.me/" + cleanPhone + "?text=" + encodeURIComponent(msg);
    } else {
      url = "https://api.whatsapp.com/send?text=" + encodeURIComponent(msg);
    }
    window.open(url, '_blank');
  };

  window._resetLiquidation = function(weekKey) {
    if (window._liquidationState && window._liquidationState[weekKey]) {
      delete window._liquidationState[weekKey];
    }
    renderAll();
  };

  function renderAll() {
    var weekStart = window._activityWeekStart;
    var today = new Date(); today.setHours(0,0,0,0);
    var weekDays = getWeekDays();
    var profData = window._profData || [];
    var wsData   = window._workshopsData || [];
    var activeProfessionals = profData.filter(function(p) { return p.activo !== false; });
    var activeWorkshops = wsData.filter(function(w) { return w.active !== false; });

    var weekLabel = weekDays[0].getDate() + ' ' + MONTH_NAMES[weekDays[0].getMonth()] + ' — ' + weekDays[5].getDate() + ' ' + MONTH_NAMES[weekDays[5].getMonth()] + ' ' + weekDays[5].getFullYear();

    var totalWeeklyRevenue = 0;
    var totalWeeklyPotential = 0;
    
    var roomStats = ROOMS.map(function(room) {
      var basePrice = getRoomPrice(room.idx);
      var totalSlots = 12 * 6; // 72 hours per week
      var occupiedSlots = 0;
      var roomRevenue = 0;
      var roomPotentialRevenue = basePrice * totalSlots;

      weekDays.forEach(function(dd) {
        var dateKey = getDateKey(dd);
        var events = window._getAgendaEventsForDate(dd);
        var roomEvents = events.filter(function(ev) { return ev.roomIdx === room.idx; });
        roomEvents.forEach(function(ev) {
          var dur = (window._timeToMinutes(ev.end) - window._timeToMinutes(ev.start)) / 60;
          occupiedSlots += dur;
          roomRevenue += (ev.price !== null && ev.price !== undefined) ? ev.price : (basePrice * dur);
        });
      });

      totalWeeklyRevenue += roomRevenue;
      totalWeeklyPotential += roomPotentialRevenue;

      return {
        room: room,
        totalSlots: totalSlots,
        occupiedSlots: occupiedSlots,
        roomRevenue: roomRevenue,
        roomPotentialRevenue: roomPotentialRevenue,
        pct: totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0,
        basePrice: basePrice
      };
    });

    var totalWeeklyPct = totalWeeklyPotential > 0 ? Math.round((totalWeeklyRevenue / totalWeeklyPotential) * 100) : 0;

    // Filter room list based on active tab
    var filteredStats = roomStats;
    if (window._activeActivityTab !== 'all') {
      var targetIdx = parseInt(window._activeActivityTab);
      filteredStats = roomStats.filter(function(stat) { return stat.room.idx === targetIdx; });
    }

    // Build room grids HTML
    var roomGridsHtml = filteredStats.map(function(stat) {
      var room = stat.room;
      var pct = stat.pct;
      var totalSlots = stat.totalSlots;
      var occupiedSlots = stat.occupiedSlots;
      var roomRevenue = stat.roomRevenue;
      var roomPotentialRevenue = stat.roomPotentialRevenue;
      var basePrice = stat.basePrice;

      // Columns header (Mon-Sat DOW and day numbers)
      var dayHeaders = weekDays.map(function(dd) {
        var isT = dd.getTime() === today.getTime();
        var ddDow = dd.getDay();
        return '<th style="padding:8px 4px;text-align:center;border-bottom:2px solid ' + (isT ? sage : 'rgba(0,0,0,0.06)') + ';min-width:100px;flex:1;box-sizing:border-box;">' +
          '<div style="font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:' + (isT ? sage : 'var(--color-text-muted)') + ';">' + DAY_NAMES[ddDow] + '</div>' +
          '<div style="font-size:0.85rem;font-weight:' + (isT ? '800' : '600') + ';color:' + (isT ? sage : 'var(--color-text-primary)') + ';">' + dd.getDate() + '</div>' +
          (isT ? '<div style="width:4px;height:4px;border-radius:50%;background:' + sage + ';margin:2px auto 0;"></div>' : '') +
        '</th>';
      }).join('');

      var hoursList = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

      return '<div class="card" style="padding:0;overflow:hidden;margin-bottom:20px;box-shadow:var(--shadow-sm);border:1px solid rgba(0,0,0,0.06);">' +
        // Card Header (Room Name & occupied %)
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid rgba(0,0,0,0.05);">' +
          '<div style="display:flex;align-items:center;gap:10px;">' +
            '<div style="width:10px;height:10px;border-radius:3px;background:' + room.color + ';"></div>' +
            '<span style="font-size:0.85rem;font-weight:700;color:var(--color-text-primary);">' + room.label + '</span>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:10px;">' +
            '<div style="width:60px;height:5px;background:rgba(0,0,0,0.06);border-radius:3px;overflow:hidden;"><div style="width:' + pct + '%;height:100%;background:' + room.color + ';border-radius:3px;"></div></div>' +
            '<span style="font-size:0.72rem;font-weight:700;color:' + room.color + ';">' + pct + '% ocupado</span>' +
          '</div>' +
        '</div>' +
        // Financial Summary Bar inside the card
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 18px;background:var(--bg-card-alt);border-bottom:1px solid rgba(0,0,0,0.05);flex-wrap:wrap;gap:12px;">' +
          '<div style="font-size:0.75rem;color:var(--color-text-secondary);display:flex;align-items:center;gap:14px;">' +
            '<span>Valor: <strong style="font-weight:700;color:var(--color-text-primary);margin-left:2px;margin-right:2px;">$' + basePrice + '</strong><span style="color:var(--color-text-muted);">/ hr</span></span>' +
            '<span>Ocupación: <strong>' + parseFloat(occupiedSlots.toFixed(1)) + ' / ' + totalSlots + ' hrs</strong></span>' +
          '</div>' +
          '<div style="font-size:0.75rem;color:var(--color-text-secondary);display:flex;gap:16px;">' +
            '<span>Ingreso Semanal: <strong style="color:' + sage + ';">$' + Math.round(roomRevenue).toLocaleString('es-AR') + '</strong></span>' +
            '<span>Potencial Máximo: <strong style="color:var(--color-text-primary);">$' + Math.round(roomPotentialRevenue).toLocaleString('es-AR') + '</strong></span>' +
          '</div>' +
        '</div>' +
        // Notion Style Weekly Grid Container
        '<div class="calendar-grid-container" style="display:flex; flex-direction:column; position:relative;">' +
          // Table-like day headers
          '<table style="width:100%; border-collapse:collapse; background:var(--bg-card-alt); border-bottom:1.5px solid rgba(0,0,0,0.08); table-layout:fixed;">' +
            '<thead><tr>' +
              '<th style="width:60px; padding:0; border:none;"></th>' +
              dayHeaders +
            '</tr></thead>' +
          '</table>' +
          // Calendar Grid Body
          '<div class="calendar-body" style="display:flex; position:relative; height:720px; user-select:none;">' +
            // Left Time Axis
            '<div class="time-axis" style="width:60px; height:720px; position:relative; background:var(--bg-card-alt); border-right:1.5px solid rgba(0,0,0,0.08); flex-shrink:0;">' +
              hoursList.map(function(h, i) {
                return '<div style="position:absolute; top:' + (i * 60 - 7) + 'px; right:8px; font-size:0.72rem; font-weight:700; color:var(--color-text-secondary);">' + h + '</div>';
              }).join('') +
            '</div>' +
            // Grid Columns Area
            '<div class="columns-area" style="display:flex; flex:1; position:relative; height:720px; overflow:hidden;">' +
              // Background Horizontal Hour Lines
              hoursList.map(function(h, i) {
                return '<div style="position:absolute; top:' + (i * 60) + 'px; left:0; right:0; height:1px; background:rgba(0,0,0,0.06); pointer-events:none;"></div>';
              }).join('') +
              // Columns (Days Mon-Sat)
              weekDays.map(function(dd, colIdx) {
                return '<div class="day-column" data-day-idx="' + colIdx + '" data-room="' + room.idx + '" data-date="' + getDateKey(dd) + '" style="flex:1; height:720px; position:relative; border-right:1px solid rgba(0,0,0,0.04); box-sizing:border-box;" onclick="window._onActivityColumnClick(event, ' + colIdx + ', ' + room.idx + ')">' +
                  renderCardsForDay(dd, colIdx, room.idx) +
                '</div>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    // Tabs layout HTML
    var tabsHtml = '<div style="display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap;border-bottom:1px solid rgba(0,0,0,0.08);padding-bottom:12px;">' +
      '<button onclick="window._setActivityTab(\'all\')" style="padding:8px 16px;border-radius:var(--radius-pill);border:none;font-weight:700;font-size:0.75rem;cursor:pointer;transition:all 0.2s;' +
        (window._activeActivityTab === 'all' ? 'background:' + sage + ';color:#fff;' : 'background:rgba(0,0,0,0.04);color:var(--color-text-secondary);') + '">Ver Todos</button>' +
      ROOMS.map(function(room) {
        var isActive = window._activeActivityTab === String(room.idx);
        return '<button onclick="window._setActivityTab(\'' + room.idx + '\')" style="padding:8px 16px;border-radius:var(--radius-pill);border:none;font-weight:700;font-size:0.75rem;cursor:pointer;transition:all 0.2s;' +
          (isActive ? 'background:' + room.color + ';color:#fff;' : 'background:rgba(0,0,0,0.04);color:var(--color-text-secondary);') + '">' + room.label + '</button>';
      }).join('') +
    '</div>';

    // Calculate weekly professional liquidation data
    var weekKey = getDateKey(weekStart);
    var calculatedLiq = calculateLiquidationData();
    var liqState = window._liquidationState[weekKey] || {};

    var profNames = Object.keys(calculatedLiq);
    Object.keys(liqState).forEach(function(name) {
      if (!profNames.includes(name)) {
        profNames.push(name);
      }
    });

    var activeLiqProfs = profNames.filter(function(name) {
      var calc = calculatedLiq[name] || { hours: 0, value: 0 };
      var over = liqState[name] || {};
      var hours = over.hours !== undefined && over.hours !== null ? over.hours : calc.hours;
      return hours > 0 || calc.hours > 0;
    });

    var grandTotalHours = 0;
    var grandTotalAmount = 0;
    var liquidationCardHtml = '';

    liquidationCardHtml += '<div class="card" style="padding:20px 24px; margin-top:20px; border-top: 4px solid ' + sage + ';">' +
      '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px;">' +
        '<div>' +
          '<h3 style="margin:0; font-size:1.1rem; color:var(--color-text-primary); font-family:var(--font-display); display:flex; align-items:center; gap:8px;">' +
            'Liquidación Semanal de Profesionales' +
          '</h3>' +
          '<p style="margin:4px 0 0; font-size:0.75rem; color:var(--color-text-muted);">Listado de profesionales con horas tomadas en la grilla y cálculo estimado de honorarios.</p>' +
        '</div>' +
        '<div>' +
          '<button onclick="window._resetLiquidation(\'' + weekKey + '\')" style="padding:6px 14px; border-radius:var(--radius-pill); border:1px solid rgba(0,0,0,0.08); background:rgba(0,0,0,0.03); color:var(--color-text-secondary); font-size:0.72rem; font-weight:700; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background=\'rgba(0,0,0,0.06)\'" onmouseout="this.style.background=\'rgba(0,0,0,0.03)\'">Restablecer valores</button>' +
        '</div>' +
      '</div>';

    if (activeLiqProfs.length === 0) {
      liquidationCardHtml += '<div style="text-align:center; padding:30px 20px; color:var(--color-text-muted); font-size:0.85rem;">' +
        'No hay profesionales con horas asignadas en esta semana.' +
      '</div>';
    } else {
      var tableRows = activeLiqProfs.map(function(name) {
        var profile = profData.find(function(p) { return p.name === name; }) || {};
        var calc = calculatedLiq[name] || { hours: 0, value: 0 };
        var calcRate = calc.hours > 0 ? (calc.value / calc.hours) : 0;
        var over = liqState[name] || {};
        
        var hours = (over.hours !== undefined && over.hours !== null) ? over.hours : calc.hours;
        var rate = (over.rate !== undefined && over.rate !== null) ? over.rate : calcRate;
        var discount = (over.discount !== undefined && over.discount !== null) ? over.discount : 0;
        
        var total = hours * rate;
        var finalTotal = total - discount;
        if (finalTotal < 0) finalTotal = 0;

        grandTotalHours += hours;
        grandTotalAmount += finalTotal;

        var safeId = name.replace(/[^a-zA-Z0-9]/g, '_');
        var profColor = profile.color || sage;

        return '<tr style="border-bottom:1px solid rgba(0,0,0,0.04);">' +
          '<td style="padding:12px 8px; vertical-align:middle;">' +
            '<div style="display:flex; align-items:center; gap:8px;">' +
              '<div style="width:8px; height:8px; border-radius:50%; background:' + profColor + ';"></div>' +
              '<div>' +
                '<div style="font-size:0.82rem; font-weight:700; color:var(--color-text-primary);">' + name + '</div>' +
                '<div style="font-size:0.65rem; color:var(--color-text-muted);">' + (profile.specialty || 'Profesional') + '</div>' +
              '</div>' +
            '</div>' +
          '</td>' +
          '<td style="padding:12px 8px; text-align:center; vertical-align:middle;">' +
            '<input type="number" class="liq-input liq-hours" data-prof="' + name + '" value="' + hours + '" step="0.5" min="0" oninput="window._onLiquidationInputChange(\'' + name.replace(/'/g, "\\'") + '\', \'' + weekKey + '\')" style="width:65px; text-align:center;">' +
          '</td>' +
          '<td style="padding:12px 8px; text-align:right; vertical-align:middle;">' +
            '<div style="display:inline-flex; align-items:center; gap:4px;">' +
              '<span style="font-size:0.82rem; color:var(--color-text-muted); font-weight:600;">$</span>' +
              '<input type="number" class="liq-input liq-rate" data-prof="' + name + '" value="' + Math.round(rate) + '" min="0" oninput="window._onLiquidationInputChange(\'' + name.replace(/'/g, "\\'") + '\', \'' + weekKey + '\')" style="width:75px; text-align:right;">' +
            '</div>' +
          '</td>' +
          '<td style="padding:12px 8px; text-align:right; vertical-align:middle;">' +
            '<span class="liq-total" id="liq-total-' + safeId + '" style="font-size:0.82rem; font-weight:600; color:var(--color-text-secondary);">' +
              '$' + Math.round(total).toLocaleString('es-AR') +
            '</span>' +
          '</td>' +
          '<td style="padding:12px 8px; text-align:right; vertical-align:middle;">' +
            '<div style="display:inline-flex; align-items:center; gap:4px;">' +
              '<span style="font-size:0.82rem; color:var(--color-text-muted); font-weight:600;">$</span>' +
              '<input type="number" class="liq-input liq-discount" data-prof="' + name + '" value="' + Math.round(discount) + '" min="0" oninput="window._onLiquidationInputChange(\'' + name.replace(/'/g, "\\'") + '\', \'' + weekKey + '\')" style="width:75px; text-align:right;">' +
            '</div>' +
          '</td>' +
          '<td style="padding:12px 8px; text-align:right; vertical-align:middle;">' +
            '<span class="liq-final-total" id="liq-final-' + safeId + '" style="font-size:0.88rem; font-weight:700; color:' + sage + ';">' +
              '$' + Math.round(finalTotal).toLocaleString('es-AR') +
            '</span>' +
          '</td>' +
          '<td style="padding:12px 8px; text-align:center; vertical-align:middle;">' +
            '<button class="liq-wa-btn" onclick="window._triggerRowWhatsApp(\'' + name.replace(/'/g, "\\'") + '\', \'' + (profile.tel || '') + '\')" title="Enviar liquidación por WhatsApp" style="background:none; border:none; cursor:pointer; color:' + sage + '; padding:6px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; transition:all 0.2s;">\
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">\
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.858.002-2.634-1.025-5.11-2.89-6.978-1.866-1.867-4.348-2.895-6.983-2.896-5.442 0-9.87 4.422-9.873 9.86-.001 1.696.442 3.35 1.284 4.81l-.988 3.606 3.692-.969zm10.74-5.321c-.278-.139-1.643-.811-1.897-.904-.253-.093-.438-.139-.623.139-.185.278-.716.904-.877 1.09-.16.185-.322.208-.6.069-.278-.139-1.176-.434-2.242-1.385-.828-.739-1.388-1.652-1.55-1.93-.16-.278-.017-.429.122-.567.126-.124.278-.323.418-.485.139-.161.185-.278.278-.462.093-.185.046-.347-.023-.485-.069-.139-.623-1.501-.853-2.056-.224-.539-.47-.464-.647-.473-.167-.008-.36-.01-.553-.01-.193 0-.507.073-.77.361-.264.288-1.007.984-1.007 2.399 0 1.416 1.03 2.784 1.173 2.977.143.193 2.028 3.098 4.912 4.341.686.296 1.222.473 1.639.605.69.219 1.319.189 1.815.115.553-.083 1.643-.671 1.872-1.32.228-.648.228-1.204.16-1.32-.069-.115-.253-.185-.53-.324z"/>\
              </svg>\
            </button>\
          </td>\
        </tr>';
      }).join('');

      liquidationCardHtml += '<table style="width:100%; border-collapse:collapse; margin-bottom:16px;">' +
        '<thead>' +
          '<tr style="background:var(--bg-card-alt); border-bottom:2px solid rgba(0,0,0,0.06);">' +
            '<th style="padding:10px 8px; text-align:left; font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--color-text-muted);">Profesional</th>' +
            '<th style="padding:10px 8px; text-align:center; font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--color-text-muted); width:85px;">Horas</th>' +
            '<th style="padding:10px 8px; text-align:right; font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--color-text-muted); width:110px;">Valor / Hora</th>' +
            '<th style="padding:10px 8px; text-align:right; font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--color-text-muted); width:100px;">Total</th>' +
            '<th style="padding:10px 8px; text-align:right; font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--color-text-muted); width:110px;">Descuento</th>' +
            '<th style="padding:10px 8px; text-align:right; font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--color-text-muted); width:110px;">Total Final</th>' +
            '<th style="padding:10px 8px; text-align:center; font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--color-text-muted); width:60px;">Acciones</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' + tableRows + '</tbody>' +
      '</table>' +
      '<div style="display:flex; justify-content:flex-end; align-items:center; padding:12px 16px; background:var(--bg-card-alt); border-radius:8px; border:1px solid rgba(0,0,0,0.05); gap:24px;">' +
        '<div style="text-align:right;">' +
          '<div style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:var(--color-text-muted);">Total Horas</div>' +
          '<div id="liq-grand-hours" style="font-size:1.1rem; font-weight:700; color:var(--color-text-primary);">' + grandTotalHours.toFixed(1) + ' hs</div>' +
        '</div>' +
        '<div style="text-align:right; border-left:1px solid rgba(0,0,0,0.08); padding-left:24px;">' +
          '<div style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:var(--color-text-muted);">Liquidación Total</div>' +
          '<div id="liq-grand-amount" style="font-size:1.25rem; font-weight:800; color:' + sage + '; font-family:var(--font-display);">$' + Math.round(grandTotalAmount).toLocaleString('es-AR') + '</div>' +
        '</div>' +
      '</div>';
    }
    liquidationCardHtml += '</div>';

    container.innerHTML = '\
      <style>\
        .act-drag-item{cursor:grab;transition:transform 0.15s,opacity 0.15s;user-select:none;border-radius:6px;}\
        .act-drag-item:hover{transform:translateX(3px);background:rgba(0,0,0,0.02);}\
        .act-drag-item.dragging{opacity:0.4;transform:scale(0.95);}\
        .day-column.drag-over{outline:2.5px dashed ' + sage + ' !important;outline-offset:-2px;background:' + sage + '15 !important;}\
        .act-trash.drag-over-trash{border-color:rgba(200,60,60,0.7) !important;background:rgba(200,60,60,0.08) !important;transform:scale(1.03);}\
        .act-trash.drag-over-trash div{color:rgba(200,60,60,0.9) !important;}\
        .day-column:hover{background:rgba(122,139,111,0.02) !important;}\
        .liq-input {\
          background: var(--bg-card);\
          border: 1px solid rgba(0,0,0,0.08);\
          border-radius: 6px;\
          padding: 6px 8px;\
          font-size: 0.82rem;\
          font-family: var(--font-main);\
          color: var(--color-text-primary);\
          outline: none;\
          transition: all 0.2s;\
        }\
        .liq-input:focus {\
          border-color: ' + sage + ';\
          box-shadow: 0 0 0 3px ' + sage + '22;\
        }\
        .liq-input::-webkit-outer-spin-button,\
        .liq-input::-webkit-inner-spin-button {\
          -webkit-appearance: none;\
          margin: 0;\
        }\
        .liq-input[type=number] {\
          -moz-appearance: textfield;\
        }\
        .liq-wa-btn:hover {\
          background: ' + sage + '1c !important;\
          color: #25D366 !important;\
          transform: scale(1.1);\
        }\
      </style>\
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;">\
        <div class="dashboard-header" style="margin-bottom:0;">\
          <h1>Consultorios</h1>\
          <p class="dashboard-subtitle">ASIGNACIÓN SEMANAL DE PROFESIONALES Y TALLERES POR ESPACIO</p>\
        </div>\
      </div>\
      \
      <!-- Proyección Financiera Semanal Banner -->\
      <div class="card" style="padding:16px 20px; margin-bottom:24px; background: ' + sage + '08; border-left: 4px solid ' + sage + '; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">\
        <div>\
          <h3 style="margin:0; font-size:1rem; color:var(--color-text-primary);">Proyección Financiera Semanal</h3>\
          <p style="margin:4px 0 0; font-size:0.75rem; color:var(--color-text-secondary);">Ingresos proyectados calculados en tiempo real según la ocupación y tarifas de los consultorios.</p>\
        </div>\
        <div style="display:flex; gap:28px;">\
          <div style="text-align:right;">\
            <div style="font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--color-text-muted);">Ingreso Semanal Estimado</div>\
            <div style="font-size:1.35rem; font-weight:700; color:' + sage + '; font-family:var(--font-display);">$' + totalWeeklyRevenue.toLocaleString('es-AR') + '</div>\
          </div>\
          <div style="text-align:right;">\
            <div style="font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--color-text-muted);">Ingreso Potencial Máximo</div>\
            <div style="font-size:1.35rem; font-weight:700; color:var(--color-text-primary); font-family:var(--font-display);">$' + totalWeeklyPotential.toLocaleString('es-AR') + '</div>\
          </div>\
          <div style="text-align:right;">\
            <div style="font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--color-text-muted);">Eficiencia del Espacio</div>\
            <div style="font-size:1.35rem; font-weight:700; color:' + terracotta + '; font-family:var(--font-display);">' + totalWeeklyPct + '%</div>\
          </div>\
        </div>\
      </div>\
      \
      <!-- Tabs (Solapas) Navigation -->\
      ' + tabsHtml + '\
      \
      <!-- Week Selector (Moved right above the weekly grid / agenda) -->\
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">\
        <div style="display:flex;align-items:center;background:var(--bg-card);border-radius:var(--radius-pill);border:1px solid rgba(0,0,0,0.08);overflow:hidden;box-shadow:var(--shadow-card);">\
          <button id="act-week-prev" style="padding:8px 14px;background:none;border:none;cursor:pointer;font-size:1.1rem;color:var(--color-text-muted);">‹</button>\
          <span style="padding:0 16px;font-size:0.82rem;font-weight:700;color:var(--color-text-primary);white-space:nowrap;">' + weekLabel + '</span>\
          <button id="act-week-next" style="padding:8px 14px;background:none;border:none;cursor:pointer;font-size:1.1rem;color:var(--color-text-muted);">›</button>\
        </div>\
      </div>\
      \
      <div style="display:grid;grid-template-columns:1fr 240px;gap:20px;align-items:start;">\
        <div>' + roomGridsHtml + liquidationCardHtml + '</div>\
        <div style="display:flex;flex-direction:column;gap:14px;position:sticky;top:20px;">\
          <div id="act-trash" class="act-trash" style="padding:14px;border:2px dashed rgba(200,60,60,0.2);border-radius:12px;text-align:center;transition:all 0.2s;background:rgba(200,60,60,0.02);">\
            <div style="display:flex;align-items:center;justify-content:center;gap:8px;">\
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(200,60,60,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>\
              <span style="font-size:0.72rem;font-weight:600;color:rgba(200,60,60,0.5);">Arrastrá aquí para eliminar</span>\
            </div>\
          </div>\
          <div class="card" style="padding:16px 18px;">\
            <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:' + sage + ';margin-bottom:10px;">Profesionales <span style="font-weight:400;color:var(--color-text-muted);font-size:0.6rem;margin-left:2px;">arrastrá a la grilla</span></div>\
            ' + activeProfessionals.map(function(p, i) { return '\
              <div class="act-drag-item" draggable="true" data-idx="p-' + i + '" style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-bottom:1px solid rgba(0,0,0,0.04);margin-bottom:1px;">\
                <div style="width:5px;height:20px;border-radius:3px;background:' + (p.color || sage) + ';flex-shrink:0;"></div>\
                <div style="flex:1;min-width:0;">\
                  <div style="font-size:0.75rem;font-weight:600;color:var(--color-text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + p.name + '</div>\
                  <div style="font-size:0.62rem;color:var(--color-text-muted);">' + p.specialty + '</div>\
                </div>\
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="3"><circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/></svg>\
              </div>'; }).join('') + '\
          </div>\
          <div class="card" style="padding:16px 18px;">\
            <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:' + terracotta + ';margin-bottom:10px;">Talleres <span style="font-weight:400;color:var(--color-text-muted);font-size:0.6rem;margin-left:2px;">arrastrá a la grilla</span></div>\
            ' + activeWorkshops.map(function(w, i) { return '\
              <div class="act-drag-item" draggable="true" data-idx="w-' + i + '" style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-bottom:1px solid rgba(0,0,0,0.04);margin-bottom:1px;">\
                <div style="width:5px;height:20px;border-radius:3px;background:' + (w.color || terracotta) + ';flex-shrink:0;"></div>\
                <div style="flex:1;min-width:0;">\
                  <div style="font-size:0.75rem;font-weight:600;color:var(--color-text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + w.name + '</div>\
                  <div style="font-size:0.62rem;color:var(--color-text-muted);">' + w.schedule + '</div>\
                </div>\
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="3"><circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/></svg>\
              </div>'; }).join('') + '\
          </div>\
          <div class="card" style="padding:14px 18px;background:' + sage + '08;border:1px dashed ' + sage + '25;">\
            <div style="font-size:0.7rem;font-weight:700;color:' + sage + ';margin-bottom:4px;">Cómo usar</div>\
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
      });

      item.addEventListener('dragend', function() {
        item.classList.remove('dragging');
        window._actDragPayload = null;
        var trash = container.querySelector('#act-trash');
        if (trash) trash.classList.remove('drag-over-trash');
      });
    });

    // Drop targets (columns for dragging from sidebar)
    container.querySelectorAll('.day-column').forEach(function(col) {
      col.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        col.classList.add('drag-over');
      });
      col.addEventListener('dragleave', function() {
        col.classList.remove('drag-over');
      });
      col.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        col.classList.remove('drag-over');
        var payload = window._actDragPayload;
        if (!payload) return;

        var roomIdx = parseInt(col.getAttribute('data-room'), 10);
        var dateKey = col.getAttribute('data-date');

        var rect = col.getBoundingClientRect();
        var clickY = e.clientY - rect.top;
        var clickedMin = Math.round(clickY / 15) * 15; // snap to 15 min
        var startMin = 8 * 60 + clickedMin;
        var startStr = window._minutesToTime(startMin);

        var service = null;
        var price = null;
        var duration = 60;

        if (payload.type === 'profesional') {
          var prof = (window._profData || []).find(function(p) { return p.name === payload.name; });
          if (prof) {
            var services = getDefaultServicesForProf(prof);
            if (services && services.length > 0) {
              service = services[0];
              price = service.price;
              duration = service.duration || 60;
            }
          }
        }

        var endMin = startMin + duration;
        var endStr = window._minutesToTime(endMin);

        if (!window._agendaCustomSlots) window._agendaCustomSlots = {};
        if (!window._agendaCustomSlots[dateKey]) window._agendaCustomSlots[dateKey] = {};

        var newKey = startStr + '-' + roomIdx;
        window._agendaCustomSlots[dateKey][newKey] = {
          name: payload.name,
          type: payload.type,
          patient: null,
          start: startStr,
          end: endStr,
          roomIdx: roomIdx,
          service: service,
          price: price
        };

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
        window._actDragPayload = null;
        renderAll();
      });
    }
  }

  renderAll();
};
