import { useState } from 'react';

interface AnalysisResult {
  improvedCode: string;
  suggestions: string[];
  error?: string;
}

export const useAiAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState<AnalysisResult | null>(null);

  const analyzeDiagram = async (code: string): Promise<AnalysisResult> => {
    setIsAnalyzing(true);
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

      const result = await response.json();
      setLastResult(result);
      return result;
    } catch (error) {
      const errorResult = {
        improvedCode: code,
        suggestions: [],
        error: error.message,
      };
      setLastResult(errorResult);
      return errorResult;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeDiagram,
    isAnalyzing,
    lastResult,
  };
};
