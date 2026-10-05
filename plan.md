# Cricket Field Learning Tool — Implementation Plan

## Product direction
A focused, accessible learning tool for blind and low-vision cricket players to build a mental model of fielding positions. The first release is intentionally self-contained: no account, database, or network calls are needed. Learning progress is session-based and stored in the browser only if we later add persistence.

## Design direction
- **Design movement:** Editorial sports coaching meets calm wayfinding instrument.
- **Core principles:** Orientation before decoration; every visual cue has a text/audio equivalent; one clear next action; confidence-building feedback.
- **Color philosophy:** Deep ink and warm off-white keep the interface quiet and readable. Teal is the signature orientation color: it marks the pitch, active position, and action focus without implying danger. Amber is reserved for learning feedback and progress.
- **Layout paradigm:** A split “field + coach” composition rather than a dashboard grid. The field is a large spatial canvas on the left; the right side acts as a persistent coach strip. On small screens, the coach becomes the next section after the field.
- **Signature elements:** A teal orientation line from batter to bowler; pill-shaped position markers with large touch targets; a compact session rail that reads like a coaching notebook.
- **Interaction philosophy:** Explore by selecting a position, then hear/read a concise spatial explanation. Guide mode creates a deliberate sequence. Quiz mode turns the same map into a low-pressure recall exercise.
- **Animation:** Short, restrained transitions only: active field marker gently rises, coach card crossfades, and a feedback pulse appears after answers. Respect `prefers-reduced-motion`.
- **Typography system:** System UI sans for dependable rendering and strong screen-reader/browser consistency. Large condensed-style hierarchy is approximated with weight and tracking rather than a remote font dependency.
- **Brand essence:** “A calm field map for learning cricket by position, voice, and repetition.” Personality: grounded, encouraging, precise.
- **Brand voice:** Direct and coaching-oriented. Example lines: “Start with the pitch. Everything else is a reference point.” / “Good choice. You’re building the map.”
- **Wordmark & logo:** A simple compass-cross mark built from a pitch line, wicket line, and a single teal dot; rendered as inline SVG so it remains sharp and does not depend on image assets.
- **Signature brand color:** Teal `#16c6b4`, the visual shorthand for orientation and “you are here.”

## Implementation approach
- `index.html` provides the semantic page structure, live regions, buttons, mode tabs, and an alternative text field list.
- `styles.css` owns the responsive split layout, high-contrast treatment, touch target sizing, focus states, field drawing, and reduced-motion behavior.
- `app.js` owns the position data, field-marker rendering, guide state, quiz state, speech synthesis, keyboard shortcuts, and accessible status announcements.
- `public/manus-routes.json` declares the single `/` route for Preview and publishing.
- `app.config.ts` carries the project logo URL before checkpointing.
- No server or database is required for this learning-only prototype; Vite serves the static frontend on port 3000.

## Project structure
```text
cricketfield/
├── index.html              # semantic app shell
├── styles.css              # responsive and accessible visual system
├── app.js                  # learning state and interactions
├── package.json            # Vite scripts
├── public/
│   └── manus-routes.json   # route manifest
├── app.config.ts           # platform logo metadata
├── TODO.md                 # outcome criteria from the request
└── plan.md                 # this implementation and design plan
```
