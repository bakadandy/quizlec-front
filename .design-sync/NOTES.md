# design-sync notes — quizlec-front

## Repo quirks

- **App repo, not a library.** `quizlec-front` is a Vite app, not a published package. The converter needs `--entry ./src/components/ui.tsx` explicitly; without it the build crashes looking for `node_modules/quizlec-front/package.json`.
- **No library `.d.ts` by default.** The app tsconfig has `noEmit: true`. A separate `tsconfig.dts.json` generates `dist/types/ui.d.ts`, and `index.d.ts` at the project root re-exports from it. Both must exist before running the converter or it gets zero component exports (`[ZERO_MATCH]`).
- **CSS is the app bundle.** `dist/assets/index-BAf-kuE2.css` is the hashed Vite output. On re-sync, rebuild the app (`npm run build`) to regenerate it, then update `cssEntry` in config if the hash changes.
- **Lato font declared but never loaded.** `body { font-family: Lato, ... }` is in the app CSS but there is no `@font-face` and no CDN link in `index.html`. The app uses system font fallbacks in practice. Config suppresses `[FONT_MISSING]` via `runtimeFontPrefixes: ["Lato"]`.
- **Modal shows `[RENDER_THIN]` — non-blocking.** The `Modal` component uses `position:fixed inset-0`, so the preview root has 0px height in the render check. The modal still renders correctly in the actual iframe (visible in screenshots). Config sets `overrides.Modal.cardMode: "single"`.
- **Sidebar excluded.** `Sidebar.tsx` uses `react-router-dom`'s `NavLink` and is app-specific navigation, not a portable UI primitive. `componentSrcMap.Sidebar: null` excludes it.

## Re-sync procedure

```bash
# 1. Rebuild app (updates CSS hash) — skip if src unchanged
npm run build

# 2. Update cssEntry in config if dist/assets/ hash changed
# 3. Regenerate .d.ts
npx tsc --project tsconfig.dts.json

# 4. Re-copy staged scripts (always do this)
cp -r ~/.claude/... .ds-sync/  # or re-run design-sync

# 5. Run converter
node .ds-sync/package-build.mjs --config design-sync.config.json --node-modules ./node_modules --entry ./src/components/ui.tsx --out ./ds-bundle
node .ds-sync/package-validate.mjs ./ds-bundle
```

## Re-sync risks

- **CSS hash changes on every `npm run build`.** The `cssEntry` path includes a content hash (`index-BAf-kuE2.css`). If components change, rebuild the app and update `design-sync.config.json` with the new hash.
- **Authored previews tied to current component API.** If `ui.tsx` props change (e.g. Button gets a new `size` prop), the preview TSX files in `.design-sync/previews/` may show stale props. The old previews still compile and render but won't demonstrate new API.
- **`index.d.ts` barrel is synthetic.** It's committed to the repo root (unusual placement). A future dev may delete it thinking it's stray. The re-sync notes: it must exist for the converter to extract types.
- **Lato font substitution accepted.** Design agent will build with system fonts. If the team ever adds a Google Fonts CDN link for Lato, add it to `styles.css` via `cfg.extraFonts` or a custom CSS file.
