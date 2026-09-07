# Security Policy

## Reporting Security Issues

The Plotcn team takes security vulnerabilities seriously. If you discover a vulnerability in Plotcn, please report it responsibly.

### Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

### Reporting Channel

Please **do not** open public GitHub issues for security-sensitive bugs.

Instead, report vulnerabilities via:
- GitHub Private Vulnerability Reporting on this repository
- Or email the maintainers directly

Please include:
1. Component name and registry file path.
2. Steps to reproduce or proof-of-concept payload.
3. Impact assessment on consumer applications.

---

## Hosted Third-Party Runtime Considerations

### Google Charts External Runtime
Plotcn Google Charts components dynamically load Google's official visualization runtime script from `https://www.gstatic.com/charts/loader.js`.

- **Integrity**: Google's CDN script is loaded over HTTPS.
- **Content Security Policy (CSP)**: Consumer applications using Google Charts should permit `script-src https://www.gstatic.com` and `connect-src https://www.gstatic.com https://www.google.com`.
- **Isolation**: Google Charts components are strictly scoped to their mounting container and never access application state or credentials.

---

## Dependency Review Expectations

All registry items are audited before publishing to ensure:
- Zero unvetted transitive dependencies.
- No malicious postinstall scripts.
- No telemetry or external tracking scripts embedded in component source code.
