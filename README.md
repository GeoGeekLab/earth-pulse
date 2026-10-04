# Earth Pulse

**Seismicity · point pattern · temporal window · spatial aggregation**

Earth Pulse is a spatiotemporal observation instrument for exploring recent global seismicity as an event field. It combines a rolling earthquake catalogue with temporal filtering, magnitude filtering, event-symbol mapping, and grid-based aggregation so that the same seismic sequence can be examined at both event and regional scales.

![Earth Pulse instrument](https://geogeeklab.github.io/earth-pulse/assets/instrument.png)

## Analytical perspective

The primary data model is a georeferenced point-event catalogue. Each earthquake carries a location, origin time, magnitude, and associated event metadata. The interface allows the active temporal support to be changed from a short recent interval to the full rolling 24-hour window, making the spatial pattern explicitly dependent on observation time.

Two complementary spatial representations are available. Event symbols preserve individual epicentral locations and magnitudes. The count grid transforms the point pattern into cell-based frequencies, providing a regional summary whose interpretation depends on grid resolution and temporal window.

## Data provenance and processing

| Component | Specification |
| --- | --- |
| Seismic catalogue | USGS Earthquake Hazards Program, rolling past-24-hour GeoJSON feed |
| Temporal support | User-selected interval within the current 24-hour snapshot |
| Point representation | Individual earthquake events with magnitude filtering |
| Areal representation | Regular-grid event counts |
| Reference geography | Version-pinned Natural Earth land geometry |
| Snapshot integrity | UTC fetch time and SHA-256 recorded at deployment |

The deployed snapshot is refreshed hourly and validated as a GeoJSON `FeatureCollection` before publication. The resulting map supports exploratory analysis of recent seismic clustering, regional event frequency, and changes in spatial concentration through time.

## Instrument access

**Live instrument:** https://geogeeklab.github.io/earth-pulse/

This repository provides the public entrypoint and the validated deployment snapshot. The production visualization runtime remains in `GeoGeekLab/GeoGeekLab.github.io`. `SOURCE.json` records the pinned source revision, while `PRODUCTION.md` documents the runtime, snapshot, and aggregation contract.

*GeoGeek note — time window and spatial support define the pattern you see.*
