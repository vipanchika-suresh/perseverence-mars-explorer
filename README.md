# Perseverance – The Little Explorer of Mars

**Beyond the Book – An Interactive Mars Adventure** is a child-friendly companion to our team's digital storybook. The site uses HTML, CSS, and vanilla JavaScript only. It has no backend or database.

## Project files

```text
NASA/
├── index.html          # Homepage and six hash-routed experience pages
├── style.css           # Theme, CSS illustrations, animation, and responsive layouts
├── script.js           # Rover field notes, matching game, quiz, and book URL
├── assets/
│   ├── images/          # Rover photo and optional local project imagery
│   ├── icons/           # Optional icons
│   └── book/            # Optional storybook files
└── README.md            # Project notes and local run instructions
```

The friendly astronaut is original CSS project artwork. The existing hero illustration and rover selfie are credited beside the images. Those NASA images require an internet connection. The rover field guide is ready for a real photograph; it does not use the existing rendered rover artwork.

## Rover photograph and hotspots

Add the supplied, real rover photograph as `assets/images/perseverance-rover-photo.jpg`. In `script.js`, set each entry in `roverHotspotPositions` to an object with x and y percentages after checking the photo. The x and y values are percentages from the original photograph's left and top edges; the site maps those positions across responsive image sizing. Unconfigured hotspots remain hidden. Their readable field notes and science details are already included.

The main navigation changes one experience page at a time. Each page has Back and Next links, and the browser Back and Forward buttons follow the page history.

## Run locally

Open `index.html` in a browser. To use a local server instead, open a terminal in this folder and run:

```bash
python -m http.server 8000
```

Visit `http://localhost:8000`. Stop the server with `Ctrl+C`.

## Update content

- Edit `roverTools` in `script.js` to update child-friendly tool explanations, science details, or source links.
- Edit `matchItems` and `matchFunctions` in `script.js` to update the matching activity.
- Edit `quizQuestions` in `script.js` to update the five-question quiz and answer key.
- Replace `storybookUrl` near the bottom of `script.js` with the public Canva link. The visible placeholder note will then disappear.
- Add locally stored, verified, credited imagery to `assets/images/` if desired.

## NASA references

- [Perseverance mission overview](https://science.nasa.gov/mission/mars-2020-perseverance/)
- [Perseverance science instruments](https://science.nasa.gov/mission/mars-2020-perseverance/science-instruments/)
- [NASA's November 9, 2026 Perseverance mission update](https://science.nasa.gov/blog/newest-sample-oldest-rock/)
- [Ingenuity mission end announcement](https://www.nasa.gov/news-release/after-three-years-on-mars-nasas-ingenuity-mars-helicopter-mission-ends/)
- [Perseverance rover illustration, NASA/JPL-Caltech](https://science.nasa.gov/photojournal/perseverance-on-mars/)
- [Perseverance westernmost selfie, NASA/JPL-Caltech](https://science.nasa.gov/photojournal/nasas-perseverance-rover-snaps-westernmost-selfie/)

This is an independent educational student project and is not an official NASA website. NASA does not endorse or take responsibility for this project.
