# Design Preview

Temporary browser-only preview tooling for the raw files in `design/`.

## Start

```bash
npm run preview:design
```

Open `http://localhost:4310`.

## Removal

This tooling is intentionally isolated from the Expo app. To remove it after MVP 1:

1. Delete `tools/design-preview/`
2. Remove the `preview:design` script from the root `package.json`

No app code under `src/` should need edits.
