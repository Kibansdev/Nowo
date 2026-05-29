import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import {
  readDB,
  getActiveProfessionals,
  getActiveWorkshops,
  checkAvailability,
  bookAppointment,
  addInterestedApplicant,
  scheduleWorkshopSession
} from './db-manager.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Inicializar el servidor MCP
const server = new Server(
  {
    name: "nowo-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// Handler para listar recursos disponibles
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "db://data",
        name: "Base de datos (db.json)",
        description: "Contiene profesionales, talleres, turnos e interesados del Espacio Alvarado.",
        mimeType: "application/json"
      },
      {
        uri: "docs://tech-doc",
        name: "Documento Técnico del Programador",
        description: "Guía técnica, arquitectura y especificaciones del sistema.",
        mimeType: "text/markdown"
      },
      {
        uri: "docs://brand-manual",
        name: "Manual de Marca",
        description: "Manual de estilo visual, tipografía y paleta de colores del centro.",
        mimeType: "text/markdown"
      }
    ]
  };
});

// Handler para leer recursos
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  
  if (uri === "db://data") {
    const data = await readDB();
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(data, null, 2)
        }
      ]
    };
  }
  
  if (uri === "docs://tech-doc") {
    try {
      const content = await fs.readFile(join(__dirname, '../docs/documento_tecnico_programador.md'), 'utf-8');
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: content
          }
        ]
      };
    } catch (e) {
      throw new Error(`No se pudo leer el documento técnico: ${e.message}`);
    }
  }

  if (uri === "docs://brand-manual") {
    try {
      const content = await fs.readFile(join(__dirname, '../docs/manual_de_marca.md'), 'utf-8');
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: content
          }
        ]
      };
    } catch (e) {
      throw new Error(`No se pudo leer el manual de marca: ${e.message}`);
    }
  }

  throw new Error(`Recurso no encontrado: ${uri}`);
});

// Handler para listar herramientas
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "listar_profesionales",
        description: "Obtiene la lista de profesionales activos en el espacio holístico, opcionalmente filtrando por especialidad.",
        inputSchema: {
          type: "object",
          properties: {
            especialidad: {
              type: "string",
              description: "Especialidad o área a buscar (ej: psicología, nutrición, yoga)"
            }
          }
        }
      },
      {
        name: "buscar_disponibilidad",
        description: "Consulta los horarios (slots de 1 hora) disponibles para un profesional en una fecha determinada (formato YYYY-MM-DD).",
        inputSchema: {
          type: "object",
          properties: {
            profName: {
              type: "string",
              description: "Nombre del profesional (ej: Lic. Daniel Rodríguez)"
            },
            dateKey: {
              type: "string",
              description: "Fecha en formato YYYY-MM-DD (ej: 2026-06-03)"
            }
          },
          required: ["profName", "dateKey"]
        }
      },
      {
        name: "agendar_turno",
        description: "Reserva un turno para un paciente con un profesional en un consultorio, fecha y hora determinados.",
        inputSchema: {
          type: "object",
          properties: {
            profName: {
              type: "string",
              description: "Nombre del profesional (ej: Lic. Daniel Rodríguez)"
            },
            dateKey: {
              type: "string",
              description: "Fecha en formato YYYY-MM-DD (ej: 2026-06-03)"
            },
            hour: {
              type: "string",
              description: "Hora en formato HH:MM (ej: 14:00)"
            },
            patientName: {
              type: "string",
              description: "Nombre completo del paciente"
            },
            patientTel: {
              type: "string",
              description: "Teléfono de contacto del paciente"
            },
            service: {
              type: "string",
              description: "Servicio o especialidad solicitado (opcional)"
            }
          },
          required: ["profName", "dateKey", "hour", "patientName"]
        }
      },
      {
        name: "listar_talleres",
        description: "Obtiene la lista de talleres y clases grupales activos, con sus instructores y cupos de inscriptos.",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "agregar_sesion_taller",
        description: "Programa una nueva sesión (clase) para un taller existente en una fecha, hora y espacio físico determinados.",
        inputSchema: {
          type: "object",
          properties: {
            tallerName: {
              type: "string",
              description: "Nombre del taller (ej: Yoga Terapéutico)"
            },
            date: {
              type: "string",
              description: "Fecha de la sesión YYYY-MM-DD"
            },
            timeStart: {
              type: "string",
              description: "Hora de inicio HH:MM"
            },
            timeEnd: {
              type: "string",
              description: "Hora de finalización HH:MM (opcional)"
            },
            space: {
              type: "string",
              description: "Espacio asignado (ej: Hall, Consultorio A, etc.)"
            },
            price: {
              type: "number",
              description: "Precio de la sesión por persona"
            }
          },
          required: ["tallerName", "date", "timeStart"]
        }
      },
      {
        name: "registrar_profesional_interesado",
        description: "Registra los datos de contacto y la propuesta de un profesional interesado en sumarse al equipo o alquilar consultorios.",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Nombre del profesional interesado"
            },
            specialty: {
              type: "string",
              description: "Especialidad / Profesión"
            },
            tel: {
              type: "string",
              description: "Teléfono de contacto"
            },
            ig: {
              type: "string",
              description: "Usuario de Instagram (opcional)"
            },
            description: {
              type: "string",
              description: "Propuesta o mensaje del profesional"
            }
          },
          required: ["name", "specialty", "tel"]
        }
      }
    ]
  };
});

// Handler para la ejecución de herramientas
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const name = request.params.name;
  const args = request.params.arguments || {};
  
  try {
    switch (name) {
      case "listar_profesionales": {
        const list = await getActiveProfessionals(args.especialidad);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(list, null, 2)
            }
          ]
        };
      }
      
      case "buscar_disponibilidad": {
        const res = await checkAvailability(args.profName, args.dateKey);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(res, null, 2)
            }
          ]
        };
      }
      
      case "agendar_turno": {
        const res = await bookAppointment(
          args.profName,
          args.dateKey,
          args.hour,
          args.patientName,
          args.patientTel,
          args.service
        );
        return {
          content: [
            {
              type: "text",
              text: `Turno agendado con éxito:\n${JSON.stringify(res, null, 2)}`
            }
          ]
        };
      }
      
      case "listar_talleres": {
        const list = await getActiveWorkshops();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(list, null, 2)
            }
          ]
        };
      }
      
      case "agregar_sesion_taller": {
        const res = await scheduleWorkshopSession(
          args.tallerName,
          args.date,
          args.timeStart,
          args.timeEnd,
          args.space,
          args.price
        );
        return {
          content: [
            {
              type: "text",
              text: `Sesión programada con éxito:\n${JSON.stringify(res, null, 2)}`
            }
          ]
        };
      }
      
      case "registrar_profesional_interesado": {
        const res = await addInterestedApplicant(
          args.name,
          args.specialty,
          args.tel,
          args.ig,
          args.description
        );
        return {
          content: [
            {
              type: "text",
              text: `Profesional interesado registrado con éxito:\n${JSON.stringify(res, null, 2)}`
            }
          ]
        };
      }
      
      default:
        throw new Error(`Herramienta no implementada: ${name}`);
    }
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Error ejecutando la herramienta "${name}": ${error.message}`
        }
      ]
    };
  }
});

// Función de inicio principal
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Servidor MCP de Nowo / Espacio Alvarado iniciado en stdio.");
}

main().catch((error) => {
  console.error("Fallo fatal en el servidor MCP:", error);
  process.exit(1);
});
