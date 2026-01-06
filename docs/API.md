# Judix API Documentation

**Base URL:** `http://localhost:8080/api`

**Auth Header:** `Authorization: Bearer <token>`

## Authentication

| Endpoint | Method | Body | Description |
|----------|--------|------|-------------|
| `/auth/register` | POST | `{name, email, password}` | Register new user |
| `/auth/login` | POST | `{email, password}` | Login user |
| `/auth/profile` | GET | - | Get user profile (protected) |
| `/auth/profile` | PUT | `{name?, bio?, avatar?}` | Update profile (protected) |

**Response:** Returns user object with JWT token

## Tasks

| Endpoint | Method | Body/Query | Description |
|----------|--------|------------|-------------|
| `/tasks` | POST | `{title, description?, status?, priority?, dueDate?}` | Create task |
| `/tasks` | GET | `?status=&priority=&search=` | Get all tasks |
| `/tasks/:id` | GET | - | Get task by ID |
| `/tasks/:id` | PUT | `{title?, description?, status?, priority?, dueDate?}` | Update task |
| `/tasks/:id` | DELETE | - | Delete task |

**Fields:**
- `status`: pending, in-progress, completed
- `priority`: low, medium, high

## Notes

| Endpoint | Method | Body/Query | Description |
|----------|--------|------------|-------------|
| `/notes` | POST | `{title, content?, category?, tags?, color?}` | Create note |
| `/notes` | GET | `?category=&tag=&search=` | Get all notes |
| `/notes/:id` | GET | - | Get note by ID |
| `/notes/:id` | PUT | `{title?, content?, category?, tags?, color?}` | Update note |
| `/notes/:id` | DELETE | - | Delete note |

**Fields:**
- `category`: general, work, personal, ideas, important
- `color`: Hex color code (default: #fbbf24)

## Posts

| Endpoint | Method | Body/Query | Description |
|----------|--------|------------|-------------|
| `/posts` | POST | `{title, content, author, status?, publishedDate?}` | Create post |
| `/posts` | GET | `?status=&search=` | Get all posts |
| `/posts/:id` | GET | - | Get post by ID |
| `/posts/:id` | PUT | `{title?, content?, author?, status?, publishedDate?}` | Update post |
| `/posts/:id` | DELETE | - | Delete post |

**Fields:**
- `status`: draft, published

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Invalid/missing token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error |

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```
