# Document Management API

Secure document handling, version control, and file operations for legal documents.

## Overview

The document management system provides secure storage, organization, and version control for all legal documents with advanced search and collaboration features.

**Base Path**: `/documents`

## Document Operations

### `POST /documents/upload`
Upload a new document or new version of existing document.

**Request**: Multipart form data
- `file` (file) - Document file (PDF, DOCX, etc.)
- `title` (string) - Document title
- `description` (string, optional) - Document description
- `case_id` (string, optional) - Associated case ID
- `client_id` (string, optional) - Associated client ID  
- `folder_id` (string, optional) - Folder to place document
- `tags` (array, optional) - Document tags

**Response:**
```json
{
  "id": "doc_12345",
  "title": "Contract - Smith Employment Agreement",
  "filename": "smith_employment_contract_v2.pdf",
  "size": 245760,
  "mime_type": "application/pdf",
  "checksum": "sha256:abc123...",
  "version": 2,
  "status": "processing",
  "uploaded_by": {
    "id": "usr_11111",
    "name": "Jane Doe"
  },
  "created_at": "2025-09-06T14:22:10.000Z",
  "case": {
    "id": "case_67890", 
    "title": "Smith Employment Dispute"
  }
}
```

### `GET /documents`
List documents with filtering and search.

**Query Parameters:**
- `search` (string) - Full-text search in title and content
- `case_id` (string) - Filter by case
- `client_id` (string) - Filter by client
- `folder_id` (string) - Filter by folder
- `type` (string) - Filter by document type
- `tags` (array) - Filter by tags
- `status` (string) - Filter by status: `active`, `archived`, `deleted`
- `limit` (integer, max 100) - Results per page
- `cursor` (string) - Pagination cursor

**Response:**
```json
{
  "data": [
    {
      "id": "doc_12345",
      "title": "Contract - Smith Employment Agreement", 
      "filename": "smith_employment_contract_v2.pdf",
      "description": "Updated employment agreement with new terms",
      "size": 245760,
      "mime_type": "application/pdf",
      "version": 2,
      "status": "active",
      "tags": ["contract", "employment", "confidential"],
      "case": {
        "id": "case_67890",
        "title": "Smith Employment Dispute"
      },
      "uploaded_by": {
        "id": "usr_11111", 
        "name": "Jane Doe"
      },
      "created_at": "2025-09-06T14:22:10.000Z",
      "last_accessed": "2025-09-06T16:45:30.000Z"
    }
  ],
  "pagination": {
    "next_cursor": "doc_67890",
    "has_more": true
  }
}
```

### `GET /documents/{id}`
Get document details and metadata.

**Response includes:**
- Document metadata
- Version history
- Access permissions
- Audit trail
- OCR extracted text (if available)

### `GET /documents/{id}/download`
Download document file.

**Response**: Binary file with appropriate headers

### `GET /documents/{id}/preview`
Get document preview (thumbnail or web-viewable version).

### `PUT /documents/{id}`
Update document metadata.

**Request Body:**
```json
{
  "title": "Updated Contract Title",
  "description": "Updated description",
  "tags": ["contract", "employment", "final"],
  "case_id": "case_67890"
}
```

### `DELETE /documents/{id}`
Move document to trash (soft delete).

## Version Control

### `GET /documents/{id}/versions`
List all versions of a document.

**Response:**
```json
{
  "data": [
    {
      "version": 2,
      "size": 245760,
      "checksum": "sha256:abc123...",
      "uploaded_by": {
        "id": "usr_11111",
        "name": "Jane Doe"
      },
      "created_at": "2025-09-06T14:22:10.000Z",
      "changes": "Updated section 3.2 compensation details"
    },
    {
      "version": 1,
      "size": 240150,
      "checksum": "sha256:def456...",
      "uploaded_by": {
        "id": "usr_22222",
        "name": "John Smith" 
      },
      "created_at": "2025-09-01T09:15:00.000Z",
      "changes": "Initial draft"
    }
  ]
}
```

### `GET /documents/{id}/versions/{version}/download`
Download specific version of document.

### `POST /documents/{id}/restore/{version}`
Restore specific version as current version.

## Folder Management

### `GET /folders`
List document folders and hierarchy.

