# Earth Pulse

**Seismicity · spatiotemporal point process · temporal window · lattice aggregation**

*EARTH PULSE* is a spatiotemporal GIS instrument for exploring recent global seismicity as a georeferenced point process. It combines a rolling earthquake catalogue with temporal filtering, magnitude filtering, event-symbol mapping, and regular-lattice aggregation so that the same seismic sequence can be examined at both event and regional scales.

<p align="center">
  <a href="https://geogeeklab.github.io/earth-pulse/">
    <img src="https://geogeeklab.github.io/earth-pulse/assets/instrument.png" alt="Earth Pulse instrument" width="720">
  </a>
</p>

## Event model

The primary analytical object is a georeferenced seismic-event catalogue. Each feature carries geographic position, origin time, magnitude, depth, and provider metadata from the [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/). The deployed snapshot is derived from the [USGS real-time GeoJSON summary feeds](https://earthquake.usgs.gov/earthquakes/feed/) and uses the rolling past-24-hour event set as its temporal envelope.

Within *EARTH PULSE*, the active observation window can be shortened inside that 24-hour envelope. This changes the support of the point process and therefore the visible clustering, regional event density, and magnitude distribution. Time is treated as part of the spatial query rather than as a passive timestamp.

## Spatial representations

| Representation | Spatial unit | Analytical role |
| --- | --- | --- |
| Event symbols | Individual earthquake epicentres | Preserve event-level position, magnitude, and time |
| Regular count grid | Fixed spatial cells | Aggregate event frequency over areal support |
| Reference land geometry | [Natural Earth 1:110m](https://www.naturalearthdata.com/downloads/) | Provide generalized global cartographic context |

The event view supports point-pattern inspection. The count grid converts the same feature set into an areal frequency surface by summing events within regular cells. Grid resolution therefore changes the analytical support and the apparent spatial concentration of seismicity, linking the visualization directly to scale effects and the modifiable areal unit problem (MAUP).

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

The Pages workflow refreshes and validates the USGS `FeatureCollection` before publication. This makes the deployed map reproducible at the snapshot level: the visualization, fetch time, and content digest refer to the same event collection.

## Seismological interpretation

*EARTH PULSE* emphasizes the spatial organization of recent seismicity rather than a single summary statistic. Event-level inspection preserves individual hypocentral metadata, while grid aggregation exposes regional frequency patterns. Comparing these representations makes scale, temporal support, and aggregation choice explicit components of the geospatial interpretation.

## Instrument access

**Live instrument:** https://geogeeklab.github.io/earth-pulse/

*EARTH PULSE* is a public entrypoint to the production visualization runtime maintained in [`GeoGeekLab/GeoGeekLab.github.io`](https://github.com/GeoGeekLab/GeoGeekLab.github.io). [`SOURCE.json`](./SOURCE.json) records the pinned upstream revision, and [`PRODUCTION.md`](./PRODUCTION.md) documents the runtime, snapshot, and aggregation contract.

*GeoGeek note — time window and spatial support define the pattern you see.*
