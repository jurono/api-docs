#!/usr/bin/env node

/**
 * Webhook handler for automatic API documentation updates
 * 
 * This script can be deployed as a serverless function or webhook endpoint
 * to automatically sync API docs when the main API repository is updated.
 * 
 * Usage:
 * - Deploy as GitHub webhook endpoint
 * - Deploy as Vercel/Netlify function  
 * - Run as Express.js server
 */

const { execSync } = require('child_process');
const crypto = require('crypto');

// Configuration
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';
const ALLOWED_REPOS = ['jurono/api', 'jurono/backend'];
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

/**
 * Verify GitHub webhook signature
 */
function verifySignature(payload, signature) {
  if (!WEBHOOK_SECRET) return true; // Skip verification if no secret
  
  const expectedSignature = 'sha256=' + 
    crypto.createHmac('sha256', WEBHOOK_SECRET)
      .update(payload)
      .digest('hex');
      
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Trigger API docs sync
 */
async function triggerSync(eventType, repository) {
  console.log(`🔄 Triggering sync for ${repository} (${eventType})`);
  
  try {
    // Option 1: Trigger GitHub Actions workflow via API
    if (GITHUB_TOKEN) {
      const response = await fetch('https://api.github.com/repos/jurono/api-docs/dispatches', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_type: 'api-docs-updated',
          client_payload: {
            source_repo: repository,
            event_type: eventType,
            timestamp: new Date().toISOString()
          }
        })
      });
      
      if (response.ok) {
        console.log('✅ GitHub Actions workflow triggered successfully');
        return { success: true, method: 'github-actions' };
      }
    }
    
    // Option 2: Direct sync via local script (if running locally)
    if (process.env.NODE_ENV !== 'production') {
      execSync('./scripts/sync-from-api.sh', { 
        stdio: 'inherit',
        cwd: process.cwd()
      });
      console.log('✅ Local sync completed successfully');
      return { success: true, method: 'local-sync' };
    }
    
    throw new Error('No sync method available');
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Handle GitHub webhook
 */
async function handleWebhook(event) {
  const { headers, body } = event;
  
  // Verify signature
  if (headers['x-hub-signature-256']) {
    if (!verifySignature(JSON.stringify(body), headers['x-hub-signature-256'])) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid signature' })
      };
    }
  }
  
  const eventType = headers['x-github-event'];
  const repository = body.repository?.full_name;
  
  // Check if this is from an allowed repository
  if (!ALLOWED_REPOS.includes(repository)) {
    console.log(`⏭️  Ignoring event from ${repository} (not in allowed list)`);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Repository not in allowed list' })
    };
  }
  
  // Handle different event types
  const shouldSync = (
    eventType === 'push' && body.ref === 'refs/heads/main'
  ) || (
    eventType === 'release' && body.action === 'published'
  ) || (
    eventType === 'workflow_run' && 
    body.workflow_run?.conclusion === 'success' &&
    body.workflow_run?.name?.includes('docs')
  );
  
  if (!shouldSync) {
    console.log(`⏭️  Event ${eventType} doesn't require docs sync`);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Event ignored' })
    };
  }
  
  // Trigger sync
  const result = await triggerSync(eventType, repository);
  
  return {
    statusCode: result.success ? 200 : 500,
    body: JSON.stringify({
      message: result.success ? 'Sync triggered successfully' : 'Sync failed',
      ...result
    })
  };
}

/**
 * Express.js server (for local development)
 */
function startServer(port = 3001) {
  const express = require('express');
  const app = express();
  
  app.use(express.json());
  
  app.post('/webhook', async (req, res) => {
    try {
      const result = await handleWebhook({
        headers: req.headers,
        body: req.body
      });
      
      res.status(result.statusCode).json(JSON.parse(result.body));
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  app.listen(port, () => {
    console.log(`🚀 Webhook server listening on port ${port}`);
    console.log(`📡 Webhook endpoint: http://localhost:${port}/webhook`);
    console.log(`💚 Health check: http://localhost:${port}/health`);
  });
}

// Export for serverless functions
module.exports = { handleWebhook, verifySignature };

// Run as server if executed directly
if (require.main === module) {
  const port = process.env.PORT || 3001;
  startServer(port);
}