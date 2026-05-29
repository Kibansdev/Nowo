# Espacio Alvarado — Panel de Gestión Holístico

Panel administrativo para **Espacio Alvarado**, un centro holístico con 4 consultorios + Hall.  
Diseñado para que Sofi (administradora) gestione profesionales, talleres, agenda y finanzas.

---

## Cómo ejecutar en local

**No se necesita instalar nada.** Es HTML + CSS + JS vanilla, sin frameworks ni dependencias.

### Opción 1: Servidor Python (recomendado)
```bash
cd /ruta/a/Nowo
python3 -m http.server 3000
```
Abrir `http://localhost:3000` en el navegador.

### Opción 2: Servidor Node
```bash
cd /ruta/a/Nowo
npx -y serve .
```

### Opción 3: Abrir directamente
Doble click en `index.html` (algunas funciones de fonts pueden no cargar sin servidor).

---

## Estructura del proyecto

```
Nowo/
├── index.html                          # Punto de entrada
├── README.md                           # Este archivo
├── css/
│   ├── design-system.css               # Variables, tokens, tipografía
│   └── styles.css                      # Estilos de componentes y layout
├── js/
│   ├── app.js                          # Router, sidebar, inicialización
│   ├── icons.js                        # Iconos SVG inline (Feather)
│   └── components/
│       ├── HourExchange.js             # Inicio: Agenda del día + talleres activos
│       ├── WorkshopsManager.js         # Talleres: CRUD + sesiones + modal
│       ├── NUWOConnect.js              # Profesionales: directorio + fichas
│       ├── AnalyticsDashboard.js       # Finanzas: KPIs + tabla detallada
│       ├── AssistantDashboard.js       # Asistente IA: vista WhatsApp
│       ├── WhatsAppViewer.js           # Visor de conversaciones WhatsApp
│       ├── SmartWidgets.js             # Widgets inteligentes
│       ├── PanicButton.js             # Botón de emergencia (Sofi)
│       └── Telemedicine.js             # (legacy, no activo en sidebar)
└── docs/
    ├── documento_tecnico_programador.md  # Spec técnica completa
    ├── implementation_plan.md            # Plan de implementación
    ├── manual_de_marca.md                # Manual de marca visual
    ├── propuesta_cliente_sofi.md         # Propuesta comercial
    ├── propuesta_original.md             # Propuesta original
    ├── walkthrough.md                    # Resumen de cambios realizados
    ├── task.md                           # Tareas pendientes
    └── *.png                             # Assets de branding
```

---

## Módulos principales

### 1. Inicio (Agenda del día)
**Archivo:** `js/components/HourExchange.js`

- Tabla diaria con 5 columnas: Consultorio A, B, C, D, Hall
- Navegación por día (anterior/siguiente/hoy)
- Celdas vacías clickeables → Modal "Asignar horario"
- Modal con selector Profesional / Taller + hora inicio/fin
- Slots custom guardados en `window._agendaCustomSlots`
- Debajo: cards de talleres activos

### 2. Talleres y Clases
**Archivo:** `js/components/WorkshopsManager.js`

- Cards de talleres con nombre, cupo, descripción, toggle activo/pausado
- Botón "+ Agregar sesión" → Modal con fecha, hora inicio/fin, espacio, precio
- Inscriptos por sesión (no por taller) con mini barra de progreso
- CRUD: Crear Taller, Editar Ficha, Eliminar Taller
- Espacios disponibles: Hall, Consultorio 1–4, Sala Común, Terraza

### 3. Profesionales
**Archivo:** `js/components/NUWOConnect.js`

- Directorio de profesionales activos
- Ficha editable: nombre, especialidad, horarios, consultorio, contacto
- Descripción para el Agente IA (lo que el bot dice al paciente)
- Campo `scheduleSlots` con estructura: `{ days, from, to }`

### 4. Finanzas
**Archivo:** `js/components/AnalyticsDashboard.js`

- KPIs: Ingresos consultorios, ingresos talleres, ocupación, turnos IA
- Tabla detallada por consultorio con profesional y pacientes
- Revenue de talleres calculado desde sesiones

### 5. Asistente IA
**Archivos:** `AssistantDashboard.js` + `WhatsAppViewer.js`

- Simulación de conversaciones WhatsApp del bot "Mía"
- Flujos de reserva, consultas, escalamiento a Sofi

---

## Estado de datos (en memoria)

Los datos viven en variables globales `window.*` (no hay backend):

| Variable | Descripción |
|---|---|
| `window._workshopsData` | Array de talleres con sesiones |
| `window._profData` | Array de profesionales |
| `window._agendaDate` | Fecha actual de la agenda |
| `window._agendaCustomSlots` | Slots asignados manualmente `{ dateKey: { 'HH:MM-roomIdx': { name, type } } }` |
| `window._roomsData` | Datos de consultorios |

---

## Paleta de colores

| Color | Hex | Uso |
|---|---|---|
| Sage Green | `#7A8B6F` | Primario, botones, badges positivos |
| Terracotta | `#C4956A` | Acento, talleres, precios |
| Warm Cream | `#FAF8F5` | Background general |
| Card White | `#FFFFFF` | Cards y modales |

**Tipografía:** Cormorant Garamond (headings) + DM Sans (body)

---

## Para el programador

1. **Sin build step**: todo es vanilla JS, no hay npm/webpack/bundler
2. **Cache busting**: los scripts tienen `?v=20260527b` en index.html, actualizar al hacer cambios
3. **Datos mock**: todo es datos estáticos. Para conectar a backend, reemplazar las inicializaciones `window._*Data` con fetch a API
4. **Modales**: se crean dinámicamente con `document.createElement` y se insertan en `document.body`
5. **Routing**: basado en `store.currentPage`, se cambia con `navigateTo()` en app.js
6. **Sin dependencias externas** excepto Google Fonts (CDN)
