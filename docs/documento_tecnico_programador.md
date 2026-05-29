# Documento Técnico — Automatización Coworking
**Proyecto:** Sistema de gestión automatizada para espacio de coworking  
**Versión:** 1.0  
**Fecha:** 26 de mayo de 2026  
**Audiencia:** Equipo de desarrollo  
**Presupuesto de desarrollo:** USD 1.200 (~38-48 horas)

---

## 1. Contexto del Proyecto

### Negocio
- Espacio de coworking con **4 consultorios** de salud/bienestar
- **17 profesionales** activos que alquilan horas de consultorio
- Captación de profesionales ya resuelta (Meta Ads)
- **Nuevo objetivo:** captar pacientes vía Meta Ads → WhatsApp

### Problema técnico a resolver
Construir un sistema que:
1. Reciba leads de Meta por WhatsApp y los convierta en turnos agendados
2. Consulte disponibilidad real de profesionales y consultorios
3. Permita a profesionales gestionar su agenda
4. Dé a la dueña (Sofi) control sobre la configuración del sistema

---

## 2. Arquitectura General

```
┌──────────────┐
│  META ADS    │
│  (Click-to-  │
│   WhatsApp)  │
└──────┬───────┘
       │ Webhook
       ▼
┌──────────────────┐      ┌────────────────────┐
│  WHATSAPP CLOUD  │◄────▶│  n8n (Orquestador) │
│  API (Meta)      │      │  Self-hosted VPS    │
└──────────────────┘      └────────┬───────────┘
                                   │
                    ┌──────────────┼──────────────────┐
                    │              │                   │
                    ▼              ▼                   ▼
           ┌───────────────┐ ┌──────────┐   ┌──────────────────┐
           │ GEMINI / GPT  │ │ GOOGLE   │   │     NOTION       │
           │ (LLM Agent)   │ │ CALENDAR │   │  (Base de datos) │
           │               │ │ API      │   │                  │
           └───────────────┘ └──────────┘   └──────────────────┘
```

### Stack Tecnológico

| Componente | Tecnología | Justificación |
|---|---|---|
| **Canal de mensajería** | WhatsApp Cloud API (Meta) | Gratuito, oficial, confiable. Costo por conversación |
| **Orquestador de flujos** | **A definir** (ver sección 8.4) | Opciones: n8n Cloud (USD 20/mes), Make (USD 9-16/mes), custom Node.js. Evaluar estabilidad |
| **LLM / Agente IA** | Gemini 2.0 Flash (preferido) o GPT-4o-mini | Bajo costo por token, buena calidad conversacional, function calling nativo |
| **Base de datos / Panel admin** | Notion API | La cliente ya usa Notion. Interfaz superior a Sheets. API oficial con nodo nativo. Sin costo adicional |
| **Gestión de agenda** | Google Calendar API | Sin costo, familiar para usuarios, sincronización móvil nativa |
| **Hosting** | VPS básico o cloud managed | Depende del orquestador elegido. USD 5-20/mes |

---

## 3. Modelo de Datos (Notion Databases)

### Hoja: `profesionales`

| Campo | Tipo | Ejemplo | Notas |
|---|---|---|---|
| `id` | número auto | 1 | Identificador único |
| `nombre` | texto | "Lic. María García" | Nombre completo con título |
| `especialidad` | texto | "Psicología" | Debe coincidir con hoja `servicios` |
| `telefono` | texto | "+5491112345678" | Formato internacional con + |
| `instagram` | texto | "@lic.garcia" | Opcional |
| `email` | texto | "maria@gmail.com" | Email del profesional (para compartir calendar) |
| `calendar_id` | texto | "abc123@group.calendar.google.com" | ID del calendar creado BAJO LA CUENTA DE SOFI |
| `consultorio` | número | 2 | Número de consultorio asignado (1-4) |
| `horarios_base` | texto | "LUN 9-13, MIE 14-18, VIE 9-13" | Horarios regulares |
| `activo` | booleano | TRUE | Para desactivar sin borrar |
| `descripcion` | texto | "Especialista en TCC..." | Breve descripción para el agente |

### Hoja: `servicios`

| Campo | Tipo | Ejemplo |
|---|---|---|
| `id` | número auto | 1 |
| `nombre` | texto | "Psicología" |
| `descripcion` | texto | "Sesiones individuales de psicoterapia..." |
| `duracion_min` | número | 50 |
| `activo` | booleano | TRUE |

### Hoja: `consultorios`

| Campo | Tipo | Ejemplo |
|---|---|---|
| `id` | número (1-4) | 1 |
| `nombre` | texto | "Consultorio A" |
| `horario_apertura` | texto | "08:00" |
| `horario_cierre` | texto | "20:00" |
| `dias_habiles` | texto | "LUN,MAR,MIE,JUE,VIE,SAB" |
| `activo` | booleano | TRUE |

### Hoja: `turnos`

