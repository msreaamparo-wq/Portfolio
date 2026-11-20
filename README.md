# Rea Amparo — Developer Portfolio

A personal portfolio built with HTML, CSS, vanilla JavaScript, and Three.js. The visual direction is a dark, editorial workspace: a television wall, project screens, oversized typography, restrained amber/rust accents, and original canvas artwork.

**[Open the portfolio](https://msreaamparo-wq.github.io/Portfolio/)** · **[GitHub profile](https://github.com/msreaamparo-wq)**

## Featured projects

| Project | Focus | Status |
|---|---|---|
| TRACE — SSG Attendance | Flutter, Firebase, QR check-in, location verification | Prototype |
| Kwarta Budget Tracker | Flutter, SQLite, Supabase, React browser version | Build |
| Gender-Neutral Language Recognizer | Python, Flask, Finite State Automata | Web tool |
| Cacao Vision | CNN-based Black Pod Rot severity research, Bayesian HPO | In progress |
| COSMOS — Memory Gallery | Flutter, SQLite, IndexedDB, optional Supabase sync | Prototype; not yet verified |
| Our Little Archive | Shared memory journal concept | Side project |
| Void Experience | Browser-only visual experiment | Experiment |

The page includes an interactive Three.js television-room introduction, a horizontal project rail with case studies, project-specific canvas illustrations, a toolkit constellation, responsive layouts, reduced-motion support, and a fallback when WebGL is unavailable. Project art is illustrative, not app screenshots or claims about real model outputs. Private repositories are labelled as private rather than linked as public source.

Cacao Vision is still research in progress; no validated model accuracy is claimed. The COSMOS repository notes that the app still needs compilation and end-to-end testing.

## Run locally

No build step or package installation is required:

```bash
python -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080). Three.js r128, GSAP 3.12.5, and the typefaces load from external CDNs, so an internet connection is needed for the full visual experience.

Edit `REA.projects` and `REA.toolkit` in `js/config.js` to change the project list and technologies. Add genuine screenshots under `assets/projects/` and list them in a project's `shots` array.

Push changes to `main` to publish through the existing GitHub Pages workflow.
