import { execSync } from 'child_process';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const WEBHOOK_SECRET = '4b5ba712c5c5fefeb1b752b85694008cf30d97feb1beddeec9b4d8c266c32a33';
const REPO = 'Toowiredd/valtown-mermaid-viewer';
const SYNC_URL = 'https://api.val.town/v1/run/jxnblk/GitHubSync/deploy';

if (!GITHUB_TOKEN) {
  console.error('Please set GITHUB_TOKEN environment variable');
  process.exit(1);
}

async function createWebhook() {
  const webhookData = {
    name: 'web',
    active: true,
    events: ['push'],
    config: {
      url: SYNC_URL,
      content_type: 'json',
      secret: WEBHOOK_SECRET,
    },
  };

  const powershell = `
    $headers = @{
      'Accept' = 'application/vnd.github+json'
      'Authorization' = 'Bearer ${GITHUB_TOKEN}'
      'X-GitHub-Api-Version' = '2022-11-28'
    }
    $body = '${JSON.stringify(webhookData)}'
    Invoke-RestMethod -Uri 'https://api.github.com/repos/${REPO}/hooks' -Method Post -Headers $headers -Body $body -ContentType 'application/json'
  `;

  try {
    const result = execSync(`powershell -Command "${powershell}"`, { encoding: 'utf8' });
    console.log('Webhook created successfully:', result);
  } catch (error) {
    console.error('Error creating webhook:', error.message);
  }
}

createWebhook();