| Campo | Tipo | Ejemplo |
|---|---|---|
| `id` | número auto | 1 |
| `fecha` | fecha | 2026-06-03 |
| `hora` | texto | "17:00" |
| `profesional_id` | número | 5 |
| `consultorio_id` | número | 2 |
| `paciente_nombre` | texto | "Juan Pérez" |
| `paciente_telefono` | texto | "+5491198765432" |
| `servicio` | texto | "Psicología" |
| `estado` | texto | "confirmado" |
| `fecha_creacion` | timestamp | 2026-05-26T14:30:00 |
| `origen` | texto | "whatsapp_bot" |
| `calendar_event_id` | texto | "abc123xyz" |

### Hoja: `profesionales_interesados`

| Campo | Tipo | Ejemplo |
|---|---|---|
| `id` | número auto | 1 |
| `nombre` | texto | "Dr. Carlos López" |
| `telefono` | texto | "+5491155555555" |
| `instagram` | texto | "@dr.lopez" |
| `descripcion` | texto | "Kinesiólogo deportivo, 5 años de exp." |
| `fecha_contacto` | timestamp | 2026-05-26T14:30:00 |
| `estado` | texto | "pendiente" |
| `notas` | texto | "Interesado en turno tarde" |

### Hoja: `config`

| Clave | Valor | Descripción |
|---|---|---|
| `nombre_espacio` | "Espacio Sofi" | Para personalizar mensajes |
| `direccion` | "Av. Corrientes 1234, CABA" | Para enviar al paciente |
| `telefono_sofi` | "+5491100000000" | Para escalamiento |
| `duracion_default_min` | 50 | Duración default si no está en servicio |
| `anticipacion_min_horas` | 2 | No agendar con menos de 2h de anticipación |
| `dias_adelanto_max` | 30 | No agendar a más de 30 días |
| `llm_provider` | "gemini" | "gemini" o "openai" — permite cambiar proveedor |
| `llm_model` | "gemini-2.0-flash" | Modelo específico a usar |

### Hoja: `personalidad`

> **Propósito clave:** Esta hoja permite a Sofi modificar cómo habla el bot SIN tocar código ni n8n. El system prompt se construye dinámicamente leyendo estos valores.

| Clave | Valor | Descripción |
|---|---|---|
| `nombre_asistente` | "Mía" | Nombre del asistente virtual |
| `tono` | "cálida, profesional, empática" | Adjetivos que definen el tono |
| `saludo_inicial` | "¡Hola! 😊 Soy Mía, la asistente del Espacio Sofi..." | Primer mensaje al contacto |
| `idioma` | "español rioplatense, voseo" | Variante lingüística |
| `reglas_extra` | "No dar consejos médicos. No inventar horarios." | Reglas personalizadas de Sofi |
| `mensaje_sin_disponibilidad` | "En este momento no tengo horarios disponibles para..." | Qué decir si no hay turnos |
| `mensaje_despedida` | "¡Gracias por contactarnos! Te esperamos 😊" | Cierre de conversación |
| `mensaje_escalamiento` | "Te voy a comunicar con Sofi para que te ayude personalmente" | Cuando escala |
| `info_extra` | "Estacionamiento disponible. Accesible en silla de ruedas." | Info adicional que el bot puede mencionar |

**Implementación en n8n:** El workflow lee esta hoja al inicio de cada conversación y la inyecta en el system prompt del LLM:

```
System Prompt = TEMPLATE_BASE
  .replace("{NOMBRE}", personalidad.nombre_asistente)
  .replace("{TONO}", personalidad.tono)
  .replace("{SALUDO}", personalidad.saludo_inicial)
  .replace("{REGLAS}", personalidad.reglas_extra)
  + "\nServicios: " + [datos de hoja servicios]
  + "\nProfesionales: " + [datos de hoja profesionales]
  + "\nInfo adicional: " + personalidad.info_extra
```

---

## 4. Módulo 1 — Agente WhatsApp (Pacientes)

### 4.1 Configuración WhatsApp Cloud API

**Prerequisitos:**
- Cuenta Meta Business verificada
- App registrada en Meta for Developers
- Número de teléfono dedicado para el bot (no puede ser el personal de Sofi)
- Webhook configurado apuntando al endpoint de n8n

**Setup en n8n:**
```
Trigger: Webhook (POST /whatsapp/incoming)
  → Parse mensaje entrante
  → Identificar si es conversación nueva o existente
  → Rutear según contexto
```

### 4.2 Diseño del Agente Conversacional

**System Prompt (base — ajustar con datos reales de Sofi):**

```
Sos la asistente virtual del [NOMBRE_ESPACIO], un espacio de bienestar y salud 
ubicado en [DIRECCIÓN].

Tu rol es:
1. Recibir a las personas con calidez y profesionalismo
2. Entender qué servicio buscan
3. PRESENTAR a los profesionales con su DESCRIPCIÓN ÚNICA (no decir "tenemos
   psicólogos" genéricamente, sino describir qué hace cada uno y cómo trabaja)
4. Cuando el paciente elija un profesional, mostrar los horarios disponibles 
   SOLO de ese profesional
5. Agendar el turno si la persona lo desea
6. Si alguien quiere TRABAJAR en el espacio como profesional, recopilar sus datos

Flujo de presentación de profesionales:
- Cuando el paciente dice qué busca, mostrá los profesionales de esa área 
  con un emoji 👤, su nombre, y su descripción única (campo `descripcion` de la DB)
- Preguntá cuál le resuena más
- SOLO después de que elija, consultá y mostrá los horarios de ese profesional

Reglas:
- Sé cálida, empática y natural. No suenes robótica.
- Usá "vos" (español rioplatense)
- No inventes horarios. SIEMPRE consultá la disponibilidad real con las funciones
- Si no podés resolver algo, decí que vas a derivar con Sofi
- No des diagnósticos ni consejos médicos
- Mantené las respuestas concisas (máx 3-4 oraciones por mensaje)

Servicios disponibles: [SE INYECTAN DINÁMICAMENTE DESDE NOTION]
Profesionales activos: [SE INYECTAN DINÁMICAMENTE DESDE NOTION]
```

