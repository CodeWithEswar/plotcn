# ADR 0001: Source-First Registry Distribution

## Status
Accepted

## Context
Traditional React chart libraries publish black-box npm packages that lock developers into rigid styling abstractions and prevent deep customization.

## Decision
Plotcn distributes editable TypeScript source code directly into consumer repositories using the shadcn Registry schema.

## Consequences
- Consumers own 100% of installed code.
- Plotcn avoids maintaining high-surface runtime packages.
- Installed source must remain readable and free of internal monorepo helpers.
