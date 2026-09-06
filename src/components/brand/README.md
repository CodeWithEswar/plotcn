# Plotcn brand

`src/components/brand/AppLogo.tsx` owns the three filled SVG paths. It is a pure,
framework-neutral React component using standard SVG props and `currentColor`.

```tsx
import { AppLogo, PlotcnLogo } from "@/components/brand"

<AppLogo className="size-7 text-foreground" />
<PlotcnLogo markClassName="size-7" />
```

`AppLogo` now renders only the mark. Use `PlotcnLogo` for mark + HTML wordmark.
`PlotcnMark` remains an alias for the canonical mark, and existing lowercase
import paths remain supported. Beside text, the SVG is decorative by default.
For standalone meaningful use, pass `aria-hidden={false}`, `role="img"`, and
`aria-label="Plotcn"`, or label its enclosing link.

After changing geometry, run:

```sh
node scripts/sync-brand.mjs
node scripts/sync-brand.mjs --check
```

This updates/checks the static SVG assets and favicon, including the existing
legacy asset paths. The root `app/icon.svg` is the active Next.js icon; the
`src/app/icon.svg` compatibility copy uses the same generated geometry.
The generator uses the existing Next.js Sharp installation only at development
time. The React component has no runtime dependency beyond React.

The existing `/logo-test` page remains the interactive brand validation page.
`brand-validation.png` records the rendered component at 16, 20, 24, 28, 32, 40,
48, 64, and 128px, on black, zinc-950, zinc-900, white, and zinc-50.
