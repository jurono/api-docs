# Authentication & User Management API

Complete authentication and user management endpoints for secure access control.

## Overview

The authentication system uses JWT Bearer tokens with configurable scopes and multi-factor authentication support.

**Base Path**: `/auth`

## Endpoints

### User Authentication

#### `POST /auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "remember": false
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "usr_12345",
    "email": "user@example.com",
    "name": "John Doe",
    "verified": true
  },
  "expires_at": "2025-09-07T03:16:25.000Z"
}
```

#### `POST /auth/register`
Register new user account.

**Request Body:**
```json
{
  "email": "newuser@example.com", 
  "password": "securePassword123",
  "name": "Jane Smith",
  "organization_name": "Smith Law Firm"
}
```

#### `POST /auth/logout`
Invalidate current session token.

**Headers:**
```http
Authorization: Bearer <token>
```

#### `POST /auth/refresh`
Refresh expired JWT token.

**Request Body:**
```json
{
  "refresh_token": "refresh_abc123..."
}
```

### Profile Management

#### `GET /auth/profile`
Get current user profile information.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "usr_12345",
  "email": "user@example.com",
  "name": "John Doe", 
  "avatar": "https://api.jurono.eu/avatars/usr_12345.jpg",
  "verified": true,
  "created_at": "2025-01-15T10:30:00.000Z",
  "last_login": "2025-09-06T14:22:10.000Z",
  "organizations": [
    {
      "id": "org_67890",
      "name": "Doe & Associates",
      "role": "admin"
    }
  ]
}
```

#### `PUT /auth/profile`
Update user profile information.

**Request Body:**
```json
{
  "name": "John Q. Doe",
  "phone": "+1-555-123-4567",
  "bio": "Senior Partner at Doe & Associates"
}
```

#### `POST /auth/change-password`
Change user password.

**Request Body:**
```json
{
  "current_password": "oldPassword123",
  "new_password": "newSecurePassword456"
}
```

### Two-Factor Authentication

#### `POST /auth/2fa/enable`
Enable two-factor authentication.

**Response:**
```json
{
  "qr_code": "data:image/png;base64,iVBOR...",
  "backup_codes": ["123456", "789012", "345678"]
}
```

#### `POST /auth/2fa/verify`
Verify 2FA setup with TOTP code.

**Request Body:**
```json
{
  "totp_code": "123456"
}
```

#### `DELETE /auth/2fa/disable`
Disable two-factor authentication.

**Request Body:**
```json
{
  "totp_code": "123456"
}
```

### Password Reset

#### `POST /auth/forgot-password`
Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### `POST /auth/reset-password`
Reset password using reset token.

**Request Body:**
```json
{
  "token": "reset_token_abc123",
  "new_password": "newSecurePassword456"
}
```

### Email Verification

#### `POST /auth/resend-verification`
Resend email verification.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### `POST /auth/verify-email`
Verify email address using token.

**Request Body:**
```json
{
  "token": "verify_token_xyz789"
}
```

## Authentication Scopes

JWT tokens include scopes that define access permissions:

- `read:profile` - Read user profile
- `write:profile` - Update user profile  
- `read:organizations` - Read organization data
- `write:organizations` - Modify organization data
- `admin:users` - Manage other users (admin only)

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_CREDENTIALS` | Email/password combination invalid |
| `ACCOUNT_LOCKED` | Too many failed login attempts |
| `EMAIL_NOT_VERIFIED` | Email verification required |
| `2FA_REQUIRED` | Two-factor authentication required |
| `TOKEN_EXPIRED` | JWT token has expired |
| `INSUFFICIENT_SCOPE` | Token lacks required permissions |

## Rate Limiting

Authentication endpoints have strict rate limiting:
- **Login attempts**: 5 per minute per IP
- **Password reset**: 3 per hour per email
- **Email verification**: 3 per hour per email

## Security Features

- **Bcrypt password hashing** with configurable rounds
- **JWT tokens** with configurable expiration
- **Session management** with refresh token rotation
- **Account lockout** after failed attempts
- **Email verification** required for new accounts
- **2FA support** using TOTP (Google Authenticator compatible)

## Integration Examples

See [Authentication Guide](/docs/guides/authentication) for detailed implementation examples.