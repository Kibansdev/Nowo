# Manual de Marca — Espacio Alvarado

> *Entorno seguro y humano para procesos de sanación y transformación.*

---

## 1. Esencia de Marca

| Atributo | Definición |
|---|---|
| **Nombre** | Espacio Alvarado |
| **Tagline** | Entorno seguro y humano para procesos de sanación y transformación |
| **Arquetipo** | El Sanador / El Sabio |
| **Tono de voz** | Cálido, sereno, profesional, empático |
| **Valores** | Sanación · Transformación · Comunidad · Bienestar integral · Premium |
| **Servicios** | Consultorios y espacios premium en alquiler · Terapias · Talleres · Mentorías |

### Personalidad de marca

La marca transmite **calma con propósito**. No es minimalismo frío, es calidez intencional. Cada punto de contacto debe sentirse como un **abrazo visual** — acogedor, seguro, y sofisticado. La estética se inspira en marcas de bienestar premium como Aesop, Soho House y The Well.

---

## 2. Paleta de Colores

![Paleta de colores de Espacio Alvarado](/Users/natalia/.gemini/antigravity/brain/c8262657-e9e9-4984-9c22-6d165acae731/brand_color_palette_1779887461587.png)

### Colores Primarios

| Rol | Color | Hex | Uso |
|---|---|---|---|
| **Sage Green** | Verde Salvia | `#7A8B6F` | Acento principal, CTAs, estados activos |
| **Terracotta** | Terracota | `#C4956A` | Acento secundario, calidez, highlights |
| **Warm Cream** | Crema Cálido | `#F5F0E8` | Fondo principal, superficies |

### Colores de Soporte

| Rol | Color | Hex | Uso |
|---|---|---|---|
| **Deep Charcoal** | Carbón Profundo | `#2C2C34` | Sidebar, texto sobre claro, headers |
| **Muted Gold** | Dorado Apagado | `#B8944F` | Badges premium, acentos sutiles |
| **Blush** | Rubor | `#E8D5CB` | Fondos alternativos, cards suaves |
| **Eucalyptus** | Eucalipto | `#9BAF93` | Variante clara del sage, estados hover |

### Colores Funcionales

| Rol | Hex | Uso |
|---|---|---|
| **Éxito** | `#3D9970` | Confirmaciones, estados positivos |
| **Alerta** | `#E6A817` | Advertencias, notificaciones |
| **Error** | `#C0392B` | Errores, acciones destructivas |
| **Enlace** | `#7A8B6F` | Links interactivos (usa sage green) |

### Reglas de uso del color

> [!IMPORTANT]
> - El **sage green** es el color primario de acción. Reemplaza al dorado (`#B8944F`) actual de la app como acento principal.
> - El **terracotta** complementa al sage y se usa para CTAs secundarios y detalles cálidos.
> - Mantener **ratio de contraste mínimo 4.5:1** para texto sobre fondos claros.
> - Nunca usar colores saturados puros (rojo puro, azul eléctrico). Todo debe sentirse **orgánico y apagado**.

### Variables CSS recomendadas

```css
:root {
  /* Primarios */
  --color-sage:           #7A8B6F;
  --color-sage-dark:      #5E6E55;
  --color-sage-light:     #E8EDE5;
  --color-terracotta:     #C4956A;
  --color-terracotta-dark:#A67B52;
  --color-terracotta-light:#F5EDE5;
  --color-cream:          #F5F0E8;

  /* Soporte */
  --color-charcoal:       #2C2C34;
  --color-gold:           #B8944F;
  --color-blush:          #E8D5CB;
  --color-eucalyptus:     #9BAF93;

  /* Fondos */
  --bg-main:              #F5F0E8;
  --bg-sidebar:           #2C2C34;
  --bg-card:              #FFFFFF;
  --bg-card-alt:          #FAF8F5;

  /* Acentos de marca */
  --color-accent:         #7A8B6F;   /* SAGE reemplaza gold */
  --color-accent-dark:    #5E6E55;
  --color-accent-light:   #E8EDE5;
  --color-accent-glow:    rgba(122, 139, 111, 0.18);

  /* Nav activo */
  --color-nav-active-bg:  rgba(122, 139, 111, 0.16);
  --color-nav-active-text:#9BAF93;
}
```

