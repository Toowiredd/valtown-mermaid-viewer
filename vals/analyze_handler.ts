import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AnalyzeRequest {
  code: string;
}

interface AnalyzeResponse {
  improvedCode: string;
  suggestions: string[];
}

// @val.public
export async function analyze_mermaid(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert in Mermaid diagram syntax and best practices. 
            Analyze and improve the given Mermaid diagram code while maintaining its core meaning.
            Focus on clarity, readability, proper syntax, and visual aesthetics.
            Return only a JSON object with two fields:
            1. improvedCode: the improved Mermaid diagram code
            2. suggestions: array of specific suggestions for improvement`
          },
          {
            role: "user",
            content: `Improve this Mermaid diagram code:\n\n${request.code}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get improvement suggestions');
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in response');
    }

    try {
      const parsed = JSON.parse(content);
      return {
        improvedCode: parsed.improvedCode || request.code,
        suggestions: parsed.suggestions || []
      };
    } catch (parseError) {
      // If parsing fails, try to extract code between backticks and any bullet points
      const codeMatch = content.match(/\`\`\`mermaid\n([\s\S]*?)\n\`\`\`/);
      const suggestionsMatch = content.match(/\n[-•]\s+(.*)/g);
      
      return {
        improvedCode: codeMatch ? codeMatch[1] : request.code,
        suggestions: suggestionsMatch ? suggestionsMatch.map(s => s.trim().replace(/^[-•]\s+/, '')) : []
      };
    }
  } catch (error) {
    console.error('Error analyzing diagram:', error);
    return {
      improvedCode: request.code,
      suggestions: ['Error analyzing diagram: ' + error.message]
    };
  }
}
