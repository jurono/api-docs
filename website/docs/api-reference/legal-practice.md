# Legal Practice Tools API

Case management, client profiles, legal workflows, and practice operations for law firms.

## Overview

The legal practice tools provide comprehensive case and client management capabilities designed specifically for legal professionals.

**Base Paths**: `/cases`, `/clients`, `/matters`, `/calendar`

## Case Management

### `GET /cases`
List cases with filtering and pagination.

**Query Parameters:**
- `status` (string) - Filter by status: `active`, `closed`, `pending`, `archived`
- `practice_area` (string) - Filter by practice area
- `client_id` (string) - Filter by client
- `assigned_to` (string) - Filter by assigned lawyer
- `limit` (integer, max 100) - Results per page
- `cursor` (string) - Pagination cursor

**Response:**
```json
{
  "data": [
    {
      "id": "case_12345",
      "case_number": "2025-CV-001",
      "title": "Smith vs. ABC Corporation",
      "description": "Personal injury case involving workplace accident",
      "status": "active",
      "practice_area": "personal_injury",
      "client": {
        "id": "client_67890",
        "name": "John Smith",
        "type": "individual"
      },
      "assigned_lawyers": [
        {
          "id": "usr_11111",
          "name": "Jane Doe",
          "role": "lead_attorney"
        }
      ],
      "created_at": "2025-01-15T10:30:00.000Z",
      "updated_at": "2025-09-06T14:22:10.000Z",
      "deadline": "2025-12-31T23:59:59.000Z",
      "estimated_value": 75000.00,
      "time_entries_count": 45,
      "documents_count": 23
    }
  ]
}
```

### `POST /cases`
Create a new case.

**Request Body:**
```json
{
  "case_number": "2025-CV-002",
  "title": "Estate Planning - Johnson Family",
  "description": "Comprehensive estate planning services",
  "practice_area": "estate_planning",
  "client_id": "client_67890",
  "assigned_lawyers": ["usr_11111", "usr_22222"],
  "deadline": "2025-12-31T23:59:59.000Z",
  "billing_type": "hourly",
  "hourly_rate": 350.00,
  "retainer_amount": 5000.00
}
```

### `GET /cases/{id}`
Get detailed case information.

### `PUT /cases/{id}`
Update case information.

### `DELETE /cases/{id}`
Archive a case.

### `POST /cases/{id}/notes`
Add note to case.

**Request Body:**
```json
{
  "content": "Client meeting notes from 2025-09-06",
  "type": "meeting",
  "private": false,
  "tags": ["client-meeting", "discovery"]
}
```

### `GET /cases/{id}/timeline`
Get case activity timeline.

**Response:**
```json
{
  "data": [
    {
      "id": "event_12345",
      "type": "note_added",
      "description": "Case note added by Jane Doe",
      "user": "Jane Doe",
      "timestamp": "2025-09-06T14:22:10.000Z",
      "metadata": {
        "note_id": "note_67890"
      }
    }
  ]
}
```

## Client Management

### `GET /clients`
List clients with search and filtering.

**Query Parameters:**
- `search` (string) - Search by name, email, or company
- `type` (string) - Filter by type: `individual`, `business`
- `status` (string) - Filter by status: `active`, `inactive`, `prospect`
- `limit` (integer, max 100) - Results per page

**Response:**
```json
{
  "data": [
    {
      "id": "client_12345",
      "type": "individual",
      "name": "John Smith", 
      "email": "john.smith@email.com",
      "phone": "+1-555-123-4567",
      "address": {
        "street": "123 Main Street",
        "city": "New York",
        "state": "NY", 
        "postal_code": "10001",
        "country": "US"
      },
      "status": "active",
      "created_at": "2024-06-15T10:30:00.000Z",
      "cases_count": 3,
      "total_billed": 15750.00,
      "outstanding_balance": 2500.00,
      "assigned_lawyer": {
        "id": "usr_11111",
        "name": "Jane Doe"
      }
    }
  ]
}
```

### `POST /clients`
Create new client profile.

**Request Body:**
```json
{
  "type": "individual",
  "name": "Alice Johnson",
  "email": "alice.johnson@email.com", 
  "phone": "+1-555-987-6543",
  "address": {
    "street": "456 Oak Avenue",
    "city": "Los Angeles", 
    "state": "CA",
    "postal_code": "90210",
    "country": "US"
  },
  "date_of_birth": "1985-03-15",
  "occupation": "Software Engineer",
  "referred_by": "John Smith",
  "notes": "Referred by existing client for estate planning"
}
```