---

## 3. Tipografía

![Tipografía de Espacio Alvarado](/Users/natalia/.gemini/antigravity/brain/c8262657-e9e9-4984-9c22-6d165acae731/brand_typography_1779887475901.png)

### Sistema tipográfico dual

| Familia | Rol | Google Fonts |
|---|---|---|
| **Cormorant Garamond** | Display / Títulos | `Cormorant+Garamond:wght@400;600` |
| **DM Sans** | Cuerpo / UI | `DM+Sans:wght@400;500;700` |

### Escala tipográfica

| Nivel | Familia | Peso | Tamaño | Line-height | Tracking |
|---|---|---|---|---|---|
| **H1** | Cormorant Garamond | 600 (SemiBold) | 2.25rem (36px) | 1.2 | -0.03em |
| **H2** | Cormorant Garamond | 600 | 1.75rem (28px) | 1.25 | -0.02em |
| **H3** | DM Sans | 700 (Bold) | 1.125rem (18px) | 1.35 | -0.015em |
| **H4** | DM Sans | 600 | 0.95rem (15.2px) | 1.4 | -0.01em |
| **Body** | DM Sans | 400 | 0.9375rem (15px) | 1.6 | 0 |
| **Body small** | DM Sans | 400 | 0.8125rem (13px) | 1.5 | 0.01em |
| **Caption** | DM Sans | 500 | 0.6875rem (11px) | 1.3 | 0.08em |
| **Label** | DM Sans | 600 | 0.625rem (10px) | 1.2 | 0.18em |

### Reglas tipográficas

> [!TIP]
> - **Cormorant Garamond** se usa SOLO para H1 y H2 — crea contraste editorial con la sans-serif del cuerpo.
> - **DM Sans** es la fuente workhorse — UI, botones, labels, navegación, todo.
> - Los labels y subtítulos van en **uppercase** con tracking amplio (0.12–0.22em).
> - El heading tracking siempre es **negativo** (condensado) para sensación premium.

### Variables CSS tipográficas

```css
:root {
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-main:    'DM Sans', -apple-system, sans-serif;
}
```

---

## 4. Componentes UI

![Guía de componentes UI](/Users/natalia/.gemini/antigravity/brain/c8262657-e9e9-4984-9c22-6d165acae731/brand_ui_components_1779887508814.png)

### 4.1 Cards

```
Fondo:          #FFFFFF
Borde:          1px solid rgba(0, 0, 0, 0.06)
Radio:          12px
Padding:        1.75rem (28px)
Sombra:         0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.06)
Hover:          translateY(-2px) + sombra elevada + borde sage tenue
Acento lateral: 3px solid #7A8B6F (sage green)
```

### 4.2 Botones

| Tipo | Fondo | Texto | Borde | Hover |
|---|---|---|---|---|
| **Primary** | `#7A8B6F` (sage) | `#FFFFFF` | ninguno | `#5E6E55` + shadow glow |
| **Secondary** | transparente | `#52525E` | `rgba(0,0,0,0.15)` | borde sage + fondo `#E8EDE5` |
| **Tertiary/Ghost** | transparente | `#7A8B6F` | ninguno | underline |
| **Danger** | `#C0392B` | `#FFFFFF` | ninguno | darken 10% |

```
Padding:        11px 24px
Border-radius:  6px
Font-weight:    600
Font-size:      0.88rem
Transition:     all 0.28s cubic-bezier(0.16, 1, 0.3, 1)
```

### 4.3 Sidebar (Dark)

```
Fondo:          #2C2C34 (charcoal)
Ancho:          248px
Texto:          rgba(255, 255, 255, 0.88)
Texto muted:    rgba(255, 255, 255, 0.38)
Divisores:      rgba(255, 255, 255, 0.08)
Item activo bg: rgba(122, 139, 111, 0.16)  ← sage con alpha
Item activo txt:#9BAF93 (eucalyptus)
Hover bg:       rgba(255, 255, 255, 0.07)
```

