# i18n Setup

This project uses `i18next` + `react-i18next` for runtime language switching.

## Supported languages

- `en` (default)
- `no`

## How popup localization works

Popup content is registered in `src/popups/index.tsx` as localized component maps:

```ts
'computations': { en: ComputationsIrreversibilityContent, no: ComputationsIrreversibilityContentNo }
```

If `no` is missing, English automatically falls back.

## Recommended pattern for EN/NO popup pairs

1. Keep the English component in `*.tsx`.
2. Add Norwegian variant in `*.no.tsx`.
3. Share structure via `src/popups/LocalizedPopupFrame.tsx`.
4. Register both in `src/popups/index.tsx`.

## Language toggle

The taskbar `EN/NO` button calls `toggleLanguage()` from `src/i18n/index.ts`.
The chosen language is persisted in `localStorage` under `appLanguage`.

