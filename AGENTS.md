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
