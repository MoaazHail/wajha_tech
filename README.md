# وجهة — Frontend (v2)

Next.js 15 (App Router) · TypeScript · Tailwind v4 · Arabic only (RTL).

A single-page landing site, built to the `WAJHA Landing Page` design file. Every
call to action opens WhatsApp; the header and footer links are anchors on the
same page.

```bash
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
npm run lint
```

Copy `.env.example` to `.env.local` and set at least `NEXT_PUBLIC_WHATSAPP_URL` —
it is the target of every button on the page.

## Design tokens

Defined once in `src/app/globals.css` under `@theme`, then used as ordinary
Tailwind utilities (`bg-brand`, `text-muted`, `px-gutter`, `py-band`).

| Token | Value | Used for |
|---|---|---|
| `brand` / `brand-dark` | `#0D56F2` / `#0B45C9` | hero, buttons, prices |
| `accent` | `#FA5C39` | logo fold, badge, ticks, focus ring |
| `ink` / `ink-soft` | `#071B45` / `#1B2742` | body text |
| `muted` / `faint` | `#5C6E96` / `#8494B5` | secondary text |
| `surface` / `line` | `#F2F5FF` / `#C9D6FB` | light bands, hairlines |
| `night` / `night-tile` | `#0B1524` / `#16243B` | work rail, CTA, footer |
| `gutter` / `band` | fluid `clamp()` | page gutter, band padding |

Fonts: **Readex Pro** (`font-display`), **IBM Plex Sans Arabic** (`font-body`,
the default), **IBM Plex Mono** (`font-mono`, for numerals and `WAJHA`).

## Structure

```text
public/assets/images/                design artwork (hero, mockups, avatars)
src/app/                             the router
  layout.tsx                         <html lang="ar" dir="rtl">, fonts, footer
  page.tsx                           composes the seven sections
  _components/                       one file per section
  _lib/constants/landing.constant.ts all page copy
src/shared/                          code not tied to one section
  layout/ components/ ui/ lib/
```

### Where a file goes

1. Used by one route → that route's `_` folder.
2. Used by that route **and its nested routes** → the parent route's `_` folder.
3. Used by two or more **unrelated** routes → `src/shared/`.
4. A route must never import another route's `_` folder. If two routes need it, promote it.

### `lib` boundaries

| Folder | Holds | Rule |
|---|---|---|
| `constants` | static values | no logic, no JSX |
| `schemes` | Zod schemas | infer types from them |
| `types` | types/interfaces | no runtime code |
| `utils` | pure helpers | no I/O |
| `apis` | HTTP calls | network only |
| `services` | business logic over apis/utils | reusable |
| `actions` | Server Actions | validate → authorize → call service |

### Naming

kebab-case files, with the folder's suffix: `.provider.tsx`, `.skeleton.tsx`,
`.constant.ts`, `.scheme.ts`, `.d.ts`, `.util.ts`, `.service.ts`, `.api.ts`,
`.action.ts`. Hooks are `use-something.ts`.

### Conventions

- Server Components by default. `work-rail.tsx` (scroll buttons) and
  `site-header.tsx` (menu + active link) are the only `'use client'` files.
- The header is `fixed`; its height is `--header-h` in `globals.css`. The hero
  pads by it and `section[id]` offsets anchors by it, so change it in one place.
- Server-only files start with `import 'server-only'`.
- No i18n layer — Arabic copy lives in `_lib/constants` and in the components.
- `<html lang="ar" dir="rtl">` is set once in the root layout. Prefer logical
  utilities (`ms-*`, `pe-*`, `start-*`, `end-*`); use physical ones only where
  the design pins something to a physical edge (the back-to-top button, the
  step badges, the overlapping avatars). Wrap Latin runs in `.ltr`.

## Still to do

- Replace the placeholder contact details in `.env.local`.
- The four tiles in `نماذج من أعمالنا` are empty by design — add client
  screenshots to `WORKS` in `landing.constant.ts`.
## Header behaviour

The design simply hid the nav links below 1120px; the build replaces that with a
real menu.

| Width | Logo | Links | WhatsApp CTA | Toggle |
|---|---|---|---|---|
| ≥ 1120px | ✓ | inline row | in the bar | — |
| 640–1119px | ✓ | in the panel | in the bar | ✓ |
| < 640px | ✓ | in the panel | in the panel | ✓ |

The panel closes on link tap, Escape, a tap outside the header, and when the
viewport grows past 1120px.

The active link is the section currently under the header, tracked on scroll.
Clicking a link marks it immediately and pins it for 1.2s so the highlight does
not flicker through the sections the smooth scroll passes over.
