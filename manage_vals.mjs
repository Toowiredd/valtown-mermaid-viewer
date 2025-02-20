import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VAL_TOWN_API_KEY = process.env.VAL_TOWN_API_KEY;
const USERNAME = 'toowired';

if (!VAL_TOWN_API_KEY) {
  console.error('Error: VAL_TOWN_API_KEY environment variable is required');
  process.exit(1);
}

async function getAllVals() {
  try {
    const response = await fetch(`https://api.val.town/v1/users/${USERNAME}/vals`, {
      headers: {
        'Authorization': `Bearer ${VAL_TOWN_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get vals: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting vals:', error);
    return [];
  }
}

async function deleteVal(id) {
  try {
    const response = await fetch(`https://api.val.town/v1/vals/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${VAL_TOWN_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete val: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting val:', error);
    return false;
  }
}

async function backupVals() {
  const vals = await getAllVals();
  const backupDir = path.join(__dirname, 'backup');
  
  try {
    await fs.mkdir(backupDir, { recursive: true });
    await fs.writeFile(
      path.join(backupDir, `vals_backup_${Date.now()}.json`),
      JSON.stringify(vals, null, 2)
    );
    console.log('✅ Vals backed up successfully');
    return vals;
  } catch (error) {
    console.error('Error backing up vals:', error);
    return vals;
  }
}

async function deleteAllVals() {
  const vals = await getAllVals();
  console.log(`Found ${vals.length} vals to delete`);
  
  for (const val of vals) {
    const success = await deleteVal(val.id);
    if (success) {
      console.log(`✅ Deleted ${val.name}`);
    } else {
      console.log(`❌ Failed to delete ${val.name}`);
    }
  }
}

// Main execution
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'backup':
      await backupVals();
      break;
    case 'delete':
      await backupVals(); // Always backup before delete
      await deleteAllVals();
      break;
    case 'list':
      const vals = await getAllVals();
      console.log('Current vals:');
      vals.forEach(val => console.log(`- ${val.name}`));
      break;
    default:
      console.log('Usage: node manage_vals.mjs [backup|delete|list]');
  }
}

main().catch(console.error);
