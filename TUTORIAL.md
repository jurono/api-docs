# Jurono API Documentation System - Complete Setup Tutorial

This tutorial will guide you through setting up, deploying, and maintaining the Jurono API documentation system that automatically syncs with your private API repository.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [GitHub Repository Configuration](#github-repository-configuration)
4. [Secrets and Authentication](#secrets-and-authentication)
5. [Local Development](#local-development)
6. [Automated Synchronization](#automated-synchronization)
7. [Documentation Website](#documentation-website)
8. [Troubleshooting](#troubleshooting)
9. [Maintenance](#maintenance)

---

## Prerequisites

### Required Tools
- **Git** with SSH configured
- **Node.js** v18+ and npm
- **GitHub account** with access to `jurono` organization
- **SSH key** for GitHub authentication (`~/.ssh/id_jurono`)
- **yq** for YAML processing: `brew install yq` (macOS) or `snap install yq` (Linux)

### Access Requirements
- Push access to `jurono/api-docs` repository
- Read access to private `jurono/api` repository
- Organization member status in `jurono`

---

## Initial Setup

### 1. Clone the Repository
```bash
# Clone with SSH (recommended)
git clone git@github.com:jurono/api-docs.git
cd api-docs

# Or use the custom SSH config
git clone git@github_jurono:api-docs.git
cd api-docs
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install Docusaurus dependencies
cd website
npm install
cd ..

# Install global tools
npm run validate:install  # Installs Spectral for OpenAPI validation
```

### 3. Verify SSH Configuration
```bash
# Check SSH config for jurono
cat ~/.ssh/config | grep -A 5 github_jurono

# Test SSH connection
ssh -T git@github_jurono
# Should show: "Hi [username]! You've successfully authenticated..."
```

---

## GitHub Repository Configuration

### 1. Create Personal Access Token (PAT)

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. **Token name**: `jurono-api-docs-sync`
4. **Expiration**: Select 90 days or custom
5. **Select scopes**:
   ```
   ✅ repo (Full control of private repositories)
   ✅ workflow (Update GitHub Action workflows)  
   ✅ read:org (Read org membership)
   ```
6. Click **"Generate token"**
7. **IMPORTANT**: Copy the token immediately (you won't see it again!)

### 2. Add Repository Secrets

In the `jurono/api-docs` GitHub repository:

1. Navigate to **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add the following secret:

| Secret Name | Value | Description |
|------------|-------|-------------|
| `API_REPO_TOKEN` | Your PAT from step 1 | Allows GitHub Actions to access private API repo |

### 3. Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. **Source**: Select "GitHub Actions"
3. Save changes
4. Your docs will be available at: `https://jurono.github.io/api-docs/`

### 4. Configure Branch Protection (Optional but Recommended)

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Include administrators

---

## Secrets and Authentication

### Local Development Secrets

Create a `.env.local` file (already in .gitignore):
```bash
# .env.local
GITHUB_TOKEN=ghp_your_personal_token_here
API_REPO_TOKEN=ghp_your_personal_token_here
WEBHOOK_SECRET=your_webhook_secret_here
```

### SSH Key Setup

Ensure your SSH key is properly configured:
```bash
# Add jurono key to SSH agent
ssh-add ~/.ssh/id_jurono

# Verify it's loaded
ssh-add -l | grep jurono

# Test GitHub access
ssh -T git@github_jurono
```

### Git Configuration

The repository includes a custom `.gitconfig`:
```ini
[user]
    name = Jurono Devops
    email = devops@jurono.eu

[core]
    sshCommand = ssh -i ~/.ssh/id_jurono

[url "git@github_jurono:"]
    insteadOf = git@github.com:jurono/
```

---

## Local Development

### Basic Commands

```bash
# Sync documentation from API repository
npm run sync

# Validate OpenAPI specification
npm run validate

# Start documentation website locally
npm run docs:dev
# Visit http://localhost:3000

# Build documentation for production
npm run docs:build

# Test built site locally
npm run docs:serve
```

### Manual Sync Process

1. **Run sync script**:
   ```bash
   ./scripts/sync-from-api.sh
   ```
   This will:
   - Clone/pull the private API repository
   - Generate fresh OpenAPI specs
   - Copy public API documentation
   - Extract components
   - Update examples with correct URLs

2. **Review changes**:
   ```bash
   git diff
   git status
   ```

3. **Commit changes**:
   ```bash
   git add .
   git commit -m "sync: update API documentation"
   git push
   ```

### Using Git Aliases

The repository includes helpful git aliases:
```bash
# Quick sync and commit
git sync-and-commit

# Just sync docs
git sync-docs

# Validate docs
git validate-docs

# Build documentation site
git build-docs

# Start dev server
git serve-docs
```

---

## Automated Synchronization

### GitHub Actions Workflows

The repository includes several automated workflows:

#### 1. Daily Sync (`sync-api-docs.yml`)
- **Runs**: Daily at 2 AM UTC
- **Trigger manually**: Actions tab → "Sync API Documentation" → Run workflow
- **What it does**:
  - Pulls latest from private API repo
  - Generates OpenAPI specs
  - Updates documentation
  - Creates PR for major version changes

#### 2. OpenAPI Validation (`validate-openapi.yml`)
- **Runs**: On every push/PR that changes `openapi/**`
- **What it does**: Validates OpenAPI spec with Spectral

#### 3. Documentation Deployment (`build-docs.yml`)
- **Runs**: On push to `main` branch
- **What it does**: Builds and deploys to GitHub Pages

#### 4. SDK Generation (`generate-sdks.yml`)
- **Runs**: On OpenAPI changes or manual trigger
- **What it does**: Generates TypeScript SDK

### Testing Workflows

```bash
# Test sync workflow manually
# Go to GitHub Actions tab and click "Run workflow"

# Or trigger via GitHub CLI
gh workflow run sync-api-docs.yml

# View workflow runs
gh run list --workflow=sync-api-docs.yml
```

### Webhook Integration (Advanced)

For real-time updates when API repo changes:

1. **Deploy webhook handler**:
   ```bash
   # Run locally for testing
   node scripts/webhook-handler.js
   ```

2. **Configure webhook in API repo**:
   - Go to jurono/api → Settings → Webhooks
   - Add webhook URL: `https://your-webhook-url/webhook`
   - Secret: Use same as `WEBHOOK_SECRET`
   - Events: Select "Pushes" and "Releases"

---

## Documentation Website

### Structure
```
website/
├── docs/           # Documentation pages
├── blog/           # Blog posts (optional)
├── src/            # React components
├── static/         # Static assets
└── docusaurus.config.ts  # Site configuration
```

### Customization

1. **Update site metadata** in `website/docusaurus.config.ts`:
   ```typescript
   const config: Config = {
     title: 'Jurono API',
     tagline: 'Developer documentation',
     url: 'https://jurono.github.io',
     baseUrl: '/api-docs/',
   };
   ```

2. **Add custom pages** in `website/src/pages/`

3. **Modify theme** in `website/src/css/custom.css`

### Adding Documentation

1. Create markdown files in `website/docs/`
2. Update `website/sidebars.ts` to include new pages
3. Commit and push - auto-deploys to GitHub Pages

---

## Troubleshooting

### Common Issues and Solutions

#### 1. SSH Authentication Fails
```bash
# Error: Permission denied (publickey)
# Solution: Add SSH key to agent
ssh-add ~/.ssh/id_jurono

# Verify correct key is used
ssh -vT git@github.com 2>&1 | grep "Offering public key"
```

#### 2. Sync Script Can't Find API Repo
```bash
# Error: API directory not found
# Solution: Script will auto-clone, or manually clone:
git clone git@github_jurono:api.git ../api
```

#### 3. GitHub Actions Workflow Fails
```bash
# Check if secrets are set
gh secret list

# View workflow logs
gh run view [run-id] --log

# Re-run failed workflow
gh run rerun [run-id]
```

#### 4. OpenAPI Validation Errors
```bash
# Run validation locally
npm run validate

# Fix common issues:
# - Missing required fields
# - Invalid schema references
# - Incorrect YAML formatting
```

#### 5. Documentation Site Won't Build
```bash
# Clear cache and rebuild
npm run clean
cd website
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Debug Commands

```bash
# Check git configuration
git config --list --local

# Verify remote URLs
git remote -v

# Test API repo access
git ls-remote git@github_jurono:api.git

# Check GitHub Actions status
gh workflow list
gh run list

# View sync script in debug mode
bash -x ./scripts/sync-from-api.sh
```

---

## Maintenance

### Regular Tasks

#### Daily (Automated)
- ✅ API documentation sync (2 AM UTC)
- ✅ OpenAPI validation on changes

#### Weekly (Manual)
- Review and merge Dependabot PRs
- Check for SDK generation updates
- Review documentation accuracy

#### Monthly
- Update dependencies: `npm update`
- Review and update examples
- Check for broken links
- Update changelog

### Updating Dependencies

```bash
# Update npm packages
npm update
cd website && npm update

# Check for outdated packages
npm outdated

# Update GitHub Actions
# Dependabot will create PRs automatically
```

### Version Management

When API version changes:
1. Sync will detect version change
2. GitHub Actions creates PR automatically
3. Review PR for breaking changes
4. Merge to deploy new version

### Monitoring

Check documentation health:
```bash
# Validate OpenAPI spec
npm run validate

# Check for broken links (if configured)
npm run check-links

# View sync history
git log --grep="sync:" --oneline

# Check deployment status
gh run list --workflow=build-docs.yml
```

---

## Quick Reference

### Essential Commands
```bash
npm run sync              # Sync from API repo
npm run validate          # Validate OpenAPI spec
npm run docs:dev          # Start dev server
npm run docs:build        # Build for production
git sync-and-commit       # Sync and auto-commit
```

### File Locations
- **OpenAPI Spec**: `openapi/openapi.yaml`
- **Sync Script**: `scripts/sync-from-api.sh`
- **Workflows**: `.github/workflows/`
- **Website**: `website/`
- **Examples**: `examples/`

### URLs
- **Live Docs**: https://jurono.github.io/api-docs/
- **API Repo**: git@github.com:jurono/api.git
- **Docs Repo**: git@github.com:jurono/api-docs.git

### Support
- **Issues**: https://github.com/jurono/api-docs/issues
- **Security**: security@jurono.eu
- **Team**: devops@jurono.eu

---

## Next Steps

1. ✅ Push repository to GitHub
2. ✅ Add `API_REPO_TOKEN` secret
3. ✅ Enable GitHub Pages
4. ✅ Test sync workflow
5. ✅ Customize website theme
6. ✅ Add custom documentation
7. ✅ Configure webhooks (optional)
8. ✅ Set up monitoring

---

**Last Updated**: 2025-09-06
**Version**: 1.0.0
**Status**: Production Ready