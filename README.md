# leaflet-map
Leaflet map template to load local and remote files (GeoJSON, tileLayer, tileLayer.WMS) directly into legend toggle (L.control.layers) with simple jQuery call

## Demo
 - with Leaflet-0.7.3 http://jackdougherty.github.io/leaflet-map/

 - with Leaflet-1.0.0-b1 beta http://jackdougherty.github.io/leaflet-map/leaflet-beta.html

 ## Why this template?

 This template illustrates simple and flexible methods for non-experts to create maps that require loading GeoJSON files and tileLayers from local directories and remote servers. The template features Connecticut, where I design maps with students and community partners at Trinity College, Hartford CT, and also with collaborators at MAGIC, the Map and Geographic Information Center at UConn Libraries, on projects such as http://OnTheLine.trincoll.edu and http://DataVizBook.org.

 Learn more about Leaflet from these tutorials:
 - an excellent introduction by Maptime Boston: http://maptimeboston.github.io/leaflet-intro/
 - Leaflet Tutorials: http://leafletjs.com/examples.html

 This template addresses my greatest challenge as novice coder: how to upload my own spatial data into Leaflet in the popular GeoJSON format, without getting lost in confusing jQuery functions. Leaflet's own intro tutorial skips over this important step. Other excellent tutorials show how to load GeoJSON data from inside a jQuery function, but in a way that does not easily allow you to place those layers in a toggle legend outside of that function. Finally, I discovered a simple, flexible solution posted by [@iH8 on StackOverflow]( http://stackoverflow.com/questions/28534705/how-to-add-two-geojson-feature-collections-in-to-two-layer-groups):
 ```
 // Create the layercontrol and add it to the map
var controlLayers = L.control.layers().addTo(map);

// Loading a GeoJSON file (using jQuery's $.getJSON)
$.getJSON('/my-folder/my-file.json', function (data) {

// Use the data to create a GeoJSON layer and add it to the map
var geojsonLayer = L.geoJson(data).addTo(map);

// Add the geojson layer to the layercontrol
  controlLayers.addOverlay(geojsonLayer, 'My GeoJSON layer title');

});
```
See also working example by @iH8 on Plunker: http://plnkr.co/edit/tFVrrq?p=preview

Using this method, controlLayers is declared as a global variable near the top. When map layers are loaded in subsequent jQuery functions, they can be added directly to the map and/or to the legend toggle control. Overall, this approach seems more straightforward than other tutorials, yet I had not seen it described elsewhere. This template expands on the concept, inserts some sample layers and styling, and includes code comments for novices like me. Feedback and pull requests are welcome.

## To Do
- MAGIC: please check default projection and other settings in tileLayer.WMS
- MAGIC: please confirm preferred tileLayer.WMS for present-day satellite view
- create JSON layer from Flickr code
- see additional TO DO notes in script.js code comments
- create Omnivore example to display KML, etc.; and add plugin to template (or MapBox with token)
- create MapBox tileLayer example; requires token
- create MapBox featureLayer example; requires token
- add this local geoJson feed as supplement to USGS earthquakes; currently broken
```
// load remote geoJson: ctFastrak-Hartford.gov (or create JSON layer directly from site)
// feed NOT currently working: problem reported 23 Aug 2015
// http://gisdata.hartford.gov/datasets/453fb4c1dff74efdbdb46fadfd257e28_0
// var ctFastrak = L.geoJson.ajax("http://gisdata.hartford.gov/datasets/453fb4c1dff74efdbdb46fadfd257e28_0.geojson", {
//   onEachFeature: function(feature, layer) {
//     var popupText = "Vehicle ID: " + feature.properties.vehicle_id;
//       layer.bindPopup(popupText); }
// });
```
- Decide whether to add leaflet-ajax example to load geoJson layers from external sources across server domains (https://github.com/calvinmetcalf/leaflet-ajax), with further explanation (http://lyzidiamond.com/posts/external-geojson-and-leaflet-the-other-way/). Still relevant? If so, perhaps recode this example to match; add plugin and put this in header:
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
