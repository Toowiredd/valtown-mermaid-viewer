import { React } from "https://esm.town/react";
import mermaid from 'mermaid';

const DEFAULT_DIAGRAM = `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[OK]
    B -->|No| D[Cancel]`;

// @val.public
export const MermaidViewer = {
  // This tells Val Town this is a React component
  __val_town_react_component: true,
  
  // The actual component implementation
  Component() {
    const [code, setCode] = React.useState(DEFAULT_DIAGRAM);
    const [theme, setTheme] = React.useState('default');
    const containerRef = React.useRef(null);
    const [suggestions, setSuggestions] = React.useState([]);
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);

    React.useEffect(() => {
      if (!containerRef.current) return;

      // Initialize mermaid
      window.mermaid.initialize({
        startOnLoad: true,
        theme,
        securityLevel: 'loose',
      });

      try {
        window.mermaid.render('mermaid-diagram', code).then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        });
      } catch (error) {
        console.error('Failed to render Mermaid diagram:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="error">Error rendering diagram: ${error.message}</div>`;
        }
      }
    }, [code, theme]);

    const handleAnalyze = React.useCallback(async () => {
      setIsAnalyzing(true);
      try {
        const result = await analyze_mermaid(code);
        if (result.improvedCode) {
          setCode(result.improvedCode);
        }
        setSuggestions(result.suggestions);
      } catch (error) {
        console.error('Analysis failed:', error);
        setSuggestions(['Error analyzing diagram']);
      } finally {
        setIsAnalyzing(false);
      }
    }, [code]);

    const handleSave = React.useCallback(async () => {
      try {
        await save_mermaid_history(code);
      } catch (error) {
        console.error('Failed to save:', error);
      }
    }, [code]);

    return React.createElement('div', { 
      className: "app",
      style: { maxWidth: '1200px', margin: '0 auto', padding: '20px' }
    }, [
      React.createElement('header', { 
        key: 'header',
        style: { marginBottom: '20px' }
      }, [
        React.createElement('h1', { 
          key: 'title',
          style: { margin: '0 0 15px 0', color: '#333' }
        }, 'Mermaid Diagram Viewer'),
        React.createElement('div', {
          key: 'toolbar',
          style: { display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }
        }, [
          React.createElement('select', {
            key: 'theme-select',
            value: theme,
            onChange: (e) => setTheme(e.target.value),
            style: { padding: '8px' }
          }, [
            React.createElement('option', { key: 'default', value: 'default' }, 'Default'),
            React.createElement('option', { key: 'forest', value: 'forest' }, 'Forest'),
            React.createElement('option', { key: 'dark', value: 'dark' }, 'Dark'),
            React.createElement('option', { key: 'neutral', value: 'neutral' }, 'Neutral')
          ]),
          React.createElement('button', {
            key: 'analyze-btn',
            onClick: handleAnalyze,
            disabled: isAnalyzing,
            style: {
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              background: '#0066cc',
              color: 'white',
              cursor: 'pointer'
            }
          }, isAnalyzing ? 'Analyzing...' : 'Improve Diagram'),
          React.createElement('button', {
            key: 'save-btn',
            onClick: handleSave,
            style: {
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              background: '#28a745',
              color: 'white',
              cursor: 'pointer'
            }
          }, 'Save')
        ])
      ]),
      React.createElement('main', {
        key: 'main',
        style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }
      }, [
        React.createElement('div', { key: 'editor' }, 
          React.createElement('textarea', {
            value: code,
            onChange: (e) => setCode(e.target.value),
            placeholder: "Enter your Mermaid diagram code here...",
            style: {
              width: '100%',
              height: '400px',
              fontFamily: 'monospace',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }
          })
        ),
        React.createElement('div', {
          key: 'preview',
          style: { padding: '20px', border: '1px solid #eee', borderRadius: '4px', background: 'white' }
        }, React.createElement('div', { ref: containerRef })),
        suggestions.length > 0 && React.createElement('div', {
          key: 'suggestions',
          style: {
            gridColumn: '1 / -1',
            padding: '15px',
            background: '#f8f9fa',
            borderRadius: '4px',
            marginTop: '20px'
          }
        }, [
          React.createElement('h3', { 
            key: 'suggestions-title',
            style: { marginTop: 0, color: '#333' }
          }, 'Suggestions:'),
          React.createElement('ul', {
            key: 'suggestions-list',
            style: { margin: 0, paddingLeft: '20px' }
          }, suggestions.map((suggestion, index) =>
            React.createElement('li', {
              key: index,
              style: { margin: '5px 0', color: '#666' }
            }, suggestion)
          ))
        ])
      ])
    ]);
  }
};
