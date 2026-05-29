# Propuesta de Gestión y Automatización para Espacio Alvarado
**Presentado por:** KIBANS
**Para:** Sofi - Espacio Alvarado
**Fecha:** Mayo 2026

---

## Objetivo

Implementar una plataforma web privada y a medida que centralice la gestión diaria de Espacio Alvarado. El sistema automatiza las tareas administrativas repetitivas (como el control de disponibilidad de salas y el cobro a profesionales) y asiste en la atención a pacientes mediante un agente inteligente de consulta.

---

## Módulos y Funcionalidades Concretas

### 1. Panel de Consultorios (Grilla Interactiva)

Es el organizador visual de las salas físicas del local (Consultorios A, B, C, D y Hall).

* **Visualización de la semana:** Permite ver la agenda completa de lunes a sábado, dividida por horas. Cada consultorio tiene su propia grilla independiente.
* **Control visual rápido (Drag and Drop):** Permite asignar profesionales o talleres a cualquier hora simplemente arrastrándolos desde el panel lateral y soltándolos en la grilla.
* **Reorganización en segundos:** Si un profesional necesita cambiar de día u hora, el bloque asignado se arrastra a la nueva celda horaria.
* **Liberación de salas:** Las celdas ocupadas se liberan arrastrando el bloque al tacho de basura visual en la parte superior.
* **Control de uso:** Cada consultorio muestra qué porcentaje de la semana está ocupado, ayudando a identificar salas libres para optimizar el alquiler.
* **Navegación:** Botones simples para avanzar o retroceder semanas completas.

---

### 2. Agenda del Profesional y Registro de Pacientes

El sistema genera una agenda para cada profesional basada en las salas que tiene reservadas en el Panel de Consultorios.

* **Agenda por prestador:** Vista clara de los turnos confirmados y disponibles de cada profesional.
* **Carga de turnos:** Al hacer clic en un horario libre del profesional, la administración registra la reserva del paciente con su nombre, apellido y teléfono.
* **Buscador de pacientes:** Listado simple de los pacientes registrados para consultar su historial de turnos en el espacio.
* **Control de asistencia:** Los turnos se marcan de forma manual como libre, confirmado o cancelado.

---

### 3. Fichero de Profesionales y Postulantes

Una base de datos ordenada de las personas que trabajan o quieren trabajar en el espacio.

* **Ficha de contacto:** Datos completos de cada profesional (nombre, especialidad, teléfono, correo electrónico e Instagram).
* **Perfil para la Inteligencia Artificial:** Breve párrafo con la descripción del profesional. El asistente virtual lee este texto para recomendarlo a los pacientes que preguntan por su especialidad.
* **Gestión de entrevistas:** Sección para cargar datos de nuevos profesionales interesados en alquilar. El asistente virtual guarda aquí de manera automática a quienes se postulen por chat.

---

### 4. Talleres y Actividades Grupales

Administración de los talleres, cursos o clases semanales que se dictan en el espacio.

* **Ficha del taller:** Nombre del taller, profesor, costo de la sesión, descripción general y cupo máximo de alumnos.
* **Control de promoción:** Botón de encendido/apagado para decidir si el asistente virtual debe promocionar ese taller a las personas que consultan.
* **Control de cupos:** Registro de la cantidad de alumnos inscriptos en cada sesión para evitar sobrepasar el límite de la sala.

---

### 5. Asistente Conversacional Inteligente

Un agente virtual disponible en el sistema que responde consultas comunes.

* **Respuestas automáticas:** Informa a los interesados sobre los talleres disponibles, precios, profesionales del centro y horarios de atención.
* **Recomendación guiada:** Si un paciente escribe que busca un psicólogo o una clase de yoga, el asistente le presenta las opciones activas del centro y el enlace a su Instagram.
* **Pre-reserva de turnos:** El asistente conversa con el paciente, verifica los horarios libres del profesional en la agenda y deja el turno pre-agendado para que la administración lo valide.
* **Filtro de postulantes:** Si un profesional escribe consultando por alquiler de consultorios, el asistente le pide sus datos de contacto y especialidad, registrándolo en el panel de entrevistas.

---

### 6. Liquidación de Alquiler de Consultorios (Finanzas)

Sistema que automatiza el cálculo de cobro a los profesionales por el uso de los espacios.

* **Precio por consultorio:** Permite asignar un valor por hora personalizado a cada sala (por ejemplo, el Consultorio A puede tener un valor diferente al Hall).
* **Cálculo automático de uso:** Multiplica las horas reales que el profesional reservó en la grilla por el precio de la sala asignada.
* **Métricas de ocupación:** Muestra el total facturado, la cantidad de horas usadas y calcula el valor de las horas que quedaron vacías (capacidad ociosa).
* **Reporte simple:** Resumen digital del dinero a cobrar a cada profesional al final del mes.

---

## Infraestructura y Tecnología

El sistema se aloja completamente sobre tecnología en la nube provista por Google:

* **Acceso universal:** Se ingresa mediante una dirección web privada desde celulares, tablets o computadoras de escritorio, sin instalar nada.
* **Respaldo automático de datos:** La base de datos (Google Firebase) sincroniza los cambios de forma instantánea. Si ingresás un turno desde la computadora de recepción, se actualiza al mismo tiempo en el teléfono de la administración.
* **Acceso seguro:** Ingreso protegido mediante usuario y contraseña para el personal administrativo.

---

**KIBANS**
*Automatización y Soluciones Digitales para Espacios de Coworking*
