import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const VAL_TOWN_API_KEY = process.env.VAL_TOWN_API_KEY;
const USERNAME = 'toowired'; // Replace with your Val Town username

if (!VAL_TOWN_API_KEY) {
  console.error('Error: VAL_TOWN_API_KEY environment variable is required');
  process.exit(1);
}

async function getExistingVals() {
  try {
    const response = await fetch(`https://api.val.town/v1/users/${USERNAME}/vals`, {
      headers: {
        'Authorization': `Bearer ${VAL_TOWN_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get vals: ${response.statusText}`);
    }

    const data = await response.json();
    return data.reduce((acc, val) => {
      acc[val.name] = val.id;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error getting existing vals:', error);
    return {};
  }
}

async function updateOrCreateVal(filename, content, existingVals) {
  const valName = path.basename(filename, path.extname(filename));
  const existingId = existingVals[valName];
  
  try {
    let url = 'https://api.val.town/v1/vals';
    let method = 'POST';

    if (existingId) {
      url = `https://api.val.town/v1/vals/${existingId}`;
      method = 'PUT';
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${VAL_TOWN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: valName,
        code: content,
        public: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to ${existingId ? 'update' : 'create'} ${valName}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`✅ ${existingId ? 'Updated' : 'Created'} ${valName} successfully`);
    return result;
  } catch (error) {
    console.error(`❌ Error ${existingId ? 'updating' : 'creating'} ${valName}:`, error);
    throw error;
  }
}

async function deployVals() {
  const existingVals = await getExistingVals();
  const valsDir = path.join(__dirname, 'vals');
  const files = await fs.readdir(valsDir);

  for (const file of files) {
    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const filePath = path.join(valsDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      await updateOrCreateVal(file, content, existingVals);
    }
  }
}

deployVals().catch(console.error);