### 4.3 Function Calling / Tools del Agente

El LLM debe tener acceso a las siguientes funciones (implementadas como sub-workflows en n8n):

#### `consultar_profesionales(servicio)`
- **Descripción:** Devuelve los profesionales activos de un servicio CON su descripción única
- **Input:** `servicio` (string): área buscada ("psicología", "nutrición", etc.)
- **Output:** array de `{id, nombre, descripcion, especialidad}`
- **Fuente:** Notion → DB `Profesionales` → filtrar `activo = TRUE` AND `especialidad = servicio`
- **Uso en el flujo:** Se llama PRIMERO para presentar los profesionales al paciente. LUEGO de que el paciente elija, se llama a `buscar_disponibilidad`

#### `buscar_disponibilidad(profesional_id, fecha_preferida?)`
- **Descripción:** Busca slots disponibles para un profesional específico
- **Input:** 
  - `profesional_id` (number, requerido): ID del profesional elegido por el paciente
  - `fecha_preferida` (string, opcional): "martes", "2026-06-03", "mañana"
- **Output:** array de `{profesional, descripcion, fecha, hora, consultorio}`
- **Lógica:**
  1. Obtener datos del profesional de Notion (calendar_id, horarios_base, consultorio)
  2. Consultar Google Calendar API → `freebusy` para las próximas 2 semanas
  3. Cruzar con `horarios_base` del profesional
  4. Cruzar con horarios del consultorio asignado
  5. Filtrar: no ofrecer slots con menos de `anticipacion_min_horas`
  6. Devolver máximo 5 opciones ordenadas por proximidad

#### `agendar_turno(profesional_id, fecha, hora, paciente_nombre, paciente_telefono)`
- **Descripción:** Crea un turno confirmado
- **Input:** todos los campos requeridos
- **Output:** `{exito: bool, mensaje: string, turno_id: number}`
- **Lógica:**
  1. Verificar disponibilidad una vez más (evitar race condition)
  2. Crear evento en Google Calendar del profesional
  3. Guardar fila en hoja `turnos` de Google Sheets
  4. Devolver confirmación con datos del turno

#### `registrar_profesional_interesado(nombre, telefono, instagram?, descripcion)`
- **Descripción:** Guarda datos de un profesional interesado
- **Input:** nombre y telefono requeridos, resto opcional
- **Output:** `{exito: bool}`
- **Lógica:**
  1. Guardar en hoja `profesionales_interesados`
  2. Enviar notificación WhatsApp a Sofi

#### `escalar_a_sofi(motivo)`
- **Descripción:** Notifica a Sofi que un contacto necesita atención humana
- **Input:** `motivo` (string)
- **Output:** `{notificado: bool}`
- **Lógica:** Envía mensaje WhatsApp a número de Sofi con contexto de la conversación

### 4.4 Flujo de Conversación — Diagrama

```
[Mensaje entrante]
       │
       ▼
¿Es conversación nueva?
  │ SÍ                │ NO
  ▼                   ▼
Saludo inicial    Continuar contexto
  │                   │
  ▼                   │
Detectar intención ◄──┘
  │
  ├── BUSCA TURNO ──────────▶ consultar_servicios()
  │                               │
  │                               ▼
  │                          Preguntar preferencias
  │                          (día, horario, profesional)
  │                               │
  │                               ▼
  │                          buscar_disponibilidad()
  │                               │
  │                               ▼
  │                          Ofrecer opciones
  │                               │
  │                               ▼
  │                          Paciente elige ──▶ agendar_turno()
  │                                                  │
  │                                                  ▼
  │                                            Confirmar turno
  │
  ├── QUIERE TRABAJAR ──────▶ Recopilar datos conversacionalmente
  │                               │
  │                               ▼
  │                          registrar_profesional_interesado()
  │                               │
  │                               ▼
  │                          Agradecer + notificar a Sofi
  │
  ├── CONSULTA GENERAL ─────▶ Responder con info del espacio
  │
  └── NO RESUELVE ──────────▶ escalar_a_sofi()
```

### 4.5 Gestión de Estado de Conversación

**Problema:** WhatsApp es stateless. Cada mensaje llega como un evento independiente.

**Solución:** Mantener contexto de conversación en n8n:

