# Earth Pulse

**Seismic event / time window / aggregation.**

Earth Pulse is an independent GeoGeek Observatory deployment of the production seismic observation instrument. It reads a validated rolling 24-hour USGS snapshot, supports timeline and event filters, and switches between event and density representations without treating the result as a hazard model.

## Public instrument

https://geogeeklab.github.io/earth-pulse/

## Runtime and data supply

The production runtime is pinned to a specific commit of `GeoGeekLab/GeoGeekLab.github.io`. The Pages workflow refreshes the USGS snapshot hourly, validates GeoJSON structure, records UTC fetch time and SHA-256, and deploys the snapshot with the site.

See `PRODUCTION.md` for the exact baseline and interpretation limits.

## Local shell

```bash
python -m http.server 8000
```

A local checkout does not automatically contain the build-time USGS snapshot. The deployed Pages artifact is the production data path.

## Deployment

Pushes to `main`, manual dispatches, and the hourly schedule deploy through `.github/workflows/pages.yml`. A failed upstream validation prevents a new artifact from replacing the last successful deployment.

Third-party software and data remain subject to their respective terms and licenses. This repository does not introduce a project license that is absent from the source project.
