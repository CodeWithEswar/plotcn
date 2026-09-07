# Charts validation

Scope: `/charts`, existing engine detail routes, their metadata, and registry packaging. The 30 baseline landing, background, and shared site files are byte-for-byte unchanged.

## Checks

- Production build: passed, including registry validation and TypeScript.
- `npm run typecheck`: passed.
- `npm run test`: 183 passed, 0 failed.
- ESLint for the changed discovery/detail UI, metadata, availability helper, and gallery tests: passed.
- Repository-wide lint: 72 pre-existing errors remain; baseline had the same 72 errors. No unrelated lint refactor was performed.
- Browser widths: 320, 375, 430, 640, 768, 1024, 1280, 1440, 1728, 1920. No horizontal page overflow. Charts content matches the navbar edges at every tested width.
- Panels use 12px radii; engine tabs/search/filter controls use 8px; category and density buttons use 6px.
- Confirmed engine/category/capability filtering, empty search/reset, browser Back state, mobile filter Sheet, density, and light theme.
- Detail container targets measured at 1100, 768, and 390px on desktop, with smaller screens constrained to available width.
- Confirmed fullscreen Escape dismissal and focus restoration, source wrapping/copy, and package-manager command copying.
- Google runtime remains absent on a fresh gallery load while Google previews are outside the viewport. All three Google previews render when visible.

## Public registry state

Checked the configured production origin, `https://plotcn.vercel.app`, on 2026-09-07. `line-basic`, `google-line`, and `google-bar` returned valid manifests. The other six chart entries returned 404. Install actions verify publication before copying a command; unavailable entries show a publication-pending message. Local manifests and source previews exist for all nine charts. Publication requires deployment of the generated registry outputs.

The registry generator now resolves local registry dependencies to the configured public origin, and Recharts source imports resolve within the installed file layout. Tests verify dependency closure and relative imports.