```
Clave: whatsapp_{phone_number}
TTL: 30 minutos de inactividad
Contenido:
{
  "phone": "+5491112345678",
  "conversation_history": [
    {"role": "user", "content": "..."},
    {"role": "assistant", "content": "..."}
  ],
  "state": "buscando_turno | recopilando_datos | agendando | idle",
  "context": {
    "servicio_seleccionado": "Psicología",
    "profesional_seleccionado": null,
    "fecha_preferida": "martes"
  },
  "last_activity": "2026-05-26T14:30:00Z"
}
```

**Almacenamiento:** Variable estática de n8n, Redis (si el VPS lo permite), o una hoja `sesiones` en Sheets (menos performante pero viable).

> **Recomendación:** Usar las variables nativas de n8n (available desde v1.x). Si el volumen crece, migrar a Redis.

---

## 5. Módulo 2 — Captación de Profesionales

### 5.1 Detección de intención

El agente IA detecta frases como:
- "Quiero trabajar ahí"
- "¿Alquilan consultorios?"
- "Soy profesional y busco espacio"
- "¿Tienen lugar para un nutricionista?"

Cuando detecta esta intención, cambia el flujo a modo recopilación:

### 5.2 Flujo de recopilación

```
1. "¡Qué bueno que te interesa! Contame, ¿cuál es tu nombre completo?"
2. "¿Cuál es tu especialidad o qué hacés profesionalmente?"
3. "¿Tenés Instagram profesional? Si sí, pasame tu @"
4. "Perfecto. Ahora le paso tus datos a Sofi para que se contacte con vos. ¿Hay algo más que quieras que ella sepa?"
5. Guardar → Notificar a Sofi
```

Los datos se recopilan conversacionalmente (no como formulario rígido). El LLM extrae los campos del texto libre.

---

## 6. Módulo 3 — Gestión de Disponibilidad

### 6.1 Google Calendar — Arquitectura de Propiedad

> **DECISIÓN CLAVE:** Los calendarios NO son de los profesionales. Son creados y gestionados bajo la **cuenta de Google de Sofi**. Los profesionales reciben acceso compartido (editor) para ver y modificar su agenda desde el celular.

**¿Por qué?** Los profesionales rotan. Si usamos sus calendarios personales, cada vez que uno se va necesitamos reconfigurar accesos con el nuevo. Con calendarios bajo la cuenta de Sofi:
- Cuando un profesional se va → Sofi le quita el acceso compartido (2 clicks)
- Cuando uno nuevo llega → Sofi crea un calendario nuevo o reasigna uno, y lo comparte
- La service account de n8n SIEMPRE tiene acceso porque todos los calendarios viven bajo la misma cuenta Google
- No hay dependencia del email/cuenta personal del profesional

**Setup por cada profesional:**

1. Sofi crea un nuevo calendario en su Google Calendar: "Prof - [Nombre Profesional]"
2. El calendar_id generado (formato `xxxx@group.calendar.google.com`) se guarda en la hoja `profesionales`
3. Sofi comparte ese calendario con el email del profesional (permiso: "Hacer cambios en eventos")
4. El profesional lo ve automáticamente en su app de Google Calendar del celular
5. La service account de n8n ya tiene acceso porque opera bajo el mismo proyecto Google de Sofi

**Flujo cuando un profesional se va:**
```
1. Sofi abre Google Calendar → click derecho en el calendario del profesional
2. "Configuración" → "Compartir con personas específicas" → eliminar email del profesional
3. En Google Sheets → cambiar "activo" a FALSE en la fila del profesional
4. Opcional: renombrar el calendario para el siguiente profesional, o crear uno nuevo
```

**Flujo cuando un profesional nuevo llega:**
```
1. Sofi crea nuevo calendario en Google Calendar: "Prof - [Nombre]"
2. Comparte con el email del profesional (permiso: "Hacer cambios en eventos")
3. Copia el calendar_id (Configuración → "Integrar calendario" → "ID del calendario")
4. Agrega fila en Google Sheets con todos los datos + calendar_id
5. El bot automáticamente empieza a ofrecer ese profesional
```

**Horarios base:**
- Los horarios regulares del profesional se definen en Google Sheets (`horarios_base`)
- Estos representan los slots "potencialmente disponibles"
- Si Google Calendar muestra un evento en ese horario → está ocupado

**Lógica de disponibilidad:**

```
DISPONIBLE = horario_base DEL PROFESIONAL
             ∩ horario_consultorio (apertura-cierre, días hábiles)
             - eventos_google_calendar (busy)
             - turnos_ya_agendados
             - buffer_anticipación (>2h desde ahora)
```

### 6.2 API Google Calendar — Endpoints usados

| Endpoint | Uso |
|---|---|
| `calendar.freebusy.query` | Consultar si un rango horario está libre u ocupado |
| `calendar.events.insert` | Crear evento cuando se agenda un turno |
| `calendar.events.delete` | Cancelar turno (si se implementa) |
| `calendar.events.list` | Listar eventos de un día para mostrar agenda |

**Credenciales:** Service Account del proyecto GCP de Sofi. Como todos los calendarios viven bajo la cuenta de Sofi, la service account tiene acceso automático sin necesidad de compartir individualmente con ella.

### 6.3 WhatsApp para Profesionales — Flujo de Bloqueo

Los profesionales pueden enviar mensajes al mismo número de WhatsApp para gestionar su agenda:

