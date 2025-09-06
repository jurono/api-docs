# API Reference

The Jurono API provides comprehensive access to all legal practice management functionality through a well-structured REST API.

## Overview

- **Version**: 1.0.0
- **Base URL**: `https://api.jurono.eu/v1`
- **Sandbox URL**: `https://sandbox.api.jurono.eu/v1`
- **Authentication**: JWT Bearer tokens
- **Format**: JSON
- **Total Endpoints**: 104 public endpoints

## API Categories

### [Authentication & User Management](./authentication)
Secure user authentication, registration, profile management, and session handling.

**Key Endpoints:**
- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `GET /auth/profile` - Get user profile
- `POST /auth/logout` - User logout

### [Organization Management](./organizations)
Multi-tenant organization operations, member management, and role assignments.

**Key Endpoints:**
- `GET /organizations` - List organizations
- `POST /organizations` - Create organization
- `GET /organizations/{id}/members` - List members
- `POST /organizations/{id}/invite` - Invite members

### [Legal Practice Tools](./legal-practice)  
Case management, client profiles, legal workflows, and practice operations.

**Key Endpoints:**
- `GET /cases` - List cases
- `POST /cases` - Create case
- `GET /clients` - List clients
- `POST /clients` - Create client profile

### [Document Management](./documents)
Secure document handling, version control, and file operations.

**Key Endpoints:**
- `POST /documents/upload` - Upload document
- `GET /documents` - List documents
- `GET /documents/{id}` - Get document details
- `DELETE /documents/{id}` - Delete document

### [JuroLib Integration](./jurolib)
Lawyer directory search, professional profiles, and certification management.

**Key Endpoints:**
- `GET /jurolib/lawyers` - Search lawyers
- `GET /jurolib/lawyers/{id}` - Get lawyer profile
- `GET /jurolib/specializations` - List specializations

### [Analytics & Reporting](./analytics)
Performance metrics, usage statistics, and business intelligence.

**Key Endpoints:**
- `GET /analytics/dashboard` - Dashboard metrics
- `GET /analytics/reports` - Generate reports
- `POST /analytics/track` - Track events

## Common Patterns

### Authentication
All endpoints require JWT Bearer token authentication:
```http
Authorization: Bearer <your-jwt-token>
```

### Multi-Tenant Context
For organization-specific operations:
```http
X-Jurono-Org-Id: <organization-uuid>
```

### Pagination
Cursor-based pagination for performance:
```http
GET /endpoint?cursor=<token>&limit=50
```

### Error Handling
Consistent error response format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { }
  }
}
```

## Rate Limits

- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute  
- **Analytics endpoints**: 20 requests per minute

## Resources

- [**OpenAPI Specification**](/api-docs/openapi.yaml) - Complete API specification
- [**Postman Collection**](/api-docs/postman/Jurono.postman_collection.json) - Ready-to-use API collection
- [**Code Examples**](/docs/examples/) - Sample code in multiple languages

---

*This API reference is automatically generated from the main API codebase and updated daily.*