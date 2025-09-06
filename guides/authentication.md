# Authentication
- Scheme: Bearer tokens (JWT or API key-as-bearer)
- Header: `Authorization: Bearer <token>`
- Token lifetime & scopes: `read:leads`, `write:leads`, `files:upload`
- Organization context: `X-Jurono-Org-Id: <uuid>` (for multi-tenant calls)