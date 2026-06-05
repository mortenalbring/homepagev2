# i18n Setup

This project uses `i18next` + `react-i18next` for runtime language switching.
The active language is persisted in `localStorage.appLanguage` and toggled
from the `EN/NO` button in the taskbar.

## Supported languages

- `en` (default)
- `no`

---

## Authoring patterns

Pick whichever fits your content best — they all interoperate.

### 1. `<Localized>` — inline JSX (recommended for blog posts & most content)

Author both languages right next to each other:

```tsx
import {Localized} from '../i18n';

<Localized>{{
  en: <>
    <h2>My post</h2>
    <p>Hello, world.</p>
  </>,
  no: <>
    <h2>Innlegget mitt</h2>
    <p>Hei, verden.</p>
  </>,
}}</Localized>
```

If `no` is missing it falls back to `en` automatically. Use this for whole
sections of content where the structure differs slightly between languages
(e.g. links, idioms, examples).

### 2. `<T>` — inline short strings

For one-liners like button labels:

```tsx
import {T} from '../i18n';

<button><T en="Save" no="Lagre"/></button>
<h3><T en="Welcome" no="Velkommen"/></h3>
```

### 3. `LocalizedString` in data files (`fileSystem.json`, popup config)

Any `name` / `title` / `menu` / `status` field accepts either a plain string
or a `{ en, no }` object:

```json
{
  "id": "projects",
  "name": { "en": "Projects", "no": "Prosjekter" }
}
```

Strings without translations stay as strings — no migration needed for content
you don't want to localize.

### 4. `useTranslation()` keys — for chrome / UI strings

For static UI labels reused in many places (menu items, status text), add a
key to `src/i18n/resources.ts` and use it via the standard i18next hook:

```tsx
const {t} = useTranslation();
t('folderWindow.empty');
t('folderWindow.objects', {count: 3}); // plural-aware
```

### 5. Separate `*.no.tsx` files — for very long content

For posts long enough that two interleaved language slots become unreadable,
keep the languages in separate files and register both in `src/popups/index.tsx`:

```ts
'computations': {
  en: ComputationsIrreversibilityContent,
  no: ComputationsIrreversibilityContentNo
}
```

If `no` is missing, `en` is rendered automatically.

---

## Helpers reference

All exported from `src/i18n`:

| Export | Purpose |
| --- | --- |
| `<Localized>` | Render the slot matching the active language |
| `<T en="..." no="..."/>` | Inline short text helper |
| `useAppLanguage()` | Returns `'en' \| 'no'`; re-renders on language change |
| `pickLocalized(value, lang)` | Resolve a `Localizable<T>` to a concrete value |
| `toggleLanguage()` | Flip between EN and NO |
| `getCurrentLanguage()` | Imperative read of the current language |
| `type Localizable<T>` | Union: `T \| Partial<Record<AppLanguage, T>>` |
| `type AppLanguage` | `'en' \| 'no'` |

## Adding a new language

1. Add the key to `resources.ts` (e.g. `de: {...}`).
2. Update `toAppLanguage` in `src/i18n/language.ts` to recognise the prefix.
3. Update `formatLanguageLabel` to return the label (e.g. `'DE'`).
4. Update the taskbar's `toggleLanguage` if you want a cycle instead of a flip.
5. All `<Localized>`, `<T>` and `LocalizedString` fields will automatically
   accept the new key (typed against `AppLanguage`).
