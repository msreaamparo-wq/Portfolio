# Rea Amparo — Developer Portfolio

A responsive, interactive developer portfolio built with **HTML, CSS, JavaScript, and Three.js**. It introduces my work in software development and applied computer vision through a dark charcoal interface with violet and cyan accents.

**[View the live portfolio](https://msreaamparo-wq.github.io/)** · **[GitHub profile](https://github.com/msreaamparo-wq)**

## Highlights

- **Interactive Three.js hero** with a 3D torus-knot sculpture, wireframe geometry, orbit rings, and floating satellite objects.
- **Animated particle field** surrounding the 3D scene.
- **Pointer-responsive movement** with smooth camera and object parallax.
- **Interactive project cards** with pointer-based tilt and spotlight effects.
- **Scroll-based reveals** for headings, project cards, and content sections.
- **Animated counters** and a reading-progress indicator.
- **Responsive navigation** with a mobile menu and keyboard dismissal.
- **Reduced-motion support** that respects the user's system preference.
- **Responsive rendering** with a lighter particle count on smaller screens.

## Built with

| Area | Technologies |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 |
| Interactions | JavaScript (ES modules) |
| 3D graphics | Three.js |
| Typography | Plus Jakarta Sans |
| Hosting | GitHub Pages |

Three.js is loaded as an ES module from jsDelivr. The page also loads its font from Google Fonts, so an internet connection is needed for those external assets.

## Run locally

No package installation or build step is required.

1. Clone the repository:
   ```bash
   git clone https://github.com/msreaamparo-wq/Portfolio.git
   cd Portfolio
   ```
2. Start a local web server from the project folder:
   ```bash
   python -m http.server 5500
   ```
3. Open [http://localhost:5500](http://localhost:5500) in your browser.

You can also open the folder in Visual Studio Code and use the Live Server extension.

## Project structure

```text
Portfolio/
├── assets/              # Images and visual assets
├── css/
│   └── clean.css        # Layout, theme, responsive styles, and motion states
├── js/
│   ├── interactions.js  # Navigation and project-card interactions
│   ├── lively.js        # Scroll reveals, counters, and motion effects
│   ├── photo.js         # Portrait effect setup
│   └── three-scene.js   # Three.js hero scene
└── index.html           # Portfolio content and page structure
```

## Accessibility and performance

The experience checks the `prefers-reduced-motion` setting and avoids continuous motion when reduced motion is requested. The 3D renderer also caps pixel density and uses fewer particles on smaller screens to reduce rendering cost.

---

**Build with purpose. Learn continuously. Make things that work.**
