import swaggerJsdoc from "swagger-jsdoc";
import { environment } from "./environment";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Eventos API",
      version: "1.0.0",
      description: "RESTful API for Eventos application with Google Sheets integration",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: `http://localhost:${environment.port}/api`,
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Event: {
          type: "object",
          required: ["id", "title", "description", "date", "location", "createdAt", "updatedAt"],
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for the event",
              example: "event-123",
            },
            title: {
              type: "string",
              description: "Event title",
              example: "Summer Festival",
            },
            description: {
              type: "string",
              description: "Event description",
              example: "A fun summer festival with music and food",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Event date and time in ISO 8601 format",
              example: "2024-07-15T18:00:00Z",
            },
            location: {
              type: "string",
              description: "Event location",
              example: "Central Park, New York",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
              example: "2024-01-01T00:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
              example: "2024-01-01T00:00:00Z",
            },
          },
        },
        User: {
          type: "object",
          required: ["id", "name", "email", "createdAt", "updatedAt"],
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for the user",
              example: "user-123",
            },
            name: {
              type: "string",
              description: "User's full name",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
              example: "john.doe@example.com",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
              example: "2024-01-01T00:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
              example: "2024-01-01T00:00:00Z",
            },
          },
        },
        CreateEventRequest: {
          type: "object",
          required: ["title", "description", "date", "location"],
          properties: {
            title: {
              type: "string",
              description: "Event title",
              example: "Summer Festival",
            },
            description: {
              type: "string",
              description: "Event description",
              example: "A fun summer festival with music and food",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Event date and time in ISO 8601 format",
              example: "2024-07-15T18:00:00Z",
            },
            location: {
              type: "string",
              description: "Event location",
              example: "Central Park, New York",
            },
          },
        },
        UpdateEventRequest: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Event title",
              example: "Summer Festival",
            },
            description: {
              type: "string",
              description: "Event description",
              example: "A fun summer festival with music and food",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Event date and time in ISO 8601 format",
              example: "2024-07-15T18:00:00Z",
            },
            location: {
              type: "string",
              description: "Event location",
              example: "Central Park, New York",
            },
          },
        },
        CreateUserRequest: {
          type: "object",
          required: ["id", "name", "email"],
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for the user",
              example: "user-123",
            },
            name: {
              type: "string",
              description: "User's full name",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
              example: "john.doe@example.com",
            },
          },
        },
        UpdateUserRequest: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "User's full name",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
              example: "john.doe@example.com",
            },
          },
        },
        SendEmailRequest: {
          type: "object",
          required: ["to", "subject"],
          properties: {
            to: {
              oneOf: [
                { type: "string", format: "email" },
                { type: "array", items: { type: "string", format: "email" } },
              ],
              description: "Recipient email address(es)",
              example: "recipient@example.com",
            },
            subject: {
              type: "string",
              description: "Email subject",
              example: "Welcome to Eventos",
            },
            text: {
              type: "string",
              description: "Plain text email content",
              example: "This is a plain text email",
            },
            html: {
              type: "string",
              description: "HTML email content",
              example: "<p>This is an HTML email</p>",
            },
            cc: {
              oneOf: [
                { type: "string", format: "email" },
                { type: "array", items: { type: "string", format: "email" } },
              ],
              description: "CC email address(es)",
            },
            bcc: {
              oneOf: [
                { type: "string", format: "email" },
                { type: "array", items: { type: "string", format: "email" } },
              ],
              description: "BCC email address(es)",
            },
          },
        },
        PaginationMeta: {
          type: "object",
          properties: {
            page: {
              type: "number",
              description: "Current page number",
              example: 1,
            },
            limit: {
              type: "number",
              description: "Items per page",
              example: 10,
            },
            total: {
              type: "number",
              description: "Total number of items",
              example: 50,
            },
            totalPages: {
              type: "number",
              description: "Total number of pages",
              example: 5,
            },
            hasNextPage: {
              type: "boolean",
              description: "Whether there's a next page",
              example: true,
            },
            hasPreviousPage: {
              type: "boolean",
              description: "Whether there's a previous page",
              example: false,
            },
          },
        },
        PaginatedEventsResponse: {
          type: "object",
          properties: {
            results: {
              type: "array",
              items: { $ref: "#/components/schemas/Event" },
            },
            meta: { $ref: "#/components/schemas/PaginationMeta" },
          },
        },
        PaginatedUsersResponse: {
          type: "object",
          properties: {
            results: {
              type: "array",
              items: { $ref: "#/components/schemas/User" },
            },
            meta: { $ref: "#/components/schemas/PaginationMeta" },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
              example: "Resource not found",
            },
            statusCode: {
              type: "number",
              description: "HTTP status code",
              example: 404,
            },
          },
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "ok",
            },
          },
        },
        EmailResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Email sent successfully",
            },
          },
        },
      },
    },
  },
  apis: ["./src/presentation/http/routes/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