### 4.4 Badges

```
Fondo:          #E8EDE5 (sage light)
Texto:          #5E6E55 (sage dark)
Borde:          1px solid rgba(122, 139, 111, 0.25)
Padding:        3px 10px
Radius:         6px
Font-size:      0.67rem
Font-weight:    700
Text-transform: uppercase
Letter-spacing: 0.08em
```

### 4.5 Inputs

```
Fondo:          #F7F5F2
Borde:          1px solid rgba(0, 0, 0, 0.12)
Focus borde:    #7A8B6F (sage)
Radius:         6px
Padding:        10px 14px
Font-size:      0.9rem
```

---

## 5. Espaciado y Layout

### Sistema de espaciado

| Token | Valor | Uso |
|---|---|---|
| `--spacing-xs` | 0.5rem (8px) | Gaps mínimos, padding interno |
| `--spacing-sm` | 1rem (16px) | Separación entre elementos |
| `--spacing-md` | 1.75rem (28px) | Padding de cards y secciones |
| `--spacing-lg` | 2.5rem (40px) | Separación entre secciones |
| `--spacing-xl` | 4rem (64px) | Márgenes de página |

### Border Radius

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | 6px | Botones, inputs, badges |
| `--radius-md` | 12px | Cards, modales |
| `--radius-lg` | 20px | Chat windows, overlays |
| `--radius-pill` | 999px | Tags, pills |

---

## 6. Sombras y Profundidad

```css
/* Card en reposo */
--shadow-card:   0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.06);

/* Card elevada (hover) */
--shadow-float:  0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06);

/* Sidebar */
--shadow-sidebar: 4px 0 24px rgba(0,0,0,0.14);
```

> [!NOTE]
> Las sombras son deliberadamente suaves y difusas. La marca evita sombras duras — todo es soft, orgánico, envolvente.

---

## 7. Animaciones y Transiciones

```css
/* Transición estándar — para todo */
--transition-smooth: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);

/* Blur para overlays glass */
--glass-blur: blur(16px);

/* Entrada con fade-up */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### Principios de animación

- **Duración**: 200–350ms para interacciones, 500ms para entradas de página
- **Curva**: `cubic-bezier(0.16, 1, 0.3, 1)` — arranque suave, desaceleración natural
- **Hover**: `translateY(-2px)` para cards, `scale(1.02)` para botones
- **Nunca**: bounces agresivos, rotaciones, colores parpadeantes

---

## 8. Iconografía

| Atributo | Valor |
|---|---|
| **Estilo** | Line icons (trazo fino, redondeado) |
| **Librería recomendada** | Lucide Icons / Feather Icons |
| **Tamaño base** | 18px (sidebar), 20px (contenido), 24px (headers) |
| **Stroke width** | 1.5px–2px |
| **Color** | Hereda `currentColor` del contenedor |

---

## 9. Fotografía e Imágenes

### Directrices visuales

| Aspecto | Guía |
|---|---|
| **Tonalidad** | Cálida, luz natural, golden hour |
| **Ambientes** | Espacios luminosos con plantas, madera, texturas naturales |
| **Personas** | Retratos suaves, sin poses forzadas, diversidad |
| **Filtro** | Desaturación sutil (-15%), calidez (+10%), contraste bajo |
| **Prohibido** | Imágenes de stock genéricas, fondos fríos/corporativos, flash directo |

### Tratamiento de imágenes en UI

```
Border-radius:  12px (mismo que cards)
Overlay:        linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.3)) para texto encima
Object-fit:     cover
Aspect-ratio:   16/9 o 4/3 preferido
```

---

## 10. Mapeo de Cambios → App Actual (NUWO/Nowo)

> [!WARNING]
> El design system actual usa **dorado/gold** (`#B8944F`) como acento único. El rebrand propone migrar al **sage green** como primario, manteniendo el dorado como acento terciario premium.

