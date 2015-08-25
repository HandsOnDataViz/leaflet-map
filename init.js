// Template by http://github.com/jackdougherty/leaflet-map/
// See Leaflet tutorial links in README.md

// set up the map center and zoom level
var map = L.map('map', {
  center: [41.5, -72.7], // [41.5, -72.7] for Connecticut; [41.76, -72.67] for Hartford county or city
  zoom: 9, // zoom 9 for Connecticut; 10 for Hartford county, 12 for Hartford city
  zoomControl: false // add later to reposition
});

// optional : customize link to view source code; add your own GitHub repository
map.attributionControl
.setPrefix('View <a href="http://github.com/jackdougherty/leaflet-map">code on GitHub</a>, created with <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');

// optional: add legend to toggle any baselayers and/or overlays
// global variable with (null, null) allows indiv layers to be added inside functions below
var controlLayers = L.control.layers( null, null, {
  position: "bottomright", // suggested: bottomright for CT (in Long Island Sound); topleft for Hartford region
  collapsed: false // false = open by default
}).addTo(map);

// optional: reposition zoom control other than default topleft
L.control.zoom({position: "topright"}).addTo(map);


/* BASELAYERS */
// use common baselayers below, delete, or add more with plain JavaScript from http://leaflet-extras.github.io/leaflet-providers/preview/
// .addTo(map); -- suffix displays baselayer by default
// controlLayers.addBaseLayer (variableName, 'label'); -- adds baselayer and label to legend; omit if only one baselayer with no toggle desired
var lightAll = new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo(map); //this displays layer by default
controlLayers.addBaseLayer(lightAll, 'CartoDB LightAll');

var lightNoLabels = new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});
controlLayers.addBaseLayer(lightNoLabels, 'CartoDB Light no labels');

var darkAll = new L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});
controlLayers.addBaseLayer(darkAll, 'CartoDB DarkAll');

var darkNoLabels = new L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});
controlLayers.addBaseLayer(darkNoLabels, 'CartoDB Dark no labels');

// Esri satellite map from http://leaflet-extras.github.io/leaflet-providers/preview/
var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
   attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
controlLayers.addBaseLayer(Esri_WorldImagery, 'Esri World Imagery');

// MapQuest satellite map from http://leaflet-extras.github.io/leaflet-providers/preview/
var MapQuestOpen_Aerial = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
  type: 'sat',
  ext: 'jpg',
  attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency',
  subdomains: '1234'
});
controlLayers.addBaseLayer(MapQuestOpen_Aerial, 'MapQuest Open Aerial');

// tileLayer.WMS baselayer - see http://leafletjs.com/reference.html#tilelayer-wms
// UConn MAGIC WMS settings - see http://geoserver.lib.uconn.edu:8080/geoserver/web/?wicket:bookmarkablePage=:org.geoserver.web.demo.MapPreviewPage
var aerial1934 = new L.tileLayer.wms("http://geoserver.lib.uconn.edu:8080/geoserver/MAGIC/wms?", {
  layers: 'MAGIC:1934 Connecticut Aerial Photography',
  format: 'image/png',
  version: '1.1.0',
  transparent: true,
  attribution: '1934 <a href="http://magic.library.uconn.edu">MAGIC UConn</a> and <a href="http://cslib.org">CSL</a>'
});
controlLayers.addBaseLayer(aerial1934, 'CT Aerial 1934');


/* OVERLAYS */
// follow different models to load GeoJson layers, erase, or create your own

// load geojson polygons from local directory, using jQuery function (symbolized by $)
// modify style (for appearance) and onEachFeature (for popup windows or hover info)
// insert '.addTo(map)' to display layer by default
// insert controlLayers.addOverlay(geoJsonLayer, 'InsertYourTitle') to add to legend
$.getJSON("src/simplifiedTownBorders.geojson", function (data) {   // insert pathname to your local directory file
  var geoJsonLayer = L.geoJson(data, {
    style: function (feature) {
      return {
        'color': 'red',
        'weight': 2,
        'fillColor': '#fff',
        'fillOpacity': 0.2
      }
    },
    onEachFeature: function( feature, layer) {
      layer.bindPopup(feature.properties.Town) // change 'Town' to match your geojson property labels
    }
  }).addTo(map);  // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'Connecticut towns');  // insert your 'Title' to add to legend
});

// load geojson polygon from local directory, with more complex styling and popup windows
// *TO DO* rebuild file for pop density, and add legend
$.getJSON("src/simplifiedTownBorders.geojson", function (data) {   // insert pathname to your local directory file
  var geoJsonLayer = L.geoJson(data, {
    style: function (feature) {
      var fillColor,
        population = feature.properties.Pop2010;
      if (population > 100000) fillColor = "#006837";
      else if (population > 50000) fillColor ="#31a354";
      else if (population > 15000) fillColor ="#78c679";
      else if (population > 5000) fillColor ="#c2e699";
      else if (population > 0) fillColor ="#ffffcc";
      else fillColor = "#f7f7f7"; // no data
      return {
        'color': 'red',
        'weight': 2,
        'fillColor': fillColor, // sorts by method above
        'fillOpacity': 0.8
      }
    },
    onEachFeature: function( feature, layer) {
      var popupText = "<b>" + feature.properties.Town + "</b>"   // replace labels with those from your own geojson
         + "<br>Population 2010: " + "<br>" + feature.properties.Pop2010;
      layer.bindPopup(popupText);
    }
  });  // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'Connecticut Population 2010');  // insert your 'Title' to add to legend
});

// load geoJson markers from remote API feed: USGS earthquakes
// http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
var geoJsonURL = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
$.getJSON(geoJsonURL, function (data) {
  var geoJsonLayer = L.geoJson(data, {
    onEachFeature: function( feature, layer) {
      var popupText = "Magnitude: " + feature.properties.mag
         + "<br>Location: " + feature.properties.place
         + "<br><a href='" + feature.properties.url + "'>More info</a>";
      layer.bindPopup(popupText);
    }
  });  // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'USGS Earthquakes (zoom out)');  // insert your 'Title' to add to legend
});

// display state capital star, on top of other layers since it is loaded last
// *TO DO* improve styling
var star = L.icon({
  iconUrl: 'src/star-18.png',
  iconRetinaUrl: 'src/star-18@2x.png',
  iconSize: [18, 18]
  // iconAnchor: [22, 94],
  // popupAnchor: [-3, -76],
  // shadowUrl: 'my-icon-shadow.png',
  // shadowRetinaUrl: 'my-icon-shadow@2x.png',
  // shadowSize: [68, 95],
  // shadowAnchor: [22, 94]
});
L.marker([41.764, -72.682], {icon: star}).addTo(map);
