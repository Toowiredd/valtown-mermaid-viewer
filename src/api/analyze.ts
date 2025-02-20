interface AnalyzeResponse {
  improvedCode: string;
  suggestions: string[];
}

export const analyzeDiagram = async (code: string): Promise<AnalyzeResponse> => {
  try {
    const response = await fetch('https://www.val.town/v/toowired/analyze_mermaid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze diagram');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing diagram:', error);
    throw error;
  }
};
