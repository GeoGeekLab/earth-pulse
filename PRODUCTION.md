# Production contract

`earth-pulse` is the public entrypoint for the production *EARTH PULSE* instrument.

## Runtime

- Source repository: `GeoGeekLab/GeoGeekLab.github.io`
- Tested source revision: `de142ef7a2002498b01fae22ff8734b42475de9c`
- Runtime release: `20261004b`
- Production channel: `https://geogeeklab.github.io/`
- Shared bootstrap: `/core/observatory-entry.js`
- Pulse runtime: `/pulse-observation-lab-v2.js` → `v3` → `v4`
- Provider control: `/core/provider-stability.js` + `/core/data-supply.js`

## Seismic data supply

The main GeoGeek data-supply workflow refreshes the USGS rolling past-24-hour GeoJSON snapshot, validates the `FeatureCollection`, records retrieval time and SHA-256 metadata, and deploys the snapshot on the main GitHub Pages origin. The entrypoint reads the same production snapshot through the unified `usgs-earthquakes-day` adapter.

This repository does not maintain a second USGS snapshot or an independent refresh schedule.

## Release checks

The repository validates the source revision, shared bootstrap reference, Chromium instrument mount, `same-origin-snapshot` transport for `usgs-earthquakes-day`, absence of `.instrument-error`, instrument screenshot, Pages deployment, and the deployed public endpoint.