```
Profesional: "Bloquear jueves 29 de 14 a 16"
Bot: "✅ Listo, bloqueé jueves 29/05 de 14:00 a 16:00 en tu agenda. 
      No voy a ofrecer esos horarios a pacientes."

Profesional: "Liberar jueves 29 de 14 a 16"
Bot: "✅ Liberé el jueves 29/05 de 14:00 a 16:00. 
      Esos horarios ya están disponibles para pacientes."

Profesional: "¿Cómo tengo la agenda del viernes?"
Bot: "📋 Tu agenda del viernes 30/05:
      09:00 - Juan Pérez (Psicología)
      10:00 - Libre
      11:00 - Libre
      14:00 - María López (Psicología)
      15:00 - Bloqueado por vos
      16:00 - Libre"
```

**Detección de profesional:** El bot identifica al profesional por su número de teléfono (registrado en la hoja `profesionales`). Si el número no está registrado → flujo normal de paciente.

**Implementación:**

```
[Mensaje entrante]
       │
       ▼
¿Número está en hoja `profesionales`?
  │ SÍ                        │ NO
  ▼                           ▼
Flujo PROFESIONAL         Flujo PACIENTE
  │                       (Módulo 1)
  ▼
Detectar acción:
  ├── BLOQUEAR → crear evento "Bloqueado" en Calendar
  ├── LIBERAR  → eliminar evento "Bloqueado" de Calendar
  ├── VER AGENDA → calendar.events.list del día
  └── OTRA COSA → responder como asistente
```

---

## 7. Módulo 4 — Panel de Administración (Notion)

### 7.1 Estructura del Workspace

> **La cliente ya usa Notion**, por lo que se implementa el panel ahí en vez de Google Sheets. Esto da mejor UX, vistas más flexibles (tabla, calendario, galería, kanban), y cero curva de aprendizaje.

El workspace de Notion tiene las siguientes bases de datos (equivalentes a las definidas en la sección 3):

```
📊 Notion Workspace: "Gestión Espacio Coworking"
├── 📋 Profesionales       (CRUD por Sofi) — vista tabla + vista galería
├── 📋 Servicios           (CRUD por Sofi) — vista tabla
├── 📋 Consultorios        (CRUD por Sofi) — vista tabla
├── 📋 Turnos              (lectura para Sofi, escritura por bot) — vista calendario + tabla
├── 📋 Interesados         (solo lectura) — vista tabla con filtro "sin revisar"
├── 📄 Configuración       (página con propiedades) — datos del espacio
├── 📄 Personalidad        (página con propiedades) — personalidad del bot
└── 📋 Log                 (registro de actividad del bot) — vista tabla
```

**Vistas sugeridas para Sofi:**
- **Turnos**: Vista calendario (ve los turnos de la semana visual), vista tabla filtrada por hoy, vista por profesional
- **Profesionales**: Vista galería con foto/icono + nombre + especialidad, vista tabla para editar
- **Interesados**: Vista tabla con filtro `estado = pendiente` por defecto

### 7.2 Propiedades de Notion vs Validaciones

- **Select/Multi-select:** Para campos como `especialidad`, `estado`, `consultorio` — Notion maneja esto nativamente como desplegables con colores
- **Checkbox:** Para `activo` — más visual que un booleano
- **Date:** Para fechas de turnos — permite vista calendario nativa
- **Relation:** Se puede vincular la DB de Turnos con la DB de Profesionales para navegación cruzada
- **Bloqueo de páginas:** La DB de `turnos` y `log` se pueden configurar como locked para que Sofi no edite accidentalmente registros del bot

### 7.3 Acceso API (Notion API)

**Configuración:**
1. Crear una Integration en notion.so/my-integrations (bajo la cuenta de Sofi)
2. La integration genera un `NOTION_API_KEY` (Internal Integration Token)
3. Compartir cada database/página con la integration ("Connect to" → nombre de la integration)
4. Guardar los `database_id` de cada base de datos en las variables de entorno de n8n

**Nodo n8n:** n8n tiene nodo nativo "Notion" que soporta:
- Query database (con filtros)
- Create page (insertar registro)
- Update page (modificar registro)
- Get page (leer registro)

| Operación | Database | Frecuencia |
|---|---|---|
| Query profesionales activos | `Profesionales` | Cada conversación |
| Query servicios | `Servicios` | Cada conversación |
| Read config | `Configuración` | Al iniciar flujo |
| Read personalidad | `Personalidad` | Al iniciar flujo |
| Create turno nuevo | `Turnos` | Al agendar |
| Create profesional interesado | `Interesados` | Al captar |
| Create log | `Log` | Cada interacción |

**Rate Limits de Notion API:**
- 3 requests/segundo (por integration)
- Para el volumen esperado (<100 convos/día), esto es más que suficiente
- Si hay picos, n8n puede implementar retry con backoff (nativo)

**Ejemplo de query en Notion API (para referencia):**
```json
POST https://api.notion.com/v1/databases/{database_id}/query
Headers:
  Authorization: Bearer {NOTION_API_KEY}
  Notion-Version: 2022-06-28
Body:
{
  "filter": {
    "property": "activo",
    "checkbox": { "equals": true }
  }
}
```