### Resumen de cambios CSS necesarios

| Variable actual | Valor actual | Nuevo valor | Razón |
|---|---|---|---|
| `--color-accent` | `#B8944F` (gold) | `#7A8B6F` (sage) | Acento principal → orgánico/holístico |
| `--color-accent-dark` | `#9A7A3E` | `#5E6E55` | Hover states |
| `--color-accent-light` | `#F5EDDF` | `#E8EDE5` | Fondos de badges/highlights |
| `--color-accent-glow` | `rgba(184,148,79,0.18)` | `rgba(122,139,111,0.18)` | Glows y sombras de botón |
| `--color-nav-active-bg` | `rgba(184,148,79,0.16)` | `rgba(122,139,111,0.16)` | Sidebar nav activo |
| `--color-nav-active-text` | `#D4AA6A` | `#9BAF93` | Texto nav activo |
| `--color-highlight` | `#B8944F` | `#7A8B6F` | Highlight general |
| `--font-display` | `'DM Sans'` | `'Cormorant Garamond', serif` | Títulos con serif editorial |
| `--bg-main` | `#F4F1EC` | `#F5F0E8` | Crema ligeramente más cálido |

### Archivos a modificar

1. **[design-system.css](file:///Users/natalia/Desktop/Nowo/css/design-system.css)** — Variables root, tipografía
2. **[styles.css](file:///Users/natalia/Desktop/Nowo/css/styles.css)** — Colores hardcodeados en componentes
3. **[index.html](file:///Users/natalia/Desktop/Nowo/index.html)** — Añadir Cormorant Garamond (ya está linkeada ✅)
4. **Componentes JS** — Colores inline en SVG icons (`#b8944f` → `#7A8B6F`)

---

## 11. Tono de Voz en la App

| Contexto | Evitar | Preferir |
|---|---|---|
| Bienvenida | "Bienvenido al sistema" | "Bienvenida a tu espacio de transformación" |
| Reserva exitosa | "Reserva confirmada" | "Tu espacio está listo. Te esperamos." |
| Error | "Error en la operación" | "Algo no salió como esperábamos. Intentemos de nuevo." |
| Botón asistencia | "Soporte" | "Necesitás ayuda?" |
| CTA principal | "Reservar" | "Reservar mi espacio" |

---

## 12. Uso de Emojis

> [!CAUTION]
> **Los emojis están prohibidos en toda la interfaz de la app.** No se deben usar emojis Unicode en títulos, labels, badges, botones, cards, modales ni en ningún elemento de la UI.

### Razones

- La marca transmite **sofisticación y serenidad**. Los emojis rompen esa percepción premium.
- Los emojis se renderizan diferente en cada sistema operativo, generando inconsistencia visual.
- La iconografía de la app usa **Lucide Icons** (line icons) como sistema visual unificado. Los emojis compiten con esa coherencia.

### Reglas

| Contexto | Prohibido | Correcto |
|---|---|---|
| Títulos de sección | "Profesionales" con emoji | "Profesionales" (texto limpio) |
| Estados | "Confirmado" con checkmark emoji | Dot de color verde + texto "Confirmado" |
| Badges | Emoji + texto | Solo texto con estilo de badge CSS |
| Alertas | Emoji de advertencia | Icono Lucide `alert-triangle` o color de borde |
| Conversaciones del bot (WhatsApp) | Caso especial: ver nota abajo |

> [!NOTE]
> **Excepción: Mensajes del bot de WhatsApp.** En el contexto de conversaciones de WhatsApp (chat del agente IA con pacientes), se permite el uso moderado de emojis ya que es la convención natural del canal. Sin embargo, la interfaz de la app que *muestra* esas conversaciones no debe agregar emojis propios.

---

*Manual generado a partir de auditoría estética de [@espacioholisticoalvarado](https://www.instagram.com/espacioholisticoalvarado/) y análisis del design system actual de la app Nowo.*