### `GET /clients/{id}`
Get detailed client information including case history.

### `PUT /clients/{id}`
Update client information.

### `GET /clients/{id}/cases`
List all cases for a specific client.

## Legal Calendar

### `GET /calendar/events`
Get calendar events (hearings, deadlines, meetings).

**Query Parameters:**
- `start_date` (date) - Start date range
- `end_date` (date) - End date range  
- `type` (string) - Filter by type: `hearing`, `deadline`, `meeting`, `task`
- `case_id` (string) - Filter by case

**Response:**
```json
{
  "data": [
    {
      "id": "event_12345",
      "title": "Deposition - John Smith",
      "description": "Client deposition for Smith vs. ABC Corporation",
      "type": "deposition",
      "start_time": "2025-09-10T14:00:00.000Z",
      "end_time": "2025-09-10T16:00:00.000Z", 
      "location": "Conference Room A",
      "case": {
        "id": "case_67890",
        "title": "Smith vs. ABC Corporation"
      },
      "attendees": [
        {
          "id": "usr_11111", 
          "name": "Jane Doe",
          "role": "attorney"
        }
      ],
      "reminders": [
        {"minutes_before": 60},
        {"minutes_before": 1440}
      ]
    }
  ]
}
```

### `POST /calendar/events`
Create calendar event.

**Request Body:**
```json
{
  "title": "Court Hearing - Motion to Dismiss",
  "description": "Hearing for motion to dismiss in Johnson case",
  "type": "hearing",
  "start_time": "2025-09-15T09:00:00.000Z", 
  "end_time": "2025-09-15T10:00:00.000Z",
  "location": "Courthouse Room 3A",
  "case_id": "case_67890",
  "attendees": ["usr_11111", "usr_22222"],
  "reminders": [
    {"minutes_before": 1440},
    {"minutes_before": 60}
  ]
}
```

## Time Tracking

### `GET /time-entries`
List time entries for billing.

**Query Parameters:**
- `case_id` (string) - Filter by case
- `user_id` (string) - Filter by user
- `billable` (boolean) - Filter by billable status
- `start_date` (date) - Date range start
- `end_date` (date) - Date range end

### `POST /time-entries`
Log time entry.

**Request Body:**
```json
{
  "case_id": "case_12345",
  "description": "Research case law for motion to dismiss",
  "hours": 2.5,
  "date": "2025-09-06",
  "billable": true,
  "hourly_rate": 350.00,
  "activity_type": "research"
}
```

## Practice Areas

The system supports the following practice areas:

- `personal_injury` - Personal Injury
- `criminal_defense` - Criminal Defense  
- `family_law` - Family Law
- `estate_planning` - Estate Planning
- `corporate_law` - Corporate Law
- `real_estate` - Real Estate Law
- `employment_law` - Employment Law
- `intellectual_property` - Intellectual Property
- `litigation` - General Litigation
- `immigration` - Immigration Law

## Case Statuses

- `active` - Currently active case
- `pending` - Waiting for client approval or information
- `closed` - Case completed successfully
- `archived` - Older closed case moved to archives
- `on_hold` - Temporarily suspended

## Billing Types

- `hourly` - Bill by the hour
- `flat_fee` - Fixed fee for entire case
- `contingency` - Percentage of settlement/award
- `retainer` - Ongoing monthly retainer

## Integration Features

### Document Management
- Link cases to documents in the document management system
- Automatic document organization by case
- Version control for case-related documents

### Calendar Sync
- Sync with Google Calendar, Outlook, etc.
- Automated reminder notifications
- Court date and deadline tracking

### Billing Integration  
- Automatic time entry compilation
- Invoice generation from case time entries
- Client payment tracking

## Error Codes

| Code | Description |
|------|-------------|
| `CASE_NOT_FOUND` | Case does not exist |
| `CLIENT_NOT_FOUND` | Client does not exist |
| `INVALID_PRACTICE_AREA` | Practice area not supported |
| `DUPLICATE_CASE_NUMBER` | Case number already exists |
| `INVALID_TIME_ENTRY` | Time entry validation failed |

This API provides everything needed to manage a modern legal practice efficiently.