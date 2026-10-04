# Earth Pulse

**Seismicity · spatiotemporal point process · temporal window · lattice aggregation**

*EARTH PULSE* is a spatiotemporal GIS instrument for exploring recent global seismicity as a georeferenced point process. It combines a rolling earthquake catalogue with temporal filtering, magnitude filtering, event-symbol mapping, and regular-lattice aggregation.

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
- **Inspect snapshot provenance.** Read the deployed USGS snapshot, UTC retrieval time, and content digest.

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

## Instrument access

**Live instrument:** https://geogeeklab.github.io/earth-pulse/

Source runtime: [`GeoGeekLab/GeoGeekLab.github.io`](https://github.com/GeoGeekLab/GeoGeekLab.github.io)  
Pinned revision: [`SOURCE.json`](./SOURCE.json)  
Production contract: [`PRODUCTION.md`](./PRODUCTION.md)

*GeoGeek note — time window and spatial support define the pattern you see.*
