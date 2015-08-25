# leaflet-map
Leaflet map template that loads local and remote files (GeoJSON, tileLayer, tileLayer.WMS ) directly into L.control.layers to toggle on/off

## demo
 - http://jackdougherty.github.io/leaflet/

## To Do
- build leaflet-map-dual
- build leaflet-map-story
- build leaflet-map-timeslider
- MAGIC: please check default projection and other settings in tileLayer.WMS
- MAGIC: please confirm preferred tileLayer.WMS for present-day satellite view
- see additional TO DO notes in script.js code comments
- create Omnivore example to display KML, etc.; and add plugin to template
- create MapBox tileLayer example; requires token
- add this local geoJson feed as supplement to USGS earthquakes; currently broken
```
// load remote geoJson: ctFastrak-Hartford.gov
// feed NOT currently working: problem reported 23 Aug 2015
// http://gisdata.hartford.gov/datasets/453fb4c1dff74efdbdb46fadfd257e28_0
// var ctFastrak = L.geoJson.ajax("http://gisdata.hartford.gov/datasets/453fb4c1dff74efdbdb46fadfd257e28_0.geojson", {
//   onEachFeature: function(feature, layer) {
//     var popupText = "Vehicle ID: " + feature.properties.vehicle_id;
//       layer.bindPopup(popupText); }
// });
```
- Decide whether to add leaflet-ajax example; can rewrite this one to match; add plugin and put this in header:
<script type="text/javascript" src="dist/leaflet.ajax.min.js"></script>
```
// load remote geoJson: USGS earthquakes
// http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
var earthquakes = L.geoJson.ajax("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson", {
  onEachFeature: function(feature, layer) {
   var popupText = "Magnitude: " + feature.properties.mag
      + "<br>Location: " + feature.properties.place
      + "<br><a href='" + feature.properties.url + "'>More info</a>";
   layer.bindPopup(popupText);
  }
});
```

## Notes on loading geoJson layers in Leaflet

- Great overview to loading different GeoJson layers into Leaflet http://maptimeboston.github.io/leaflet-intro/
- the best strategy I have seen to uploading GeoJson layers directly into a Leaflet L.control.layer, when you wish to toggle on/off (or not display right away) http://stackoverflow.com/questions/28534705/how-to-add-two-geojson-feature-collections-in-to-two-layer-groups
- To load geoJson layers from external sources across server domains (https://github.com/calvinmetcalf/leaflet-ajax), with further explanation (http://lyzidiamond.com/posts/external-geojson-and-leaflet-the-other-way/)
