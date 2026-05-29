# Plan de Implementación — App Espacio Alvarado

> Transformar la app genérica NUWO en el **panel de gestión de Espacio Alvarado** para Sofi, integrando visualmente los 4 módulos de la propuesta de automatización.

---

## Contexto

Tenemos 3 piezas que convergen:

| Pieza | Qué es | Dónde está |
|---|---|---|
| **Propuesta Sofi** | 4 módulos de automatización (WhatsApp agent, captación profesionales, disponibilidad, panel admin) | [propuesta_cliente_sofi.md](file:///Users/natalia/.gemini/antigravity/brain/82bff74b-7a88-47a9-913d-673e637d1f6f/propuesta_cliente_sofi.md) |
| **App frontend** | 8 componentes HTML/CSS/JS con datos mock | [/Users/natalia/Desktop/Nowo](file:///Users/natalia/Desktop/Nowo) |
| **Manual de marca** | Paleta sage/terracotta/cream + tipografía Cormorant + DM Sans | [manual_de_marca_espacio_alvarado.md](file:///Users/natalia/.gemini/antigravity/brain/c8262657-e9e9-4984-9c22-6d165acae731/manual_de_marca_espacio_alvarado.md) |

**Objetivo:** Que la app se vea como el producto terminado de Sofi — con su marca, sus datos, sus módulos claramente nombrados — para usar como **demo presentable al cliente**.

---

## Mapeo Módulo ↔ Componente

Esta es la traducción directa entre lo que prometimos en la propuesta y lo que muestra la app:

| Módulo Propuesta | Componente App Actual | Nuevo Nombre en App | Qué muestra |
|---|---|---|---|
| **Panel Admin (Mod. 4)** | `Dashboard` + `SmartWidgets` | **Inicio** | Vista admin de Sofi: estado de los 4 consultorios y del Hall, turnos del día, profesionales activos, métricas rápidas |
| **Agente WhatsApp (Mod. 1)** | `AssistantDashboard` + `WhatsAppViewer` | **Asistente IA** | Conversaciones del bot con pacientes (incluyendo reserva de turnos individuales y grupales/talleres en el Hall), agenda, seguimiento de turnos |
| **Disponibilidad (Mod. 3)** | `HourExchange` | **Consultorios** | Disponibilidad de los 4 consultorios y del Hall, qué profesional tiene cada slot, agenda de talleres con capacidad máxima X |
| **Captación Profesionales (Mod. 2)** | `NUWOConnect` | **Profesionales** | Directorio de los 17 profesionales + nuevos interesados capturados por el bot, con ficha editable y descripción para el bot |
| **Analytics** | `AnalyticsDashboard` | **Finanzas** | Ocupación de consultorios y Hall, ingresos, horas facturadas, impacto del bot |
| **Videoconsulta** | `Telemedicine` | **Videoconsulta** | Sesiones remotas de profesionales con pacientes (Fase 2 pero ya mostrable) |
| **Asistencia** | `PanicButton` | **Asistencia** | Pedido de ayuda operativa (limpieza, insumos, mantenimiento) — se mantiene |

---

## Cambios Propuestos

### 1. Rebranding Global (Marca Espacio Alvarado)

> [!IMPORTANT]
> Estos cambios aplican transversalmente a todos los archivos y prohíben estrictamente el uso de cualquier emoji en toda la interfaz (excepto en mensajes de chat del bot por ser canal externo).

#### [MODIFY] [design-system.css](file:///Users/natalia/Desktop/Nowo/css/design-system.css)
- Reemplazar paleta gold → sage green como acento primario
- Cambiar `--font-display` a Cormorant Garamond
- Ajustar `--bg-main` a `#F5F0E8`
- Actualizar todas las variables de acento, nav active, highlights

#### [MODIFY] [styles.css](file:///Users/natalia/Desktop/Nowo/css/styles.css)
- Actualizar colores hardcodeados (`#b8944f` → `#7A8B6F`)
- Ajustar hover de cards a borde sage

#### [MODIFY] [index.html](file:///Users/natalia/Desktop/Nowo/index.html)
- Cambiar `<title>` a "Espacio Alvarado — Gestión de espacios holísticos"
- Fonts ya están linkeadas (Cormorant Garamond + DM Sans) ✅

#### [MODIFY] [app.js](file:///Users/natalia/Desktop/Nowo/js/app.js)
- Cambiar nombre de marca: `NUWO` → `Espacio Alvarado`
- Cambiar logo sub: `Coworking` → `Holístico`
- Cambiar usuario demo: `Dra. Elena Rossi` → `Sofi` (administradora)
- Actualizar subtítulo: "Espacio holístico & consultorios · Alvarado"
- Actualizar items del sidebar con los nuevos nombres de sección
- Cambiar colores SVG del logo icon de `#b8944f` → `#7A8B6F`

#### [MODIFY] [icons.js](file:///Users/natalia/Desktop/Nowo/js/icons.js)
- Actualizar colores de referencia si hay hardcodeados

---

### 2. Dashboard → Panel Admin de Sofi

#### [MODIFY] [SmartWidgets.js](file:///Users/natalia/Desktop/Nowo/js/components/SmartWidgets.js)

Los 3 widgets actuales se reemplazan por widgets alineados al negocio de Sofi:

| Widget Actual | Nuevo Widget | Datos Mock |
|---|---|---|
| AI Smart Booking | **Estado de Consultorios** | 5 cards: Consultorios A, B, C, D (ocupación actual) + Hall (Clase de Yoga activa 12/15) |
| Control de Ambiente | **Bot WhatsApp — Hoy** | "12 conversaciones · 8 turnos agendados · 2 derivados a vos · 96% tasa de respuesta" |
| Puntos NUWO | **Próximos Turnos** | Lista de próximos turnos con nombre paciente, profesional, hora y consultorio. La tarjeta Próximos Turnos se extiende hasta alinearse al bottom del contenedor izquierdo. |

#### [MODIFY] Dashboard en [app.js](file:///Users/natalia/Desktop/Nowo/js/app.js)
- Saludo: "Bienvenida, Sofi"
- Subtítulo: "Espacio holístico & consultorios · Alvarado"
- Card resumen: "Hoy: 12 turnos programados en 4 consultorios. 3 nuevos pacientes del bot."

---

### 3. Asistente IA (Módulo 1 — Agente WhatsApp)

#### [MODIFY] [AssistantDashboard.js](file:///Users/natalia/Desktop/Nowo/js/components/AssistantDashboard.js)

Transformar de "agenda de profesional individual" a **panel del bot de WhatsApp de Sofi**:

- **Título:** "Asistente IA — Conversaciones del Bot"
- **Columna izquierda:** "Turnos agendados por el bot hoy"
  - Mock: 5 turnos con paciente, profesional asignado, horario, consultorio, estado
  - Cada turno tiene botón "Ver Chat" que abre el WhatsAppViewer
- **Columna derecha:** "Conversaciones activas"
  - Mock: 3 conversaciones en curso (Carolina Ruiz - Busca psicólogo, Tomás Blanco - Consulta por yoga, Patricia Vega - Reclamo por turno)
  - Cada conversación activa tiene su propio botón "Ver Chat" que abre el chat respectivo en WhatsAppViewer.
  - Badge de "Requiere atención" / "Escalado a Sofi" en color de advertencia naranja.

#### [MODIFY] [WhatsAppViewer.js](file:///Users/natalia/Desktop/Nowo/js/components/WhatsAppViewer.js)

Reemplazar conversación mock con flujos específicos según el paciente seleccionado:

- **Flujo María Gomez (Default / Psicología):**
  - Mía el bot ofrece terapeutas (Daniel Rodríguez, María García), agenda a María el martes a las 17:00 hs en el Consultorio C.
- **Flujo Tomás Blanco (Clases/Talleres en el Hall):**
  - Tomás consulta por yoga grupal en el Hall.
  - Mía ofrece la clase del Prof. Lucas Méndez, detalla que es en el Hall, a las 18:00 hs hoy, explica el enfoque de la clase y menciona la capacidad máxima (15 personas) y disponibilidad (quedan 3 cupos).
  - Tomás confirma, y Mía lo agenda (actualizando la capacidad a 13/15).
- **Flujo Carolina Ruiz (Consulta general):**
  - Conversación inicial de Carolina buscando psicólogo clínico y Mía presentándole opciones de psicólogos activos.

---

### 4. Consultorios (Módulo 3 — Disponibilidad & Hall)

#### [MODIFY] [HourExchange.js](file:///Users/natalia/Desktop/Nowo/js/components/HourExchange.js)

Transformar de "intercambio de horas genérico" a **vista de disponibilidad por consultorio y agenda del Hall**:

- **Título:** "Consultorios — Disponibilidad"
- **5 cards superiores** (una por espacio):
  - Consultorios A, B, C, D (estado de ocupación)
  - Hall: "Planta baja · Clases y Talleres grupales" — 12/15 cupos ocupados en clase actual.
- **Grilla de disponibilidad horaria:** Añadir la 5ª columna para el "Hall" mostrando las clases del día ("Clase de Yoga (12/15)", "Meditación (8/12)", "Taller Cuencos (14/15)").
- **Sección: Gestión de Talleres y Clases (Hall):**
  - Lista de talleres activos en el Hall (Yoga Terapéutico, Taller de Cuencos Tibetanos, Meditación & Mindfulness).
  - Muestra instructor, horario, capacidad actual/máxima y descripción detallada del taller.
  - Cada taller tiene un botón **"Editar"** que abre un modal configurable.
  - En el modal de edición, Sofi puede modificar el nombre, instructor, horario, inscriptos actuales, cupo máximo (X personas), y el **detalle y descripción del taller para el Agente IA**.
  - Al hacer click en "Guardar cambios", los datos se actualizan dinámicamente en el estado global `window._workshopsData` y la vista se re-renderiza inmediatamente para reflejar la nueva capacidad y descripciones.

---

### 5. Profesionales (Módulo 2 — Captación + Directorio)

#### [MODIFY] [NUWOConnect.js](file:///Users/natalia/Desktop/Nowo/js/components/NUWOConnect.js)

Dividir en 2 secciones:

**Sección A — "Profesionales Activos" (17)**
- Título: "Equipo Espacio Alvarado"
- Grid de tarjetas con: nombre, especialidad (badge sage), horarios base, consultorio asignado, Instagram
- Datos mock con profesionales holísticos reales:
  - Lic. Daniel Rodríguez — Psicología Holística · LUN/MIE 14-20
  - Dra. Marina Fossati — Nutrición Integrativa · MAR/JUE 9-14
  - Lic. Camila Torres — Terapia Gestalt · LUN/VIE 10-16
  - Prof. Lucas Méndez — Yoga Terapéutico · MAR/JUE/SAB 8-12
  - Dra. Valentina Ruiz — Reiki & Sanación Energética · MIE/VIE 15-20
  - (y más hasta completar 8-10 visibles con "Ver todos →")
- Botones: "Ver perfil" / "Editar" (para Sofi como admin)

**Sección B — "Profesionales Interesados" (capturados por el bot)**
- Título: "Nuevos interesados" + badge "3 sin revisar"
- Cards con: nombre, teléfono, Instagram, especialidad, fecha de contacto, botón "Contactar" / "Descartar"
- Mock:
  - Dr. Carlos López — Kinesiólogo deportivo · Hace 2 días · ⏳ Pendiente
  - Lic. Ana Belén Sosa — Coach ontológico · Hace 5 días · ✅ Contactada

---

### 6. Finanzas (Analytics rebrandeado)

#### [MODIFY] [AnalyticsDashboard.js](file:///Users/natalia/Desktop/Nowo/js/components/AnalyticsDashboard.js)

Cambiar perspectiva de "profesional individual" a **vista de admin/dueña del espacio**:

- **KPIs:**
  - Ingresos mensuales: $680.000 (horas de consultorio vendidas)
  - Ocupación general: 72% (+5% vs mes anterior)
  - Profesionales activos: 17/20 (85% capacidad)
  - Turnos vía bot: 84 este mes (+23 vs manual)
- **Gráfico:** Ocupación por consultorio (barras) en vez de revenue personal
- **Tabla:** "Top profesionales por horas" — ranking de quién más factura
- **Card insight:** "El bot agendó 84 turnos este mes, ahorrándote ~42hs de gestión manual. Equivalente a $126.000 en costo de recepcionista."

---

### 7. Componentes que se mantienen con ajustes menores

#### [MODIFY] [Telemedicine.js](file:///Users/natalia/Desktop/Nowo/js/components/Telemedicine.js)
- Cambiar overlay de "NUWO" → "Espacio Alvarado"
- Mantener funcionalidad (videoconsulta para profesionales)
- Nota visual: "Fase 2 — Próximamente"

#### [MODIFY] [PanicButton.js](file:///Users/natalia/Desktop/Nowo/js/components/PanicButton.js)
- Solo cambiar colores de acento (`#b8944f` → `#7A8B6F`)
- Las 4 categorías (Limpieza, Seguridad, Insumos, Mantenimiento) aplican perfecto

---

## Navegación Final del Sidebar

| Actual | Nuevo | Icono |
|---|---|---|
| Inicio | **Inicio** | `home` |
| Asistente | **Asistente IA** | `message-circle` |
| Consultorios | **Consultorios** | `calendar` |
| Comunidad | **Profesionales** | `users` |
| Finanzas | **Finanzas** | `dollar-sign` |
| Video | **Videoconsulta** | `video` |
| Asistencia (bottom) | **Asistencia** | `bell` |

---

## Open Questions

> [!IMPORTANT]
> **¿Rebranding completo o dual?**
> ¿La app se llama "Espacio Alvarado" directamente, o querés que mantenga "Nowo" como nombre de plataforma y "Espacio Alvarado" como cliente? Ejemplo:
> - Opción A: Logo dice **"Espacio Alvarado"** (100% personalizado para Sofi)
> - Opción B: Logo dice **"Nowo"** con subtítulo "Powered by Nowo · Espacio Alvarado"

> [!IMPORTANT]
> **¿Cantidad de profesionales en el mock?**
> Tenemos 17 profesionales reales pero mostrar 17 tarjetas es mucho para una demo. ¿Muestro 6-8 visibles + un "Ver todos (17)" o los 17 completos?

> [!WARNING]
> **La conversación del WhatsApp es el diferenciador clave.** El diálogo mock que puse es copiado literalmente de la propuesta que Sofi ya vio. Cuando lo vea en la app, reconoce inmediatamente lo que pidió. Esto es intencional.

---

## Verification Plan

### Visual
- Abrir `localhost:8080` y verificar que:
  - La paleta sage/terracotta/cream se aplica consistentemente
  - El sidebar dice "Espacio Alvarado" con Cormorant Garamond
  - Todas las secciones reflejan el negocio de Sofi

### Funcional
- Navegar todas las 7 secciones y verificar que los datos mock son coherentes entre sí (mismos nombres de profesionales, mismos consultorios)
- Abrir el WhatsApp viewer y verificar que la conversación del bot es la de la propuesta
- Verificar que no queda ninguna mención a "NUWO" en la UI

### Consistencia con propuesta
- Cruzar cada módulo de [propuesta_cliente_sofi.md](file:///Users/natalia/.gemini/antigravity/brain/82bff74b-7a88-47a9-913d-673e637d1f6f/propuesta_cliente_sofi.md) y verificar que tiene su representación visual en la app
