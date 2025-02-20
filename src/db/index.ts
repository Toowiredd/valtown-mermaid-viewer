const KV_PREFIX = 'mermaid_viewer:';

export const db = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const response = await fetch(`https://www.val.town/v/toowired/kv_get?key=${encodeURIComponent(KV_PREFIX + key)}`);
      
      if (!response.ok) {
        throw new Error('Failed to get value from KV store');
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('Error getting from KV store:', error);
      return null;
    }
  },

  async set(key: string, value: any): Promise<boolean> {
    try {
      const response = await fetch('https://www.val.town/v/toowired/kv_set', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: KV_PREFIX + key,
          value,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to set value in KV store');
      }

      return true;
    } catch (error) {
      console.error('Error setting in KV store:', error);
      return false;
    }
  },

  async delete(key: string): Promise<boolean> {
    try {
      const response = await fetch(`https://www.val.town/v/toowired/kv_delete?key=${encodeURIComponent(KV_PREFIX + key)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete value from KV store');
      }

      return true;
    } catch (error) {
      console.error('Error deleting from KV store:', error);
      return false;
    }
  },
};
