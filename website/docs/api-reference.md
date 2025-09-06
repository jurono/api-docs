# API Reference

The complete API reference is available as an OpenAPI 3.0 specification.

## OpenAPI Specification

You can access the full API specification in various formats:

- **[OpenAPI YAML](/openapi.yaml)** - Complete API specification
- **[Interactive API Explorer](https://editor.swagger.io/?url=https://jurono.github.io/api-docs/openapi.yaml)** - Browse the API interactively

## Key Information

- **Version**: 1.0.0
- **Base URL**: `https://api.jurono.eu/v1`
- **Sandbox URL**: `https://sandbox.api.jurono.eu/v1`
- **Authentication**: JWT Bearer tokens
- **Format**: JSON
- **Endpoints**: 104 public endpoints

## Major Endpoint Categories

### Authentication & User Management
- User registration and login
- Profile management
- Password reset
- Two-factor authentication

### Organization Management
- Organization CRUD operations
- Member management
- Role assignments
- Multi-tenant operations

### Legal Practice Tools
- Case management
- Client profiles
- Document handling
- Legal workflows

### JuroLib Integration
- Lawyer directory search
- Professional profiles
- Certification management

### Analytics & Reporting
- Performance metrics
- Usage statistics
- Business intelligence
- Custom reports

## Rate Limits

- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute  
- **Analytics endpoints**: 20 requests per minute

## Response Format

All responses follow a consistent structure:

```json
{
  "data": { /* Response data */ },
  "meta": {
    "timestamp": "2025-09-06T03:16:25.000Z",
    "version": "1.0.0"
  }
}
```

## Error Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { /* Additional context */ }
  }
}
```

---

*This specification is automatically generated from the main API codebase and updated daily.*