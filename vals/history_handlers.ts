import { kv } from '@val.town/utils';

const HISTORY_KEY = 'mermaid_viewer:history';
const MAX_HISTORY_ITEMS = 50;

// @val.public
export async function save_mermaid_history(code: string) {
  try {
    const history = await get_mermaid_history() || [];
    
    // Add new entry
    history.push({ code, timestamp: Date.now() });
    
    // Keep only the latest MAX_HISTORY_ITEMS
    const trimmedHistory = history.slice(-MAX_HISTORY_ITEMS);
    
    await kv.set(HISTORY_KEY, trimmedHistory);
    return { success: true, message: 'History saved successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// @val.public
export async function get_mermaid_history() {
  try {
    const history = await kv.get(HISTORY_KEY);
    return history || [];
  } catch (error) {
    return [];
  }
}

// @val.public
export async function clear_mermaid_history() {
  try {
    await kv.delete(HISTORY_KEY);
    return { success: true, message: 'History cleared successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
