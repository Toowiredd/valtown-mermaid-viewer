import { useState, useCallback } from 'react';
import { MermaidRenderer } from './components/MermaidRenderer';
import { ThemeSelector } from './components/ThemeSelector';
import { useHistory } from './hooks/useHistory';
import { useAiAnalysis } from './hooks/useAiAnalysis';
import './App.css';

const DEFAULT_DIAGRAM = `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[OK]
    B -->|No| D[Cancel]`;

export function App() {
  const [theme, setTheme] = useState('default');
  const { currentCode, addToHistory, undo, redo, canUndo, canRedo } = useHistory(DEFAULT_DIAGRAM);
  const { analyzeDiagram, isAnalyzing, lastResult } = useAiAnalysis();
  const [code, setCode] = useState(DEFAULT_DIAGRAM);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    addToHistory(newCode);
  }, [addToHistory]);

  const handleAnalyze = useCallback(async () => {
    const result = await analyzeDiagram(code);
    if (result.improvedCode) {
      handleCodeChange(result.improvedCode);
    }
  }, [code, handleCodeChange, analyzeDiagram]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Mermaid Diagram Viewer</h1>
        <div className="toolbar">
          <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
          <button onClick={undo} disabled={!canUndo}>Undo</button>
          <button onClick={redo} disabled={!canRedo}>Redo</button>
          <button onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Improve Diagram'}
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="editor-section">
          <textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="Enter your Mermaid diagram code here..."
            className="code-editor"
          />
        </div>

        <div className="preview-section">
          <MermaidRenderer code={code} theme={theme} />
        </div>

        {lastResult?.suggestions && lastResult.suggestions.length > 0 && (
          <div className="suggestions">
            <h3>Suggestions:</h3>
            <ul>
              {lastResult.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
