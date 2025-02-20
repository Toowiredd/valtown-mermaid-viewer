import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
  code: string;
  theme?: 'default' | 'forest' | 'dark' | 'neutral';
}

export const MermaidRenderer = ({ code, theme = 'default' }: MermaidRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    mermaid.initialize({
      startOnLoad: true,
      theme,
      securityLevel: 'loose',
    });

    try {
      mermaid.render('mermaid-diagram', code).then(({ svg }) => {
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

  return <div ref={containerRef} className="mermaid-container" />;
};
