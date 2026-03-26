# AGENTS

## Repository Purpose

This repository is used to analyze P2P logs.

It currently focuses on:

- reading and understanding P2P-related log content
- extracting key fields from logs
- helping AI reason over log structure and troubleshooting context

## Knowledge Base

The `knowledge/` directory is the knowledge base and can be used as reference material for AI.

When adding new knowledge:

- prefer one topic per file
- use stable, descriptive English filenames
- keep examples close to real log samples in this repository

## Tech Stack

Current stack of this repository:

- Vite 5
- React 19
- TypeScript 5
- React Router 6
- Zustand 5

## Project Shape

Main areas in the repository:

- `src/`: frontend application code
- `knowledge/`: AI-reference knowledge documents

## Active Technologies
- TypeScript 5.x, React 19.x + Vite 5, React 19, React Router 6, Zustand 5, `@tanstack/react-virtual` for large-list rendering, browser File API, Pencil design at `specs/001-p2p-log-viewer/log_viewer.pen` (001-p2p-log-viewer)
- N/A; all file contents and derived viewer state remain in browser memory for the active session (001-p2p-log-viewer)

## Recent Changes
- 001-p2p-log-viewer: Added TypeScript 5.x, React 19.x + Vite 5, React 19, React Router 6, Zustand 5, `@tanstack/react-virtual` for large-list rendering, browser File API, Pencil design at `specs/001-p2p-log-viewer/log_viewer.pen`