**Response:**
```json
{
  "data": [
    {
      "id": "folder_12345",
      "name": "Client Contracts",
      "path": "/contracts/clients",
      "parent_id": "folder_67890",
      "document_count": 45,
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### `POST /folders`
Create new folder.

**Request Body:**
```json
{
  "name": "Discovery Documents",
  "parent_id": "folder_12345",
  "description": "All discovery related documents"
}
```

### `PUT /folders/{id}`
Update folder information.

### `DELETE /folders/{id}`
Delete folder (must be empty).

## Document Sharing

### `POST /documents/{id}/share`
Create sharing link for document.

**Request Body:**
```json
{
  "expires_at": "2025-09-13T23:59:59.000Z",
  "password_required": true,
  "download_allowed": false,
  "view_only": true
}
```

**Response:**
```json
{
  "share_id": "share_abc123",
  "share_url": "https://docs.jurono.eu/shared/share_abc123",
  "expires_at": "2025-09-13T23:59:59.000Z",
  "access_count": 0
}
```

### `GET /documents/{id}/shares`
List active sharing links for document.

### `DELETE /documents/{id}/shares/{share_id}`
Revoke sharing link.

## Document Templates

### `GET /templates`
List document templates.

**Response:**
```json
{
  "data": [
    {
      "id": "template_12345",
      "name": "Employment Agreement Template",
      "description": "Standard employment agreement for new hires", 
      "category": "employment",
      "fields": [
        {
          "name": "employee_name",
          "type": "text",
          "required": true
        },
        {
          "name": "salary",
          "type": "currency", 
          "required": true
        }
      ],
      "created_at": "2024-06-15T10:30:00.000Z"
    }
  ]
}
```

### `POST /templates/{id}/generate`
Generate document from template.

**Request Body:**
```json
{
  "fields": {
    "employee_name": "Alice Johnson",
    "salary": 75000,
    "start_date": "2025-09-15"
  },
  "case_id": "case_67890"
}
```

## Full-Text Search

### `POST /documents/search`
Advanced document search with filters.

**Request Body:**
```json
{
  "query": "employment AND (contract OR agreement)",
  "filters": {
    "case_id": "case_67890",
    "date_range": {
      "start": "2025-01-01",
      "end": "2025-12-31"
    },
    "tags": ["contract"],
    "file_types": ["pdf", "docx"]
  },
  "highlight": true,
  "limit": 20
}
```

**Response:**
```json
{
  "data": [
    {
      "document": {
        "id": "doc_12345",
        "title": "Employment Agreement - Alice Johnson"
      },
      "score": 0.95,
      "highlights": [
        "This <em>employment</em> <em>agreement</em> is entered into...",
        "The <em>contract</em> term shall be for two years..."
      ]
    }
  ],
  "total_results": 45,
  "search_time_ms": 23
}
```

## Document Security

### Access Control
- **Role-based permissions** per document
- **Client confidentiality** enforcement
- **Case-based access** controls
- **Time-limited sharing** links

### Security Features
- **End-to-end encryption** for sensitive documents
- **Digital signatures** support
- **Audit logging** for all access and changes
- **Watermarking** for shared documents
- **DLP (Data Loss Prevention)** scanning

### Compliance
- **GDPR compliance** with data retention policies
- **Attorney-client privilege** protection
- **Court-admissible** digital signatures
- **Bar association** security requirements

## File Types Supported

### Documents
- PDF, DOCX, DOC, RTF, TXT
- ODT, PAGES, WordPerfect

### Presentations  
- PPTX, PPT, ODP, KEY

### Spreadsheets
- XLSX, XLS, ODS, NUMBERS, CSV

### Images
- JPG, PNG, GIF, BMP, TIFF, HEIC

### Audio/Video
- MP3, WAV, MP4, MOV, AVI (with transcription)

### Other
- ZIP, RAR, 7Z (archive contents indexed)
- EML, MSG (email with attachments)

## Error Codes

| Code | Description |
|------|-------------|
| `DOCUMENT_NOT_FOUND` | Document does not exist |
| `FILE_TOO_LARGE` | File exceeds size limit (100MB) |
| `UNSUPPORTED_FILE_TYPE` | File type not supported |
| `STORAGE_QUOTA_EXCEEDED` | Organization storage limit reached |
| `ACCESS_DENIED` | User lacks document permissions |
| `VERSION_NOT_FOUND` | Document version does not exist |
| `FOLDER_NOT_EMPTY` | Cannot delete non-empty folder |

## Rate Limiting

- **File uploads**: 10 per minute per user
- **Downloads**: 100 per minute per user  
- **Search queries**: 30 per minute per user
- **API calls**: 1000 per minute per organization

## Best Practices

1. **Use meaningful titles and descriptions** for documents
2. **Tag documents consistently** for better organization
3. **Create folder hierarchies** that match your practice areas
4. **Use templates** for commonly generated documents
5. **Regular cleanup** of old versions and deleted documents
6. **Set appropriate permissions** for client confidentiality
7. **Use OCR** for searchable scanned documents