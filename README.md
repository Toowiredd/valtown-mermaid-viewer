# Mermaid Diagram Viewer

A web application for creating, editing, and analyzing Mermaid diagrams using AI-powered features on the Val Town platform.

## Features

- Create and edit Mermaid diagrams in real-time
- AI-powered diagram improvements and suggestions
- Multiple theme support
- Diagram version history
- Val Town serverless backend

## Tech Stack

- React 18.2.0
- Mermaid 10.6.1
- OpenAI GPT-4 integration
- Val Town KV Namespace for storage
- TypeScript/Deno runtime

## Project Structure

```
src/
  ├── components/
  │   ├── MermaidRenderer.tsx
  │   └── ThemeSelector.tsx
  ├── hooks/
  │   ├── useHistory.ts
  │   └── useAiAnalysis.ts
  ├── api/
  │   ├── history.ts
  │   └── analyze.ts
  └── db/
      └── index.ts
```

## Requirements

- VAL_TOWN_API_KEY
- OPENAI_API_KEY

## Development

This project is developed and deployed on Val Town's serverless platform. Each component is available as an individual val that can be imported and used independently.

Main App: https://www.val.town/v/toowired/mermaid_viewer
