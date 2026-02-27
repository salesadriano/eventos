# RESTful API Documentation

This document describes all RESTful API endpoints available in the Eventos application.

## Base URL

All API endpoints are prefixed with `/api`:

```
http://localhost:4000/api
```

## HTTP Status Codes

- `200 OK` - Successful GET, PUT, or PATCH request
- `201 Created` - Successful POST request (resource created)
- `204 No Content` - Successful DELETE request
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Endpoints

### Health Check

**GET** `/api/health`

Check if the API is running.

**Response:**

```json
{
  "status": "ok"
}
```

---

### Events

#### List All Events (Paginated)

**GET** `/api/events`

Retrieve all events with pagination.

#### Get All Events (No Pagination)

**GET** `/api/events/all`

Retrieve all events without pagination. Returns a simple array of all events.

**Response:** `200 OK`

```json
[
  {
    "id": "event-id",
    "title": "Event Title",
    "description": "Event description",
    "date": "2024-01-15T10:00:00Z",
    "location": "Event Location",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

**Empty Results Example:**

```json
[]
```

---

**Query Parameters:**

- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10, max: 100)

**Response:** `200 OK`

```json
{
  "results": [
    {
      "id": "event-id",
      "title": "Event Title",
      "description": "Event description",
      "date": "2024-01-15T10:00:00Z",
      "location": "Event Location",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Example:**

```
GET /api/events?page=2&limit=20
```

#### Get Event by ID

**GET** `/api/events/:id`

Retrieve a specific event by ID.

**Parameters:**

- `id` (path) - Event ID

**Response:** `200 OK`

```json
{
  "id": "event-id",
  "title": "Event Title",
  "description": "Event description",
  "date": "2024-01-15T10:00:00Z",
  "location": "Event Location",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Create Event

**POST** `/api/events`

Create a new event.

**Request Body:**

```json
{
  "title": "Event Title",
  "description": "Event description",
  "date": "2024-01-15T10:00:00Z",
  "location": "Event Location"
}
```

**Response:** `201 Created`

```json
{
  "id": "generated-event-id",
  "title": "Event Title",
  "description": "Event description",
  "date": "2024-01-15T10:00:00Z",
  "location": "Event Location",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Update Event (Full)

**PUT** `/api/events/:id`

Update an entire event (full replacement).

**Parameters:**

- `id` (path) - Event ID

**Request Body:**

```json
{
  "title": "Updated Event Title",
  "description": "Updated description",
  "date": "2024-01-20T10:00:00Z",
  "location": "Updated Location"
}
```

**Response:** `200 OK`

```json
{
  "id": "event-id",
  "title": "Updated Event Title",
  "description": "Updated description",
  "date": "2024-01-20T10:00:00Z",
  "location": "Updated Location",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T00:00:00Z"
}
```

#### Update Event (Partial)

**PATCH** `/api/events/:id`

Partially update an event.

**Parameters:**

- `id` (path) - Event ID

**Request Body:**

```json
{
  "title": "Updated Title Only"
}
```

**Response:** `200 OK`

```json
{
  "id": "event-id",
  "title": "Updated Title Only",
  "description": "Original description",
  "date": "2024-01-15T10:00:00Z",
  "location": "Original Location",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T00:00:00Z"
}
```

#### Delete Event

**DELETE** `/api/events/:id`

Delete an event.

**Parameters:**

- `id` (path) - Event ID

**Response:** `204 No Content`

---

### Users

#### List All Users (Paginated)

**GET** `/api/users`

Retrieve all users with pagination.

#### Get All Users (No Pagination)

**GET** `/api/users/all`

Retrieve all users without pagination. Returns a simple array of all users.

**Response:** `200 OK`

```json
[
  {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

**Empty Results Example:**

```json
[]
```

---

**Query Parameters:**

- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10, max: 100)

**Response:** `200 OK`

```json
{
  "results": [
    {
      "id": "user-id",
      "name": "User Name",
      "email": "user@example.com",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Example:**

```
GET /api/users?page=2&limit=20
```

#### Get User by ID

**GET** `/api/users/:id`

Retrieve a specific user by ID.

**Parameters:**

- `id` (path) - User ID

**Response:** `200 OK`

```json
{
  "id": "user-id",
  "name": "User Name",
  "email": "user@example.com",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Create User

**POST** `/api/users`

Create a new user.

**Request Body:**

```json
{
  "name": "User Name",
  "email": "user@example.com"
}
```

**Response:** `201 Created`

```json
{
  "id": "generated-user-id",
  "name": "User Name",
  "email": "user@example.com",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Update User (Full)

**PUT** `/api/users/:id`

Update an entire user (full replacement).

**Parameters:**

- `id` (path) - User ID

**Request Body:**

```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

**Response:** `200 OK`

#### Update User (Partial)

**PATCH** `/api/users/:id`

Partially update a user.

**Parameters:**

- `id` (path) - User ID

**Request Body:**

```json
{
  "name": "Updated Name Only"
}
```

**Response:** `200 OK`

#### Delete User

**DELETE** `/api/users/:id`

Delete a user.

**Parameters:**

- `id` (path) - User ID

**Response:** `204 No Content`

---

### Emails

#### Send Email

**POST** `/api/emails`

Create and send an email.

**Request Body:**

```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "text": "Plain text content",
  "html": "<p>HTML content</p>",
  "cc": ["cc1@example.com", "cc2@example.com"],
  "bcc": ["bcc@example.com"],
  "attachments": [
    {
      "filename": "document.pdf",
      "content": "base64-encoded-content",
      "contentType": "application/pdf"
    }
  ]
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Note:** `to`, `subject`, and either `text` or `html` are required. `cc`, `bcc`, and `attachments` are optional.

---

### Legacy Sheets API

The following endpoints are kept for backward compatibility. Consider migrating to RESTful endpoints.

#### Read Values

**GET** `/api/sheets/values?range=Sheet1!A1:B10`

#### Append Values

**POST** `/api/sheets/append`

#### Update Values

**PUT** `/api/sheets/values`

#### Clear Values

**POST** `/api/sheets/clear`

---

## Pagination

All list endpoints (`GET /api/events`, `GET /api/users`) support pagination via query parameters:

- **`page`** - Page number (default: 1, minimum: 1)
- **`limit`** - Items per page (default: 10, minimum: 1, maximum: 100)

**Response Format:**
All paginated responses follow this structure:

```json
{
  "results": [...],  // Array of items (empty array if no data)
  "meta": {
    "page": 1,           // Current page number
    "limit": 10,         // Items per page
    "total": 50,         // Total number of items
    "totalPages": 5,     // Total number of pages
    "hasNextPage": true, // Whether there's a next page
    "hasPreviousPage": false // Whether there's a previous page
  }
}
```

**Empty Results Example:**
When there's no data, `results` will always be an empty array:

```json
{
  "results": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

## RESTful Principles Applied

✅ **Resource-based URLs** - Use nouns, not verbs (`/events`, not `/getEvents`)
✅ **HTTP Methods** - Proper use of GET, POST, PUT, PATCH, DELETE
✅ **Status Codes** - Appropriate HTTP status codes for each operation
✅ **Plural Resources** - Resource names are plural (`/events`, `/users`, `/emails`)
✅ **Nested Resources** - Use path parameters for resource identification (`/events/:id`)
✅ **Stateless** - Each request contains all information needed to process it
✅ **JSON Responses** - Consistent JSON format for all responses
✅ **Pagination** - All list endpoints support pagination with consistent response format

## Example Requests

### Using cURL

```bash
# List all events (with pagination)
curl http://localhost:4000/api/events?page=1&limit=10

# List events - page 2 with 20 items per page
curl http://localhost:4000/api/events?page=2&limit=20

# Get all events without pagination
curl http://localhost:4000/api/events/all

# Get all users without pagination
curl http://localhost:4000/api/users/all

# Get specific event
curl http://localhost:4000/api/events/event-id

# Create event
curl -X POST http://localhost:4000/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"New Event","description":"Description","date":"2024-01-15T10:00:00Z","location":"Location"}'

# Update event (partial)
curl -X PATCH http://localhost:4000/api/events/event-id \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'

# Delete event
curl -X DELETE http://localhost:4000/api/events/event-id

# Send email
curl -X POST http://localhost:4000/api/emails \
  -H "Content-Type: application/json" \
  -d '{"to":"recipient@example.com","subject":"Test","text":"Hello World"}'
```

### Using Thunder Client (VS Code)

The dev container includes Thunder Client extension. You can:

1. Open Thunder Client in VS Code
2. Import the API endpoints
3. Test all endpoints directly from the IDE
