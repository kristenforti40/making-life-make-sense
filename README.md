# Kristen's Excellent OS

A personal AI operating system for capture, memory, writing, ideas, daily execution, LSAT prep, faith, fitness, career, people, calendar planning, and future integrations.

## MVP

This branch contains a first remote-preview MVP of the personal OS. It is intentionally mock-data first and integration-ready rather than database/API-heavy.

Core principles:

- Capture everything.
- Extract meaning from chaos.
- AI suggests; Kristen approves.
- Organize without forcing every idea into a task.
- Surface patterns, themes, and next actions.
- Keep the system bright, precise, and high-agency.

## Current Flow

1. Open the command center.
2. Dump a thought into Universal Capture.
3. See mock AI extraction suggestions appear in the review queue.
4. Approve, edit, delete, or reclassify suggestions.
5. Review modules for memory, writing, ideas, media, daily life, LSAT, fitness, career, people, calendar, and integrations.

## Brand Direction

The interface follows the Kristen Forti brand brief: royal blue leads, ivory/white keeps the system bright, green signals aligned action, turquoise supports creative insight, rose marks relational/personal spaces, burgundy marks serious review and standards, and tan grounds reflective/archive contexts.

## Future Architecture

The central object should remain `Capture`. A real backend can later persist captures and extracted objects in Supabase, while OpenAI replaces the mock extraction layer with classification, synthesis, embeddings, and semantic search.