---

## 8. Setup del Orquestador — Workflows

### 8.1 Workflow Principal: `whatsapp-incoming`

```
Trigger: Webhook POST /whatsapp
  │
  ├─▶ [Parse] Extraer: phone, message, name, timestamp
  │
  ├─▶ [Check] ¿Es profesional? (lookup en hoja profesionales por phone)
  │     │ SÍ → Sub-workflow: profesional-actions
  │     │ NO → continuar
  │
  ├─▶ [Load] Cargar contexto de conversación (si existe)
  │
  ├─▶ [Load] Cargar servicios y profesionales activos (Sheets)
  │
  ├─▶ [LLM] Enviar a Gemini/GPT con:
  │         - System prompt + datos dinámicos
  │         - Historial de conversación
  │         - Tools/Functions disponibles
  │
  ├─▶ [Execute] Si el LLM invoca una tool → ejecutar sub-workflow
  │         - buscar_disponibilidad → sub-workflow Calendar
  │         - agendar_turno → sub-workflow Calendar + Notion
  │         - registrar_profesional → sub-workflow Notion + WhatsApp
  │         - escalar_a_sofi → sub-workflow WhatsApp
  │
  ├─▶ [Save] Actualizar contexto de conversación
  │
  └─▶ [Send] Enviar respuesta via WhatsApp API
```

### 8.2 Sub-workflow: `buscar-disponibilidad`

```
Input: profesional_id, fecha_preferida?
  │
  ├─▶ [Notion] Obtener datos del profesional (calendar_id, horarios_base)
  │
  ├─▶ [Calendar] freebusy.query(calendar_id, start=hoy, end=+14 días)
  │
  ├─▶ [Logic] Calcular slots disponibles:
  │       horarios_base ∩ horario_consultorio - busy_times
  │
  ├─▶ [Filter] Aplicar preferencia de fecha si existe
  │
  └─▶ Output: [{profesional, descripcion, fecha, hora, consultorio}] (máx 5)
```

### 8.3 Sub-workflow: `agendar-turno`

```
Input: profesional_id, fecha, hora, paciente_nombre, paciente_telefono
  │
  ├─▶ [Calendar] Verificar freebusy una vez más (anti race-condition)
  │       ¿Libre? NO → return error "horario ya no disponible"
  │
  ├─▶ [Calendar] events.insert:
  │       calendar_id = profesional.calendar_id
  │       summary = "Turno: {paciente_nombre} - {servicio}"
  │       start = fecha + hora
  │       end = fecha + hora + duracion_min
  │       description = "Agendado por bot. Tel: {paciente_telefono}"
  │
  ├─▶ [Notion] Insertar registro en DB `Turnos`
  │
  └─▶ Output: {exito: true, turno_id, event_id}
```

### 8.4 Evaluación de Orquestadores

> **Contexto:** La cliente (a través de Kibans) expresó preocupación sobre la estabilidad de n8n self-hosted. Evaluamos las opciones:

| Opción | Costo/mes | Estabilidad | Complejidad | Soporte WhatsApp | Soporte Notion | Soporte Calendar | Notas |
|---|---|---|---|---|---|---|---|
| **n8n Cloud** | USD 20 | ⭐⭐⭐⭐ | Baja (managed) | ✅ Nodo nativo | ✅ Nodo nativo | ✅ Nodo nativo | Hosting managed por n8n. Sin VPS propio. Buena opción si se quiere visual |
| **Make (Integromat)** | USD 9-16 | ⭐⭐⭐⭐⭐ | Baja | ✅ Módulo nativo | ✅ Módulo nativo | ✅ Módulo nativo | Muy estable, cloud 100%. Límite de operaciones según plan (10k-20k/mes en Pro). Evaluar si alcanza |
| **n8n Self-hosted (VPS)** | USD 5-10 | ⭐⭐⭐ | Alta | ✅ | ✅ | ✅ | Más barato pero requiere mantenimiento de VPS. La cliente reportó inestabilidad en el pasado |
| **Custom Node.js** | USD 5-10 (VPS) | ⭐⭐⭐⭐⭐ | **Alta (dev)** | Via API | Via API | Via API | Máximo control y estabilidad. Pero requiere más horas de desarrollo y no es visual |

**Recomendación:**

1. **Si la prioridad es estabilidad + facilidad:** → **Make** (Pro a USD 9/mes). Muy confiable, cloud managed, buen límite de operaciones para este volumen
2. **Si la prioridad es flexibilidad + visual:** → **n8n Cloud** (USD 20/mes). Más flexible que Make para flujos complejos, pero más caro
3. **Si la prioridad es costo mínimo:** → **n8n Self-hosted** (USD 5-10/mes). Pero necesita monitoreo y mantenimiento

> **DECISIÓN PENDIENTE:** Confirmar con Kibans y la cliente qué orquestador usar antes de arrancar el desarrollo. Los workflows se diseñan igual independientemente de la plataforma — solo cambia la implementación.

---

## 9. Configuración WhatsApp Cloud API

### 9.1 Prerequisitos

