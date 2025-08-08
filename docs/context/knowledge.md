# Knowledge Architecture

System knowledge is stored in the docs folder.

## Knowledge Principles

- **Co-location**: Documentation lives near relevant code
- **Smart Extension**: New documentation files created automatically when

  warranted

- **AI-First**: Optimized for efficient AI context loading and machine-readable

  patterns

## Knowledge Index

- `@CLAUDE.md` - Master index to all other knowledge, essential standards and
  development protocols
- `@docs/context/project-structure.md` - _REQUIRED reading._ Complete technology
  stack, file tree, and system architecture. Must be attached to Gemini
  consultations
- `@docs/context/coding-standards.md` - Rules for generating code, tests, or
  configs
- `@docs/context/knowledge.md` - Where locate knowledge, how to generate and
  update.
- `@docs/context/deployment.md` - _Infrastructure patterns._ Containerization,
  monitoring, CI/CD workflows, and scaling strategies
- `@docs/context/handoff.md` - \_Session continuity. \_Current tasks,
  documentation system progress, and next session goals

## Adding New Knowledge

TODO

1. Always update this index to reflect changes to knowledge or new knowledge
   docs
2. Add new system-level knowledge to @docs/context
3. Add or update specs in @docs/specs

## Deprecating Knowledge

1. Remove obsolete knowledge
2. Always update knowledge to reflect the current state of the code
3. Update this mapping document
4. Check for broken references to other docs
