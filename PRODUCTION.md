# Production contract

## Runtime baseline

This repository mounts the Pulse production chain from `GeoGeekLab/GeoGeekLab.github.io` pinned to commit `d949bd75870bfd49f6d12b297e6cca02de107f9c`.

The standalone shell loads the unified data-supply runtime, then Pulse v2, v3, and v4 in order. Production CSS is pinned to the same source commit.

## Data contract

- Provider: USGS Earthquake Hazards Program.
- Dataset: all earthquakes / rolling past 24 hours GeoJSON feed.
- Delivery: same-origin Pages snapshot generated during deployment.
- Refresh: the Pages workflow runs hourly at minute 17 and on every push or manual dispatch.
- Metadata: every deployed snapshot includes UTC `fetchedAt` and SHA-256.
- Land reference: version-pinned Natural Earth reference from the production source baseline.

## Interpretation limits

The snapshot is a rolling event catalogue, not a historical archive. Event solutions can be revised. The count grid is an aggregation of event counts, not a hazard surface or risk model.

## Deployment contract

The workflow validates the upstream response as a GeoJSON FeatureCollection before deployment. A failed refresh prevents a new Pages artifact from replacing the last successful deployment.
