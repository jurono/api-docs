# Organization Management API

Multi-tenant organization operations, member management, and role-based access control.

## Overview

The organization system supports multi-tenant architecture where users can belong to multiple organizations with different roles.

**Base Path**: `/organizations`

## Endpoints

### Organization Operations

#### `GET /organizations`
List organizations accessible to the current user.

**Query Parameters:**
- `limit` (integer, max 100) - Number of results per page
- `cursor` (string) - Pagination cursor
- `role` (string) - Filter by user role: `owner`, `admin`, `member`

**Response:**
```json
{
  "data": [
    {
      "id": "org_12345",
      "name": "Smith & Associates Law Firm",
      "slug": "smith-associates", 
      "description": "Full-service legal practice",
      "logo": "https://api.jurono.eu/logos/org_12345.jpg",
      "website": "https://smithlaw.com",
      "phone": "+1-555-123-4567",
      "address": {
        "street": "123 Legal Ave",
        "city": "New York",
        "state": "NY",
        "postal_code": "10001",
        "country": "US"
      },
      "settings": {
        "timezone": "America/New_York",
        "currency": "USD",
        "language": "en"
      },
      "created_at": "2024-01-15T10:30:00.000Z",
      "member_count": 12,
      "user_role": "admin"
    }
  ],
  "pagination": {
    "next_cursor": "org_67890",
    "has_more": true
  }
}
```

#### `POST /organizations`
Create a new organization.

**Request Body:**
```json
{
  "name": "Johnson Legal Services",
  "description": "Criminal defense and personal injury law",
  "website": "https://johnsonlegal.com",
  "phone": "+1-555-987-6543",
  "address": {
    "street": "456 Court Street", 
    "city": "Los Angeles",
    "state": "CA",
    "postal_code": "90210",
    "country": "US"
  },
  "settings": {
    "timezone": "America/Los_Angeles",
    "currency": "USD"
  }
}
```

#### `GET /organizations/{id}`
Get organization details.

**Headers:**
```http
X-Jurono-Org-Id: org_12345
```

#### `PUT /organizations/{id}`
Update organization information.

**Request Body:**
```json
{
  "name": "Smith & Associates LLP",
  "description": "Updated description",
  "website": "https://smithassociates.com"
}
```

#### `DELETE /organizations/{id}`
Delete organization (owner only).

### Member Management

#### `GET /organizations/{id}/members`
List organization members.

**Query Parameters:**
- `role` (string) - Filter by role: `owner`, `admin`, `member`
- `status` (string) - Filter by status: `active`, `pending`, `suspended`

**Response:**
```json
{
  "data": [
    {
      "id": "usr_12345",
      "name": "John Smith",
      "email": "john@smithlaw.com",
      "avatar": "https://api.jurono.eu/avatars/usr_12345.jpg",
      "role": "owner",
      "status": "active",
      "joined_at": "2024-01-15T10:30:00.000Z",
      "last_active": "2025-09-06T14:22:10.000Z"
    }
  ]
}
```

#### `POST /organizations/{id}/invite`
Invite new member to organization.

**Request Body:**
```json
{
  "email": "newlawyer@example.com",
  "role": "member",
  "message": "Welcome to our legal team!"
}
```

#### `PUT /organizations/{id}/members/{user_id}`
Update member role or status.

**Request Body:**
```json
{
  "role": "admin",
  "status": "active"
}
```

#### `DELETE /organizations/{id}/members/{user_id}`
Remove member from organization.

### Invitations

#### `GET /organizations/{id}/invitations`
List pending invitations.

**Response:**
```json
{
  "data": [
    {
      "id": "inv_12345",
      "email": "pending@example.com",
      "role": "member", 
      "invited_by": "John Smith",
      "invited_at": "2025-09-06T10:00:00.000Z",
      "expires_at": "2025-09-13T10:00:00.000Z",
      "status": "pending"
    }
  ]
}
```

#### `DELETE /organizations/{id}/invitations/{invitation_id}`
Cancel pending invitation.

#### `POST /invitations/{invitation_id}/accept`
Accept organization invitation (called by invitee).

#### `POST /invitations/{invitation_id}/decline`
Decline organization invitation (called by invitee).

### Billing & Subscription

#### `GET /organizations/{id}/subscription`
Get organization subscription details.

**Response:**
```json
{
  "plan": "professional",
  "status": "active",
  "seats": 10,
  "used_seats": 8,
  "billing_cycle": "monthly",
  "next_billing_date": "2025-10-06T00:00:00.000Z",
  "amount": 99.00,
  "currency": "USD"
}
```

#### `PUT /organizations/{id}/subscription`
Update subscription plan.

**Request Body:**
```json
{
  "plan": "enterprise",
  "seats": 25,
  "billing_cycle": "annual"
}
```

## Organization Roles

### Role Hierarchy
1. **Owner** - Full control including billing and deletion
2. **Admin** - Manage members, settings, and most features
3. **Member** - Standard access to organization features

### Role Permissions

| Permission | Owner | Admin | Member |
|------------|-------|--------|--------|
| View organization | ✅ | ✅ | ✅ |
| Edit organization details | ✅ | ✅ | ❌ |
| Manage billing | ✅ | ❌ | ❌ |
| Delete organization | ✅ | ❌ | ❌ |
| Invite members | ✅ | ✅ | ❌ |
| Remove members | ✅ | ✅ | ❌ |
| Change member roles | ✅ | ✅ | ❌ |
| View all cases | ✅ | ✅ | ✅ |
| Manage organization settings | ✅ | ✅ | ❌ |

## Multi-Tenant Context

When making API calls that operate on organization-specific data, include the organization context:

```http
X-Jurono-Org-Id: org_12345
```

This header:
- Specifies which organization context to operate in
- Is required for most non-auth endpoints
- Must match an organization the user belongs to
- Enables proper data isolation

## Organization Settings

Organizations can configure various settings:

```json
{
  "general": {
    "timezone": "America/New_York",
    "currency": "USD", 
    "language": "en",
    "date_format": "MM/DD/YYYY"
  },
  "security": {
    "require_2fa": false,
    "session_timeout": 480,
    "ip_whitelist": []
  },
  "integrations": {
    "calendar_sync": true,
    "email_notifications": true,
    "slack_webhook": "https://hooks.slack.com/..."
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `ORG_NOT_FOUND` | Organization does not exist |
| `ACCESS_DENIED` | User lacks permission for organization |
| `INVALID_ROLE` | Invalid role specified |
| `OWNER_REQUIRED` | Operation requires organization owner |
| `SEAT_LIMIT_EXCEEDED` | Organization has reached member limit |
| `INVITATION_EXPIRED` | Invitation link has expired |

## Rate Limiting

- **Organization operations**: 100 requests per minute
- **Member invitations**: 20 per hour per organization
- **Bulk operations**: 10 per minute

## Best Practices

1. **Always include organization context** for multi-tenant operations
2. **Cache organization data** to reduce API calls
3. **Validate user permissions** before making organization changes
4. **Use pagination** for large member lists
5. **Handle role changes gracefully** in your application