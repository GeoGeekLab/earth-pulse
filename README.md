# Earth Pulse

**Seismicity · spatiotemporal point process · temporal window · lattice aggregation**

*EARTH PULSE* is a spatiotemporal GIS instrument for exploring global seismicity as a georeferenced event catalogue. The current GeoGeek Lab separates a rolling 24-hour **OBSERVE** view from an explicit **ANALYZE** research workflow. It keeps source time, event time, spatial support, and analysis choices separate.

**In the Lab:** [Earth Pulse](https://geogeeklab.github.io/lab.html?release=20261011v107watercache1) · [Methods and limitations](https://geogeeklab.github.io/records/lab-l10.html).

<p align="center">
  <a href="https://geogeeklab.github.io/earth-pulse/">
    <img src="https://geogeeklab.github.io/earth-pulse/assets/instrument.png" alt="Earth Pulse instrument" width="720">
  </a>
</p>

## Instrument capabilities

- **Filter by time.** Restrict the rolling 24-hour snapshot to a shorter observation window.
- **Apply a magnitude threshold.** Filter the active event set by magnitude.
- **Map individual earthquakes.** Display epicentral locations with magnitude, depth, origin time, and provider metadata.
- **Aggregate events to a regular grid.** Convert the active point set into cell counts for regional frequency analysis.
- **Switch spatial representations.** Compare event symbols and lattice counts for the same filtered catalogue.
- **Inspect snapshot provenance.** Distinguish USGS event origin time, provider feed-generation time, GeoGeek fetch time, and stale/last-known-good status.
- **Open an analysis workflow.** Load the 24-hour source or explicitly query the USGS historical FDSN API for a UTC date range.
- **Select a geographic region (ROI).** Draw a rectangle or enter exact west/east/south/north bounds, including antimeridian-spanning bounds.
- **Compare UTC periods.** Compare disjoint A/B windows using observed record counts, magnitude/depth distributions, and map aggregation.
- **Inspect and export evidence.** Find specific events by ID/place; export selected event GeoJSON/CSV, a manifest, and comparison chart/grid CSV files.

## Two research tasks

| Task | Data and interaction | Important boundary |
| --- | --- | --- |
| **OBSERVE** | Read the validated, same-origin rolling 24-hour snapshot on a 2:1 equirectangular world view; inspect magnitude, depth class, event recency and gridded counts. | Playback changes the time cutoff within the already loaded snapshot. It does not retrieve history. |
| **ANALYZE** | Load the snapshot or request a USGS FDSN historical catalogue; set a geographical ROI, view filters, A/B UTC windows, point/grid mode, and export evidence. | The historical query has an explicit date range and server-side minimum magnitude. It is not a live feed. |

The historical query accepts 1–31 UTC calendar dates per request and rejects a result above the 10,000-event limit rather than silently truncating it. A query minimum magnitude is distinct from a view filter. Both analysis periods are half-open `[start, end)`, must not overlap, and operate only on the already loaded catalogue.

A/B summaries report counts, maximum magnitude, median depth and observed records per hour. The twelve-bin time chart uses **relative elapsed time**, while magnitude and depth charts describe their filtered event sets. Analyze supports geographic count grids and approximate spherical-area-normalized counts. Angular cells do not have constant physical area.

## Event model

The primary analytical object is a georeferenced seismic-event catalogue. Each feature includes geographic position, origin time, magnitude, depth, and provider metadata from the [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/).

The deployed dataset is derived from the [USGS real-time GeoJSON summary feeds](https://earthquake.usgs.gov/earthquakes/feed/) and uses the rolling past-24-hour event set. The user-selected time window defines the active subset used by the map and grid views.

## Spatial representations

| Representation | Spatial unit | Analytical role |
| --- | --- | --- |
| Event symbols | Individual earthquake epicentres | Event position, magnitude, depth, and origin time |
| Regular count grid | Fixed spatial cells | Event frequency aggregated over areal support |
| Reference land geometry | [Natural Earth 1:110m](https://www.naturalearthdata.com/downloads/) | Global cartographic reference |

Grid resolution controls the areal support used for event counts. Temporal window and magnitude threshold control the active event set.

## Data provenance and processing

| Component | Specification |
| --- | --- |
| Catalogue provider | [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/) |
| Feed format | [USGS GeoJSON Summary Format](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) |
| Temporal envelope | Rolling past 24 hours |
| Active temporal support | User-selected interval within the deployed snapshot |
| Point attributes | Longitude, latitude, depth, origin time, magnitude, and event metadata |
| Areal aggregation | Regular-grid event count |
| Snapshot provenance | UTC fetch time plus SHA-256 digest recorded at deployment |

The Pages workflow refreshes the USGS `FeatureCollection`, validates its structure, records the fetch time, computes a SHA-256 digest, and publishes the snapshot with the instrument.

## Analysis variables

The main analytical controls are:

- temporal window;
- magnitude threshold;
- event-symbol or count-grid representation;
- grid resolution;
- event-level inspection.

## Data integrity and scientific limits

- Keep the selected-event GeoJSON or CSV, analysis chart/grid CSVs, and **MANIFEST JSON** together. An export URL cannot guarantee that USGS will retain unchanged event solutions.
- The `all_day` source is a rolling snapshot. The historical FDSN service is a separate provider query. GeoGeek's same-origin snapshot can be stale.
- Magnitude, location, depth, review status and catalogue completeness can change. Counts, observed records/hour, and mapped densities are **not** seismic-hazard predictions or completeness-adjusted occurrence rates.
- The map uses longitude/latitude and therefore distorts physical area by latitude; the area-normalized grid is an approximation, not a uniform-area projection.

## Implementation map

| Responsibility | Main-site source |
| --- | --- |
| Shared production mount and snapshot handling | [`site/core/observatory-entry.js`](https://github.com/GeoGeekLab/GeoGeekLab.github.io/blob/main/site/core/observatory-entry.js), [`site/core/data-supply.js`](https://github.com/GeoGeekLab/GeoGeekLab.github.io/blob/main/site/core/data-supply.js) |
| Base seismic instrument | [`site/pulse-observation-lab-v4.js`](https://github.com/GeoGeekLab/GeoGeekLab.github.io/blob/main/site/pulse-observation-lab-v4.js) |
| OBSERVE refinement | [`site/pulse/pulse-round6.js`](https://github.com/GeoGeekLab/GeoGeekLab.github.io/blob/main/site/pulse/pulse-round6.js) |
| ANALYZE source, ROI, filters, provenance and export | [`site/pulse/pulse-workflow-v1.js`](https://github.com/GeoGeekLab/GeoGeekLab.github.io/blob/main/site/pulse/pulse-workflow-v1.js) |
| A/B comparison, grid and chart exports | [`site/pulse/pulse-workflow-v2.js`](https://github.com/GeoGeekLab/GeoGeekLab.github.io/blob/main/site/pulse/pulse-workflow-v2.js) |
| Workflow contract | [`site/pulse/WORKFLOW.md`](https://github.com/GeoGeekLab/GeoGeekLab.github.io/blob/main/site/pulse/WORKFLOW.md) |

The standalone entrypoint now exposes OBSERVE / ANALYZE tabs and loads these optional Lab workflow layers. The query parameter `release=20261011v107watercache1` belongs to the Lab HTML/cache release, not an immutable runtime source pin.

## Instrument access

**Live instrument:** https://geogeeklab.github.io/earth-pulse/

Source runtime: [`GeoGeekLab/GeoGeekLab.github.io`](https://github.com/GeoGeekLab/GeoGeekLab.github.io)  
Pinned revision: [`SOURCE.json`](./SOURCE.json)  
Production contract: [`PRODUCTION.md`](./PRODUCTION.md)

*GeoGeek note — time window and spatial support define the pattern you see.*
