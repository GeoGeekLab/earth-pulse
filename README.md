# Earth Pulse

**Seismicity · temporal windows · geographic ROI · spatial aggregation**

*Earth Pulse* is a GIS workspace for observing and analyzing global earthquakes. It combines time-filtered seismic catalogs, an interactive geographic field, event inspection, spatial selection, and comparative statistics.

<p align="center">
  <a href="https://geogeeklab.github.io/earth-pulse/">
    <img src="https://geogeeklab.github.io/earth-pulse/assets/instrument.png?v=20261012ready1" alt="Earth Pulse: global earthquake map with magnitude, depth, time, and filtering controls" width="760">
  </a>
</p>

## Observe

The **OBSERVE** workspace displays the rolling 24-hour USGS earthquake catalog on an equirectangular world map.

- **Event symbols:** geographic location, magnitude, depth class, and recency.
- **Temporal playback:** explore event origins within the loaded 24-hour window.
- **Event filters:** select minimum magnitude, depth, and review status.
- **Spatial aggregation:** examine event counts in a regular geographic grid.
- **Inspection:** read individual earthquake records, origin times, and source metadata.
- **Provenance:** view USGS feed-generation time and GeoGeek snapshot retrieval time.

## Analyze

The **ANALYZE** workspace supports geographic sampling, comparative event analysis, and data export.

<p align="center">
  <a href="https://geogeeklab.github.io/earth-pulse/">
    <img src="https://geogeeklab.github.io/earth-pulse/assets/analysis.png?v=20261012ready1" alt="Earth Pulse Analyze: geographic ROI, A/B time-window comparison, event statistics, and export controls" width="760">
  </a>
</p>

- **Data source:** load the 24-hour catalog or query the USGS FDSN historical event service across 1–31 UTC dates.
- **Geographic ROI:** draw a region or enter west, east, south, and north coordinates.
- **Record filters:** apply magnitude, depth-class, and review-status selections.
- **A/B comparison:** compare two disjoint UTC windows using event totals, maximum magnitude, median depth, and observed records per hour.
- **Distributions:** inspect time, magnitude, and depth histograms.
- **Map modes:** switch between event points and geographic count grids, including area-normalized counts.
- **Event finder:** search the selected records by place or event identifier.
- **Exports:** GeoJSON, CSV, analysis-chart CSV, A/B grid CSV, and JSON manifest.

## Seismic data model

| Component | Specification |
| --- | --- |
| Provider | [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/) |
| Rolling catalog | [USGS GeoJSON summary feed](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) · past 24 hours |
| Historical catalog | [USGS FDSN Event Web Service](https://earthquake.usgs.gov/fdsnws/event/1/) |
| Event attributes | Longitude, latitude, origin time, magnitude, depth, type, status, and source ID |
| Map | Equirectangular global longitude/latitude |
| Reference geometry | [Natural Earth](https://www.naturalearthdata.com/downloads/) · 1:110m |
| Comparison support | Disjoint half-open UTC intervals `[start, end)` |
| Spatial support | Geographic grid counts and approximate spherical-area density |

Temporal bounds, regional extent, and catalog selection define each analysis. The manifest captures the source and selection parameters used for exported records.

## Source and access

The [GeoGeek Observatory source](https://github.com/GeoGeekLab/GeoGeekLab.github.io) contains the [seismic instrument](https://github.com/GeoGeekLab/GeoGeekLab.github.io/blob/main/site/pulse-observation-lab-v4.js) and [analysis workflow](https://github.com/GeoGeekLab/GeoGeekLab.github.io/tree/main/site/pulse).

**Instrument:** https://geogeeklab.github.io/earth-pulse/  
**Lab:** https://geogeeklab.github.io/lab.html  
**Instrument record:** https://geogeeklab.github.io/records/lab-l10.html

*GeoGeek note — time window and spatial support define the pattern you see.*
