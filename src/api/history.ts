export const saveToHistory = async (code: string) => {
  try {
    const response = await fetch('https://www.val.town/v/toowired/save_mermaid_history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, timestamp: Date.now() }),
    });

    if (!response.ok) {
      throw new Error('Failed to save to history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving to history:', error);
    throw error;
  }
};

export const getHistory = async () => {
  try {
    const response = await fetch('https://www.val.town/v/toowired/get_mermaid_history');
    
    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
};