1. **Meta Business Account** verificado
2. **App** creada en [developers.facebook.com](https://developers.facebook.com)
3. **WhatsApp product** agregado a la app
4. **Número de teléfono** registrado (dedicado para el bot)
5. **Token permanente** generado (System User Token, no el temporal)

### 9.2 Webhook Setup

```
URL del webhook: https://{VPS_IP_OR_DOMAIN}/webhook/whatsapp-incoming
Verify Token: {RANDOM_STRING}
Subscribed fields: messages
```

### 9.3 Envío de Mensajes

```
POST https://graph.facebook.com/v21.0/{PHONE_NUMBER_ID}/messages
Headers:
  Authorization: Bearer {ACCESS_TOKEN}
  Content-Type: application/json
Body:
{
  "messaging_product": "whatsapp",
  "to": "{RECIPIENT_PHONE}",
  "type": "text",
  "text": {
    "body": "{MESSAGE}"
  }
}
```

### 9.4 Templates (Requeridos para iniciar conversaciones)

Se necesitan templates aprobados por Meta para:
- **Confirmación de turno:** "Hola {{1}}, tu turno quedó confirmado para el {{2}} a las {{3}} con {{4}}. 📍 {{5}}"
- **Notificación a Sofi:** "Nuevo profesional interesado: {{1}} - {{2}}. Tel: {{3}}"

> **IMPORTANTE:** Los templates requieren aprobación de Meta (24-48h). Iniciar este proceso en la Semana 1.

---

## 10. Seguridad y Consideraciones

### 10.1 Datos Sensibles
- No almacenar datos de salud específicos del paciente (solo nombre, teléfono, servicio)
- Los turnos no contienen motivo de consulta ni diagnósticos
- El bot NO debe pedir ni almacenar DNI, obra social, ni datos médicos

### 10.2 Rate Limits
- WhatsApp Cloud API: 80 mensajes/segundo (más que suficiente)
- Google Calendar API: 1,000,000 requests/día (más que suficiente)
- Google Sheets API: 300 requests/min (ojo con alta concurrencia, usar cache)
- Gemini API: depende del tier, pero flash es generoso

### 10.3 Errores Comunes a Prevenir
- **Race condition en turnos:** Siempre re-verificar disponibilidad antes de confirmar
- **Timeout del webhook:** WhatsApp espera respuesta en <15 segundos. Si el LLM tarda, responder un ACK y enviar la respuesta después
- **Sesiones zombie:** Limpiar sesiones de conversación inactivas >30 min

---

## 11. Testing Plan

### 11.1 Tests Funcionales

| # | Escenario | Resultado Esperado |
|---|---|---|
| T1 | Paciente pide turno, hay disponibilidad | Se agenda y confirma |
| T2 | Paciente pide turno, NO hay disponibilidad | Se ofrecen alternativas |
| T3 | Paciente pide profesional específico | Se busca solo ese profesional |
| T4 | Profesional bloquea horario vía WhatsApp | Horario deja de ofrecerse |
| T5 | Profesional consulta su agenda | Recibe lista de turnos del día |
| T6 | Contacto quiere trabajar en el espacio | Se recopilan datos, se notifica a Sofi |
| T7 | Sofi cambia un profesional en Sheets | El bot refleja el cambio inmediatamente |
| T8 | Mensaje fuera de horario de consultorios | El bot agenda para el próximo día hábil |
| T9 | Conversación ambigua / no resuelta | Se escala a Sofi |
| T10 | 2 pacientes piden el mismo slot simultáneamente | Solo 1 lo obtiene, al otro se le ofrece alternativa |

### 11.2 Tests de Integración

- WhatsApp webhook → n8n → respuesta enviada
- n8n → Google Calendar → freebusy correcto
- n8n → Google Sheets → lectura/escritura correcta
- LLM → function calling → ejecución correcta

---

## 12. Entregables

### 12.1 Entregables Técnicos

| # | Entregable | Formato |
|---|---|---|
| 1 | n8n workflows exportados (JSON) | Archivos .json |
| 2 | Google Sheet configurado con todas las hojas | Link compartido |
| 3 | Google Calendars creados y compartidos | Accesos configurados |
| 4 | Templates de WhatsApp aprobados | En la cuenta de Meta |
| 5 | System prompts documentados | En este documento |
| 6 | Documentación técnica de mantenimiento | Este documento |

### 12.2 Paquete de Autonomía (para que la cliente no dependa de nosotros)

> **PRINCIPIO RECTOR:** No debe existir ninguna tarea de operación o administración del sistema que requiera intervención de Kibans. La cliente debe poder operar, modificar y mantener el sistema de forma 100% independiente.

| # | Entregable | Contenido | Formato |
|---|---|---|---|
| A1 | **Guía de administración** | Paso a paso con capturas para: agregar profesional, dar de baja, cambiar horarios, agregar servicio, cambiar personalidad del bot, archivar turnos | Google Doc con screenshots |
| A2 | **Guía de onboarding de profesional nuevo** | Checklist específico: crear Calendar → compartir con service account → agregar fila en Sheets → verificar que el bot lo ofrezca | Google Doc |
| A3 | **Guía de troubleshooting** | Los 10 problemas más comunes con solución paso a paso (bot no responde, turnos no aparecen, Calendar no sincroniza, etc.) | Google Doc |
| A4 | **Checklist mensual** | 5 tareas de ~5 min: revisar costos API, archivar turnos viejos, verificar que el bot responde, revisar profesionales interesados, backup del Sheet | Google Doc (checklist) |
| A5 | **Video de capacitación** | Grabación de la sesión de onboarding mostrando todas las tareas de administración | Video (grabación de meet) |
| A6 | **Transferencia de accesos** | Documento con todos los accesos transferidos a la cuenta de la cliente | Google Doc |
| A7 | **Monitoreo automático** | Configuración de uptime check que envía email a Sofi si n8n se cae | Configurado en Google Cloud / UptimeRobot |

### 12.3 Transferencia de Propiedad — Checklist

Todo debe quedar bajo las cuentas de la cliente. El programador NO retiene accesos.

| Recurso | Cuenta propietaria | Checklist |
|---|---|---|
| **Meta Business / WhatsApp** | Sofi (su cuenta Meta Business) | ☐ App creada bajo su cuenta ☐ Número verificado a su nombre ☐ Token generado con su System User |
| **Google Cloud (Calendar + Sheets API)** | Sofi (su Gmail / Google Workspace) | ☐ Proyecto GCP bajo su cuenta ☐ Service Account bajo su proyecto ☐ Billing bajo su tarjeta |
| **Google Sheets** | Sofi | ☐ Ella es owner del spreadsheet ☐ Service account tiene acceso editor |
| **Google Calendars** | Cada profesional / Sofi | ☐ Calendarios creados en cuentas de los profesionales ☐ Compartidos con service account |
| **VPS (n8n)** | Sofi | ☐ VPS contratado con su email/tarjeta ☐ Acceso SSH entregado ☐ Panel de control accesible |
| **n8n** | Sofi | ☐ Credenciales de admin entregadas ☐ Workflows exportados como backup JSON |
| **API Key LLM** | Sofi | ☐ Cuenta de Gemini/OpenAI bajo su email ☐ API Key generada por ella ☐ Billing bajo su tarjeta |

### 12.4 Configuración de Monitoreo

Para que la cliente sepa si el sistema se cae sin necesidad de revisarlo manualmente:

```
Opción A — UptimeRobot (gratuito):
- URL a monitorear: https://{DOMINIO}/webhook/health
- Intervalo: cada 5 minutos
- Alerta: email a sofi@xxx.com
- Setup: 5 minutos, cuenta gratuita

Opción B — Google Cloud Uptime Check (si ya tiene GCP):
- Mismo endpoint
- Alerta via email o SMS
```

**Endpoint de health check en n8n:**
Crear un workflow simple que responda 200 OK a GET /webhook/health. Si n8n está caído, no responde → alerta.

---

## 13. Estimación de Horas

| Tarea | Horas |
|---|---|
| Setup WhatsApp Cloud API + webhook + templates | 3-4h |
| Setup n8n + VPS + dominio + SSL | 2-3h |
| Google Sheets estructura + validaciones + formato + hoja personalidad | 4-5h |
| Google Calendar setup + service account + permisos | 2-3h |
| Workflow principal (incoming + routing + LLM + prompt dinámico) | 6-8h |
| Sub-workflow: buscar disponibilidad | 4-5h |
| Sub-workflow: agendar turno | 3-4h |
| Sub-workflow: registrar profesional | 2h |
| Sub-workflow: profesional actions (bloquear/liberar/ver) | 3-4h |
| Sub-workflow: escalar a Sofi | 1h |
| Prompt engineering + ajustes conversacionales | 3-4h |
| Testing end-to-end | 4-5h |
| **Paquete de autonomía** (guías, docs, troubleshooting, monitoreo) | 4-5h |
| Sesión de capacitación + grabación | 1-2h |
| Transferencia de accesos + verificación | 1-2h |
| **TOTAL** | **41-54h** |

---

## 14. Variables de Entorno / Secrets

```env
# WhatsApp
WHATSAPP_ACCESS_TOKEN=xxxxx
WHATSAPP_PHONE_NUMBER_ID=xxxxx
WHATSAPP_VERIFY_TOKEN=xxxxx
WHATSAPP_SOFI_PHONE=+5491100000000

# Google
GOOGLE_SERVICE_ACCOUNT_JSON=xxxxx
GOOGLE_SHEET_ID=xxxxx

# LLM
GEMINI_API_KEY=xxxxx
# o
OPENAI_API_KEY=xxxxx

# n8n
N8N_WEBHOOK_URL=https://xxxxx
```

---

## 15. Riesgos Técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Meta rechaza templates de WhatsApp | Media | Alto | Enviar templates genéricos primero, iterar |
| Profesionales no usan Google Calendar | Media | Alto | Capacitarlos + ofrecer alternativa WhatsApp |
| Google Sheets se vuelve lento con muchos registros | Baja (a largo plazo) | Medio | Archivar turnos viejos mensualmente |
| LLM genera respuestas incorrectas | Media | Medio | Prompt engineering robusto + guardrails |
| VPS se cae | Baja | Alto | Monitoreo + alertas + restart automático |
