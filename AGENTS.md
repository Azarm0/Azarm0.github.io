## Content lives in three places that do not know about each other

Site copy is split across three files, and the build only reads two of them.
Change one and the others go stale silently — nothing catches it.

| File | What it holds | Read by |
|---|---|---|
| `src/data/site.ts` | packages, process, FAQ, contact | the build |
| `src/data/projeler.ts` | case studies | the build |
| `public/llms.txt` | a hand-written summary of all of the above | nothing — copied verbatim to the deployed site |

`llms.txt` is what AI assistants quote when someone asks about this agency, so a
stale claim there is a wrong answer given confidently to a prospect. On
2026-07-30 it was found describing a case study as the wrong project, listing a
package feature that had been removed, and advertising a work count that was off
by one — all because earlier edits touched only the TypeScript.

**After editing `site.ts` or `projeler.ts`, open `llms.txt` and reconcile it.**
Check the work count, the per-work descriptions, the package bullet lists, and
the FAQ.

`CLAUDE.md` is a symlink to this file (git mode `120000`), so there is nothing to
mirror — edit `AGENTS.md` and both are current. Do not replace the symlink with a
copy; that reintroduces the drift it exists to prevent.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
