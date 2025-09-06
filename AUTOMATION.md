# API Documentation Automation

This document explains how the API documentation is automatically generated and synchronized from the main API repository.

## Overview

The API docs repository automatically syncs with the main API repository (`../api`) to keep documentation up-to-date. The main API project generates comprehensive OpenAPI specifications that are pulled into this docs repository.

## Current Setup

### API Repository Integration
- **Source**: `../api` (Jurono API repository)  
- **Generation Script**: `npm run docs:generate` in API repo
- **Output**: `api/public/docs/openapi-public.yaml` (104 endpoints, 24 schemas)
- **Format**: OpenAPI 3.0.3 with comprehensive documentation

## Automation Methods

### 1. Manual Sync (Local Development)
```bash
# Quick sync
npm run sync

# Sync with validation
npm run sync:check

# Just the script
./scripts/sync-from-api.sh
```

**What it does:**
- Generates fresh OpenAPI specs from the API repo
- Copies public API spec (excludes admin-only endpoints)  
- Extracts components (schemas, examples, parameters, responses)
- Updates examples with correct server URLs
- Updates changelog with version info
- Adds sync timestamp to README

### 2. GitHub Actions (Automated)
```yaml
# .github/workflows/sync-api-docs.yml
- Daily at 2 AM UTC
- On repository dispatch events
- When API repo triggers webhook
```

**Features:**
- Pulls from API repo automatically
- Creates PRs for major version changes
- Validates OpenAPI specs
- Deploys to GitHub Pages

### 3. Webhook Integration (Real-time)
```javascript
// scripts/webhook-handler.js
- GitHub webhook endpoint
- Triggers on API repo pushes
- Can be deployed as serverless function
```

## File Structure After Sync

```
├── openapi/
│   ├── openapi.yaml           # Main public API spec (104 endpoints)
│   ├── openapi.json           # JSON format
│   ├── metadata.json          # Generation metadata
│   └── components/            # Extracted components
│       ├── schemas/all.yaml   # 24 API schemas
│       ├── examples/all.yaml  # Request/response examples
│       ├── parameters/all.yaml # Query/path parameters
│       └── responses/all.yaml # Response definitions
├── examples/                  # Updated code samples
│   ├── curl/                  # cURL commands with real endpoints
│   ├── javascript/            # JavaScript examples
│   └── python/                # Python examples
└── changelog/v1.md           # Updated with sync info
```

## API Documentation Details

### Generated from API Repository
- **Total Public Endpoints**: 104
- **Admin-only Endpoints**: 20 (excluded from public docs)
- **Schemas**: 24 data models
- **Authentication**: JWT Bearer tokens
- **Rate Limiting**: Built-in rate limiting rules
- **GDPR Compliance**: Privacy and data protection controls

### Key API Features Documented
- Authentication & User Management
- Organization Management (multi-tenant)
- Legal Practice Tools (case management, client profiles)
- JuroLib Integration (lawyer directory)
- Document Management
- Analytics & Reporting
- Compliance Tools

## Development Workflow

### For API Changes
1. Make changes in `../api` repository  
2. Run `npm run docs:generate` in API repo
3. Sync changes: `npm run sync` in api-docs repo
4. Review and commit changes
5. GitHub Actions deploys to Pages

### For Documentation Changes
1. Edit guides, examples, or website content directly
2. Changes to OpenAPI spec should be made in API repo
3. Avoid editing `openapi/openapi.yaml` directly (it gets overwritten)

## Commands Reference

```bash
# Setup
npm run setup                  # Install all dependencies
npm run validate:install       # Install OpenAPI validator

# Syncing
npm run sync                   # Sync from API repo
npm run sync:check            # Sync + validate

# Validation
npm run validate              # Lint OpenAPI spec
npm run postman:validate      # Test Postman collection

# Documentation Site
npm run docs:dev              # Start development server
npm run docs:build            # Build static site
npm run docs:serve            # Serve built site

# Cleanup
npm run clean                 # Clean build artifacts
```

## Troubleshooting

### Sync Issues
- Ensure `../api` exists and is up-to-date
- Check that API repo can run `npm run docs:generate`
- Install `yq` for component extraction: `brew install yq`

### GitHub Actions
- Requires `API_REPO_TOKEN` secret for cross-repo access
- Check workflow status in GitHub Actions tab
- Webhook events need `GITHUB_TOKEN` and `WEBHOOK_SECRET`

### Validation Errors
- Run `npm run validate` to check OpenAPI spec
- Fix issues in API repo, then re-sync
- Check Spectral rules in `.spectral.yml`

## Monitoring

### Sync Status
- Check README for "Last synced" timestamp
- Review `changelog/v1.md` for update history
- Monitor GitHub Actions for automated syncs

### API Changes
- **Version changes** trigger PRs automatically  
- **Schema changes** are reflected in components/
- **New endpoints** appear in the main spec
- **Breaking changes** require manual review

---

**Last updated**: $(date)
**Current API Version**: 1.0.0  
**Public Endpoints**: 104
**Next Sync**: Automated daily at 2 AM UTC