# Earth Pulse

**Seismic event / time window / aggregation**

Earth Pulse is a near-real-time observation instrument for reading global seismic activity as a rolling event field. It presents recent USGS earthquake solutions in time and space, then lets the same catalogue be examined as individual events or as aggregated counts.

> **GeoGeek principle:** Density is a summary, not an earthquake.

## Mission

The project is built around one operational question: what can a short, current seismic catalogue show clearly, and what must it not be allowed to imply?

Earth Pulse keeps the answer bounded. It is useful for seeing where events have been reported, how recent activity is distributed, and how aggregation changes visual emphasis. It is not a hazard forecast, a risk model, or a historical seismic archive.

## Current observation cycle

The production deployment uses the USGS Earthquake Hazards Program rolling past-24-hour GeoJSON feed. During deployment, the response is validated as a GeoJSON `FeatureCollection`, stored as a same-origin snapshot, and accompanied by UTC fetch time and SHA-256 metadata.

The refresh workflow runs hourly and on normal production deployments. If upstream validation fails, the last successful Pages deployment is retained rather than being replaced by an invalid snapshot.

## Event view and count grid

The event representation preserves individual catalogue records and their reported properties. The count grid deliberately removes that individuality and answers a different question: how many catalogue events fall inside each spatial cell for the selected view and time conditions?

That grid must not be interpreted as:

- earthquake probability;
- shaking intensity;
- exposure or risk;
- a physically continuous seismic field.

USGS event solutions can also be revised after first publication. “Current” therefore describes the deployed catalogue snapshot, not an immutable final solution.

## Operations

**Public instrument**  
https://geogeeklab.github.io/earth-pulse/

The interface runtime is sourced from `GeoGeekLab/GeoGeekLab.github.io` and pinned to commit `d949bd75870bfd49f6d12b297e6cca02de107f9c`. The USGS data snapshot is refreshed independently by this repository’s deployment workflow.

See [`PRODUCTION.md`](./PRODUCTION.md) for the exact runtime chain, refresh contract, and interpretation limits.

A local checkout can serve the entry shell with:

```bash
python -m http.server 8000
```

The deployed Pages artifact is the production path for the validated rolling snapshot.

---

Part of the **GeoGeek Observatory** — current data, explicit limits, no hazard theater.
