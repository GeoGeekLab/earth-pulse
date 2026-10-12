# Production contract

`earth-pulse` is the public entrypoint for the production *EARTH PULSE* instrument.

## Runtime

- Source repository: `GeoGeekLab/GeoGeekLab.github.io`
- Tested source revision: `12743de0f7d0e900031ec2cbbe17551255e271a5`
- Bootstrap asset release: `20261004b` (shared loader constant; distinct from the Lab HTML release)
- Production channel: `https://geogeeklab.github.io/`
- Shared bootstrap: `/core/observatory-entry.js`
- Pulse runtime: `/pulse-observation-lab-v2.js` → `v3` → `v4`
- Optional Lab refinements: `/pulse/pulse-round6.js`, `/pulse/pulse-workflow-v1.js`, `/pulse/pulse-workflow-v2.js`
- Presentation CSS: `/pulse/pulse-ui-system.css`, `/pulse/pulse-map-viewport.css`
- Provider control: `/core/provider-stability.js` + `/core/data-supply.js`

## Seismic data supply

The main GeoGeek data-supply workflow refreshes the USGS rolling past-24-hour GeoJSON snapshot, validates the `FeatureCollection`, records retrieval time and SHA-256 metadata, and deploys the snapshot on the main GitHub Pages origin. The entrypoint reads the same production snapshot through the unified `usgs-earthquakes-day` adapter.

This repository does not maintain a second USGS snapshot or an independent refresh schedule.

## Release checks

The repository validates the source revision, shared bootstrap reference, Chromium instrument mount, `same-origin-snapshot` transport for `usgs-earthquakes-day`, absence of `.instrument-error`, instrument screenshot, Pages deployment, and the deployed public endpoint.

## Lab synchronization (20261011v107watercache1)

The standalone entry now has OBSERVE / ANALYZE task controls. Analyze uses the original 24-hour source or an explicit USGS FDSN historical query and does not bypass the main-site same-origin snapshot routing. Its optional workflow modules load before the base instrument mounts and may degrade without preventing the OBSERVE view. The reference source SHA identifies the main-site tree inspected for this alignment, not immutable historical hosting; assets are always served from the current shared GitHub Pages origin.

Lab reference: https://geogeeklab.github.io/lab.html?release=20261011v107watercache1
