# GitHub Actions Permissions Fix

## Problem
The error `Permission to jurono/api-docs.git denied to github-actions[bot]` occurs when GitHub Actions tries to push changes back to the repository.

## Solutions

### Solution 1: Use Personal Access Token (Implemented)
The workflow now uses `API_REPO_TOKEN` for both checkout and push operations. This token needs:
- `repo` scope for full repository access
- `workflow` scope to update workflows

### Solution 2: Repository Settings
In GitHub repository settings:

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
3. Click **Save**

### Solution 3: Deploy Key (Alternative)
1. Generate SSH key pair:
   ```bash
   ssh-keygen -t ed25519 -C "github-actions@jurono" -f deploy_key
   ```

2. Add public key as Deploy Key:
   - Go to **Settings** → **Deploy keys**
   - Add new key with write access

3. Add private key as secret:
   - Name: `DEPLOY_KEY`
   - Value: Contents of private key

4. Update workflow to use SSH:
   ```yaml
   - name: Setup SSH
     run: |
       mkdir -p ~/.ssh
       echo "${{ secrets.DEPLOY_KEY }}" > ~/.ssh/id_ed25519
       chmod 600 ~/.ssh/id_ed25519
       ssh-keyscan github.com >> ~/.ssh/known_hosts
   ```

## Current Configuration
The workflow is configured to:
1. Use `API_REPO_TOKEN` for authentication
2. Have `contents: write` and `pull-requests: write` permissions
3. Push directly to the main branch

## Testing
After making changes:
1. Commit and push the workflow file
2. Go to Actions tab
3. Run the workflow manually
4. Check if push succeeds

## Security Best Practices
- Rotate PAT tokens every 90 days
- Use minimal required scopes
- Consider using GitHub Apps for production
- Enable branch protection with exceptions for automation