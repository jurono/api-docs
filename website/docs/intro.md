---
sidebar_position: 1
---

# Getting Started with the Jurono API

Welcome to the **Jurono API Documentation**! This guide will help you get started with integrating the Jurono Legal Practice Management API into your applications.

## API Overview

The Jurono API is a comprehensive REST API that provides access to all core functionality of the Jurono Legal Practice Management Platform, including:

- **Authentication & User Management** - Secure user authentication, registration, and profile management
- **Organization Management** - Multi-tenant organization operations and member management
- **Legal Practice Tools** - Case management, client profiles, and legal workflows
- **JuroLib Integration** - Lawyer directory search and profile management
- **Document Management** - Secure document handling and version control
- **Analytics & Reporting** - Performance metrics and business intelligence

## Base URLs

- **Production**: `https://api.jurono.eu/v1`
- **Sandbox**: `https://sandbox.api.jurono.eu/v1`

## Quick Start

### 1. Authentication

All API endpoints require authentication via JWT Bearer tokens:

```bash
curl -H "Authorization: Bearer <YOUR_TOKEN>" \
  https://sandbox.api.jurono.eu/v1/health
```

### 2. Get Your API Token

Contact your system administrator or use the authentication endpoint:

```bash
curl -X POST https://sandbox.api.jurono.eu/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

### 3. Make Your First Request

Test connectivity with the health endpoint:

```bash
curl -H "Authorization: Bearer <YOUR_TOKEN>" \
  https://sandbox.api.jurono.eu/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2025-09-06T03:16:25.000Z"
}
```

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **Analytics endpoints**: 20 requests per minute

## Error Handling

All errors follow a consistent format:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is invalid",
    "details": {
      "field": "email",
      "issue": "Email address is required"
    }
  }
}
```

## Next Steps

- 📖 [**API Reference**](/docs/api-reference) - Complete API specification
- 🔐 [**Authentication Guide**](/docs/guides/authentication) - Detailed authentication flow
- 📄 [**Code Examples**](/docs/examples/) - Sample code in multiple languages
- 📡 [**Webhooks**](/docs/guides/webhooks) - Real-time event notifications

## Support

- **Documentation Issues**: [GitHub Issues](https://github.com/jurono/api-docs/issues)
- **API Support**: support@jurono.eu
- **Security Issues**: security@jurono.eu

---

*This documentation is automatically synced from the main API repository and updated daily.*
